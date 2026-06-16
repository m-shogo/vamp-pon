import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

type Check = { label: string; ok: boolean; detail?: string };
type CharacterAsset = {
  id: string;
  masterBoardPath: string;
  spriteSheetPath: string;
  gameUseStatus: string;
};
type Core5Manifest = {
  productionTouched: boolean;
  characters: CharacterAsset[];
};
type CellDef = {
  index: number;
  row: number;
  column: number;
  key: string;
};
type Core5Cells = {
  columns: number;
  rows: number;
  totalCells: number;
  cellSizePx?: number;
  cells: CellDef[];
};

const checks: Check[] = [];
const MANIFEST = 'data/character-assets/core5-character-master-assets.json';
const CELLS = 'data/character-assets/core5-52px-sprite-sheet-cells.json';
const PRODUCTION_PLAYER_DIR = 'public/assets/sprites/player';
const EXPECTED_IDS = ['yui', 'asa', 'nagi', 'michiru', 'tomori'] as const;

function push(label: string, ok: boolean, detail?: string): void {
  checks.push({ label, ok, detail });
}

function readJson<T>(file: string): T | undefined {
  if (!existsSync(file)) return undefined;
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as T;
  } catch (error) {
    push(`json parseable: ${file}`, false, error instanceof Error ? error.message : String(error));
    return undefined;
  }
}

push(`manifest exists: ${MANIFEST}`, existsSync(MANIFEST));
push(`cell def exists: ${CELLS}`, existsSync(CELLS));

const manifest = readJson<Core5Manifest>(MANIFEST);
const cells = readJson<Core5Cells>(CELLS);

if (manifest) {
  push('manifest productionTouched is false', manifest.productionTouched === false, String(manifest.productionTouched));
  const chars = Array.isArray(manifest.characters) ? manifest.characters : [];
  const ids = chars.map((ch) => ch.id);
  push('manifest has exactly Core5 5 characters', chars.length === EXPECTED_IDS.length, ids.join(', '));
  for (const id of EXPECTED_IDS) {
    push(`manifest includes ${id}`, ids.includes(id), ids.join(', '));
  }

  for (const id of EXPECTED_IDS) {
    const ch = chars.find((candidate) => candidate.id === id);
    if (!ch) continue;

    push(`${id} gameUseStatus is prototype-sheet-only`, ch.gameUseStatus === 'prototype-sheet-only', ch.gameUseStatus);
    push(`${id} masterBoardPath exists`, existsSync(ch.masterBoardPath), ch.masterBoardPath);
    push(`${id} spriteSheetPath exists`, existsSync(ch.spriteSheetPath), ch.spriteSheetPath);
  }
}

if (cells) {
  push('cell def columns=8', cells.columns === 8, String(cells.columns));
  push('cell def rows=6', cells.rows === 6, String(cells.rows));
  push('cell def totalCells=48', cells.totalCells === 48, String(cells.totalCells));
  const cellArr = Array.isArray(cells.cells) ? cells.cells : [];
  push('cell def has 48 entries', cellArr.length === 48, String(cellArr.length));

  const indices = cellArr.map((cell) => cell.index);
  const sorted = [...indices].sort((a, b) => a - b);
  const expected = Array.from({ length: 48 }, (_, i) => i);
  const duplicateIndices = sorted.filter((value, i) => i > 0 && value === sorted[i - 1]);
  push('cell index has no duplicates', duplicateIndices.length === 0, duplicateIndices.join(', '));
  push('cell index covers 0-47', JSON.stringify(sorted) === JSON.stringify(expected), sorted.join(', '));
}

let productionContamination = '';
try {
  const manifestSpriteNames = manifest?.characters
    ?.map((ch) => path.basename(ch.spriteSheetPath))
    .filter(Boolean) ?? [];
  const namePattern = manifestSpriteNames.length > 0
    ? manifestSpriteNames.map((name) => `-name '${name.replace(/'/g, "'\\''")}'`).join(' -o ')
    : '-name __no_core5_sprite_sheets__';
  productionContamination = execSync(
    `find ${PRODUCTION_PLAYER_DIR} -type f \\( -iname '*core5*' -o -iname '*52px-sprite-sheet*' -o ${namePattern} \\) 2>/dev/null`,
    { encoding: 'utf8' },
  ).trim();
} catch {
  productionContamination = '';
}
push('no Core5 prototype sheet in production player sprites', productionContamination === '', productionContamination || undefined);

const failed = checks.filter((check) => !check.ok);
for (const check of checks) {
  const detail = check.detail ? `\n     ${check.detail.replace(/\n/g, '\n     ')}` : '';
  console.log(`${check.ok ? 'ok  ' : 'FAIL'} ${check.label}${detail}`);
}

if (failed.length > 0) {
  console.error(`\ncharacter-assets:verify failed (${failed.length} issue(s))`);
  process.exit(1);
}

console.log(`\ncharacter-assets:verify passed: ${checks.length} checks.`);
