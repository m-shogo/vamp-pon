import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const paths = {
  finalArt: 'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  unity: 'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json',
  capture: 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json',
} as const;
const outputs = {
  motion: 'docs/design-targets/generated/top-living-night-v3/review-inputs/motion-review-current.json',
  human: 'docs/design-targets/generated/top-living-night-v3/review-inputs/human-review-current.json',
} as const;
const canonicalFinalPath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function writeJson(path: string, value: unknown): void {
  const absolute = join(root, path);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function main(): void {
  for (const path of Object.values(paths)) invariant(existsSync(join(root, path)), `review template authority is missing: ${path}`);
  const finalArt = readJson(paths.finalArt);
  const unity = readJson(paths.unity);
  const capture = readJson(paths.capture);

  invariant(finalArt.schemaVersion === 1, 'final-art schema mismatch');
  invariant(unity.schemaVersion === 1, 'Unity V3 schema mismatch');
  invariant(capture.schemaVersion === 1, 'capture schema mismatch');

  if (!finalArt.candidateGenerated) {
    console.log('TOP runtime review templates: BLOCKED');
    console.log('NEXT=final-candidate');
    console.log('No runtime review templates were written.');
    return;
  }
  invariant(finalArt.candidatePath === canonicalFinalPath, 'runtime review templates require canonical final candidate path');
  invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateSha256), 'runtime review templates require valid final candidate SHA-256');

  let motionWritten = false;
  let humanWritten = false;

  if (unity.executed && unity.result === 'PASSED') {
    invariant(unity.sourceCompositeKind === 'final-core5', 'motion template requires final-core5 Unity evidence');
    invariant(unity.sourceCompositePath === canonicalFinalPath, 'motion template requires canonical final Unity source');
    invariant(unity.sourceCompositeSha256 === finalArt.candidateSha256, 'motion template requires Unity evidence for exact current candidate');
    invariant(/^[0-9a-f]{40}$/.test(unity.verifiedCommit), 'motion template requires Unity verified commit');
    writeJson(outputs.motion, {
      schemaVersion: 1,
      candidateSha256: finalArt.candidateSha256,
      verifiedCommit: unity.verifiedCommit,
      unityVersion: unity.unityVersion,
      reviewedAtUtc: '',
      normalMotion: {
        reviewDurationSeconds: 300,
        obviousShortLoopObserved: false,
        accumulatingParticlesObserved: false,
        brightnessDriftObserved: false,
        textureLifecycleIssueObserved: false
      },
      reducedMotion: {
        reviewDurationSeconds: 60,
        cloudMovementStopped: false,
        particlesSuppressed: false,
        rareRobotEyeSuppressed: false,
        fireRemainsRestrained: false,
        uiFunctional: false,
        liveToggleToReducedSettled: false,
        liveToggleBackToNormalSettled: false,
        noToggleVisualPopOrDuplication: false
      },
      notes: '',
      instructions: {
        defaultsAreNotApproval: true,
        negativeProblemFlagsDefaultFalse: true,
        positiveReducedMotionObservationsDefaultFalse: true,
        liveToggleObservationsRequired: true,
        submitWith: `node --experimental-strip-types scripts/unity/register-top-living-night-motion-review.ts --input=${outputs.motion}`
      }
    });
    motionWritten = true;
  }

  if (capture.executed && capture.result === 'PASSED') {
    invariant(capture.expectedCaptureCount === 15 && capture.captureCount === 15 && capture.captures?.length === 15, 'human template requires complete 15-frame capture pack');
    invariant(capture.topCompositeKind === 'final-core5', 'human template requires final-core5 capture evidence');
    invariant(capture.topCompositePath === canonicalFinalPath, 'human template requires canonical final capture source');
    invariant(capture.topCompositeSha256 === finalArt.candidateSha256, 'human template requires capture of exact current candidate');
    writeJson(outputs.human, {
      schemaVersion: 1,
      candidateSha256: finalArt.candidateSha256,
      captureSourceCommit: capture.sourceCommit,
      captureGeneratedAtUtc: capture.generatedAtUtc,
      reviewerRole: '',
      reviewedAtUtc: '',
      noBlackOrBlankFrames: false,
      noDevelopmentText: false,
      topCore5Readable: false,
      cropSafeAcrossAllTargets: false,
      loadingToTopContinuityPassed: false,
      notes: '',
      instructions: {
        allFiveVisualBooleansMustBeTrueToPass: true,
        defaultsAreNotApproval: true,
        submitWith: `node --experimental-strip-types scripts/unity/register-top-living-night-human-review.ts --input=${outputs.human}`
      }
    });
    humanWritten = true;
  }

  console.log('TOP runtime review templates: COMPLETE');
  console.log(`motion=${motionWritten ? outputs.motion : 'PENDING_UNITY_V3'}`);
  console.log(`human=${humanWritten ? outputs.human : 'PENDING_CAPTURE_15'}`);
  if (!motionWritten) console.log('NEXT=unity-v3');
  else if (!humanWritten) console.log('NEXT=capture-15');
  else console.log('NEXT=review-observations');
}

main();
