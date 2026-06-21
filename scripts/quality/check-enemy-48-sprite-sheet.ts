import { existsSync, readFileSync } from 'node:fs';
import { decodePng, pixelOffset, type RgbaImage } from '../prototypes/core5-image/png-rgba.ts';
import { validateEnemy48Design } from './check-enemy-48-design.ts';

const DEFAULT_SOURCE = 'assets/reference/enemies/enemy-48-sheet/enemy-48-sprite-sheet-v1.png';
const W = 1440, H = 1080, CELL = 180;

function ok(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}
function header(buffer: Buffer) {
  ok(buffer.subarray(0,8).toString('hex') === '89504e470d0a1a0a', 'not PNG');
  let offset = 8;
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    if (type === 'IHDR') {
      const p = offset + 8;
      return { width: buffer.readUInt32BE(p), height: buffer.readUInt32BE(p+4), bitDepth: buffer[p+8], colorType: buffer[p+9] };
    }
    offset += length + 12;
  }
  throw new Error('PNG has no IHDR');
}
function inspect(image: RgbaImage, row: number, column: number, safe: number) {
  let filled = 0, transparent = 0, border = 0;
  const sx = (column-1)*CELL, sy = (row-1)*CELL;
  for (let y=0; y<CELL; y+=1) for (let x=0; x<CELL; x+=1) {
    const alpha = image.data[pixelOffset(image,sx+x,sy+y)+3];
    if (alpha === 0) transparent += 1;
    else {
      filled += 1;
      if (x<safe || y<safe || x>=CELL-safe || y>=CELL-safe) border += 1;
    }
  }
  return { filled, transparent, border };
}

const { manifest, cells } = validateEnemy48Design();
const args = process.argv.slice(2);
const manifestOnly = args.includes('--manifest-only');
const source = args.find((arg) => !arg.startsWith('--')) ?? DEFAULT_SOURCE;

console.log('enemy48 manifest: ok');
console.log('grid: 8x6 / 48 cells / 180x180');
if (manifestOnly) {
  console.log('image validation: skipped (--manifest-only)');
  process.exit(0);
}

ok(existsSync(source), `enemy sheet not found: ${source}`);
const buffer = readFileSync(source);
const png = header(buffer);
ok(png.width === W && png.height === H, `expected ${W}x${H}, got ${png.width}x${png.height}`);
ok(png.bitDepth === 8 && png.colorType === 6, 'expected 8-bit true RGBA PNG color type 6');
const image = decodePng(buffer);
const results = cells.map((cell) => ({ cell, ...inspect(image,cell.row,cell.column,manifest.grid.safeBorder) }));
const empty = results.filter((r) => r.filled === 0);
const opaque = results.filter((r) => r.transparent === 0);
const overflow = results.filter((r) => r.border > 0);
ok(empty.length === 0, `empty cells: ${empty.map((r) => r.cell.no).join(',')}`);
ok(opaque.length === 0, `no transparent background: ${opaque.map((r) => r.cell.no).join(',')}`);
ok(overflow.length === 0, `safe-border violations: ${overflow.map((r) => `${r.cell.no}:${r.cell.id}`).join(',')}`);
console.log(`canvas: ${png.width}x${png.height}`);
console.log('mode: RGBA / background alpha 0');
console.log('detected non-empty cells: 48/48');
console.log('cell overflow: 0');
console.log(`enemy48 sprite sheet: ok (${source})`);
