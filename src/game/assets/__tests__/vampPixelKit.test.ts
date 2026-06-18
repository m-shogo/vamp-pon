import { describe, expect, it } from 'vitest';
import { assetManifest } from '../assetManifest';
import {
  createEmptyGrid,
  createMemoryFragment,
  generatedPixelAssets,
  hasVisiblePixel,
  pixelGridToRgbaBuffer,
} from '../vampPixelKit';

describe('vampPixelKit', () => {
  it('creates grids with the requested dimensions', () => {
    const grid = createEmptyGrid(7, 5);
    expect(grid.width).toBe(7);
    expect(grid.height).toBe(5);
    expect(grid.pixels).toHaveLength(35);
    expect(pixelGridToRgbaBuffer(grid)).toHaveLength(140);
  });

  it('is deterministic for a fixed seed', () => {
    const a = createMemoryFragment({ seed: 123 });
    const b = createMemoryFragment({ seed: 123 });
    expect(pixelGridToRgbaBuffer(a)).toEqual(pixelGridToRgbaBuffer(b));
  });

  it('creates visible pixels for every legacy generator', () => {
    for (const spec of generatedPixelAssets) {
      expect(hasVisiblePixel(spec.create({ seed: 20260614 })), spec.id).toBe(true);
    }
  });

  it('keeps legacy generator ids as fallback-only manifest entries', () => {
    for (const spec of generatedPixelAssets) {
      const manifest = assetManifest.find((asset) => asset.id === spec.id);
      expect(manifest, spec.id).toBeTruthy();
      expect(manifest?.path, spec.id).toBeUndefined();
      expect(manifest?.fallback, spec.id).toBe(true);
      expect(manifest?.width, spec.id).toBe(spec.width);
      expect(manifest?.height, spec.id).toBe(spec.height);
    }
  });
});
