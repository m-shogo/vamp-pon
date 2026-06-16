import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { deflateSync } from 'node:zlib';

type Rgba = [number, number, number, number];
type Character = {
  id: 'yui' | 'asa' | 'nagi' | 'michiru' | 'tomori';
  path: string;
  hood: Rgba;
  hoodDark: Rgba;
  hair: Rgba;
  skin: Rgba;
  cloth: Rgba;
  accent: Rgba;
  light: Rgba;
};

const CELL = 74;
const COLS = 8;
const ROWS = 6;
const WIDTH = CELL * COLS;
const HEIGHT = CELL * ROWS;
const INK: Rgba = [28, 26, 35, 255];
const CLEAR: Rgba = [0, 0, 0, 0];

const characters: Character[] = [
  { id: 'yui', path: 'public/assets/prototypes/sprite-sheets/core5-74px-exact-draft/yui-74px-exact-draft-v1.png', hood: [77,111,154,255], hoodDark: [42,61,98,255], hair: [139,71,52,255], skin: [232,184,147,255], cloth: [202,178,132,255], accent: [148,55,50,255], light: [255,226,123,255] },
  { id: 'asa', path: 'public/assets/prototypes/sprite-sheets/core5-74px-exact-draft/asa-74px-exact-draft-v1.png', hood: [164,134,96,255], hoodDark: [101,76,58,255], hair: [91,66,48,255], skin: [237,190,150,255], cloth: [214,194,151,255], accent: [189,83,58,255], light: [255,210,116,255] },
  { id: 'nagi', path: 'public/assets/prototypes/sprite-sheets/core5-74px-exact-draft/nagi-74px-exact-draft-v1.png', hood: [83,76,126,255], hoodDark: [44,39,75,255], hair: [65,54,79,255], skin: [220,178,153,255], cloth: [165,156,186,255], accent: [107,128,188,255], light: [193,208,255,255] },
  { id: 'michiru', path: 'public/assets/prototypes/sprite-sheets/core5-74px-exact-draft/michiru-74px-exact-draft-v1.png', hood: [82,132,117,255], hoodDark: [44,78,76,255], hair: [112,78,49,255], skin: [232,187,149,255], cloth: [197,188,139,255], accent: [215,158,80,255], light: [230,232,133,255] },
  { id: 'tomori', path: 'public/assets/prototypes/sprite-sheets/core5-74px-exact-draft/tomori-74px-exact-draft-v1.png', hood: [151,91,65,255], hoodDark: [91,54,48,255], hair: [67,53,43,255], skin: [236,185,142,255], cloth: [199,174,128,255], accent: [214,146,70,255], light: [255,184,93,255] }
];

class Canvas {
  data = new Uint8Array(WIDTH * HEIGHT * 4);
  constructor() { this.fill(CLEAR); }
  fill(c: Rgba): void { for (let i = 0; i < WIDTH * HEIGHT; i++) this.pixelByIndex(i, c); }
  pixelByIndex(i: number, c: Rgba): void { const p = i * 4; this.data[p]=c[0]; this.data[p+1]=c[1]; this.data[p+2]=c[2]; this.data[p+3]=c[3]; }
  pixel(x: number, y: number, c: Rgba): void { if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return; this.pixelByIndex(y * WIDTH + x, c); }
  rect(x: number, y: number, w: number, h: number, c: Rgba): void { for (let yy=y; yy<y+h; yy++) for (let xx=x; xx<x+w; xx++) this.pixel(xx, yy, c); }
  circle(cx: number, cy: number, r: number, c: Rgba): void { for (let y=cy-r; y<=cy+r; y++) for (let x=cx-r; x<=cx+r; x++) if ((x-cx)**2 + (y-cy)**2 <= r*r) this.pixel(x,y,c); }
}

function drawCell(canvas: Canvas, ch: Character, index: number): void {
  const cellX = (index % COLS) * CELL;
  const cellY = Math.floor(index / COLS) * CELL;
  const cx = cellX + 37;
  const actionRow = Math.floor(index / 8);
  const variant = index % 8;
  const shiftX = variant % 4 === 1 ? -3 : variant % 4 === 2 ? 3 : 0;
  const stride = actionRow === 1 ? (variant % 2 === 0 ? -2 : 2) : 0;
  const bodyY = cellY + 36 + (actionRow === 4 ? 3 : 0);
  const headY = cellY + 18;

  if (index >= 40) {
    canvas.circle(cx, cellY + 37, 15, [ch.hoodDark[0], ch.hoodDark[1], ch.hoodDark[2], 190]);
    canvas.circle(cx, cellY + 35, 11, ch.accent);
    canvas.rect(cx - 2, cellY + 22, 4, 26, ch.light);
    canvas.rect(cx - 13, cellY + 33, 26, 4, ch.light);
    return;
  }

  if (index === 36) {
    canvas.rect(cellX + 20, cellY + 48, 36, 10, INK);
    canvas.rect(cellX + 25, cellY + 37, 23, 13, ch.hood);
    return;
  }

  canvas.rect(cx - 9 + shiftX, bodyY, 18, 20, INK);
  canvas.rect(cx - 7 + shiftX, bodyY + 1, 14, 17, ch.cloth);
  canvas.rect(cx - 7 + shiftX, bodyY + 15, 14, 5, ch.accent);
  canvas.rect(cx - 7 + shiftX + stride, bodyY + 20, 5, 8, ch.hoodDark);
  canvas.rect(cx + 2 + shiftX - stride, bodyY + 20, 5, 8, ch.hoodDark);

  canvas.rect(cx - 15 + shiftX, headY, 30, 27, INK);
  canvas.rect(cx - 12 + shiftX, headY - 3, 24, 28, ch.hood);
  canvas.rect(cx - 8 + shiftX, headY + 5, 16, 15, ch.skin);
  canvas.rect(cx - 8 + shiftX, headY + 4, 16, 5, ch.hair);
  canvas.rect(cx - 6 + shiftX, headY + 11, 3, 3, INK);
  canvas.rect(cx + 4 + shiftX, headY + 11, 3, 3, INK);

  if (actionRow === 2 || actionRow === 4) {
    canvas.circle(cx + 22, bodyY + 9, actionRow === 4 ? 8 : 6, [ch.light[0], ch.light[1], ch.light[2], 110]);
    canvas.rect(cx + 19, bodyY + 5, 7, 10, INK);
    canvas.rect(cx + 21, bodyY + 8, 3, 4, ch.light);
  }
  if (actionRow === 3) {
    canvas.rect(cx - 7 + shiftX, headY + 11, 5, 2, INK);
    canvas.rect(cx + 3 + shiftX, headY + 11, 5, 2, INK);
  }
}

function crc32(buf: Buffer): number { let crc = 0xffffffff; for (const b of buf) { crc ^= b; for (let i=0;i<8;i++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1)); } return (crc ^ 0xffffffff) >>> 0; }
function u32(n: number): Buffer { const b=Buffer.alloc(4); b.writeUInt32BE(n,0); return b; }
function chunk(type: string, data: Buffer): Buffer { const t=Buffer.from(type,'ascii'); return Buffer.concat([u32(data.length),t,data,u32(crc32(Buffer.concat([t,data])))]); }
function png(canvas: Canvas): Buffer {
  const scan = Buffer.alloc((WIDTH * 4 + 1) * HEIGHT);
  for (let y=0; y<HEIGHT; y++) { const start=y*(WIDTH*4+1); scan[start]=0; Buffer.from(canvas.data.subarray(y*WIDTH*4,(y+1)*WIDTH*4)).copy(scan,start+1); }
  return Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'), chunk('IHDR',Buffer.concat([u32(WIDTH),u32(HEIGHT),Buffer.from([8,6,0,0,0])])), chunk('IDAT',deflateSync(scan,{level:9})), chunk('IEND',Buffer.alloc(0))]);
}

for (const character of characters) {
  const canvas = new Canvas();
  for (let index=0; index<48; index++) drawCell(canvas, character, index);
  mkdirSync(dirname(character.path), { recursive: true });
  writeFileSync(character.path, png(canvas));
  console.log(`wrote generated-draft ${character.path} (${WIDTH}x${HEIGHT})`);
}

console.log('Reference boards were not modified. These outputs remain prototype generated-draft assets.');
