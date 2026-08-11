#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

PROJECT_PATH="$ROOT/unity/VampPonUnity"
UNITY_BIN="${UNITY_BIN:-/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity}"
LOG_PATH="${VAMPPON_PAVEMENT_HAMMER_EVIDENCE_LOG:-$PROJECT_PATH/Logs/pavement_hammer_runtime_evidence.log}"
EVIDENCE="docs/design-targets/generated/unity-selected-base-weapons/pavement-hammer/runtime-evidence.json"
HARNESS="unity/VampPonUnity/Assets/_Project/Scripts/Editor/PavementHammerPrototypeRuntimeEvidence.cs"
SOURCE_INPUTS=(
  "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PavementHammerPrototypeRuntime.cs"
  "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemySlamWaveQueryRuntime.cs"
  "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyKnockbackRuntime.cs"
  "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyBreakStaggerRuntime.cs"
  "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs"
  "unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs"
  "$HARNESS"
)

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

[[ -x "$UNITY_BIN" ]] || fail "Unity 6000.5.1f1 executable not found: $UNITY_BIN"
[[ -f "$EVIDENCE" ]] || fail "Pavement Hammer runtime evidence boundary missing: $EVIDENCE"
for source in "${SOURCE_INPUTS[@]}"; do
  [[ -f "$source" ]] || fail "Pavement Hammer evidence source missing: $source"
done

SOURCE_COMMIT="$(git rev-parse HEAD)"
[[ "$SOURCE_COMMIT" =~ ^[0-9a-f]{40}$ ]] || fail "could not resolve source commit"

# Evidence is meaningful only when the exact runtime/harness inputs match HEAD. Unrelated
# story/original-authority worktree edits do not block this game-side runner.
if ! git diff --quiet HEAD -- "${SOURCE_INPUTS[@]}"; then
  fail "Pavement Hammer runtime/harness inputs have uncommitted tracked changes; commit them before evidence capture"
fi
if ! git diff --cached --quiet HEAD -- "${SOURCE_INPUTS[@]}"; then
  fail "Pavement Hammer runtime/harness inputs have staged changes; commit them before evidence capture"
fi

mkdir -p "$(dirname "$LOG_PATH")"
rm -f "$LOG_PATH"

echo "Running Pavement Hammer Unity runtime evidence for $SOURCE_COMMIT ..."
set +e
VAMPPON_PAVEMENT_HAMMER_EVIDENCE_SOURCE_COMMIT="$SOURCE_COMMIT" \
"$UNITY_BIN" \
  -batchmode \
  -quit \
  -projectPath "$PROJECT_PATH" \
  -executeMethod VampPon.UnitySpike.Editor.PavementHammerPrototypeRuntimeEvidence.RunBatchmode \
  -logFile "$LOG_PATH"
status=$?
set -e

if [[ $status -ne 0 ]]; then
  echo "Pavement Hammer Unity runtime evidence failed with exit code $status" >&2
  tail -n 220 "$LOG_PATH" >&2 || true
  exit "$status"
fi

# Bind the evidence to the exact harness bytes too. The Unity payload binds all runtime
# sources; this host step adds the runner-owned harness SHA before repository validation.
node --input-type=module - "$EVIDENCE" "$HARNESS" <<'NODE'
import crypto from 'node:crypto';
import fs from 'node:fs';
const [evidencePath, harnessPath] = process.argv.slice(2);
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const sha256 = path => crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
if (!evidence.sourceSha256 || typeof evidence.sourceSha256 !== 'object') {
  throw new Error('Pavement Hammer evidence sourceSha256 object missing');
}
evidence.sourceSha256.evidenceHarness = sha256(harnessPath);
fs.writeFileSync(evidencePath, JSON.stringify(evidence, null, 2) + '\n');
NODE

node --experimental-strip-types scripts/quality/check-unity-pavement-hammer-runtime-evidence.ts

node --input-type=module - "$EVIDENCE" "$SOURCE_COMMIT" <<'NODE'
import fs from 'node:fs';
const [evidencePath, sourceCommit] = process.argv.slice(2);
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
const fail = message => { console.error(message); process.exit(1); };
if (!evidence.executed || evidence.result !== 'PASSED') fail('runner requires PASSED Pavement Hammer evidence');
if (evidence.sourceCommit !== sourceCommit) fail(`sourceCommit mismatch: expected=${sourceCommit} actual=${evidence.sourceCommit}`);
NODE

echo "Pavement Hammer Unity runtime evidence: PASS"
echo "source commit: $SOURCE_COMMIT"
echo "evidence: $EVIDENCE"
echo "Unity log: $LOG_PATH"
echo "NOTE: TEST_ONLY prototype evidence only; this does not connect live Stage1, set Canon tuning, or promote runtimeStatus."
