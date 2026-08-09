import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type LoadingAsset = {
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
  assets: LoadingAsset[];
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

const root = process.cwd();
const generatedRoot = join(root, 'docs/design-targets/generated/loading-seasonal-v1');
const manifest = JSON.parse(
  readFileSync(join(generatedRoot, 'manifest.json'), 'utf8'),
) as Manifest;
const evidence = JSON.parse(
  readFileSync(join(generatedRoot, 'runtime-unity-verification.json'), 'utf8'),
) as Evidence;

const view = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/LoadingSeasonalView.cs',
  ),
  'utf8',
);
const shell = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/U46RuntimeShell.cs',
  ),
  'utf8',
);
const sync = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingSeasonalBuildAssetSync.cs',
  ),
  'utf8',
);
const verifier = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingTopUnityVerification.cs',
  ),
  'utf8',
);
const capture = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingTopRuntimeCapture.cs',
  ),
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
invariant(manifest.runtimeConnected === true, 'loading runtime must be connected');
invariant(manifest.randomRotation === true, 'random rotation must be enabled');
invariant(manifest.consecutiveRepeatPrevented === true, 'consecutive repeat guard missing');
invariant(manifest.usesFallbackSources === false, 'seasonal binaries are committed; fallback boundary must be closed');
invariant(manifest.assets.length === 4, `expected four loading assets, got ${manifest.assets.length}`);
invariant(manifest.capture.forcedArtArgument === '-vampPonLoadingArt=0..3', 'capture CLI contract mismatch');
invariant(manifest.capture.editorCaptureHold === true, 'capture hold must be enabled');
invariant(
  JSON.stringify(manifest.capture.targetResolutions) === JSON.stringify(['360x800', '390x844', '430x932']),
  'capture resolution matrix mismatch',
);
invariant(manifest.capture.requiredFrames.length === 5, 'capture review pack must contain four loading frames plus TOP');
invariant(manifest.approval.runtimeFlowImplemented === true, 'runtime flow implementation flag missing');
invariant(manifest.approval.seasonalBinariesCommitted === true, 'seasonal binaries must be committed once artwork lands');
invariant(manifest.approval.runtimeCaptureComplete === false, 'runtime capture must remain incomplete');
invariant(manifest.approval.humanVisualReviewComplete === false, 'human visual review must remain incomplete');
invariant(manifest.approval.approvedAsFinal === false, 'final approval must remain false');
invariant(manifest.approval.runtimeApproved === false, 'runtime approval must remain false');
invariant(manifest.approval.finalApprovalBlocked === true, 'final approval block must remain true');

const expectedIds = ['spring', 'summer', 'autumn', 'winter'];
const ids = new Set<string>();
const resourceFiles = new Set<string>();
for (const [index, asset] of manifest.assets.entries()) {
  invariant(asset.id === expectedIds[index], `season slot ${index} mismatch`);
  invariant(!ids.has(asset.id), `duplicate loading id: ${asset.id}`);
  ids.add(asset.id);
  invariant(!resourceFiles.has(asset.resourceFile), `duplicate loading resource: ${asset.resourceFile}`);
  resourceFiles.add(asset.resourceFile);
  invariant(asset.sourceStatus === 'seasonal-source', `${asset.id}: seasonal source status missing`);
  invariant(asset.desiredSourceTitle.endsWith('.png'), `${asset.id}: desired source title missing`);

  const sourcePath = join(root, asset.sourcePath);
  const png = inspectPng(sourcePath);
  const sha = createHash('sha256').update(png.data).digest('hex');
  invariant(png.width === asset.width, `${asset.id}: width mismatch`);
  invariant(png.height === asset.height, `${asset.id}: height mismatch`);
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
]) {
  invariant(view.includes(token), `LoadingSeasonalView missing contract: ${token}`);
}

for (const token of [
  'LoadingSeasonalView loading',
  'loading.Build(canvasObject.transform, appFont, CompleteLoading)',
  'private void CompleteLoading()',
  'private void BuildTopIfNeeded()',
  'BuildTopIfNeeded();',
  'top.Build(appFlowCanvas.transform, appFont, DismissTop, OpenCollectionFromTop)',
  '#if !VAMPPON_AI_SIMULATOR_SMOKE',
]) {
  invariant(shell.includes(token), `U46RuntimeShell missing Loading -> TOP contract: ${token}`);
}
invariant(
  shell.indexOf('loading.Build(canvasObject.transform, appFont, CompleteLoading)') <
    shell.indexOf('private void BuildTopIfNeeded()'),
  'Loading must be wired before deferred TOP construction',
);
invariant(
  !shell.includes('top.Build(canvasObject.transform, font, DismissTop'),
  'TOP must no longer be created directly during BuildViews',
);

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
]) {
  invariant(sync.includes(token), `Loading build sync missing contract: ${token}`);
}

for (const token of [
  'LoadingTopUnityVerification',
  'VerifyRandomRotation',
  'Resources.LoadAll<Texture2D>("LoadingSeasonal")',
  'resourceTextureCount == 4',
  'BuildTopIfNeeded',
  'WriteEvidence',
]) {
  invariant(verifier.includes(token), `Loading Unity verifier missing contract: ${token}`);
}

for (const token of [
  'Force Spring + Hold',
  'Force Summer + Hold',
  'Force Autumn + Hold',
  'Force Winter + Hold',
  'Capture Current Game View',
  'ScreenCapture.CaptureScreenshot',
]) {
  invariant(capture.includes(token), `capture hook missing contract: ${token}`);
}

for (const phrase of [
  'Loading -> TOP',
  '360x800',
  '390x844',
  '430x932',
  'same slot is not shown',
  'five minutes',
  'Physical iPhone',
  'PR #78 remains Draft',
]) {
  invariant(checklist.includes(phrase), `review checklist missing: ${phrase}`);
}

if (evidence.executed) {
  invariant(evidence.result === 'PASSED', 'executed loading evidence must be PASSED');
  invariant(/^[0-9a-f]{40}$/.test(evidence.verifiedCommit), 'verified loading commit must be a SHA');
  invariant(/^6000\.5\./.test(evidence.unityVersion), 'loading evidence Unity version mismatch');
  invariant(evidence.assertionCount >= 70, 'loading evidence assertion count too low');
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
  invariant(evidence.verifiedCommit === '', 'unexecuted loading evidence commit must be empty');
  invariant(evidence.unityVersion === '', 'unexecuted loading evidence Unity version must be empty');
  invariant(evidence.assertionCount === 0, 'unexecuted loading assertions must be zero');
  invariant(evidence.failureCount === 0, 'unexecuted loading failures must be zero');
  invariant(evidence.sourceAssetCount === 4, 'unexecuted loading source count must remain four');
  invariant(evidence.resourceTextureCount === 0, 'unexecuted loading resource count must be zero');
  invariant(!evidence.loadingViewResolved, 'unexecuted loading view flag must remain false');
  invariant(!evidence.flowContractResolved, 'unexecuted loading flow flag must remain false');
  invariant(!evidence.randomRotationPassed, 'unexecuted random flag must remain false');
  invariant(!evidence.buildHookResolved, 'unexecuted build hook flag must remain false');
  invariant(!evidence.manifestProvenancePassed, 'unexecuted manifest flag must remain false');
  invariant(!evidence.buildImportPolicyPassed, 'unexecuted import flag must remain false');
  invariant(evidence.generatedAtUtc === '', 'unexecuted loading timestamp must be empty');
  invariant(evidence.error === '', 'unexecuted loading error must be empty');
}

console.log('loading -> TOP runtime: PASS');
console.log('flow: LoadingSeasonalView -> TopLivingNightView -> StageSelect/Collection');
console.log('rotation: four slots / random / consecutive repeat prevented');
console.log('capture: four forced loading frames + TOP / 360x800 / 390x844 / 430x932');
console.log('assets: runtime-connected fallback; approved seasonal binaries still required');
console.log(`Unity evidence: ${evidence.executed ? 'PASSED' : 'honest NOT_RUN boundary'}`);
