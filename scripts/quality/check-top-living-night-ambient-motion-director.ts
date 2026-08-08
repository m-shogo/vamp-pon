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
  'ApplyNormalMotionVisuals(time)',
  'ApplyReducedMotionVisuals(time)',
  'Mathf.PerlinNoise(.31f, time * .031f)',
  'Mathf.PerlinNoise(1.73f, time * .027f)',
  'Mathf.PerlinNoise(4.91f, time * .019f)',
  'Mathf.PerlinNoise(7.33f, time * .047f)',
  'Mathf.PerlinNoise(11.17f, time * .023f)',
  'Mathf.PerlinNoise(13.61f, time * .017f)',
  'Mathf.PerlinNoise(17.29f, time * .037f)',
  'Mathf.PerlinNoise(19.87f, time * .029f)',
  'artBaseScale * (1f + scaleNoise * .0018f)',
  'PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1',
  'PlayerPrefs.GetInt("reduce_motion", 0) == 1',
  'if (reducedMotion)',
  'RestorePose();',
  'RefreshVisualBindings();',
  'top.GetComponentsInChildren<RawImage>(true)',
  'string.Equals(image.name, "Stars", StringComparison.Ordinal)',
  'string.Equals(image.name, "FireGlow", StringComparison.Ordinal)',
  'string.Equals(image.name, "RobotEye", StringComparison.Ordinal)',
  'image.name.StartsWith("Smoke_", StringComparison.Ordinal)',
  'image.name.StartsWith("Ember_", StringComparison.Ordinal)',
  'smoke.Sort(CompareByName)',
  'embers.Sort(CompareByName)',
  'stars.color = WithAlpha(stars.color, .57f + noise * .16f)',
  'stars.color = WithAlpha(stars.color, .62f)',
  '.56f + ((first * .62f + second * .38f) - .5f) * .10f',
  '.56f + ((first * .62f + second * .38f) - .5f) * .02f',
  'robotEye.color = WithAlpha(robotEye.color, .20f + rare * .62f)',
  'robotEye.color = WithAlpha(robotEye.color, 0f)',
  'Mathf.Sin(cycle * Mathf.PI) * .19f',
  'Mathf.Sin(cycle * Mathf.PI) * .78f',
  'cloudsFar.anchoredPosition = farBasePosition',
  'cloudsNear.anchoredPosition = nearBasePosition',
  'titleRoot.anchoredPosition = titleBasePosition',
  'artRoot.localScale = artBaseScale',
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
  'TOP normal mode must establish post-view geometry before alpha normalization',
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
console.log('post-view Perlin geometry + bidirectional live Reduced Motion alpha normalization; robot-eye/smoke/embers are suppressible and recoverable without texture/readiness/approval ownership');
