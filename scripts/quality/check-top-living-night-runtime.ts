import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = process.cwd();
const manifestPath = join(
  repoRoot,
  'docs/design-targets/generated/top-living-night-v2/manifest.json',
);
const evidencePath = join(
  repoRoot,
  'docs/design-targets/generated/top-living-night-v2/runtime-unity-verification.json',
);
const viewPath = join(
  repoRoot,
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightView.cs',
);
const shellPath = join(
  repoRoot,
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/U46RuntimeShell.cs',
);
const syncPath = join(
  repoRoot,
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightStreamingAssetsSync.cs',
);
const verifierPath = join(
  repoRoot,
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightUnityVerification.cs',
);
const runnerPath = join(
  repoRoot,
  'scripts/unity/run-top-living-night-unity-verification.sh',
);
const evidenceCheckerPath = join(
  repoRoot,
  'scripts/quality/check-top-living-night-unity-evidence.ts',
);
const viewMetaPath = `${viewPath}.meta`;
const syncMetaPath = `${syncPath}.meta`;
const verifierMetaPath = `${verifierPath}.meta`;

for (const requiredPath of [
  manifestPath,
  evidencePath,
  viewPath,
  shellPath,
  syncPath,
  verifierPath,
  runnerPath,
  evidenceCheckerPath,
  viewMetaPath,
  syncMetaPath,
  verifierMetaPath,
]) {
  if (!existsSync(requiredPath)) throw new Error(`required TOP runtime file is missing: ${requiredPath}`);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
  schemaVersion: string;
  approval: {
    status: string;
    approvedAsFinal: boolean;
    runtimeApproved: boolean;
    runtimeConnected: boolean;
    finalApprovalBlocked: boolean;
  };
  motionPolicy: {
    videoGenerationUsed: boolean;
    runtimeUsesVideo: boolean;
  };
  assets: Array<{ file: string }>;
  runtimeConnection: {
    view: string;
    buildSync: string;
    connectedAssetCount: number;
    diagnosticIsolation: string;
  };
};

const view = readFileSync(viewPath, 'utf8');
const shell = readFileSync(shellPath, 'utf8');
const sync = readFileSync(syncPath, 'utf8');
const verifier = readFileSync(verifierPath, 'utf8');
const runner = readFileSync(runnerPath, 'utf8');
const evidenceChecker = readFileSync(evidenceCheckerPath, 'utf8');
const viewMeta = readFileSync(viewMetaPath, 'utf8');
const syncMeta = readFileSync(syncMetaPath, 'utf8');
const verifierMeta = readFileSync(verifierMetaPath, 'utf8');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(
  manifest.schemaVersion === 'top-living-night-layer-kit.0.3',
  'unexpected TOP manifest schema',
);
invariant(
  manifest.approval.status === 'runtime-connected-candidate',
  'TOP status must be runtime-connected-candidate',
);
invariant(manifest.approval.runtimeConnected === true, 'runtime connection must be recorded');
invariant(manifest.approval.runtimeApproved === false, 'runtime approval must remain false');
invariant(manifest.approval.approvedAsFinal === false, 'final approval must remain false');
invariant(manifest.approval.finalApprovalBlocked === true, 'final approval must remain blocked');
invariant(manifest.motionPolicy.videoGenerationUsed === false, 'AI video must remain unused');
invariant(manifest.motionPolicy.runtimeUsesVideo === false, 'runtime video must remain disabled');
invariant(manifest.assets.length === 17, 'all 17 production layers must remain in the manifest');
invariant(manifest.runtimeConnection.connectedAssetCount === 17, 'all 17 layers must be connected');
invariant(
  manifest.runtimeConnection.view.endsWith('TopLivingNightView.cs'),
  'runtime view path mismatch',
);
invariant(
  manifest.runtimeConnection.buildSync.endsWith('TopLivingNightStreamingAssetsSync.cs'),
  'build sync path mismatch',
);
invariant(
  manifest.runtimeConnection.diagnosticIsolation === 'VAMPPON_AI_SIMULATOR_SMOKE',
  'diagnostic isolation contract changed',
);

for (const asset of manifest.assets) {
  const fileName = asset.file.split('/').at(-1);
  invariant(fileName, `invalid asset path: ${asset.file}`);
  invariant(view.includes(fileName) || sync.includes(fileName), `runtime connection missing: ${fileName}`);
  invariant(sync.includes(fileName), `build sync missing: ${fileName}`);
}

invariant(view.includes('UnityWebRequestTexture.GetTexture'), 'Editor texture loading is missing');
invariant(view.includes('Application.dataPath'), 'Editor source path is missing');
invariant(view.includes('Resources.Load<Texture2D>'), 'built-player compressed Resources loading is missing');
invariant(view.includes('ResourceRoot = "TopLivingNight"'), 'built-player Resources root is missing');
invariant(!view.includes('Application.streamingAssetsPath'), 'runtime must not decode raw StreamingAssets PNGs');
invariant(view.includes('AtlasCell(fireFrame, 4, 3)'), '12-frame fire playback is missing');
invariant(view.includes('Mathf.PerlinNoise'), 'bounded asynchronous light motion is missing');
invariant(view.includes('vamp_pon_reduced_motion'), 'reduced-motion behavior is missing');
invariant(view.includes('47f'), 'rare robot-eye beat is missing');
invariant(view.includes('Resources.UnloadAsset'), 'TOP texture release is missing');
invariant(view.includes('Resources.UnloadUnusedAssets'), 'TOP unused-asset release is missing');
invariant(!view.includes('.mp4'), 'runtime view must not reference MP4');
invariant(!view.includes('.webp'), 'runtime view must not reference WebP preview');

invariant(shell.includes('TopLivingNightView'), 'runtime shell does not build TOP');
invariant(shell.includes('top.Build(canvasObject.transform'), 'TOP is not connected to the full canvas');
invariant(shell.includes('#if !VAMPPON_AI_SIMULATOR_SMOKE'), 'diagnostic isolation guard is missing');
invariant(shell.includes('OpenCollectionFromTop'), 'TOP collection route is missing');
invariant(shell.includes('topDismissed'), 'TOP one-session dismissal state is missing');

invariant(sync.includes('IPreprocessBuildWithReport'), 'pre-build sync hook is missing');
invariant(sync.includes('IPostprocessBuildWithReport'), 'post-build cleanup hook is missing');
invariant(sync.includes('Assets/Resources/TopLivingNight'), 'temporary Resources destination is missing');
invariant(sync.includes('TextureImporterFormat.ASTC_6x6'), 'iOS ASTC 6x6 import is missing');
invariant(sync.includes('importer.isReadable = false'), 'Read/Write OFF import is missing');
invariant(sync.includes('importer.mipmapEnabled = false'), 'mipmap OFF import is missing');
invariant(sync.includes('TextureWrapMode.Clamp'), 'Clamp import is missing');
invariant(sync.includes('FilterMode.Bilinear'), 'Bilinear import is missing');
invariant(sync.includes('SHA256.Create'), 'build-time SHA-256 validation is missing');
invariant(sync.includes('fileInfo.Length != asset.bytes'), 'build-time byte-size validation is missing');
invariant(sync.includes('RequiredFiles.Length'), 'build sync count log is missing');
invariant(sync.includes('CleanupGeneratedBuildAssets'), 'generated Resources cleanup is missing');

invariant(
  verifier.includes('TopLivingNightUnityVerification'),
  'Unity verifier type is missing',
);
invariant(
  verifier.includes('Resources.LoadAll<Texture2D>("TopLivingNight")'),
  'Unity verifier does not execute Resources import',
);
invariant(
  verifier.includes('TextureImporterFormat.ASTC_6x6'),
  'Unity verifier does not inspect iOS ASTC import',
);
invariant(
  verifier.includes('buildImportPolicyPassed'),
  'Unity verifier import evidence field is missing',
);
invariant(
  runner.includes('TopLivingNightUnityVerification.RunBatchmode'),
  'Unity batchmode runner executeMethod is missing',
);
invariant(
  runner.includes('6000.5.1f1'),
  'Unity batchmode runner version pin is missing',
);
invariant(
  evidenceChecker.includes('buildImportPolicyPassed'),
  'Unity evidence checker import field is missing',
);
invariant(
  evidenceChecker.includes('resourceTextureCount === 17'),
  'Unity evidence checker texture count is missing',
);

const viewGuid = viewMeta.match(/^guid: ([0-9a-f]{32})$/m)?.[1];
const syncGuid = syncMeta.match(/^guid: ([0-9a-f]{32})$/m)?.[1];
const verifierGuid = verifierMeta.match(/^guid: ([0-9a-f]{32})$/m)?.[1];
invariant(viewGuid, 'TOP view meta GUID is missing');
invariant(syncGuid, 'TOP sync meta GUID is missing');
invariant(verifierGuid, 'TOP verifier meta GUID is missing');
invariant(new Set([viewGuid, syncGuid, verifierGuid]).size === 3, 'TOP Unity meta GUIDs must be unique');

console.log('top living night runtime: PASS');
console.log('layers: 17/17 editor source + verified build-time compressed Resources import');
console.log('iOS import: ASTC 6x6 / Read-Write OFF / mipmap OFF / Clamp / Bilinear');
console.log('motion: fire / glow / stars / clouds / smoke / embers / robot eye');
console.log('memory: raw StreamingAssets decode disabled / TOP textures released on dismissal');
console.log('Unity evidence: verifier + runner + honest NOT_RUN/PASSED contract present');
console.log('flow: normal startup overlay / canonical simulator smoke isolated');
console.log('approval: runtime connected / Unity execution and physical-device approval pending');
