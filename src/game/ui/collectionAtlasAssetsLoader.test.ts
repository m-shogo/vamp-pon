import { describe, expect, it, vi } from 'vitest';
import { getCollectionAtlasImageAssets, preloadCollectionAtlasAssets } from './collectionAtlasAssetsLoader';

describe('collectionAtlasAssetsLoader', () => {
  it('図鑑画像アセット一覧のkeyは重複しない', () => {
    const assets = getCollectionAtlasImageAssets();
    const keys = assets.map((asset) => asset.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('既定では実画像ロードを行わない', () => {
    const scene = createMockScene();
    const assets = preloadCollectionAtlasAssets(scene as unknown as Phaser.Scene);
    expect(assets.length).toBeGreaterThan(0);
    expect(scene.load.image).not.toHaveBeenCalled();
  });

  it('enabled=true の場合のみ未登録textureをload.imageへ渡す', () => {
    const scene = createMockScene();
    const assets = preloadCollectionAtlasAssets(scene as unknown as Phaser.Scene, { enabled: true });
    expect(scene.load.image).toHaveBeenCalledTimes(assets.length);
    expect(scene.load.image).toHaveBeenCalledWith(assets[0].key, assets[0].path);
  });

  it('既にtextureがある画像は再ロードしない', () => {
    const assets = getCollectionAtlasImageAssets();
    const scene = createMockScene(new Set([assets[0].key]));
    preloadCollectionAtlasAssets(scene as unknown as Phaser.Scene, { enabled: true });
    expect(scene.load.image).not.toHaveBeenCalledWith(assets[0].key, assets[0].path);
  });
});

function createMockScene(existingTextures = new Set<string>()) {
  return {
    textures: {
      exists: vi.fn((key: string) => existingTextures.has(key)),
    },
    load: {
      image: vi.fn(),
    },
  };
}
