#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

BUNDLE_ID="${VAMPPON_IOS_BUNDLE_ID:-com.mshogo.vamppon.u1}"
UDID="${VAMPPON_SIMULATOR_UDID:-booted}"
V3_JSON="docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json"
CAPTURE_JSON="docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json"
DEVICE_JSON="docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json"
ARTIFACT_DIR="docs/design-targets/generated/top-living-night-v3/device-performance-evidence"
RAW_NAME="top-living-night-simulator-performance.json"
BACKGROUND_AFTER_SECONDS="${VAMPPON_TOP_PERF_BACKGROUND_AFTER_SECONDS:-90}"
BACKGROUND_HOLD_SECONDS="${VAMPPON_TOP_PERF_BACKGROUND_HOLD_SECONDS:-5}"
ARTIFACT_TIMEOUT_SECONDS="${VAMPPON_TOP_PERF_TIMEOUT_SECONDS:-420}"

for required in "$V3_JSON" "$CAPTURE_JSON" "$DEVICE_JSON" \
  scripts/unity/register-top-living-night-device-performance.ts \
  scripts/quality/check-top-living-night-device-performance-policy.ts \
  scripts/quality/check-top-living-night-device-performance-artifact.ts; do
  if [[ ! -e "$required" ]]; then
    echo "missing required file: $required" >&2
    exit 1
  fi
done

if ! command -v xcrun >/dev/null 2>&1; then
  echo "xcrun is required for Simulator performance evidence" >&2
  exit 1
fi
if ! command -v node >/dev/null 2>&1; then
  echo "node is required for Simulator performance evidence registration" >&2
  exit 1
fi

# Resolve current runtime provenance only from executed V3 + capture evidence.
readarray -t PROVENANCE < <(node --input-type=module <<'NODE'
import fs from 'node:fs';
const v3 = JSON.parse(fs.readFileSync('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json', 'utf8'));
const capture = JSON.parse(fs.readFileSync('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json', 'utf8'));
const fail = message => { console.error(message); process.exit(1); };
if (!v3.executed || v3.result !== 'PASSED') fail('Simulator performance evidence requires PASSED current V3 Unity evidence');
if (!capture.executed || capture.result !== 'PASSED' || capture.captureCount !== 15) fail('Simulator performance evidence requires PASSED current 15-frame capture evidence');
if (v3.verifiedCommit !== capture.sourceCommit) fail('V3/capture source commit mismatch');
if (v3.sourceCompositeKind !== capture.topCompositeKind || v3.sourceCompositePath !== capture.topCompositePath || v3.sourceCompositeSha256 !== capture.topCompositeSha256) fail('V3/capture composite provenance mismatch');
console.log(v3.verifiedCommit);
console.log(v3.sourceCompositeKind);
console.log(v3.sourceCompositePath);
console.log(v3.sourceCompositeSha256);
NODE
)

SOURCE_COMMIT="${PROVENANCE[0]}"
COMPOSITE_KIND="${PROVENANCE[1]}"
COMPOSITE_PATH="${PROVENANCE[2]}"
COMPOSITE_SHA256="${PROVENANCE[3]}"

if [[ ! "$SOURCE_COMMIT" =~ ^[0-9a-f]{40}$ ]]; then
  echo "invalid V3 source commit: $SOURCE_COMMIT" >&2
  exit 1
fi
if [[ ! "$COMPOSITE_SHA256" =~ ^[0-9a-f]{64}$ ]]; then
  echo "invalid V3 composite SHA-256" >&2
  exit 1
fi

# Resolve the booted device explicitly when caller leaves UDID=booted.
if [[ "$UDID" == "booted" ]]; then
  UDID="$(xcrun simctl list devices -j | python3 -c '
import json,sys
payload=json.load(sys.stdin)
for runtime, devices in payload.get("devices", {}).items():
    for device in devices:
        if device.get("state") == "Booted" and device.get("isAvailable", True):
            print(device["udid"])
            raise SystemExit(0)
raise SystemExit("no booted Simulator found")
')"
fi

readarray -t DEVICE_META < <(xcrun simctl list devices -j | python3 - "$UDID" <<'PY'
import json,sys
udid=sys.argv[1]
payload=json.load(sys.stdin)
for runtime, devices in payload.get('devices', {}).items():
    for device in devices:
        if device.get('udid') == udid:
            version=runtime.rsplit('.',1)[-1].replace('-', '.')
            print(device.get('name','iOS Simulator'))
            print(version)
            raise SystemExit(0)
raise SystemExit(f'simulator not found: {udid}')
PY
)
DEVICE_MODEL="${DEVICE_META[0]}"
OS_VERSION="${DEVICE_META[1]}"
UNITY_VERSION="$(awk -F': ' '/^m_EditorVersion:/ {print $2; exit}' unity/VampPonUnity/ProjectSettings/ProjectVersion.txt)"
if [[ -z "$UNITY_VERSION" ]]; then
  echo "could not resolve Unity version" >&2
  exit 1
fi

DATA_CONTAINER="$(xcrun simctl get_app_container "$UDID" "$BUNDLE_ID" data 2>/dev/null || true)"
if [[ -z "$DATA_CONTAINER" || ! -d "$DATA_CONTAINER" ]]; then
  echo "installed Simulator app container not found for $BUNDLE_ID on $UDID" >&2
  echo "This runner does not build/install; use the current PR bootstrap/install path first." >&2
  exit 1
fi

RAW_ARTIFACT="$DATA_CONTAINER/Documents/$RAW_NAME"
rm -f "$RAW_ARTIFACT"
mkdir -p "$ARTIFACT_DIR"
DEST_ARTIFACT="$ARTIFACT_DIR/simulator-${SOURCE_COMMIT}.json"
rm -f "$DEST_ARTIFACT"

# Launch only with explicit opt-in flags. The sampler does not exist in normal runs.
xcrun simctl launch "$UDID" "$BUNDLE_ID" --args \
  --vamp-pon-top-perf \
  --vamp-pon-top-perf-target=simulator \
  "--vamp-pon-top-perf-source-commit=$SOURCE_COMMIT" \
  "--vamp-pon-top-perf-composite-kind=$COMPOSITE_KIND" \
  "--vamp-pon-top-perf-composite-path=$COMPOSITE_PATH" \
  "--vamp-pon-top-perf-composite-sha256=$COMPOSITE_SHA256" >/dev/null

# Exercise background/foreground without terminating the measured process.
(
  sleep "$BACKGROUND_AFTER_SECONDS"
  xcrun simctl launch "$UDID" com.apple.Preferences >/dev/null 2>&1 || true
  sleep "$BACKGROUND_HOLD_SECONDS"
  xcrun simctl launch "$UDID" "$BUNDLE_ID" >/dev/null 2>&1 || true
) &
BACKGROUND_HELPER_PID=$!

started_at="$(date +%s)"
while [[ ! -f "$RAW_ARTIFACT" ]]; do
  now="$(date +%s)"
  if (( now - started_at > ARTIFACT_TIMEOUT_SECONDS )); then
    kill "$BACKGROUND_HELPER_PID" >/dev/null 2>&1 || true
    echo "timed out waiting for TOP Simulator performance artifact" >&2
    exit 1
  fi
  sleep 2
done
wait "$BACKGROUND_HELPER_PID" || true

cp "$RAW_ARTIFACT" "$DEST_ARTIFACT"

node --experimental-strip-types scripts/unity/register-top-living-night-device-performance.ts \
  --target=simulator \
  "--artifact=$DEST_ARTIFACT" \
  "--device-model=$DEVICE_MODEL" \
  "--os-version=$OS_VERSION" \
  "--unity-version=$UNITY_VERSION"

node --experimental-strip-types scripts/quality/check-top-living-night-device-performance-artifact.ts
node --experimental-strip-types scripts/quality/check-top-living-night-device-performance-policy.ts
node --experimental-strip-types scripts/quality/check-top-living-night-device-evidence.ts

echo "TOP Simulator performance evidence recorded"
echo "source commit: $SOURCE_COMMIT"
echo "simulator: $DEVICE_MODEL / iOS $OS_VERSION"
echo "artifact: $DEST_ARTIFACT"
echo "device evidence: $DEVICE_JSON"
echo "NOTE: this does not promote runtimeApproved/final approval and does not replace physical-iPhone thermal evidence."
