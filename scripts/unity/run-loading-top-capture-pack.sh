#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-/Users/m-shogo/Developer/personal/vamp-pon}"
WORKTREE="${LOADING_CAPTURE_WORKTREE:-/Users/m-shogo/Developer/personal/vamp-pon-pr78-capture}"
SOURCE_BRANCH="agent/top-living-night-key-art-v1"
UNITY_BIN="${UNITY_BIN:-/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity}"
PROJECT_PATH="$WORKTREE/unity/VampPonUnity"
LOG_PATH="$PROJECT_PATH/Logs/loading_top_automated_capture.log"
NORMALIZER="scripts/quality/fix-loading-seasonal-editor-source-paths.py"
CHECKER="scripts/quality/check-loading-top-capture-pack.ts"
CAPTURE_ROOT="docs/design-targets/generated/loading-seasonal-v1/runtime-captures"
CAPTURE_MANIFEST="docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json"
LOADING_VIEW="unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/LoadingSeasonalView.cs"

fail() {
  echo "ERROR: $*" >&2
  exit 1
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
    "$CAPTURE_ROOT"
else
  echo "Creating isolated capture worktree: $WORKTREE"
  git worktree add --detach "$WORKTREE" "origin/$SOURCE_BRANCH"
fi

cd "$WORKTREE"
[[ -f "$NORMALIZER" ]] || fail "Editor path normalizer missing: $NORMALIZER"
[[ -f "$CHECKER" ]] || fail "Capture checker missing: $CHECKER"
[[ -f "$CAPTURE_MANIFEST" ]] || fail "Capture manifest boundary missing: $CAPTURE_MANIFEST"

python3 "$NORMALIZER"
if ! git diff --quiet -- "$LOADING_VIEW"; then
  git add "$LOADING_VIEW"
  git commit -m "fix: use final seasonal art in editor loading"
  echo "Pushing final seasonal Editor path fix ..."
  git push origin "HEAD:$SOURCE_BRANCH"
fi
python3 "$NORMALIZER" --check

node --experimental-strip-types "$CHECKER"
mkdir -p "$(dirname "$LOG_PATH")"

echo
echo "Launching Unity for the automated 15-frame capture pack ..."
echo "Unity will open, capture all frames, and close itself automatically."
set +e
"$UNITY_BIN" \
  -projectPath "$PROJECT_PATH" \
  -executeMethod VampPon.UnitySpike.Editor.LoadingTopAutomatedCapture.RunFromCommandLine \
  -logFile "$LOG_PATH"
unity_status=$?
set -e

if [[ $unity_status -ne 0 ]]; then
  echo "Automated Loading/TOP capture failed with exit code $unity_status." >&2
  echo "Last 200 Unity log lines:" >&2
  tail -n 200 "$LOG_PATH" >&2 || true
  exit "$unity_status"
fi

node --experimental-strip-types "$CHECKER"

if git diff --quiet -- "$CAPTURE_ROOT" "$CAPTURE_MANIFEST"; then
  fail "Unity exited successfully, but no capture output changed. See $LOG_PATH"
fi

git add "$CAPTURE_ROOT" "$CAPTURE_MANIFEST"
git commit -m "test: add Loading and TOP runtime capture pack"
echo "Pushing automated Loading/TOP captures to $SOURCE_BRANCH ..."
git push origin "HEAD:$SOURCE_BRANCH"

echo
echo "=== Loading/TOP capture manifest ==="
cat "$CAPTURE_MANIFEST"
echo
echo "Capture worktree: $WORKTREE"
echo "Capture output: $WORKTREE/$CAPTURE_ROOT"
echo "Unity log: $LOG_PATH"
echo "Captured HEAD: $(git rev-parse HEAD)"
