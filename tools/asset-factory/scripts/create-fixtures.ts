/**
 * Asset Factory QA fixture 生成スクリプト
 *
 * 使い方: node --experimental-strip-types tools/asset-factory/scripts/create-fixtures.ts
 *
 * 生成される PNG は QA 検証専用。AI 生成素材ではなく、
 * inspector / filter / export が壊れないことを確認するためのテストデータ。
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, '..', 'fixtures');

// PNG encoder — minimal, no external deps
// Uses raw canvas → PNG via a tiny inline encoder

type RGBA = [number, number, number, number];

function createPixelBuffer(w: number, h: number): { data: Uint8Array; width: number; height: number } {
  return { data: new Uint8Array(w * h * 4), width: w, height: h };
}

function setPixel(buf: { data: Uint8Array; width: number }, x: number, y: number, rgba: RGBA) {
  const i = (y * buf.width + x) * 4;
  buf.data[i] = rgba[0];
  buf.data[i + 1] = rgba[1];
  buf.data[i + 2] = rgba[2];
  buf.data[i + 3] = rgba[3];
}

function fillCircle(buf: { data: Uint8Array; width: number; height: number }, cx: number, cy: number, r: number, rgba: RGBA) {
  const r2 = r * r;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r2) {
        const px = cx + dx;
        const py = cy + dy;
        if (px >= 0 && px < buf.width && py >= 0 && py < buf.height) {
          setPixel(buf, px, py, rgba);
        }
      }
    }
  }
}

function fillRect(buf: { data: Uint8Array; width: number; height: number }, x0: number, y0: number, w: number, h: number, rgba: RGBA) {
  for (let y = y0; y < y0 + h && y < buf.height; y++) {
    for (let x = x0; x < x0 + w && x < buf.width; x++) {
      if (x >= 0 && y >= 0) setPixel(buf, x, y, rgba);
    }
  }
}

// Minimal PNG encoder (uncompressed IDAT with zlib stored blocks)
function crc32(buf: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function encodePNG(buf: { data: Uint8Array; width: number; height: number }): Uint8Array {
  const { width: w, height: h, data } = buf;

  // Build raw scanlines: filter byte (0) + RGBA per row
  const rawLen = h * (1 + w * 4);
  const raw = new Uint8Array(rawLen);
  let offset = 0;
  for (let y = 0; y < h; y++) {
    raw[offset++] = 0; // no filter
    for (let x = 0; x < w; x++) {
      const si = (y * w + x) * 4;
      raw[offset++] = data[si];
      raw[offset++] = data[si + 1];
      raw[offset++] = data[si + 2];
      raw[offset++] = data[si + 3];
    }
  }

  const idatData = deflateSync(Buffer.from(raw), { level: 9 });

  // Build PNG
  function writeU32BE(arr: Uint8Array, pos: number, val: number) {
    arr[pos] = (val >> 24) & 0xFF;
    arr[pos + 1] = (val >> 16) & 0xFF;
    arr[pos + 2] = (val >> 8) & 0xFF;
    arr[pos + 3] = val & 0xFF;
  }

  function makeChunk(type: string, data: Uint8Array): Uint8Array {
    const chunk = new Uint8Array(4 + 4 + data.length + 4);
    writeU32BE(chunk, 0, data.length);
    for (let i = 0; i < 4; i++) chunk[4 + i] = type.charCodeAt(i);
    chunk.set(data, 8);
    const crcBuf = new Uint8Array(4 + data.length);
    for (let i = 0; i < 4; i++) crcBuf[i] = type.charCodeAt(i);
    crcBuf.set(data, 4);
    writeU32BE(chunk, 8 + data.length, crc32(crcBuf));
    return chunk;
  }

  // IHDR
  const ihdrData = new Uint8Array(13);
  writeU32BE(ihdrData, 0, w);
  writeU32BE(ihdrData, 4, h);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', idatData);
  const iend = makeChunk('IEND', new Uint8Array(0));

  const png = new Uint8Array(sig.length + ihdr.length + idat.length + iend.length);
  let pi = 0;
  png.set(sig, pi); pi += sig.length;
  png.set(ihdr, pi); pi += ihdr.length;
  png.set(idat, pi); pi += idat.length;
  png.set(iend, pi);

  return png;
}

// --- Fixture generators ---

const BLACK: RGBA = [30, 20, 40, 255];
const GRAY: RGBA = [80, 70, 90, 255];
const RED: RGBA = [200, 60, 60, 255];

function createValidEnemySheet(): Uint8Array {
  const w = 1440, h = 1080;
  const buf = createPixelBuffer(w, h);
  // 8x6 grid, 180x180 cells, circle in center of each
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
      const cx = col * 180 + 90;
      const cy = row * 180 + 90;
      fillCircle(buf, cx, cy, 30 + (row * 8 + col) % 10, BLACK);
    }
  }
  return encodePNG(buf);
}

function createEdgeTouchSheet(): Uint8Array {
  const w = 1440, h = 1080;
  const buf = createPixelBuffer(w, h);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
      const cx = col * 180 + 90;
      const cy = row * 180 + 90;
      if ((row === 1 && col === 2) || (row === 3 && col === 5)) {
        // edge touch: circle extends to cell edge
        fillCircle(buf, col * 180 + 5, cy, 30, RED);
      } else {
        fillCircle(buf, cx, cy, 25, BLACK);
      }
    }
  }
  return encodePNG(buf);
}

function createEmptyCellsSheet(): Uint8Array {
  const w = 1440, h = 1080;
  const buf = createPixelBuffer(w, h);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
      // Leave some cells empty
      if ((row === 0 && col === 7) || (row === 2 && col === 3) || (row === 4 && col === 0) || (row === 5 && col === 6)) {
        continue;
      }
      const cx = col * 180 + 90;
      const cy = row * 180 + 90;
      fillCircle(buf, cx, cy, 28, BLACK);
    }
  }
  return encodePNG(buf);
}

function createWeaponIcon(): Uint8Array {
  const w = 1024, h = 1024;
  const buf = createPixelBuffer(w, h);
  // Diamond shape in center
  const cx = 512, cy = 512, size = 180;
  for (let dy = -size; dy <= size; dy++) {
    for (let dx = -size; dx <= size; dx++) {
      if (Math.abs(dx) + Math.abs(dy) <= size) {
        setPixel(buf, cx + dx, cy + dy, BLACK);
      }
    }
  }
  // Small highlight
  fillCircle(buf, cx - 40, cy - 40, 30, GRAY);
  return encodePNG(buf);
}

function createCutin(): Uint8Array {
  const w = 1440, h = 360;
  const buf = createPixelBuffer(w, h);
  // Character silhouette: oval + head
  fillCircle(buf, 400, 180, 100, BLACK);
  fillCircle(buf, 400, 60, 50, BLACK);
  // Action lines
  for (let i = 0; i < 5; i++) {
    fillRect(buf, 600 + i * 120, 160 + (i % 2) * 20, 80, 8, GRAY);
  }
  return encodePNG(buf);
}

function createBackground(): Uint8Array {
  const w = 390, h = 844;
  const buf = createPixelBuffer(w, h);
  // Gradient-like fill (dark to slightly lighter)
  for (let y = 0; y < h; y++) {
    const v = Math.floor(20 + (y / h) * 30);
    for (let x = 0; x < w; x++) {
      setPixel(buf, x, y, [v, v - 5, v + 10, 255]);
    }
  }
  // Some simple shapes for visual interest
  fillCircle(buf, 195, 200, 40, [60, 50, 80, 255]);
  fillRect(buf, 50, 600, 290, 20, [40, 35, 55, 255]);
  fillRect(buf, 100, 700, 190, 15, [40, 35, 55, 255]);
  return encodePNG(buf);
}

// --- Main ---
mkdirSync(FIXTURES_DIR, { recursive: true });

const fixtures: Array<[string, () => Uint8Array]> = [
  ['valid-enemy-sheet-1440x1080.png', createValidEnemySheet],
  ['edge-touch-enemy-sheet-1440x1080.png', createEdgeTouchSheet],
  ['empty-cells-enemy-sheet-1440x1080.png', createEmptyCellsSheet],
  ['weapon-icon-1024x1024.png', createWeaponIcon],
  ['cutin-1440x360.png', createCutin],
  ['background-390x844.png', createBackground],
];

for (const [name, gen] of fixtures) {
  const path = join(FIXTURES_DIR, name);
  const png = gen();
  writeFileSync(path, png);
  console.log(`✓ ${name} (${png.length} bytes)`);
}

console.log(`\n${fixtures.length} fixtures → ${FIXTURES_DIR}`);
