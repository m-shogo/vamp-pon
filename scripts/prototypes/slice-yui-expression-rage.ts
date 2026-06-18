import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  blankImage,
  decodePng,
  encodePng,
  pixelOffset,
  type RgbaImage,
} from './core5-image/png-rgba.ts';

const SOURCE_PATH =
  'public/assets/prototypes/sprite-sheets/yui-expression-rage-original/yui-expression-rage-48-v1.png';
const OUTPUT_DIRECTORY =
  'public/assets/prototypes/sprite-sheets/yui-expression-rage-original-frames/yui';
const COLUMNS = 8;
const ROWS = 6;
const CELL_SIZE = 180;
const SHEET_WIDTH = COLUMNS * CELL_SIZE;
const SHEET_HEIGHT = ROWS * CELL_SIZE;

const CELL_KEYS: string[] = [
  // row 1
  'portrait_determined', 'portrait_worried', 'portrait_sad', 'portrait_pained',
  'portrait_afraid', 'portrait_surprised', 'portrait_relieved', 'portrait_exhausted',
  // row 2
  'portrait_tearful_smile', 'portrait_memory_awakened', 'portrait_lantern_focus', 'portrait_protective',
  'cutin_ultimate_normal', 'portrait_ink_invasion', 'portrait_rage_threshold', 'cutin_ultimate_black',
  // row 3
  'rage_charge_25', 'rage_charge_50', 'rage_charge_75', 'rage_threshold_shiver',
  'rage_trigger_crouch', 'rage_transform_peak', 'rage_idle_front_a', 'rage_idle_front_b',
  // row 4
  'rage_walk_front_a', 'rage_walk_front_b', 'rage_walk_left_a', 'rage_walk_left_b',
  'rage_walk_right_a', 'rage_walk_right_b', 'rage_walk_back_a', 'rage_walk_back_b',
  // row 5
  'rage_cast_front', 'rage_cast_left', 'rage_cast_right', 'rage_cast_back',
  'rage_attack_front', 'rage_attack_left', 'rage_attack_right', 'rage_attack_back',
  // row 6
  'rage_hurt', 'rage_recoil', 'rage_ultimate_start', 'rage_ultimate_peak',
  'rage_ultimate_release', 'rage_meter_empty', 'rage_collapse', 'rage_recovery_slow',
];

function extractCell(source: RgbaImage, column: number, row: number): RgbaImage {
  const output = blankImage(CELL_SIZE, CELL_SIZE);
  const sourceX = column * CELL_SIZE;
  const sourceY = row * CELL_SIZE;
  for (let y = 0; y < CELL_SIZE; y += 1) {
    const srcOff = pixelOffset(source, sourceX, sourceY + y);
    const dstOff = y * CELL_SIZE * 4;
    output.data.set(source.data.subarray(srcOff, srcOff + CELL_SIZE * 4), dstOff);
  }
  return output;
}

function inspectAlpha(image: RgbaImage) {
  let minX = image.width, minY = image.height, maxX = -1, maxY = -1;
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
    alphaBounds: maxX < 0 ? null : { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 },
    nonTransparentPixels,
    touchesCellEdge,
  };
}

const source = decodePng(readFileSync(SOURCE_PATH));
if (source.width !== SHEET_WIDTH || source.height !== SHEET_HEIGHT) {
  throw new Error(`Expected ${SHEET_WIDTH}x${SHEET_HEIGHT}, got ${source.width}x${source.height}`);
}

mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

const frames: Array<Record<string, unknown>> = [];
let written = 0;

for (let i = 0; i < CELL_KEYS.length; i += 1) {
  const row = Math.floor(i / COLUMNS) + 1;
  const col = (i % COLUMNS) + 1;
  const key = CELL_KEYS[i];
  const frame = extractCell(source, col - 1, row - 1);
  const filename = [
    String(i).padStart(2, '0'),
    `r${String(row).padStart(2, '0')}`,
    `c${String(col).padStart(2, '0')}`,
    key,
  ].join('_') + '.png';
  const alpha = inspectAlpha(frame);
  writeFileSync(join(OUTPUT_DIRECTORY, filename), encodePng(frame));
  written += 1;
  frames.push({
    index: i,
    row,
    column: col,
    key,
    filename,
    width: CELL_SIZE,
    height: CELL_SIZE,
    ...alpha,
  });
}

const manifest = {
  characterId: 'yui',
  sheetType: 'expression-rage',
  source: SOURCE_PATH,
  sourceWidth: source.width,
  sourceHeight: source.height,
  columns: COLUMNS,
  rows: ROWS,
  cellSizePx: CELL_SIZE,
  frameCount: frames.length,
  frames,
};

writeFileSync(
  join(OUTPUT_DIRECTORY, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`sliced yui expression-rage: ${written} frames`);
console.log(`manifest written to ${join(OUTPUT_DIRECTORY, 'manifest.json')}`);

const edgeContact = frames.filter((f) => f.touchesCellEdge);
if (edgeContact.length > 0) {
  console.warn(`WARNING: ${edgeContact.length} frames touch cell edge: ${edgeContact.map((f) => f.key).join(', ')}`);
}
const empty = frames.filter((f) => f.nonTransparentPixels === 0);
if (empty.length > 0) {
  console.warn(`WARNING: ${empty.length} empty frames: ${empty.map((f) => f.key).join(', ')}`);
}
