#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-/Users/m-shogo/Developer/personal/vamp-pon}"
WORKTREE="${TOP_WORKTREE:-/Users/m-shogo/Developer/personal/vamp-pon-pr78-top}"
SOURCE_BRANCH="agent/top-living-night-key-art-v1"
RUNNER="scripts/unity/run-top-living-night-unity-verification.sh"
EVIDENCE="docs/design-targets/generated/top-living-night-v2/runtime-unity-verification.json"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

[[ -d "$REPO_ROOT/.git" ]] || fail "Git repository not found: $REPO_ROOT"

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
  echo "Refreshing existing verification worktree: $WORKTREE"
  git -C "$WORKTREE" reset --hard "origin/$SOURCE_BRANCH"
else
  echo "Creating isolated verification worktree: $WORKTREE"
  git worktree add --detach "$WORKTREE" "origin/$SOURCE_BRANCH"
fi

cd "$WORKTREE"
[[ -f "$RUNNER" ]] || fail "Runner is missing after checkout: $RUNNER"
chmod +x "$RUNNER"

bash "$RUNNER"
node --experimental-strip-types scripts/quality/check-top-living-night-unity-evidence.ts

if ! git diff --quiet -- "$EVIDENCE"; then
  git add "$EVIDENCE"
  git commit -m "test: record TOP Unity verification evidence"
  echo "Pushing verified evidence to $SOURCE_BRANCH ..."
  git push origin "HEAD:$SOURCE_BRANCH"
else
  echo "Unity verification completed, but evidence did not change."
fi

echo
echo "=== TOP Unity evidence ==="
cat "$EVIDENCE"
echo
echo "Verification worktree: $WORKTREE"
echo "Verified HEAD: $(git rev-parse HEAD)"
