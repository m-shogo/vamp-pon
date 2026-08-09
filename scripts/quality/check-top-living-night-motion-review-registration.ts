import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const scriptPath = 'scripts/unity/register-top-living-night-motion-review.ts';
const guardedPaths = [
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  'docs/design-targets/generated/top-living-night-v3/motion-review-status.json',
];
function invariant(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
const script = readFileSync(join(root, scriptPath), 'utf8');
for (const token of [
  "const dryRun = process.argv.includes('--dry-run')",
  "unity.executed === true && unity.result === 'PASSED'",
  "unity.sourceCompositeKind === 'final-core5'",
  'unity.sourceCompositeSha256 === finalArt.candidateSha256',
  'input.candidateSha256 === finalArt.candidateSha256',
  'input.verifiedCommit === unity.verifiedCommit',
  'input.unityVersion === unity.unityVersion',
  'input.normalMotion.reviewDurationSeconds >= 300',
  'input.reducedMotion.reviewDurationSeconds >= 60',
  "'liveToggleToReducedSettled'",
  "'liveToggleBackToNormalSettled'",
  "'noToggleVisualPopOrDuplication'",
  'input.reducedMotion.liveToggleToReducedSettled',
  'input.reducedMotion.liveToggleBackToNormalSettled',
  'input.reducedMotion.noToggleVisualPopOrDuplication',
  'motion.candidateSha256 = finalArt.candidateSha256',
  'motion.verifiedCommit = unity.verifiedCommit',
  'motion.motionApproved = approved',
  'motion.runtimeApproved = false',
  'finalArt.motionSeparationReviewed = approved',
  'finalArt.runtimeApproved = false',
  'finalArt.approvedAsFinal = false',
]) invariant(script.includes(token), `TOP motion review registration contract missing: ${token}`);
for (const forbidden of ['writeJson(paths.identity','writeJson(paths.crop','writeJson(paths.human','writeJson(paths.unity','writeJson(paths.capture','writeJson(paths.device']) {
  invariant(!script.includes(forbidden), `TOP motion review registrar must not rewrite source/other review evidence: ${forbidden}`);
}
const before = new Map(guardedPaths.map(path => [path, readFileSync(join(root, path), 'utf8')]));
const run = spawnSync(process.execPath, ['--experimental-strip-types', scriptPath, '--dry-run'], { cwd: root, encoding: 'utf8' });
invariant(run.status === 0, `TOP motion review dry-run failed:\n${run.stdout}\n${run.stderr}`);
invariant(run.stdout.includes('TOP motion review registration: DRY_RUN_READY'), 'motion review dry-run did not report readiness');
invariant(run.stdout.includes('live OFF->ON->OFF toggle observations'), 'motion review dry-run must disclose live toggle evidence requirement');
for (const [path, content] of before) invariant(readFileSync(join(root, path), 'utf8') === content, `motion review dry-run mutated evidence: ${path}`);
console.log('TOP Living Night motion review registration safety: PASS');
console.log('dry-run mutation-free; exact candidate/Unity provenance + 5m/1m durations + live Reduced Motion toggle observations derive PASS/FAILED; final promotion remains separate');
