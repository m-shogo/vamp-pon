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
type Core5Cells = { columns: number; rows: number; totalCells: number; cellSizePx: number; candidateCellSizesPx?: number[]; preferredPreviewCellSizePx?: number; cells: CellDef[] };

type SheetReport = {
  id: string;
  name: string;
  originalPath: string;
  normalizedPath: string;
  exists: boolean;
  sourceWidth: number | null;
  sourceHeight: number | null;
  preferredWidth: number;
  preferredHeight: number;
  acceptedCellSizesPx: number[];
  detectedCellSizePx: number | null;
  exactGrid: boolean;
  visualLayoutApproved: boolean;
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
const PREFERRED_SOURCE_CELL_SIZE_PX = 74;
const VISUAL_LAYOUT_APPROVED = process.env.CORE5_APPROVE_VISUAL_LAYOUT === '1';
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

function uniqueNumbers(values: number[]): number[] {
  return [...new Set(values.filter((value) => Number.isFinite(value) && value > 0))];
}

function detectExactCellSize(width: number, height: number, cells: Core5Cells, candidates: number[]): number | null {
  return candidates.find((cellSize) => width === cells.columns * cellSize && height === cells.rows * cellSize) ?? null;
}

function makeOverlayCells(cells: Core5Cells, sourceCellSizePx: number, needsManualCrop: boolean): OverlayCell[] {
  return cells.cells.map((cell) => ({
    index: cell.index,
    key: cell.key,
    sourceX: (cell.column - 1) * sourceCellSizePx,
    sourceY: (cell.row - 1) * sourceCellSizePx,
    sourceWidth: sourceCellSizePx,
    sourceHeight: sourceCellSizePx,
    logicalCellSizePx: sourceCellSizePx,
    needsManualCrop,
  }));
}

const manifest = readJson<Core5Manifest>(MANIFEST);
const cells = readJson<Core5Cells>(CELLS);
const acceptedCellSizesPx = uniqueNumbers([
  PREFERRED_SOURCE_CELL_SIZE_PX,
  ...(cells.candidateCellSizesPx ?? []),
  cells.preferredPreviewCellSizePx ?? PREFERRED_SOURCE_CELL_SIZE_PX,
  cells.cellSizePx,
]);
const preferredWidth = cells.columns * PREFERRED_SOURCE_CELL_SIZE_PX;
const preferredHeight = cells.rows * PREFERRED_SOURCE_CELL_SIZE_PX;

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
      preferredWidth,
      preferredHeight,
      acceptedCellSizesPx,
      detectedCellSizePx: null,
      exactGrid: false,
      visualLayoutApproved: VISUAL_LAYOUT_APPROVED,
      needsManualCrop: true,
      action: 'missing',
      warning: 'sprite sheet is not placed yet; normalized PNG was not created',
    });
    overlays[ch.id] = [];
    continue;
  }

  const size = readPngSize(ch.spriteSheetPath);
  const detectedCellSizePx = detectExactCellSize(size.width, size.height, cells, acceptedCellSizesPx);
  const exactGrid = detectedCellSizePx !== null;
  const canCopy = exactGrid && VISUAL_LAYOUT_APPROVED;
  const sourceCellSizePx = detectedCellSizePx ?? PREFERRED_SOURCE_CELL_SIZE_PX;
  const needsManualCrop = !canCopy;
  overlays[ch.id] = makeOverlayCells(cells, sourceCellSizePx, needsManualCrop);

  if (canCopy) {
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
    preferredWidth,
    preferredHeight,
    acceptedCellSizesPx,
    detectedCellSizePx,
    exactGrid,
    visualLayoutApproved: VISUAL_LAYOUT_APPROVED,
    needsManualCrop,
    action: canCopy ? 'copied-exact-grid' : 'overlay-only',
    warning: canCopy
      ? undefined
      : exactGrid
        ? 'dimensions match a candidate grid, but visual layout has not been manually approved; normalized PNG was not copied'
        : `source is ${size.width}x${size.height}; preferred 74px grid is ${preferredWidth}x${preferredHeight}; regenerate an exact grid sheet before normalization`,
  });
}

const output = {
  status: 'prototype-review-normalization-manifest',
  productionTouched: false,
  outputDir: OUT_DIR,
  expectedOutputs: EXPECTED_OUTPUTS,
  visualLayoutApproved: VISUAL_LAYOUT_APPROVED,
  approvalEnv: 'CORE5_APPROVE_VISUAL_LAYOUT=1',
  grid: {
    columns: cells.columns,
    rows: cells.rows,
    totalCells: cells.totalCells,
    legacyCellSizePx: cells.cellSizePx,
    preferredSourceCellSizePx: PREFERRED_SOURCE_CELL_SIZE_PX,
    acceptedCellSizesPx,
    preferredWidth,
    preferredHeight,
  },
  reports,
};

writeFileSync(join(OUT_DIR, 'manifest.json'), `${JSON.stringify(output, null, 2)}\n`);
writeFileSync(join(OUT_DIR, 'overlay-cells.json'), `${JSON.stringify(overlays, null, 2)}\n`);

let missing = 0;
for (const report of reports) {
  const mark = report.exists && !report.needsManualCrop ? 'ok  ' : report.exists ? 'WARN' : 'MISS';
  const detected = report.detectedCellSizePx ? `${report.detectedCellSizePx}px` : 'manual';
  console.log(`${mark} ${report.id}: ${report.action} ${report.sourceWidth ?? '-'}x${report.sourceHeight ?? '-'} cell=${detected} -> ${report.normalizedPath}`);
  if (report.warning) console.log(`     ${report.warning}`);
  if (!report.exists) missing += 1;
}

console.log(`\ncore5:sprites:normalize wrote ${OUT_DIR}/manifest.json and overlay-cells.json`);
if (!VISUAL_LAYOUT_APPROVED) {
  console.warn('normalized PNG copy is gated until visual layout is approved. Use CORE5_APPROVE_VISUAL_LAYOUT=1 only after exact-grid review passes.');
}
if (missing > 0) {
  console.warn(`core5:sprites:normalize completed with ${missing} missing source sheet(s). Run pnpm character-assets:verify for the strict gate.`);
}
