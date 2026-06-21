import { cleanupBackground, type BackgroundColor } from './background-cleanup.ts';
import { cleanupComponents, type Bounds } from './components.ts';
import { pixelOffset, type RgbaImage } from './png-rgba.ts';

export type PreparedCell = {
  index: number;
  image: RgbaImage;
  contentBounds: Bounds | null;
  anchorBounds: Bounds | null;
  componentCount: number;
  removedPixels: number;
  background: BackgroundColor;
};

function extractCell(source: RgbaImage, cellIndex: number, columns: number, cellSize: number): RgbaImage {
  const cellX = (cellIndex % columns) * cellSize;
  const cellY = Math.floor(cellIndex / columns) * cellSize;
  const data = new Uint8Array(cellSize * cellSize * 4);
  for (let y = 0; y < cellSize; y += 1) {
    const sourceStart = pixelOffset(source, cellX, cellY + y);
    data.set(source.data.subarray(sourceStart, sourceStart + cellSize * 4), y * cellSize * 4);
  }
  return { width: cellSize, height: cellSize, data };
}

export function prepareCell(source: RgbaImage, index: number, columns: number, cellSize: number): PreparedCell {
  const image = extractCell(source, index, columns, cellSize);
  const backgroundResult = cleanupBackground(image);
  const componentResult = cleanupComponents(image);
  return {
    index,
    image,
    contentBounds: componentResult.contentBounds,
    anchorBounds: componentResult.anchorBounds,
    componentCount: componentResult.componentCount,
    removedPixels: backgroundResult.removedPixels + componentResult.removedPixels,
    background: backgroundResult.background,
  };
}

export type { Bounds } from './components.ts';
