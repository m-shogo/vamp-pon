import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type CharacterId = 'yui' | 'asa' | 'nagi' | 'michiru' | 'tomori';
type CharacterAsset = {
  id: CharacterId;
  name: string;
  spriteSheetPath: string;
};
type Core5Manifest = { characters: CharacterAsset[] };
type CellDef = { index: number; row: number; column: number; key: string; description: string };
type Core5Cells = { columns: number; rows: number; totalCells: number; cellSizePx: number; cells: CellDef[] };

type SheetReport = {
  id: string;
  name: string;
  originalPath: string;
  normalizedPath: string;
  exists: boolean;
  sourceWidth: number | null;
  sourceHeight: number | null;
  expectedWidth: number;
  expectedHeight: number;
  exactGrid: boolean;
  needsManualCrop: boolean;
  action: 'copied-exact-grid' | 'overlay-only' | 'missing';
  warning?: string;
};

type OverlayCell = {
  index: number;
  key: string;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  logicalCellSizePx: number;
  needsManualCrop: boolean;
};

const MANIFEST = 'data/character-assets/core5-character-master-assets.json';
const CELLS = 'data/character-assets/core5-52px-sprite-sheet-cells.json';
const OUT_DIR = 'public/assets/prototypes/sprite-sheets/core5-52px-normalized';
const EXPECTED_OUTPUTS: Record<CharacterId, string> = {
  yui: `${OUT_DIR}/yui.png`,
  asa: `${OUT_DIR}/asa.png`,
  nagi: `${OUT_DIR}/nagi.png`,
  michiru: `${OUT_DIR}/michiru.png`,
  tomori: `${OUT_DIR}/tomori.png`,
};

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

function readPngSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  const signature = buf.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error(`${file} is not a PNG`);
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function makeOverlayCells(cells: Core5Cells, width: number, height: number, needsManualCrop: boolean): OverlayCell[] {
  const sourceCellWidth = width / cells.columns;
  const sourceCellHeight = height / cells.rows;
  return cells.cells.map((cell) => ({
    index: cell.index,
    key: cell.key,
    sourceX: Math.round((cell.column - 1) * sourceCellWidth * 1000) / 1000,
    sourceY: Math.round((cell.row - 1) * sourceCellHeight * 1000) / 1000,
    sourceWidth: Math.round(sourceCellWidth * 1000) / 1000,
    sourceHeight: Math.round(sourceCellHeight * 1000) / 1000,
    logicalCellSizePx: cells.cellSizePx,
    needsManualCrop,
  }));
}

const manifest = readJson<Core5Manifest>(MANIFEST);
const cells = readJson<Core5Cells>(CELLS);
const expectedWidth = cells.columns * cells.cellSizePx;
const expectedHeight = cells.rows * cells.cellSizePx;

mkdirSync(OUT_DIR, { recursive: true });

const reports: SheetReport[] = [];
const overlays: Record<string, OverlayCell[]> = {};

for (const ch of manifest.characters) {
  const normalizedPath = EXPECTED_OUTPUTS[ch.id];
  if (!normalizedPath) {
    throw new Error(`Unexpected Core5 character id: ${ch.id}`);
  }

  if (!existsSync(ch.spriteSheetPath)) {
    reports.push({
      id: ch.id,
      name: ch.name,
      originalPath: ch.spriteSheetPath,
      normalizedPath,
      exists: false,
      sourceWidth: null,
      sourceHeight: null,
      expectedWidth,
      expectedHeight,
      exactGrid: false,
      needsManualCrop: true,
      action: 'missing',
      warning: 'sprite sheet is not placed yet; normalized PNG was not created',
    });
    overlays[ch.id] = [];
    continue;
  }

  const size = readPngSize(ch.spriteSheetPath);
  const exactGrid = size.width === expectedWidth && size.height === expectedHeight;
  const needsManualCrop = !exactGrid;
  overlays[ch.id] = makeOverlayCells(cells, size.width, size.height, needsManualCrop);

  if (exactGrid) {
    copyFileSync(ch.spriteSheetPath, normalizedPath);
  }

  reports.push({
    id: ch.id,
    name: ch.name,
    originalPath: ch.spriteSheetPath,
    normalizedPath,
    exists: true,
    sourceWidth: size.width,
    sourceHeight: size.height,
    expectedWidth,
    expectedHeight,
    exactGrid,
    needsManualCrop,
    action: exactGrid ? 'copied-exact-grid' : 'overlay-only',
    warning: exactGrid
      ? undefined
      : `source is ${size.width}x${size.height}, expected ${expectedWidth}x${expectedHeight}; manual crop/Aseprite normalization required`,
  });
}

const output = {
  status: 'prototype-review-normalization-manifest',
  productionTouched: false,
  outputDir: OUT_DIR,
  expectedOutputs: EXPECTED_OUTPUTS,
  grid: {
    columns: cells.columns,
    rows: cells.rows,
    totalCells: cells.totalCells,
    cellSizePx: cells.cellSizePx,
    expectedWidth,
    expectedHeight,
  },
  reports,
};

writeFileSync(join(OUT_DIR, 'manifest.json'), `${JSON.stringify(output, null, 2)}\n`);
writeFileSync(join(OUT_DIR, 'overlay-cells.json'), `${JSON.stringify(overlays, null, 2)}\n`);

let missing = 0;
for (const report of reports) {
  const mark = report.exists && !report.needsManualCrop ? 'ok  ' : report.exists ? 'WARN' : 'MISS';
  console.log(`${mark} ${report.id}: ${report.action} ${report.sourceWidth ?? '-'}x${report.sourceHeight ?? '-'} -> ${report.normalizedPath}`);
  if (report.warning) console.log(`     ${report.warning}`);
  if (!report.exists) missing += 1;
}

console.log(`\ncore5:sprites:normalize wrote ${OUT_DIR}/manifest.json and overlay-cells.json`);
if (missing > 0) {
  console.warn(`core5:sprites:normalize completed with ${missing} missing source sheet(s). Run pnpm character-assets:verify for the strict gate.`);
}
