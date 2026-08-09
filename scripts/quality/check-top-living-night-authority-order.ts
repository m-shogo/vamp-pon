import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const v1Path = join(root, 'docs/design-targets/generated/top-living-night-v1/README.md');
const v2Path = join(root, 'docs/design-targets/generated/top-living-night-v2/README.md');
const v3Path = join(root, 'docs/design-targets/generated/top-living-night-v3/README.md');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const path of [v1Path, v2Path, v3Path]) {
  invariant(existsSync(path), `TOP authority document missing: ${path}`);
}

const v1 = readFileSync(v1Path, 'utf8');
const v2 = readFileSync(v2Path, 'utf8');
const v3 = readFileSync(v3Path, 'utf8');

for (const token of [
  'HISTORICAL_CANDIDATE_BATCH / SUPERSEDED_BY_V2_V3',
  'Current authority: `docs/design-targets/generated/top-living-night-v3/`',
  'Do not promote any v1 candidate directly to final/runtime approval.',
]) {
  invariant(v1.includes(token), `TOP v1 historical authority boundary missing: ${token}`);
}

for (const token of [
  'V2_LAYER_KIT_VERIFIED / V3_RUNTIME_RECAPTURE_REQUIRED / FINAL_ART_BLOCKED',
  'verified 17-asset production layer kit and motion-source authority',
  'not final Core5 key art',
]) {
  invariant(v2.includes(token), `TOP v2 supporting authority boundary missing: ${token}`);
}

for (const token of [
  'CURRENT_AUTHORITY / FINAL_ART_AND_RUNTIME_APPROVAL_BLOCKED',
  'This directory is the current approval authority',
  'final-art-status.json',
  'core5-identity-review-status.json',
  'crop-review-status.json',
  'motion-review-status.json',
  'runtime-unity-verification.json',
  'finalApprovalBlocked=true',
]) {
  invariant(v3.includes(token), `TOP v3 current authority boundary missing: ${token}`);
}

invariant(
  !v1.includes('CURRENT_AUTHORITY /'),
  'TOP v1 must never present itself as current authority',
);
invariant(
  !v2.includes('CURRENT_AUTHORITY /'),
  'TOP v2 must never present itself as current approval authority',
);
invariant(
  !v3.includes('approvedAsFinal=true\nruntimeApproved=true'),
  'TOP v3 authority must not contain an unconditional final/runtime approval state',
);

console.log('TOP Living Night authority order: PASS');
console.log('v1: historical candidate exploration');
console.log('v2: verified layer/motion source kit');
console.log('v3: current approval authority');
