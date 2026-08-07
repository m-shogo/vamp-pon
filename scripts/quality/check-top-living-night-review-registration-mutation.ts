import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const root = process.cwd();
const fixture = mkdtempSync(join(tmpdir(), 'vamp-pon-top-review-registration-'));
const scripts = [
  'scripts/unity/register-top-living-night-static-review.ts',
  'scripts/unity/register-top-living-night-motion-review.ts',
  'scripts/unity/register-top-living-night-human-review.ts',
];
const canonicalFinal =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const candidateSha = 'a'.repeat(64);
const referenceSetSha = 'b'.repeat(64);
const commit = 'c'.repeat(40);
const ids = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];

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

function run(script: string, input: string): string {
  const result = spawnSync(
    process.execPath,
    ['--experimental-strip-types', script, `--input=${input}`],
    { cwd: fixture, encoding: 'utf8' },
  );
  invariant(result.status === 0, `${script} fixture failed:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

try {
  for (const script of scripts) {
    const target = join(fixture, script);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(join(root, script), target);
  }

  write('docs/design-targets/generated/top-living-night-v3/final-art-status.json', {
    schemaVersion: 1,
    candidateGenerated: true,
    candidatePath: canonicalFinal,
    candidateSha256: candidateSha,
    candidateCore5ReferenceSetSha256: referenceSetSha,
    core5IdentityReviewed: false,
    cropReviewComplete: false,
    motionSeparationReviewed: false,
    humanVisualReviewComplete: false,
    runtimeCaptureComplete: false,
    runtimeApproved: false,
    approvedAsFinal: false,
    finalApprovalBlocked: true,
    reviewedAtUtc: '',
  });
  write('docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json', {
    schemaVersion: 1,
    referenceCount: 5,
    referenceSetSha256,
    references: ids.map(id => ({ id, path: `${id}.png`, gitBlobSha1: 'd'.repeat(40) })),
  });
  write('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json', {
    schemaVersion: 1,
    candidateGenerated: false,
    sourcePath: canonicalFinal,
    sourceSha256: '',
    referenceSetSha256: '',
    exactlyFiveForegroundHumans: false,
    noGenericSubstituteHumans: false,
    reviews: ids.map(id => ({ id, executed: false, result: 'NOT_RUN' })),
    yuiAsaNagiMutuallyDistinct: false,
    michiruTealIdentityDistinct: false,
    tomoriRustIdentityDistinct: false,
    allIdentitiesApproved: false,
    reviewedAtUtc: '',
    finalApprovalBlocked: true,
    notes: '',
  });
  write('docs/design-targets/generated/top-living-night-v3/crop-review-status.json', {
    schemaVersion: 1,
    candidateGenerated: false,
    sourcePath: canonicalFinal,
    sourceSha256: '',
    reviews: ['360x800', '390x844', '430x932'].map(resolution => ({
      resolution,
      executed: false,
      result: 'NOT_RUN',
    })),
    allCropsApproved: false,
    reviewedAtUtc: '',
    finalApprovalBlocked: true,
    notes: '',
  });

  const staticInputPath = 'docs/design-targets/generated/top-living-night-v3/review-inputs/static.json';
  write(staticInputPath, {
    schemaVersion: 1,
    candidateSha256,
    referenceSetSha256,
    reviewedAtUtc: '2026-08-07T10:05:00.000Z',
    reviewerRole: 'fixture-human-reviewer',
    core5: {
      exactlyFiveForegroundHumans: true,
      noGenericSubstituteHumans: true,
      reviews: ids.map(id => ({
        id,
        hairFaceMatch: true,
        silhouetteMatch: true,
        outfitColorMatch: true,
        signaturePropMatch: true,
        recognizableAt360: true,
      })),
      yuiAsaNagiMutuallyDistinct: true,
      michiruTealIdentityDistinct: true,
      tomoriRustIdentityDistinct: true,
    },
    crops: ['360x800', '390x844', '430x932'].map(resolution => ({
      resolution,
      titleSafe: true,
      primaryButtonSafe: true,
      secondaryButtonSafe: true,
      facesUnobstructed: true,
      signaturePropsUnobstructed: true,
      animalRobotReadable: true,
    })),
  });
  const staticOut = run('scripts/unity/register-top-living-night-static-review.ts', staticInputPath);
  invariant(staticOut.includes('core5=PASSED') && staticOut.includes('crops=PASSED'), 'static review fixture did not pass');
  let finalArt = read('docs/design-targets/generated/top-living-night-v3/final-art-status.json');
  let identity = read('docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json');
  let crop = read('docs/design-targets/generated/top-living-night-v3/crop-review-status.json');
  invariant(finalArt.core5IdentityReviewed && finalArt.cropReviewComplete, 'static review did not synchronize derived final-art flags');
  invariant(!finalArt.runtimeApproved && !finalArt.approvedAsFinal && finalArt.finalApprovalBlocked, 'static review improperly promoted runtime/final approval');
  invariant(identity.allIdentitiesApproved && identity.finalApprovalBlocked === false, 'static Core5 evidence did not pass');
  invariant(crop.allCropsApproved && crop.finalApprovalBlocked === false, 'static crop evidence did not pass');

  write('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json', {
    schemaVersion: 1,
    executed: true,
    result: 'PASSED',
    unityVersion: '6000.5.1f1',
    verifiedCommit: commit,
    sourceCompositeKind: 'final-core5',
    sourceCompositePath: canonicalFinal,
    sourceCompositeSha256: candidateSha,
    generatedAtUtc: '2026-08-07T10:10:00.000Z',
  });
  write('docs/design-targets/generated/top-living-night-v3/motion-review-status.json', {
    schemaVersion: 1,
    candidatePath: canonicalFinal,
    candidateSha256: '',
    normalMotion: { executed: false, result: 'NOT_RUN', reviewDurationSeconds: 0 },
    reducedMotion: { executed: false, result: 'NOT_RUN', reviewDurationSeconds: 0 },
    unityVersion: '',
    verifiedCommit: '',
    reviewedAtUtc: '',
    motionApproved: false,
    runtimeApproved: false,
    finalApprovalBlocked: true,
    notes: '',
  });
  const motionInputPath = 'docs/design-targets/generated/top-living-night-v3/review-inputs/motion.json';
  write(motionInputPath, {
    schemaVersion: 1,
    candidateSha256,
    verifiedCommit: commit,
    unityVersion: '6000.5.1f1',
    reviewedAtUtc: '2026-08-07T10:20:00.000Z',
    normalMotion: {
      reviewDurationSeconds: 300,
      obviousShortLoopObserved: false,
      accumulatingParticlesObserved: false,
      brightnessDriftObserved: false,
      textureLifecycleIssueObserved: false,
    },
    reducedMotion: {
      reviewDurationSeconds: 60,
      cloudMovementStopped: true,
      particlesSuppressed: true,
      rareRobotEyeSuppressed: true,
      fireRemainsRestrained: true,
      uiFunctional: true,
    },
  });
  const motionOut = run('scripts/unity/register-top-living-night-motion-review.ts', motionInputPath);
  invariant(motionOut.includes('normal=PASSED/300s') && motionOut.includes('reduced=PASSED/60s'), 'motion review fixture did not pass');
  finalArt = read('docs/design-targets/generated/top-living-night-v3/final-art-status.json');
  const motion = read('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');
  invariant(finalArt.motionSeparationReviewed && motion.motionApproved, 'motion review did not synchronize approval evidence');
  invariant(!motion.runtimeApproved && !finalArt.runtimeApproved && !finalArt.approvedAsFinal, 'motion review improperly promoted runtime/final approval');

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
    generatedAtUtc: '2026-08-07T10:25:00.000Z',
    captures: Array.from({ length: 15 }, (_, index) => ({ id: index })),
  });
  write('docs/design-targets/generated/loading-seasonal-v1/manifest.json', {
    schemaVersion: 1,
    approval: {
      humanVisualReviewComplete: false,
      runtimeApproved: false,
      approvedAsFinal: false,
      finalApprovalBlocked: true,
    },
  });
  write('docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json', {
    schemaVersion: 1,
    executed: false,
    result: 'NOT_RUN',
    candidateGenerated: false,
    candidatePath: canonicalFinal,
    candidateSha256: '',
    captureSourceCommit: '',
    topCompositeKind: '',
    topCompositePath: '',
    topCompositeSha256: '',
    expectedFrameCount: 15,
    reviewedFrameCount: 0,
    loadingFramesReviewed: 0,
    topFramesReviewed: 0,
    reviewerRole: '',
    reviewedAtUtc: '',
    humanVisualReviewComplete: false,
    finalApprovalBlocked: true,
  });
  const humanInputPath = 'docs/design-targets/generated/top-living-night-v3/review-inputs/human.json';
  write(humanInputPath, {
    schemaVersion: 1,
    candidateSha256,
    captureSourceCommit: commit,
    captureGeneratedAtUtc: '2026-08-07T10:25:00.000Z',
    reviewerRole: 'fixture-human-reviewer',
    reviewedAtUtc: '2026-08-07T10:30:00.000Z',
    noBlackOrBlankFrames: true,
    noDevelopmentText: true,
    topCore5Readable: true,
    cropSafeAcrossAllTargets: true,
    loadingToTopContinuityPassed: true,
    notes: 'fixture',
  });
  const humanOut = run('scripts/unity/register-top-living-night-human-review.ts', humanInputPath);
  invariant(humanOut.includes('result=PASSED frames=15/15'), 'human review fixture did not pass');
  finalArt = read('docs/design-targets/generated/top-living-night-v3/final-art-status.json');
  const human = read('docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json');
  const loading = read('docs/design-targets/generated/loading-seasonal-v1/manifest.json');
  invariant(finalArt.humanVisualReviewComplete && human.humanVisualReviewComplete, 'human review did not synchronize TOP human flag');
  invariant(loading.approval.humanVisualReviewComplete, 'human review did not synchronize shared Loading human flag');
  invariant(!finalArt.runtimeApproved && !finalArt.approvedAsFinal && finalArt.finalApprovalBlocked, 'human review improperly promoted runtime/final approval');
  invariant(!loading.approval.runtimeApproved && !loading.approval.approvedAsFinal && loading.approval.finalApprovalBlocked, 'human review improperly promoted Loading runtime/final approval');

  console.log('TOP Living Night review registration mutation fixture: PASS');
  console.log('Core5/crop -> motion -> human registration succeeds with exact provenance while runtime/final approval remains blocked');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
