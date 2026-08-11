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
  'var airMass = Mathf.PerlinNoise(11.17f, time * .018f) - .5f',
  'var farDetail = Mathf.PerlinNoise(13.61f, time * .031f) - .5f',
  'var nearDetail = Mathf.PerlinNoise(17.29f, time * .047f) - .5f',
  'Mathf.InverseLerp(.70f, .94f, Mathf.PerlinNoise(19.87f, time * .010f))',
  'var gustDirection = Mathf.PerlinNoise(21.43f, time * .014f) - .5f',
  'Mathf.PerlinNoise(24.71f, time * .016f)',
  'Mathf.PerlinNoise(28.91f, time * .027f)',
  'Mathf.PerlinNoise(32.17f, time * .021f)',
  'Mathf.PerlinNoise(35.53f, time * .028f)',
  'Mathf.PerlinNoise(41.41f, time * .026f)',
  'Mathf.PerlinNoise(47.13f, time * .021f)',
  'Mathf.PerlinNoise(53.71f, time * .012f)',
  'artBaseScale * (1f + scaleNoise * .0018f)',
  'CloudsFarBaseAlpha = .78f',
  'CloudsNearBaseAlpha = .82f',
  'PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1',
  'PlayerPrefs.GetInt("reduce_motion", 0) == 1',
  'if (reducedMotion)',
  'RestorePose();',
  'RefreshVisualBindings();',
  'top.GetComponentsInChildren<RawImage>(true)',
  'string.Equals(image.name, "Stars", StringComparison.Ordinal)',
  'string.Equals(image.name, "CloudsFar", StringComparison.Ordinal)',
  'string.Equals(image.name, "CloudsNear", StringComparison.Ordinal)',
  'string.Equals(image.name, "DistantLights", StringComparison.Ordinal)',
  'string.Equals(image.name, "FireGlow", StringComparison.Ordinal)',
  'string.Equals(image.name, "LanternGlow", StringComparison.Ordinal)',
  'string.Equals(image.name, "RobotEye", StringComparison.Ordinal)',
  'image.name.StartsWith("Smoke_", StringComparison.Ordinal)',
  'image.name.StartsWith("Ember_", StringComparison.Ordinal)',
  'smoke.Sort(CompareByName)',
  'embers.Sort(CompareByName)',
  'var rareGlimmer = readiness > .66f && spark > .86f',
  'stars.color = WithAlpha(stars.color, .62f)',
  'var rareWake = lateWindow > .86f',
  'distantLights.color = WithAlpha(distantLights.color, .63f)',
  'var coal = Mathf.PerlinNoise(31.17f, time * .27f)',
  'var flareGate = Mathf.PerlinNoise(37.91f, time * .11f)',
  'var settling = Mathf.PerlinNoise(49.31f, time * .037f)',
  'lanternGlow.color = WithAlpha(lanternGlow.color, .45f)',
  'var readiness = Mathf.PerlinNoise(61.13f, time * .021f)',
  'var trigger = Mathf.PerlinNoise(67.71f, time * .093f)',
  'robotEye.color = WithAlpha(robotEye.color, .16f + rare * .54f)',
  'robotEye.color = WithAlpha(robotEye.color, 0f)',
  'Mathf.PerlinNoise(71.7f + index * 3.1f, time * (.031f + index * .004f))',
  'Mathf.PerlinNoise(93.1f + index * 1.7f, time * (.057f + (index % 3) * .011f))',
  'var sharedWind = Mathf.PerlinNoise(111.7f, time * .043f) - .5f',
  'Mathf.PerlinNoise(121.3f + index * 4.7f, time * (.061f + index * .003f))',
  'var horizontalSpread = 1f + Mathf.Abs(sharedWind + localWind) * .12f + shapeNoise * .06f',
  'Mathf.PerlinNoise(151.1f + index * 1.9f, time * (.13f + (index % 3) * .017f))',
  'var sizeBias = .74f + (index % 5) * .07f',
  'cloudsFar.anchoredPosition = farBasePosition',
  'cloudsNear.anchoredPosition = nearBasePosition',
  'titleRoot.anchoredPosition = titleBasePosition',
  'artRoot.localScale = artBaseScale',
  'cloudsFarImage.color = WithAlpha(cloudsFarImage.color, CloudsFarBaseAlpha)',
  'cloudsNearImage.color = WithAlpha(cloudsNearImage.color, CloudsNearBaseAlpha)',
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
  director.includes('gustStrength') && director.includes('gustDirection'),
  'TOP sky must retain a sparse signed gust envelope',
);
invariant(
  director.includes('rareGlimmer') && director.includes('rareWake'),
  'TOP sky/lights must retain sparse asynchronous variation',
);
invariant(
  /guid: [0-9a-f]{32}\n/.test(meta),
  'TOP ambient motion director Unity meta GUID is invalid',
);

console.log('TOP Living Night ambient motion director: PASS');
console.log('post-view long-period Perlin breathing/depth + shared sky air mass / sparse signed gust + layered sky/light/lantern/rare-eye variation + irregular smoke/ember shaping; Reduced Motion restores pose and suppresses sparse particles without texture/readiness/approval ownership');