import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const sync = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/Editor/LoadingSeasonalBuildAssetSync.cs',
  ),
  'utf8',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const token of [
  'IPreprocessBuildWithReport',
  'IPostprocessBuildWithReport',
  'Assets/Resources/LoadingSeasonal',
  'CleanupGeneratedBuildAssets(refresh: false)',
  'try',
  'catch',
  'CleanupGeneratedBuildAssets();',
  'throw;',
  'OnPostprocessBuild',
  'TextureImporterFormat.ASTC_6x6',
  'importer.isReadable = false',
  'importer.mipmapEnabled = false',
  'TextureWrapMode.Clamp',
  'FilterMode.Bilinear',
  'The four committed seasonal binaries were validated by dimensions and SHA-256 before staging.',
]) {
  invariant(sync.includes(token), `Loading Seasonal build cleanup contract missing: ${token}`);
}

for (const stale of [
  'explicit temporary fallback',
  'until the approved seasonal binaries are committed',
]) {
  invariant(
    !sync.includes(stale),
    `Loading Seasonal generated staging README contains stale fallback text: ${stale}`,
  );
}

const stageStart = sync.indexOf('private static void StageAndImport()');
const validateStart = sync.indexOf('private static void ValidateManifest', stageStart);
invariant(stageStart >= 0 && validateStart > stageStart, 'Loading Seasonal StageAndImport boundary is missing');
const stageBlock = sync.slice(stageStart, validateStart);

invariant(
  stageBlock.indexOf('CleanupGeneratedBuildAssets(refresh: false)') < stageBlock.indexOf('try'),
  'Loading Seasonal must remove stale generated Resources before staging',
);
invariant(
  stageBlock.indexOf('catch') < stageBlock.lastIndexOf('CleanupGeneratedBuildAssets();'),
  'Loading Seasonal catch path must clean partially generated Resources',
);

console.log('Loading Seasonal build cleanup contract: PASS');
console.log('staging: four committed seasonal binaries / stale cleanup / exception cleanup / post-build cleanup');
