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

const motionExecuted = Boolean(motion.normalMotion?.executed || motion.reducedMotion?.executed);

if (!finalArt.candidateGenerated) {
  invariant(!unity.executed, 'pre-final runtime must not retain executed V3 Unity evidence');
  invariant(!capture.executed, 'pre-final runtime must not retain executed current capture evidence');
  invariant(!motionExecuted, 'pre-final runtime must not retain executed motion review');
  invariant(!human.executed, 'pre-final runtime must not retain executed human review');
  invariant(unity.result === 'NOT_RUN', 'pre-final V3 Unity evidence must remain NOT_RUN');
  invariant(capture.result === 'NOT_RUN', 'pre-final capture evidence must remain NOT_RUN');
  invariant(motion.normalMotion.result === 'NOT_RUN' && motion.reducedMotion.result === 'NOT_RUN', 'pre-final motion evidence must remain NOT_RUN');
  invariant(human.result === 'NOT_RUN', 'pre-final human review must remain NOT_RUN');
  console.log('TOP runtime execution dependencies: honest pre-final NOT_RUN boundary');
  process.exit(0);
}

if (capture.executed) {
  invariant(unity.executed && unity.result === 'PASSED', 'capture execution requires PASSED V3 Unity verification');
}
if (motionExecuted) {
  invariant(unity.executed && unity.result === 'PASSED', 'motion execution requires PASSED V3 Unity verification');
}
if (human.executed) {
  invariant(capture.executed && capture.result === 'PASSED', 'human visual review requires PASSED current 15-frame capture evidence');
}
if (finalArt.runtimeCaptureComplete) {
  invariant(unity.executed && unity.result === 'PASSED', 'runtimeCaptureComplete requires PASSED V3 Unity verification');
  invariant(capture.executed && capture.result === 'PASSED' && capture.captureCount === 15, 'runtimeCaptureComplete requires PASSED 15-frame capture');
}
if (finalArt.humanVisualReviewComplete) {
  invariant(human.executed && human.result === 'PASSED', 'humanVisualReviewComplete requires PASSED structured human review');
}

console.log('TOP runtime execution dependencies: PASS');
console.log(`unity=${unity.result} capture=${capture.result} motion=${motion.normalMotion.result}/${motion.reducedMotion.result} human=${human.result}`);
