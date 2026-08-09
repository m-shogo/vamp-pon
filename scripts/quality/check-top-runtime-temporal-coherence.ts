import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8')) as any;

const unity = read('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');
const motion = read('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function validUtc(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) && Number.isFinite(Date.parse(value));
}

if (!unity.executed) {
  invariant(unity.result === 'NOT_RUN', 'unexecuted V3 Unity evidence must remain NOT_RUN');
  invariant(unity.generatedAtUtc === '', 'unexecuted V3 Unity evidence must not retain timestamp');
  invariant(unity.verifiedCommit === '', 'unexecuted V3 Unity evidence must not retain commit');
} else {
  invariant(unity.result === 'PASSED', 'executed V3 Unity evidence must be PASSED');
  invariant(validUtc(unity.generatedAtUtc), 'executed V3 Unity evidence requires canonical UTC timestamp');
  invariant(/^[0-9a-f]{40}$/.test(unity.verifiedCommit), 'executed V3 Unity evidence requires source commit');
}

const normalExecuted = Boolean(motion.normalMotion?.executed);
const reducedExecuted = Boolean(motion.reducedMotion?.executed);
const anyMotionExecuted = normalExecuted || reducedExecuted;

if (!anyMotionExecuted) {
  invariant(motion.reviewedAtUtc === '', 'unexecuted motion evidence must not retain timestamp');
  invariant(motion.verifiedCommit === '', 'unexecuted motion evidence must not retain commit');
  invariant(motion.normalMotion.reviewDurationSeconds === 0, 'unexecuted normal motion duration must be zero');
  invariant(motion.reducedMotion.reviewDurationSeconds === 0, 'unexecuted Reduced Motion duration must be zero');
  console.log('TOP runtime temporal coherence: honest NOT_RUN boundary');
  process.exit(0);
}

invariant(unity.executed && unity.result === 'PASSED', 'executed motion review requires PASSED current V3 Unity evidence');
invariant(validUtc(motion.reviewedAtUtc), 'executed motion review requires canonical UTC timestamp');
invariant(motion.verifiedCommit === unity.verifiedCommit, 'motion review and V3 Unity evidence must target one source commit');
invariant(Date.parse(motion.reviewedAtUtc) >= Date.parse(unity.generatedAtUtc), 'motion review cannot predate its V3 Unity verification');

if (normalExecuted) {
  invariant(motion.normalMotion.reviewDurationSeconds >= 300, 'normal motion evidence must cover at least five minutes');
} else {
  invariant(motion.normalMotion.reviewDurationSeconds === 0, 'NOT_RUN normal motion duration must remain zero');
}

if (reducedExecuted) {
  invariant(motion.reducedMotion.reviewDurationSeconds >= 60, 'Reduced Motion evidence must cover at least one minute');
} else {
  invariant(motion.reducedMotion.reviewDurationSeconds === 0, 'NOT_RUN Reduced Motion duration must remain zero');
}

console.log(`TOP runtime temporal coherence: PASS unity=${unity.generatedAtUtc} motion=${motion.reviewedAtUtc}`);
