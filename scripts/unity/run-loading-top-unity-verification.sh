#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PROJECT_PATH="$REPO_ROOT/unity/VampPonUnity"
UNITY_BIN="${UNITY_BIN:-/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity}"
LOG_PATH="$PROJECT_PATH/Logs/loading_top_unity_verification.log"

if [[ ! -x "$UNITY_BIN" ]]; then
  echo "Unity executable not found: $UNITY_BIN" >&2
  echo "Set UNITY_BIN to the Unity 6000.5.1f1 executable." >&2
  exit 1
fi

mkdir -p "$(dirname "$LOG_PATH")"

set +e
"$UNITY_BIN" \
  -batchmode \
  -quit \
  -projectPath "$PROJECT_PATH" \
  -executeMethod VampPon.UnitySpike.Editor.LoadingTopUnityVerificationV2.RunBatchmode \
  -logFile "$LOG_PATH"
unity_status=$?
set -e

if [[ $unity_status -ne 0 ]]; then
  echo "Loading -> TOP Unity verification failed with exit code $unity_status." >&2
  echo "Last 160 Unity log lines:" >&2
  tail -n 160 "$LOG_PATH" >&2 || true
  exit "$unity_status"
fi

cd "$REPO_ROOT"
node --experimental-strip-types scripts/quality/check-loading-top-runtime-boundary.ts
node --experimental-strip-types scripts/quality/check-top-living-night-runtime-v3.ts

echo "Loading -> TOP Unity verification completed."
echo "Evidence: docs/design-targets/generated/loading-seasonal-v1/runtime-unity-verification.json"
echo "Unity log: $LOG_PATH"
