#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

TARGET="${1:-}"
BUNDLE_ID="${VAMPPON_IOS_BUNDLE_ID:-com.mshogo.vamppon.u1}"
SIMULATOR_UDID="${VAMPPON_SIMULATOR_UDID:-booted}"
PHYSICAL_DEVICE="${VAMPPON_PHYSICAL_IPHONE_DEVICE:-}"
V3_JSON="docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json"
CAPTURE_JSON="docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json"
OUTPUT_NAME="vamp-pon-build-provenance.json"
TIMEOUT_SECONDS="${VAMPPON_BUILD_PROVENANCE_TIMEOUT_SECONDS:-45}"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

[[ "$TARGET" == "simulator" || "$TARGET" == "physical-iphone" ]] || \
  fail "usage: $0 simulator|physical-iphone"

for required in "$V3_JSON" "$CAPTURE_JSON"; do
  [[ -f "$required" ]] || fail "missing provenance authority: $required"
done

for command_name in xcrun node python3; do
  command -v "$command_name" >/dev/null 2>&1 || \
    fail "$command_name is required for installed-build provenance verification"
done

SOURCE_COMMIT="$(node --input-type=module <<'NODE'
import fs from 'node:fs';
const v3 = JSON.parse(fs.readFileSync('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json', 'utf8'));
const capture = JSON.parse(fs.readFileSync('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json', 'utf8'));
const fail = message => { console.error(message); process.exit(1); };
if (!v3.executed || v3.result !== 'PASSED') fail('installed-build provenance requires PASSED V3 Unity evidence');
if (!capture.executed || capture.result !== 'PASSED' || capture.captureCount !== 15) fail('installed-build provenance requires PASSED 15-frame capture evidence');
if (v3.verifiedCommit !== capture.sourceCommit) fail('V3/capture source commit mismatch');
if (v3.sourceCompositeKind !== 'final-core5' || capture.topCompositeKind !== 'final-core5') fail('installed-build provenance requires final-core5 evidence');
if (v3.sourceCompositePath !== capture.topCompositePath || v3.sourceCompositeSha256 !== capture.topCompositeSha256) fail('V3/capture composite provenance mismatch');
if (!/^[0-9a-f]{40}$/.test(v3.verifiedCommit || '')) fail('V3 verifiedCommit is invalid');
console.log(v3.verifiedCommit);
NODE
)"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT
ARTIFACT="$TMP_DIR/$OUTPUT_NAME"

verify_artifact() {
  node --input-type=module - "$ARTIFACT" "$SOURCE_COMMIT" "$BUNDLE_ID" <<'NODE'
import fs from 'node:fs';
const [path, expectedCommit, expectedBundle] = process.argv.slice(2);
try {
  const artifact = JSON.parse(fs.readFileSync(path, 'utf8'));
  const ok = artifact.schemaVersion === 1 &&
    artifact.result === 'PASSED' &&
    artifact.sourceCommit === expectedCommit &&
    artifact.bundleIdentifier === expectedBundle &&
    /^[0-9a-f]{40}$/.test(artifact.sourceCommit || '') &&
    typeof artifact.unityVersion === 'string' && artifact.unityVersion.length > 0 &&
    typeof artifact.recordedAtUtc === 'string' && Number.isFinite(Date.parse(artifact.recordedAtUtc)) &&
    (!artifact.error || artifact.error === '');
  process.exit(ok ? 0 : 1);
} catch {
  process.exit(1);
}
NODE
}

if [[ "$TARGET" == "simulator" ]]; then
  if [[ "$SIMULATOR_UDID" == "booted" ]]; then
    SIMULATOR_UDID="$(xcrun simctl list devices -j | python3 -c '
import json,sys
payload=json.load(sys.stdin)
for devices in payload.get("devices", {}).values():
    for device in devices:
        if device.get("state") == "Booted" and device.get("isAvailable", True):
            print(device["udid"])
            raise SystemExit(0)
raise SystemExit("no booted Simulator found")
')"
  fi

  DATA_CONTAINER="$(xcrun simctl get_app_container "$SIMULATOR_UDID" "$BUNDLE_ID" data 2>/dev/null || true)"
  [[ -n "$DATA_CONTAINER" && -d "$DATA_CONTAINER" ]] || \
    fail "installed Simulator app container not found for $BUNDLE_ID on $SIMULATOR_UDID"

  REMOTE_ARTIFACT="$DATA_CONTAINER/Documents/$OUTPUT_NAME"
  rm -f "$REMOTE_ARTIFACT"
  xcrun simctl terminate "$SIMULATOR_UDID" "$BUNDLE_ID" >/dev/null 2>&1 || true
  xcrun simctl launch "$SIMULATOR_UDID" "$BUNDLE_ID" \
    --vamp-pon-build-provenance-probe >/dev/null

  started_at="$(date +%s)"
  while true; do
    if [[ -f "$REMOTE_ARTIFACT" ]]; then
      cp "$REMOTE_ARTIFACT" "$ARTIFACT"
      if verify_artifact; then
        break
      fi
    fi
    now="$(date +%s)"
    if (( now - started_at > TIMEOUT_SECONDS )); then
      fail "Simulator installed-build provenance did not match source commit $SOURCE_COMMIT"
    fi
    sleep 1
  done
else
  [[ -n "$PHYSICAL_DEVICE" ]] || \
    fail "VAMPPON_PHYSICAL_IPHONE_DEVICE is required for physical-iPhone provenance verification"

  SENTINEL="$TMP_DIR/pending.json"
  cat > "$SENTINEL" <<JSON
{"schemaVersion":1,"result":"PENDING","sourceCommit":""}
JSON

  REMOTE_ARTIFACT="Documents/$OUTPUT_NAME"
  xcrun devicectl device copy to \
    --device "$PHYSICAL_DEVICE" \
    --domain-type appDataContainer \
    --domain-identifier "$BUNDLE_ID" \
    --source "$SENTINEL" \
    --destination "$REMOTE_ARTIFACT" >/dev/null

  xcrun devicectl device process launch \
    --device "$PHYSICAL_DEVICE" \
    "$BUNDLE_ID" -- \
    --vamp-pon-build-provenance-probe >/dev/null

  started_at="$(date +%s)"
  while true; do
    rm -f "$ARTIFACT"
    if xcrun devicectl device copy from \
        --device "$PHYSICAL_DEVICE" \
        --domain-type appDataContainer \
        --domain-identifier "$BUNDLE_ID" \
        --source "$REMOTE_ARTIFACT" \
        --destination "$ARTIFACT" >/dev/null 2>&1; then
      if verify_artifact; then
        break
      fi
    fi
    now="$(date +%s)"
    if (( now - started_at > TIMEOUT_SECONDS )); then
      fail "physical-iPhone installed-build provenance did not match source commit $SOURCE_COMMIT"
    fi
    sleep 2
  done
fi

echo "TOP installed-build provenance: PASS"
echo "target: $TARGET"
echo "source commit: $SOURCE_COMMIT"
echo "bundle: $BUNDLE_ID"
