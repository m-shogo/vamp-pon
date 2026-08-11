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
  'Mathf.PerlinNoise(24.73f, time * .097f)',
  'var cadenceNoise = bodyHeat * .68f + coalHeat * .32f',
  'heatBurstStepsRemaining',
  'Mathf.PerlinNoise(28.17f, time * .041f)',
  'Mathf.PerlinNoise(33.59f, stepCount * .113f)',
  'heatBurstStepsRemaining = burstTrigger > .972f ? 3 : 2;',
  'var edgeHold = frameIndex <= 1 || frameIndex >= LastFrame - 1',
  'Mathf.Lerp(.31f, .48f, cadenceNoise) * edgeHold',
  'Mathf.Lerp(.055f, .082f, cadenceNoise)',
  'Mathf.Lerp(.082f, .151f, cadenceNoise) * edgeHold',
  'Mathf.PerlinNoise(39.47f, stepCount * .131f)',
  'var holdThreshold = reducedMotion',
  'Mathf.PerlinNoise(47.19f, stepCount * .173f)',
  'var reverseThreshold = Mathf.Lerp(.89f, .83f, 1f - coalHeat)',
  'if (reverseNoise > reverseThreshold)',
  'direction *= -1;',
  'frameIndex += direction;',
  'frameIndex = LastFrame;',
  'frameIndex = 0;',
  'fire.uvRect = AtlasCell(frameIndex);',
  'PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1',
  'PlayerPrefs.GetInt("reduce_motion", 0) == 1',
  'if (reducedMotion)\n                heatBurstStepsRemaining = 0;',
  'Adjacent frames are never skipped',
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
  'Random.Range',
  'frameIndex += direction *',
]) {
  invariant(!director.includes(forbidden), `TOP fire cadence director crossed forbidden ownership/cadence boundary: ${forbidden}`);
}

invariant(
  director.indexOf('if (time >= nextFrameAt)') < director.indexOf('fire.uvRect = AtlasCell(frameIndex);'),
  'TOP fire cadence must advance before writing the post-view uvRect',
);
invariant(
  director.indexOf('if (!reducedMotion && heatBurstStepsRemaining <= 0 && frameIndex >= 2 && frameIndex <= 9)') <
    director.indexOf('frameIndex += direction;'),
  'TOP fire cadence must resolve optional interior reversal before adjacent frame step',
);
invariant(
  director.indexOf('if (reducedMotion)') < director.indexOf('heatBurstStepsRemaining = 0;', director.indexOf('private void RefreshReducedMotion()')),
  'TOP Reduced Motion must cancel active fire heat bursts',
);
invariant(
  !director.includes('frameIndex = UnityEngine.Random') && !director.includes('Random.Range'),
  'TOP fire cadence must not jump to arbitrary random atlas frames',
);
invariant(/guid: [0-9a-f]{32}\n/.test(meta), 'TOP fire cadence Unity meta GUID is invalid');

console.log('TOP Living Night fire cadence director: PASS');
console.log('adjacent-frame Perlin body/coal cadence + irregular holds + sparse heat bursts + rare interior reversals; Reduced Motion slows cadence and cancels bursts; texture/readiness/approval ownership untouched');