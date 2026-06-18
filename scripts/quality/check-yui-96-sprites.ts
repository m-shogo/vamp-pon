import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { decodePng, pixelOffset, type RgbaImage } from '../prototypes/core5-image/png-rgba.ts';

type CellDef = {
  index: number;
  row: number;
  column: number;
  key: string;
};

type AlphaBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

type ManifestFrame = CellDef & {
  filename: string;
  width: number;
  height: number;
  alphaBounds: AlphaBounds;
  nonTransparentPixels: number;
  touchesCellEdge: boolean;
};

type FrameManifest = {
  source: string;
  sourceWidth: number;
  sourceHeight: number;
  columns: number;
  rows: number;
  cellSizePx: number;
  frameCount: number;
  frames: ManifestFrame[];
};

type SheetSpec = {
  label: string;
  source: string;
  frameDirectory: string;
  cells: CellDef[];
};

type AlphaInspection = {
  alphaBounds: AlphaBounds;
  nonTransparentPixels: number;
  transparentPixels: number;
  alphaMin: number;
  alphaMax: number;
  touchesCellEdge: boolean;
};

const COLUMNS = 8;
const ROWS = 6;
const CELL_SIZE = 180;
const SHEET_WIDTH = COLUMNS * CELL_SIZE;
const SHEET_HEIGHT = ROWS * CELL_SIZE;
const issues: string[] = [];

const expressionRageKeys = [
  'portrait_determined', 'portrait_worried', 'portrait_sad', 'portrait_pained',
  'portrait_afraid', 'portrait_surprised', 'portrait_relieved', 'portrait_exhausted',
  'portrait_tearful_smile', 'portrait_memory_awakened', 'portrait_lantern_focus', 'portrait_protective',
  'cutin_ultimate_normal', 'portrait_ink_invasion', 'portrait_rage_threshold', 'cutin_ultimate_black',
  'rage_charge_25', 'rage_charge_50', 'rage_charge_75', 'rage_threshold_shiver',
  'rage_trigger_crouch', 'rage_transform_peak', 'rage_idle_front_a', 'rage_idle_front_b',
  'rage_walk_front_a', 'rage_walk_front_b', 'rage_walk_left_a', 'rage_walk_left_b',
  'rage_walk_right_a', 'rage_walk_right_b', 'rage_walk_back_a', 'rage_walk_back_b',
  'rage_cast_front', 'rage_cast_left', 'rage_cast_right', 'rage_cast_back',
  'rage_attack_front', 'rage_attack_left', 'rage_attack_right', 'rage_attack_back',
  'rage_hurt', 'rage_recoil', 'rage_ultimate_start', 'rage_ultimate_peak',
  'rage_ultimate_release', 'rage_meter_empty', 'rage_collapse', 'rage_recovery_slow',
] as const;

function issue(label: string, detail: string): void {
  issues.push(`${label}: ${detail}`);
}

function readJson<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T;
  } catch (error) {
    issue(path, error instanceof Error ? error.message : String(error));
    return null;
  }
}

function expectedFilename(cell: CellDef): string {
  return [
    String(cell.index).padStart(2, '0'),
    `r${String(cell.row).padStart(2, '0')}`,
    `c${String(cell.column).padStart(2, '0')}`,
    cell.key,
  ].join('_') + '.png';
}

function inspectAlpha(image: RgbaImage): AlphaInspection {
  let minX = image.width;
  let minY = image.height;
  let maxX = -1;
  let maxY = -1;
  let nonTransparentPixels = 0;
  let transparentPixels = 0;
  let alphaMin = 255;
  let alphaMax = 0;
  let touchesCellEdge = false;

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const alpha = image.data[pixelOffset(image, x, y) + 3];
      alphaMin = Math.min(alphaMin, alpha);
      alphaMax = Math.max(alphaMax, alpha);
      if (alpha === 0) {
        transparentPixels += 1;
        continue;
      }
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
    alphaBounds: maxX < 0 ? null : {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    },
    nonTransparentPixels,
    transparentPixels,
    alphaMin,
    alphaMax,
    touchesCellEdge,
  };
}

function isRgbaPng(buffer: Buffer): boolean {
  return buffer.length > 25 && buffer[24] === 8 && buffer[25] === 6;
}

function sourceCellMatches(source: RgbaImage, frame: RgbaImage, cell: CellDef): boolean {
  const sourceX = (cell.column - 1) * CELL_SIZE;
  const sourceY = (cell.row - 1) * CELL_SIZE;
  for (let y = 0; y < CELL_SIZE; y += 1) {
    const sourceOffset = pixelOffset(source, sourceX, sourceY + y);
    const frameOffset = y * CELL_SIZE * 4;
    for (let byte = 0; byte < CELL_SIZE * 4; byte += 1) {
      if (source.data[sourceOffset + byte] !== frame.data[frameOffset + byte]) return false;
    }
  }
  return true;
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function verifySheet(spec: SheetSpec): void {
  const manifestPath = join(spec.frameDirectory, 'manifest.json');
  if (!existsSync(spec.source)) {
    issue(spec.label, `source missing: ${spec.source}`);
    return;
  }
  if (!existsSync(spec.frameDirectory)) {
    issue(spec.label, `frame directory missing: ${spec.frameDirectory}`);
    return;
  }
  if (!existsSync(manifestPath)) {
    issue(spec.label, `manifest missing: ${manifestPath}`);
    return;
  }

  const sourceBuffer = readFileSync(spec.source);
  if (!isRgbaPng(sourceBuffer)) issue(spec.label, 'source PNG must be 8-bit RGBA color type 6');
  const source = decodePng(sourceBuffer);
  if (source.width !== SHEET_WIDTH || source.height !== SHEET_HEIGHT) {
    issue(spec.label, `source size ${source.width}x${source.height}; expected ${SHEET_WIDTH}x${SHEET_HEIGHT}`);
  }

  const manifest = readJson<FrameManifest>(manifestPath);
  if (!manifest) return;
  if (manifest.source !== spec.source) issue(spec.label, `manifest source mismatch: ${manifest.source}`);
  if (manifest.sourceWidth !== SHEET_WIDTH || manifest.sourceHeight !== SHEET_HEIGHT) {
    issue(spec.label, 'manifest source dimensions are not 1440x1080');
  }
  if (manifest.columns !== COLUMNS || manifest.rows !== ROWS || manifest.cellSizePx !== CELL_SIZE) {
    issue(spec.label, 'manifest grid is not 8x6 with 180px cells');
  }
  if (manifest.frameCount !== 48 || manifest.frames.length !== 48 || spec.cells.length !== 48) {
    issue(spec.label, `frame count mismatch: manifest=${manifest.frameCount}/${manifest.frames.length}, expected=${spec.cells.length}`);
  }

  const expectedFiles = spec.cells.map(expectedFilename).sort();
  const actualFiles = readdirSync(spec.frameDirectory).filter((name) => name.endsWith('.png')).sort();
  if (!sameJson(actualFiles, expectedFiles)) {
    const missing = expectedFiles.filter((name) => !actualFiles.includes(name));
    const extra = actualFiles.filter((name) => !expectedFiles.includes(name));
    issue(spec.label, `filename set mismatch; missing=[${missing.join(', ')}] extra=[${extra.join(', ')}]`);
  }

  for (const cell of spec.cells) {
    const filename = expectedFilename(cell);
    const framePath = join(spec.frameDirectory, filename);
    const manifestFrame = manifest.frames[cell.index];

    if (!manifestFrame) {
      issue(`${spec.label} ${filename}`, 'manifest entry missing');
      continue;
    }
    if (
      manifestFrame.index !== cell.index ||
      manifestFrame.row !== cell.row ||
      manifestFrame.column !== cell.column ||
      manifestFrame.key !== cell.key ||
      manifestFrame.filename !== filename
    ) {
      issue(`${spec.label} ${filename}`, 'manifest identity fields do not match the expected cell');
    }
    if (!existsSync(framePath)) continue;

    const frameBuffer = readFileSync(framePath);
    if (!isRgbaPng(frameBuffer)) issue(`${spec.label} ${filename}`, 'PNG must be 8-bit RGBA color type 6');
    const frame = decodePng(frameBuffer);
    if (frame.width !== CELL_SIZE || frame.height !== CELL_SIZE) {
      issue(`${spec.label} ${filename}`, `size ${frame.width}x${frame.height}; expected 180x180`);
      continue;
    }

    const alpha = inspectAlpha(frame);
    if (alpha.nonTransparentPixels === 0) issue(`${spec.label} ${filename}`, 'frame is empty');
    if (alpha.transparentPixels === 0 || alpha.alphaMin !== 0) issue(`${spec.label} ${filename}`, 'frame has no real transparent pixels');
    if (alpha.alphaMax !== 255) issue(`${spec.label} ${filename}`, `alpha max is ${alpha.alphaMax}; expected 255`);
    if (alpha.touchesCellEdge) issue(`${spec.label} ${filename}`, 'opaque content touches a cell edge');
    if (!sourceCellMatches(source, frame, cell)) issue(`${spec.label} ${filename}`, 'frame pixels differ from the source sheet cell');

    if (manifestFrame.width !== CELL_SIZE || manifestFrame.height !== CELL_SIZE) {
      issue(`${spec.label} ${filename}`, 'manifest frame dimensions are not 180x180');
    }
    if (!sameJson(manifestFrame.alphaBounds, alpha.alphaBounds)) {
      issue(`${spec.label} ${filename}`, 'manifest alphaBounds are stale');
    }
    if (manifestFrame.nonTransparentPixels !== alpha.nonTransparentPixels) {
      issue(`${spec.label} ${filename}`, 'manifest nonTransparentPixels is stale');
    }
    if (manifestFrame.touchesCellEdge !== alpha.touchesCellEdge) {
      issue(`${spec.label} ${filename}`, 'manifest touchesCellEdge is stale');
    }
  }
}

const core5Definition = readJson<{ cells: CellDef[] }>('data/character-assets/core5-52px-sprite-sheet-cells.json');
const expressionCells: CellDef[] = expressionRageKeys.map((key, index) => ({
  index,
  row: Math.floor(index / COLUMNS) + 1,
  column: (index % COLUMNS) + 1,
  key,
}));

if (core5Definition) {
  verifySheet({
    label: 'yui basic 48',
    source: 'public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png',
    frameDirectory: 'public/assets/prototypes/sprite-sheets/core5-original-frames/yui',
    cells: core5Definition.cells,
  });
}

verifySheet({
  label: 'yui expression-rage 48',
  source: 'public/assets/prototypes/sprite-sheets/yui-expression-rage-original/yui-expression-rage-48-v1.png',
  frameDirectory: 'public/assets/prototypes/sprite-sheets/yui-expression-rage-original-frames/yui',
  cells: expressionCells,
});

if (issues.length > 0) {
  for (const item of issues) console.error(`FAIL ${item}`);
  console.error(`\nyui96:sprites:verify failed (${issues.length} issue(s))`);
  process.exit(1);
}

console.log('yui96:sprites:verify passed: 96 RGBA cells, exact filenames, manifests, alpha, bounds, and source pixels.');
