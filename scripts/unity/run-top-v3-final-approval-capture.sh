#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${REPO_ROOT:-/Users/m-shogo/Developer/personal/vamp-pon}"
WORKTREE="${TOP_V3_FINAL_CAPTURE_WORKTREE:-/Users/m-shogo/Developer/personal/vamp-pon-top-v3-final-capture}"
SOURCE_REF="${TOP_V3_FINAL_CAPTURE_SOURCE_REF:-origin/main}"
UNITY_BIN="${UNITY_BIN:-/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity}"

NORMALIZER="scripts/quality/fix-loading-seasonal-editor-source-paths.py"
READINESS_FIXER="scripts/quality/fix-loading-top-capture-readiness.py"
CAPTURE_CHECKER="scripts/quality/check-loading-top-capture-pack.ts"
V3_CHECKER="scripts/quality/check-top-living-night-runtime-v3.ts"
BOUNDARY_CHECKER="scripts/quality/check-loading-top-runtime-boundary.ts"

CAPTURE_ROOT="docs/design-targets/generated/loading-seasonal-v1/runtime-captures"
CAPTURE_MANIFEST="docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json"
V3_EVIDENCE="docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json"

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

echo "Fetching current origin/main ..."
git fetch origin main

git cat-file -e "${SOURCE_REF}^{commit}" 2>/dev/null || fail "Capture source ref does not resolve to a commit: $SOURCE_REF"
SOURCE_COMMIT="$(git rev-parse "${SOURCE_REF}^{commit}")"
SOURCE_SHORT="${SOURCE_COMMIT:0:8}"
EVIDENCE_BRANCH="${TOP_V3_FINAL_EVIDENCE_BRANCH:-agent/top-v3-final-approval-evidence-${SOURCE_SHORT}}"

if [[ "$EVIDENCE_BRANCH" == "main" || "$EVIDENCE_BRANCH" == "refs/heads/main" ]]; then
  fail "Evidence branch must never be main"
fi

registered=false
if git worktree list --porcelain | grep -Fqx "worktree $WORKTREE"; then
  registered=true
fi

if [[ -e "$WORKTREE" && "$registered" != true ]]; then
  fail "Path already exists but is not a registered git worktree: $WORKTREE"
fi

if [[ "$registered" == true ]]; then
  echo "Refreshing isolated final-approval capture worktree: $WORKTREE"
  git -C "$WORKTREE" reset --hard "$SOURCE_COMMIT"
else
  echo "Creating isolated final-approval capture worktree: $WORKTREE"
  git worktree add --detach "$WORKTREE" "$SOURCE_COMMIT"
fi

cd "$WORKTREE"

PROJECT_PATH="$WORKTREE/unity/VampPonUnity"
LOG_PATH="$PROJECT_PATH/Logs/loading_top_final_approval_capture.log"
V3_LOG_PATH="$PROJECT_PATH/Logs/top_living_night_v3_final_approval_verification.log"

# Remove only generated runtime staging/capture outputs. Source files must stay byte-identical
# to SOURCE_COMMIT; this runner never patches or commits production code.
git clean -fdx -- \
  unity/VampPonUnity/Assets/Resources/LoadingSeasonal \
  unity/VampPonUnity/Assets/Resources/LoadingSeasonal.meta \
  unity/VampPonUnity/Assets/Resources/TopLivingNight \
  unity/VampPonUnity/Assets/Resources/TopLivingNight.meta \
  unity/VampPonUnity/Assets/Resources/TopLivingNightV3Generated \
  unity/VampPonUnity/Assets/Resources/TopLivingNightV3Generated.meta \
  "$CAPTURE_ROOT"

git reset --hard "$SOURCE_COMMIT"

for required in \
  "$NORMALIZER" \
  "$READINESS_FIXER" \
  "$CAPTURE_CHECKER" \
  "$V3_CHECKER" \
  "$BOUNDARY_CHECKER" \
  "$CAPTURE_MANIFEST" \
  "$V3_EVIDENCE"
do
  [[ -f "$required" ]] || fail "Required final-approval capture input is missing: $required"
done

# Final approval evidence must come from committed current-main source bytes. If these
# checks would need a source mutation, fix that in a normal PR first and rerun here.
python3 "$NORMALIZER" --check
python3 "$READINESS_FIXER" --check
node --experimental-strip-types "$V3_CHECKER"
node --experimental-strip-types "$BOUNDARY_CHECKER"
node --experimental-strip-types "$CAPTURE_CHECKER"

if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  fail "Preflight mutated tracked source files; final-approval capture requires a clean source commit"
fi

mkdir -p "$(dirname "$LOG_PATH")"
rm -f "$LOG_PATH" "$V3_LOG_PATH"

echo "Capture source commit: $SOURCE_COMMIT"
echo "Evidence branch: $EVIDENCE_BRANCH"

echo
echo "Verifying TOP Runtime V3 against the exact source commit ..."
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
  print_log_failure_context "TOP Runtime V3 verification" "$V3_LOG_PATH"
  exit "$v3_status"
fi

python3 - "$V3_EVIDENCE" "$SOURCE_COMMIT" <<'PY'
import json
from pathlib import Path
import re
import sys

path = Path(sys.argv[1])
source_commit = sys.argv[2]
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
        raise SystemExit(
            f"TOP Runtime V3 evidence mismatch: {key} expected={expected!r} actual={data.get(key)!r}"
        )
if data.get("verifiedCommit") != source_commit:
    raise SystemExit(
        "TOP Runtime V3 evidence commit mismatch: "
        f"expected={source_commit} actual={data.get('verifiedCommit')!r}"
    )
if data.get("sourceCompositeKind") != "final-core5":
    raise SystemExit(
        f"Final approval requires sourceCompositeKind=final-core5, got {data.get('sourceCompositeKind')!r}"
    )
if not isinstance(data.get("sourceCompositePath"), str) or not data["sourceCompositePath"]:
    raise SystemExit("TOP Runtime V3 sourceCompositePath is missing")
if not re.fullmatch(r"[0-9a-f]{64}", data.get("sourceCompositeSha256", "")):
    raise SystemExit("TOP Runtime V3 sourceCompositeSha256 is missing/invalid")
PY

echo "TOP Runtime V3 Unity verification: PASS"

echo
echo "Launching Unity for the formal 15-frame Loading -> TOP capture pack ..."
set +e
"$UNITY_BIN" \
  -projectPath "$PROJECT_PATH" \
  -executeMethod VampPon.UnitySpike.Editor.LoadingTopAutomatedCapture.RunFromCommandLine \
  -logFile "$LOG_PATH"
unity_status=$?
set -e

if [[ $unity_status -ne 0 ]]; then
  print_log_failure_context "Loading/TOP automated capture" "$LOG_PATH"
  exit "$unity_status"
fi

python3 - "$CAPTURE_MANIFEST" "$SOURCE_COMMIT" "$V3_EVIDENCE" <<'PY'
import json
from pathlib import Path
import sys

capture_path = Path(sys.argv[1])
source_commit = sys.argv[2]
v3_path = Path(sys.argv[3])

capture = json.loads(capture_path.read_text(encoding="utf-8"))
v3 = json.loads(v3_path.read_text(encoding="utf-8"))

if capture.get("executed") is not True or capture.get("result") != "PASSED":
    raise SystemExit(
        "Unity exited without a PASSED 15-frame capture manifest: "
        f"executed={capture.get('executed')} result={capture.get('result')} "
        f"count={capture.get('captureCount')} error={capture.get('error')!r}"
    )
if capture.get("expectedCaptureCount") != 15 or capture.get("captureCount") != 15:
    raise SystemExit(
        f"Final approval capture count must be 15/15, got "
        f"{capture.get('captureCount')}/{capture.get('expectedCaptureCount')}"
    )
if not isinstance(capture.get("captures"), list) or len(capture["captures"]) != 15:
    raise SystemExit("Final approval capture list must contain exactly 15 frames")
if v3.get("verifiedCommit") != source_commit:
    raise SystemExit("Capture cannot bind to V3 evidence from a different source commit")
if v3.get("sourceCompositeKind") != "final-core5":
    raise SystemExit("Capture cannot bind to bridge V3 evidence for final approval")

capture["sourceCommit"] = source_commit
capture["topCompositeKind"] = v3["sourceCompositeKind"]
capture["topCompositePath"] = v3["sourceCompositePath"]
capture["topCompositeSha256"] = v3["sourceCompositeSha256"]
capture_path.write_text(json.dumps(capture, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
PY

node --experimental-strip-types "$CAPTURE_CHECKER"

# Commit evidence only. Generated Resources and logs are intentionally excluded.
git add "$CAPTURE_ROOT" "$CAPTURE_MANIFEST" "$V3_EVIDENCE"
if git diff --cached --quiet; then
  fail "Unity reported PASS but no formal capture/V3 evidence changed"
fi

git commit -m "test: record TOP V3 final-approval capture evidence"

echo "Pushing evidence-only branch: $EVIDENCE_BRANCH"
git push origin "HEAD:refs/heads/$EVIDENCE_BRANCH"

echo
echo "=== Final-approval capture complete ==="
echo "source commit: $SOURCE_COMMIT"
echo "evidence commit: $(git rev-parse HEAD)"
echo "evidence branch: $EVIDENCE_BRANCH"
echo "capture manifest: $WORKTREE/$CAPTURE_MANIFEST"
echo "capture output: $WORKTREE/$CAPTURE_ROOT"
echo "V3 log: $V3_LOG_PATH"
echo "capture log: $LOG_PATH"
echo
echo "NEXT: open a PR from $EVIDENCE_BRANCH to main, then run formal human review and device evidence against source commit $SOURCE_COMMIT."
