import { existsSync, readFileSync } from 'node:fs';
import { decodePng, pixelOffset, type RgbaImage } from '../prototypes/core5-image/png-rgba.ts';

type EnemyTier = 'grunt' | 'midboss' | 'boss' | 'boss_form';

type EnemyCell = {
  displayNo: number;
  index: number;
  row: number;
  column: number;
  id: string;
  workingName: string;
  tier: EnemyTier;
  stage: number;
  formOf: string | null;
  visualRole: string;
};

type EnemySheetManifest = {
  canvas: {
    widthPx: number;
    heightPx: number;
    colorMode: string;
    backgroundAlpha: number;
  };
  grid: {
    columns: number;
    rows: number;
    cellWidthPx: number;
    cellHeightPx: number;
    totalCells: number;
  };
  distribution: {
    grunt: number;
    midboss: number;
    boss: number;
    bossForm: number;
  };
  cells: EnemyCell[];
};

type PngHeader = {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
};

type CellInspection = {
  id: string;
  displayNo: number;
  nonTransparentPixels: number;
  transparentPixels: number;
  borderAlphaPixels: number;
  alphaBounds: { x: number; y: number; width: number; height: number } | null;
};

const MANIFEST_PATH = 'data/enemy-assets/enemy-48-sprite-sheet-cells.json';
const DEFAULT_SOURCE_PATH =
  'assets/reference/enemies/enemy-48-sheet/enemy-48-sprite-sheet-v1.png';
const EXPECTED_WIDTH = 1440;
const EXPECTED_HEIGHT = 1080;
const EXPECTED_COLUMNS = 8;
const EXPECTED_ROWS = 6;
const EXPECTED_CELL_SIZE = 180;
const EXPECTED_CELL_COUNT = 48;
const SAFE_BORDER_PX = 4;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function readPngHeader(buffer: Buffer): PngHeader {
  assert(
    buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a',
    'Source is not a PNG file',
  );

  let offset = 8;
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const dataStart = offset + 8;
    if (type === 'IHDR') {
      assert(length === 13, `Invalid IHDR length: ${length}`);
      return {
        width: buffer.readUInt32BE(dataStart),
        height: buffer.readUInt32BE(dataStart + 4),
        bitDepth: buffer[dataStart + 8],
        colorType: buffer[dataStart + 9],
      };
    }
    offset += length + 12;
  }

  throw new Error('PNG has no IHDR chunk');
}

function validateManifest(manifest: EnemySheetManifest): EnemyCell[] {
  assert(manifest.canvas.widthPx === EXPECTED_WIDTH, 'Manifest canvas width must be 1440');
  assert(manifest.canvas.heightPx === EXPECTED_HEIGHT, 'Manifest canvas height must be 1080');
  assert(manifest.canvas.colorMode === 'RGBA', 'Manifest color mode must be RGBA');
  assert(manifest.canvas.backgroundAlpha === 0, 'Manifest background alpha must be 0');

  assert(manifest.grid.columns === EXPECTED_COLUMNS, 'Manifest grid must have 8 columns');
  assert(manifest.grid.rows === EXPECTED_ROWS, 'Manifest grid must have 6 rows');
  assert(manifest.grid.cellWidthPx === EXPECTED_CELL_SIZE, 'Manifest cell width must be 180');
  assert(manifest.grid.cellHeightPx === EXPECTED_CELL_SIZE, 'Manifest cell height must be 180');
  assert(manifest.grid.totalCells === EXPECTED_CELL_COUNT, 'Manifest must define 48 cells');

  assert(manifest.distribution.grunt === 25, 'Manifest must define 25 grunt cells');
  assert(manifest.distribution.midboss === 10, 'Manifest must define 10 midboss cells');
  assert(manifest.distribution.boss === 3, 'Manifest must define 3 boss cells');
  assert(manifest.distribution.bossForm === 10, 'Manifest must define 10 boss-form cells');

  const cells = [...manifest.cells].sort((a, b) => a.index - b.index);
  assert(cells.length === EXPECTED_CELL_COUNT, `Expected 48 cell records, got ${cells.length}`);

  const ids = new Set<string>();
  const positions = new Set<string>();
  const tierCounts: Record<EnemyTier, number> = {
    grunt: 0,
    midboss: 0,
    boss: 0,
    boss_form: 0,
  };

  cells.forEach((cell, expectedIndex) => {
    const expectedRow = Math.floor(expectedIndex / EXPECTED_COLUMNS) + 1;
    const expectedColumn = (expectedIndex % EXPECTED_COLUMNS) + 1;

    assert(cell.index === expectedIndex, `Missing or duplicated index ${expectedIndex}`);
    assert(cell.displayNo === expectedIndex + 1, `Invalid displayNo at index ${expectedIndex}`);
    assert(cell.row === expectedRow, `Invalid row for ${cell.id}: expected ${expectedRow}`);
    assert(
      cell.column === expectedColumn,
      `Invalid column for ${cell.id}: expected ${expectedColumn}`,
    );
    assert(!ids.has(cell.id), `Duplicated enemy id: ${cell.id}`);

    const position = `${cell.row}:${cell.column}`;
    assert(!positions.has(position), `Duplicated cell position: ${position}`);

    ids.add(cell.id);
    positions.add(position);
    tierCounts[cell.tier] += 1;
  });

  assert(tierCounts.grunt === 25, `Expected 25 grunts, got ${tierCounts.grunt}`);
  assert(tierCounts.midboss === 10, `Expected 10 midbosses, got ${tierCounts.midboss}`);
  assert(tierCounts.boss === 3, `Expected 3 bosses, got ${tierCounts.boss}`);
  assert(tierCounts.boss_form === 10, `Expected 10 boss forms, got ${tierCounts.boss_form}`);

  const bossIds = new Set(cells.filter((cell) => cell.tier === 'boss').map((cell) => cell.id));
  for (const cell of cells.filter((entry) => entry.tier === 'boss_form')) {
    assert(cell.formOf !== null, `${cell.id} must define formOf`);
    assert(bossIds.has(cell.formOf), `${cell.id} references unknown boss ${cell.formOf}`);
  }

  return cells;
}

function inspectCell(image: RgbaImage, cell: EnemyCell): CellInspection {
  const startX = (cell.column - 1) * EXPECTED_CELL_SIZE;
  const startY = (cell.row - 1) * EXPECTED_CELL_SIZE;
  let minX = EXPECTED_CELL_SIZE;
  let minY = EXPECTED_CELL_SIZE;
  let maxX = -1;
  let maxY = -1;
  let nonTransparentPixels = 0;
  let transparentPixels = 0;
  let borderAlphaPixels = 0;

  for (let localY = 0; localY < EXPECTED_CELL_SIZE; localY += 1) {
    for (let localX = 0; localX < EXPECTED_CELL_SIZE; localX += 1) {
      const alpha = image.data[pixelOffset(image, startX + localX, startY + localY) + 3];
      if (alpha === 0) {
        transparentPixels += 1;
        continue;
      }

      nonTransparentPixels += 1;
      minX = Math.min(minX, localX);
      minY = Math.min(minY, localY);
      maxX = Math.max(maxX, localX);
      maxY = Math.max(maxY, localY);

      const isInsideForbiddenBorder =
        localX < SAFE_BORDER_PX ||
        localY < SAFE_BORDER_PX ||
        localX >= EXPECTED_CELL_SIZE - SAFE_BORDER_PX ||
        localY >= EXPECTED_CELL_SIZE - SAFE_BORDER_PX;
      if (isInsideForbiddenBorder) borderAlphaPixels += 1;
    }
  }

  return {
    id: cell.id,
    displayNo: cell.displayNo,
    nonTransparentPixels,
    transparentPixels,
    borderAlphaPixels,
    alphaBounds:
      maxX < 0
        ? null
        : {
            x: minX,
            y: minY,
            width: maxX - minX + 1,
            height: maxY - minY + 1,
          },
  };
}

const args = process.argv.slice(2);
const manifestOnly = args.includes('--manifest-only');
const sourcePath = args.find((arg) => !arg.startsWith('--')) ?? DEFAULT_SOURCE_PATH;
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as EnemySheetManifest;
const cells = validateManifest(manifest);

console.log('enemy48 manifest: ok');
console.log('distribution: grunt=25 midboss=10 boss=3 bossForm=10');
console.log('grid: 8x6 / 48 cells / 180x180 per cell');

if (manifestOnly) {
  console.log('image validation: skipped (--manifest-only)');
  process.exit(0);
}

assert(existsSync(sourcePath), `Enemy sheet not found: ${sourcePath}`);
const sourceBuffer = readFileSync(sourcePath);
const header = readPngHeader(sourceBuffer);

assert(
  header.width === EXPECTED_WIDTH && header.height === EXPECTED_HEIGHT,
  `Expected ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT}, got ${header.width}x${header.height}`,
);
assert(header.bitDepth === 8, `Expected 8-bit PNG, got ${header.bitDepth}-bit`);
assert(header.colorType === 6, `Expected true RGBA PNG color type 6, got ${header.colorType}`);

const image = decodePng(sourceBuffer);
const inspections = cells.map((cell) => inspectCell(image, cell));
const emptyCells = inspections.filter((cell) => cell.nonTransparentPixels === 0);
const noTransparentBackground = inspections.filter((cell) => cell.transparentPixels === 0);
const borderViolations = inspections.filter((cell) => cell.borderAlphaPixels > 0);

assert(
  emptyCells.length === 0,
  `Empty cells: ${emptyCells.map((cell) => String(cell.displayNo).padStart(2, '0')).join(', ')}`,
);
assert(
  noTransparentBackground.length === 0,
  `Cells without transparent background: ${noTransparentBackground
    .map((cell) => String(cell.displayNo).padStart(2, '0'))
    .join(', ')}`,
);
assert(
  borderViolations.length === 0,
  `Cell overflow/safety-border violations: ${borderViolations
    .map((cell) => `${String(cell.displayNo).padStart(2, '0')}:${cell.id}`)
    .join(', ')}`,
);

console.log(`canvas: ${header.width}x${header.height}`);
console.log('mode: RGBA (PNG color type 6)');
console.log(`background alpha: 0 (transparent pixels and ${SAFE_BORDER_PX}px safety borders verified)`);
console.log(`detected non-empty cells: ${inspections.length - emptyCells.length}/48`);
console.log('cell overflow: 0');
console.log('cross-cell alpha connection: 0');
console.log(`enemy48 sprite sheet: ok (${sourcePath})`);
