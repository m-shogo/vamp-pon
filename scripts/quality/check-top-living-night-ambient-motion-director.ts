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
  'cloudsFar.anchoredPosition = farBasePosition',
  'cloudsNear.anchoredPosition = nearBasePosition',
  'titleRoot.anchoredPosition = titleBasePosition',
  'artRoot.localScale = artBaseScale',
  'five-minute review window',
]) {
  invariant(director.includes(token), `TOP ambient motion director contract missing: ${token}`);
}

for (const forbidden of [
  'Mathf.Sin(',
  'Resources.Load',
  'UnityWebRequest',
  'Texture2D',
  'RawImage',
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
  /guid: [0-9a-f]{32}\n/.test(meta),
  'TOP ambient motion director Unity meta GUID is invalid',
);

console.log('TOP Living Night ambient motion director: PASS');
console.log('post-view Perlin breathing + cloud drift + title micro-motion; Reduced Motion restores exact base pose; no texture/readiness/approval ownership');
