import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const legacySync = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightStreamingAssetsSync.cs',
  ),
  'utf8',
);
const v3Sync = readFileSync(
  join(
    root,
    'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightCompositeV3BuildAssetSync.cs',
  ),
  'utf8',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const [label, source, destination] of [
  ['layer-kit', legacySync, 'Assets/Resources/TopLivingNight'],
  ['v3-composite', v3Sync, 'Assets/Resources/TopLivingNightV3Generated'],
] as const) {
  for (const token of [
    'IPreprocessBuildWithReport',
    'IPostprocessBuildWithReport',
    destination,
    'CleanupGeneratedBuildAssets(refresh: false)',
    'try',
    'catch',
    'CleanupGeneratedBuildAssets();',
    'throw;',
    'OnPostprocessBuild',
  ]) {
    invariant(source.includes(token), `${label} build cleanup contract missing: ${token}`);
  }

  const cleanupBeforeTry = source.indexOf('CleanupGeneratedBuildAssets(refresh: false)');
  const tryIndex = source.indexOf('try', cleanupBeforeTry);
  const catchIndex = source.indexOf('catch', tryIndex);
  const cleanupAfterCatch = source.indexOf('CleanupGeneratedBuildAssets();', catchIndex);
  const rethrowIndex = source.indexOf('throw;', cleanupAfterCatch);

  invariant(cleanupBeforeTry >= 0, `${label}: pre-stage cleanup must exist`);
  invariant(tryIndex > cleanupBeforeTry, `${label}: staging must run inside try after cleanup`);
  invariant(catchIndex > tryIndex, `${label}: staging failure catch must exist`);
  invariant(cleanupAfterCatch > catchIndex, `${label}: failure path must cleanup generated Resources`);
  invariant(rethrowIndex > cleanupAfterCatch, `${label}: failure cleanup must preserve the build failure`);
}

console.log('TOP Living Night build cleanup contract: PASS');
console.log('layer-kit + V3 composite both cleanup stale staging before work, on failure, and post-build');
