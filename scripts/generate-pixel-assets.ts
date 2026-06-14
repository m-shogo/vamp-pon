import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { deflateSync } from 'node:zlib';
import { assetManifest } from '../src/game/assets/assetManifest.ts';
import { generatedPixelAssets, pixelGridToRgbaBuffer, type PixelAssetSpec, type PixelGrid } from '../src/game/assets/vampPixelKit.ts';

const PUBLIC_DIR = 'public';

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}

function crc32(buffer: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of buffer) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Buffer {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePng(grid: PixelGrid): Buffer {
  const rgba = pixelGridToRgbaBuffer(grid);
  const raw = Buffer.alloc((grid.width * 4 + 1) * grid.height);
  for (let y = 0; y < grid.height; y += 1) {
    raw[y * (grid.width * 4 + 1)] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * grid.width * 4, grid.width * 4).copy(raw, y * (grid.width * 4 + 1) + 1);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(grid.width, 0);
  ihdr.writeUInt32BE(grid.height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function assertManifestMatch(spec: PixelAssetSpec): void {
  const manifest = assetManifest.find((entry) => entry.id === spec.id);
  if (!manifest) throw new Error(`assetManifest に ${spec.id} がありません`);
  if (manifest.path !== spec.path) throw new Error(`${spec.id} path mismatch: ${spec.path} !== ${manifest.path}`);
  if (manifest.width !== spec.width || manifest.height !== spec.height) {
    throw new Error(`${spec.id} size mismatch: ${spec.width}x${spec.height} !== ${manifest.width}x${manifest.height}`);
  }
}

function validateGrid(spec: PixelAssetSpec, grid: PixelGrid): void {
  if (grid.width !== spec.width || grid.height !== spec.height) {
    throw new Error(`${spec.id} generated ${grid.width}x${grid.height}, expected ${spec.width}x${spec.height}`);
  }
  if (!grid.pixels.some((pixel) => pixel != null && pixel[3] > 0)) {
    throw new Error(`${spec.id} has no visible pixels`);
  }
}

function generateAssets({ verifyOnly }: { verifyOnly: boolean }): void {
  if (generatedPixelAssets.length < 30) throw new Error(`生成予定数が少なすぎます: ${generatedPixelAssets.length}`);

  for (const spec of generatedPixelAssets) {
    assertManifestMatch(spec);
    const grid = spec.create({ seed: 20260614 });
    validateGrid(spec, grid);
    if (verifyOnly) continue;

    const outputPath = join(PUBLIC_DIR, spec.path);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, encodePng(grid));
  }
}

const verifyOnly = process.argv.includes('--verify');
generateAssets({ verifyOnly });
const qualityCounts = generatedPixelAssets.reduce<Record<string, number>>((acc, asset) => {
  acc[asset.quality] = (acc[asset.quality] ?? 0) + 1;
  return acc;
}, {});
console.log(`${verifyOnly ? 'verified' : 'generated'} ${generatedPixelAssets.length} pixel assets`);
console.log(`quality ${Object.entries(qualityCounts).map(([quality, count]) => `${quality}=${count}`).join(' ')}`);
