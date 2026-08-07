import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8')) as any;

const finalArt = read('docs/design-targets/generated/top-living-night-v3/final-art-status.json');
const core5 = read('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json');
const crop = read('docs/design-targets/generated/top-living-night-v3/crop-review-status.json');
const motion = read('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');
const human = read('docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json');
const unity = read('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');
const capture = read('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');
const device = read('docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const [name, evidence] of [
  ['final-art', finalArt],
  ['core5', core5],
  ['crop', crop],
  ['motion', motion],
  ['human', human],
  ['unity', unity],
  ['capture', capture],
  ['device', device],
] as const) {
  invariant(evidence.schemaVersion === 1, `${name} readiness source schema mismatch`);
}

const candidateReady =
  finalArt.candidateGenerated === true &&
  /^[0-9a-f]{64}$/.test(finalArt.candidateSha256) &&
  finalArt.candidateCore5ReferenceSetSha256.length === 64;
const core5Ready = core5.allIdentitiesApproved === true && finalArt.core5IdentityReviewed === true;
const cropReady = crop.allCropsApproved === true && finalArt.cropReviewComplete === true;
const unityReady = unity.executed === true && unity.result === 'PASSED';
const captureReady =
  capture.executed === true &&
  capture.result === 'PASSED' &&
  capture.expectedCaptureCount === 15 &&
  capture.captureCount === 15 &&
  finalArt.runtimeCaptureComplete === true;
const humanReady =
  human.executed === true &&
  human.result === 'PASSED' &&
  human.humanVisualReviewComplete === true &&
  finalArt.humanVisualReviewComplete === true;
const motionReady =
  motion.normalMotion?.executed === true &&
  motion.normalMotion?.result === 'PASSED' &&
  motion.normalMotion?.reviewDurationSeconds >= 300 &&
  motion.reducedMotion?.executed === true &&
  motion.reducedMotion?.result === 'PASSED' &&
  motion.reducedMotion?.reviewDurationSeconds >= 60 &&
  motion.motionApproved === true &&
  finalArt.motionSeparationReviewed === true;
const simulatorReady = device.simulator?.executed === true && device.simulator?.result === 'PASSED';
const iphoneReady = device.physicalIphone?.executed === true && device.physicalIphone?.result === 'PASSED';
const runtimeReady =
  unityReady && captureReady && simulatorReady && iphoneReady && device.runtimeApproved === true && finalArt.runtimeApproved === true;
const finalReady =
  candidateReady &&
  core5Ready &&
  cropReady &&
  unityReady &&
  captureReady &&
  humanReady &&
  motionReady &&
  simulatorReady &&
  iphoneReady &&
  runtimeReady &&
  finalArt.approvedAsFinal === true &&
  finalArt.finalApprovalBlocked === false &&
  device.finalApprovalBlocked === false;

// Promotion flags are assertions, never optimistic progress hints.
invariant(!finalArt.core5IdentityReviewed || core5.allIdentitiesApproved, 'final-art Core5 promotion outran structured Core5 evidence');
invariant(!finalArt.cropReviewComplete || crop.allCropsApproved, 'final-art crop promotion outran structured crop evidence');
invariant(!finalArt.motionSeparationReviewed || motion.motionApproved, 'final-art motion promotion outran structured motion evidence');
invariant(!finalArt.humanVisualReviewComplete || human.humanVisualReviewComplete, 'final-art human promotion outran structured human evidence');
invariant(!finalArt.runtimeCaptureComplete || captureReady, 'final-art capture promotion outran the complete 15-frame capture evidence');
invariant(!finalArt.runtimeApproved || runtimeReady, 'final-art runtime approval outran Unity/capture/device evidence');
invariant(!finalArt.approvedAsFinal || finalReady, 'final-art approval outran one or more required gates');
invariant(finalArt.approvedAsFinal === !finalArt.finalApprovalBlocked, 'final-art approved/block flags must be exact opposites');
invariant(device.runtimeApproved === !device.finalApprovalBlocked, 'device runtimeApproved/finalApprovalBlocked flags must be exact opposites');

const gates = [
  ['final-candidate', candidateReady],
  ['core5-identity', core5Ready],
  ['crop-review', cropReady],
  ['unity-v3', unityReady],
  ['capture-15', captureReady],
  ['human-visual', humanReady],
  ['motion-normal-reduced', motionReady],
  ['simulator-performance', simulatorReady],
  ['physical-iphone-performance', iphoneReady],
  ['runtime-approval', runtimeReady],
  ['final-approval', finalReady],
] as const;

const blockers = gates.filter(([, passed]) => !passed).map(([name]) => name);
const next = blockers[0] ?? 'complete';

console.log('TOP Living Night final readiness summary: PASS');
for (const [name, passed] of gates) console.log(`${passed ? 'READY' : 'PENDING'} ${name}`);
console.log(`NEXT=${next}`);
console.log(`BLOCKERS=${blockers.length === 0 ? 'none' : blockers.join(',')}`);
console.log('Static GitHub green never upgrades runtime/final approval by itself.');
