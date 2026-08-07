import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const fixture = mkdtempSync(join(tmpdir(), 'vamp-pon-top-final-promotion-'));
const promoter = 'scripts/unity/promote-top-living-night-final-approval.ts';
const canonicalFinal = 'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const candidateSha = 'a'.repeat(64);
const referenceSetSha = 'b'.repeat(64);
const commit = 'c'.repeat(40);
const metricsSha = 'd'.repeat(64);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function write(path: string, value: unknown): void {
  const absolute = join(fixture, path);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function read(path: string): any {
  return JSON.parse(readFileSync(join(fixture, path), 'utf8'));
}

try {
  mkdirSync(join(fixture, 'scripts/unity'), { recursive: true });
  cpSync(join(root, promoter), join(fixture, promoter));

  write('docs/design-targets/generated/top-living-night-v3/final-art-status.json', {
    schemaVersion: 1,
    candidateGenerated: true,
    candidatePath: canonicalFinal,
    candidateSha256: candidateSha,
    candidateCore5ReferenceSetSha256: referenceSetSha,
    core5IdentityReviewed: true,
    cropReviewComplete: true,
    motionSeparationReviewed: true,
    humanVisualReviewComplete: true,
    approvedAsFinal: false,
    runtimeCaptureComplete: false,
    runtimeApproved: false,
    finalApprovalBlocked: true,
    reviewedAtUtc: '',
    notes: '',
  });
  write('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json', {
    schemaVersion: 1,
    candidateGenerated: true,
    sourcePath: canonicalFinal,
    sourceSha256: candidateSha,
    referenceSetSha256: referenceSetSha,
    exactlyFiveForegroundHumans: true,
    noGenericSubstituteHumans: true,
    allIdentitiesApproved: true,
    reviewedAtUtc: '2026-08-07T10:00:00.000Z',
    finalApprovalBlocked: false,
  });
  write('docs/design-targets/generated/top-living-night-v3/crop-review-status.json', {
    schemaVersion: 1,
    candidateGenerated: true,
    sourcePath: canonicalFinal,
    sourceSha256: candidateSha,
    allCropsApproved: true,
    reviewedAtUtc: '2026-08-07T10:01:00.000Z',
    finalApprovalBlocked: false,
  });
  write('docs/design-targets/generated/top-living-night-v3/motion-review-status.json', {
    schemaVersion: 1,
    candidatePath: canonicalFinal,
    candidateSha256: candidateSha,
    normalMotion: { executed: true, result: 'PASSED', reviewDurationSeconds: 300 },
    reducedMotion: { executed: true, result: 'PASSED', reviewDurationSeconds: 60 },
    unityVersion: '6000.5.1f1',
    verifiedCommit: commit,
    reviewedAtUtc: '2026-08-07T10:20:00.000Z',
    motionApproved: true,
    runtimeApproved: false,
    finalApprovalBlocked: false,
    notes: '',
  });
  write('docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json', {
    schemaVersion: 1,
    executed: true,
    result: 'PASSED',
    candidateGenerated: true,
    candidatePath: canonicalFinal,
    candidateSha256: candidateSha,
    captureSourceCommit: commit,
    topCompositeKind: 'final-core5',
    topCompositePath: canonicalFinal,
    topCompositeSha256: candidateSha,
    expectedFrameCount: 15,
    reviewedFrameCount: 15,
    loadingFramesReviewed: 12,
    topFramesReviewed: 3,
    humanVisualReviewComplete: true,
    reviewedAtUtc: '2026-08-07T10:30:00.000Z',
    finalApprovalBlocked: false,
  });
  write('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json', {
    schemaVersion: 1,
    executed: true,
    result: 'PASSED',
    verifiedCommit: commit,
    unityVersion: '6000.5.1f1',
    sourceCompositeKind: 'final-core5',
    sourceCompositePath: canonicalFinal,
    sourceCompositeSha256: candidateSha,
    failureCount: 0,
    generatedAtUtc: '2026-08-07T10:10:00.000Z',
  });
  write('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json', {
    schemaVersion: 1,
    executed: true,
    result: 'PASSED',
    sourceCommit: commit,
    topCompositeKind: 'final-core5',
    topCompositePath: canonicalFinal,
    topCompositeSha256: candidateSha,
    expectedCaptureCount: 15,
    captureCount: 15,
    generatedAtUtc: '2026-08-07T10:15:00.000Z',
    captures: Array.from({ length: 15 }, (_, index) => ({ id: index })),
  });

  const target = (thermalState?: string) => ({
    executed: true,
    result: 'PASSED',
    sourceCommit: commit,
    topCompositeKind: 'final-core5',
    topCompositePath: canonicalFinal,
    topCompositeSha256: candidateSha,
    durationSeconds: 300,
    averageFps: 59,
    minimumFps: 48,
    framePacingIssueObserved: false,
    memoryRegressionObserved: false,
    backgroundForegroundRecoveryPassed: true,
    metricsArtifactSha256: metricsSha,
    recordedAtUtc: '2026-08-07T10:35:00.000Z',
    ...(thermalState ? { thermalState } : {}),
  });
  write('docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json', {
    schemaVersion: 1,
    simulator: target(),
    physicalIphone: target('nominal'),
    runtimeApproved: false,
    finalApprovalBlocked: true,
  });

  const run = spawnSync(
    process.execPath,
    ['--experimental-strip-types', promoter],
    { cwd: fixture, encoding: 'utf8' },
  );
  invariant(run.status === 0, `TOP final promotion fixture failed:\n${run.stdout}\n${run.stderr}`);
  invariant(run.stdout.includes('TOP final approval promotion: PROMOTED'), 'complete fixture did not promote final approval');

  const finalArt = read('docs/design-targets/generated/top-living-night-v3/final-art-status.json');
  const device = read('docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json');
  const motion = read('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');
  const identity = read('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json');
  const crop = read('docs/design-targets/generated/top-living-night-v3/crop-review-status.json');
  const human = read('docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json');
  const unity = read('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');
  const capture = read('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');

  invariant(finalArt.runtimeCaptureComplete && finalArt.runtimeApproved && finalArt.approvedAsFinal, 'promotion did not set final derived approval flags');
  invariant(finalArt.finalApprovalBlocked === false, 'promotion did not clear final approval block');
  invariant(finalArt.core5IdentityReviewed && finalArt.cropReviewComplete && finalArt.motionSeparationReviewed && finalArt.humanVisualReviewComplete, 'promotion lost prerequisite derived flags');
  invariant(device.runtimeApproved && device.finalApprovalBlocked === false, 'promotion did not synchronize device runtime approval');
  invariant(motion.runtimeApproved === true, 'promotion did not synchronize motion runtime approval');
  invariant(identity.allIdentitiesApproved === true && identity.finalApprovalBlocked === false, 'promotion rewrote/invalidated Core5 source review');
  invariant(crop.allCropsApproved === true && crop.finalApprovalBlocked === false, 'promotion rewrote/invalidated crop source review');
  invariant(human.result === 'PASSED' && human.humanVisualReviewComplete === true, 'promotion rewrote/invalidated human source review');
  invariant(unity.result === 'PASSED' && unity.verifiedCommit === commit, 'promotion rewrote/invalidated Unity evidence');
  invariant(capture.result === 'PASSED' && capture.sourceCommit === commit, 'promotion rewrote/invalidated capture evidence');

  console.log('TOP Living Night final promotion mutation fixture: PASS');
  console.log('complete coherent evidence promotes only derived final/device/motion approval state; source evidence remains intact');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
