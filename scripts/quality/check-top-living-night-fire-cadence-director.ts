import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const directorPath = join(
  root,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightFireCadenceDirector.cs',
);
const metaPath = `${directorPath}.meta`;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(directorPath), 'TOP fire cadence director is missing');
invariant(existsSync(metaPath), 'TOP fire cadence director Unity meta is missing');

const director = readFileSync(directorPath, 'utf8');
const meta = readFileSync(metaPath, 'utf8');

for (const token of [
  '[DefaultExecutionOrder(920)]',
  '[RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]',
  'FindTransform(top.transform, "FireFlipbook")',
  'GetComponent<RawImage>()',
  'Mathf.PerlinNoise(21.31f, time * .317f)',
  'Mathf.Lerp(.30f, .46f, cadenceNoise)',
  'Mathf.Lerp(.076f, .142f, cadenceNoise)',
  'Mathf.PerlinNoise(29.47f, stepCount * .131f)',
  'Mathf.PerlinNoise(37.19f, stepCount * .173f)',
  'if (reverseNoise > .84f)',
  'direction *= -1;',
  'frameIndex += direction;',
  'frameIndex = LastFrame;',
  'frameIndex = 0;',
  'fire.uvRect = AtlasCell(frameIndex);',
  'PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1',
  'PlayerPrefs.GetInt("reduce_motion", 0) == 1',
  'retaining adjacent frames and coherent flame silhouettes',
  'without taking texture/resource ownership',
]) {
  invariant(director.includes(token), `TOP fire cadence contract missing: ${token}`);
}

for (const forbidden of [
  'Resources.Load',
  'Resources.UnloadAsset',
  'UnityWebRequest',
  'DownloadHandlerTexture',
  'new Texture2D',
  'Destroy(fire.texture',
  'approvedAsFinal',
  'runtimeApproved',
  'IsCompositeReady =',
  'IsCurrentTopReady =',
  '.mp4',
  '.webp',
]) {
  invariant(!director.includes(forbidden), `TOP fire cadence director crossed forbidden ownership: ${forbidden}`);
}

invariant(
  director.indexOf('if (time >= nextFrameAt)') < director.indexOf('fire.uvRect = AtlasCell(frameIndex);'),
  'TOP fire cadence must advance before writing the post-view uvRect',
);
invariant(
  director.indexOf('if (!reducedMotion && frameIndex >= 2 && frameIndex <= 9)') < director.indexOf('frameIndex += direction;'),
  'TOP fire cadence must resolve optional interior reversal before adjacent frame step',
);
invariant(
  !director.includes('frameIndex = UnityEngine.Random') && !director.includes('Random.Range'),
  'TOP fire cadence must not jump to arbitrary random atlas frames',
);
invariant(/guid: [0-9a-f]{32}\n/.test(meta), 'TOP fire cadence Unity meta GUID is invalid');

console.log('TOP Living Night fire cadence director: PASS');
console.log('adjacent-frame Perlin cadence + holds + rare interior reversals; Reduced Motion slower; texture/readiness/approval ownership untouched');
