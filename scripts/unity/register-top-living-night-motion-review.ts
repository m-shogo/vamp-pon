import { isAbsolute, join, normalize, relative } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const canonicalFinalPath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const paths = {
  finalArt: 'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
  motion: 'docs/design-targets/generated/top-living-night-v3/motion-review-status.json',
  unity: 'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json',
} as const;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function arg(name: string): string {
  const prefix = `--${name}=`;
  const found = process.argv.find(value => value.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(join(root, path), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function validUtc(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

function canonicalInputPath(input: string): string {
  const absolute = isAbsolute(input) ? normalize(input) : join(root, normalize(input));
  const repoRelative = relative(root, absolute).replaceAll('\\', '/');
  invariant(!repoRelative.startsWith('../') && repoRelative !== '..', 'motion review input must stay inside the repository');
  invariant(repoRelative.endsWith('.json'), 'motion review input must be JSON');
  return repoRelative;
}

function main(): void {
  for (const path of Object.values(paths)) {
    invariant(existsSync(join(root, path)), `motion review authority/evidence is missing: ${path}`);
  }

  const finalArt = readJson(paths.finalArt);
  const motion = readJson(paths.motion);
  const unity = readJson(paths.unity);

  invariant(finalArt.schemaVersion === 1, 'final-art schema mismatch');
  invariant(motion.schemaVersion === 1, 'motion review schema mismatch');
  invariant(unity.schemaVersion === 1, 'Unity V3 evidence schema mismatch');
  invariant(finalArt.candidatePath === canonicalFinalPath, 'final candidate path is not canonical');
  invariant(motion.candidatePath === canonicalFinalPath, 'motion candidate path is not canonical');

  if (dryRun) {
    console.log('TOP motion review registration: DRY_RUN_READY');
    console.log('input: current candidate/Unity provenance + reviewedAtUtc + normal >=300s observations + Reduced Motion >=60s observations + optional notes');
    console.log('candidate SHA / Unity version / verified commit are bound automatically from current PASSED Unity V3 evidence and stale templates are rejected.');
    console.log('registration never promotes runtimeApproved or approvedAsFinal.');
    return;
  }

  invariant(finalArt.candidateGenerated === true, 'motion review requires registered final candidate');
  invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateSha256), 'motion review requires valid final candidate SHA-256');
  invariant(!finalArt.runtimeApproved && !finalArt.approvedAsFinal, 'approved/runtime-approved final art must be re-registered before motion review can change');

  invariant(unity.executed === true && unity.result === 'PASSED', 'motion review requires PASSED Unity V3 evidence');
  invariant(/^[0-9a-f]{40}$/.test(unity.verifiedCommit), 'motion review requires Unity verified commit');
  invariant(typeof unity.unityVersion === 'string' && unity.unityVersion.length > 0, 'motion review requires Unity version');
  invariant(unity.sourceCompositeKind === 'final-core5', 'motion review cannot use bridge Unity evidence');
  invariant(unity.sourceCompositePath === canonicalFinalPath, 'motion review requires canonical final TOP Unity source');
  invariant(unity.sourceCompositeSha256 === finalArt.candidateSha256, 'motion review requires Unity evidence for exact current final TOP bytes');
  invariant(validUtc(unity.generatedAtUtc), 'motion review requires canonical Unity verification timestamp');

  const inputArg = arg('input');
  invariant(inputArg.length > 0, '--input=<review.json> is required');
  const inputPath = canonicalInputPath(inputArg);
  invariant(existsSync(join(root, inputPath)), `motion review input is missing: ${inputPath}`);
  const input = readJson(inputPath);
  invariant(input.schemaVersion === 1, 'motion review input schema mismatch');
  invariant(input.candidateSha256 === finalArt.candidateSha256, 'motion review input is stale: candidate SHA-256 mismatch');
  invariant(input.verifiedCommit === unity.verifiedCommit, 'motion review input is stale: Unity verified commit mismatch');
  invariant(input.unityVersion === unity.unityVersion, 'motion review input is stale: Unity version mismatch');
  invariant(validUtc(input.reviewedAtUtc), 'motion review input requires canonical UTC reviewedAtUtc');
  invariant(Date.parse(input.reviewedAtUtc) >= Date.parse(unity.generatedAtUtc), 'motion review cannot predate Unity V3 verification');
  invariant(Number.isFinite(input.normalMotion?.reviewDurationSeconds) && input.normalMotion.reviewDurationSeconds >= 0, 'motion review input requires normal duration');
  invariant(Number.isFinite(input.reducedMotion?.reviewDurationSeconds) && input.reducedMotion.reviewDurationSeconds >= 0, 'motion review input requires Reduced Motion duration');

  for (const key of [
    'obviousShortLoopObserved',
    'accumulatingParticlesObserved',
    'brightnessDriftObserved',
    'textureLifecycleIssueObserved',
  ]) {
    invariant(typeof input.normalMotion?.[key] === 'boolean', `motion review input requires normal boolean ${key}`);
  }
  for (const key of [
    'cloudMovementStopped',
    'particlesSuppressed',
    'rareRobotEyeSuppressed',
    'fireRemainsRestrained',
    'uiFunctional',
  ]) {
    invariant(typeof input.reducedMotion?.[key] === 'boolean', `motion review input requires Reduced Motion boolean ${key}`);
  }

  const normalPassed =
    input.normalMotion.reviewDurationSeconds >= 300 &&
    !input.normalMotion.obviousShortLoopObserved &&
    !input.normalMotion.accumulatingParticlesObserved &&
    !input.normalMotion.brightnessDriftObserved &&
    !input.normalMotion.textureLifecycleIssueObserved;
  const reducedPassed =
    input.reducedMotion.reviewDurationSeconds >= 60 &&
    input.reducedMotion.cloudMovementStopped &&
    input.reducedMotion.particlesSuppressed &&
    input.reducedMotion.rareRobotEyeSuppressed &&
    input.reducedMotion.fireRemainsRestrained &&
    input.reducedMotion.uiFunctional;
  const approved = normalPassed && reducedPassed;

  Object.assign(motion.normalMotion, {
    executed: true,
    result: normalPassed ? 'PASSED' : 'FAILED',
    reviewDurationSeconds: input.normalMotion.reviewDurationSeconds,
    obviousShortLoopObserved: input.normalMotion.obviousShortLoopObserved,
    accumulatingParticlesObserved: input.normalMotion.accumulatingParticlesObserved,
    brightnessDriftObserved: input.normalMotion.brightnessDriftObserved,
    textureLifecycleIssueObserved: input.normalMotion.textureLifecycleIssueObserved,
  });
  Object.assign(motion.reducedMotion, {
    executed: true,
    result: reducedPassed ? 'PASSED' : 'FAILED',
    reviewDurationSeconds: input.reducedMotion.reviewDurationSeconds,
    cloudMovementStopped: input.reducedMotion.cloudMovementStopped,
    particlesSuppressed: input.reducedMotion.particlesSuppressed,
    rareRobotEyeSuppressed: input.reducedMotion.rareRobotEyeSuppressed,
    fireRemainsRestrained: input.reducedMotion.fireRemainsRestrained,
    uiFunctional: input.reducedMotion.uiFunctional,
  });
  motion.candidatePath = canonicalFinalPath;
  motion.candidateSha256 = finalArt.candidateSha256;
  motion.unityVersion = unity.unityVersion;
  motion.verifiedCommit = unity.verifiedCommit;
  motion.reviewedAtUtc = input.reviewedAtUtc;
  motion.motionApproved = approved;
  motion.runtimeApproved = false;
  motion.finalApprovalBlocked = !approved;
  motion.notes = typeof input.notes === 'string' ? input.notes : '';

  finalArt.motionSeparationReviewed = approved;
  finalArt.runtimeApproved = false;
  finalArt.approvedAsFinal = false;
  finalArt.finalApprovalBlocked = true;
  finalArt.reviewedAtUtc = '';

  writeJson(paths.motion, motion);
  writeJson(paths.finalArt, finalArt);

  console.log('TOP motion review registration: RECORDED');
  console.log(`normal=${motion.normalMotion.result}/${motion.normalMotion.reviewDurationSeconds}s`);
  console.log(`reduced=${motion.reducedMotion.result}/${motion.reducedMotion.reviewDurationSeconds}s`);
  console.log(`approved=${motion.motionApproved}`);
  console.log(`verifiedCommit=${unity.verifiedCommit}`);
  console.log('runtimeApproved=false approvedAsFinal=false (motion review never promotes runtime/final approval)');
}

main();
