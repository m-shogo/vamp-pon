import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = process.cwd();
const manifestPath = join(
  repoRoot,
  'docs/design-targets/generated/top-living-night-v2/manifest.json',
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
const viewMetaPath = `${viewPath}.meta`;
const syncMetaPath = `${syncPath}.meta`;

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
const viewMeta = readFileSync(viewMetaPath, 'utf8');
const syncMeta = readFileSync(syncMetaPath, 'utf8');

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

invariant(view.includes('UnityWebRequestTexture.GetTexture'), 'runtime texture loading is missing');
invariant(view.includes('Application.streamingAssetsPath'), 'built-player asset path is missing');
invariant(view.includes('Application.dataPath'), 'Editor source path is missing');
invariant(view.includes('AtlasCell(fireFrame, 4, 3)'), '12-frame fire playback is missing');
invariant(view.includes('Mathf.PerlinNoise'), 'bounded asynchronous light motion is missing');
invariant(view.includes('vamp_pon_reduced_motion'), 'reduced-motion behavior is missing');
invariant(view.includes('47f'), 'rare robot-eye beat is missing');
invariant(!view.includes('.mp4'), 'runtime view must not reference MP4');
invariant(!view.includes('.webp'), 'runtime view must not reference WebP preview');

invariant(shell.includes('TopLivingNightView'), 'runtime shell does not build TOP');
invariant(shell.includes('top.Build(canvasObject.transform'), 'TOP is not connected to the full canvas');
invariant(shell.includes('#if !VAMPPON_AI_SIMULATOR_SMOKE'), 'diagnostic isolation guard is missing');
invariant(shell.includes('OpenCollectionFromTop'), 'TOP collection route is missing');
invariant(shell.includes('topDismissed'), 'TOP one-session dismissal state is missing');

invariant(sync.includes('IPreprocessBuildWithReport'), 'pre-build sync hook is missing');
invariant(sync.includes('IPostprocessBuildWithReport'), 'post-build cleanup hook is missing');
invariant(sync.includes('RequiredFiles.Length'), 'build sync count log is missing');
invariant(sync.includes('CleanupGeneratedStreamingAssets'), 'generated asset cleanup is missing');

const viewGuid = viewMeta.match(/^guid: ([0-9a-f]{32})$/m)?.[1];
const syncGuid = syncMeta.match(/^guid: ([0-9a-f]{32})$/m)?.[1];
invariant(viewGuid, 'TOP view meta GUID is missing');
invariant(syncGuid, 'TOP sync meta GUID is missing');
invariant(viewGuid !== syncGuid, 'TOP Unity meta GUIDs must be unique');

console.log('top living night runtime: PASS');
console.log('layers: 17/17 editor-source + build-time StreamingAssets sync');
console.log('motion: fire / glow / stars / clouds / smoke / embers / robot eye');
console.log('flow: normal startup overlay / canonical simulator smoke isolated');
console.log('approval: runtime connected / simulator and physical-device approval pending');
