#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

BUNDLE_ID="${VAMPPON_IOS_BUNDLE_ID:-com.mshogo.vamppon.u1}"
UDID="${VAMPPON_SIMULATOR_UDID:-booted}"
V3_JSON="docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json"
CAPTURE_JSON="docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

for command_name in xcrun xcodebuild node python3; do
  command -v "$command_name" >/dev/null 2>&1 || fail "$command_name is required"
done
for required in "$V3_JSON" "$CAPTURE_JSON" \
  scripts/unity/run-top-v3-final-approval-ios-export.sh \
  scripts/unity/run-top-v3-simulator-performance-evidence.sh; do
  [[ -e "$required" ]] || fail "missing final Simulator evidence dependency: $required"
done

SOURCE_COMMIT="$(node --input-type=module <<'NODE'
import fs from 'node:fs';
const v3=JSON.parse(fs.readFileSync('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json','utf8'));
const capture=JSON.parse(fs.readFileSync('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json','utf8'));
const fail=message=>{console.error(message);process.exit(1);};
if (!v3.executed || v3.result !== 'PASSED') fail('final Simulator evidence requires PASSED V3 Unity evidence');
if (!capture.executed || capture.result !== 'PASSED' || capture.captureCount !== 15) fail('final Simulator evidence requires PASSED 15-frame capture evidence');
if (v3.verifiedCommit !== capture.sourceCommit) fail('V3/capture source commit mismatch');
if (v3.sourceCompositeKind !== 'final-core5' || capture.topCompositeKind !== 'final-core5') fail('final Simulator evidence requires final-core5 provenance');
if (v3.sourceCompositePath !== capture.topCompositePath || v3.sourceCompositeSha256 !== capture.topCompositeSha256) fail('V3/capture composite provenance mismatch');
if (!/^[0-9a-f]{40}$/.test(v3.verifiedCommit || '')) fail('invalid final Simulator evidence source commit');
console.log(v3.verifiedCommit);
NODE
)"
SOURCE_SHORT="${SOURCE_COMMIT:0:8}"

if [[ "$UDID" == "booted" ]]; then
  UDID="$(xcrun simctl list devices -j | python3 -c '
import json,sys
payload=json.load(sys.stdin)
devices=[d for values in payload.get("devices",{}).values() for d in values if d.get("state")=="Booted" and d.get("isAvailable",True)]
if len(devices) != 1:
    raise SystemExit(f"expected exactly one booted Simulator, found {len(devices)}")
print(devices[0]["udid"])
')"
fi

EXPORT_PATH="${VAMPPON_TOP_FINAL_IOS_EXPORT_PATH:-/Users/m-shogo/Developer/personal/vamp-pon-builds/top-v3-final-${SOURCE_SHORT}-simulator}"
DERIVED_DATA="${VAMPPON_TOP_FINAL_SIMULATOR_DERIVED_DATA:-/Users/m-shogo/Developer/personal/vamp-pon-builds/top-v3-final-${SOURCE_SHORT}-simulator-derived}"
XCODE_LOG="${VAMPPON_TOP_FINAL_SIMULATOR_XCODE_LOG:-/Users/m-shogo/Developer/personal/vamp-pon-builds/top-v3-final-${SOURCE_SHORT}-simulator-xcodebuild.log}"

# Recreate the Unity Xcode export from the exact V3/capture source commit. The
# export runner itself fails closed on source drift and embeds build provenance.
env \
  VAMPPON_TOP_FINAL_IOS_EXPORT_PATH="$EXPORT_PATH" \
  bash scripts/unity/run-top-v3-final-approval-ios-export.sh simulator

XCODE_PROJECT="$EXPORT_PATH/Unity-iPhone.xcodeproj"
[[ -f "$XCODE_PROJECT/project.pbxproj" ]] || fail "final Simulator Xcode project is missing: $XCODE_PROJECT"

rm -rf "$DERIVED_DATA"
mkdir -p "$(dirname "$XCODE_LOG")"
rm -f "$XCODE_LOG"

set +e
xcodebuild \
  -project "$XCODE_PROJECT" \
  -scheme Unity-iPhone \
  -configuration Release \
  -sdk iphonesimulator \
  -destination "id=$UDID" \
  -derivedDataPath "$DERIVED_DATA" \
  CODE_SIGNING_ALLOWED=NO \
  build >"$XCODE_LOG" 2>&1
XCODE_STATUS=$?
set -e
if [[ $XCODE_STATUS -ne 0 ]]; then
  echo "final Simulator xcodebuild failed with exit code $XCODE_STATUS" >&2
  tail -n 220 "$XCODE_LOG" >&2 || true
  exit "$XCODE_STATUS"
fi

PRODUCTS="$DERIVED_DATA/Build/Products/Release-iphonesimulator"
APP_PATH="$(python3 - "$PRODUCTS" "$BUNDLE_ID" <<'PY'
from pathlib import Path
import plistlib
import sys
products=Path(sys.argv[1])
expected=sys.argv[2]
matches=[]
if products.is_dir():
    for app in products.glob('*.app'):
        info=app/'Info.plist'
        if not info.is_file():
            continue
        try:
            with info.open('rb') as handle:
                bundle=plistlib.load(handle).get('CFBundleIdentifier')
        except Exception:
            continue
        if bundle == expected:
            matches.append(app)
if len(matches) != 1:
    raise SystemExit(f'expected exactly one {expected} app, found {len(matches)} under {products}')
print(matches[0])
PY
)"
[[ -d "$APP_PATH" ]] || fail "final Simulator app is missing: $APP_PATH"

xcrun simctl terminate "$UDID" "$BUNDLE_ID" >/dev/null 2>&1 || true
xcrun simctl install "$UDID" "$APP_PATH"
DATA_CONTAINER="$(xcrun simctl get_app_container "$UDID" "$BUNDLE_ID" data 2>/dev/null || true)"
[[ -n "$DATA_CONTAINER" && -d "$DATA_CONTAINER" ]] || fail "installed final Simulator app container could not be resolved"

# Canonical wrapper validates the embedded SHA emitted by this same measured
# process before allowing its 300 active seconds of evidence to be registered.
env \
  VAMPPON_SIMULATOR_UDID="$UDID" \
  VAMPPON_IOS_BUNDLE_ID="$BUNDLE_ID" \
  bash scripts/unity/run-top-v3-simulator-performance-evidence.sh

echo "TOP V3 final Simulator evidence: PASS"
echo "source commit: $SOURCE_COMMIT"
echo "simulator UDID: $UDID"
echo "app: $APP_PATH"
echo "Xcode log: $XCODE_LOG"
echo "NOTE: physical-iPhone thermal evidence and formal human review remain separate required gates."
