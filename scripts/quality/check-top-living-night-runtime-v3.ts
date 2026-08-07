import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const controller = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightCompositeV3Controller.cs',
  ),
  'utf8',
);
const buildSync = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightCompositeV3BuildAssetSync.cs',
  ),
  'utf8',
);
const shader = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/UI/TopLivingNightLuminanceAdditive.shader',
  ),
  'utf8',
);
const compositePath = join(
  root,
  'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png',
);
const composite = readFileSync(compositePath);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
invariant(composite.subarray(0, 8).equals(signature), 'TOP V3 composite PNG signature mismatch');
invariant(composite.subarray(12, 16).toString('ascii') === 'IHDR', 'TOP V3 composite IHDR missing');
invariant(composite.readUInt32BE(16) === 430, 'TOP V3 composite width must be 430');
invariant(composite.readUInt32BE(20) === 932, 'TOP V3 composite height must be 932');
invariant(
  createHash('sha256').update(composite).digest('hex') ===
    'aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d',
  'TOP V3 composite SHA-256 mismatch',
);

for (const token of [
  'TopLivingNightCompositeV3Controller',
  '[DefaultExecutionOrder(-950)]',
  'top-living-night-layered-candidate-430x932.png',
  'TopLivingNightV3Generated/base-composite-v3',
  'TopLivingNightV3Generated/LuminanceAdditive',
  'BaseComposite',
  'AspectRatioFitter.AspectMode.EnvelopeParent',
  'StaticLayersReplacedByComposite',
  'SetStaticLayerVisibility(false)',
  'DistantLights',
  'RobotEye',
  'FireGlow',
  'LanternGlow',
  'image.material = additiveMaterial',
  'IsCompositeReady = true',
  'dynamic fire, smoke, embers and additive light masks remain live',
]) {
  invariant(controller.includes(token), `TOP Runtime V3 controller contract missing: ${token}`);
}

for (const lifecycleToken of [
  'GetOrCreateBaseComposite',
  'SetStaticLayerVisibility(true)',
  'ResetAdditiveMasks()',
  'baseComposite.gameObject.SetActive(false)',
  'image.material = null',
]) {
  invariant(
    controller.includes(lifecycleToken),
    `TOP Runtime V3 lifecycle guard missing: ${lifecycleToken}`,
  );
}

for (const hiddenLayer of [
  'Environment',
  'Stars',
  'Moon',
  'CloudsFar',
  'CloudsNear',
  'DistantCompanion',
  'Characters',
  'FireBase',
  'AnimalRobot',
  'Foreground',
]) {
  invariant(controller.includes(`"${hiddenLayer}"`), `TOP V3 static replacement missing: ${hiddenLayer}`);
}

for (const token of [
  'TopLivingNightCompositeV3BuildAssetSync',
  'IPreprocessBuildWithReport',
  'IPostprocessBuildWithReport',
  'ExpectedSha256',
  '430 || dimensions.y != 932',
  'Assets/Resources/TopLivingNightV3Generated',
  'base-composite-v3.png',
  'LuminanceAdditive.mat',
  'Shader.Find(ShaderName)',
  'TextureImporterFormat.ASTC_6x6',
  'importer.isReadable = false',
  'importer.mipmapEnabled = false',
  'TextureWrapMode.Clamp',
  'FilterMode.Bilinear',
  'CleanupGeneratedBuildAssets',
]) {
  invariant(buildSync.includes(token), `TOP Runtime V3 build contract missing: ${token}`);
}

for (const token of [
  'Shader "VampPon/UI/LuminanceAdditiveMask"',
  'Blend SrcAlpha One',
  'dot(source.rgb, fixed3(0.2126, 0.7152, 0.0722))',
  'UNITY_UI_CLIP_RECT',
  'UnityGet2DClipping',
  'ZWrite Off',
]) {
  invariant(shader.includes(token), `TOP Runtime V3 shader contract missing: ${token}`);
}

console.log('TOP Living Night Runtime V3: PASS');
console.log('base: validated 430x932 composite preview with fixed SHA-256');
console.log('motion: fire/smoke/embers retained; light masks use luminance-additive UI shader');
console.log('lifecycle: composite reuse + fallback restore + additive material cleanup guarded');
console.log('build: generated Resources texture/material, ASTC 6x6, cleanup guarded');
console.log('approval: runtime implementation only; recapture and human/device review remain required');
