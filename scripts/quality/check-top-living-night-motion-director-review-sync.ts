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
  'adjacent-frame random walk only',
  'rare interior direction reversal',
  'exact authored zero displacement',
  'art root: sub-pixel x/y Perlin drift plus extremely small scale breathing',
  'post-view motion owned by `TopLivingNightAmbientMotionDirector`',
  'normal interval | Perlin-driven `0.076–0.142 s`',
  'Reduced Motion interval | Perlin-driven `0.30–0.46 s`',
  'fire must not read as a repeated `0 → 11 → 0` metronome',
  'fire never jumps between non-adjacent atlas cells',
  'whole-art breathing is barely perceptible and never looks like camera zoom/shake',
  'fiveMinuteRuntimeReviewComplete=false',
  'reducedMotionRuntimeReviewComplete=false',
  'motionApproved=false',
]) {
  invariant(plan.includes(token), `TOP motion review plan lost runtime-director requirement: ${token}`);
}

const sharedAnchors = [
  ['.031f', '0.031'],
  ['.027f', '0.027'],
  ['.019f', '0.019'],
  ['.047f', '0.047'],
  ['.023f', '0.023'],
  ['.017f', '0.017'],
  ['.037f', '0.037'],
  ['.029f', '0.029'],
] as const;
for (const [sourceToken, planToken] of sharedAnchors) {
  invariant(ambient.includes(sourceToken), `TOP ambient director lost documented frequency: ${sourceToken}`);
  invariant(plan.includes(planToken), `TOP motion review plan lost ambient frequency: ${planToken}`);
}

for (const token of [
  'Mathf.Lerp(.076f, .142f, cadenceNoise)',
  'Mathf.Lerp(.30f, .46f, cadenceNoise)',
  'frameIndex >= 2 && frameIndex <= 9',
  'frameIndex += direction;',
]) {
  invariant(fire.includes(token), `TOP fire cadence implementation lost documented behavior: ${token}`);
}

invariant(
  plan.includes('The two directors do **not** load textures, replace the V3 composite, own capture readiness, or write approval evidence.'),
  'TOP motion review plan must preserve director ownership boundary',
);
for (const forbidden of [
  'fiveMinuteRuntimeReviewComplete=true',
  'reducedMotionRuntimeReviewComplete=true',
  'motionApproved=true',
  'runtimeApproved=true',
]) {
  invariant(!plan.includes(forbidden), `TOP motion review plan cannot claim unexecuted runtime evidence: ${forbidden}`);
}

console.log('TOP motion director / review-plan sync: PASS');
console.log('Perlin ambient + adjacent fire cadence anchors are review-bound; runtime evidence remains NOT_RUN');
