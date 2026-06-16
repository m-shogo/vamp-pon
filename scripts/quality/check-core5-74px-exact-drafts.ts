import { existsSync, readFileSync } from 'node:fs';

type CharacterAsset = {
  id: string;
  spriteSheetPath: string;
  exactSpriteSheetPath: string;
  exactSpriteSheetStatus: string;
  gameUseStatus: string;
};

type Manifest = {
  productionTouched: boolean;
  characters: CharacterAsset[];
};

type Cells = {
  columns: number;
  rows: number;
  totalCells: number;
  preferredPreviewCellSizePx?: number;
  cells: { index: number }[];
};

const manifest = JSON.parse(readFileSync('data/character-assets/core5-character-master-assets.json', 'utf8')) as Manifest;
const cells = JSON.parse(readFileSync('data/character-assets/core5-52px-sprite-sheet-cells.json', 'utf8')) as Cells;
const expectedIds = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];
const cellSize = cells.preferredPreviewCellSizePx ?? 74;
const width = cells.columns * cellSize;
const height = cells.rows * cellSize;
const failures: string[] = [];

function pngSize(path: string): { width: number; height: number } {
  const data = readFileSync(path);
  if (data.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('not PNG');
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function check(ok: boolean, label: string, detail = ''): void {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${detail ? `\n     ${detail}` : ''}`);
  if (!ok) failures.push(`${label}${detail ? `: ${detail}` : ''}`);
}

check(manifest.productionTouched === false, 'productionTouched is false', String(manifest.productionTouched));
check(cells.columns === 8, 'columns=8', String(cells.columns));
check(cells.rows === 6, 'rows=6', String(cells.rows));
check(cells.totalCells === 48, 'totalCells=48', String(cells.totalCells));
check(cellSize === 74, 'cellSize=74', String(cellSize));
check(width === 592 && height === 444, 'canvas=592x444', `${width}x${height}`);
check(JSON.stringify(cells.cells.map((cell) => cell.index).sort((a, b) => a - b)) === JSON.stringify(Array.from({ length: 48 }, (_, index) => index)), 'cell indices cover 0-47');

for (const id of expectedIds) {
  const character = manifest.characters.find((candidate) => candidate.id === id);
  check(Boolean(character), `${id} manifest entry exists`);
  if (!character) continue;

  check(character.gameUseStatus === 'prototype-sheet-only', `${id} remains prototype-sheet-only`, character.gameUseStatus);
  check(character.exactSpriteSheetStatus === 'generated-draft', `${id} exact status is generated-draft`, character.exactSpriteSheetStatus);
  check(existsSync(character.spriteSheetPath), `${id} reference board remains available`, character.spriteSheetPath);
  check(existsSync(character.exactSpriteSheetPath), `${id} exact draft exists`, character.exactSpriteSheetPath);
  if (!existsSync(character.exactSpriteSheetPath)) continue;

  try {
    const size = pngSize(character.exactSpriteSheetPath);
    check(size.width === width && size.height === height, `${id} exact draft is ${width}x${height}`, `${size.width}x${size.height}`);
  } catch (error) {
    check(false, `${id} exact draft is PNG`, error instanceof Error ? error.message : String(error));
  }
}

if (failures.length > 0) {
  throw new Error(`Core5 74px exact draft gate failed (${failures.length}):\n${failures.join('\n')}`);
}

console.log(`\nCore5 74px exact draft gate passed. Reference boards are preserved separately.`);
