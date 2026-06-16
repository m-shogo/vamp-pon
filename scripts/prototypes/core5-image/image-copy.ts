import { blankImage, pixelOffset, type RgbaImage } from './png-rgba.ts';
import type { Bounds } from './components.ts';

export function cropImage(image: RgbaImage, bounds: Bounds): RgbaImage {
  const cropped = blankImage(bounds.width, bounds.height);
  for (let row = 0; row < bounds.height; row += 1) {
    const from = pixelOffset(image, bounds.x, bounds.y + row);
    const to = row * bounds.width * 4;
    cropped.data.set(image.data.subarray(from, from + bounds.width * 4), to);
  }
  return cropped;
}

export function pasteImage(destination: RgbaImage, source: RgbaImage, x: number, y: number): void {
  const sourceX = Math.max(0, -x);
  const destinationX = Math.max(0, x);
  const width = Math.min(source.width - sourceX, destination.width - destinationX);
  if (width <= 0) return;

  const firstRow = Math.max(0, -y);
  const lastRow = Math.min(source.height, destination.height - y);
  for (let row = firstRow; row < lastRow; row += 1) {
    const from = pixelOffset(source, sourceX, row);
    const to = pixelOffset(destination, destinationX, y + row);
    destination.data.set(source.data.subarray(from, from + width * 4), to);
  }
}
