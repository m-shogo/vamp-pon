import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { basename, join, extname } from 'node:path';
import { inflateSync } from 'node:zlib';

// --- PNG decode helpers (no deps) ---

function readPngChunks(buf: Buffer): { ihdr: { width: number; height: number; bitDepth: number; colorType: number } } {
  const sig = buf.subarray(0, 8);
  if (sig.toString('hex') !== '89504e470d0a1a0a') throw new Error('Not a PNG file');
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];
  return { ihdr: { width, height, bitDepth, colorType } };
}

function decodePngRgba(buf: Buffer): { width: number; height: number; pixels: Uint8Array } {
  const { ihdr } = readPngChunks(buf);
  const { width, height, colorType } = ihdr;
  const hasAlpha = colorType === 6 || colorType === 4;

  const inflate = inflateSync;
  const idatChunks: Buffer[] = [];
  let offset = 8;
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.subarray(offset + 4, offset + 8).toString('ascii');
    if (type === 'IDAT') idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
    offset += 12 + len;
  }
  const compressed = Buffer.concat(idatChunks);
  const raw = inflate(compressed);

  const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : 1;
  const stride = 1 + width * bpp;
  const pixels = new Uint8Array(width * height * 4);

  const prevRow = new Uint8Array(width * bpp);
  const currRow = new Uint8Array(width * bpp);

  for (let y = 0; y < height; y++) {
    const rowStart = y * stride;
    const filterType = raw[rowStart];
    const rowData = raw.subarray(rowStart + 1, rowStart + 1 + width * bpp);

    for (let i = 0; i < width * bpp; i++) {
      const a = i >= bpp ? currRow[i - bpp] : 0;
      const b = prevRow[i];
      const c = i >= bpp ? prevRow[i - bpp] : 0;
      let val = rowData[i];

      switch (filterType) {
        case 0: break;
        case 1: val = (val + a) & 0xff; break;
        case 2: val = (val + b) & 0xff; break;
        case 3: val = (val + ((a + b) >> 1)) & 0xff; break;
        case 4: val = (val + paethPredictor(a, b, c)) & 0xff; break;
      }
      currRow[i] = val;
    }

    for (let x = 0; x < width; x++) {
      const pi = (y * width + x) * 4;
      if (colorType === 6) {
        pixels[pi] = currRow[x * 4];
        pixels[pi + 1] = currRow[x * 4 + 1];
        pixels[pi + 2] = currRow[x * 4 + 2];
        pixels[pi + 3] = currRow[x * 4 + 3];
      } else if (colorType === 2) {
        pixels[pi] = currRow[x * 3];
        pixels[pi + 1] = currRow[x * 3 + 1];
        pixels[pi + 2] = currRow[x * 3 + 2];
        pixels[pi + 3] = 255;
      } else if (colorType === 4) {
        pixels[pi] = currRow[x * 2];
        pixels[pi + 1] = currRow[x * 2];
        pixels[pi + 2] = currRow[x * 2];
        pixels[pi + 3] = currRow[x * 2 + 1];
      } else {
        pixels[pi] = currRow[x];
        pixels[pi + 1] = currRow[x];
        pixels[pi + 2] = currRow[x];
        pixels[pi + 3] = hasAlpha ? 255 : 255;
      }
    }
    prevRow.set(currRow);
  }

  return { width, height, pixels };
}

function paethPredictor(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// --- Types ---

type Bbox = { x: number; y: number; w: number; h: number };
type CellResult = {
  index: number;
  row: number;
  col: number;
  bbox: Bbox | null;
  area: number;
  centerX: number;
  centerY: number;
  touchesEdge: boolean;
  empty: boolean;
};
type Warning = { level: 'warn' | 'error'; cell?: number; message: string };

type SheetFormat = {
  columns: number;
  rows: number;
  cellSize: number;
  expectedWidth: number;
  expectedHeight: number;
};

// --- Format presets ---

const FORMAT_8x6_180: SheetFormat = {
  columns: 8, rows: 6, cellSize: 180,
  expectedWidth: 1440, expectedHeight: 1080,
};

function detectFormat(ihdrW: number, ihdrH: number): SheetFormat {
  if (ihdrW === 1440 && ihdrH === 1080) return FORMAT_8x6_180;
  const cellCandidates = [180, 128, 96, 64, 48, 32];
  for (const cell of cellCandidates) {
    if (ihdrW % cell === 0 && ihdrH % cell === 0) {
      return { columns: ihdrW / cell, rows: ihdrH / cell, cellSize: cell, expectedWidth: ihdrW, expectedHeight: ihdrH };
    }
  }
  return { columns: 8, rows: 6, cellSize: ihdrW / 8, expectedWidth: ihdrW, expectedHeight: ihdrH };
}

// --- Inspector ---

const AREA_TOO_SMALL_RATIO = 0.02;
const AREA_TOO_LARGE_RATIO = 0.85;
const CENTER_JITTER_THRESHOLD = 12;

function inspectCell(pixels: Uint8Array, imgW: number, col: number, row: number, cellW: number, cellH: number, cols: number): CellResult {
  const ox = col * cellW;
  const oy = row * cellH;
  let minX = cellW, minY = cellH, maxX = -1, maxY = -1;
  let opaqueCount = 0;

  for (let cy = 0; cy < cellH; cy++) {
    for (let cx = 0; cx < cellW; cx++) {
      const pi = ((oy + cy) * imgW + (ox + cx)) * 4;
      const alpha = pixels[pi + 3];
      if (alpha > 0) {
        opaqueCount++;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
      }
    }
  }

  const empty = opaqueCount === 0;
  const bbox: Bbox | null = empty ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  const area = opaqueCount;
  const centerX = bbox ? minX + bbox.w / 2 : cellW / 2;
  const centerY = bbox ? minY + bbox.h / 2 : cellH / 2;

  let touchesEdge = false;
  if (!empty && bbox) {
    touchesEdge = bbox.x === 0 || bbox.y === 0 || (bbox.x + bbox.w) >= cellW || (bbox.y + bbox.h) >= cellH;
  }

  const index = row * cols + col;
  return { index, row, col, bbox, area, centerX, centerY, touchesEdge, empty };
}

function computeCellAlphaProfile(pixels: Uint8Array, imgW: number, col: number, row: number, cellW: number, cellH: number): number[] {
  const ox = col * cellW;
  const oy = row * cellH;
  const colSums = new Array<number>(cellW).fill(0);
  for (let cy = 0; cy < cellH; cy++) {
    for (let cx = 0; cx < cellW; cx++) {
      const pi = ((oy + cy) * imgW + (ox + cx)) * 4;
      if (pixels[pi + 3] > 0) colSums[cx]++;
    }
  }
  return colSums;
}

type FlipPair = { rightFrames: number[]; leftFrames: number[]; label: string };

const DEFAULT_FLIP_PAIRS: FlipPair[] = [
  { rightFrames: [8, 9, 10, 11], leftFrames: [8, 9, 10, 11], label: 'idle_right↔idle_left' },
  { rightFrames: [12, 13, 14, 15], leftFrames: [12, 13, 14, 15], label: 'walk_right↔walk_left' },
];

function checkFlipSymmetry(
  pixels: Uint8Array,
  imgW: number,
  cells: CellResult[],
  cellW: number,
  cellH: number,
  cols: number,
  warnings: Warning[],
): void {
  for (const pair of DEFAULT_FLIP_PAIRS) {
    for (let fi = 0; fi < pair.rightFrames.length; fi++) {
      const rIdx = pair.rightFrames[fi];
      const lIdx = pair.leftFrames[fi];
      const rCell = cells[rIdx];
      if (!rCell || rCell.empty) continue;

      const rCol = rIdx % cols;
      const rRow = Math.floor(rIdx / cols);
      const profile = computeCellAlphaProfile(pixels, imgW, rCol, rRow, cellW, cellH);
      const flipped = [...profile].reverse();

      const leftHalf = flipped.slice(0, Math.floor(cellW / 2));
      const rightHalf = flipped.slice(Math.floor(cellW / 2));
      const origLeft = profile.slice(0, Math.floor(cellW / 2));
      const origRight = profile.slice(Math.floor(cellW / 2));

      const leftMass = leftHalf.reduce((s, v) => s + v, 0);
      const rightMass = rightHalf.reduce((s, v) => s + v, 0);
      const origLeftMass = origLeft.reduce((s, v) => s + v, 0);
      const origRightMass = origRight.reduce((s, v) => s + v, 0);

      const totalMass = leftMass + rightMass;
      if (totalMass === 0) continue;

      const origBias = (origRightMass - origLeftMass) / totalMass;
      const flipBias = (rightMass - leftMass) / totalMass;

      if (Math.abs(origBias) > 0.15) {
        const heavySide = origBias > 0 ? '右' : '左';
        const flipHeavy = flipBias > 0 ? '右' : '左';
        warnings.push({
          level: 'warn',
          cell: rIdx,
          message: `${pair.label} フレーム${fi}: 非対称（${heavySide}寄り ${(Math.abs(origBias) * 100).toFixed(0)}%）— flip時に${flipHeavy}寄りになり、非対称要素（装備・小物等）の位置が反転する可能性`,
        });
      }
    }
  }
}

type InspectResult = { file: string; format: SheetFormat; warnings: Warning[]; cells: CellResult[] };

function inspectSheet(filePath: string, overrideFormat?: SheetFormat): InspectResult {
  const warnings: Warning[] = [];
  const buf = readFileSync(filePath);
  const { ihdr } = readPngChunks(buf);

  const fmt = overrideFormat ?? detectFormat(ihdr.width, ihdr.height);

  if (ihdr.width !== fmt.expectedWidth || ihdr.height !== fmt.expectedHeight) {
    warnings.push({
      level: 'error',
      message: `シートサイズ ${ihdr.width}x${ihdr.height} — 期待値 ${fmt.expectedWidth}x${fmt.expectedHeight}`,
    });
  }

  if (ihdr.colorType !== 6) {
    warnings.push({
      level: 'error',
      message: `colorType=${ihdr.colorType} — RGBA(6)ではない。透過PNGか確認してください`,
    });
  }

  const cellW = ihdr.width / fmt.columns;
  const cellH = ihdr.height / fmt.rows;

  if (cellW !== fmt.cellSize || cellH !== fmt.cellSize) {
    warnings.push({
      level: 'warn',
      message: `セルサイズ ${cellW}x${cellH} — 期待値 ${fmt.cellSize}x${fmt.cellSize}`,
    });
  }

  const { pixels } = decodePngRgba(buf);
  const cells: CellResult[] = [];

  for (let r = 0; r < fmt.rows; r++) {
    for (let c = 0; c < fmt.columns; c++) {
      cells.push(inspectCell(pixels, ihdr.width, c, r, cellW, cellH, fmt.columns));
    }
  }

  const maxArea = cellW * cellH;

  for (const cell of cells) {
    if (cell.empty) {
      warnings.push({ level: 'warn', cell: cell.index, message: `セル[${cell.row},${cell.col}] 空（不透明ピクセルなし）` });
    } else {
      if (cell.area < maxArea * AREA_TOO_SMALL_RATIO) {
        warnings.push({ level: 'warn', cell: cell.index, message: `セル[${cell.row},${cell.col}] 極端に小さい（${cell.area}px / ${maxArea}px）` });
      }
      if (cell.area > maxArea * AREA_TOO_LARGE_RATIO) {
        warnings.push({ level: 'warn', cell: cell.index, message: `セル[${cell.row},${cell.col}] 極端に大きい（${cell.area}px / ${maxArea}px）` });
      }
      if (cell.touchesEdge) {
        warnings.push({ level: 'warn', cell: cell.index, message: `セル[${cell.row},${cell.col}] セル端に接触 — 切れ・はみ出しの可能性` });
      }
    }
  }

  const nonEmpty = cells.filter((c) => !c.empty);
  if (nonEmpty.length >= 2) {
    const avgCx = nonEmpty.reduce((s, c) => s + c.centerX, 0) / nonEmpty.length;
    const avgCy = nonEmpty.reduce((s, c) => s + c.centerY, 0) / nonEmpty.length;
    for (const cell of nonEmpty) {
      const dx = Math.abs(cell.centerX - avgCx);
      const dy = Math.abs(cell.centerY - avgCy);
      if (dx > CENTER_JITTER_THRESHOLD || dy > CENTER_JITTER_THRESHOLD) {
        warnings.push({
          level: 'warn',
          cell: cell.index,
          message: `セル[${cell.row},${cell.col}] ガタつき候補 — bbox中心が平均から dx=${dx.toFixed(1)} dy=${dy.toFixed(1)} ずれ`,
        });
      }
    }
  }

  checkFlipSymmetry(pixels, ihdr.width, cells, cellW, cellH, fmt.columns, warnings);

  return { file: basename(filePath), format: fmt, warnings, cells };
}

// --- CLI ---

function printReport(result: InspectResult): void {
  console.log(`\n=== ${result.file} ===`);
  console.log(`  フォーマット: ${result.format.columns}x${result.format.rows} / ${result.format.cellSize}px cells`);

  const errors = result.warnings.filter((w) => w.level === 'error');
  const warns = result.warnings.filter((w) => w.level === 'warn');
  const empties = result.cells.filter((c) => c.empty).length;
  const filled = result.cells.length - empties;

  console.log(`  セル数: ${result.cells.length} (描画あり ${filled} / 空 ${empties})`);

  if (errors.length > 0) {
    console.log(`  ❌ エラー (${errors.length}):`);
    for (const e of errors) console.log(`    - ${e.message}`);
  }
  if (warns.length > 0) {
    console.log(`  ⚠️  警告 (${warns.length}):`);
    for (const w of warns) console.log(`    - ${w.message}`);
  }
  if (errors.length === 0 && warns.length === 0) {
    console.log('  ✅ 問題なし');
  }
}

function printJsonReport(results: InspectResult[]): void {
  const output = results.map((r) => ({
    file: r.file,
    format: r.format,
    totalCells: r.cells.length,
    filledCells: r.cells.filter((c) => !c.empty).length,
    emptyCells: r.cells.filter((c) => c.empty).length,
    errors: r.warnings.filter((w) => w.level === 'error').length,
    warnings: r.warnings.filter((w) => w.level === 'warn').length,
    details: r.warnings,
    cells: r.cells.map((c) => ({
      index: c.index,
      row: c.row,
      col: c.col,
      empty: c.empty,
      bbox: c.bbox,
      area: c.area,
      touchesEdge: c.touchesEdge,
    })),
  }));
  console.log(JSON.stringify(output, null, 2));
}

function parseFormatFlag(val: string): SheetFormat | undefined {
  const m = val.match(/^(\d+)x(\d+)\/(\d+)$/);
  if (!m) return undefined;
  const cols = Number(m[1]);
  const rows = Number(m[2]);
  const cell = Number(m[3]);
  return { columns: cols, rows: rows, cellSize: cell, expectedWidth: cols * cell, expectedHeight: rows * cell };
}

function main(): void {
  const args = process.argv.slice(2);
  const jsonFlag = args.includes('--json');
  const enemyFlag = args.includes('--enemy');
  const formatArg = args.find((a) => a.startsWith('--format='));
  const paths = args.filter((a) => !a.startsWith('--'));

  let overrideFormat: SheetFormat | undefined;
  if (formatArg) {
    overrideFormat = parseFormatFlag(formatArg.replace('--format=', ''));
    if (!overrideFormat) {
      console.error('--format の形式: --format=8x6/180 (列x行/セルサイズ)');
      process.exit(1);
    }
  }

  if (enemyFlag && paths.length === 0) {
    const enemyDir = 'public/assets/prototypes/sprite-sheets/enemies-original';
    if (existsSync(enemyDir)) {
      const pngs = readdirSync(enemyDir)
        .filter((f) => extname(f).toLowerCase() === '.png' && !f.includes('/'))
        .map((f) => join(enemyDir, f));
      paths.push(...pngs);
    }
  }

  if (paths.length === 0) {
    const defaultDir = 'public/assets/prototypes/sprite-sheets/core5-original';
    if (existsSync(defaultDir)) {
      const pngs = readdirSync(defaultDir)
        .filter((f) => extname(f).toLowerCase() === '.png')
        .map((f) => join(defaultDir, f));
      paths.push(...pngs);
    }
    if (paths.length === 0) {
      console.error('Usage: node --experimental-strip-types tools/spritesheet-inspector/inspect.ts [--json] [--enemy] [--format=8x6/180] <file.png ...>');
      console.error('       引数なしの場合 core5-original のPNGを自動検査');
      console.error('       --enemy: enemies-original のPNGを検査');
      console.error('       --format=列x行/セルサイズ: フォーマット指定（デフォルト: 自動検出）');
      process.exit(1);
    }
  }

  const results = paths.map((p) => inspectSheet(p, overrideFormat));

  if (jsonFlag) {
    printJsonReport(results);
  } else {
    console.log('🔍 Vamp Pon スプライトシート検査');
    console.log(`   対象: ${paths.length} ファイル`);
    for (const r of results) printReport(r);

    const totalErrors = results.reduce((s, r) => s + r.warnings.filter((w) => w.level === 'error').length, 0);
    const totalWarns = results.reduce((s, r) => s + r.warnings.filter((w) => w.level === 'warn').length, 0);
    console.log(`\n--- 合計: エラー ${totalErrors} / 警告 ${totalWarns} ---`);
    if (totalErrors > 0) process.exit(1);
  }
}

main();
