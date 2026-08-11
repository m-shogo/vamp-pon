import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const planPath = 'docs/design-targets/generated/top-living-night-v3/motion-review-plan.md';
const ambientPath = 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightAmbientMotionDirector.cs';
const firePath = 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightFireCadenceDirector.cs';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const path of [planPath, ambientPath, firePath]) {
  invariant(existsSync(join(root, path)), `TOP motion review sync input is missing: ${path}`);
}

const plan = readFileSync(join(root, planPath), 'utf8');
const ambient = readFileSync(join(root, ambientPath), 'utf8');
const fire = readFileSync(join(root, firePath), 'utf8');

for (const token of [
  'TopLivingNightAmbientMotionDirector',
  'TopLivingNightFireCadenceDirector',
  'adjacent-frame irregular walk only',
  'rare interior direction reversal',
  'sparse 2–3-step heat bursts',
  'exact authored zero displacement and authored alpha',
  'shared night-air mass plus independent far-cloud detail',
  'shares the broad air mass with far clouds',
  'sparse gated glimmer only',
  'small rotation and anisotropic spread variation',
  'deterministic per-particle size bias',
  'art root: sub-pixel x/y Perlin drift plus extremely small scale breathing',
  'post-view motion owned by `TopLivingNightAmbientMotionDirector`',
  'normal interval | body/coal Perlin-driven `0.082–0.151 s`, multiplied by small edge hold',
  'short heat burst | sparse 2–3 adjacent steps at `0.055–0.082 s`',
  'Reduced Motion interval | body/coal Perlin-driven `0.31–0.48 s`, multiplied by small edge hold; heat burst disabled',
  'fire must not read as a repeated `0 → 11 → 0` metronome',
  'fire never jumps between non-adjacent atlas cells',
  'whole-art breathing is barely perceptible and never looks like camera zoom/shake',
  'fiveMinuteRuntimeReviewComplete=false',
  'reducedMotionRuntimeReviewComplete=false',
  'motionApproved=false',
  'runtimeCaptureComplete=false',
  'runtimeApproved=false',
  'finalApprovalBlocked=true',
]) {
  invariant(plan.includes(token), `TOP motion review plan lost runtime-director requirement: ${token}`);
}

const sharedAnchors = [
  ['.031f', '0.031'],
  ['.027f', '0.027'],
  ['.019f', '0.019'],
  ['.047f', '0.047'],
  ['.018f', '0.018'],
  ['.016f', '0.016'],
  ['.010f', '0.010'],
  ['.014f', '0.014'],
  ['.021f', '0.021'],
  ['.028f', '0.028'],
] as const;
for (const [sourceToken, planToken] of sharedAnchors) {
  invariant(ambient.includes(sourceToken), `TOP ambient director lost documented frequency: ${sourceToken}`);
  invariant(plan.includes(planToken), `TOP motion review plan lost ambient frequency: ${planToken}`);
}

for (const token of [
  'var airMass = Mathf.PerlinNoise(11.17f, time * .018f) - .5f',
  'var gustStrength = Mathf.SmoothStep',
  'var gustDirection = Mathf.PerlinNoise(21.43f, time * .014f) - .5f',
  'var rareGlimmer = readiness > .66f && spark > .86f',
  'var rareWake = lateWindow > .86f',
  'var horizontalSpread = 1f + Mathf.Abs(sharedWind + localWind) * .12f + shapeNoise * .06f',
  'var sizeBias = .74f + (index % 5) * .07f',
]) {
  invariant(ambient.includes(token), `TOP ambient director lost documented finish-polish behavior: ${token}`);
}

for (const token of [
  'Mathf.Lerp(.082f, .151f, cadenceNoise) * edgeHold',
  'Mathf.Lerp(.055f, .082f, cadenceNoise)',
  'Mathf.Lerp(.31f, .48f, cadenceNoise) * edgeHold',
  'heatBurstStepsRemaining = burstTrigger > .972f ? 3 : 2;',
  'frameIndex >= 2 && frameIndex <= 9',
  'frameIndex += direction;',
  'if (reducedMotion)\n                heatBurstStepsRemaining = 0;',
]) {
  invariant(fire.includes(token), `TOP fire cadence implementation lost documented behavior: ${token}`);
}

invariant(
  plan.includes('The two directors do **not** load textures, replace the V3 composite, own capture readiness, or write approval evidence.'),
  'TOP motion review plan must preserve director ownership boundary',
);

const boundaryHeading = '## Current boundary';
const boundaryStart = plan.indexOf(boundaryHeading);
invariant(boundaryStart >= 0, 'TOP motion review plan lost Current boundary section');
const boundary = plan.slice(boundaryStart);
for (const forbidden of [
  'fiveMinuteRuntimeReviewComplete=true',
  'reducedMotionRuntimeReviewComplete=true',
  'motionApproved=true',
  'runtimeCaptureComplete=true',
  'runtimeApproved=true',
  'finalApprovalBlocked=false',
]) {
  invariant(!boundary.includes(forbidden), `TOP motion review boundary cannot claim unexecuted runtime evidence: ${forbidden}`);
}

console.log('TOP motion director / review-plan sync: PASS');
console.log('shared-air-mass ambient + sparse gust/glimmer/wake + irregular particle shaping + adjacent fire cadence/heat-burst anchors are review-bound; Current boundary runtime evidence remains NOT_RUN');