import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type MotionReviewStatus = {
  schemaVersion: number;
  staticContractReady: boolean;
  candidatePath: string;
  candidateSha256: string;
  normalMotion: {
    executed: boolean;
    result: string;
    reviewDurationSeconds: number;
    obviousShortLoopObserved: boolean;
    accumulatingParticlesObserved: boolean;
    brightnessDriftObserved: boolean;
    textureLifecycleIssueObserved: boolean;
  };
  reducedMotion: {
    executed: boolean;
    result: string;
    reviewDurationSeconds: number;
    cloudMovementStopped: boolean;
    particlesSuppressed: boolean;
    rareRobotEyeSuppressed: boolean;
    fireRemainsRestrained: boolean;
    uiFunctional: boolean;
  };
  unityVersion: string;
  verifiedCommit: string;
  reviewedAtUtc: string;
  motionApproved: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
  notes: string;
};

type FinalArtStatus = {
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
};

const root = process.cwd();
const viewPath = join(
  root,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightView.cs',
);
const controllerPath = join(
  root,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightCompositeV3Controller.cs',
);
const coordinatorPath = join(
  root,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/LoadingTopVisualPolishCoordinator.cs',
);
const planPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/motion-review-plan.md',
);
const statusPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/motion-review-status.json',
);
const finalArtStatusPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const path of [viewPath, controllerPath, coordinatorPath, planPath, statusPath, finalArtStatusPath]) {
  invariant(existsSync(path), `TOP motion contract input is missing: ${path}`);
}

const view = readFileSync(viewPath, 'utf8');
const controller = readFileSync(controllerPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');
const plan = readFileSync(planPath, 'utf8');
const status = JSON.parse(readFileSync(statusPath, 'utf8')) as MotionReviewStatus;
const finalArt = JSON.parse(readFileSync(finalArtStatusPath, 'utf8')) as FinalArtStatus;

for (const token of [
  'AnimateSky(time)',
  'AnimateLights(time)',
  'AnimateFire(time, Time.unscaledDeltaTime)',
  'AnimateParticles(time)',
  'Mathf.Sin(time * .113f) * 2.8f',
  'Mathf.Sin(time * .197f + 1.7f) * 5.2f',
  'Mathf.PerlinNoise(.17f, time * .082f)',
  'Mathf.PerlinNoise(2.31f, time * .071f)',
  'Mathf.PerlinNoise(5.13f, time * .83f)',
  'Mathf.PerlinNoise(9.71f, time * 1.67f)',
  'Mathf.PerlinNoise(12.7f, time * .19f)',
  'Mathf.Repeat(time + 11.7f, 47f)',
  'phase > 1.35f',
  '.105f + Mathf.PerlinNoise(4.2f, time * .23f) * .018f',
  'Mathf.PerlinNoise(7.9f, fireStep * .173f) > .77f',
  '4.8f + index * 1.05f',
  '.17f + index * .23f',
  '2.6f + index % 4 * .44f',
  '.09f * index',
  'vamp_pon_reduced_motion',
  'reduce_motion',
]) {
  invariant(view.includes(token), `TOP asynchronous motion contract missing: ${token}`);
}

const staticStart = controller.indexOf('private static readonly string[] StaticLayersReplacedByComposite');
const masksStart = controller.indexOf('private static readonly MaskStyle[] AdditiveMasks', staticStart);
invariant(staticStart >= 0 && masksStart > staticStart, 'TOP V3 static replacement block is missing');
const staticBlock = controller.slice(staticStart, masksStart);
for (const liveSkyLayer of ['Stars', 'CloudsFar', 'CloudsNear']) {
  invariant(
    !staticBlock.includes(`"${liveSkyLayer}"`),
    `TOP asynchronous sky motion is coded but hidden by V3 composition: ${liveSkyLayer}`,
  );
}
invariant(
  controller.includes('transparent stars/clouds, fire, smoke, embers and additive light masks remain live'),
  'TOP V3 runtime log must document visible sky + motion overlays',
);

for (const token of [
  'Smoke_01',
  'Ember_01',
  'var contentReady = AreBaseLayersReady();',
  'IsCurrentTopReady = contentReady',
  'capture readiness remains blocked until all required content is ready',
]) {
  invariant(coordinator.includes(token), `TOP capture motion-readiness guard missing: ${token}`);
}
invariant(
  !coordinator.includes('IsCurrentTopReady = true;'),
  'TOP visual timeout must not unconditionally promote capture readiness',
);

invariant(
  /reducedMotion\s*\?\s*Vector2\.zero/.test(view),
  'TOP Reduced Motion must stop cloud displacement',
);
invariant(
  /reducedMotion\s*\?\s*\.25f\s*:\s*\.105f\s*\+\s*Mathf\.PerlinNoise/.test(view),
  'TOP Reduced Motion must slow fire playback',
);
invariant(
  /reducedMotion\s*\?\s*\.02f\s*:\s*\.10f/.test(view),
  'TOP Reduced Motion must retain only restrained fire-glow variation',
);
invariant(
  /reducedMotion\s*\|\|\s*phase\s*>\s*1\.35f/.test(view),
  'TOP Reduced Motion must disable the rare robot-eye event',
);

const reducedParticleSuppressions = view.match(/reducedMotion\s*\?\s*0f\s*:\s*Mathf\.Sin/g) ?? [];
invariant(
  reducedParticleSuppressions.length >= 2,
  'TOP Reduced Motion must visually suppress both smoke and ember families',
);

invariant(!view.includes('.mp4'), 'TOP runtime motion must not use MP4');
invariant(!view.includes('.webp'), 'TOP runtime motion must not use WebP animation');

for (const token of [
  'STATIC_CONTRACT_READY / RUNTIME_REVIEW_NOT_RUN',
  'breathing night',
  'Fire flipbook',
  'Fire glow',
  'Far clouds',
  'Near clouds',
  'Robot eye',
  'Smoke wisps',
  'Embers',
  'Anti-loop requirements',
  'Reduced Motion gate',
  'Five-minute runtime review protocol',
  'fiveMinuteRuntimeReviewComplete=false',
  'reducedMotionRuntimeReviewComplete=false',
  'motionApproved=false',
  'finalApprovalBlocked=true',
]) {
  invariant(plan.includes(token), `TOP motion review boundary missing: ${token}`);
}

invariant(status.schemaVersion === 1, 'TOP motion review status schema mismatch');
invariant(status.staticContractReady, 'TOP motion static contract must remain ready');
const canonicalCandidatePath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
invariant(status.candidatePath === canonicalCandidatePath, 'TOP motion review candidate path must remain canonical');
invariant(finalArt.candidatePath === canonicalCandidatePath, 'TOP final-art candidate path must remain canonical');
invariant(status.candidatePath === finalArt.candidatePath, 'TOP motion review and final-art candidate paths diverged');

const motionExecuted = status.normalMotion.executed || status.reducedMotion.executed;
if (!motionExecuted) {
  invariant(status.candidateSha256 === '', 'NOT_RUN motion review must not retain a stale candidate SHA-256');
} else {
  invariant(finalArt.candidateGenerated, 'motion review cannot execute before the final TOP candidate exists');
  invariant(/^[0-9a-f]{64}$/.test(status.candidateSha256), 'executed motion review requires a final-art SHA-256');
  invariant(status.candidateSha256 === finalArt.candidateSha256, 'motion review must target the exact current final-art candidate');
}

if (!status.normalMotion.executed) {
  invariant(status.normalMotion.result === 'NOT_RUN', 'unexecuted normal-motion review must be NOT_RUN');
  invariant(status.normalMotion.reviewDurationSeconds === 0, 'unexecuted normal-motion duration must be zero');
  invariant(!status.normalMotion.obviousShortLoopObserved, 'unexecuted review cannot record a short-loop observation');
  invariant(!status.normalMotion.accumulatingParticlesObserved, 'unexecuted review cannot record particle accumulation');
  invariant(!status.normalMotion.brightnessDriftObserved, 'unexecuted review cannot record brightness drift');
  invariant(!status.normalMotion.textureLifecycleIssueObserved, 'unexecuted review cannot record texture lifecycle issues');
} else {
  invariant(status.normalMotion.reviewDurationSeconds >= 300, 'normal-motion review must run for at least five minutes');
  invariant(['PASSED', 'FAILED'].includes(status.normalMotion.result), 'executed normal-motion review needs PASSED or FAILED');
  if (status.normalMotion.result === 'PASSED') {
    invariant(!status.normalMotion.obviousShortLoopObserved, 'passed normal-motion review cannot contain an obvious short loop');
    invariant(!status.normalMotion.accumulatingParticlesObserved, 'passed normal-motion review cannot contain particle accumulation');
    invariant(!status.normalMotion.brightnessDriftObserved, 'passed normal-motion review cannot contain brightness drift');
    invariant(!status.normalMotion.textureLifecycleIssueObserved, 'passed normal-motion review cannot contain texture lifecycle issues');
  }
}

if (!status.reducedMotion.executed) {
  invariant(status.reducedMotion.result === 'NOT_RUN', 'unexecuted Reduced Motion review must be NOT_RUN');
  invariant(status.reducedMotion.reviewDurationSeconds === 0, 'unexecuted Reduced Motion duration must be zero');
  invariant(!status.reducedMotion.cloudMovementStopped, 'unexecuted Reduced Motion review cannot assert cloud behavior');
  invariant(!status.reducedMotion.particlesSuppressed, 'unexecuted Reduced Motion review cannot assert particle behavior');
  invariant(!status.reducedMotion.rareRobotEyeSuppressed, 'unexecuted Reduced Motion review cannot assert robot-eye behavior');
  invariant(!status.reducedMotion.fireRemainsRestrained, 'unexecuted Reduced Motion review cannot assert fire behavior');
  invariant(!status.reducedMotion.uiFunctional, 'unexecuted Reduced Motion review cannot assert UI behavior');
} else {
  invariant(status.reducedMotion.reviewDurationSeconds >= 60, 'Reduced Motion runtime review must run for at least one minute');
  invariant(['PASSED', 'FAILED'].includes(status.reducedMotion.result), 'executed Reduced Motion review needs PASSED or FAILED');
  if (status.reducedMotion.result === 'PASSED') {
    invariant(status.reducedMotion.cloudMovementStopped, 'passed Reduced Motion review requires stopped cloud displacement');
    invariant(status.reducedMotion.particlesSuppressed, 'passed Reduced Motion review requires suppressed smoke/embers');
    invariant(status.reducedMotion.rareRobotEyeSuppressed, 'passed Reduced Motion review requires suppressed rare robot eye');
    invariant(status.reducedMotion.fireRemainsRestrained, 'passed Reduced Motion review requires restrained fire motion');
    invariant(status.reducedMotion.uiFunctional, 'passed Reduced Motion review requires functional UI');
  }
}

if (status.motionApproved) {
  invariant(finalArt.candidateGenerated, 'motion approval requires a generated final TOP candidate');
  invariant(status.candidateSha256 === finalArt.candidateSha256, 'motion approval requires review of the current final-art candidate');
  invariant(status.normalMotion.executed && status.normalMotion.result === 'PASSED', 'motion approval requires passed five-minute review');
  invariant(status.reducedMotion.executed && status.reducedMotion.result === 'PASSED', 'motion approval requires passed Reduced Motion review');
  invariant(status.unityVersion.length > 0, 'motion approval requires Unity version');
  invariant(/^[0-9a-f]{40}$/.test(status.verifiedCommit), 'motion approval requires a verified commit SHA');
  invariant(status.reviewedAtUtc.length > 0, 'motion approval requires review timestamp');
} else {
  invariant(!status.runtimeApproved, 'unapproved motion cannot be runtime-approved');
  invariant(status.finalApprovalBlocked, 'unapproved motion must keep final approval blocked');
}

console.log('TOP Living Night motion contract: PASS');
console.log('visible async: transparent sky + lights + fire + smoke + embers + rare robot-eye');
console.log('capture: timeout reveal cannot bypass smoke/ember readiness');
console.log('reduced motion: cloud displacement + particles + rare eye reduced; fire/glow retained in restrained form');
console.log(`review: normal=${status.normalMotion.result} reduced=${status.reducedMotion.result} approved=${status.motionApproved}`);
