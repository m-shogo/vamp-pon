import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Manifest = {
  assetStatus: string;
  usesFallbackSources: boolean;
  assets: Array<{
    id: string;
    sourceStatus: string;
    sourcePath: string;
    resourceFile: string;
    width: number;
    height: number;
  }>;
  approval: {
    seasonalBinariesCommitted: boolean;
    runtimeCaptureComplete: boolean;
    humanVisualReviewComplete: boolean;
    approvedAsFinal: boolean;
    runtimeApproved: boolean;
    finalApprovalBlocked: boolean;
  };
};

const root = process.cwd();
const manifest = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/loading-seasonal-v1/manifest.json'),
    'utf8',
  ),
) as Manifest;
const readme = readFileSync(
  join(root, 'docs/design-targets/generated/loading-seasonal-v1/README.md'),
  'utf8',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(
  manifest.assetStatus === 'runtime-connected-seasonal-binaries',
  'seasonal Loading manifest must remain runtime-connected-seasonal-binaries',
);
invariant(!manifest.usesFallbackSources, 'seasonal Loading must not regress to fallback sources');
invariant(manifest.assets.length === 4, 'seasonal Loading must retain exactly four final assets');
invariant(manifest.approval.seasonalBinariesCommitted, 'seasonal Loading binaries must remain committed');
invariant(!manifest.approval.runtimeCaptureComplete, 'current V3 runtime capture must remain pending until new evidence');
invariant(!manifest.approval.humanVisualReviewComplete, 'current V3 human visual review must remain pending');
invariant(!manifest.approval.approvedAsFinal, 'Loading/TOP final approval must remain false');
invariant(!manifest.approval.runtimeApproved, 'Loading/TOP runtime approval must remain false');
invariant(manifest.approval.finalApprovalBlocked, 'Loading/TOP final approval must remain blocked');

for (const token of [
  'FINAL_SEASONAL_BINARIES_COMMITTED / V3_RECAPTURE_REQUIRED',
  'No TOP-candidate fallback is used.',
  'assetStatus=runtime-connected-seasonal-binaries',
  'usesFallbackSources=false',
  'seasonalBinariesCommitted=true',
  'executed=false',
  'result=NOT_RUN',
  'runtimeCaptureComplete=false',
  'humanVisualReviewComplete=false',
  'approvedAsFinal=false',
  'runtimeApproved=false',
  'finalApprovalBlocked=true',
]) {
  invariant(readme.includes(token), `seasonal Loading README boundary missing: ${token}`);
}

for (const asset of manifest.assets) {
  invariant(asset.sourceStatus === 'seasonal-source', `${asset.id}: source must remain seasonal-source`);
  for (const token of [
    asset.sourcePath,
    asset.resourceFile,
    `${asset.width}x${asset.height}`,
  ]) {
    invariant(readme.includes(token), `${asset.id}: README is missing manifest-backed token ${token}`);
  }
}

for (const stale of [
  'Those four generated binaries are not yet committed',
  'explicit temporary fallback',
  'seasonalBinariesCommitted=false',
  'The fallback art is implementation evidence',
]) {
  invariant(!readme.includes(stale), `seasonal Loading README contains stale fallback statement: ${stale}`);
}

console.log('Loading Seasonal documentation consistency: PASS');
console.log('assets: four committed seasonal binaries / no fallback sources');
console.log('runtime: current V3 recapture + human/device approval remain pending');
