#!/usr/bin/env bash
set -euo pipefail

# Current-main TOP Living Night V3 runtime capture harness.
#
# Reproducible from origin/main alone. It launches the Unity Editor (GUI mode,
# NOT -batchmode, so the Game View renders and ScreenCapture produces real
# frames) once per resolution, running TopV3RuntimeCaptureRunner which builds the
# real TopLivingNightView in Play Mode and captures each motion pass, then exits.
#
# One resolution per process keeps every run within the first three Play Mode
# cycles (reliable); later cycles degrade composite reconnection in the Editor.
#
# No pruned branch, no separate worktree, no Loading-Seasonal capture flow.
# It writes screenshots + a manifest only; it never promotes any approval flag.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

PROJECT_PATH="$ROOT/unity/VampPonUnity"
UNITY_BIN="${UNITY_BIN:-/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity}"
CAPTURE_ROOT="docs/design-targets/generated/top-living-night-v3/runtime-captures/current"
MANIFEST="$CAPTURE_ROOT/manifest.json"
RECORDS="$CAPTURE_ROOT/capture-records.jsonl"
RESOLUTIONS=("360x800" "390x844" "430x932")

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

[[ -x "$UNITY_BIN" ]] || fail "Unity 6000.5.1f1 executable not found: $UNITY_BIN"
[[ -d "$PROJECT_PATH" ]] || fail "Unity project not found: $PROJECT_PATH"

SOURCE_COMMIT="$(git rev-parse HEAD)"
[[ "$SOURCE_COMMIT" =~ ^[0-9a-f]{40}$ ]] || fail "could not resolve source commit"

# Fresh capture tree for the whole run.
rm -rf "$CAPTURE_ROOT"
mkdir -p "$CAPTURE_ROOT"

for resolution in "${RESOLUTIONS[@]}"; do
  LOG_PATH="$PROJECT_PATH/Logs/top_v3_runtime_capture_${resolution}.log"
  mkdir -p "$(dirname "$LOG_PATH")"
  rm -f "$LOG_PATH"
  echo "Capturing TOP V3 runtime at $resolution (commit $SOURCE_COMMIT) ..."

  set +e
  VAMPPON_CAPTURE_SOURCE_COMMIT="$SOURCE_COMMIT" \
  VAMPPON_CAPTURE_RESOLUTION="$resolution" \
  VAMPPON_CAPTURE_KEEP="1" \
    "$UNITY_BIN" \
    -projectPath "$PROJECT_PATH" \
    -executeMethod VampPon.UnitySpike.Editor.TopV3RuntimeCaptureRunner.RunFromCommandLine \
    -logFile "$LOG_PATH" &
  unity_pid=$!

  # Watchdog: GUI-mode Unity exits itself via the runner; kill it if it hangs.
  waited=0
  max_wait=600
  while kill -0 "$unity_pid" 2>/dev/null; do
    sleep 5
    waited=$((waited + 5))
    if [[ $waited -ge $max_wait ]]; then
      echo "TOP V3 capture watchdog: killing hung Unity for $resolution after ${max_wait}s" >&2
      kill -9 "$unity_pid" 2>/dev/null
      break
    fi
  done
  wait "$unity_pid"
  status=$?
  set -e

  if [[ $status -ne 0 ]]; then
    echo "TOP V3 runtime capture failed at $resolution with exit code $status" >&2
    if [[ -f "$LOG_PATH" ]]; then
      grep -nE 'error CS|Exception|FAILED|Timeout|timed out|Aborting|Crash|TOP V3' "$LOG_PATH" \
        | tail -n 60 >&2 || true
    fi
    exit "$status"
  fi
done

[[ -f "$MANIFEST" ]] || fail "capture manifest was not written: $MANIFEST"

RESULT="$(python3 -c "import json; print(json.load(open('$MANIFEST'))['result'])")"
COUNT="$(python3 -c "import json; d=json.load(open('$MANIFEST')); print(d['captureCount'],'/',d['expectedCaptureCount'])")"
if [[ "$RESULT" != "PASSED" ]]; then
  echo "TOP V3 runtime capture incomplete: result=$RESULT count=$COUNT" >&2
  exit 1
fi

# Drop the intermediate records log; the manifest is the tracked authority.
rm -f "$RECORDS"

echo "TOP V3 runtime capture: PASS ($COUNT frames)"
echo "manifest: $MANIFEST"
echo "NOTE: runtime look/motion capture only; it does not approve final art or replace human/device review."
