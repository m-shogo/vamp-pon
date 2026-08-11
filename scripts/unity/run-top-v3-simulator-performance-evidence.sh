#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

PROVENANCE_HELPER="scripts/unity/verify-top-v3-same-launch-build-provenance.sh"
RAW_RUNNER="scripts/unity/run-top-living-night-simulator-performance-evidence.sh"

bash "$PROVENANCE_HELPER" prepare simulator

bash "$RAW_RUNNER" &
PERF_PID=$!

cleanup() {
  if kill -0 "$PERF_PID" >/dev/null 2>&1; then
    kill "$PERF_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM

# The performance launch itself activates VampPonBuildProvenanceProbe. Validate
# that exact measured process before allowing its 300s artifact to be registered.
if ! bash "$PROVENANCE_HELPER" wait simulator; then
  echo "TOP Simulator performance aborted: measured process build provenance failed" >&2
  exit 1
fi

set +e
wait "$PERF_PID"
status=$?
set -e
trap - EXIT INT TERM

if [[ $status -ne 0 ]]; then
  echo "TOP Simulator performance runner failed after same-launch provenance PASS" >&2
  exit "$status"
fi

echo "TOP Simulator same-launch build provenance + performance evidence: PASS"
