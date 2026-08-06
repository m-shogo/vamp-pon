import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Asset = {
  id: string;
  desiredSourceTitle: string;
  sourceStatus: string;
  sourcePath: string;
  resourceFile: string;
  width: number;
  height: number;
  sha256: string;
};

type Manifest = {
  schemaVersion: string;
  flow: string;
  assetStatus: string;
  runtimeConnected: boolean;
  randomRotation: boolean;
  consecutiveRepeatPrevented: boolean;
  usesFallbackSources: boolean;
  assets: Asset[];
  capture: {
    forcedArtArgument: string;
    editorCaptureHold: boolean;
    targetResolutions: string[];
    requiredFrames: string[];
  };
  approval: {
    runtimeFlowImplemented: boolean;
    seasonalBinariesCommitted: boolean;
    runtimeCaptureComplete: boolean;
    humanVisualReviewComplete: boolean;
    approvedAsFinal: boolean;
    runtimeApproved: boolean;
    finalApprovalBlocked: boolean;
  };
};

type Evidence = {
  schemaVersion?: number;
  executed: boolean;
  result: string;
  verifiedCommit: string;
  unityVersion: string;
  assertionCount: number;
  failureCount: number;
  sourceAssetCount: number;
  resourceTextureCount: number;
  loadingViewResolved: boolean;
  flowContractResolved: boolean;
  randomRotationPassed: boolean;
  buildHookResolved: boolean;
  manifestProvenancePassed: boolean;
  buildImportPolicyPassed: boolean;
  generatedAtUtc: string;
  error: string;
};

type CaptureManifest = {
  executed: boolean;
  result: string;
  expectedCaptureCount: number;
  captureCount: number;
  captures: unknown[];
};

const root = process.cwd();
const generatedRoot = join(root, 'docs/design-targets/generated/loading-seasonal-v1');
const manifest = JSON.parse(readFileSync(join(generatedRoot, 'manifest.json'), 'utf8')) as Manifest;
const evidence = JSON.parse(
  readFileSync(join(generatedRoot, 'runtime-unity-verification.json'), 'utf8'),
) as Evidence;
const captureManifest = JSON.parse(
  readFileSync(join(generatedRoot, 'runtime-capture-manifest.json'), 'utf8'),
) as CaptureManifest;

const view = readFileSync(
  join(root, 'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/LoadingSeasonalView.cs'),
  'utf8',
);
const shell = readFileSync(
  join(root, 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/U46RuntimeShell.cs'),
  'utf8',
);
const sync = readFileSync(
  join(root, 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingSeasonalBuildAssetSync.cs'),
  'utf8',
);
const verifier = readFileSync(
  join(root, 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingTopUnityVerificationV2.cs'),
  'utf8',
);
const runner = readFileSync(
  join(root, 'scripts/unity/run-loading-top-unity-verification.sh'),
  'utf8',
);
const capture = readFileSync(
  join(root, 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingTopRuntimeCapture.cs'),
  'utf8',
);
const checklist = readFileSync(join(generatedRoot, 'runtime-review-checklist.md'), 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function inspectPng(path: string) {
  const data = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(data.subarray(0, 8).equals(signature), `${path}: invalid PNG signature`);
  invariant(data.subarray(12, 16).toString('ascii') === 'IHDR', `${path}: missing IHDR`);
  return {
    data,
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

invariant(manifest.schemaVersion === 'loading-seasonal.0.1', 'unexpected loading schema');
invariant(manifest.flow === 'Loading -> TOP -> StageSelect/Collection', 'startup flow mismatch');
invariant(manifest.assetStatus === 'runtime-connected-seasonal-binaries', 'final seasonal asset status missing');
invariant(manifest.runtimeConnected, 'loading runtime must be connected');
invariant(manifest.randomRotation, 'random rotation must be enabled');
invariant(manifest.consecutiveRepeatPrevented, 'consecutive repeat guard missing');
invariant(manifest.usesFallbackSources === false, 'fallback sources must be disabled');
invariant(manifest.assets.length === 4, 'exactly four loading assets are required');
invariant(manifest.approval.runtimeFlowImplemented, 'runtime flow implementation flag missing');
invariant(manifest.approval.seasonalBinariesCommitted, 'seasonal binaries committed flag missing');
invariant(manifest.approval.runtimeCaptureComplete, 'corrected runtime capture pack must be complete');
invariant(captureManifest.executed, 'capture manifest must be executed');
invariant(captureManifest.result === 'PASSED', 'capture manifest must be PASSED');
invariant(captureManifest.expectedCaptureCount === 15, 'capture manifest expected count mismatch');
invariant(captureManifest.captureCount === 15, 'capture manifest count mismatch');
invariant(captureManifest.captures.length === 15, 'capture manifest records mismatch');
invariant(!manifest.approval.humanVisualReviewComplete, 'human review must remain incomplete');
invariant(!manifest.approval.approvedAsFinal, 'final approval must remain false');
invariant(!manifest.approval.runtimeApproved, 'runtime approval must remain false');
invariant(manifest.approval.finalApprovalBlocked, 'final approval block must remain true');
invariant(manifest.capture.forcedArtArgument === '-vampPonLoadingArt=0..3', 'capture CLI contract mismatch');
invariant(
  JSON.stringify(manifest.capture.targetResolutions) === JSON.stringify(['360x800', '390x844', '430x932']),
  'capture resolution matrix mismatch',
);
invariant(manifest.capture.requiredFrames.length === 5, 'four Loading frames plus TOP are required');

const expectedIds = ['spring', 'summer', 'autumn', 'winter'];
const expectedFiles = [
  'loading-01-spring.png',
  'loading-02-summer.png',
  'loading-03-autumn.png',
  'loading-04-winter.png',
];

for (const [index, asset] of manifest.assets.entries()) {
  invariant(asset.id === expectedIds[index], `season slot ${index} mismatch`);
  invariant(asset.resourceFile === expectedFiles[index], `${asset.id}: canonical resource filename mismatch`);
  invariant(asset.sourceStatus === 'seasonal-source', `${asset.id}: final source status missing`);
  invariant(
    asset.sourcePath === `docs/design-targets/generated/loading-seasonal-v1/sources/${expectedFiles[index]}`,
    `${asset.id}: final source path mismatch`,
  );
  invariant(asset.desiredSourceTitle.endsWith('.png'), `${asset.id}: desired source title missing`);

  const png = inspectPng(join(root, asset.sourcePath));
  const sha = createHash('sha256').update(png.data).digest('hex');
  invariant(png.width === asset.width, `${asset.id}: width mismatch`);
  invariant(png.height === asset.height, `${asset.id}: height mismatch`);
  invariant(png.height > png.width, `${asset.id}: portrait source required`);
  invariant(sha === asset.sha256, `${asset.id}: SHA-256 mismatch`);
}

for (const token of [
  'SelectNonRepeatingIndex',
  'LastArtIndexKey',
  'UnityEngine.Random.Range',
  'PlayerPrefs.SetInt(LastArtIndexKey',
  'MinimumVisibleSeconds = 1.35f',
  'AspectRatioFitter.AspectMode.EnvelopeParent',
  'Resources.Load<Texture2D>(spec.ResourcePath)',
  '-vampPonLoadingArt=',
  'CaptureHoldKey',
  'ReleaseTexture',
]) invariant(view.includes(token), `LoadingSeasonalView missing contract: ${token}`);

for (const token of [
  'LoadingSeasonalView loading',
  'loading.Build(canvasObject.transform, appFont, CompleteLoading)',
  'private void CompleteLoading()',
  'private void BuildTopIfNeeded()',
  'top.Build(appFlowCanvas.transform, appFont, DismissTop, OpenCollectionFromTop)',
  '#if !VAMPPON_AI_SIMULATOR_SMOKE',
]) invariant(shell.includes(token), `U46RuntimeShell missing Loading -> TOP contract: ${token}`);

for (const token of [
  'Assets/Resources/LoadingSeasonal',
  'TextureImporterFormat.ASTC_6x6',
  'importer.isReadable = false',
  'importer.mipmapEnabled = false',
  'TextureWrapMode.Clamp',
  'FilterMode.Bilinear',
  'ComputeSha256',
  'ReadPngDimensions',
  'CleanupGeneratedBuildAssets',
]) invariant(sync.includes(token), `Loading build sync missing contract: ${token}`);

for (const token of [
  'LoadingTopUnityVerificationV2',
  'AssetDatabase.LoadAssetAtPath<Texture2D>',
  'Resources.Load<Texture2D>(resourceName)',
  'four manifest-declared Resources textures resolve',
  'usesFallbackSources',
  'seasonalBinariesCommitted',
  'WriteEvidence',
]) invariant(verifier.includes(token), `Loading Unity verifier V2 missing contract: ${token}`);

invariant(
  runner.includes('LoadingTopUnityVerificationV2.RunBatchmode'),
  'runner must execute stable Loading verifier V2',
);
invariant(
  runner.includes('check-loading-top-runtime-v2.ts'),
  'runner must execute final seasonal checker V2',
);

for (const token of [
  'Force Spring + Hold',
  'Force Summer + Hold',
  'Force Autumn + Hold',
  'Force Winter + Hold',
  'Capture Current Game View',
  'ScreenCapture.CaptureScreenshot',
]) invariant(capture.includes(token), `capture hook missing contract: ${token}`);

for (const phrase of [
  'Loading -> TOP',
  '360x800',
  '390x844',
  '430x932',
  'same slot does not appear',
  'five minutes',
  'Physical iPhone',
  'PR remains Draft',
]) invariant(checklist.includes(phrase), `review checklist missing: ${phrase}`);

if (evidence.executed) {
  invariant(evidence.result === 'PASSED', 'executed loading evidence must be PASSED');
  invariant(/^[0-9a-f]{40}$/.test(evidence.verifiedCommit), 'verified loading commit must be a SHA');
  invariant(/^6000\.5\./.test(evidence.unityVersion), 'loading evidence Unity version mismatch');
  invariant(evidence.assertionCount >= 80, 'loading evidence assertion count too low');
  invariant(evidence.failureCount === 0, 'loading evidence failure count must be zero');
  invariant(evidence.sourceAssetCount === 4, 'loading evidence source count mismatch');
  invariant(evidence.resourceTextureCount === 4, 'loading evidence resource count mismatch');
  invariant(evidence.loadingViewResolved, 'loading view evidence missing');
  invariant(evidence.flowContractResolved, 'loading flow evidence missing');
  invariant(evidence.randomRotationPassed, 'random rotation evidence missing');
  invariant(evidence.buildHookResolved, 'loading build hook evidence missing');
  invariant(evidence.manifestProvenancePassed, 'loading manifest evidence missing');
  invariant(evidence.buildImportPolicyPassed, 'loading import policy evidence missing');
  invariant(evidence.generatedAtUtc.length > 0, 'loading evidence timestamp missing');
  invariant(evidence.error === '', 'passed loading evidence must not contain an error');
} else {
  invariant(evidence.result === 'NOT_RUN', 'unexecuted loading evidence must be NOT_RUN');
  invariant(evidence.sourceAssetCount === 4, 'unexecuted loading source count must remain four');
  invariant(evidence.resourceTextureCount === 0, 'unexecuted loading resource count must be zero');
}

console.log('loading -> TOP runtime V2: PASS');
console.log('flow: final four seasonal Loading images -> TOP -> StageSelect/Collection');
console.log('rotation: random / consecutive repeat prevented');
console.log('capture: corrected 15-frame pack PASSED; human review still pending');
console.log('import verifier: direct AssetDatabase paths + direct Resources paths');
console.log(`Unity evidence: ${evidence.executed ? 'PASSED' : 'honest NOT_RUN boundary'}`);
