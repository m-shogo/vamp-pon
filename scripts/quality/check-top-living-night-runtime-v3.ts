import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
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
const unityVerifier = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightCompositeV3UnityVerification.cs',
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
const finalArtStatus = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'),
    'utf8',
  ),
) as {
  schemaVersion: number;
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
};

const bridgeRelativePath =
  'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const bridgeExpectedSha256 =
  'aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d';
const finalStatusRelativePath =
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const finalRelativePath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function validate430x932Png(path: string, expectedSha256: string, label: string): void {
  invariant(existsSync(path), `${label} PNG is missing`);
  const png = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(png.subarray(0, 8).equals(signature), `${label} PNG signature mismatch`);
  invariant(png.subarray(12, 16).toString('ascii') === 'IHDR', `${label} IHDR missing`);
  invariant(png.readUInt32BE(16) === 430, `${label} width must be 430`);
  invariant(png.readUInt32BE(20) === 932, `${label} height must be 932`);
  invariant(/^[0-9a-f]{64}$/.test(expectedSha256), `${label} expected SHA-256 is invalid`);
  invariant(
    createHash('sha256').update(png).digest('hex') === expectedSha256,
    `${label} SHA-256 mismatch`,
  );
}

invariant(finalArtStatus.schemaVersion === 1, 'TOP V3 final-art authority schema mismatch');
invariant(finalArtStatus.candidatePath === finalRelativePath, 'TOP V3 final candidate path is not canonical');

const bridgePath = join(root, bridgeRelativePath);
validate430x932Png(bridgePath, bridgeExpectedSha256, 'TOP V3 bridge composite');

const finalPath = join(root, finalRelativePath);
if (!finalArtStatus.candidateGenerated) {
  invariant(!existsSync(finalPath), 'TOP V3 final PNG exists while candidateGenerated=false');
  invariant(finalArtStatus.candidateSha256 === '', 'ungenerated TOP V3 final candidate must not retain SHA-256');
} else {
  invariant(/^[0-9a-f]{64}$/.test(finalArtStatus.candidateSha256), 'generated TOP V3 final candidate SHA-256 is invalid');
  validate430x932Png(finalPath, finalArtStatus.candidateSha256, 'TOP V3 final Core5 composite');
}

for (const token of [
  'TopLivingNightCompositeV3Controller',
  '[DefaultExecutionOrder(-950)]',
  'EditorBridgeCompositeRelativePath',
  'EditorBridgeExpectedSha256',
  'EditorFinalStatusRelativePath',
  'EditorFinalCompositeRelativePath',
  bridgeRelativePath,
  finalStatusRelativePath,
  finalRelativePath,
  'ResolveEditorCompositePath',
  'status.schemaVersion != 1',
  'status.candidatePath',
  'candidateGenerated',
  'candidateSha256',
  'final Core5 PNG exists while candidateGenerated=false',
  'editor will not silently fall back to the bridge',
  'ComputeSha256(path)',
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
  'transparent stars/clouds, fire, smoke, embers and additive light masks remain live',
]) {
  invariant(controller.includes(token), `TOP Runtime V3 controller contract missing: ${token}`);
}

for (const lifecycleToken of [
  'GetOrCreateBaseComposite',
  'SetStaticLayerVisibility(true)',
  'ResetAdditiveMasks()',
  'baseComposite.gameObject.SetActive(false)',
  'image.material = null',
  'Resources.UnloadAsset(resource)',
]) {
  invariant(
    controller.includes(lifecycleToken),
    `TOP Runtime V3 lifecycle guard missing: ${lifecycleToken}`,
  );
}

const resetStart = controller.indexOf('private void ResetAdditiveMasks()');
const detachStart = controller.indexOf('private void Detach()', resetStart);
invariant(resetStart >= 0 && detachStart > resetStart, 'TOP V3 additive reset method boundary is missing');
const resetBlock = controller.slice(resetStart, detachStart);
invariant(
  resetBlock.includes('image.material = null;'),
  'TOP V3 detach must remove additive material references before destroying the material',
);
invariant(
  resetBlock.includes('image.gameObject.SetActive(false);'),
  'TOP V3 detach must hide opaque-black additive source masks',
);
invariant(
  !resetBlock.includes('image.gameObject.SetActive(true);'),
  'TOP V3 detach must not reactivate masks without the additive material',
);

const staticStart = controller.indexOf('private static readonly string[] StaticLayersReplacedByComposite');
const masksStart = controller.indexOf('private static readonly MaskStyle[] AdditiveMasks', staticStart);
invariant(staticStart >= 0 && masksStart > staticStart, 'TOP V3 static replacement array boundary is missing');
const staticBlock = controller.slice(staticStart, masksStart);

for (const hiddenLayer of [
  'Environment',
  'Moon',
  'DistantCompanion',
  'Characters',
  'FireBase',
  'AnimalRobot',
  'Foreground',
]) {
  invariant(staticBlock.includes(`"${hiddenLayer}"`), `TOP V3 static replacement missing: ${hiddenLayer}`);
}

for (const liveSkyLayer of ['Stars', 'CloudsFar', 'CloudsNear']) {
  invariant(
    !staticBlock.includes(`"${liveSkyLayer}"`),
    `TOP V3 must keep transparent sky overlay live: ${liveSkyLayer}`,
  );
}

for (const token of [
  'TopLivingNightCompositeV3BuildAssetSync',
  'IPreprocessBuildWithReport',
  'IPostprocessBuildWithReport',
  'BridgeSourceRelativePath',
  'BridgeExpectedSha256',
  'FinalStatusRelativePath',
  'FinalSourceRelativePath',
  bridgeRelativePath,
  finalStatusRelativePath,
  finalRelativePath,
  'ResolveCompositeSource()',
  'status.schemaVersion != 1',
  'status.candidatePath',
  'candidateGenerated',
  'candidateSha256',
  'final Core5 PNG exists while candidateGenerated=false',
  'Update the final-art manifest explicitly instead of silently building the bridge',
  'IsLowerHexSha256',
  '"bridge"',
  '"final-core5"',
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
  'CleanupGeneratedBuildAssets(refresh: false)',
  'catch',
  'CleanupGeneratedBuildAssets();',
]) {
  invariant(buildSync.includes(token), `TOP Runtime V3 build contract missing: ${token}`);
}

const selectorStart = buildSync.indexOf('internal static CompositeSourceSelection ResolveCompositeSource()');
const importerStart = buildSync.indexOf('private static void ConfigureTextureImporter()', selectorStart);
invariant(selectorStart >= 0 && importerStart > selectorStart, 'TOP Runtime V3 source selector boundary is missing');
const selectorBlock = buildSync.slice(selectorStart, importerStart);
invariant(selectorBlock.includes('status.schemaVersion != 1'), 'TOP V3 selector must reject unknown final-art schema');
invariant(selectorBlock.includes('status.candidatePath'), 'TOP V3 selector must require canonical candidate path before bridge/final choice');
invariant(selectorBlock.includes('if (!status.candidateGenerated)'), 'TOP V3 selector must gate final source on candidateGenerated');
invariant(selectorBlock.includes('File.Exists(finalSourcePath)'), 'TOP V3 selector must explicitly inspect final source existence');
invariant(selectorBlock.includes('ComputeSha256(finalSourcePath)'), 'TOP V3 selector must verify final candidate bytes');
invariant(selectorBlock.includes('status.candidateSha256'), 'TOP V3 selector must use final-art manifest SHA-256');

for (const token of [
  'TopLivingNightCompositeV3BuildAssetSync.ResolveCompositeSource()',
  'selection.Kind == "bridge" || selection.Kind == "final-core5"',
  'selection.ExpectedSha256',
  'sourceCompositeKind',
  'sourceCompositePath',
  'sourceCompositeSha256',
  'staged source kind matches verified source',
  'staged source path matches verified source',
  'staged source SHA matches verified source',
]) {
  invariant(unityVerifier.includes(token), `TOP Runtime V3 Unity verifier provenance guard missing: ${token}`);
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
console.log(
  `base authority: ${finalArtStatus.candidateGenerated ? 'final-core5 candidate selected by manifest SHA' : 'verified bridge selected while final candidate is NOT_RUN'}`,
);
console.log('editor/build/verifier: all three source paths are bound to the same schema-checked final-art authority boundary');
console.log('sky: transparent Stars / CloudsFar / CloudsNear stay live over the V3 base composite');
console.log('motion: sky + fire/smoke/embers retained; light masks use luminance-additive UI shader');
console.log('lifecycle: composite reuse + dark-safe mask detach + fallback/resource cleanup guarded');
console.log('build: generated Resources texture/material + failure cleanup + ASTC 6x6 guarded');
console.log('approval: runtime implementation only; recapture and human/device review remain required');
