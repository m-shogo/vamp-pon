import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const directorPath = join(
  root,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightAmbientMotionDirector.cs',
);
const metaPath = `${directorPath}.meta`;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(directorPath), 'TOP ambient motion director is missing');
invariant(existsSync(metaPath), 'TOP ambient motion director Unity meta is missing');

const director = readFileSync(directorPath, 'utf8');
const meta = readFileSync(metaPath, 'utf8');

for (const token of [
  '[DefaultExecutionOrder(900)]',
  '[RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]',
  'FindFirstObjectByType<TopLivingNightView>()',
  'DontDestroyOnLoad(directorObject)',
  'ApplyBreathingNight(time)',
  'ApplyDepthParallax(time)',
  'ApplyNormalMotionVisuals(time)',
  'ApplyParticleAirflow(time)',
  'ApplyReducedMotionVisuals(time)',
  'Mathf.PerlinNoise(.31f, time * .031f)',
  'Mathf.PerlinNoise(1.73f, time * .027f)',
  'Mathf.PerlinNoise(4.91f, time * .019f)',
  'Mathf.PerlinNoise(7.33f, time * .047f)',
  'Mathf.PerlinNoise(11.17f, time * .023f)',
  'Mathf.PerlinNoise(13.61f, time * .017f)',
  'Mathf.PerlinNoise(17.29f, time * .037f)',
  'Mathf.PerlinNoise(19.87f, time * .029f)',
  'Mathf.PerlinNoise(23.41f, time * .026f)',
  'Mathf.PerlinNoise(27.13f, time * .021f)',
  'Mathf.PerlinNoise(33.71f, time * .012f)',
  'artBaseScale * (1f + scaleNoise * .0018f)',
  'PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1',
  'PlayerPrefs.GetInt("reduce_motion", 0) == 1',
  'if (reducedMotion)',
  'RestorePose();',
  'RefreshVisualBindings();',
  'top.GetComponentsInChildren<RawImage>(true)',
  'string.Equals(image.name, "Stars", StringComparison.Ordinal)',
  'string.Equals(image.name, "DistantLights", StringComparison.Ordinal)',
  'string.Equals(image.name, "FireGlow", StringComparison.Ordinal)',
  'string.Equals(image.name, "LanternGlow", StringComparison.Ordinal)',
  'string.Equals(image.name, "RobotEye", StringComparison.Ordinal)',
  'image.name.StartsWith("Smoke_", StringComparison.Ordinal)',
  'image.name.StartsWith("Ember_", StringComparison.Ordinal)',
  'smoke.Sort(CompareByName)',
  'embers.Sort(CompareByName)',
  'stars.color = WithAlpha(stars.color, .56f + slow * .14f + tiny * .025f)',
  'stars.color = WithAlpha(stars.color, .62f)',
  '.625f + (districtA - .5f) * .045f + (districtB - .5f) * .025f',
  'distantLights.color = WithAlpha(distantLights.color, .63f)',
  '.56f + ((first * .62f + second * .38f) - .5f) * .10f',
  '.56f + ((first * .62f + second * .38f) - .5f) * .02f',
  '.45f + (slow - .5f) * .04f + (micro - .5f) * .012f',
  'lanternGlow.color = WithAlpha(lanternGlow.color, .45f)',
  'var readiness = Mathf.PerlinNoise(31.13f, time * .021f)',
  'var trigger = Mathf.PerlinNoise(43.71f, time * .093f)',
  'robotEye.color = WithAlpha(robotEye.color, .16f + rare * .54f)',
  'robotEye.color = WithAlpha(robotEye.color, 0f)',
  'Mathf.PerlinNoise(51.7f + index * 3.1f, time * (.031f + index * .004f))',
  'Mathf.PerlinNoise(73.1f + index * 1.7f, time * (.057f + (index % 3) * .011f))',
  'var sharedWind = Mathf.PerlinNoise(91.7f, time * .043f) - .5f',
  'Mathf.PerlinNoise(101.3f + index * 4.7f, time * (.061f + index * .003f))',
  'Mathf.PerlinNoise(123.1f + index * 1.9f, time * (.13f + (index % 3) * .017f))',
  'cloudsFar.anchoredPosition = farBasePosition',
  'cloudsNear.anchoredPosition = nearBasePosition',
  'titleRoot.anchoredPosition = titleBasePosition',
  'artRoot.localScale = artBaseScale',
  'image.rectTransform.localRotation = Quaternion.identity',
  'live preference toggles work both ways',
  'five-minute review window',
]) {
  invariant(director.includes(token), `TOP ambient motion director contract missing: ${token}`);
}

for (const forbidden of [
  'Resources.Load',
  'Resources.UnloadAsset',
  'UnityWebRequest',
  'Texture2D',
  '.texture =',
  'Destroy(image',
  'Destroy(stars',
  'Destroy(fireGlow',
  'Destroy(robotEye',
  '.mp4',
  '.webp',
  'approvedAsFinal',
  'runtimeApproved',
  'IsCompositeReady =',
  'IsCurrentTopReady =',
]) {
  invariant(!director.includes(forbidden), `TOP ambient motion director crossed a forbidden boundary: ${forbidden}`);
}

invariant(
  director.indexOf('[DefaultExecutionOrder(900)]') < director.indexOf('private void Update()'),
  'TOP ambient director execution order must be declared before Update',
);
invariant(
  director.indexOf('if (reducedMotion)') < director.indexOf('ApplyBreathingNight(time)'),
  'TOP ambient director must resolve Reduced Motion before applying normal ambient drift',
);
invariant(
  director.indexOf('RestorePose();') < director.indexOf('ApplyReducedMotionVisuals(time)'),
  'TOP Reduced Motion must restore geometric pose before applying visual suppression',
);
invariant(
  director.indexOf('ApplyBreathingNight(time)') < director.indexOf('ApplyNormalMotionVisuals(time)'),
  'TOP normal mode must establish breathing geometry before alpha normalization',
);
invariant(
  director.indexOf('ApplyDepthParallax(time)') < director.indexOf('ApplyNormalMotionVisuals(time)'),
  'TOP semantic depth parallax must run before visual alpha normalization',
);
invariant(
  director.indexOf('ApplyNormalMotionVisuals(time)') < director.indexOf('ApplyParticleAirflow(time)'),
  'TOP particle visibility must be established before non-periodic airflow offsets',
);
for (const periodicGeometry of [
  /anchoredPosition\s*=\s*[^;]*Mathf\.Sin/,
  /localScale\s*=\s*[^;]*Mathf\.Sin/,
]) {
  invariant(!periodicGeometry.test(director), 'TOP ambient geometry must not regress to short sine-wave motion');
}
invariant(
  /guid: [0-9a-f]{32}\n/.test(meta),
  'TOP ambient motion director Unity meta GUID is invalid',
);

console.log('TOP Living Night ambient motion director: PASS');
console.log('post-view long-period Perlin breathing/depth + layered sky/light/lantern/rare-eye alpha + smoke/ember density/airflow; Reduced Motion restores pose and suppresses sparse particles without texture/readiness/approval ownership');
