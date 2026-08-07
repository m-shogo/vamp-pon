import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8')) as T;
}

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const motion = readJson<{
  normalMotion: { executed: boolean; result: string };
  reducedMotion: { executed: boolean; result: string };
  verifiedCommit: string;
  motionApproved: boolean;
}>('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');

const unity = readJson<{
  executed: boolean;
  result: string;
  verifiedCommit: string;
}>('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');

const capture = readJson<{
  executed: boolean;
  result: string;
  sourceCommit: string;
  expectedCaptureCount: number;
  captureCount: number;
  captures: unknown[];
}>('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');

const finalArt = readJson<{
  runtimeCaptureComplete: boolean;
  runtimeApproved: boolean;
  approvedAsFinal: boolean;
}>('docs/design-targets/generated/top-living-night-v3/final-art-status.json');

const sha40 = /^[0-9a-f]{40}$/;
const motionExecuted = motion.normalMotion.executed || motion.reducedMotion.executed;
const unityPassed = unity.executed && unity.result === 'PASSED' && sha40.test(unity.verifiedCommit);
const capturePassed =
  capture.executed &&
  capture.result === 'PASSED' &&
  sha40.test(capture.sourceCommit) &&
  capture.expectedCaptureCount === 15 &&
  capture.captureCount === 15 &&
  capture.captures.length === 15;

if (!motionExecuted) {
  invariant(motion.verifiedCommit === '', 'NOT_RUN motion review must not retain a stale verifiedCommit');
} else {
  invariant(sha40.test(motion.verifiedCommit), 'executed motion review requires a 40-char source commit');
}

if (motion.motionApproved) {
  invariant(
    motion.normalMotion.executed && motion.normalMotion.result === 'PASSED',
    'motion approval requires passed normal-motion review',
  );
  invariant(
    motion.reducedMotion.executed && motion.reducedMotion.result === 'PASSED',
    'motion approval requires passed Reduced Motion review',
  );
  invariant(unityPassed, 'motion approval requires PASSED current V3 Unity evidence');
  invariant(
    motion.verifiedCommit === unity.verifiedCommit,
    'motion review and V3 Unity evidence must target the same source commit',
  );
}

if (capturePassed && unityPassed) {
  invariant(
    capture.sourceCommit === unity.verifiedCommit,
    'capture and V3 Unity evidence must target the same source commit',
  );
}

if (finalArt.runtimeCaptureComplete) {
  invariant(capturePassed && unityPassed, 'runtime capture completion requires passed capture and V3 evidence');
  invariant(
    capture.sourceCommit === unity.verifiedCommit,
    'runtime capture completion requires coherent capture/V3 provenance',
  );
}

if (finalArt.runtimeApproved || finalArt.approvedAsFinal) {
  invariant(motion.motionApproved, 'runtime/final approval requires approved motion review');
  invariant(capturePassed && unityPassed, 'runtime/final approval requires capture and V3 evidence');
  invariant(
    motion.verifiedCommit === unity.verifiedCommit && unity.verifiedCommit === capture.sourceCommit,
    'runtime/final approval requires motion, V3 Unity, and capture evidence from one source commit',
  );
}

console.log('TOP Living Night evidence commit coherence: PASS');
console.log(`motion=${motion.motionApproved} unity=${unity.result} capture=${capture.result}`);
