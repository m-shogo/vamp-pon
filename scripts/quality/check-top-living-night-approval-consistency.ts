import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8')) as T;
}

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const finalArt = readJson<{
  candidateGenerated: boolean;
  core5IdentityReviewed: boolean;
  cropReviewComplete: boolean;
  motionSeparationReviewed: boolean;
  humanVisualReviewComplete: boolean;
  approvedAsFinal: boolean;
  runtimeCaptureComplete: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
}>('docs/design-targets/generated/top-living-night-v3/final-art-status.json');

const identity = readJson<{
  candidateGenerated: boolean;
  allIdentitiesApproved: boolean;
  finalApprovalBlocked: boolean;
}>('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json');

const crop = readJson<{
  candidateGenerated: boolean;
  allCropsApproved: boolean;
  finalApprovalBlocked: boolean;
}>('docs/design-targets/generated/top-living-night-v3/crop-review-status.json');

const motion = readJson<{
  normalMotion: { executed: boolean; result: string; reviewDurationSeconds: number };
  reducedMotion: { executed: boolean; result: string; reviewDurationSeconds: number };
  motionApproved: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
}>('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');

const capture = readJson<{
  executed: boolean;
  result: string;
  expectedCaptureCount: number;
  captureCount: number;
  captures: unknown[];
}>('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');

const v3Evidence = readJson<{
  executed: boolean;
  result: string;
  failureCount: number;
  sourceCompositeCount: number;
  resourceTextureCount: number;
  resourceMaterialCount: number;
  controllerResolved: boolean;
  shaderResolved: boolean;
  buildHookResolved: boolean;
  buildImportPolicyPassed: boolean;
}>('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');

const loadingManifest = readJson<{
  approval: {
    runtimeCaptureComplete: boolean;
    humanVisualReviewComplete: boolean;
    approvedAsFinal: boolean;
    runtimeApproved: boolean;
    finalApprovalBlocked: boolean;
  };
}>('docs/design-targets/generated/loading-seasonal-v1/manifest.json');

invariant(finalArt.candidateGenerated === identity.candidateGenerated, 'final-art and Core5 candidate flags diverged');
invariant(finalArt.candidateGenerated === crop.candidateGenerated, 'final-art and crop candidate flags diverged');
invariant(finalArt.core5IdentityReviewed === identity.allIdentitiesApproved, 'final-art Core5 flag diverged from per-character review');
invariant(finalArt.cropReviewComplete === crop.allCropsApproved, 'final-art crop flag diverged from three-resolution review');

if (!finalArt.candidateGenerated) {
  invariant(!finalArt.core5IdentityReviewed, 'missing final candidate cannot have Core5 approval');
  invariant(!finalArt.cropReviewComplete, 'missing final candidate cannot have crop approval');
  invariant(!finalArt.motionSeparationReviewed, 'missing final candidate cannot have motion-separation approval');
  invariant(!finalArt.humanVisualReviewComplete, 'missing final candidate cannot have human visual approval');
  invariant(!finalArt.approvedAsFinal, 'missing final candidate cannot be final-approved');
  invariant(!finalArt.runtimeCaptureComplete, 'missing final candidate cannot have final runtime capture approval');
  invariant(!finalArt.runtimeApproved, 'missing final candidate cannot be runtime-approved');
  invariant(finalArt.finalApprovalBlocked, 'missing final candidate must keep final approval blocked');
  invariant(!identity.allIdentitiesApproved && identity.finalApprovalBlocked, 'missing final candidate must keep Core5 review blocked');
  invariant(!crop.allCropsApproved && crop.finalApprovalBlocked, 'missing final candidate must keep crop review blocked');
  invariant(!motion.motionApproved && !motion.runtimeApproved && motion.finalApprovalBlocked, 'missing final candidate must keep motion approval blocked');
}

if (motion.motionApproved) {
  invariant(motion.normalMotion.executed && motion.normalMotion.result === 'PASSED', 'motion approval requires passed normal-motion review');
  invariant(motion.normalMotion.reviewDurationSeconds >= 300, 'motion approval requires five-minute normal review');
  invariant(motion.reducedMotion.executed && motion.reducedMotion.result === 'PASSED', 'motion approval requires passed Reduced Motion review');
  invariant(motion.reducedMotion.reviewDurationSeconds >= 60, 'motion approval requires at least one minute Reduced Motion review');
  invariant(!motion.finalApprovalBlocked, 'motion approval cannot retain its approval block');
}

const capturePassed =
  capture.executed &&
  capture.result === 'PASSED' &&
  capture.expectedCaptureCount === 15 &&
  capture.captureCount === 15 &&
  capture.captures.length === 15;

const v3UnityPassed =
  v3Evidence.executed &&
  v3Evidence.result === 'PASSED' &&
  v3Evidence.failureCount === 0 &&
  v3Evidence.sourceCompositeCount === 1 &&
  v3Evidence.resourceTextureCount === 1 &&
  v3Evidence.resourceMaterialCount === 1 &&
  v3Evidence.controllerResolved &&
  v3Evidence.shaderResolved &&
  v3Evidence.buildHookResolved &&
  v3Evidence.buildImportPolicyPassed;

if (finalArt.runtimeCaptureComplete) {
  invariant(finalArt.candidateGenerated, 'final runtime capture approval requires final candidate');
  invariant(capturePassed, 'final runtime capture approval requires PASSED 15-frame capture evidence');
  invariant(v3UnityPassed, 'final runtime capture approval requires PASSED V3 Unity evidence');
}

if (loadingManifest.approval.runtimeCaptureComplete) {
  invariant(capturePassed, 'Loading runtime-capture promotion requires PASSED 15-frame capture evidence');
}

if (finalArt.runtimeApproved) {
  invariant(finalArt.runtimeCaptureComplete, 'runtime approval requires runtime capture completion');
  invariant(finalArt.humanVisualReviewComplete, 'runtime approval requires human visual review');
  invariant(identity.allIdentitiesApproved, 'runtime approval requires Core5 identity approval');
  invariant(crop.allCropsApproved, 'runtime approval requires three-crop approval');
  invariant(motion.motionApproved, 'runtime approval requires motion approval');
  invariant(v3UnityPassed, 'runtime approval requires V3 Unity evidence');
}

if (finalArt.approvedAsFinal) {
  invariant(finalArt.runtimeApproved, 'final approval requires runtime approval');
  invariant(!finalArt.finalApprovalBlocked, 'final approval cannot retain final-art block');
  invariant(!identity.finalApprovalBlocked, 'final approval cannot retain Core5 block');
  invariant(!crop.finalApprovalBlocked, 'final approval cannot retain crop block');
  invariant(!motion.finalApprovalBlocked, 'final approval cannot retain motion block');
}

if (!capture.executed || !v3Evidence.executed) {
  invariant(!finalArt.runtimeCaptureComplete, 'NOT_RUN runtime evidence cannot coexist with final runtimeCaptureComplete');
  invariant(!finalArt.runtimeApproved, 'NOT_RUN runtime evidence cannot coexist with runtime approval');
  invariant(!finalArt.approvedAsFinal, 'NOT_RUN runtime evidence cannot coexist with final approval');
}

invariant(!loadingManifest.approval.approvedAsFinal, 'Loading final approval remains blocked in PR #78');
invariant(!loadingManifest.approval.runtimeApproved, 'Loading runtime approval remains blocked in PR #78');
invariant(loadingManifest.approval.finalApprovalBlocked, 'Loading final approval block must remain true in PR #78');

console.log('TOP Living Night approval consistency: PASS');
console.log(`candidate=${finalArt.candidateGenerated} core5=${identity.allIdentitiesApproved} crops=${crop.allCropsApproved} motion=${motion.motionApproved}`);
console.log(`v3Unity=${v3Evidence.result} capture=${capture.result} runtimeApproved=${finalArt.runtimeApproved} finalApproved=${finalArt.approvedAsFinal}`);
