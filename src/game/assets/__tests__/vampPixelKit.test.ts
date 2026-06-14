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
  it('PixelGrid のサイズが正しい', () => {
    const grid = createEmptyGrid(7, 5);
    expect(grid.width).toBe(7);
    expect(grid.height).toBe(5);
    expect(grid.pixels).toHaveLength(35);
    expect(pixelGridToRgbaBuffer(grid)).toHaveLength(7 * 5 * 4);
  });

  it('seed が同じなら同じ出力', () => {
    const a = createMemoryFragment({ seed: 123 });
    const b = createMemoryFragment({ seed: 123 });
    expect(pixelGridToRgbaBuffer(a)).toEqual(pixelGridToRgbaBuffer(b));
  });

  it('generated-final 素材が透明だけではない', () => {
    for (const spec of generatedPixelAssets.filter((asset) => asset.quality === 'generated-final')) {
      expect(hasVisiblePixel(spec.create({ seed: 20260614 })), spec.id).toBe(true);
    }
  });

  it('生成PNGの path が assetManifest と一致', () => {
    for (const spec of generatedPixelAssets) {
      const manifest = assetManifest.find((asset) => asset.id === spec.id);
      expect(manifest?.path, spec.id).toBe(spec.path);
      expect(manifest?.width, spec.id).toBe(spec.width);
      expect(manifest?.height, spec.id).toBe(spec.height);
    }
  });

  it('生成予定数が15以上', () => {
    expect(generatedPixelAssets.length).toBeGreaterThanOrEqual(15);
  });

  it('生成対象は public/assets/sprites 配下のPNGとして定義されている', () => {
    for (const spec of generatedPixelAssets) {
      expect(spec.path.startsWith('assets/sprites/'), spec.id).toBe(true);
      expect(spec.path.endsWith('.png'), spec.id).toBe(true);
    }
  });
});
