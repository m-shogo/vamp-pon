import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const viewPath = join(
  root,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightView.cs',
);
const planPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/motion-review-plan.md',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(viewPath), 'TOP motion runtime view is missing');
invariant(existsSync(planPath), 'TOP five-minute motion review plan is missing');

const view = readFileSync(viewPath, 'utf8');
const plan = readFileSync(planPath, 'utf8');

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

invariant(
  view.includes('reducedMotion\n                    ? Vector2.zero') ||
    view.includes('reducedMotion\r\n                    ? Vector2.zero'),
  'TOP Reduced Motion must stop cloud displacement',
);
invariant(
  view.includes('reducedMotion ? .25f'),
  'TOP Reduced Motion must slow fire playback',
);
invariant(
  view.includes('reducedMotion ? .02f : .10f'),
  'TOP Reduced Motion must retain only restrained fire-glow variation',
);
invariant(
  view.includes('reducedMotion || phase > 1.35f'),
  'TOP Reduced Motion must disable the rare robot-eye event',
);

const reducedParticleSuppressions = view.match(/reducedMotion \? 0f : Mathf\.Sin/g) ?? [];
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

console.log('TOP Living Night motion contract: PASS');
console.log('async: clouds / stars / lights / fire / smoke / embers / rare robot-eye use independent timing anchors');
console.log('reduced motion: cloud displacement + particles + rare eye reduced; fire/glow retained in restrained form');
console.log('review: five-minute and Reduced Motion runtime reviews remain honestly NOT_RUN');
