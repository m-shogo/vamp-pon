#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

BUNDLE_ID="${VAMPPON_IOS_BUNDLE_ID:-com.mshogo.vamppon.u1}"
DEVICE_ID="${VAMPPON_PHYSICAL_IPHONE_DEVICE:-}"
DEVICE_MODEL_OVERRIDE="${VAMPPON_PHYSICAL_IPHONE_MODEL:-}"
OS_VERSION_OVERRIDE="${VAMPPON_PHYSICAL_IPHONE_OS_VERSION:-}"
V3_JSON="docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json"
CAPTURE_JSON="docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json"
DEVICE_JSON="docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json"
ARTIFACT_DIR="docs/design-targets/generated/top-living-night-v3/device-performance-evidence"
RAW_NAME="top-living-night-physical-iphone-performance.json"
BACKGROUND_AFTER_SECONDS="${VAMPPON_TOP_PERF_BACKGROUND_AFTER_SECONDS:-90}"
BACKGROUND_HOLD_SECONDS="${VAMPPON_TOP_PERF_BACKGROUND_HOLD_SECONDS:-5}"
ARTIFACT_TIMEOUT_SECONDS="${VAMPPON_TOP_PERF_TIMEOUT_SECONDS:-480}"

if [[ -z "$DEVICE_ID" ]]; then
  echo "VAMPPON_PHYSICAL_IPHONE_DEVICE is required; use the exact connected iPhone identifier/name accepted by devicectl." >&2
  exit 1
fi

for required in "$V3_JSON" "$CAPTURE_JSON" "$DEVICE_JSON" \
  scripts/unity/register-top-living-night-device-performance.ts \
  scripts/quality/check-top-living-night-device-performance-policy.ts \
  scripts/quality/check-top-living-night-device-performance-artifact.ts; do
  if [[ ! -e "$required" ]]; then
    echo "missing required file: $required" >&2
    exit 1
  fi
done

for command_name in xcrun node python3; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "$command_name is required for physical-iPhone performance evidence" >&2
    exit 1
  fi
done

PROVENANCE_LINE="$(node --input-type=module <<'NODE'
import fs from 'node:fs';
const v3 = JSON.parse(fs.readFileSync('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json', 'utf8'));
const capture = JSON.parse(fs.readFileSync('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json', 'utf8'));
const fail = message => { console.error(message); process.exit(1); };
if (!v3.executed || v3.result !== 'PASSED') fail('physical-iPhone performance evidence requires PASSED current V3 Unity evidence');
if (!capture.executed || capture.result !== 'PASSED' || capture.captureCount !== 15) fail('physical-iPhone performance evidence requires PASSED current 15-frame capture evidence');
if (v3.verifiedCommit !== capture.sourceCommit) fail('V3/capture source commit mismatch');
if (v3.sourceCompositeKind !== capture.topCompositeKind || v3.sourceCompositePath !== capture.topCompositePath || v3.sourceCompositeSha256 !== capture.topCompositeSha256) fail('V3/capture composite provenance mismatch');
console.log([
  v3.verifiedCommit,
  v3.sourceCompositeKind,
  v3.sourceCompositePath,
  v3.sourceCompositeSha256,
].join('\t'));
NODE
)"
IFS=$'\t' read -r SOURCE_COMMIT COMPOSITE_KIND COMPOSITE_PATH COMPOSITE_SHA256 <<< "$PROVENANCE_LINE"

if [[ ! "$SOURCE_COMMIT" =~ ^[0-9a-f]{40}$ ]]; then
  echo "invalid V3 source commit: $SOURCE_COMMIT" >&2
  exit 1
fi
if [[ ! "$COMPOSITE_SHA256" =~ ^[0-9a-f]{64}$ ]]; then
  echo "invalid V3 composite SHA-256" >&2
  exit 1
fi

UNITY_VERSION="$(awk -F': ' '/^m_EditorVersion:/ {print $2; exit}' unity/VampPonUnity/ProjectSettings/ProjectVersion.txt)"
if [[ -z "$UNITY_VERSION" ]]; then
  echo "could not resolve Unity version" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT
DETAILS_JSON="$TMP_DIR/device-details.json"

# Confirm CoreDevice can actually talk to the selected phone before starting a
# five-minute measurement. The command also gives us machine-readable metadata.
xcrun devicectl device info details \
  --device "$DEVICE_ID" \
  --json-output "$DETAILS_JSON" >/dev/null

META_LINE="$(python3 - "$DETAILS_JSON" "$DEVICE_MODEL_OVERRIDE" "$OS_VERSION_OVERRIDE" <<'PY'
import json,re,sys
path, model_override, os_override = sys.argv[1:]
with open(path, encoding='utf-8') as fh:
    payload=json.load(fh)

def pairs(value):
    if isinstance(value, dict):
        for key, child in value.items():
            yield str(key), child
            yield from pairs(child)
    elif isinstance(value, list):
        for child in value:
            yield from pairs(child)

items=list(pairs(payload))

def first(keys, predicate=lambda value: True):
    wanted={key.lower() for key in keys}
    for key,value in items:
        if key.lower() in wanted and isinstance(value,(str,int,float)):
            text=str(value).strip()
            if text and predicate(text):
                return text
    return ''

model=model_override.strip() or first([
    'productType','marketingName','modelName','deviceType','hardwareModel'
], lambda value: 'iphone' in value.lower())
if not model:
    model=first(['productType','marketingName','modelName','deviceType','hardwareModel'])

os_version=os_override.strip() or first([
    'operatingSystemVersion','osVersion','osVersionNumber','productVersion'
], lambda value: bool(re.match(r'^\d+(?:\.\d+){1,3}', value)))

if not model:
    raise SystemExit('could not resolve physical iPhone model from devicectl details; set VAMPPON_PHYSICAL_IPHONE_MODEL')
if not os_version:
    raise SystemExit('could not resolve physical iPhone OS version from devicectl details; set VAMPPON_PHYSICAL_IPHONE_OS_VERSION')
print(f'{model}\t{os_version}')
PY
)"
IFS=$'\t' read -r DEVICE_MODEL OS_VERSION <<< "$META_LINE"

mkdir -p "$ARTIFACT_DIR"
DEST_ARTIFACT="$ARTIFACT_DIR/physical-iphone-${SOURCE_COMMIT}.json"
REMOTE_ARTIFACT="Documents/$RAW_NAME"
PULLED_ARTIFACT="$TMP_DIR/pulled.json"
SENTINEL_ARTIFACT="$TMP_DIR/pending.json"
rm -f "$DEST_ARTIFACT" "$PULLED_ARTIFACT"

# Replace any old same-name artifact before launch. Polling only accepts the
# fully shaped current-source artifact, so stale device files cannot be reused.
cat > "$SENTINEL_ARTIFACT" <<JSON
{"pending":true,"sourceCommit":"$SOURCE_COMMIT"}
JSON
xcrun devicectl device copy to \
  --device "$DEVICE_ID" \
  --domain-type appDataContainer \
  --domain-identifier "$BUNDLE_ID" \
  --source "$SENTINEL_ARTIFACT" \
  --destination "$REMOTE_ARTIFACT" >/dev/null

xcrun devicectl device process launch \
  --device "$DEVICE_ID" \
  "$BUNDLE_ID" -- \
  --vamp-pon-top-physical-perf \
  "--vamp-pon-top-perf-source-commit=$SOURCE_COMMIT" \
  "--vamp-pon-top-perf-composite-kind=$COMPOSITE_KIND" \
  "--vamp-pon-top-perf-composite-path=$COMPOSITE_PATH" \
  "--vamp-pon-top-perf-composite-sha256=$COMPOSITE_SHA256" >/dev/null

# Exercise a real app suspension/foreground path on the phone. Do not ignore
# failures: recovery is part of the approval policy, not optional decoration.
(
  sleep "$BACKGROUND_AFTER_SECONDS"
  xcrun devicectl device process launch \
    --device "$DEVICE_ID" com.apple.Preferences >/dev/null
  sleep "$BACKGROUND_HOLD_SECONDS"
  xcrun devicectl device process launch \
    --device "$DEVICE_ID" "$BUNDLE_ID" >/dev/null
) &
BACKGROUND_HELPER_PID=$!

started_at="$(date +%s)"
while true; do
  now="$(date +%s)"
  if (( now - started_at > ARTIFACT_TIMEOUT_SECONDS )); then
    kill "$BACKGROUND_HELPER_PID" >/dev/null 2>&1 || true
    echo "timed out waiting for TOP physical-iPhone performance artifact" >&2
    exit 1
  fi

  rm -f "$PULLED_ARTIFACT"
  if xcrun devicectl device copy from \
      --device "$DEVICE_ID" \
      --domain-type appDataContainer \
      --domain-identifier "$BUNDLE_ID" \
      --source "$REMOTE_ARTIFACT" \
      --destination "$PULLED_ARTIFACT" >/dev/null 2>&1; then
    if node --input-type=module - "$PULLED_ARTIFACT" "$SOURCE_COMMIT" "$COMPOSITE_SHA256" <<'NODE'
import fs from 'node:fs';
const [path, commit, sha] = process.argv.slice(2);
try {
  const artifact=JSON.parse(fs.readFileSync(path,'utf8'));
  const ok = artifact.schemaVersion === 1 &&
    artifact.target === 'physical-iphone' &&
    artifact.sourceCommit === commit &&
    artifact.topCompositeSha256 === sha &&
    artifact.measurementMethod === 'unity-runtime-sampler' &&
    artifact.durationSeconds >= 300 &&
    Array.isArray(artifact.samples) &&
    artifact.samples.length >= 61 &&
    artifact.samples.every(sample => ['nominal','fair','serious','critical'].includes(sample.thermalState));
  process.exit(ok ? 0 : 1);
} catch {
  process.exit(1);
}
NODE
    then
      break
    fi
  fi
  sleep 3
done
wait "$BACKGROUND_HELPER_PID"

mv "$PULLED_ARTIFACT" "$DEST_ARTIFACT"

node --experimental-strip-types scripts/unity/register-top-living-night-device-performance.ts \
  --target=physical-iphone \
  "--artifact=$DEST_ARTIFACT" \
  "--device-model=$DEVICE_MODEL" \
  "--os-version=$OS_VERSION" \
  "--unity-version=$UNITY_VERSION"

node --experimental-strip-types scripts/quality/check-top-living-night-device-performance-artifact.ts
node --experimental-strip-types scripts/quality/check-top-living-night-device-performance-policy.ts
node --experimental-strip-types scripts/quality/check-top-living-night-device-evidence.ts

echo "TOP physical-iPhone performance evidence recorded"
echo "source commit: $SOURCE_COMMIT"
echo "device: $DEVICE_MODEL / iOS $OS_VERSION"
echo "artifact: $DEST_ARTIFACT"
echo "device evidence: $DEVICE_JSON"
echo "NOTE: evidence recording never promotes runtimeApproved/final approval by itself."
