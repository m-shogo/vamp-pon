export type PixelColor = readonly [r: number, g: number, b: number, a: number];

export type PixelGrid = {
  width: number;
  height: number;
  pixels: Array<PixelColor | null>;
};

export type PixelAssetKind = 'player' | 'enemy' | 'pickup' | 'rare' | 'weapon' | 'tile' | 'ui';
export type PixelAssetId = string;
export type PixelAssetQuality = 'generated-final' | 'generated-draft' | 'hand-final';
export type CharacterVisualId = 'yui';
export type CharacterPose = 'idle' | 'move' | 'hurt' | 'ultimate';
export type TileVisualId = 'stage1-paper-night';

export type PixelKitOptions = {
  seed?: number;
};

export type PixelAssetSpec = {
  id: PixelAssetId;
  path: string;
  width: number;
  height: number;
  kind: PixelAssetKind;
  quality: PixelAssetQuality;
  create: (options?: PixelKitOptions) => PixelGrid;
};

export type SeededRng = () => number;

export const TRANSPARENT: PixelColor = [0, 0, 0, 0];

export const VAMP_PALETTE = {
  nightDeep: [17, 17, 34, 255],
  night: [45, 44, 77, 255],
  nightMid: [57, 55, 93, 255],
  nightLight: [72, 66, 105, 255],
  ink: [8, 7, 19, 255],
  inkSoft: [21, 20, 42, 255],
  inkEdge: [48, 45, 75, 255],
  paperEdge: [111, 88, 79, 255],
  paperLine: [127, 102, 91, 255],
  paper: [199, 169, 130, 255],
  paperLight: [247, 224, 164, 255],
  lantern: [255, 189, 78, 255],
  star: [255, 228, 138, 255],
  whiteWarm: [255, 244, 196, 255],
  eye: [255, 248, 217, 255],
  yuiHood: [39, 48, 77, 255],
  yuiDress: [185, 130, 98, 255],
  yuiHair: [75, 38, 48, 255],
  heal: [238, 203, 154, 255],
  healRed: [156, 77, 73, 255],
  cork: [139, 91, 55, 255],
  glass: [155, 181, 189, 255],
  wind: [142, 183, 155, 255],
  uiPaper: [246, 234, 198, 255],
} satisfies Record<string, PixelColor>;

const C = VAMP_PALETTE;

export function createSeededRng(seed = 1): SeededRng {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function createEmptyGrid(width: number, height: number, fill: PixelColor | null = null): PixelGrid {
  return { width, height, pixels: Array.from({ length: width * height }, () => fill) };
}

export function setPixel(grid: PixelGrid, x: number, y: number, color: PixelColor | null): void {
  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || py < 0 || px >= grid.width || py >= grid.height) return;
  grid.pixels[py * grid.width + px] = color;
}

export function fillRect(grid: PixelGrid, x: number, y: number, width: number, height: number, color: PixelColor | null): void {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) setPixel(grid, px, py, color);
  }
}

export function drawLine(grid: PixelGrid, x0: number, y0: number, x1: number, y1: number, color: PixelColor, thickness = 1): void {
  let cx = Math.round(x0);
  let cy = Math.round(y0);
  const tx = Math.round(x1);
  const ty = Math.round(y1);
  const dx = Math.abs(tx - cx);
  const sx = cx < tx ? 1 : -1;
  const dy = -Math.abs(ty - cy);
  const sy = cy < ty ? 1 : -1;
  let err = dx + dy;
  const offset = Math.floor(thickness / 2);

  while (true) {
    fillRect(grid, cx - offset, cy - offset, thickness, thickness, color);
    if (cx === tx && cy === ty) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      cx += sx;
    }
    if (e2 <= dx) {
      err += dx;
      cy += sy;
    }
  }
}

export function drawCircle(grid: PixelGrid, cx: number, cy: number, radius: number, color: PixelColor): void {
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2) setPixel(grid, x, y, color);
    }
  }
}

export function drawDiamond(grid: PixelGrid, cx: number, cy: number, radius: number, color: PixelColor): void {
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      if (Math.abs(x - cx) + Math.abs(y - cy) <= radius) setPixel(grid, x, y, color);
    }
  }
}

export function drawNoise(grid: PixelGrid, rng: SeededRng, color: PixelColor, density: number): void {
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      if (rng() < density) setPixel(grid, x, y, color);
    }
  }
}

export function outlineNonTransparent(grid: PixelGrid, color: PixelColor): PixelGrid {
  const result = cloneGrid(grid);
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      if (getPixel(grid, x, y)) continue;
      if (getPixel(grid, x - 1, y) || getPixel(grid, x + 1, y) || getPixel(grid, x, y - 1) || getPixel(grid, x, y + 1)) {
        setPixel(result, x, y, color);
      }
    }
  }
  return result;
}

export function addDropShadow(grid: PixelGrid, dx = 1, dy = 1, color: PixelColor = [8, 7, 19, 150]): PixelGrid {
  const result = createEmptyGrid(grid.width, grid.height);
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      if (getPixel(grid, x, y)) setPixel(result, x + dx, y + dy, color);
    }
  }
  mergeGrid(result, grid);
  return result;
}

export function mergeGrid(target: PixelGrid, source: PixelGrid, offsetX = 0, offsetY = 0): PixelGrid {
  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      const color = getPixel(source, x, y);
      if (color) setPixel(target, x + offsetX, y + offsetY, color);
    }
  }
  return target;
}

export function pixelGridToRgbaBuffer(grid: PixelGrid): Uint8Array {
  const out = new Uint8Array(grid.width * grid.height * 4);
  grid.pixels.forEach((color, index) => {
    const rgba = color ?? TRANSPARENT;
    const offset = index * 4;
    out[offset] = rgba[0];
    out[offset + 1] = rgba[1];
    out[offset + 2] = rgba[2];
    out[offset + 3] = rgba[3];
  });
  return out;
}

export function getPixel(grid: PixelGrid, x: number, y: number): PixelColor | null {
  if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) return null;
  return grid.pixels[y * grid.width + x];
}

export function cloneGrid(grid: PixelGrid): PixelGrid {
  return { width: grid.width, height: grid.height, pixels: [...grid.pixels] };
}

export function hasVisiblePixel(grid: PixelGrid): boolean {
  return grid.pixels.some((pixel) => pixel != null && pixel[3] > 0);
}

export function fadeGrid(grid: PixelGrid, alphaScale: number): PixelGrid {
  return {
    width: grid.width,
    height: grid.height,
    pixels: grid.pixels.map((pixel) => (pixel ? [pixel[0], pixel[1], pixel[2], Math.round(pixel[3] * alphaScale)] : null)),
  };
}

export function createPaperScrap(width = 16, height = 16, options: PixelKitOptions = {}): PixelGrid {
  const rng = createSeededRng(options.seed ?? 10);
  const grid = createEmptyGrid(width, height);
  const points = [
    [3, 3],
    [width - 3, 2 + Math.floor(rng() * 2)],
    [width - 4, height - 4],
    [2, height - 3],
  ];
  fillPolygon(grid, points, C.paper);
  drawLine(grid, 4, Math.floor(height / 2), width - 5, Math.floor(height / 2) + 1, C.paperLine);
  drawLine(grid, 5, Math.floor(height / 2) + 3, width - 7, Math.floor(height / 2) + 4, C.paperLine);
  setPixel(grid, 4, 4, C.paperLight);
  return outlineNonTransparent(grid, C.paperEdge);
}

export function createInkBlot(width = 16, height = 16, options: PixelKitOptions = {}): PixelGrid {
  const rng = createSeededRng(options.seed ?? 20);
  const grid = createEmptyGrid(width, height);
  drawCircle(grid, width / 2, height / 2, Math.min(width, height) * 0.32, C.ink);
  drawCircle(grid, width * 0.35, height * 0.6, Math.min(width, height) * 0.2, C.ink);
  drawCircle(grid, width * 0.7, height * 0.58, Math.min(width, height) * 0.18, C.ink);
  for (let i = 0; i < 8; i += 1) {
    setPixel(grid, Math.floor(rng() * width), Math.floor(rng() * height), C.inkEdge);
  }
  return grid;
}

export function createMemoryFragment(options: PixelKitOptions = {}): PixelGrid {
  const grid = createEmptyGrid(12, 12);
  drawCircle(grid, 6, 6, 5, [255, 189, 78, 52]);
  drawStar(grid, 6, 6, 5, C.star, C.paperEdge);
  fillRect(grid, 5, 5, 2, 2, C.whiteWarm);
  drawDiamond(grid, 6, 6, 3, [255, 244, 196, 230]);
  drawNoise(grid, createSeededRng(options.seed ?? 30), [255, 228, 138, 190], 0.025);
  return grid;
}

export function createHealPaper(): PixelGrid {
  const grid = createPaperScrap(14, 14, { seed: 41 });
  fillRect(grid, 4, 4, 7, 7, C.heal);
  drawLine(grid, 4, 7, 10, 7, [180, 80, 76, 255], 2);
  drawLine(grid, 7, 4, 7, 11, [180, 80, 76, 255], 2);
  return grid;
}

export function createCapsule(): PixelGrid {
  const grid = createEmptyGrid(16, 16);
  fillRect(grid, 6, 1, 5, 3, C.cork);
  drawLine(grid, 5, 4, 11, 4, C.paperLight);
  fillRect(grid, 4, 5, 9, 9, [155, 205, 218, 205]);
  fillRect(grid, 5, 6, 7, 7, [255, 189, 78, 90]);
  drawRectOutline(grid, 4, 5, 9, 9, [232, 246, 245, 255]);
  drawStar(grid, 8, 10, 4, C.star, C.paperEdge);
  return grid;
}

export function createNameTag(): PixelGrid {
  const grid = createEmptyGrid(16, 16);
  fillRect(grid, 4, 2, 8, 11, C.paper);
  drawRectOutline(grid, 4, 2, 8, 11, C.paperEdge);
  setPixel(grid, 8, 4, C.paperLight);
  fillRect(grid, 6, 7, 5, 2, C.ink);
  drawLine(grid, 5, 11, 11, 11, C.paperLine);
  fillRect(grid, 7, 13, 2, 2, C.paperEdge);
  return grid;
}

export function createCrackedLens(): PixelGrid {
  const grid = createEmptyGrid(16, 16);
  drawCircle(grid, 8, 8, 6, [155, 181, 189, 170]);
  drawCircle(grid, 8, 8, 4, [72, 66, 105, 150]);
  drawCircle(grid, 6, 6, 1, C.whiteWarm);
  drawLine(grid, 8, 4, 7, 9, C.paperLight);
  drawLine(grid, 7, 9, 11, 12, C.paperLight);
  return outlineNonTransparent(grid, C.paperEdge);
}

export function createSealedLetter(): PixelGrid {
  const grid = createPaperScrap(16, 16, { seed: 52 });
  drawLine(grid, 3, 4, 8, 9, C.paperLine);
  drawLine(grid, 13, 4, 8, 9, C.paperLine);
  drawCircle(grid, 8, 9, 2, C.healRed);
  setPixel(grid, 8, 9, C.lantern);
  return grid;
}

export function createWindMark(): PixelGrid {
  const grid = createEmptyGrid(16, 16);
  drawDiamond(grid, 8, 8, 6, [142, 183, 155, 180]);
  drawLine(grid, 4, 7, 11, 7, C.wind);
  drawLine(grid, 6, 10, 13, 10, C.wind);
  setPixel(grid, 12, 6, C.paperLight);
  return outlineNonTransparent(grid, C.paperEdge);
}

export function createNightPencilProjectile(): PixelGrid {
  const grid = createEmptyGrid(16, 8);
  fillRect(grid, 2, 3, 10, 3, [60, 58, 72, 255]);
  fillRect(grid, 3, 2, 7, 1, [88, 86, 104, 255]);
  fillPolygon(grid, [[12, 2], [15, 4], [12, 6]], C.paper);
  fillPolygon(grid, [[13, 3], [15, 4], [13, 5]], C.ink);
  fillRect(grid, 1, 3, 2, 3, C.paperEdge);
  return grid;
}

export function createPaperAirplaneProjectile(): PixelGrid {
  const grid = createEmptyGrid(16, 12);
  fillPolygon(grid, [[1, 6], [14, 2], [11, 6], [14, 10]], C.paperLight);
  fillPolygon(grid, [[1, 6], [11, 6], [6, 9]], C.paper);
  drawLine(grid, 2, 6, 14, 2, C.paperLine);
  drawLine(grid, 2, 6, 14, 10, C.paperLine);
  setPixel(grid, 13, 6, C.whiteWarm);
  return outlineNonTransparent(grid, C.paperEdge);
}

export function createMarbleProjectile(): PixelGrid {
  const grid = createEmptyGrid(12, 12);
  drawCircle(grid, 6, 6, 5, [155, 181, 189, 170]);
  drawCircle(grid, 6, 6, 3, [72, 66, 105, 190]);
  drawCircle(grid, 4, 4, 1, C.whiteWarm);
  drawLine(grid, 3, 8, 8, 3, [255, 228, 138, 180]);
  drawLine(grid, 6, 9, 9, 6, [199, 169, 130, 170]);
  setPixel(grid, 8, 8, C.lantern);
  return outlineNonTransparent(grid, C.paperEdge);
}

export function createStardustProjectile(): PixelGrid {
  const grid = createEmptyGrid(12, 12);
  fillPolygon(grid, [[3, 4], [8, 3], [10, 7], [5, 10], [2, 8]], [199, 169, 130, 210]);
  drawLine(grid, 4, 7, 8, 6, C.paperLine);
  drawDiamond(grid, 6, 6, 3, [255, 228, 138, 230]);
  setPixel(grid, 6, 6, C.whiteWarm);
  setPixel(grid, 2, 5, [255, 189, 78, 180]);
  setPixel(grid, 10, 4, [255, 228, 138, 180]);
  return outlineNonTransparent(grid, C.paperEdge);
}

export function createPostcardBladeProjectile(): PixelGrid {
  const grid = createEmptyGrid(16, 10);
  fillPolygon(grid, [[1, 2], [12, 1], [15, 5], [12, 8], [1, 7]], C.paperLight);
  fillPolygon(grid, [[10, 2], [15, 5], [10, 8]], [255, 228, 138, 210]);
  drawLine(grid, 3, 3, 8, 3, C.paperLine);
  drawLine(grid, 3, 5, 9, 5, C.paperLine);
  drawLine(grid, 4, 7, 8, 7, C.paperLine);
  fillRect(grid, 2, 2, 2, 2, [72, 66, 105, 190]);
  setPixel(grid, 13, 5, C.whiteWarm);
  return outlineNonTransparent(grid, C.paperEdge);
}

export function createBookmarkOrbit(): PixelGrid {
  const grid = createEmptyGrid(12, 16);
  fillPolygon(grid, [[3, 1], [9, 1], [9, 14], [6, 11], [3, 14]], C.paperLight);
  drawLine(grid, 4, 3, 8, 3, C.paperLine);
  drawLine(grid, 4, 6, 8, 6, C.paperLine);
  drawCircle(grid, 7, 10, 3, [255, 228, 138, 130]);
  drawCircle(grid, 8, 9, 2, C.nightMid);
  setPixel(grid, 5, 2, C.whiteWarm);
  return outlineNonTransparent(grid, C.paperEdge);
}

export function createInkAreaTile(options: PixelKitOptions = {}): PixelGrid {
  const rng = createSeededRng(options.seed ?? 93);
  const grid = createEmptyGrid(64, 64);
  drawEllipse(grid, 32, 34, 24, 17, [8, 7, 19, 185]);
  drawEllipse(grid, 23, 29, 13, 10, [8, 7, 19, 210]);
  drawEllipse(grid, 43, 39, 15, 11, [8, 7, 19, 200]);
  drawEllipse(grid, 32, 34, 18, 11, [21, 20, 42, 155]);
  for (let i = 0; i < 22; i += 1) {
    const x = 8 + Math.floor(rng() * 48);
    const y = 10 + Math.floor(rng() * 44);
    drawCircle(grid, x, y, 1 + Math.floor(rng() * 3), [8, 7, 19, 120 + Math.floor(rng() * 80)]);
  }
  drawLine(grid, 16, 44, 49, 41, C.inkEdge);
  drawLine(grid, 22, 24, 41, 25, [72, 66, 105, 130]);
  return grid;
}

export function createStreetlampAreaTile(options: PixelKitOptions = {}): PixelGrid {
  const rng = createSeededRng(options.seed ?? 94);
  const grid = createEmptyGrid(128, 128);
  drawCircle(grid, 64, 64, 52, [255, 189, 78, 28]);
  drawCircle(grid, 64, 64, 38, [255, 189, 78, 42]);
  drawCircle(grid, 64, 64, 17, [255, 228, 138, 55]);
  for (let i = 0; i < 48; i += 1) {
    const angle = rng() * Math.PI * 2;
    const radius = 16 + rng() * 42;
    const x = Math.round(64 + Math.cos(angle) * radius);
    const y = Math.round(64 + Math.sin(angle) * radius * 0.72);
    setPixel(grid, x, y, [255, 228, 138, 70]);
  }
  drawEllipse(grid, 64, 70, 42, 16, [247, 224, 164, 35]);
  drawLine(grid, 29, 69, 99, 69, [255, 189, 78, 90]);
  return grid;
}

export function createEnemyInkBlob(): PixelGrid {
  const grid = createEmptyGrid(24, 24);
  drawEllipse(grid, 12, 18, 10, 4, [8, 7, 19, 170]);
  drawCircle(grid, 12, 12, 8, C.ink);
  drawCircle(grid, 6, 14, 4, C.ink);
  drawCircle(grid, 18, 14, 4, C.ink);
  drawCircle(grid, 12, 10, 8, C.inkSoft);
  drawLine(grid, 5, 18, 2, 21, C.inkEdge, 2);
  drawLine(grid, 19, 18, 22, 20, C.inkEdge, 2);
  fillRect(grid, 8, 11, 3, 4, C.eye);
  fillRect(grid, 15, 11, 3, 4, C.eye);
  for (const [x, y] of [[3, 8], [20, 6], [5, 4], [22, 13], [2, 16]]) setPixel(grid, x, y, C.ink);
  return grid;
}

export function createEnemyPaperScrap(): PixelGrid {
  const grid = createEmptyGrid(24, 24);
  mergeGrid(grid, createEnemyInkBlob(), 0, 0);
  fillPolygon(grid, [[14, 4], [22, 6], [19, 13], [12, 11]], C.paper);
  drawLine(grid, 15, 8, 20, 9, C.paperLine);
  fillPolygon(grid, [[3, 8], [9, 6], [10, 12], [4, 14]], C.paper);
  return outlineNonTransparent(grid, C.inkEdge);
}

export function createEnemySignpost(): PixelGrid {
  const grid = createEmptyGrid(24, 24);
  mergeGrid(grid, createEnemyInkBlob(), 0, 0);
  fillRect(grid, 11, 3, 3, 13, C.paperEdge);
  fillPolygon(grid, [[12, 4], [22, 6], [17, 10], [12, 9]], C.paper);
  fillPolygon(grid, [[12, 10], [3, 12], [8, 16], [12, 15]], [199, 169, 130, 235]);
  drawLine(grid, 15, 7, 19, 7, C.paperLine);
  drawLine(grid, 5, 13, 9, 13, C.paperLine);
  return outlineNonTransparent(grid, C.inkEdge);
}

export function createEnemyCapsule(): PixelGrid {
  const grid = createEmptyGrid(24, 24);
  mergeGrid(grid, createEnemyInkBlob(), 0, 0);
  drawEllipse(grid, 12, 12, 6, 9, [48, 45, 75, 180]);
  drawRectOutline(grid, 8, 5, 9, 13, C.inkEdge);
  fillRect(grid, 10, 4, 5, 3, C.cork);
  fillRect(grid, 10, 9, 5, 6, [155, 181, 189, 150]);
  drawDiamond(grid, 12, 12, 2, [255, 228, 138, 190]);
  fillRect(grid, 8, 11, 2, 3, C.eye);
  fillRect(grid, 16, 11, 2, 3, C.eye);
  return outlineNonTransparent(grid, C.inkEdge);
}

export function createEnemyHaze(): PixelGrid {
  const grid = createEmptyGrid(24, 24);
  drawEllipse(grid, 12, 16, 10, 5, [8, 7, 19, 170]);
  drawCircle(grid, 8, 12, 5, [21, 20, 42, 210]);
  drawCircle(grid, 14, 11, 6, [21, 20, 42, 210]);
  drawCircle(grid, 17, 15, 4, [8, 7, 19, 220]);
  drawLine(grid, 4, 18, 20, 18, C.inkEdge);
  fillRect(grid, 8, 11, 3, 3, C.eye);
  fillRect(grid, 15, 11, 3, 3, C.eye);
  setPixel(grid, 5, 9, [72, 66, 105, 180]);
  setPixel(grid, 19, 8, [72, 66, 105, 180]);
  return outlineNonTransparent(grid, C.inkEdge);
}

function createYuiBaseGeneratedDraft(pose: CharacterPose = 'idle'): PixelGrid {
  const grid = createEmptyGrid(32, 32);
  const lean = pose === 'move' ? 1 : pose === 'hurt' ? -1 : 0;
  const hoodX = 16 + lean;
  const lampX = pose === 'ultimate' ? 23 : pose === 'move' ? 24 : 21;
  const lampY = pose === 'ultimate' ? 17 : pose === 'move' ? 19 : 20;
  const dress: PixelColor = pose === 'hurt' ? [150, 98, 88, 255] : [205, 150, 105, 255];
  const apron: PixelColor = pose === 'hurt' ? [171, 139, 117, 230] : [229, 196, 143, 245];

  drawEllipse(grid, 16, 27, 12, 4, [8, 7, 19, 145]);
  drawCircle(grid, lampX, lampY, pose === 'ultimate' ? 6 : 4, [255, 189, 78, pose === 'ultimate' ? 62 : 38]);
  drawLine(grid, hoodX + 4, 17, lampX - 2, lampY - 2, C.paperEdge);

  fillPolygon(grid, [[10 + lean, 15], [22 + lean, 15], [25 + lean, 27], [7 + lean, 27]], dress);
  fillPolygon(grid, [[12 + lean, 17], [20 + lean, 17], [21 + lean, 26], [11 + lean, 26]], apron);
  drawLine(grid, 10 + lean, 16, 7 + lean, 27, C.paperEdge);
  drawLine(grid, 22 + lean, 16, 25 + lean, 27, C.paperEdge);
  drawLine(grid, 8 + lean, 27, 24 + lean, 27, C.paperEdge);
  drawLine(grid, 12 + lean, 21, 21 + lean, 21, C.paperLine);
  drawLine(grid, 13 + lean, 24, 19 + lean, 24, C.paperLight);
  fillRect(grid, 10 + lean, 19, 2, 5, C.yuiDress);
  fillRect(grid, 21 + lean, 19, 2, 5, C.yuiDress);

  fillPolygon(grid, [[hoodX - 8, 10], [hoodX - 5, 4], [hoodX + 4, 3], [hoodX + 9, 10], [hoodX + 6, 18], [hoodX - 6, 18]], C.yuiHood);
  drawCircle(grid, hoodX, 11, 7, C.yuiHood);
  drawCircle(grid, hoodX, 12, 5, [53, 61, 92, 255]);
  fillRect(grid, hoodX - 3, 10, 7, 7, [242, 204, 162, 255]);
  fillRect(grid, hoodX - 5, 10, 3, 7, C.yuiHair);
  fillRect(grid, hoodX + 3, 10, 3, 7, C.yuiHair);
  fillRect(grid, hoodX - 3, 13, 2, 1, C.ink);
  fillRect(grid, hoodX + 3, 13, 2, 1, C.ink);
  setPixel(grid, hoodX, 16, [156, 77, 73, 255]);

  drawCircle(grid, lampX, lampY, pose === 'ultimate' ? 3 : 2, C.lantern);
  setPixel(grid, lampX - 1, lampY - 1, C.whiteWarm);
  drawLine(grid, lampX - 2, lampY + 2, lampX + 2, lampY + 2, C.paperEdge);

  if (pose === 'move') {
    fillRect(grid, 7, 26, 5, 2, dress);
    fillRect(grid, 20, 26, 5, 2, dress);
    drawLine(grid, 6, 25, 10, 27, C.paperEdge);
    drawLine(grid, 21, 27, 26, 25, C.paperEdge);
    drawLine(grid, 6, 21, 3, 23, C.paper);
    drawLine(grid, 23, 18, 28, 16, C.paper);
  } else if (pose === 'hurt') {
    drawLine(grid, 9, 17, 5, 15, C.paperLight);
    drawLine(grid, 22, 17, 26, 15, C.paperLight);
    fillRect(grid, hoodX - 3, 13, 8, 1, C.healRed);
    setPixel(grid, 25, 8, C.paperLight);
    setPixel(grid, 27, 10, C.paperLight);
    drawLine(grid, 12, 25, 20, 26, C.paperEdge);
  } else if (pose === 'ultimate') {
    drawDiamond(grid, 16, 20, 3, [255, 244, 196, 185]);
    drawLine(grid, 8, 14, 4, 11, [255, 228, 138, 170]);
    drawLine(grid, 24, 13, 28, 10, [255, 228, 138, 170]);
    drawLine(grid, 12, 28, 20, 28, [255, 228, 138, 150]);
    setPixel(grid, 6, 19, C.paperLight);
    setPixel(grid, 27, 22, C.paperLight);
  }
  return outlineNonTransparent(grid, C.inkEdge);
}

export function createYuiGeneratedDraft(): PixelGrid {
  return createYuiBaseGeneratedDraft('idle');
}

export function createYuiMoveGeneratedDraft(): PixelGrid {
  return createYuiBaseGeneratedDraft('move');
}

export function createYuiHurtGeneratedDraft(): PixelGrid {
  return createYuiBaseGeneratedDraft('hurt');
}

export function createYuiUltimateGeneratedDraft(): PixelGrid {
  return createYuiBaseGeneratedDraft('ultimate');
}

export function createEnemyEliteLabel(): PixelGrid {
  const grid = createEmptyGrid(32, 32);
  drawEllipse(grid, 16, 25, 13, 5, [8, 7, 19, 160]);
  drawCircle(grid, 16, 16, 10, C.ink);
  drawCircle(grid, 9, 18, 5, C.ink);
  drawCircle(grid, 23, 18, 5, C.ink);
  drawCircle(grid, 16, 16, 13, [48, 45, 75, 80]);
  fillRect(grid, 7, 14, 18, 8, C.paper);
  drawRectOutline(grid, 7, 14, 18, 8, C.paperEdge);
  fillRect(grid, 10, 17, 12, 2, C.ink);
  fillRect(grid, 11, 9, 4, 4, C.whiteWarm);
  fillRect(grid, 21, 9, 4, 4, C.whiteWarm);
  return grid;
}

export function createPaperNightTile(options: PixelKitOptions = {}): PixelGrid {
  const rng = createSeededRng(options.seed ?? 70);
  const grid = createEmptyGrid(128, 128, [50, 50, 82, 255]);
  for (let y = 0; y < 128; y += 24) {
    const yy = y + Math.floor(rng() * 5) - 2;
    drawLine(grid, Math.floor(rng() * 14), yy, 127 - Math.floor(rng() * 16), yy + Math.floor(rng() * 3) - 1, [45, 44, 77, 82], 1);
  }
  for (let x = 0; x < 128; x += 34) {
    const xx = x + Math.floor(rng() * 5) - 2;
    drawLine(grid, xx, Math.floor(rng() * 14), xx + Math.floor(rng() * 3) - 1, 127 - Math.floor(rng() * 16), [45, 44, 77, 65], 1);
  }
  drawNoise(grid, rng, [81, 73, 111, 78], 0.007);
  for (const [x, y] of [[8, 10], [91, 14], [112, 78], [18, 108]]) {
    mergeGrid(grid, fadeGrid(createPaperScrap(16, 16, { seed: x + y }), 0.42), x, y);
  }
  for (const [x, y] of [[56, 22], [103, 44], [48, 94]]) mergeGrid(grid, fadeGrid(createInkBlot(18, 12, { seed: x + y }), 0.45), x, y);
  for (const [x, y] of [[22, 28], [99, 100]]) {
    drawCircle(grid, x, y, 8, [255, 189, 78, 22]);
    drawCircle(grid, x, y, 3, [255, 228, 138, 48]);
    fillRect(grid, x - 1, y - 1, 2, 2, [255, 244, 196, 105]);
  }
  return grid;
}

export function createUiPaperCard(options: PixelKitOptions = {}, variant: 'normal' | 'good' | 'rare' = 'normal'): PixelGrid {
  const rng = createSeededRng(options.seed ?? 80);
  const grid = createEmptyGrid(320, 144);
  const edge = variant === 'normal' ? C.paperEdge : variant === 'good' ? C.wind : C.lantern;
  const wax = variant === 'normal' ? C.inkEdge : variant === 'good' ? C.wind : C.healRed;
  fillRect(grid, 0, 0, 320, 144, C.uiPaper);
  drawRectOutline(grid, 0, 0, 320, 144, edge);
  drawRectOutline(grid, 4, 4, 312, 136, C.paper);
  drawNoise(grid, rng, [199, 169, 130, 80], 0.018);
  fillRect(grid, 16, 20, 56, 56, [57, 55, 93, 255]);
  drawCircle(grid, 44, 48, 18, wax);
  if (variant === 'good') {
    drawDiamond(grid, 44, 48, 12, [142, 183, 155, 210]);
    drawLine(grid, 35, 48, 53, 48, C.paperLight);
  } else if (variant === 'rare') {
    drawCircle(grid, 44, 48, 14, [255, 189, 78, 120]);
    drawStar(grid, 44, 48, 10, C.star, C.paperEdge);
    drawCircle(grid, 280, 24, 10, [255, 189, 78, 70]);
    drawCircle(grid, 280, 24, 3, [255, 244, 196, 160]);
  }
  drawLine(grid, 100, 28, 248, 28, C.paperLine, 2);
  drawLine(grid, 100, 54, 292, 54, C.paperLine, 1);
  drawLine(grid, 100, 76, 270, 76, C.paperLine, 1);
  drawLine(grid, 100, 108, 226, 108, [199, 169, 130, 255], 1);
  return grid;
}

export function createUiPaperCardGood(options: PixelKitOptions = {}): PixelGrid {
  return createUiPaperCard(options, 'good');
}

export function createUiPaperCardRare(options: PixelKitOptions = {}): PixelGrid {
  return createUiPaperCard(options, 'rare');
}

export function createUnfinishedLineProjectile(): PixelGrid {
  const grid = createEmptyGrid(24, 10);
  fillRect(grid, 2, 4, 17, 2, [60, 58, 72, 255]);
  fillRect(grid, 5, 3, 8, 1, [127, 102, 91, 210]);
  fillPolygon(grid, [[19, 2], [23, 5], [19, 8]], C.paper);
  fillPolygon(grid, [[21, 4], [23, 5], [21, 6]], C.ink);
  setPixel(grid, 3, 6, C.paperLine);
  setPixel(grid, 14, 6, [21, 20, 42, 200]);
  return grid;
}

export function createNorthStarLanternProjectile(): PixelGrid {
  const grid = createEmptyGrid(16, 16);
  drawCircle(grid, 8, 9, 7, [255, 189, 78, 55]);
  fillRect(grid, 5, 4, 7, 8, C.paperLight);
  drawRectOutline(grid, 5, 4, 7, 8, C.paperEdge);
  drawLine(grid, 6, 3, 10, 3, C.paperEdge);
  drawStar(grid, 8, 8, 4, C.star, C.paperEdge);
  setPixel(grid, 3, 3, [255, 228, 138, 170]);
  setPixel(grid, 13, 12, [255, 228, 138, 170]);
  return grid;
}

export function createDawnInkLampArea(options: PixelKitOptions = {}): PixelGrid {
  const rng = createSeededRng(options.seed ?? 95);
  const grid = createEmptyGrid(128, 128);
  mergeGrid(grid, createInkAreaTile({ seed: 951 }), 32, 32);
  drawCircle(grid, 64, 64, 45, [255, 189, 78, 32]);
  drawCircle(grid, 64, 64, 28, [255, 228, 138, 42]);
  drawEllipse(grid, 64, 70, 38, 19, [238, 203, 154, 55]);
  for (let i = 0; i < 36; i += 1) {
    const x = 24 + Math.floor(rng() * 80);
    const y = 28 + Math.floor(rng() * 70);
    setPixel(grid, x, y, rng() > 0.5 ? [255, 228, 138, 120] : [156, 77, 73, 90]);
  }
  return grid;
}

export function createUnforgottenNameProjectile(): PixelGrid {
  const grid = createEmptyGrid(24, 12);
  fillRect(grid, 2, 5, 14, 2, [60, 58, 72, 255]);
  fillRect(grid, 3, 3, 5, 7, C.paper);
  drawRectOutline(grid, 3, 3, 5, 7, C.paperEdge);
  fillRect(grid, 4, 6, 3, 1, C.ink);
  fillPolygon(grid, [[16, 3], [23, 6], [16, 9]], C.paperLight);
  fillPolygon(grid, [[20, 5], [23, 6], [20, 7]], C.ink);
  return grid;
}

export function createMemoryMarbleProjectile(): PixelGrid {
  const grid = createEmptyGrid(16, 16);
  drawCircle(grid, 8, 8, 7, [155, 181, 189, 175]);
  drawCircle(grid, 8, 8, 4, [72, 66, 105, 185]);
  drawCircle(grid, 5, 5, 2, C.whiteWarm);
  drawLine(grid, 5, 10, 11, 4, [255, 228, 138, 180]);
  drawLine(grid, 8, 3, 7, 9, C.paperLight);
  drawLine(grid, 7, 9, 12, 13, C.paperLight);
  setPixel(grid, 10, 10, C.lantern);
  return outlineNonTransparent(grid, C.paperEdge);
}

export function createAddresslessBladeProjectile(): PixelGrid {
  const grid = createEmptyGrid(18, 12);
  fillPolygon(grid, [[1, 2], [13, 2], [17, 6], [13, 10], [1, 9]], C.paperLight);
  drawLine(grid, 2, 3, 8, 7, C.paperLine);
  drawLine(grid, 13, 3, 8, 7, C.paperLine);
  drawCircle(grid, 8, 7, 2, C.healRed);
  fillPolygon(grid, [[12, 3], [17, 6], [12, 9]], [255, 228, 138, 205]);
  return outlineNonTransparent(grid, C.paperEdge);
}

export function createTailwindPlaneProjectile(): PixelGrid {
  const grid = createEmptyGrid(20, 16);
  drawLine(grid, 1, 5, 8, 5, [142, 183, 155, 160]);
  drawLine(grid, 2, 10, 9, 10, [142, 183, 155, 150]);
  fillPolygon(grid, [[3, 8], [18, 3], [14, 8], [18, 13]], C.paperLight);
  fillPolygon(grid, [[3, 8], [14, 8], [8, 12]], C.paper);
  drawLine(grid, 4, 8, 18, 3, C.paperLine);
  drawLine(grid, 4, 8, 18, 13, C.paperLine);
  drawDiamond(grid, 5, 12, 2, [142, 183, 155, 180]);
  return outlineNonTransparent(grid, C.paperEdge);
}

export const generatedPixelAssets: PixelAssetSpec[] = [
  { id: 'pickup_memory_fragment', path: 'assets/sprites/pickups/pickup_memory_fragment_12.png', width: 12, height: 12, kind: 'pickup', quality: 'generated-final', create: createMemoryFragment },
  { id: 'pickup_heal_paper', path: 'assets/sprites/pickups/pickup_heal_paper_14.png', width: 14, height: 14, kind: 'pickup', quality: 'generated-final', create: createHealPaper },
  { id: 'pickup_capsule', path: 'assets/sprites/pickups/pickup_capsule_16.png', width: 16, height: 16, kind: 'pickup', quality: 'generated-final', create: createCapsule },
  { id: 'rare_name_tag', path: 'assets/sprites/pickups/rare_name_tag_16.png', width: 16, height: 16, kind: 'rare', quality: 'generated-final', create: createNameTag },
  { id: 'rare_cracked_lens', path: 'assets/sprites/pickups/rare_cracked_lens_16.png', width: 16, height: 16, kind: 'rare', quality: 'generated-final', create: createCrackedLens },
  { id: 'rare_sealed_letter', path: 'assets/sprites/pickups/rare_sealed_letter_16.png', width: 16, height: 16, kind: 'rare', quality: 'generated-final', create: createSealedLetter },
  { id: 'rare_wind_mark', path: 'assets/sprites/pickups/rare_wind_mark_16.png', width: 16, height: 16, kind: 'rare', quality: 'generated-final', create: createWindMark },
  { id: 'weapon_night_pencil', path: 'assets/sprites/weapons/weapon_night_pencil_projectile.png', width: 16, height: 8, kind: 'weapon', quality: 'generated-final', create: createNightPencilProjectile },
  { id: 'weapon_marble', path: 'assets/sprites/weapons/weapon_marble_projectile.png', width: 12, height: 12, kind: 'weapon', quality: 'generated-final', create: createMarbleProjectile },
  { id: 'weapon_stardust', path: 'assets/sprites/weapons/weapon_stardust_projectile.png', width: 12, height: 12, kind: 'weapon', quality: 'generated-final', create: createStardustProjectile },
  { id: 'weapon_postcard_blade', path: 'assets/sprites/weapons/weapon_postcard_blade_projectile.png', width: 16, height: 10, kind: 'weapon', quality: 'generated-final', create: createPostcardBladeProjectile },
  { id: 'weapon_bookmark_orbit', path: 'assets/sprites/weapons/weapon_bookmark_orbit.png', width: 12, height: 16, kind: 'weapon', quality: 'generated-final', create: createBookmarkOrbit },
  { id: 'weapon_ink_area', path: 'assets/sprites/weapons/weapon_ink_area_tile.png', width: 64, height: 64, kind: 'weapon', quality: 'generated-final', create: createInkAreaTile },
  { id: 'weapon_paper_airplane', path: 'assets/sprites/weapons/weapon_paper_airplane_projectile.png', width: 16, height: 12, kind: 'weapon', quality: 'generated-final', create: createPaperAirplaneProjectile },
  { id: 'weapon_streetlamp_area', path: 'assets/sprites/weapons/weapon_streetlamp_area_tile.png', width: 128, height: 128, kind: 'weapon', quality: 'generated-final', create: createStreetlampAreaTile },
  { id: 'enemy_ink_blob', path: 'assets/sprites/enemies/enemy_ink_blob_24.png', width: 24, height: 24, kind: 'enemy', quality: 'generated-final', create: createEnemyInkBlob },
  { id: 'enemy_paper_scrap', path: 'assets/sprites/enemies/enemy_paper_scrap_24.png', width: 24, height: 24, kind: 'enemy', quality: 'generated-final', create: createEnemyPaperScrap },
  { id: 'enemy_signpost', path: 'assets/sprites/enemies/enemy_signpost_24.png', width: 24, height: 24, kind: 'enemy', quality: 'generated-final', create: createEnemySignpost },
  { id: 'enemy_capsule', path: 'assets/sprites/enemies/enemy_capsule_24.png', width: 24, height: 24, kind: 'enemy', quality: 'generated-final', create: createEnemyCapsule },
  { id: 'enemy_haze', path: 'assets/sprites/enemies/enemy_haze_24.png', width: 24, height: 24, kind: 'enemy', quality: 'generated-final', create: createEnemyHaze },
  // yui_idle / yui_move / yui_hurt are hand-final candidates: the real art lives in assets/source/aseprite/player/*.aseprite
  // and the PNG is produced by `pnpm aseprite:export:yui`. create() stays as the draft fallback used by tests
  // and asset verification; generate-pixel-assets skips writing the PNG for hand-final entries.
  { id: 'yui_idle', path: 'assets/sprites/player/yui_idle_32.png', width: 32, height: 32, kind: 'player', quality: 'hand-final', create: createYuiGeneratedDraft },
  { id: 'yui_move', path: 'assets/sprites/player/yui_move_32.png', width: 32, height: 32, kind: 'player', quality: 'hand-final', create: createYuiMoveGeneratedDraft },
  { id: 'yui_hurt', path: 'assets/sprites/player/yui_hurt_32.png', width: 32, height: 32, kind: 'player', quality: 'hand-final', create: createYuiHurtGeneratedDraft },
  { id: 'yui_ultimate', path: 'assets/sprites/player/yui_ultimate_32.png', width: 32, height: 32, kind: 'player', quality: 'generated-draft', create: createYuiUltimateGeneratedDraft },
  { id: 'enemy_elite_label', path: 'assets/sprites/enemies/enemy_elite_label_32.png', width: 32, height: 32, kind: 'enemy', quality: 'generated-draft', create: createEnemyEliteLabel },
  { id: 'bg_stage1_paper_night', path: 'assets/sprites/tiles/bg_stage1_paper_night_tile.png', width: 128, height: 128, kind: 'tile', quality: 'generated-draft', create: createPaperNightTile },
  { id: 'ui_card_paper_normal', path: 'assets/sprites/ui/ui_card_paper_normal.png', width: 320, height: 144, kind: 'ui', quality: 'generated-draft', create: createUiPaperCard },
  { id: 'ui_card_paper_good', path: 'assets/sprites/ui/ui_card_paper_good.png', width: 320, height: 144, kind: 'ui', quality: 'generated-final', create: createUiPaperCardGood },
  { id: 'ui_card_paper_rare', path: 'assets/sprites/ui/ui_card_paper_rare.png', width: 320, height: 144, kind: 'ui', quality: 'generated-final', create: createUiPaperCardRare },
  { id: 'evolved_unfinished_line', path: 'assets/sprites/evolved/evolved_unfinished_line_projectile.png', width: 24, height: 10, kind: 'weapon', quality: 'generated-draft', create: createUnfinishedLineProjectile },
  { id: 'evolved_north_star_lantern', path: 'assets/sprites/evolved/evolved_north_star_lantern_projectile.png', width: 16, height: 16, kind: 'weapon', quality: 'generated-draft', create: createNorthStarLanternProjectile },
  { id: 'evolved_dawn_ink_lamp', path: 'assets/sprites/evolved/evolved_dawn_ink_lamp_area.png', width: 128, height: 128, kind: 'weapon', quality: 'generated-draft', create: createDawnInkLampArea },
  { id: 'awakened_unforgotten_name', path: 'assets/sprites/evolved/awakened_unforgotten_name_projectile.png', width: 24, height: 12, kind: 'weapon', quality: 'generated-draft', create: createUnforgottenNameProjectile },
  { id: 'awakened_memory_marble', path: 'assets/sprites/evolved/awakened_memory_marble_projectile.png', width: 16, height: 16, kind: 'weapon', quality: 'generated-draft', create: createMemoryMarbleProjectile },
  { id: 'awakened_addressless_blade', path: 'assets/sprites/evolved/awakened_addressless_blade_projectile.png', width: 18, height: 12, kind: 'weapon', quality: 'generated-draft', create: createAddresslessBladeProjectile },
  { id: 'awakened_tailwind_plane', path: 'assets/sprites/evolved/awakened_tailwind_plane_projectile.png', width: 20, height: 16, kind: 'weapon', quality: 'generated-draft', create: createTailwindPlaneProjectile },
];

function drawRectOutline(grid: PixelGrid, x: number, y: number, width: number, height: number, color: PixelColor): void {
  drawLine(grid, x, y, x + width - 1, y, color);
  drawLine(grid, x, y + height - 1, x + width - 1, y + height - 1, color);
  drawLine(grid, x, y, x, y + height - 1, color);
  drawLine(grid, x + width - 1, y, x + width - 1, y + height - 1, color);
}

function drawEllipse(grid: PixelGrid, cx: number, cy: number, rx: number, ry: number, color: PixelColor): void {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
      if (((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2) <= 1) setPixel(grid, x, y, color);
    }
  }
}

function drawStar(grid: PixelGrid, cx: number, cy: number, radius: number, color: PixelColor, edge: PixelColor): void {
  const points = [
    [cx, cy - radius],
    [cx + 2, cy - 2],
    [cx + radius, cy - 2],
    [cx + 3, cy + 1],
    [cx + 4, cy + radius],
    [cx, cy + 4],
    [cx - 4, cy + radius],
    [cx - 3, cy + 1],
    [cx - radius, cy - 2],
    [cx - 2, cy - 2],
  ];
  fillPolygon(grid, points, edge);
  fillPolygon(grid, points.map(([x, y]) => [Math.round(cx + (x - cx) * 0.72), Math.round(cy + (y - cy) * 0.72)]), color);
}

function fillPolygon(grid: PixelGrid, points: number[][], color: PixelColor): void {
  const minY = Math.floor(Math.min(...points.map((point) => point[1])));
  const maxY = Math.ceil(Math.max(...points.map((point) => point[1])));
  for (let y = minY; y <= maxY; y += 1) {
    const xs: number[] = [];
    for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
      const [xi, yi] = points[i];
      const [xj, yj] = points[j];
      if ((yi > y) !== (yj > y)) xs.push(((xj - xi) * (y - yi)) / (yj - yi) + xi);
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i < xs.length; i += 2) {
      for (let x = Math.ceil(xs[i]); x <= Math.floor(xs[i + 1]); x += 1) setPixel(grid, x, y, color);
    }
  }
}
