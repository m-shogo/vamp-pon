import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type Asset = {
  id: string;
  file: string;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  alphaRequired: boolean;
};

type Manifest = {
  schemaVersion: string;
  sourceComposition: string;
  approval: {
    status: string;
    humanSelectedCompositionDirection: boolean;
    approvedAsFinal: boolean;
    runtimeApproved: boolean;
    runtimeConnected: boolean;
    finalApprovalBlocked: boolean;
  };
  motionPolicy: {
    videoGenerationUsed: boolean;
    runtimeUsesVideo: boolean;
    previewFrames: number;
    previewFps: number;
    previewDurationSeconds: number;
  };
  assets: Asset[];
  runtimeConnection: {
    connectedAssetCount: number;
    diagnosticIsolation: string;
    result: string;
  };
};

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, '..', '..');
const ASSET_DIR = join(REPO_ROOT, 'docs', 'design-targets', 'generated', 'top-living-night-v2');
const manifest = JSON.parse(readFileSync(join(ASSET_DIR, 'manifest.json'), 'utf8')) as Manifest;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function inspectPng(path: string) {
  const data = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(data.subarray(0, 8).equals(signature), `${path}: invalid PNG signature`);
  invariant(data.subarray(12, 16).toString('ascii') === 'IHDR', `${path}: missing IHDR`);
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20), colorType: data.readUInt8(25) };
}

invariant(manifest.schemaVersion === 'top-living-night-layer-kit.0.3', 'unexpected schemaVersion');
invariant(manifest.sourceComposition === 'candidate-a', 'source must remain candidate-a');
invariant(manifest.approval.status === 'runtime-connected-candidate', 'status must remain runtime-connected candidate');
invariant(manifest.approval.humanSelectedCompositionDirection === true, 'direction selection missing');
invariant(manifest.approval.approvedAsFinal === false, 'approvedAsFinal must remain false');
invariant(manifest.approval.runtimeApproved === false, 'runtimeApproved must remain false');
invariant(manifest.approval.runtimeConnected === true, 'runtimeConnected must be true');
invariant(manifest.approval.finalApprovalBlocked === true, 'finalApprovalBlocked must remain true');
invariant(manifest.motionPolicy.videoGenerationUsed === false, 'AI video must remain unused');
invariant(manifest.motionPolicy.runtimeUsesVideo === false, 'runtime video must remain disabled');
invariant(manifest.motionPolicy.previewFrames === 48, 'preview frame count mismatch');
invariant(manifest.motionPolicy.previewFps === 8, 'preview fps mismatch');
invariant(manifest.motionPolicy.previewDurationSeconds === 6, 'preview duration mismatch');
invariant(manifest.assets.length === 17, `expected 17 assets, got ${manifest.assets.length}`);
invariant(manifest.runtimeConnection.connectedAssetCount === 17, 'all 17 assets must be runtime-connected');
invariant(manifest.runtimeConnection.diagnosticIsolation === 'VAMPPON_AI_SIMULATOR_SMOKE', 'diagnostic isolation mismatch');
invariant(manifest.runtimeConnection.result === 'PASS_SOURCE_CONTRACT', 'runtime source contract must pass');

const ids = new Set<string>();
for (const asset of manifest.assets) {
  invariant(!ids.has(asset.id), `duplicate asset id: ${asset.id}`);
  ids.add(asset.id);
  const path = join(ASSET_DIR, asset.file);
  const data = readFileSync(path);
  const png = inspectPng(path);
  invariant(png.width === asset.width, `${asset.id}: width mismatch`);
  invariant(png.height === asset.height, `${asset.id}: height mismatch`);
  invariant(statSync(path).size === asset.bytes, `${asset.id}: byte size mismatch`);
  invariant(createHash('sha256').update(data).digest('hex') === asset.sha256, `${asset.id}: sha mismatch`);
  if (asset.alphaRequired) invariant([4, 6].includes(png.colorType), `${asset.id}: alpha channel required`);
}

const mp4 = readFileSync(join(ASSET_DIR, 'previews', 'top-living-night-layer-motion-preview.mp4'));
invariant(mp4.subarray(4, 8).toString('ascii') === 'ftyp', 'motion preview: invalid MP4 header');

console.log('top living night layer kit: PASS');
console.log(`assets: ${manifest.assets.length}/17`);
console.log('preview: 48 frames / 8fps / 6s / deterministic layered stills');
console.log('approval: selected direction / runtime connected candidate / final blocked');
