#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

STATUS="docs/design-targets/generated/top-living-night-v3/final-art-status.json"
VENV="${TOP_REVIEW_VENV:-$ROOT/.venv}"
PYTHON="$VENV/bin/python"

if [[ ! -f "$STATUS" ]]; then
  echo "missing final-art status: $STATUS" >&2
  exit 1
fi

CANDIDATE_READY="$(node --input-type=module - "$STATUS" <<'NODE'
import fs from 'node:fs';
const status=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
process.stdout.write(status.candidateGenerated ? 'true' : 'false');
NODE
)"

if [[ "$CANDIDATE_READY" != "true" ]]; then
  echo "TOP final review pack: NOT_READY"
  echo "NEXT=final-candidate"
  node --experimental-strip-types scripts/quality/check-top-living-night-readiness-summary.ts
  exit 0
fi

if [[ ! -x "$PYTHON" ]]; then
  python3 -m venv "$VENV"
fi
"$PYTHON" -m pip install --disable-pip-version-check -q -r requirements.txt

"$PYTHON" scripts/unity/generate-top-living-night-crop-review-pack.py
node --experimental-strip-types scripts/unity/create-top-living-night-static-review-template.ts
node --experimental-strip-types scripts/unity/create-top-living-night-runtime-review-templates.ts
node --experimental-strip-types scripts/quality/check-top-living-night-final-art-candidate.ts
node --experimental-strip-types scripts/quality/check-top-living-night-core5-candidate-provenance.ts
node --experimental-strip-types scripts/quality/check-top-living-night-crop-review.ts
node --experimental-strip-types scripts/quality/check-top-living-night-readiness-summary.ts \
  | tee docs/design-targets/generated/top-living-night-v3/readiness-summary.txt

echo "TOP final review pack: READY"
echo "crop previews: docs/design-targets/generated/top-living-night-v3/crop-review-previews"
echo "review inputs: docs/design-targets/generated/top-living-night-v3/review-inputs"
echo "NOTE: generated previews/templates are convenience artifacts only; no review or approval flag is promoted."
