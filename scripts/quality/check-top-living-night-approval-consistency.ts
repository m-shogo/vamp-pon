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
  candidatePath: string;
  candidateSha256: string;
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
  sourcePath: string;
  sourceSha256: string;
  allIdentitiesApproved: boolean;
  finalApprovalBlocked: boolean;
}>('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json');

const crop = readJson<{
  candidateGenerated: boolean;
  sourcePath: string;
  sourceSha256: string;
  allCropsApproved: boolean;
  finalApprovalBlocked: boolean;
}>('docs/design-targets/generated/top-living-night-v3/crop-review-status.json');

const motion = readJson<{
  candidatePath: string;
  candidateSha256: string;
  normalMotion: { executed: boolean; result: string; reviewDurationSeconds: number };
  reducedMotion: { executed: boolean; result: string; reviewDurationSeconds: number };
  motionApproved: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
}>('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');

const capture = readJson<{
  executed: boolean;
  result: string;
  sourceCommit: string;
  expectedCaptureCount: number;
  captureCount: number;
  captures: unknown[];
}>('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');

const v3Evidence = readJson<{
  executed: boolean;
  result: string;
  verifiedCommit: string;
  failureCount: number;
  sourceCompositeCount: number;
  sourceCompositeKind: string;
  sourceCompositePath: string;
  sourceCompositeSha256: string;
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

const canonicalCandidatePath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const canonicalBridgePath =
  'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const canonicalBridgeSha256 =
  'aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d';
const sha256 = /^[0-9a-f]{64}$/;

invariant(finalArt.candidatePath === canonicalCandidatePath, 'final-art candidate path must remain canonical');
invariant(identity.sourcePath === canonicalCandidatePath, 'Core5 review must target the canonical final-art candidate');
invariant(crop.sourcePath === canonicalCandidatePath, 'crop review must target the canonical final-art candidate');
invariant(motion.candidatePath === canonicalCandidatePath, 'motion review must target the canonical final-art candidate');
invariant(finalArt.candidatePath === identity.sourcePath, 'final-art and Core5 review candidate paths diverged');
invariant(finalArt.candidatePath === crop.sourcePath, 'final-art and crop review candidate paths diverged');
invariant(finalArt.candidatePath === motion.candidatePath, 'final-art and motion review candidate paths diverged');
invariant(finalArt.candidateGenerated === identity.candidateGenerated, 'final-art and Core5 candidate flags diverged');
invariant(finalArt.candidateGenerated === crop.candidateGenerated, 'final-art and crop candidate flags diverged');
invariant(finalArt.core5IdentityReviewed === identity.allIdentitiesApproved, 'final-art Core5 flag diverged from per-character review');
invariant(finalArt.cropReviewComplete === crop.allCropsApproved, 'final-art crop flag diverged from three-resolution review');

if (!finalArt.candidateGenerated) {
  invariant(finalArt.candidateSha256 === '', 'missing final candidate must not retain a candidate SHA-256');
  invariant(identity.sourceSha256 === '', 'NOT_RUN Core5 review must not retain a stale candidate SHA-256');
  invariant(crop.sourceSha256 === '', 'NOT_RUN crop review must not retain a stale candidate SHA-256');
  invariant(motion.candidateSha256 === '', 'NOT_RUN motion review must not retain a stale candidate SHA-256');
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
} else {
  invariant(sha256.test(finalArt.candidateSha256), 'generated final candidate requires a valid SHA-256');
  invariant(identity.sourceSha256 === finalArt.candidateSha256, 'Core5 review must target the exact final-art candidate SHA-256');
  invariant(crop.sourceSha256 === finalArt.candidateSha256, 'crop review must target the exact final-art candidate SHA-256');
}

if (identity.allIdentitiesApproved || crop.allCropsApproved) {
  invariant(finalArt.candidateGenerated, 'review approval requires a generated final candidate');
  invariant(sha256.test(finalArt.candidateSha256), 'review approval requires a valid final-art candidate SHA-256');
  invariant(identity.sourceSha256 === finalArt.candidateSha256, 'Core5 approval cannot use stale candidate evidence');
  invariant(crop.sourceSha256 === finalArt.candidateSha256, 'crop approval cannot use stale candidate evidence');
}

if (motion.motionApproved) {
  invariant(finalArt.candidateGenerated, 'motion approval requires a generated final candidate');
  invariant(sha256.test(finalArt.candidateSha256), 'motion approval requires a valid final-art candidate SHA-256');
  invariant(motion.candidateSha256 === finalArt.candidateSha256, 'motion approval cannot use stale final-art evidence');
  invariant(motion.normalMotion.executed && motion.normalMotion.result === 'PASSED', 'motion approval requires passed normal-motion review');
  invariant(motion.normalMotion.reviewDurationSeconds >= 300, 'motion approval requires five-minute normal review');
  invariant(motion.reducedMotion.executed && motion.reducedMotion.result === 'PASSED', 'motion approval requires passed Reduced Motion review');
  invariant(motion.reducedMotion.reviewDurationSeconds >= 60, 'motion approval requires at least one minute Reduced Motion review');
  invariant(!motion.finalApprovalBlocked, 'motion approval cannot retain its approval block');
}

const capturePassed =
  capture.executed &&
  capture.result === 'PASSED' &&
  /^[0-9a-f]{40}$/.test(capture.sourceCommit) &&
  capture.expectedCaptureCount === 15 &&
  capture.captureCount === 15 &&
  capture.captures.length === 15;

const v3UnityPassed =
  v3Evidence.executed &&
  v3Evidence.result === 'PASSED' &&
  /^[0-9a-f]{40}$/.test(v3Evidence.verifiedCommit) &&
  v3Evidence.failureCount === 0 &&
  v3Evidence.sourceCompositeCount === 1 &&
  v3Evidence.resourceTextureCount === 1 &&
  v3Evidence.resourceMaterialCount === 1 &&
  v3Evidence.controllerResolved &&
  v3Evidence.shaderResolved &&
  v3Evidence.buildHookResolved &&
  v3Evidence.buildImportPolicyPassed;

if (v3Evidence.executed) {
  invariant(sha256.test(v3Evidence.sourceCompositeSha256), 'executed V3 evidence requires source composite SHA-256 provenance');
  if (finalArt.candidateGenerated) {
    invariant(v3Evidence.sourceCompositeKind === 'final-core5', 'generated final candidate invalidates bridge-only V3 evidence');
    invariant(v3Evidence.sourceCompositePath === canonicalCandidatePath, 'final candidate requires V3 evidence from canonical final source');
    invariant(v3Evidence.sourceCompositeSha256 === finalArt.candidateSha256, 'V3 evidence must target the exact current final candidate SHA-256');
  } else {
    invariant(v3Evidence.sourceCompositeKind === 'bridge', 'pre-final V3 evidence must identify bridge source');
    invariant(v3Evidence.sourceCompositePath === canonicalBridgePath, 'pre-final V3 evidence must target canonical bridge source');
    invariant(v3Evidence.sourceCompositeSha256 === canonicalBridgeSha256, 'pre-final V3 bridge evidence SHA-256 mismatch');
  }
}

if (capturePassed && v3UnityPassed) {
  invariant(
    capture.sourceCommit === v3Evidence.verifiedCommit,
    'capture evidence and V3 Unity evidence must come from the same source commit',
  );
}

if (finalArt.runtimeCaptureComplete) {
  invariant(finalArt.candidateGenerated, 'final runtime capture approval requires final candidate');
  invariant(capturePassed, 'final runtime capture approval requires PASSED 15-frame capture evidence');
  invariant(v3UnityPassed, 'final runtime capture approval requires PASSED V3 Unity evidence');
  invariant(v3Evidence.sourceCompositeKind === 'final-core5', 'final runtime capture requires V3 verification of final-core5 source');
  invariant(v3Evidence.sourceCompositeSha256 === finalArt.candidateSha256, 'final runtime capture requires V3 verification of current final candidate');
  invariant(
    capture.sourceCommit === v3Evidence.verifiedCommit,
    'final runtime capture approval requires capture/V3 evidence from one source commit',
  );
}

if (loadingManifest.approval.runtimeCaptureComplete) {
  invariant(capturePassed, 'Loading runtime-capture promotion requires PASSED 15-frame capture evidence');
  invariant(v3UnityPassed, 'Loading runtime-capture promotion requires PASSED V3 Unity evidence');
  invariant(
    capture.sourceCommit === v3Evidence.verifiedCommit,
    'Loading runtime-capture promotion requires capture/V3 evidence from one source commit',
  );
}

if (finalArt.runtimeApproved) {
  invariant(finalArt.runtimeCaptureComplete, 'runtime approval requires runtime capture completion');
  invariant(finalArt.humanVisualReviewComplete, 'runtime approval requires human visual review');
  invariant(identity.allIdentitiesApproved, 'runtime approval requires Core5 identity approval');
  invariant(crop.allCropsApproved, 'runtime approval requires three-crop approval');
  invariant(motion.motionApproved, 'runtime approval requires motion approval');
  invariant(v3UnityPassed, 'runtime approval requires V3 Unity evidence');
  invariant(v3Evidence.sourceCompositeKind === 'final-core5', 'runtime approval requires final-core5 Unity evidence');
  invariant(v3Evidence.sourceCompositeSha256 === finalArt.candidateSha256, 'runtime approval requires Unity evidence for current final-art candidate');
  invariant(capture.sourceCommit === v3Evidence.verifiedCommit, 'runtime approval requires coherent source-bound evidence');
  invariant(identity.sourceSha256 === finalArt.candidateSha256, 'runtime approval requires Core5 review of the current final-art candidate');
  invariant(crop.sourceSha256 === finalArt.candidateSha256, 'runtime approval requires crop review of the current final-art candidate');
  invariant(motion.candidateSha256 === finalArt.candidateSha256, 'runtime approval requires motion review of the current final-art candidate');
}

if (finalArt.approvedAsFinal) {
  invariant(finalArt.runtimeApproved, 'final approval requires runtime approval');
  invariant(!finalArt.finalApprovalBlocked, 'final approval cannot retain final-art block');
  invariant(!identity.finalApprovalBlocked, 'final approval cannot retain Core5 block');
  invariant(!crop.finalApprovalBlocked, 'final approval cannot retain crop block');
  invariant(!motion.finalApprovalBlocked, 'final approval cannot retain motion block');
  invariant(v3Evidence.sourceCompositeKind === 'final-core5', 'final approval requires final-core5 Unity provenance');
  invariant(v3Evidence.sourceCompositeSha256 === finalArt.candidateSha256, 'final approval requires current final-art Unity provenance');
  invariant(identity.sourceSha256 === finalArt.candidateSha256, 'final approval cannot use stale Core5 evidence');
  invariant(crop.sourceSha256 === finalArt.candidateSha256, 'final approval cannot use stale crop evidence');
  invariant(motion.candidateSha256 === finalArt.candidateSha256, 'final approval cannot use stale motion evidence');
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
console.log(`v3Unity=${v3Evidence.result} source=${v3Evidence.sourceCompositeKind || 'NOT_RUN'} capture=${capture.result} runtimeApproved=${finalArt.runtimeApproved} finalApproved=${finalArt.approvedAsFinal}`);
