import { describe, expect, it } from 'vitest';
import { assetManifest, WEAPON_ASSET } from '../assetManifest';
import {
  createEmptyGrid,
  createMemoryFragment,
  generatedPixelAssets,
  type PixelColor,
  type PixelGrid,
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

  it('全 generatedPixelAssets が visible pixel を持つ', () => {
    for (const spec of generatedPixelAssets) {
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

  it('生成予定数と品質区分が基準を満たす', () => {
    const finalN = generatedPixelAssets.filter((asset) => asset.quality === 'generated-final').length;
    const draftN = generatedPixelAssets.filter((asset) => asset.quality === 'generated-draft').length;
    expect(generatedPixelAssets.length).toBeGreaterThanOrEqual(30);
    expect(finalN).toBeGreaterThanOrEqual(20);
    expect(draftN).toBeGreaterThanOrEqual(7);
  });

  it('生成対象は public/assets/sprites 配下のPNGとして定義されている', () => {
    for (const spec of generatedPixelAssets) {
      expect(spec.path.startsWith('assets/sprites/'), spec.id).toBe(true);
      expect(spec.path.endsWith('.png'), spec.id).toBe(true);
    }
  });

  it('主要素材ごとにサイズが正しい', () => {
    const expected = new Map([
      ['weapon_bookmark_orbit', '12x16'],
      ['weapon_ink_area', '64x64'],
      ['weapon_streetlamp_area', '128x128'],
      ['evolved_dawn_ink_lamp', '128x128'],
      ['awakened_tailwind_plane', '20x16'],
      ['ui_card_paper_rare', '320x144'],
    ]);
    for (const [id, size] of expected) {
      const asset = generatedPixelAssets.find((item) => item.id === id);
      expect(asset ? `${asset.width}x${asset.height}` : '', id).toBe(size);
    }
  });

  it('generated-final は完全な単色素材ではない', () => {
    for (const spec of generatedPixelAssets.filter((asset) => asset.quality === 'generated-final')) {
      expect(visibleColorCount(spec.create({ seed: 20260614 })), spec.id).toBeGreaterThan(1);
    }
  });

  it('進化/合体/覚醒素材の id が WEAPON_ASSET と対応している', () => {
    const weaponAssetIds = new Set(Object.values(WEAPON_ASSET));
    const evolved = generatedPixelAssets.filter((asset) => asset.id.startsWith('evolved_') || asset.id.startsWith('awakened_'));
    expect(evolved.length).toBeGreaterThanOrEqual(7);
    for (const asset of evolved) expect(weaponAssetIds.has(asset.id), asset.id).toBe(true);
  });
});

function visibleColorCount(grid: PixelGrid): number {
  const colors = new Set<string>();
  for (const pixel of grid.pixels) {
    if (!pixel || pixel[3] === 0) continue;
    colors.add(colorKey(pixel));
  }
  return colors.size;
}

function colorKey(pixel: PixelColor): string {
  return pixel.join(',');
}
