#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

PROJECT_PATH="$ROOT/unity/VampPonUnity"
UNITY_BIN="${UNITY_BIN:-/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity}"
LOG_PATH="$PROJECT_PATH/Logs/top_living_night_v3_verification.log"
EVIDENCE="docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json"
FINAL_STATUS="docs/design-targets/generated/top-living-night-v3/final-art-status.json"

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

[[ -x "$UNITY_BIN" ]] || fail "Unity 6000.5.1f1 executable not found: $UNITY_BIN"
[[ -f "$EVIDENCE" ]] || fail "V3 evidence boundary missing: $EVIDENCE"
[[ -f "$FINAL_STATUS" ]] || fail "final-art authority missing: $FINAL_STATUS"

SOURCE_COMMIT="$(git rev-parse HEAD)"
if [[ ! "$SOURCE_COMMIT" =~ ^[0-9a-f]{40}$ ]]; then
  fail "could not resolve source commit"
fi

mkdir -p "$(dirname "$LOG_PATH")"
rm -f "$LOG_PATH"

echo "Running TOP Runtime V3 Unity verification for $SOURCE_COMMIT ..."
set +e
"$UNITY_BIN" \
  -batchmode \
  -quit \
  -projectPath "$PROJECT_PATH" \
  -executeMethod VampPon.UnitySpike.Editor.TopLivingNightCompositeV3UnityVerification.RunBatchmode \
  -logFile "$LOG_PATH"
status=$?
set -e

if [[ $status -ne 0 ]]; then
  echo "TOP Runtime V3 Unity verification failed with exit code $status" >&2
  tail -n 180 "$LOG_PATH" >&2 || true
  exit "$status"
fi

node --experimental-strip-types scripts/quality/check-top-living-night-runtime-v3.ts
node --experimental-strip-types scripts/quality/check-top-living-night-unity-evidence.ts
node --experimental-strip-types scripts/quality/check-top-runtime-temporal-coherence.ts
node --experimental-strip-types scripts/quality/check-top-runtime-execution-dependencies.ts

node --input-type=module - "$EVIDENCE" "$FINAL_STATUS" "$SOURCE_COMMIT" <<'NODE'
import fs from 'node:fs';
const [evidencePath, finalStatusPath, sourceCommit] = process.argv.slice(2);
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const finalStatus = JSON.parse(fs.readFileSync(finalStatusPath, 'utf8'));
const fail = message => { console.error(message); process.exit(1); };

if (!evidence.executed || evidence.result !== 'PASSED')
  fail('V3 Unity runner requires PASSED evidence');
if (evidence.verifiedCommit !== sourceCommit)
  fail(`V3 verifiedCommit mismatch: expected=${sourceCommit} actual=${evidence.verifiedCommit}`);
if (!['bridge','final-core5'].includes(evidence.sourceCompositeKind))
  fail(`invalid V3 sourceCompositeKind: ${evidence.sourceCompositeKind}`);
if (!/^[0-9a-f]{64}$/.test(evidence.sourceCompositeSha256 || ''))
  fail('V3 source composite SHA-256 is invalid');

if (finalStatus.candidateGenerated) {
  if (evidence.sourceCompositeKind !== 'final-core5')
    fail('registered final candidate must verify through final-core5 source, not bridge');
  if (evidence.sourceCompositePath !== finalStatus.candidatePath)
    fail('V3 final-core5 path does not match final-art authority');
  if (evidence.sourceCompositeSha256 !== finalStatus.candidateSha256)
    fail('V3 final-core5 SHA does not match final-art authority');
} else if (evidence.sourceCompositeKind !== 'bridge') {
  fail('pre-candidate V3 verification must remain on the verified bridge');
}
NODE

echo "TOP Runtime V3 Unity verification: PASS"
echo "source commit: $SOURCE_COMMIT"
echo "evidence: $EVIDENCE"
echo "Unity log: $LOG_PATH"
echo "NOTE: this verifies runtime source/import/shader/build contract only; it does not approve final art or replace capture/human/device gates."
