import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { deflateSync } from 'node:zlib';

type Rgba = [number, number, number, number];
type CharacterId = 'yui' | 'asa' | 'nagi' | 'michiru' | 'tomori';
type CharacterPalette = {
  id: CharacterId;
  path: string;
  hood: Rgba;
  hoodDark: Rgba;
  hair: Rgba;
  skin: Rgba;
  cheek: Rgba;
  cloth: Rgba;
  clothDark: Rgba;
  accent: Rgba;
  light: Rgba;
  shadow: Rgba;
};

type Pose = {
  key: string;
  direction: 'front' | 'left' | 'right' | 'back';
  action: 'idle' | 'ready' | 'walk' | 'cast' | 'attack' | 'hurt' | 'recoil' | 'special' | 'pickup' | 'interact' | 'downed' | 'rest' | 'happy' | 'surprised' | 'portrait' | 'icon';
  alt?: number;
};

const CELL = 74;
const COLUMNS = 8;
const ROWS = 6;
const WIDTH = CELL * COLUMNS;
const HEIGHT = CELL * ROWS;
const TRANSPARENT: Rgba = [0, 0, 0, 0];
const INK: Rgba = [28, 26, 35, 255];
const WHITE: Rgba = [242, 235, 210, 255];
const BLACK_GLOW: Rgba = [38, 31, 54, 190];

const poses: Pose[] = [
  { key: 'idle_front', direction: 'front', action: 'idle' },
  { key: 'idle_front_blink', direction: 'front', action: 'idle', alt: 1 },
  { key: 'idle_left', direction: 'left', action: 'idle' },
  { key: 'idle_right', direction: 'right', action: 'idle' },
  { key: 'idle_back', direction: 'back', action: 'idle' },
  { key: 'ready_front', direction: 'front', action: 'ready' },
  { key: 'ready_left', direction: 'left', action: 'ready' },
  { key: 'ready_right', direction: 'right', action: 'ready' },

  { key: 'walk_front_a', direction: 'front', action: 'walk', alt: 0 },
  { key: 'walk_front_b', direction: 'front', action: 'walk', alt: 1 },
  { key: 'walk_left_a', direction: 'left', action: 'walk', alt: 0 },
  { key: 'walk_left_b', direction: 'left', action: 'walk', alt: 1 },
  { key: 'walk_right_a', direction: 'right', action: 'walk', alt: 0 },
  { key: 'walk_right_b', direction: 'right', action: 'walk', alt: 1 },
  { key: 'walk_back_a', direction: 'back', action: 'walk', alt: 0 },
  { key: 'walk_back_b', direction: 'back', action: 'walk', alt: 1 },

  { key: 'cast_front', direction: 'front', action: 'cast' },
  { key: 'cast_left', direction: 'left', action: 'cast' },
  { key: 'cast_right', direction: 'right', action: 'cast' },
  { key: 'cast_back', direction: 'back', action: 'cast' },
  { key: 'attack_front', direction: 'front', action: 'attack' },
  { key: 'attack_left', direction: 'left', action: 'attack' },
  { key: 'attack_right', direction: 'right', action: 'attack' },
  { key: 'attack_back', direction: 'back', action: 'attack' },

  { key: 'hurt_front', direction: 'front', action: 'hurt' },
  { key: 'hurt_left', direction: 'left', action: 'hurt' },
  { key: 'hurt_right', direction: 'right', action: 'hurt' },
  { key: 'hurt_back', direction: 'back', action: 'hurt' },
  { key: 'recoil_front', direction: 'front', action: 'recoil' },
  { key: 'recoil_left', direction: 'left', action: 'recoil' },
  { key: 'recoil_right', direction: 'right', action: 'recoil' },
  { key: 'recoil_back', direction: 'back', action: 'recoil' },

  { key: 'special_normal', direction: 'front', action: 'special' },
  { key: 'special_black', direction: 'front', action: 'special', alt: 1 },
  { key: 'pickup', direction: 'front', action: 'pickup' },
  { key: 'interact', direction: 'front', action: 'interact' },
  { key: 'downed', direction: 'front', action: 'downed' },
  { key: 'rest', direction: 'front', action: 'rest' },
  { key: 'emote_happy', direction: 'front', action: 'happy' },
  { key: 'emote_surprised', direction: 'front', action: 'surprised' },

  { key: 'portrait_neutral', direction: 'front', action: 'portrait' },
  { key: 'portrait_alt', direction: 'front', action: 'portrait', alt: 1 },
  { key: 'vessel_icon', direction: 'front', action: 'icon', alt: 0 },
  { key: 'secondary_item_icon', direction: 'front', action: 'icon', alt: 1 },
  { key: 'crest_normal', direction: 'front', action: 'icon', alt: 2 },
  { key: 'crest_black', direction: 'front', action: 'icon', alt: 3 },
  { key: 'memory_item_icon', direction: 'front', action: 'icon', alt: 4 },
  { key: 'effect_icon', direction: 'front', action: 'icon', alt: 5 },
];

const characters: CharacterPalette[] = [
  {
    id: 'yui',
    path: 'public/assets/prototypes/sprite-sheets/core5-52px/yui-52px-sprite-sheet-v1.png',
    hood: [77, 111, 154, 255],
    hoodDark: [42, 61, 98, 255],
    hair: [139, 71, 52, 255],
    skin: [232, 184, 147, 255],
    cheek: [226, 110, 115, 255],
    cloth: [202, 178, 132, 255],
    clothDark: [134, 91, 77, 255],
    accent: [148, 55, 50, 255],
    light: [255, 226, 123, 255],
    shadow: [29, 35, 57, 210],
  },
  {
    id: 'asa',
    path: 'public/assets/prototypes/sprite-sheets/core5-52px/asa-52px-sprite-sheet-v1.png',
    hood: [164, 134, 96, 255],
    hoodDark: [101, 76, 58, 255],
    hair: [91, 66, 48, 255],
    skin: [237, 190, 150, 255],
    cheek: [222, 113, 104, 255],
    cloth: [214, 194, 151, 255],
    clothDark: [118, 96, 72, 255],
    accent: [189, 83, 58, 255],
    light: [255, 210, 116, 255],
    shadow: [40, 31, 28, 210],
  },
  {
    id: 'nagi',
    path: 'public/assets/prototypes/sprite-sheets/core5-52px/nagi-52px-sprite-sheet-v1.png',
    hood: [83, 76, 126, 255],
    hoodDark: [44, 39, 75, 255],
    hair: [65, 54, 79, 255],
    skin: [220, 178, 153, 255],
    cheek: [191, 91, 125, 255],
    cloth: [165, 156, 186, 255],
    clothDark: [83, 74, 115, 255],
    accent: [107, 128, 188, 255],
    light: [193, 208, 255, 255],
    shadow: [26, 25, 51, 220],
  },
  {
    id: 'michiru',
    path: 'public/assets/prototypes/sprite-sheets/core5-52px/michiru-52px-sprite-sheet-v1.png',
    hood: [82, 132, 117, 255],
    hoodDark: [44, 78, 76, 255],
    hair: [112, 78, 49, 255],
    skin: [232, 187, 149, 255],
    cheek: [214, 119, 107, 255],
    cloth: [197, 188, 139, 255],
    clothDark: [84, 102, 80, 255],
    accent: [215, 158, 80, 255],
    light: [230, 232, 133, 255],
    shadow: [28, 49, 45, 210],
  },
  {
    id: 'tomori',
    path: 'public/assets/prototypes/sprite-sheets/core5-52px/tomori-52px-sprite-sheet-v1.png',
    hood: [151, 91, 65, 255],
    hoodDark: [91, 54, 48, 255],
    hair: [67, 53, 43, 255],
    skin: [236, 185, 142, 255],
    cheek: [233, 112, 95, 255],
    cloth: [199, 174, 128, 255],
    clothDark: [104, 76, 68, 255],
    accent: [214, 146, 70, 255],
    light: [255, 184, 93, 255],
    shadow: [49, 31, 26, 210],
  },
];

class Canvas {
  readonly data = new Uint8Array(WIDTH * HEIGHT * 4);

  constructor() {
    this.clear(TRANSPARENT);
  }

  clear(color: Rgba): void {
    for (let i = 0; i < WIDTH * HEIGHT; i += 1) {
      this.data[i * 4] = color[0];
      this.data[i * 4 + 1] = color[1];
      this.data[i * 4 + 2] = color[2];
      this.data[i * 4 + 3] = color[3];
    }
  }

  set(x: number, y: number, color: Rgba): void {
    if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
    const idx = (Math.floor(y) * WIDTH + Math.floor(x)) * 4;
    this.data[idx] = color[0];
    this.data[idx + 1] = color[1];
    this.data[idx + 2] = color[2];
    this.data[idx + 3] = color[3];
  }

  rect(x: number, y: number, w: number, h: number, color: Rgba): void {
    for (let yy = y; yy < y + h; yy += 1) {
      for (let xx = x; xx < x + w; xx += 1) this.set(xx, yy, color);
    }
  }

  circle(cx: number, cy: number, r: number, color: Rgba): void {
    for (let y = cy - r; y <= cy + r; y += 1) {
      for (let x = cx - r; x <= cx + r; x += 1) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= r * r) this.set(x, y, color);
      }
    }
  }

  line(x0: number, y0: number, x1: number, y1: number, color: Rgba): void {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    let x = x0;
    let y = y0;
    while (true) {
      this.set(x, y, color);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }
}

function add(a: number, b: number): number {
  return a + b;
}

function drawCharacter(canvas: Canvas, ch: CharacterPalette, pose: Pose, cellX: number, cellY: number): void {
  const cx = cellX + 37;
  const baseY = cellY + 60;
  const walkShift = pose.action === 'walk' ? (pose.alt === 1 ? 2 : -2) : 0;
  const hurtShift = pose.action === 'hurt' ? -4 : pose.action === 'recoil' ? 4 : 0;
  const downed = pose.action === 'downed';
  const rest = pose.action === 'rest';

  if (pose.action === 'icon') {
    drawIcon(canvas, ch, pose.alt ?? 0, cellX, cellY);
    return;
  }

  if (pose.action === 'portrait') {
    drawPortrait(canvas, ch, cellX, cellY, pose.alt === 1);
    return;
  }

  if (downed) {
    drawDowned(canvas, ch, cellX, cellY);
    return;
  }

  canvas.rect(cx - 16 + hurtShift, baseY - 3, 32, 4, ch.shadow);

  const bodyY = rest ? cellY + 38 : cellY + 35;
  const headY = rest ? cellY + 25 : cellY + 20;
  const bodyX = cx + hurtShift;
  const dirOffset = pose.direction === 'left' ? -3 : pose.direction === 'right' ? 3 : 0;
  const back = pose.direction === 'back';

  canvas.rect(bodyX - 9, bodyY, 18, 20, INK);
  canvas.rect(bodyX - 8, bodyY - 1, 16, 20, ch.clothDark);
  canvas.rect(bodyX - 7, bodyY, 14, 16, ch.cloth);
  canvas.rect(bodyX - 7, bodyY + 15, 14, 5, ch.accent);

  if (rest) {
    canvas.rect(bodyX - 14, bodyY + 18, 12, 4, ch.clothDark);
    canvas.rect(bodyX + 2, bodyY + 18, 12, 4, ch.clothDark);
  } else {
    canvas.rect(bodyX - 7 + walkShift, bodyY + 20, 5, 8, INK);
    canvas.rect(bodyX + 2 - walkShift, bodyY + 20, 5, 8, INK);
    canvas.rect(bodyX - 6 + walkShift, bodyY + 20, 4, 7, ch.clothDark);
    canvas.rect(bodyX + 3 - walkShift, bodyY + 20, 4, 7, ch.clothDark);
  }

  const armLift = pose.action === 'cast' || pose.action === 'special' ? -8 : pose.action === 'attack' ? -3 : 0;
  canvas.line(bodyX - 9, bodyY + 5, bodyX - 17, bodyY + 13 + armLift, INK);
  canvas.line(bodyX + 9, bodyY + 5, bodyX + 17, bodyY + 13 + armLift, INK);
  canvas.rect(bodyX - 18, bodyY + 12 + armLift, 4, 5, ch.skin);
  canvas.rect(bodyX + 14, bodyY + 12 + armLift, 4, 5, ch.skin);

  const itemSide = pose.direction === 'left' ? -1 : 1;
  if (pose.action === 'ready' || pose.action === 'cast' || pose.action === 'special' || pose.action === 'attack' || pose.action === 'interact') {
    drawVessel(canvas, ch, bodyX + itemSide * 22, bodyY + 11 + armLift, pose.action === 'special', pose.alt === 1);
    canvas.line(bodyX + itemSide * 15, bodyY + 14 + armLift, bodyX + itemSide * 22, bodyY + 12 + armLift, INK);
  }
  if (pose.action === 'pickup') {
    canvas.circle(bodyX + 14, bodyY + 24, 4, ch.light);
    canvas.rect(bodyX + 11, bodyY + 28, 7, 2, ch.accent);
  }

  if (pose.action === 'happy') {
    canvas.circle(bodyX + 16, headY - 7, 3, ch.light);
    canvas.circle(bodyX + 20, headY - 11, 2, ch.light);
  }
  if (pose.action === 'surprised') {
    canvas.rect(bodyX + 14, headY - 14, 3, 7, ch.light);
    canvas.rect(bodyX + 14, headY - 5, 3, 3, ch.light);
  }

  canvas.rect(cx - 15 + dirOffset + hurtShift, headY - 2, 30, 27, INK);
  canvas.rect(cx - 14 + dirOffset + hurtShift, headY - 3, 28, 27, ch.hoodDark);
  canvas.rect(cx - 11 + dirOffset + hurtShift, headY - 6, 22, 28, ch.hood);
  canvas.rect(cx - 8 + dirOffset + hurtShift, headY + 2, 16, 15, back ? ch.hood : ch.skin);

  if (!back) {
    canvas.rect(cx - 8 + dirOffset + hurtShift, headY + 1, 16, 5, ch.hair);
    canvas.rect(cx - 5 + dirOffset + hurtShift, headY + 5, 4, 5, ch.hair);
    canvas.rect(cx + 2 + dirOffset + hurtShift, headY + 5, 4, 5, ch.hair);
    drawFace(canvas, cx + dirOffset + hurtShift, headY, pose);
  } else {
    canvas.rect(cx - 7 + dirOffset + hurtShift, headY + 2, 14, 13, ch.hoodDark);
    canvas.rect(cx - 4 + dirOffset + hurtShift, headY + 16, 8, 5, ch.hair);
  }
}

function drawFace(canvas: Canvas, cx: number, headY: number, pose: Pose): void {
  if (pose.alt === 1 && pose.action === 'idle') {
    canvas.rect(cx - 6, headY + 9, 4, 1, INK);
    canvas.rect(cx + 3, headY + 9, 4, 1, INK);
  } else if (pose.action === 'happy') {
    canvas.rect(cx - 6, headY + 8, 4, 1, INK);
    canvas.rect(cx + 3, headY + 8, 4, 1, INK);
    canvas.rect(cx - 2, headY + 15, 5, 2, INK);
  } else if (pose.action === 'surprised') {
    canvas.rect(cx - 6, headY + 8, 3, 5, INK);
    canvas.rect(cx + 4, headY + 8, 3, 5, INK);
    canvas.rect(cx - 1, headY + 15, 3, 4, INK);
  } else if (pose.action === 'hurt' || pose.action === 'recoil') {
    canvas.rect(cx - 7, headY + 8, 5, 2, INK);
    canvas.rect(cx + 3, headY + 8, 5, 2, INK);
    canvas.rect(cx - 2, headY + 15, 4, 1, INK);
  } else {
    canvas.rect(cx - 6, headY + 8, 3, 4, INK);
    canvas.rect(cx + 4, headY + 8, 3, 4, INK);
    canvas.set(cx - 5, headY + 8, WHITE);
    canvas.set(cx + 5, headY + 8, WHITE);
    canvas.rect(cx - 1, headY + 15, 3, 1, INK);
  }
}

function drawVessel(canvas: Canvas, ch: CharacterPalette, x: number, y: number, special: boolean, black: boolean): void {
  const glow = black ? BLACK_GLOW : ch.light;
  canvas.circle(x, y, special ? 8 : 6, [glow[0], glow[1], glow[2], 82]);
  canvas.rect(x - 4, y - 5, 8, 10, INK);
  canvas.rect(x - 3, y - 4, 6, 8, black ? ch.hoodDark : ch.accent);
  canvas.rect(x - 2, y - 2, 4, 4, glow);
  canvas.rect(x - 2, y - 7, 4, 2, INK);
}

function drawDowned(canvas: Canvas, ch: CharacterPalette, cellX: number, cellY: number): void {
  const x = cellX + 24;
  const y = cellY + 48;
  canvas.rect(x - 5, y + 8, 36, 4, ch.shadow);
  canvas.rect(x, y, 34, 11, INK);
  canvas.rect(x + 2, y - 1, 28, 10, ch.clothDark);
  canvas.rect(x + 5, y - 13, 18, 14, ch.hood);
  canvas.rect(x + 9, y - 9, 11, 9, ch.skin);
  canvas.rect(x + 10, y - 6, 7, 2, INK);
}

function drawPortrait(canvas: Canvas, ch: CharacterPalette, cellX: number, cellY: number, alt: boolean): void {
  const cx = cellX + 37;
  const y = cellY + 19;
  canvas.rect(cx - 21, y - 3, 42, 42, INK);
  canvas.rect(cx - 19, y - 1, 38, 38, ch.hoodDark);
  canvas.rect(cx - 15, y - 5, 30, 38, ch.hood);
  canvas.rect(cx - 10, y + 8, 20, 18, ch.skin);
  canvas.rect(cx - 10, y + 7, 20, 5, ch.hair);
  drawFace(canvas, cx, y + 7, { key: 'portrait', direction: 'front', action: alt ? 'surprised' : 'idle' });
  canvas.rect(cx - 12, y + 30, 24, 7, ch.cloth);
}

function drawIcon(canvas: Canvas, ch: CharacterPalette, variant: number, cellX: number, cellY: number): void {
  const cx = cellX + 37;
  const cy = cellY + 37;
  canvas.circle(cx, cy + 12, 15, ch.shadow);
  if (variant === 0) drawVessel(canvas, ch, cx, cy, true, false);
  if (variant === 1) {
    canvas.rect(cx - 12, cy - 10, 24, 22, INK);
    canvas.rect(cx - 10, cy - 8, 20, 18, ch.cloth);
    canvas.rect(cx - 7, cy - 5, 14, 3, ch.accent);
  }
  if (variant === 2 || variant === 3) {
    const color = variant === 3 ? ch.hoodDark : ch.light;
    canvas.circle(cx, cy, 14, INK);
    canvas.circle(cx, cy, 11, color);
    canvas.rect(cx - 2, cy - 15, 4, 30, INK);
    canvas.rect(cx - 15, cy - 2, 30, 4, INK);
  }
  if (variant === 4) {
    canvas.rect(cx - 10, cy - 12, 20, 24, INK);
    canvas.rect(cx - 8, cy - 10, 16, 20, [221, 205, 165, 255]);
    canvas.circle(cx + 7, cy - 7, 3, ch.light);
  }
  if (variant === 5) {
    canvas.circle(cx, cy, 11, [ch.light[0], ch.light[1], ch.light[2], 110]);
    canvas.rect(cx - 2, cy - 14, 4, 28, ch.light);
    canvas.rect(cx - 14, cy - 2, 28, 4, ch.light);
    canvas.circle(cx, cy, 4, WHITE);
  }
}

function buildPng(canvas: Canvas): Buffer {
  const scanlines = Buffer.alloc((WIDTH * 4 + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y += 1) {
    const rowStart = y * (WIDTH * 4 + 1);
    scanlines[rowStart] = 0;
    Buffer.from(canvas.data.subarray(y * WIDTH * 4, (y + 1) * WIDTH * 4)).copy(scanlines, rowStart + 1);
  }

  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    pngChunk('IHDR', Buffer.concat([u32(WIDTH), u32(HEIGHT), Buffer.from([8, 6, 0, 0, 0])])),
    pngChunk('IDAT', deflateSync(scanlines, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function u32(value: number): Buffer {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(value, 0);
  return b;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, 'ascii');
  return Buffer.concat([u32(data.length), typeBuf, data, u32(crc32(Buffer.concat([typeBuf, data])))]);
}

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

for (const ch of characters) {
  const canvas = new Canvas();
  poses.forEach((pose, index) => {
    const col = index % COLUMNS;
    const row = Math.floor(index / COLUMNS);
    drawCharacter(canvas, ch, pose, col * CELL, row * CELL);
  });
  mkdirSync(dirname(ch.path), { recursive: true });
  writeFileSync(ch.path, buildPng(canvas));
  console.log(`wrote ${ch.path} (${WIDTH}x${HEIGHT}, ${COLUMNS}x${ROWS}, ${CELL}px cells)`);
}
