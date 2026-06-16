import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import {
  blankImage,
  decodePng,
  encodePng,
  pixelOffset,
  type RgbaImage,
} from './core5-image/png-rgba.ts';

type CellDefinition = {
  index: number;
  row: number;
  column: number;
  key: string;
  description: string;
};

type CellDefinitions = {
  columns: number;
  rows: number;
  totalCells: number;
  cells: CellDefinition[];
};

type AlphaBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

const SOURCE_DIRECTORY = 'public/assets/prototypes/sprite-sheets/core5-original';
const OUTPUT_DIRECTORY = 'public/assets/prototypes/sprite-sheets/core5-original-frames';
const CELL_DEFINITIONS_PATH = 'data/character-assets/core5-52px-sprite-sheet-cells.json';
const COLUMNS = 8;
const ROWS = 6;
const CELL_SIZE = 180;
const SHEET_WIDTH = COLUMNS * CELL_SIZE;
const SHEET_HEIGHT = ROWS * CELL_SIZE;
const EXPECTED_CHARACTERS = ['asa', 'michiru', 'nagi', 'tomori', 'yui'];

function extractCell(source: RgbaImage, column: number, row: number): RgbaImage {
  const output = blankImage(CELL_SIZE, CELL_SIZE);
  const sourceX = column * CELL_SIZE;
  const sourceY = row * CELL_SIZE;

  for (let y = 0; y < CELL_SIZE; y += 1) {
    const sourceOffset = pixelOffset(source, sourceX, sourceY + y);
    const destinationOffset = y * CELL_SIZE * 4;
    output.data.set(
      source.data.subarray(sourceOffset, sourceOffset + CELL_SIZE * 4),
      destinationOffset,
    );
  }

  return output;
}

function inspectAlpha(image: RgbaImage): {
  alphaBounds: AlphaBounds;
  nonTransparentPixels: number;
  touchesCellEdge: boolean;
} {
  let minX = image.width;
  let minY = image.height;
  let maxX = -1;
  let maxY = -1;
  let nonTransparentPixels = 0;
  let touchesCellEdge = false;

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const alpha = image.data[pixelOffset(image, x, y) + 3];
      if (alpha === 0) continue;
      nonTransparentPixels += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      if (x === 0 || y === 0 || x === image.width - 1 || y === image.height - 1) {
        touchesCellEdge = true;
      }
    }
  }

  return {
    alphaBounds: maxX < 0
      ? null
      : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 },
    nonTransparentPixels,
    touchesCellEdge,
  };
}

function validateDefinitions(definitions: CellDefinitions): CellDefinition[] {
  if (
    definitions.columns !== COLUMNS ||
    definitions.rows !== ROWS ||
    definitions.totalCells !== COLUMNS * ROWS
  ) {
    throw new Error('Core5 cell definition must be 8 columns x 6 rows x 48 cells');
  }

  const cells = [...definitions.cells].sort((a, b) => a.index - b.index);
  if (cells.length !== COLUMNS * ROWS) throw new Error(`Expected 48 cell definitions, got ${cells.length}`);

  cells.forEach((cell, expectedIndex) => {
    if (cell.index !== expectedIndex) throw new Error(`Missing or duplicated cell index: ${expectedIndex}`);
    if (cell.row !== Math.floor(cell.index / COLUMNS) + 1) throw new Error(`Invalid row for cell ${cell.index}`);
    if (cell.column !== (cell.index % COLUMNS) + 1) throw new Error(`Invalid column for cell ${cell.index}`);
  });

  return cells;
}

const definitions = JSON.parse(readFileSync(CELL_DEFINITIONS_PATH, 'utf8')) as CellDefinitions;
const cells = validateDefinitions(definitions);
const sourceFiles = readdirSync(SOURCE_DIRECTORY)
  .filter((filename) => filename.endsWith('-sprite-sheet-v1.png'))
  .sort();

const actualCharacters = sourceFiles.map((filename) => filename.replace(/-sprite-sheet-v1\.png$/, ''));
if (JSON.stringify(actualCharacters) !== JSON.stringify(EXPECTED_CHARACTERS)) {
  throw new Error(
    `Expected source characters ${EXPECTED_CHARACTERS.join(', ')}, got ${actualCharacters.join(', ')}`,
  );
}

rmSync(OUTPUT_DIRECTORY, { recursive: true, force: true });
mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

const rootManifest: Array<Record<string, unknown>> = [];
let writtenCount = 0;

for (const sourceFilename of sourceFiles) {
  const characterId = sourceFilename.replace(/-sprite-sheet-v1\.png$/, '');
  const sourcePath = join(SOURCE_DIRECTORY, sourceFilename);
  const source = decodePng(readFileSync(sourcePath));

  if (source.width !== SHEET_WIDTH || source.height !== SHEET_HEIGHT) {
    throw new Error(
      `${characterId}: expected ${SHEET_WIDTH}x${SHEET_HEIGHT}, got ${source.width}x${source.height}`,
    );
  }

  const characterDirectory = join(OUTPUT_DIRECTORY, characterId);
  mkdirSync(characterDirectory, { recursive: true });
  const frameManifest: Array<Record<string, unknown>> = [];

  for (const cell of cells) {
    const frame = extractCell(source, cell.column - 1, cell.row - 1);
    const filename = [
      String(cell.index).padStart(2, '0'),
      `r${String(cell.row).padStart(2, '0')}`,
      `c${String(cell.column).padStart(2, '0')}`,
      cell.key,
    ].join('_') + '.png';
    const outputPath = join(characterDirectory, filename);
    const alpha = inspectAlpha(frame);

    writeFileSync(outputPath, encodePng(frame));
    writtenCount += 1;
    frameManifest.push({
      index: cell.index,
      row: cell.row,
      column: cell.column,
      key: cell.key,
      description: cell.description,
      filename,
      width: CELL_SIZE,
      height: CELL_SIZE,
      ...alpha,
    });
  }

  const characterManifest = {
    characterId,
    source: sourcePath,
    sourceWidth: source.width,
    sourceHeight: source.height,
    columns: COLUMNS,
    rows: ROWS,
    cellSizePx: CELL_SIZE,
    frameCount: frameManifest.length,
    frames: frameManifest,
  };
  writeFileSync(
    join(characterDirectory, 'manifest.json'),
    `${JSON.stringify(characterManifest, null, 2)}\n`,
  );
  rootManifest.push(characterManifest);
  console.log(`sliced ${characterId}: ${frameManifest.length} frames`);
}

writeFileSync(
  join(OUTPUT_DIRECTORY, 'manifest.json'),
  `${JSON.stringify({
    status: 'prototype-original-sliced',
    sourceDirectory: SOURCE_DIRECTORY,
    outputDirectory: OUTPUT_DIRECTORY,
    sheetSize: { width: SHEET_WIDTH, height: SHEET_HEIGHT },
    grid: { columns: COLUMNS, rows: ROWS, cellSizePx: CELL_SIZE },
    characterCount: rootManifest.length,
    frameCount: writtenCount,
    characters: rootManifest,
  }, null, 2)}\n`,
);

if (writtenCount !== EXPECTED_CHARACTERS.length * COLUMNS * ROWS) {
  throw new Error(`Expected 240 frames, wrote ${writtenCount}`);
}

console.log(`wrote ${writtenCount} unchanged 180x180 PNG frames to ${OUTPUT_DIRECTORY}`);
