#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-/Users/m-shogo/Developer/personal/vamp-pon}"
WORKTREE="${LOADING_CAPTURE_WORKTREE:-/Users/m-shogo/Developer/personal/vamp-pon-pr78-capture}"
SOURCE_BRANCH="agent/top-living-night-key-art-v1"
UNITY_BIN="${UNITY_BIN:-/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity}"
PROJECT_PATH="$WORKTREE/unity/VampPonUnity"
LOG_PATH="$PROJECT_PATH/Logs/loading_top_automated_capture.log"
V3_LOG_PATH="$PROJECT_PATH/Logs/top_living_night_v3_verification.log"
NORMALIZER="scripts/quality/fix-loading-seasonal-editor-source-paths.py"
READINESS_FIXER="scripts/quality/fix-loading-top-capture-readiness.py"
CHECKER="scripts/quality/check-loading-top-capture-pack.ts"
V3_CHECKER="scripts/quality/check-top-living-night-runtime-v3.ts"
BOUNDARY_CHECKER="scripts/quality/check-loading-top-runtime-boundary.ts"
CAPTURE_ROOT="docs/design-targets/generated/loading-seasonal-v1/runtime-captures"
CAPTURE_MANIFEST="docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json"
V3_EVIDENCE="docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json"
LOADING_VIEW="unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/LoadingSeasonalView.cs"
CAPTURE_AUTOMATION="unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingTopAutomatedCapture.cs"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

print_log_failure_context() {
  local label="$1"
  local log_path="$2"
  echo >&2
  echo "=== $label failure summary ===" >&2
  if [[ -f "$log_path" ]]; then
    grep -nE \
      'error CS|Exception|FAILED|Timeout|timed out|Aborting|Crash|executeMethod|automated capture|Loading/TOP|Runtime V3|SIG[A-Z]+|fatal' \
      "$log_path" | tail -n 180 >&2 || true
    echo >&2
    echo "=== Last 180 $label log lines ===" >&2
    tail -n 180 "$log_path" >&2 || true
  else
    echo "Unity log was not created: $log_path" >&2
  fi
}

[[ -d "$REPO_ROOT/.git" ]] || fail "Git repository not found: $REPO_ROOT"
[[ -x "$UNITY_BIN" ]] || fail "Unity 6000.5.1f1 executable not found: $UNITY_BIN"

cd "$REPO_ROOT"
echo "Fetching origin/$SOURCE_BRANCH ..."
git fetch origin "$SOURCE_BRANCH"

registered=false
if git worktree list --porcelain | grep -Fqx "worktree $WORKTREE"; then
  registered=true
fi

if [[ -e "$WORKTREE" && "$registered" != true ]]; then
  fail "Path already exists but is not a registered git worktree: $WORKTREE"
fi

if [[ "$registered" == true ]]; then
  echo "Refreshing existing capture worktree: $WORKTREE"
  git -C "$WORKTREE" reset --hard "origin/$SOURCE_BRANCH"
  git -C "$WORKTREE" clean -fdx -- \
    unity/VampPonUnity/Assets/Resources/LoadingSeasonal \
    unity/VampPonUnity/Assets/Resources/LoadingSeasonal.meta \
    unity/VampPonUnity/Assets/Resources/TopLivingNight \
    unity/VampPonUnity/Assets/Resources/TopLivingNight.meta \
    unity/VampPonUnity/Assets/Resources/TopLivingNightV3Generated \
    unity/VampPonUnity/Assets/Resources/TopLivingNightV3Generated.meta \
    "$CAPTURE_ROOT"
else
  echo "Creating isolated capture worktree: $WORKTREE"
  git worktree add --detach "$WORKTREE" "origin/$SOURCE_BRANCH"
fi

cd "$WORKTREE"
[[ -f "$NORMALIZER" ]] || fail "Editor path normalizer missing: $NORMALIZER"
[[ -f "$READINESS_FIXER" ]] || fail "Capture readiness fixer missing: $READINESS_FIXER"
[[ -f "$CHECKER" ]] || fail "Capture checker missing: $CHECKER"
[[ -f "$V3_CHECKER" ]] || fail "TOP Runtime V3 checker missing: $V3_CHECKER"
[[ -f "$BOUNDARY_CHECKER" ]] || fail "Loading/TOP boundary checker missing: $BOUNDARY_CHECKER"
[[ -f "$CAPTURE_MANIFEST" ]] || fail "Capture manifest boundary missing: $CAPTURE_MANIFEST"
[[ -f "$V3_EVIDENCE" ]] || fail "TOP Runtime V3 evidence boundary missing: $V3_EVIDENCE"

python3 "$NORMALIZER"
python3 "$READINESS_FIXER"

if ! git diff --quiet -- "$LOADING_VIEW" "$CAPTURE_AUTOMATION"; then
  git add "$LOADING_VIEW" "$CAPTURE_AUTOMATION"
  git commit -m "fix: finalize Loading TOP editor capture inputs"
  echo "Pushing final Editor capture fixes ..."
  git push origin "HEAD:$SOURCE_BRANCH"
fi

python3 "$NORMALIZER" --check
python3 "$READINESS_FIXER" --check
node --experimental-strip-types "$V3_CHECKER"
node --experimental-strip-types "$BOUNDARY_CHECKER"
node --experimental-strip-types "$CHECKER"
mkdir -p "$(dirname "$LOG_PATH")"
rm -f "$LOG_PATH" "$V3_LOG_PATH"

echo
echo "Verifying TOP Runtime V3 build assets, shader, Material and Resources import ..."
set +e
"$UNITY_BIN" \
  -batchmode \
  -quit \
  -projectPath "$PROJECT_PATH" \
  -executeMethod VampPon.UnitySpike.Editor.TopLivingNightCompositeV3UnityVerification.RunBatchmode \
  -logFile "$V3_LOG_PATH"
v3_status=$?
set -e

if [[ $v3_status -ne 0 ]]; then
  echo "TOP Runtime V3 Unity verification failed with exit code $v3_status." >&2
  print_log_failure_context "TOP Runtime V3 verification" "$V3_LOG_PATH"
  exit "$v3_status"
fi

if ! python3 - "$V3_EVIDENCE" <<'PY'
import json
from pathlib import Path
import sys

path = Path(sys.argv[1])
data = json.loads(path.read_text(encoding="utf-8"))
required = {
    "executed": True,
    "result": "PASSED",
    "failureCount": 0,
    "sourceCompositeCount": 1,
    "resourceTextureCount": 1,
    "resourceMaterialCount": 1,
    "controllerResolved": True,
    "shaderResolved": True,
    "buildHookResolved": True,
    "buildImportPolicyPassed": True,
}
for key, expected in required.items():
    if data.get(key) != expected:
        print(
            f"TOP Runtime V3 evidence mismatch: {key} expected={expected!r} actual={data.get(key)!r}",
            file=sys.stderr,
        )
        raise SystemExit(1)
PY
then
  print_log_failure_context "TOP Runtime V3 verification" "$V3_LOG_PATH"
  exit 1
fi

echo "TOP Runtime V3 Unity verification: PASS"

echo
echo "Launching Unity for the automated 15-frame capture pack ..."
echo "Unity will open, wait for TOP readiness, capture all frames, and close itself automatically."
set +e
"$UNITY_BIN" \
  -projectPath "$PROJECT_PATH" \
  -executeMethod VampPon.UnitySpike.Editor.LoadingTopAutomatedCapture.RunFromCommandLine \
  -logFile "$LOG_PATH"
unity_status=$?
set -e

if [[ $unity_status -ne 0 ]]; then
  echo "Automated Loading/TOP capture failed with exit code $unity_status." >&2
  print_log_failure_context "Unity capture" "$LOG_PATH"
  exit "$unity_status"
fi

if ! python3 - "$CAPTURE_MANIFEST" <<'PY'
import json
from pathlib import Path
import sys

path = Path(sys.argv[1])
try:
    data = json.loads(path.read_text(encoding="utf-8"))
except Exception as exc:
    print(f"capture manifest could not be read: {exc}", file=sys.stderr)
    raise SystemExit(1)

if data.get("executed") is not True or data.get("result") != "PASSED":
    print(
        "Unity exited without a PASSED capture manifest: "
        f"executed={data.get('executed')} result={data.get('result')} "
        f"captureCount={data.get('captureCount')} error={data.get('error')!r}",
        file=sys.stderr,
    )
    raise SystemExit(1)
PY
then
  print_log_failure_context "Unity capture" "$LOG_PATH"
  exit 1
fi

if ! node --experimental-strip-types "$CHECKER"; then
  print_log_failure_context "Unity capture" "$LOG_PATH"
  exit 1
fi

if git diff --quiet -- "$CAPTURE_ROOT" "$CAPTURE_MANIFEST" "$V3_EVIDENCE"; then
  echo "Unity reported PASSED, but no capture or V3 evidence output changed." >&2
  print_log_failure_context "Unity capture" "$LOG_PATH"
  exit 1
fi

git add "$CAPTURE_ROOT" "$CAPTURE_MANIFEST" "$V3_EVIDENCE"
git commit -m "test: add TOP Runtime V3 Loading capture evidence"
echo "Pushing automated Loading/TOP captures to $SOURCE_BRANCH ..."
git push origin "HEAD:$SOURCE_BRANCH"

echo
echo "=== TOP Runtime V3 Unity evidence ==="
cat "$V3_EVIDENCE"
echo
echo "=== Loading/TOP capture manifest ==="
cat "$CAPTURE_MANIFEST"
echo
echo "Capture worktree: $WORKTREE"
echo "Capture output: $WORKTREE/$CAPTURE_ROOT"
echo "TOP Runtime V3 log: $V3_LOG_PATH"
echo "Unity capture log: $LOG_PATH"
echo "Captured HEAD: $(git rev-parse HEAD)"
