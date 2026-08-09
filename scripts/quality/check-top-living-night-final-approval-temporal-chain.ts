import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8')) as any;
const finalArt = read('docs/design-targets/generated/top-living-night-v3/final-art-status.json');
const unity = read('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');
const capture = read('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');
const motion = read('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');
const human = read('docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function time(value: string, label: string): number {
  invariant(typeof value === 'string' && value.length > 0, `${label} timestamp is missing`);
  const parsed = Date.parse(value);
  invariant(Number.isFinite(parsed), `${label} timestamp is invalid`);
  return parsed;
}

if (!finalArt.approvedAsFinal) {
  invariant(finalArt.finalApprovalBlocked, 'non-final TOP must remain approval-blocked');
  console.log('TOP final approval temporal chain: honest blocked boundary');
  process.exit(0);
}

invariant(finalArt.runtimeApproved, 'final approval requires runtimeApproved');
invariant(unity.executed && unity.result === 'PASSED', 'final approval requires PASSED Unity V3 evidence');
invariant(capture.executed && capture.result === 'PASSED', 'final approval requires PASSED 15-frame capture evidence');
invariant(motion.motionApproved, 'final approval requires approved motion evidence');
invariant(human.executed && human.result === 'PASSED' && human.humanVisualReviewComplete, 'final approval requires PASSED human review');

const unityAt = time(unity.generatedAtUtc, 'Unity V3');
const captureAt = time(capture.generatedAtUtc, 'capture');
const motionAt = time(motion.reviewedAtUtc, 'motion');
const humanAt = time(human.reviewedAtUtc, 'human review');
const finalAt = time(finalArt.reviewedAtUtc, 'final approval');

invariant(captureAt >= unityAt, 'capture evidence cannot predate Unity V3 verification');
invariant(motionAt >= unityAt, 'motion review cannot predate Unity V3 verification');
invariant(humanAt >= captureAt, 'human review cannot predate the 15-frame capture pack it reviews');
invariant(finalAt >= Math.max(unityAt, captureAt, motionAt, humanAt), 'final approval cannot predate any required current evidence');

console.log('TOP final approval temporal chain: PASS');
console.log('Unity -> capture/human and Unity -> motion evidence chronology is coherent before final approval');
