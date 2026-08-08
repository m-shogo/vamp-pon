import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const runnerRelative = 'scripts/unity/run-top-living-night-v3-unity-verification.sh';
const runnerPath = join(root, runnerRelative);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(runnerPath), 'standalone TOP Runtime V3 Unity runner is missing');
const runner = readFileSync(runnerPath, 'utf8');

for (const token of [
  'TopLivingNightCompositeV3UnityVerification.RunBatchmode',
  'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json',
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  'check-top-living-night-runtime-v3.ts',
  'check-top-living-night-unity-evidence.ts',
  'check-top-runtime-temporal-coherence.ts',
  'check-top-runtime-execution-dependencies.ts',
  "evidence.verifiedCommit !== sourceCommit",
  "finalStatus.candidateGenerated",
  "evidence.sourceCompositeKind !== 'final-core5'",
  "evidence.sourceCompositePath !== finalStatus.candidatePath",
  "evidence.sourceCompositeSha256 !== finalStatus.candidateSha256",
  "evidence.sourceCompositeKind !== 'bridge'",
  'does not approve final art',
]) {
  invariant(runner.includes(token), `standalone V3 Unity runner contract missing: ${token}`);
}

const syntax = spawnSync('bash', ['-n', runnerRelative], { cwd: root, encoding: 'utf8' });
invariant(
  syntax.status === 0,
  `standalone V3 Unity runner bash syntax failed:\n${syntax.stdout}\n${syntax.stderr}`,
);

console.log('TOP Runtime V3 standalone Unity runner contract: PASS');
console.log('runner binds evidence to exact HEAD and exact current bridge/final-core5 authority without promoting approval');
