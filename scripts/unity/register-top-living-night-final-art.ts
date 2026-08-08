import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const canonicalCandidatePath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';

const paths = {
  core5Reference: 'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json',
  finalArt: 'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  identity: 'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json',
  crop: 'docs/design-targets/generated/top-living-night-v3/crop-review-status.json',
  motion: 'docs/design-targets/generated/top-living-night-v3/motion-review-status.json',
  humanReview: 'docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json',
  unity: 'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json',
  device: 'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json',
  capture: 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json',
  loadingManifest: 'docs/design-targets/generated/loading-seasonal-v1/manifest.json',
} as const;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}
function readJson(relativePath: string): any {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
}
function writeJson(relativePath: string, value: unknown): void {
  writeFileSync(join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
function referenceSetDigest(manifest: any): string {
  invariant(manifest?.schemaVersion === 1, 'Core5 reference manifest schema mismatch');
  invariant(Array.isArray(manifest.references) && manifest.references.length === 5, 'Core5 registration requires exactly five locked references');
  const payload = manifest.references
    .map((reference: any) => `${reference.id}\0${reference.path}\0${reference.gitBlobSha1}\n`)
    .join('');
  const digest = createHash('sha256').update(payload, 'utf8').digest('hex');
  invariant(/^[0-9a-f]{64}$/.test(manifest.referenceSetSha256), 'Core5 reference-set SHA-256 is invalid');
  invariant(manifest.referenceSetSha256 === digest, 'Core5 reference-set fingerprint is stale');
  return digest;
}
function validatePng430x932(bytes: Buffer): void {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(bytes.length >= 24, 'final Core5 TOP PNG is truncated');
  invariant(bytes.subarray(0, 8).equals(signature), 'final Core5 TOP PNG signature mismatch');
  invariant(bytes.subarray(12, 16).toString('ascii') === 'IHDR', 'final Core5 TOP PNG IHDR is missing');
  invariant(bytes.readUInt32BE(16) === 430, 'final Core5 TOP PNG width must be 430');
  invariant(bytes.readUInt32BE(20) === 932, 'final Core5 TOP PNG height must be 932');
}

function resetIdentity(identity: any, sha256: string, referenceSetSha256: string): void {
  identity.candidateGenerated = true;
  identity.sourcePath = canonicalCandidatePath;
  identity.sourceSha256 = sha256;
  identity.referenceSetSha256 = referenceSetSha256;
  identity.exactlyFiveForegroundHumans = false;
  identity.noGenericSubstituteHumans = false;
  for (const review of identity.reviews ?? []) {
    review.executed = false;
    review.result = 'NOT_RUN';
    review.hairFaceMatch = false;
    review.silhouetteMatch = false;
    review.outfitColorMatch = false;
    review.signaturePropMatch = false;
    review.recognizableAt360 = false;
  }
  identity.yuiAsaNagiMutuallyDistinct = false;
  identity.michiruTealIdentityDistinct = false;
  identity.tomoriRustIdentityDistinct = false;
  identity.allIdentitiesApproved = false;
  identity.reviewedAtUtc = '';
  identity.finalApprovalBlocked = true;
  identity.notes =
    'Final Core5 candidate registered. Per-character review was reset and must be executed against this exact candidate SHA-256 and locked Core5 reference-set fingerprint.';
}

function resetCrop(crop: any, sha256: string): void {
  crop.candidateGenerated = true;
  crop.sourcePath = canonicalCandidatePath;
  crop.sourceSha256 = sha256;
  for (const review of crop.reviews ?? []) {
    review.executed = false;
    review.result = 'NOT_RUN';
    review.titleSafe = false;
    review.primaryButtonSafe = false;
    review.secondaryButtonSafe = false;
    review.facesUnobstructed = false;
    review.signaturePropsUnobstructed = false;
    review.animalRobotReadable = false;
  }
  crop.allCropsApproved = false;
  crop.reviewedAtUtc = '';
  crop.finalApprovalBlocked = true;
  crop.notes =
    'Final Core5 candidate registered. Three-resolution crop review was reset and must be executed against this exact SHA-256.';
}

function resetMotion(motion: any): void {
  motion.candidatePath = canonicalCandidatePath;
  motion.candidateSha256 = '';
  Object.assign(motion.normalMotion, {
    executed: false,
    result: 'NOT_RUN',
    reviewDurationSeconds: 0,
    obviousShortLoopObserved: false,
    accumulatingParticlesObserved: false,
    brightnessDriftObserved: false,
    textureLifecycleIssueObserved: false,
  });
  Object.assign(motion.reducedMotion, {
    executed: false,
    result: 'NOT_RUN',
    reviewDurationSeconds: 0,
    cloudMovementStopped: false,
    particlesSuppressed: false,
    rareRobotEyeSuppressed: false,
    fireRemainsRestrained: false,
    uiFunctional: false,
    liveToggleToReducedSettled: false,
    liveToggleBackToNormalSettled: false,
    noToggleVisualPopOrDuplication: false,
  });
  motion.unityVersion = '';
  motion.verifiedCommit = '';
  motion.reviewedAtUtc = '';
  motion.motionApproved = false;
  motion.runtimeApproved = false;
  motion.finalApprovalBlocked = true;
  motion.notes =
    'Final Core5 candidate registered. Runtime motion review, including same-view Reduced Motion ON/OFF/ON evidence, was reset and must be executed on the current final candidate.';
}

function resetHumanReview(review: any, sha256: string): void {
  Object.assign(review, {
    executed: false,
    result: 'NOT_RUN',
    candidateGenerated: true,
    candidatePath: canonicalCandidatePath,
    candidateSha256: '',
    captureSourceCommit: '',
    topCompositeKind: '',
    topCompositePath: '',
    topCompositeSha256: '',
    expectedFrameCount: 15,
    reviewedFrameCount: 0,
    loadingFramesReviewed: 0,
    topFramesReviewed: 0,
    noBlackOrBlankFrames: false,
    noDevelopmentText: false,
    topCore5Readable: false,
    cropSafeAcrossAllTargets: false,
    loadingToTopContinuityPassed: false,
    reviewerRole: '',
    reviewedAtUtc: '',
    notes: '',
    humanVisualReviewComplete: false,
    finalApprovalBlocked: true,
  });
  invariant(sha256.length === 64, 'registered final candidate SHA-256 is invalid');
}

function resetUnity(unity: any): void {
  Object.assign(unity, {
    executed: false,
    result: 'NOT_RUN',
    verifiedCommit: '',
    unityVersion: '',
    assertionCount: 0,
    failureCount: 0,
    sourceCompositeCount: 1,
    sourceCompositeKind: '',
    sourceCompositePath: '',
    sourceCompositeSha256: '',
    resourceTextureCount: 0,
    resourceMaterialCount: 0,
    controllerResolved: false,
    shaderResolved: false,
    buildHookResolved: false,
    buildImportPolicyPassed: false,
    ambientMotionDirectorResolved: false,
    fireCadenceDirectorResolved: false,
    generatedAtUtc: '',
    error: '',
  });
}

function resetCapture(capture: any): void {
  Object.assign(capture, {
    executed: false,
    result: 'NOT_RUN',
    sourceCommit: '',
    topCompositeKind: '',
    topCompositePath: '',
    topCompositeSha256: '',
    expectedCaptureCount: 15,
    captureCount: 0,
    generatedAtUtc: '',
    error: '',
    captures: [],
  });
}

function resetDeviceTarget(target: any): void {
  Object.assign(target, {
    executed: false,
    result: 'NOT_RUN',
    deviceModel: '',
    osVersion: '',
    unityVersion: '',
    sourceCommit: '',
    topCompositeKind: '',
    topCompositePath: '',
    topCompositeSha256: '',
    measurementMethod: '',
    memoryMetric: '',
    metricsArtifactPath: '',
    metricsArtifactSha256: '',
    durationSeconds: 0,
    averageFps: 0,
    minimumFps: 0,
    peakMemoryMb: 0,
    framePacingIssueObserved: false,
    memoryRegressionObserved: false,
    backgroundForegroundRecoveryPassed: false,
    recordedAtUtc: '',
    notes: '',
  });
  if ('thermalState' in target) target.thermalState = '';
}

function main(): void {
  for (const path of Object.values(paths)) {
    invariant(existsSync(join(root, path)), `required authority/evidence file is missing: ${path}`);
  }

  const core5Reference = readJson(paths.core5Reference);
  const currentReferenceSetSha256 = referenceSetDigest(core5Reference);
  const finalArt = readJson(paths.finalArt);
  invariant(finalArt.schemaVersion === 1, 'final-art status schema mismatch');
  invariant(finalArt.candidatePath === canonicalCandidatePath, 'final-art candidate path is not canonical');

  const absoluteCandidatePath = join(root, canonicalCandidatePath);
  if (!existsSync(absoluteCandidatePath)) {
    invariant(!finalArt.candidateGenerated, 'candidateGenerated=true but final Core5 TOP PNG is missing');
    invariant(finalArt.candidateSha256 === '', 'missing final Core5 TOP PNG must not retain candidate SHA-256');
    invariant(
      finalArt.candidateCore5ReferenceSetSha256 === '',
      'missing final Core5 TOP PNG must not retain a candidate reference-set fingerprint',
    );
    if (dryRun) {
      console.log('TOP final-art registration: honest NOT_RUN boundary');
      console.log(`expected candidate: ${canonicalCandidatePath}`);
      console.log(`locked Core5 reference set: ${currentReferenceSetSha256}`);
      return;
    }
    throw new Error(`final Core5 TOP PNG is missing: ${canonicalCandidatePath}`);
  }

  const bytes = readFileSync(absoluteCandidatePath);
  validatePng430x932(bytes);
  const sha256 = createHash('sha256').update(bytes).digest('hex');

  if (
    finalArt.candidateGenerated &&
    finalArt.candidateSha256 === sha256 &&
    finalArt.candidateCore5ReferenceSetSha256 === currentReferenceSetSha256
  ) {
    console.log('TOP final-art registration: already registered; no evidence reset performed');
    console.log(`sha256=${sha256}`);
    console.log(`core5ReferenceSet=${currentReferenceSetSha256}`);
    return;
  }

  if (dryRun) {
    console.log('TOP final-art registration: candidate is ready to register');
    console.log(`sha256=${sha256}`);
    console.log(`core5ReferenceSet=${currentReferenceSetSha256}`);
    console.log('dry-run: no authority/evidence files changed');
    return;
  }

  const identity = readJson(paths.identity);
  const crop = readJson(paths.crop);
  const motion = readJson(paths.motion);
  const humanReview = readJson(paths.humanReview);
  const unity = readJson(paths.unity);
  const device = readJson(paths.device);
  const capture = readJson(paths.capture);
  const loadingManifest = readJson(paths.loadingManifest);

  finalArt.candidateGenerated = true;
  finalArt.candidatePath = canonicalCandidatePath;
  finalArt.candidateSha256 = sha256;
  finalArt.candidateCore5ReferenceSetSha256 = currentReferenceSetSha256;
  finalArt.core5IdentityReviewed = false;
  finalArt.cropReviewComplete = false;
  finalArt.motionSeparationReviewed = false;
  finalArt.humanVisualReviewComplete = false;
  finalArt.approvedAsFinal = false;
  finalArt.runtimeCaptureComplete = false;
  finalArt.runtimeApproved = false;
  finalArt.finalApprovalBlocked = true;
  finalArt.reviewedAtUtc = '';
  finalArt.notes =
    'Final Core5 candidate registered against the current locked Core5 reference-set fingerprint. All candidate-sensitive review/runtime evidence was reset; no approval is implied by registration.';

  resetIdentity(identity, sha256, currentReferenceSetSha256);
  resetCrop(crop, sha256);
  resetMotion(motion);
  resetHumanReview(humanReview, sha256);
  resetUnity(unity);
  resetCapture(capture);
  resetDeviceTarget(device.simulator);
  resetDeviceTarget(device.physicalIphone);
  device.runtimeApproved = false;
  device.finalApprovalBlocked = true;

  loadingManifest.approval.runtimeCaptureComplete = false;
  loadingManifest.approval.humanVisualReviewComplete = false;
  loadingManifest.approval.approvedAsFinal = false;
  loadingManifest.approval.runtimeApproved = false;
  loadingManifest.approval.finalApprovalBlocked = true;

  writeJson(paths.finalArt, finalArt);
  writeJson(paths.identity, identity);
  writeJson(paths.crop, crop);
  writeJson(paths.motion, motion);
  writeJson(paths.humanReview, humanReview);
  writeJson(paths.unity, unity);
  writeJson(paths.device, device);
  writeJson(paths.capture, capture);
  writeJson(paths.loadingManifest, loadingManifest);

  console.log('TOP final-art registration: REGISTERED');
  console.log(`candidate=${canonicalCandidatePath}`);
  console.log(`sha256=${sha256}`);
  console.log(`core5ReferenceSet=${currentReferenceSetSha256}`);
  console.log('downstream Core5/crop/motion/live-toggle/human/Unity/capture/device approval evidence reset to NOT_RUN/blocked');
}

main();
