import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const registrarPath = 'scripts/unity/register-top-living-night-final-art.ts';
const motionPath = 'docs/design-targets/generated/top-living-night-v3/motion-review-status.json';
const unityPath = 'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const path of [registrarPath, motionPath, unityPath]) {
  invariant(existsSync(join(root, path)), `TOP reset completeness input is missing: ${path}`);
}

const registrar = readFileSync(join(root, registrarPath), 'utf8');
const motion = JSON.parse(readFileSync(join(root, motionPath), 'utf8')) as any;
const unity = JSON.parse(readFileSync(join(root, unityPath), 'utf8')) as any;

const motionStart = registrar.indexOf('function resetMotion');
const humanStart = registrar.indexOf('function resetHumanReview', motionStart);
invariant(motionStart >= 0 && humanStart > motionStart, 'TOP final-art registrar lost resetMotion block');
const motionReset = registrar.slice(motionStart, humanStart);
for (const token of [
  'liveToggleToReducedSettled: false',
  'liveToggleBackToNormalSettled: false',
  'noToggleVisualPopOrDuplication: false',
]) {
  invariant(motionReset.includes(token), `TOP final-art registrar can retain stale Reduced Motion toggle evidence: ${token}`);
}

const unityStart = registrar.indexOf('function resetUnity');
const captureStart = registrar.indexOf('function resetCapture', unityStart);
invariant(unityStart >= 0 && captureStart > unityStart, 'TOP final-art registrar lost resetUnity block');
const unityReset = registrar.slice(unityStart, captureStart);
for (const token of [
  'ambientMotionDirectorResolved: false',
  'fireCadenceDirectorResolved: false',
]) {
  invariant(unityReset.includes(token), `TOP final-art registrar can retain stale Unity motion-director evidence: ${token}`);
}

if (!motion.reducedMotion?.executed) {
  invariant(motion.reducedMotion.result === 'NOT_RUN', 'unexecuted Reduced Motion review must remain NOT_RUN');
  invariant(motion.reducedMotion.liveToggleToReducedSettled === false, 'NOT_RUN motion status cannot retain Reduced Motion toggle success');
  invariant(motion.reducedMotion.liveToggleBackToNormalSettled === false, 'NOT_RUN motion status cannot retain normal-motion restore success');
  invariant(motion.reducedMotion.noToggleVisualPopOrDuplication === false, 'NOT_RUN motion status cannot retain toggle visual-stability success');
}

if (!unity.executed) {
  invariant(unity.result === 'NOT_RUN', 'unexecuted Unity V3 evidence must remain NOT_RUN');
  invariant(unity.ambientMotionDirectorResolved === false, 'NOT_RUN Unity evidence cannot retain ambient director resolution');
  invariant(unity.fireCadenceDirectorResolved === false, 'NOT_RUN Unity evidence cannot retain fire cadence director resolution');
}

console.log('TOP final-art stale-evidence reset completeness: PASS');
console.log('candidate replacement clears live Reduced Motion toggle observations and Unity motion-director resolution before any new review can pass');
