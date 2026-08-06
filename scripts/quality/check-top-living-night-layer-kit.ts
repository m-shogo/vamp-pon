import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function inspectPng(path: string) {
  const data = readFileSync(path);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  invariant(data.subarray(0, 8).equals(signature), `${path}: invalid PNG signature`);
  invariant(data.subarray(12, 16).toString('ascii') === 'IHDR', `${path}: missing IHDR`);

  let offset = 8;
  let chunkCount = 0;
  let sawIend = false;
  while (offset < data.length) {
    invariant(offset + 12 <= data.length, `${path}: truncated PNG chunk header`);
    const length = data.readUInt32BE(offset);
    const typeStart = offset + 4;
    const payloadStart = offset + 8;
    const payloadEnd = payloadStart + length;
    const crcOffset = payloadEnd;
    const nextOffset = crcOffset + 4;
    invariant(nextOffset <= data.length, `${path}: truncated PNG chunk`);

    const type = data.subarray(typeStart, typeStart + 4).toString('ascii');
    const expected = crc32(data.subarray(typeStart, payloadEnd));
    const actual = data.readUInt32BE(crcOffset);
    invariant(
      actual === expected,
      `${path}: ${type} CRC mismatch ${actual.toString(16).padStart(8, '0')} != ${expected.toString(16).padStart(8, '0')}`,
    );

    chunkCount += 1;
    offset = nextOffset;
    if (type === 'IEND') {
      sawIend = true;
      break;
    }
  }

  invariant(sawIend, `${path}: missing IEND`);
  invariant(offset === data.length, `${path}: unexpected bytes after IEND`);
  return {
    data,
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    colorType: data.readUInt8(25),
    chunkCount,
  };
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
const committedAssets: Array<Pick<Asset, 'id' | 'file' | 'width' | 'height' | 'bytes' | 'sha256' | 'alphaRequired'>> = [];
const provenanceMismatches: string[] = [];
let pngChunkCount = 0;
for (const asset of manifest.assets) {
  invariant(!ids.has(asset.id), `duplicate asset id: ${asset.id}`);
  ids.add(asset.id);
  const path = join(ASSET_DIR, asset.file);
  const png = inspectPng(path);
  pngChunkCount += png.chunkCount;
  const actualSha = createHash('sha256').update(png.data).digest('hex');
  const committed = {
    id: asset.id,
    file: asset.file,
    width: png.width,
    height: png.height,
    bytes: png.data.length,
    sha256: actualSha,
    alphaRequired: asset.alphaRequired,
  };
  committedAssets.push(committed);
  invariant(png.width === asset.width, `${asset.id}: width mismatch`);
  invariant(png.height === asset.height, `${asset.id}: height mismatch`);
  if (png.data.length !== asset.bytes || actualSha !== asset.sha256) {
    provenanceMismatches.push(asset.id);
  }
  if (asset.alphaRequired) invariant([4, 6].includes(png.colorType), `${asset.id}: alpha channel required`);
}

if (provenanceMismatches.length > 0) {
  console.error(`TOP committed provenance differs for: ${provenanceMismatches.join(', ')}`);
  console.error('BEGIN_TOP_COMMITTED_ASSETS_JSON');
  console.error(JSON.stringify(committedAssets));
  console.error('END_TOP_COMMITTED_ASSETS_JSON');
  process.exit(1);
}

const mp4 = readFileSync(join(ASSET_DIR, 'previews', 'top-living-night-layer-motion-preview.mp4'));
invariant(mp4.subarray(4, 8).toString('ascii') === 'ftyp', 'motion preview: invalid MP4 header');

console.log('top living night layer kit: PASS');
console.log(`assets: ${manifest.assets.length}/17`);
console.log(`PNG chunks: ${pngChunkCount} CRC-valid`);
console.log('preview: 48 frames / 8fps / 6s / deterministic layered stills');
console.log('approval: selected direction / runtime connected candidate / final blocked');
