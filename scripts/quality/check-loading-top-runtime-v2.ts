import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Asset = {
  id: string;
  sourceStatus: string;
  sourcePath: string;
  resourceFile: string;
  width: number;
  height: number;
  sha256: string;
};

type Manifest = {
  schemaVersion: string;
  assetStatus: string;
  usesFallbackSources: boolean;
  assets: Asset[];
  approval: {
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
};

type CaptureManifest = {
  executed: boolean;
  result: string;
  expectedCaptureCount: number;
  captureCount: number;
  generatedAtUtc: string;
  error: string;
  captures: unknown[];
};

const root = process.cwd();
const generatedRoot = join(root, 'docs/design-targets/generated/loading-seasonal-v1');
const manifest = JSON.parse(
  readFileSync(join(generatedRoot, 'manifest.json'), 'utf8'),
) as Manifest;
const evidence = JSON.parse(
  readFileSync(join(generatedRoot, 'runtime-unity-verification.json'), 'utf8'),
) as Evidence;
const capture = JSON.parse(
  readFileSync(join(generatedRoot, 'runtime-capture-manifest.json'), 'utf8'),
) as CaptureManifest;
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

invariant(manifest.schemaVersion === 'loading-seasonal.0.1', 'unexpected Loading Seasonal schema');
invariant(
  manifest.assetStatus === 'runtime-connected-seasonal-binaries',
  'Loading Seasonal final asset status is missing',
);
invariant(!manifest.usesFallbackSources, 'Loading Seasonal must not use fallback sources');
invariant(manifest.assets.length === 4, 'Loading Seasonal requires exactly four committed sources');
invariant(manifest.approval.seasonalBinariesCommitted, 'seasonal binaries committed flag must remain true');
invariant(!manifest.approval.humanVisualReviewComplete, 'current V3 human visual review must remain pending');
invariant(!manifest.approval.approvedAsFinal, 'final approval must remain false');
invariant(!manifest.approval.runtimeApproved, 'runtime approval must remain false');
invariant(manifest.approval.finalApprovalBlocked, 'final approval must remain blocked');

const expected = [
  ['spring', 'loading-01-spring.png'],
  ['summer', 'loading-02-summer.png'],
  ['autumn', 'loading-03-autumn.png'],
  ['winter', 'loading-04-winter.png'],
] as const;

for (const [index, [id, file]] of expected.entries()) {
  const asset = manifest.assets[index];
  invariant(asset.id === id, `Loading season slot ${index} mismatch`);
  invariant(asset.sourceStatus === 'seasonal-source', `${id}: sourceStatus must be seasonal-source`);
  invariant(asset.resourceFile === file, `${id}: runtime filename mismatch`);
  invariant(
    asset.sourcePath === `docs/design-targets/generated/loading-seasonal-v1/sources/${file}`,
    `${id}: canonical source path mismatch`,
  );
  const png = inspectPng(join(root, asset.sourcePath));
  invariant(png.width === asset.width && png.height === asset.height, `${id}: PNG dimensions mismatch`);
  invariant(png.height > png.width, `${id}: source must remain portrait`);
  invariant(
    createHash('sha256').update(png.data).digest('hex') === asset.sha256,
    `${id}: SHA-256 mismatch`,
  );
}

invariant(evidence.executed, 'Loading Seasonal Unity import evidence must remain executed');
invariant(evidence.result === 'PASSED', 'Loading Seasonal Unity import evidence must remain PASSED');
invariant(/^6000\.5\./.test(evidence.unityVersion), 'Loading Seasonal Unity evidence version mismatch');
invariant(/^[0-9a-f]{40}$/.test(evidence.verifiedCommit), 'Loading Seasonal verified commit is invalid');
invariant(evidence.assertionCount === 154, 'Loading Seasonal evidence assertion count must remain 154');
invariant(evidence.failureCount === 0, 'Loading Seasonal Unity evidence must have zero failures');
invariant(evidence.sourceAssetCount === 4, 'Loading Seasonal evidence source count must be four');
invariant(evidence.resourceTextureCount === 4, 'Loading Seasonal evidence Resources count must be four');
invariant(evidence.loadingViewResolved, 'Loading Seasonal view evidence is missing');
invariant(evidence.flowContractResolved, 'Loading -> TOP flow evidence is missing');
invariant(evidence.randomRotationPassed, 'Loading random rotation evidence is missing');
invariant(evidence.buildHookResolved, 'Loading build hook evidence is missing');
invariant(evidence.manifestProvenancePassed, 'Loading manifest provenance evidence is missing');
invariant(evidence.buildImportPolicyPassed, 'Loading import policy evidence is missing');

invariant(capture.expectedCaptureCount === 15, 'current Loading/TOP capture matrix must remain 15 frames');
if (!capture.executed) {
  invariant(capture.result === 'NOT_RUN', 'unexecuted current V3 capture must be NOT_RUN');
  invariant(capture.captureCount === 0, 'unexecuted current V3 capture count must be zero');
  invariant(capture.captures.length === 0, 'unexecuted current V3 capture records must be empty');
  invariant(capture.generatedAtUtc === '', 'unexecuted current V3 capture timestamp must be empty');
  invariant(capture.error === '', 'unexecuted current V3 capture error must be empty');
  invariant(
    !manifest.approval.runtimeCaptureComplete,
    'current V3 capture cannot remain promoted while its manifest is NOT_RUN',
  );
} else {
  invariant(capture.result === 'PASSED', 'executed current V3 capture must be PASSED');
  invariant(capture.captureCount === 15, 'executed current V3 capture count must be 15');
  invariant(capture.captures.length === 15, 'executed current V3 capture must contain 15 records');
}

for (const token of [
  'Assets/Resources/LoadingSeasonal',
  'TextureImporterFormat.ASTC_6x6',
  'importer.isReadable = false',
  'importer.mipmapEnabled = false',
  'CleanupGeneratedBuildAssets(refresh: false)',
  'catch',
  'CleanupGeneratedBuildAssets();',
  'The four committed seasonal binaries were validated by dimensions and SHA-256 before staging.',
]) {
  invariant(sync.includes(token), `Loading Seasonal build contract missing: ${token}`);
}

console.log('Loading -> TOP runtime V2 source/import contract: PASS');
console.log('seasonal sources: four committed binaries / no fallback');
console.log('Unity import evidence: PASSED / 154 assertions / 4 Resources textures');
console.log(`current V3 capture: ${capture.executed ? 'PASSED 15/15' : 'honest NOT_RUN'}`);
console.log('approval: current human/runtime/final gates remain blocked');
