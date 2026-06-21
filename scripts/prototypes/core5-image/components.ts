import type { RgbaImage } from './png-rgba.ts';

export type Bounds = { x: number; y: number; width: number; height: number };
type Component = Bounds & { pixels: number[]; pixelCount: number; touchesEdge: boolean };

function collectComponents(image: RgbaImage): Component[] {
  const visited = new Uint8Array(image.width * image.height);
  const queue = new Int32Array(image.width * image.height);
  const result: Component[] = [];

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const start = y * image.width + x;
      if (visited[start]) continue;
      visited[start] = 1;
      if (image.data[start * 4 + 3] < 16) continue;

      let head = 0;
      let tail = 0;
      queue[tail++] = start;
      const pixels: number[] = [];
      let minX = x;
      let minY = y;
      let maxX = x;
      let maxY = y;
      let touchesEdge = false;

      while (head < tail) {
        const index = queue[head++];
        pixels.push(index);
        const px = index % image.width;
        const py = Math.floor(index / image.width);
        minX = Math.min(minX, px);
        minY = Math.min(minY, py);
        maxX = Math.max(maxX, px);
        maxY = Math.max(maxY, py);
        touchesEdge ||= px === 0 || py === 0 || px === image.width - 1 || py === image.height - 1;

        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            if (dx === 0 && dy === 0) continue;
            const nx = px + dx;
            const ny = py + dy;
            if (nx < 0 || ny < 0 || nx >= image.width || ny >= image.height) continue;
            const next = ny * image.width + nx;
            if (visited[next]) continue;
            visited[next] = 1;
            if (image.data[next * 4 + 3] >= 16) queue[tail++] = next;
          }
        }
      }

      result.push({
        x: minX,
        y: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        pixels,
        pixelCount: pixels.length,
        touchesEdge,
      });
    }
  }

  return result;
}

function clearComponent(image: RgbaImage, component: Component): number {
  for (const index of component.pixels) image.data.fill(0, index * 4, index * 4 + 4);
  return component.pixelCount;
}

function combinedBounds(items: Component[]): Bounds | null {
  if (items.length === 0) return null;
  const x = Math.min(...items.map((item) => item.x));
  const y = Math.min(...items.map((item) => item.y));
  const right = Math.max(...items.map((item) => item.x + item.width));
  const bottom = Math.max(...items.map((item) => item.y + item.height));
  return { x, y, width: right - x, height: bottom - y };
}

export function cleanupComponents(image: RgbaImage): {
  removedPixels: number;
  contentBounds: Bounds | null;
  anchorBounds: Bounds | null;
  componentCount: number;
} {
  let removedPixels = 0;
  for (const component of collectComponents(image)) {
    const elongatedEdgeArtifact = component.touchesEdge &&
      (component.width >= image.width * 0.48 || component.height >= image.height * 0.48);
    if (component.pixelCount < 6 || elongatedEdgeArtifact) removedPixels += clearComponent(image, component);
  }

  const remaining = collectComponents(image).filter((component) => component.pixelCount >= 6);
  const anchor = [...remaining].sort((a, b) => b.pixelCount - a.pixelCount)[0] ?? null;
  return {
    removedPixels,
    contentBounds: combinedBounds(remaining),
    anchorBounds: anchor ? { x: anchor.x, y: anchor.y, width: anchor.width, height: anchor.height } : null,
    componentCount: remaining.length,
  };
}
