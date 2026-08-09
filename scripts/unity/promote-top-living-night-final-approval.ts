import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const canonicalFinalPath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';

const paths = {
  finalArt: 'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  identity: 'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json',
  crop: 'docs/design-targets/generated/top-living-night-v3/crop-review-status.json',
  motion: 'docs/design-targets/generated/top-living-night-v3/motion-review-status.json',
  human: 'docs/design-targets/generated/top-living-night-v3/human-visual-review-status.json',
  unity: 'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json',
  capture: 'docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json',
  device: 'docs/design-targets/generated/top-living-night-v3/runtime-device-evidence.json',
} as const;

function readJson(path: string): any {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(join(root, path), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function validSha256(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
}

function validCommit(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{40}$/.test(value);
}

function validTime(value: unknown): boolean {
  return typeof value === 'string' && value.length > 0 && Number.isFinite(Date.parse(value));
}

function main(): void {
  const finalArt = readJson(paths.finalArt);
  const identity = readJson(paths.identity);
  const crop = readJson(paths.crop);
  const motion = readJson(paths.motion);
  const human = readJson(paths.human);
  const unity = readJson(paths.unity);
  const capture = readJson(paths.capture);
  const device = readJson(paths.device);

  const candidateSha = finalArt.candidateSha256 as string;
  const verifiedCommit = unity.verifiedCommit as string;
  const blockers: string[] = [];
  const require = (condition: unknown, label: string): void => {
    if (!condition) blockers.push(label);
  };

  require(finalArt.schemaVersion === 1, 'final-art-schema');
  require(finalArt.candidateGenerated === true, 'final-candidate');
  require(finalArt.candidatePath === canonicalFinalPath, 'final-candidate-path');
  require(validSha256(candidateSha), 'final-candidate-sha');
  require(validSha256(finalArt.candidateCore5ReferenceSetSha256), 'core5-reference-set-binding');

  require(identity.schemaVersion === 1, 'core5-schema');
  require(identity.candidateGenerated === true, 'core5-candidate');
  require(identity.sourcePath === canonicalFinalPath, 'core5-source-path');
  require(identity.sourceSha256 === candidateSha, 'core5-source-sha');
  require(identity.referenceSetSha256 === finalArt.candidateCore5ReferenceSetSha256, 'core5-reference-set-sha');
  require(identity.exactlyFiveForegroundHumans === true, 'core5-exactly-five');
  require(identity.noGenericSubstituteHumans === true, 'core5-no-generic-substitutes');
  require(identity.allIdentitiesApproved === true, 'core5-identity-review');
  require(identity.finalApprovalBlocked === false, 'core5-review-unblocked');
  require(validTime(identity.reviewedAtUtc), 'core5-review-time');

  require(crop.schemaVersion === 1, 'crop-schema');
  require(crop.candidateGenerated === true, 'crop-candidate');
  require(crop.sourcePath === canonicalFinalPath, 'crop-source-path');
  require(crop.sourceSha256 === candidateSha, 'crop-source-sha');
  require(crop.allCropsApproved === true, 'crop-review');
  require(crop.finalApprovalBlocked === false, 'crop-review-unblocked');
  require(validTime(crop.reviewedAtUtc), 'crop-review-time');

  require(motion.schemaVersion === 1, 'motion-schema');
  require(motion.candidatePath === canonicalFinalPath, 'motion-source-path');
  require(motion.candidateSha256 === candidateSha, 'motion-source-sha');
  require(motion.normalMotion?.executed === true && motion.normalMotion?.result === 'PASSED', 'motion-normal-review');
  require(motion.normalMotion?.reviewDurationSeconds >= 300, 'motion-normal-duration');
  require(motion.reducedMotion?.executed === true && motion.reducedMotion?.result === 'PASSED', 'motion-reduced-review');
  require(motion.reducedMotion?.reviewDurationSeconds >= 60, 'motion-reduced-duration');
  require(motion.motionApproved === true, 'motion-approval');
  require(motion.finalApprovalBlocked === false, 'motion-unblocked');
  require(validTime(motion.reviewedAtUtc), 'motion-review-time');

  require(human.schemaVersion === 1, 'human-schema');
  require(human.executed === true && human.result === 'PASSED', 'human-review');
  require(human.candidateGenerated === true, 'human-candidate');
  require(human.candidatePath === canonicalFinalPath, 'human-source-path');
  require(human.candidateSha256 === candidateSha, 'human-source-sha');
  require(human.expectedFrameCount === 15 && human.reviewedFrameCount === 15, 'human-frame-count');
  require(human.loadingFramesReviewed === 12 && human.topFramesReviewed === 3, 'human-frame-matrix');
  require(human.humanVisualReviewComplete === true, 'human-review-complete');
  require(human.finalApprovalBlocked === false, 'human-review-unblocked');
  require(validTime(human.reviewedAtUtc), 'human-review-time');

  require(unity.schemaVersion === 1, 'unity-schema');
  require(unity.executed === true && unity.result === 'PASSED', 'unity-v3');
  require(validCommit(verifiedCommit), 'unity-commit');
  require(unity.sourceCompositeKind === 'final-core5', 'unity-final-core5');
  require(unity.sourceCompositePath === canonicalFinalPath, 'unity-source-path');
  require(unity.sourceCompositeSha256 === candidateSha, 'unity-source-sha');
  require(unity.failureCount === 0, 'unity-failure-count');
  require(validTime(unity.generatedAtUtc), 'unity-time');

  require(capture.schemaVersion === 1, 'capture-schema');
  require(capture.executed === true && capture.result === 'PASSED', 'capture-15');
  require(capture.expectedCaptureCount === 15 && capture.captureCount === 15 && capture.captures?.length === 15, 'capture-count');
  require(capture.sourceCommit === verifiedCommit, 'capture-commit');
  require(capture.topCompositeKind === 'final-core5', 'capture-final-core5');
  require(capture.topCompositePath === canonicalFinalPath, 'capture-source-path');
  require(capture.topCompositeSha256 === candidateSha, 'capture-source-sha');
  require(validTime(capture.generatedAtUtc), 'capture-time');

  require(device.schemaVersion === 1, 'device-schema');
  for (const [name, target] of [
    ['simulator', device.simulator],
    ['physical-iphone', device.physicalIphone],
  ] as const) {
    require(target?.executed === true && target?.result === 'PASSED', `${name}-performance`);
    require(target?.sourceCommit === verifiedCommit, `${name}-commit`);
    require(target?.topCompositeKind === 'final-core5', `${name}-final-core5`);
    require(target?.topCompositePath === canonicalFinalPath, `${name}-source-path`);
    require(target?.topCompositeSha256 === candidateSha, `${name}-source-sha`);
    require(target?.durationSeconds >= 300, `${name}-duration`);
    require(target?.averageFps >= 54, `${name}-average-fps`);
    require(target?.minimumFps >= 30, `${name}-minimum-fps`);
    require(target?.framePacingIssueObserved === false, `${name}-frame-pacing`);
    require(target?.memoryRegressionObserved === false, `${name}-memory-regression`);
    require(target?.backgroundForegroundRecoveryPassed === true, `${name}-recovery`);
    require(validSha256(target?.metricsArtifactSha256), `${name}-metrics-sha`);
    require(validTime(target?.recordedAtUtc), `${name}-time`);
  }
  require(['nominal', 'fair'].includes(device.physicalIphone?.thermalState), 'physical-iphone-thermal');

  if (blockers.length > 0) {
    console.log('TOP final approval promotion: BLOCKED');
    console.log(`BLOCKERS=${blockers.join(',')}`);
    console.log('No approval files were mutated.');
    if (!dryRun) throw new Error('TOP final approval prerequisites are incomplete');
    return;
  }

  const unityAt = Date.parse(unity.generatedAtUtc);
  const captureAt = Date.parse(capture.generatedAtUtc);
  const motionAt = Date.parse(motion.reviewedAtUtc);
  const humanAt = Date.parse(human.reviewedAtUtc);
  const core5At = Date.parse(identity.reviewedAtUtc);
  const cropAt = Date.parse(crop.reviewedAtUtc);
  require(captureAt >= unityAt, 'temporal-unity-before-capture');
  require(motionAt >= unityAt, 'temporal-unity-before-motion');
  require(humanAt >= captureAt, 'temporal-capture-before-human');

  if (blockers.length > 0) {
    console.log('TOP final approval promotion: BLOCKED');
    console.log(`BLOCKERS=${blockers.join(',')}`);
    console.log('No approval files were mutated.');
    if (!dryRun) throw new Error('TOP final approval chronology is incomplete');
    return;
  }

  if (dryRun) {
    console.log('TOP final approval promotion: READY');
    console.log(`candidateSha256=${candidateSha}`);
    console.log(`verifiedCommit=${verifiedCommit}`);
    console.log('dry-run: no approval files changed');
    return;
  }

  const now = new Date().toISOString();
  const latestEvidenceAt = Math.max(unityAt, captureAt, motionAt, humanAt, core5At, cropAt);
  if (Date.parse(now) < latestEvidenceAt) throw new Error('system clock predates current approval evidence');

  // Only derived approval state is promoted. Source review/runtime evidence is never rewritten.
  finalArt.core5IdentityReviewed = true;
  finalArt.cropReviewComplete = true;
  finalArt.motionSeparationReviewed = true;
  finalArt.humanVisualReviewComplete = true;
  finalArt.runtimeCaptureComplete = true;
  finalArt.runtimeApproved = true;
  finalArt.approvedAsFinal = true;
  finalArt.finalApprovalBlocked = false;
  finalArt.reviewedAtUtc = now;
  finalArt.notes =
    'Final approval promoted transactionally from coherent Core5/crop/motion/human/Unity/capture/Simulator/physical-iPhone evidence for the exact current candidate bytes.';

  device.runtimeApproved = true;
  device.finalApprovalBlocked = false;
  motion.runtimeApproved = true;

  writeJson(paths.finalArt, finalArt);
  writeJson(paths.device, device);
  writeJson(paths.motion, motion);

  console.log('TOP final approval promotion: PROMOTED');
  console.log(`candidateSha256=${candidateSha}`);
  console.log(`verifiedCommit=${verifiedCommit}`);
  console.log(`approvedAtUtc=${now}`);
  console.log('Loading seasonal approval flags were intentionally not modified.');
}

main();
