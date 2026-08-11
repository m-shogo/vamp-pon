import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = process.cwd();
const ambientPath = join(
  repoRoot,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightAmbientMotionDirector.cs',
);
const firePath = join(
  repoRoot,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightFireCadenceDirector.cs',
);
const buttonPath = join(
  repoRoot,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightButtonPolishDirector.cs',
);
const buttonMetaPath = `${buttonPath}.meta`;
const finalStatusPath = join(
  repoRoot,
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
);

for (const requiredPath of [
  ambientPath,
  firePath,
  buttonPath,
  buttonMetaPath,
  finalStatusPath,
]) {
  if (!existsSync(requiredPath)) {
    throw new Error(`TOP finish-polish required file is missing: ${requiredPath}`);
  }
}

const ambient = readFileSync(ambientPath, 'utf8');
const fire = readFileSync(firePath, 'utf8');
const button = readFileSync(buttonPath, 'utf8');
const buttonMeta = readFileSync(buttonMetaPath, 'utf8');
const finalStatus = JSON.parse(readFileSync(finalStatusPath, 'utf8')) as {
  core5IdentityReviewed: boolean;
  cropReviewComplete: boolean;
  motionSeparationReviewed: boolean;
  humanVisualReviewComplete: boolean;
  approvedAsFinal: boolean;
  runtimeApproved: boolean;
  finalApprovalBlocked: boolean;
};

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

// Night sky: non-periodic layered drift plus sparse variation, not a shared sine loop.
invariant(ambient.includes('var airMass = Mathf.PerlinNoise'), 'shared slow sky air mass is missing');
invariant(ambient.includes('var gustStrength = Mathf.SmoothStep'), 'sparse sky gust envelope is missing');
invariant(ambient.includes('var gustDirection = Mathf.PerlinNoise'), 'signed sky gust direction is missing');
invariant(ambient.includes('CloudsFarBaseAlpha'), 'far-cloud density breathing is missing');
invariant(ambient.includes('CloudsNearBaseAlpha'), 'near-cloud density breathing is missing');
invariant(ambient.includes('rareGlimmer'), 'sparse star glimmer is missing');
invariant(ambient.includes('rareWake'), 'sparse distant-light variation is missing');
invariant(ambient.includes('settling'), 'lantern slow settling variation is missing');

// Fire/smoke/embers: cadence remains adjacent-frame and particles gain irregular shape/size.
invariant(fire.includes('heatBurstStepsRemaining'), 'fire heat-burst cadence is missing');
invariant(fire.includes('frameIndex += direction;'), 'fire must advance by adjacent atlas frames');
invariant(!fire.includes('frameIndex += direction *'), 'fire must not skip authored atlas frames');
invariant(fire.includes('edgeHold'), 'fire silhouette edge hold is missing');
invariant(fire.includes('if (reducedMotion)\n                heatBurstStepsRemaining = 0;'), 'Reduced Motion must cancel fire heat bursts');
invariant(ambient.includes('horizontalSpread'), 'smoke anisotropic spread is missing');
invariant(ambient.includes('sizeBias'), 'ember per-particle size variation is missing');
invariant(ambient.includes('localRotation = Quaternion.identity'), 'Reduced Motion particle rotation reset is missing');

// TOP button polish must wrap existing buttons, not replace navigation callbacks or layout ownership.
invariant(button.includes('OpenStageSelectButton'), 'TOP main button binding is missing');
invariant(button.includes('OpenCollectionFromTopButton'), 'TOP collection button binding is missing');
invariant(button.includes('transform.GetComponent<Button>()'), 'TOP button polish must reuse existing Button components');
invariant(button.includes('image.sprite = null;'), 'generic paper-card button surface is still active');
invariant(button.includes('CreateRule'), 'quiet station/ticket rule treatment is missing');
invariant(button.includes('DEPART'), 'primary micro-copy is missing');
invariant(button.includes('ARCHIVE'), 'collection micro-copy is missing');
invariant(!button.includes('onClick.AddListener'), 'button polish must not replace or duplicate navigation callbacks');
invariant(!button.includes('anchorMin = new Vector2(.12f, .095f)'), 'button polish must not redefine main tap bounds');
invariant(!button.includes('anchorMin = new Vector2(.31f, .025f)'), 'button polish must not redefine collection tap bounds');
invariant(/^fileFormatVersion: 2\nguid: [0-9a-f]{32}$/m.test(buttonMeta.trim()), 'TOP button polish Unity meta is invalid');

// Mechanical work is not human approval.
invariant(finalStatus.core5IdentityReviewed === false, 'Core5 identity review must remain human-pending');
invariant(finalStatus.cropReviewComplete === false, 'crop review must remain human-pending');
invariant(finalStatus.motionSeparationReviewed === false, 'motion separation review must remain human-pending');
invariant(finalStatus.humanVisualReviewComplete === false, 'human visual review must remain pending');
invariant(finalStatus.approvedAsFinal === false, 'final approval must remain false');
invariant(finalStatus.runtimeApproved === false, 'runtime approval must remain false');
invariant(finalStatus.finalApprovalBlocked === true, 'final approval must remain blocked');

console.log('TOP Living Night V3 finish polish: PASS');
console.log('night sky: layered Perlin air mass + signed rare gust + quiet alpha variation');
console.log('fire: adjacent-frame heat cadence + irregular smoke/ember shaping');
console.log('buttons: existing callbacks/tap bounds preserved; TOP-only quiet rail treatment');
console.log('approval: human review pending / approvedAsFinal=false / runtimeApproved=false');
