#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

DEVICE="${VAMPPON_PHYSICAL_IPHONE_DEVICE:-}"
TEAM="${VAMPPON_APPLE_DEVELOPMENT_TEAM:-}"
DEFAULT_BUNDLE_ID="com.mshogo.vamppon.u1"
BUNDLE_ID="${VAMPPON_IOS_BUNDLE_ID:-$DEFAULT_BUNDLE_ID}"
ALLOW_PROVISIONING_UPDATES="${VAMPPON_ALLOW_PROVISIONING_UPDATES:-0}"
PROFILE_SPECIFIER="${VAMPPON_PROVISIONING_PROFILE_SPECIFIER:-}"
INSTALL_TIMEOUT="${VAMPPON_PHYSICAL_INSTALL_TIMEOUT_SECONDS:-240}"
V3_JSON="docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json"
CAPTURE_JSON="docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

[[ -n "$DEVICE" ]] || fail "VAMPPON_PHYSICAL_IPHONE_DEVICE is required"
[[ -n "$TEAM" ]] || fail "VAMPPON_APPLE_DEVELOPMENT_TEAM is required; signing identity must never be guessed"
[[ "$TEAM" =~ ^[A-Za-z0-9]{10}$ ]] || fail "VAMPPON_APPLE_DEVELOPMENT_TEAM must be a 10-character Apple Team ID"
[[ "$BUNDLE_ID" =~ ^[A-Za-z0-9][A-Za-z0-9.-]*$ ]] || fail "VAMPPON_IOS_BUNDLE_ID is not a valid bundle-identifier shape"
[[ "$ALLOW_PROVISIONING_UPDATES" == "0" || "$ALLOW_PROVISIONING_UPDATES" == "1" ]] || \
  fail "VAMPPON_ALLOW_PROVISIONING_UPDATES must be 0 or 1"
[[ "$INSTALL_TIMEOUT" =~ ^[0-9]+$ ]] || fail "VAMPPON_PHYSICAL_INSTALL_TIMEOUT_SECONDS must be an integer"

for command_name in xcrun xcodebuild codesign node python3; do
  command -v "$command_name" >/dev/null 2>&1 || fail "$command_name is required"
done
for required in "$V3_JSON" "$CAPTURE_JSON" \
  scripts/unity/run-top-v3-final-approval-ios-export.sh \
  scripts/unity/run-top-v3-physical-iphone-performance-evidence.sh; do
  [[ -e "$required" ]] || fail "missing final physical-iPhone evidence dependency: $required"
done

SOURCE_COMMIT="$(node --input-type=module <<'NODE'
import fs from 'node:fs';
const v3=JSON.parse(fs.readFileSync('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json','utf8'));
const capture=JSON.parse(fs.readFileSync('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json','utf8'));
const fail=message=>{console.error(message);process.exit(1);};
if (!v3.executed || v3.result !== 'PASSED') fail('final physical-iPhone evidence requires PASSED V3 Unity evidence');
if (!capture.executed || capture.result !== 'PASSED' || capture.captureCount !== 15) fail('final physical-iPhone evidence requires PASSED 15-frame capture evidence');
if (v3.verifiedCommit !== capture.sourceCommit) fail('V3/capture source commit mismatch');
if (v3.sourceCompositeKind !== 'final-core5' || capture.topCompositeKind !== 'final-core5') fail('final physical-iPhone evidence requires final-core5 provenance');
if (v3.sourceCompositePath !== capture.topCompositePath || v3.sourceCompositeSha256 !== capture.topCompositeSha256) fail('V3/capture composite provenance mismatch');
if (!/^[0-9a-f]{40}$/.test(v3.verifiedCommit || '')) fail('invalid final physical-iPhone evidence source commit');
console.log(v3.verifiedCommit);
NODE
)"
SOURCE_SHORT="${SOURCE_COMMIT:0:8}"

EXPORT_PATH="${VAMPPON_TOP_FINAL_IOS_EXPORT_PATH:-/Users/m-shogo/Developer/personal/vamp-pon-builds/top-v3-final-${SOURCE_SHORT}-device}"
DERIVED_DATA="${VAMPPON_TOP_FINAL_DEVICE_DERIVED_DATA:-/Users/m-shogo/Developer/personal/vamp-pon-builds/top-v3-final-${SOURCE_SHORT}-device-derived}"
XCODE_LOG="${VAMPPON_TOP_FINAL_DEVICE_XCODE_LOG:-/Users/m-shogo/Developer/personal/vamp-pon-builds/top-v3-final-${SOURCE_SHORT}-device-xcodebuild.log}"

# The Unity export is always recreated from the exact source commit bound by the
# formal V3/capture evidence. Any bundle-ID accommodation stays in generated Xcode.
env \
  VAMPPON_TOP_FINAL_IOS_EXPORT_PATH="$EXPORT_PATH" \
  bash scripts/unity/run-top-v3-final-approval-ios-export.sh device

XCODE_PROJECT="$EXPORT_PATH/Unity-iPhone.xcodeproj"
PBXPROJ="$XCODE_PROJECT/project.pbxproj"
[[ -f "$PBXPROJ" ]] || fail "final device Xcode project is missing: $XCODE_PROJECT"

# A local provisioning profile may cover a different explicit app ID. Preserve the
# repository authority and alter only the generated Xcode app-target build setting.
# The exact default bundle setting must exist before any override is accepted.
if [[ "$BUNDLE_ID" != "$DEFAULT_BUNDLE_ID" ]]; then
  python3 - "$PBXPROJ" "$DEFAULT_BUNDLE_ID" "$BUNDLE_ID" <<'PY'
from pathlib import Path
import re
import sys
path=Path(sys.argv[1])
old=sys.argv[2]
new=sys.argv[3]
text=path.read_text(encoding='utf-8')
pattern=re.compile(rf'(PRODUCT_BUNDLE_IDENTIFIER\s*=\s*){re.escape(old)}(\s*;)')
matches=list(pattern.finditer(text))
if not matches:
    raise SystemExit(f'generated Xcode project has no exact app bundle setting for {old}; refusing broad mutation')
text,count=pattern.subn(rf'\g<1>{new}\g<2>',text)
if count != len(matches):
    raise SystemExit('generated bundle override count drifted unexpectedly')
path.write_text(text,encoding='utf-8')
print(f'generated-Xcode bundle override: {old} -> {new}; replacements={count}')
PY
fi

rm -rf "$DERIVED_DATA"
mkdir -p "$(dirname "$XCODE_LOG")"
rm -f "$XCODE_LOG"

XCODE_ARGS=(
  -project "$XCODE_PROJECT"
  -scheme Unity-iPhone
  -configuration Release
  -sdk iphoneos
  -destination "id=$DEVICE"
  -derivedDataPath "$DERIVED_DATA"
  "DEVELOPMENT_TEAM=$TEAM"
  CODE_SIGN_STYLE=Automatic
)
if [[ -n "$PROFILE_SPECIFIER" ]]; then
  XCODE_ARGS+=("PROVISIONING_PROFILE_SPECIFIER=$PROFILE_SPECIFIER")
fi
if [[ "$ALLOW_PROVISIONING_UPDATES" == "1" ]]; then
  XCODE_ARGS=(-allowProvisioningUpdates "${XCODE_ARGS[@]}")
fi

set +e
xcodebuild "${XCODE_ARGS[@]}" build >"$XCODE_LOG" 2>&1
XCODE_STATUS=$?
set -e
if [[ $XCODE_STATUS -ne 0 ]]; then
  echo "final physical-iPhone xcodebuild/signing failed with exit code $XCODE_STATUS" >&2
  tail -n 240 "$XCODE_LOG" >&2 || true
  exit "$XCODE_STATUS"
fi

PRODUCTS="$DERIVED_DATA/Build/Products/Release-iphoneos"
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
    raise SystemExit(f'expected exactly one signed {expected} app, found {len(matches)} under {products}')
print(matches[0])
PY
)"
[[ -d "$APP_PATH" ]] || fail "final signed physical-iPhone app is missing: $APP_PATH"
[[ -f "$APP_PATH/embedded.mobileprovision" ]] || fail "signed app is missing embedded.mobileprovision"
codesign --verify --deep --strict "$APP_PATH"

# Install the exact signed product. The device must be paired, unlocked, awake,
# and Developer Mode/profile trust must already permit a development launch.
xcrun devicectl device install app \
  --device "$DEVICE" \
  --timeout "$INSTALL_TIMEOUT" \
  "$APP_PATH"

# The canonical physical runner validates the embedded clean Git SHA emitted by
# the same measured process before accepting its 300-second thermal/perf evidence.
env \
  VAMPPON_PHYSICAL_IPHONE_DEVICE="$DEVICE" \
  VAMPPON_IOS_BUNDLE_ID="$BUNDLE_ID" \
  bash scripts/unity/run-top-v3-physical-iphone-performance-evidence.sh

echo "TOP V3 final physical-iPhone evidence: PASS"
echo "source commit: $SOURCE_COMMIT"
echo "installed bundle: $BUNDLE_ID"
echo "signed app: $APP_PATH"
echo "Xcode log: $XCODE_LOG"
echo "NOTE: this command does not promote final approval; formal human/static/motion gates must also be PASSED."
