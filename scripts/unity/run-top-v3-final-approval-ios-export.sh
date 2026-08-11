#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

TARGET="${1:-}"
[[ "$TARGET" == "simulator" || "$TARGET" == "device" ]] || {
  echo "usage: $0 simulator|device" >&2
  exit 1
}

UNITY_BIN="${UNITY_BIN:-/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity}"
V3_JSON="docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json"
CAPTURE_JSON="docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json"

for required in "$V3_JSON" "$CAPTURE_JSON"; do
  [[ -f "$required" ]] || { echo "missing final-evidence authority: $required" >&2; exit 1; }
done
[[ -x "$UNITY_BIN" ]] || { echo "Unity 6000.5.1f1 executable not found: $UNITY_BIN" >&2; exit 1; }

SOURCE_COMMIT="$(node --input-type=module <<'NODE'
import fs from 'node:fs';
const v3=JSON.parse(fs.readFileSync('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json','utf8'));
const capture=JSON.parse(fs.readFileSync('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json','utf8'));
const fail=message=>{console.error(message);process.exit(1);};
if (!v3.executed || v3.result !== 'PASSED') fail('TOP final iOS export requires PASSED V3 Unity evidence');
if (!capture.executed || capture.result !== 'PASSED' || capture.captureCount !== 15) fail('TOP final iOS export requires PASSED 15-frame capture evidence');
if (v3.verifiedCommit !== capture.sourceCommit) fail('V3/capture source commit mismatch');
if (v3.sourceCompositeKind !== 'final-core5' || capture.topCompositeKind !== 'final-core5') fail('TOP final iOS export requires final-core5 provenance');
if (v3.sourceCompositePath !== capture.topCompositePath || v3.sourceCompositeSha256 !== capture.topCompositeSha256) fail('V3/capture composite provenance mismatch');
if (!/^[0-9a-f]{40}$/.test(v3.verifiedCommit || '')) fail('invalid final-evidence source commit');
console.log(v3.verifiedCommit);
NODE
)"
SOURCE_SHORT="${SOURCE_COMMIT:0:8}"

WORKTREE="${TOP_V3_FINAL_BUILD_WORKTREE:-/Users/m-shogo/Developer/personal/vamp-pon-top-v3-final-build}"
DEFAULT_OUTPUT="/Users/m-shogo/Developer/personal/vamp-pon-builds/top-v3-final-${SOURCE_SHORT}-${TARGET}"
OUTPUT="${VAMPPON_TOP_FINAL_IOS_EXPORT_PATH:-$DEFAULT_OUTPUT}"
LOG_PATH="${TOP_V3_FINAL_BUILD_LOG:-$WORKTREE/unity/VampPonUnity/Logs/top_v3_final_${TARGET}_export.log}"

# The source commit can be behind the evidence commit by design: capture evidence
# is committed separately, while the player must be built from the exact source
# commit recorded by V3/capture authority.
git cat-file -e "${SOURCE_COMMIT}^{commit}" 2>/dev/null || {
  echo "source commit is unavailable locally: $SOURCE_COMMIT" >&2
  exit 1
}

registered=false
if git worktree list --porcelain | grep -Fqx "worktree $WORKTREE"; then
  registered=true
fi
if [[ -e "$WORKTREE" && "$registered" != true ]]; then
  echo "build worktree path exists but is not registered: $WORKTREE" >&2
  exit 1
fi

if [[ "$registered" == true ]]; then
  git -C "$WORKTREE" reset --hard "$SOURCE_COMMIT"
  git -C "$WORKTREE" clean -fdx
else
  git worktree add --detach "$WORKTREE" "$SOURCE_COMMIT"
fi

git -C "$WORKTREE" reset --hard "$SOURCE_COMMIT"

if [[ "$OUTPUT" == "$DEFAULT_OUTPUT" ]]; then
  rm -rf "$OUTPUT"
elif [[ -d "$OUTPUT" && -n "$(find "$OUTPUT" -mindepth 1 -maxdepth 1 -print -quit)" ]]; then
  echo "custom VAMPPON_TOP_FINAL_IOS_EXPORT_PATH must be empty: $OUTPUT" >&2
  exit 1
fi
mkdir -p "$OUTPUT" "$(dirname "$LOG_PATH")"

PROJECT_PATH="$WORKTREE/unity/VampPonUnity"

echo "TOP final iOS export"
echo "target: $TARGET"
echo "source commit: $SOURCE_COMMIT"
echo "worktree: $WORKTREE"
echo "output: $OUTPUT"

set +e
env \
  VAMPPON_BUILD_SOURCE_COMMIT="$SOURCE_COMMIT" \
  VAMPPON_TOP_FINAL_IOS_BUILD_TARGET="$TARGET" \
  VAMPPON_TOP_FINAL_IOS_BUILD_PATH="$OUTPUT" \
  "$UNITY_BIN" \
    -batchmode \
    -quit \
    -projectPath "$PROJECT_PATH" \
    -executeMethod VampPon.UnitySpike.Editor.TopV3FinalApprovalIosBuild.Build \
    -logFile "$LOG_PATH"
status=$?
set -e

if [[ $status -ne 0 ]]; then
  echo "TOP final $TARGET Unity export failed with exit code $status" >&2
  tail -n 200 "$LOG_PATH" >&2 || true
  exit "$status"
fi

[[ -f "$OUTPUT/Unity-iPhone.xcodeproj/project.pbxproj" ]] || {
  echo "Unity reported success but Xcode project is missing: $OUTPUT/Unity-iPhone.xcodeproj" >&2
  exit 1
}

if [[ -n "$(git -C "$WORKTREE" status --porcelain --untracked-files=no)" ]]; then
  echo "TOP final iOS export changed tracked source files; refusing non-reproducible evidence build" >&2
  git -C "$WORKTREE" status --short >&2
  exit 1
fi

echo "TOP final iOS Unity export: PASS"
echo "target: $TARGET"
echo "source commit: $SOURCE_COMMIT"
echo "Xcode project: $OUTPUT/Unity-iPhone.xcodeproj"
echo "Unity log: $LOG_PATH"
echo "NOTE: export alone is not device evidence; build/install the Xcode product, then use the canonical build-provenance-gated performance runner."
