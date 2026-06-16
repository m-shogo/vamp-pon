import { existsSync, readFileSync } from 'node:fs';

type CharacterAsset = {
  id: string;
  spriteSheetPath: string;
  gameUseStatus: string;
};

type Core5Manifest = {
  productionTouched: boolean;
  characters: CharacterAsset[];
};

type Core5Cells = {
  columns: number;
  rows: number;
  totalCells: number;
  cellSizePx?: number;
  preferredPreviewCellSizePx?: number;
  cells: { index: number; row: number; column: number; key: string }[];
};

type Check = {
  label: string;
  ok: boolean;
  detail?: string;
};

const MANIFEST = 'data/character-assets/core5-character-master-assets.json';
const CELLS = 'data/character-assets/core5-52px-sprite-sheet-cells.json';
const EXPECTED_IDS = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];
const checks: Check[] = [];

function push(label: string, ok: boolean, detail?: string): void {
  checks.push({ label, ok, detail });
}

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

push(`manifest exists: ${MANIFEST}`, existsSync(MANIFEST));
push(`cell def exists: ${CELLS}`, existsSync(CELLS));

const manifest = readJson<Core5Manifest>(MANIFEST);
const cells = readJson<Core5Cells>(CELLS);
const targetCellSizePx = cells.preferredPreviewCellSizePx ?? 74;
const expectedWidth = cells.columns * targetCellSizePx;
const expectedHeight = cells.rows * targetCellSizePx;

push('productionTouched is false', manifest.productionTouched === false, String(manifest.productionTouched));
push('target columns=8', cells.columns === 8, String(cells.columns));
push('target rows=6', cells.rows === 6, String(cells.rows));
push('target totalCells=48', cells.totalCells === 48, String(cells.totalCells));
push('target cell size is 74px', targetCellSizePx === 74, String(targetCellSizePx));
push('target canvas is 592x444', expectedWidth === 592 && expectedHeight === 444, `${expectedWidth}x${expectedHeight}`);

const cellIndices = cells.cells.map((cell) => cell.index).sort((a, b) => a - b);
const expectedIndices = Array.from({ length: 48 }, (_, index) => index);
push('cell index covers 0-47', JSON.stringify(cellIndices) === JSON.stringify(expectedIndices), cellIndices.join(', '));

for (const id of EXPECTED_IDS) {
  const character = manifest.characters.find((candidate) => candidate.id === id);
  push(`${id} exists in manifest`, Boolean(character));
  if (!character) continue;

  push(`${id} remains prototype-sheet-only`, character.gameUseStatus === 'prototype-sheet-only', character.gameUseStatus);
  push(`${id} sprite sheet path exists`, existsSync(character.spriteSheetPath), character.spriteSheetPath);
  if (!existsSync(character.spriteSheetPath)) continue;

  try {
    const size = readPngSize(character.spriteSheetPath);
    push(`${id} sprite sheet is exact ${expectedWidth}x${expectedHeight}`, size.width === expectedWidth && size.height === expectedHeight, `${size.width}x${size.height}`);
  } catch (error) {
    push(`${id} sprite sheet is PNG`, false, error instanceof Error ? error.message : String(error));
  }
}

for (const check of checks) {
  const detail = check.detail ? `\n     ${check.detail.replace(/\n/g, '\n     ')}` : '';
  console.log(`${check.ok ? 'ok  ' : 'FAIL'} ${check.label}${detail}`);
}

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
  console.error(`\ncore5 exact sprite sheet gate failed (${failed.length} issue(s)). Current boards are reference-only until all 5 PNGs are exact ${expectedWidth}x${expectedHeight}.`);
  process.exit(1);
}

console.log(`\ncore5 exact sprite sheet gate passed: all Core5 sheets are exact ${expectedWidth}x${expectedHeight}.`);
