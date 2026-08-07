import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const registrarRelative = 'scripts/unity/register-top-living-night-final-art.ts';
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

function writeJson(base: string, relativePath: string, value: unknown): void {
  const path = join(base, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function readJson(base: string, relativePath: string): any {
  return JSON.parse(readFileSync(join(base, relativePath), 'utf8'));
}

function referenceSetDigest(references: Array<{ id: string; path: string; gitBlobSha1: string }>): string {
  const payload = references
    .map(reference => `${reference.id}\0${reference.path}\0${reference.gitBlobSha1}\n`)
    .join('');
  return createHash('sha256').update(payload, 'utf8').digest('hex');
}

function candidatePng(): Buffer {
  const bytes = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(bytes, 0);
  Buffer.from('IHDR', 'ascii').copy(bytes, 12);
  bytes.writeUInt32BE(430, 16);
  bytes.writeUInt32BE(932, 20);
  return bytes;
}

function blankDeviceTarget() {
  return {
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
  };
}

function runRegistrar(fixtureRoot: string): ReturnType<typeof spawnSync> {
  return spawnSync(
    process.execPath,
    ['--experimental-strip-types', registrarRelative],
    { cwd: fixtureRoot, encoding: 'utf8' },
  );
}

const fixtureRoot = mkdtempSync(join(tmpdir(), 'vamp-top-final-registration-'));
try {
  const registrarDestination = join(fixtureRoot, registrarRelative);
  mkdirSync(dirname(registrarDestination), { recursive: true });
  copyFileSync(join(root, registrarRelative), registrarDestination);

  const references = ['yui', 'asa', 'nagi', 'michiru', 'tomori'].map((id, index) => ({
    id,
    path: `assets/reference/character-master/core5/${id}-character-master-v1.png`,
    gitBlobSha1: String(index + 1).repeat(40),
  }));
  const firstReferenceSetSha = referenceSetDigest(references);
  writeJson(fixtureRoot, paths.core5Reference, {
    schemaVersion: 1,
    referenceCount: 5,
    referenceSetSha256: firstReferenceSetSha,
    references,
  });

  writeJson(fixtureRoot, paths.finalArt, {
    schemaVersion: 1,
    candidateGenerated: false,
    candidatePath: canonicalCandidatePath,
    expectedWidth: 430,
    expectedHeight: 932,
    core5ReferenceCount: 5,
    candidateCore5ReferenceSetSha256: '',
    core5IdentityReviewed: false,
    cropReviewComplete: false,
    motionSeparationReviewed: false,
    humanVisualReviewComplete: false,
    approvedAsFinal: false,
    runtimeCaptureComplete: false,
    runtimeApproved: false,
    finalApprovalBlocked: true,
    candidateSha256: '',
    reviewedAtUtc: '',
    notes: '',
  });
  writeJson(fixtureRoot, paths.identity, {
    schemaVersion: 1,
    candidateGenerated: false,
    sourcePath: canonicalCandidatePath,
    sourceSha256: '',
    referenceSetSha256: '',
    exactlyFiveForegroundHumans: false,
    noGenericSubstituteHumans: false,
    reviews: ['yui', 'asa', 'nagi', 'michiru', 'tomori'].map(id => ({
      id,
      referencePath: `assets/reference/character-master/core5/${id}-character-master-v1.png`,
      executed: false,
      result: 'NOT_RUN',
      hairFaceMatch: false,
      silhouetteMatch: false,
      outfitColorMatch: false,
      signaturePropMatch: false,
      recognizableAt360: false,
    })),
    yuiAsaNagiMutuallyDistinct: false,
    michiruTealIdentityDistinct: false,
    tomoriRustIdentityDistinct: false,
    allIdentitiesApproved: false,
    reviewedAtUtc: '',
    finalApprovalBlocked: true,
    notes: '',
  });
  writeJson(fixtureRoot, paths.crop, {
    schemaVersion: 1,
    candidateGenerated: false,
    sourcePath: canonicalCandidatePath,
    sourceSha256: '',
    reviews: ['360x800', '390x844', '430x932'].map(resolution => ({
      resolution,
      executed: false,
      result: 'NOT_RUN',
      titleSafe: false,
      primaryButtonSafe: false,
      secondaryButtonSafe: false,
      facesUnobstructed: false,
      signaturePropsUnobstructed: false,
      animalRobotReadable: false,
    })),
    allCropsApproved: false,
    reviewedAtUtc: '',
    finalApprovalBlocked: true,
    notes: '',
  });
  writeJson(fixtureRoot, paths.motion, {
    schemaVersion: 1,
    candidatePath: canonicalCandidatePath,
    candidateSha256: '',
    normalMotion: {
      executed: false,
      result: 'NOT_RUN',
      reviewDurationSeconds: 0,
      obviousShortLoopObserved: false,
      accumulatingParticlesObserved: false,
      brightnessDriftObserved: false,
      textureLifecycleIssueObserved: false,
    },
    reducedMotion: {
      executed: false,
      result: 'NOT_RUN',
      reviewDurationSeconds: 0,
      cloudMovementStopped: false,
      particlesSuppressed: false,
      rareRobotEyeSuppressed: false,
      fireRemainsRestrained: false,
      uiFunctional: false,
    },
    unityVersion: '',
    verifiedCommit: '',
    reviewedAtUtc: '',
    motionApproved: false,
    runtimeApproved: false,
    finalApprovalBlocked: true,
    notes: '',
  });
  writeJson(fixtureRoot, paths.humanReview, {
    schemaVersion: 1,
    executed: false,
    result: 'NOT_RUN',
    candidateGenerated: false,
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
  writeJson(fixtureRoot, paths.unity, {
    executed: true,
    result: 'PASSED',
    verifiedCommit: 'f'.repeat(40),
    unityVersion: '6000.5.1f1',
    assertionCount: 999,
    failureCount: 0,
    sourceCompositeCount: 1,
    sourceCompositeKind: 'bridge',
    sourceCompositePath: 'stale-bridge.png',
    sourceCompositeSha256: 'b'.repeat(64),
    resourceTextureCount: 1,
    resourceMaterialCount: 1,
    controllerResolved: true,
    shaderResolved: true,
    buildHookResolved: true,
    buildImportPolicyPassed: true,
    generatedAtUtc: '2026-01-01T00:00:00Z',
    error: '',
  });
  writeJson(fixtureRoot, paths.device, {
    schemaVersion: 1,
    performancePolicy: {
      targetFps: 60,
      passObservationSeconds: 300,
      memoryBudgetMode: 'regression-observation',
    },
    simulator: {
      ...blankDeviceTarget(),
      executed: true,
      result: 'PASSED',
      measurementMethod: 'unity-runtime-sampler',
      memoryMetric: 'unity-total-allocated-memory',
      metricsArtifactPath: 'stale.json',
      metricsArtifactSha256: 'c'.repeat(64),
      durationSeconds: 300,
      averageFps: 60,
      minimumFps: 58,
      peakMemoryMb: 128,
      backgroundForegroundRecoveryPassed: true,
    },
    physicalIphone: {
      ...blankDeviceTarget(),
      executed: true,
      result: 'PASSED',
      measurementMethod: 'xcode-instruments',
      memoryMetric: 'physical-footprint',
      metricsArtifactPath: 'stale-iphone.json',
      metricsArtifactSha256: 'd'.repeat(64),
      durationSeconds: 300,
      averageFps: 60,
      minimumFps: 55,
      peakMemoryMb: 180,
      backgroundForegroundRecoveryPassed: true,
      thermalState: 'nominal',
    },
    runtimeApproved: true,
    finalApprovalBlocked: false,
  });
  writeJson(fixtureRoot, paths.capture, {
    executed: true,
    result: 'PASSED',
    sourceCommit: 'f'.repeat(40),
    topCompositeKind: 'bridge',
    topCompositePath: 'stale-bridge.png',
    topCompositeSha256: 'b'.repeat(64),
    expectedCaptureCount: 15,
    captureCount: 15,
    generatedAtUtc: '2026-01-01T00:00:00Z',
    error: '',
    captures: Array.from({ length: 15 }, (_, index) => ({ id: `stale-${index}` })),
  });
  writeJson(fixtureRoot, paths.loadingManifest, {
    approval: {
      runtimeCaptureComplete: true,
      humanVisualReviewComplete: true,
      approvedAsFinal: true,
      runtimeApproved: true,
      finalApprovalBlocked: false,
    },
  });

  const candidateBytes = candidatePng();
  const candidateAbsolutePath = join(fixtureRoot, canonicalCandidatePath);
  mkdirSync(dirname(candidateAbsolutePath), { recursive: true });
  writeFileSync(candidateAbsolutePath, candidateBytes);
  const candidateSha = createHash('sha256').update(candidateBytes).digest('hex');

  const firstRun = runRegistrar(fixtureRoot);
  invariant(firstRun.status === 0, `final-art registration fixture failed:\n${firstRun.stderr || firstRun.stdout}`);
  const finalAfterFirst = readJson(fixtureRoot, paths.finalArt);
  const identityAfterFirst = readJson(fixtureRoot, paths.identity);
  const cropAfterFirst = readJson(fixtureRoot, paths.crop);
  const motionAfterFirst = readJson(fixtureRoot, paths.motion);
  const humanAfterFirst = readJson(fixtureRoot, paths.humanReview);
  const unityAfterFirst = readJson(fixtureRoot, paths.unity);
  const deviceAfterFirst = readJson(fixtureRoot, paths.device);
  const captureAfterFirst = readJson(fixtureRoot, paths.capture);
  const loadingAfterFirst = readJson(fixtureRoot, paths.loadingManifest);

  invariant(finalAfterFirst.candidateGenerated, 'registered candidate must set candidateGenerated=true');
  invariant(finalAfterFirst.candidateSha256 === candidateSha, 'registered candidate SHA-256 mismatch');
  invariant(finalAfterFirst.candidateCore5ReferenceSetSha256 === firstReferenceSetSha, 'registered candidate must bind current Core5 reference-set fingerprint');
  invariant(!finalAfterFirst.runtimeApproved && !finalAfterFirst.approvedAsFinal && finalAfterFirst.finalApprovalBlocked, 'candidate registration must reset final/runtime approval');
  invariant(identityAfterFirst.sourceSha256 === candidateSha && identityAfterFirst.referenceSetSha256 === firstReferenceSetSha, 'identity review must bind candidate + Core5 reference set');
  invariant(!identityAfterFirst.allIdentitiesApproved && identityAfterFirst.finalApprovalBlocked, 'identity review must reset to blocked');
  invariant(cropAfterFirst.sourceSha256 === candidateSha && !cropAfterFirst.allCropsApproved, 'crop review must reset against candidate SHA');
  invariant(motionAfterFirst.candidateSha256 === '' && !motionAfterFirst.motionApproved, 'motion review must reset to NOT_RUN provenance');
  invariant(humanAfterFirst.candidateGenerated && humanAfterFirst.candidateSha256 === '' && !humanAfterFirst.humanVisualReviewComplete, 'human review must reset without stale executed candidate SHA');
  invariant(!unityAfterFirst.executed && unityAfterFirst.result === 'NOT_RUN', 'V3 Unity evidence must reset to NOT_RUN');
  invariant(!captureAfterFirst.executed && captureAfterFirst.captureCount === 0, 'capture evidence must reset to NOT_RUN/0');
  invariant(!deviceAfterFirst.simulator.executed && deviceAfterFirst.simulator.memoryMetric === '', 'Simulator evidence including memory metric must reset');
  invariant(!deviceAfterFirst.physicalIphone.executed && deviceAfterFirst.physicalIphone.thermalState === '', 'physical-iPhone evidence must reset');
  invariant(!deviceAfterFirst.runtimeApproved && deviceAfterFirst.finalApprovalBlocked, 'device approval must reset');
  invariant(!loadingAfterFirst.approval.runtimeApproved && loadingAfterFirst.approval.finalApprovalBlocked, 'Loading approval must reset');

  identityAfterFirst.notes = 'NOOP_SENTINEL';
  writeJson(fixtureRoot, paths.identity, identityAfterFirst);
  const noOpRun = runRegistrar(fixtureRoot);
  invariant(noOpRun.status === 0, `final-art idempotence fixture failed:\n${noOpRun.stderr || noOpRun.stdout}`);
  invariant(readJson(fixtureRoot, paths.identity).notes === 'NOOP_SENTINEL', 'same candidate + same Core5 reference set must be idempotent');

  const changedReferences = references.map(reference => ({ ...reference }));
  changedReferences[0].gitBlobSha1 = '9'.repeat(40);
  const secondReferenceSetSha = referenceSetDigest(changedReferences);
  writeJson(fixtureRoot, paths.core5Reference, {
    schemaVersion: 1,
    referenceCount: 5,
    referenceSetSha256: secondReferenceSetSha,
    references: changedReferences,
  });
  const staleIdentity = readJson(fixtureRoot, paths.identity);
  staleIdentity.allIdentitiesApproved = true;
  staleIdentity.finalApprovalBlocked = false;
  staleIdentity.reviewedAtUtc = '2026-01-02T00:00:00Z';
  staleIdentity.notes = 'STALE_APPROVAL';
  writeJson(fixtureRoot, paths.identity, staleIdentity);

  const referenceChangeRun = runRegistrar(fixtureRoot);
  invariant(referenceChangeRun.status === 0, `Core5 reference-set invalidation fixture failed:\n${referenceChangeRun.stderr || referenceChangeRun.stdout}`);
  const finalAfterReferenceChange = readJson(fixtureRoot, paths.finalArt);
  const identityAfterReferenceChange = readJson(fixtureRoot, paths.identity);
  invariant(finalAfterReferenceChange.candidateSha256 === candidateSha, 'reference-set change must keep same candidate bytes registered');
  invariant(finalAfterReferenceChange.candidateCore5ReferenceSetSha256 === secondReferenceSetSha, 'reference-set change must rebind final candidate provenance');
  invariant(identityAfterReferenceChange.referenceSetSha256 === secondReferenceSetSha, 'reference-set change must rebind identity review provenance');
  invariant(!identityAfterReferenceChange.allIdentitiesApproved && identityAfterReferenceChange.reviewedAtUtc === '', 'reference-set change must invalidate stale identity approval');
  invariant(identityAfterReferenceChange.notes !== 'STALE_APPROVAL', 'reference-set change must overwrite stale identity-review state');

  console.log('TOP final-art registration mutation fixtures: PASS');
  console.log('covered: first registration / candidate-sensitive evidence reset / idempotence / Core5 reference-set invalidation / memory-metric reset');
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true });
}
