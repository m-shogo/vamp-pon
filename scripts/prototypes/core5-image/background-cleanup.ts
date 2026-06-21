import { pixelOffset, type RgbaImage } from './png-rgba.ts';

export type BackgroundColor = [number, number, number];

function clearPixel(image: RgbaImage, x: number, y: number): void {
  const offset = pixelOffset(image, x, y);
  image.data.fill(0, offset, offset + 4);
}

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function chroma(r: number, g: number, b: number): number {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function median(values: number[]): number {
  if (values.length === 0) return 255;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function estimateBackground(image: RgbaImage): BackgroundColor {
  const red: number[] = [];
  const green: number[] = [];
  const blue: number[] = [];
  const border = 5;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      if (x >= border && x < image.width - border && y >= border && y < image.height - border) continue;
      const offset = pixelOffset(image, x, y);
      if (image.data[offset + 3] < 16) continue;
      const r = image.data[offset];
      const g = image.data[offset + 1];
      const b = image.data[offset + 2];
      if (luminance(r, g, b) < 150) continue;
      red.push(r);
      green.push(g);
      blue.push(b);
    }
  }
  return [median(red), median(green), median(blue)];
}

function isBackground(image: RgbaImage, x: number, y: number, background: BackgroundColor): boolean {
  const offset = pixelOffset(image, x, y);
  if (image.data[offset + 3] < 16) return true;
  const r = image.data[offset];
  const g = image.data[offset + 1];
  const b = image.data[offset + 2];
  const light = luminance(r, g, b);
  const distance = Math.hypot(r - background[0], g - background[1], b - background[2]);
  const backgroundLight = luminance(...background);
  return (light >= 238 && chroma(r, g, b) <= 34) ||
    (distance <= 42 && light >= Math.max(165, backgroundLight - 58));
}

function lineStats(
  image: RgbaImage,
  axis: 'row' | 'column',
  position: number,
  background: BackgroundColor,
): { occupied: number; neutral: number; longestRun: number } {
  const length = axis === 'row' ? image.width : image.height;
  let occupied = 0;
  let neutral = 0;
  let longestRun = 0;
  let currentRun = 0;
  for (let index = 0; index < length; index += 1) {
    const x = axis === 'row' ? index : position;
    const y = axis === 'row' ? position : index;
    const offset = pixelOffset(image, x, y);
    if (image.data[offset + 3] >= 16 && !isBackground(image, x, y, background)) {
      occupied += 1;
      currentRun += 1;
      if (chroma(image.data[offset], image.data[offset + 1], image.data[offset + 2]) <= 48) neutral += 1;
      longestRun = Math.max(longestRun, currentRun);
    } else currentRun = 0;
  }
  return { occupied, neutral, longestRun };
}

function removeFrameLines(image: RgbaImage, background: BackgroundColor): number {
  const margin = 24;
  const rows = new Set<number>();
  const columns = new Set<number>();
  for (let position = 0; position < image.height; position += 1) {
    if (position >= margin && position < image.height - margin) continue;
    const stats = lineStats(image, 'row', position, background);
    if (stats.longestRun >= image.width * 0.68 ||
      (stats.occupied >= image.width * 0.72 && stats.neutral / Math.max(1, stats.occupied) >= 0.62)) rows.add(position);
  }
  for (let position = 0; position < image.width; position += 1) {
    if (position >= margin && position < image.width - margin) continue;
    const stats = lineStats(image, 'column', position, background);
    if (stats.longestRun >= image.height * 0.68 ||
      (stats.occupied >= image.height * 0.72 && stats.neutral / Math.max(1, stats.occupied) >= 0.62)) columns.add(position);
  }

  let removed = 0;
  for (const y of rows) for (let x = 0; x < image.width; x += 1) {
    if (image.data[pixelOffset(image, x, y) + 3] >= 16) removed += 1;
    clearPixel(image, x, y);
  }
  for (const x of columns) for (let y = 0; y < image.height; y += 1) {
    if (image.data[pixelOffset(image, x, y) + 3] >= 16) removed += 1;
    clearPixel(image, x, y);
  }
  for (let y = 0; y < image.height; y += 1) {
    clearPixel(image, 0, y);
    clearPixel(image, image.width - 1, y);
  }
  for (let x = 0; x < image.width; x += 1) {
    clearPixel(image, x, 0);
    clearPixel(image, x, image.height - 1);
  }
  return removed;
}

function floodClear(image: RgbaImage, background: BackgroundColor): number {
  const visited = new Uint8Array(image.width * image.height);
  const queue = new Int32Array(image.width * image.height);
  let head = 0;
  let tail = 0;
  const enqueue = (x: number, y: number): void => {
    if (x < 0 || y < 0 || x >= image.width || y >= image.height) return;
    const index = y * image.width + x;
    if (visited[index]) return;
    visited[index] = 1;
    if (isBackground(image, x, y, background)) queue[tail++] = index;
  };
  for (let x = 0; x < image.width; x += 1) {
    enqueue(x, 0);
    enqueue(x, image.height - 1);
  }
  for (let y = 1; y < image.height - 1; y += 1) {
    enqueue(0, y);
    enqueue(image.width - 1, y);
  }
  let removed = 0;
  while (head < tail) {
    const index = queue[head++];
    const x = index % image.width;
    const y = Math.floor(index / image.width);
    if (image.data[index * 4 + 3] >= 16) removed += 1;
    clearPixel(image, x, y);
    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }
  return removed;
}

export function cleanupBackground(image: RgbaImage): { removedPixels: number; background: BackgroundColor } {
  const background = estimateBackground(image);
  let removedPixels = removeFrameLines(image, background);
  removedPixels += floodClear(image, background);
  removedPixels += removeFrameLines(image, background);
  removedPixels += floodClear(image, background);
  return { removedPixels, background };
}
