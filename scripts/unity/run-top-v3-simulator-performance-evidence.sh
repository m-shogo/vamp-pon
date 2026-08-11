#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

bash scripts/unity/verify-top-living-night-installed-build-provenance.sh simulator
exec bash scripts/unity/run-top-living-night-simulator-performance-evidence.sh
