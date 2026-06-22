import { describe, expect, it, vi } from 'vitest';
import { collectionSections } from '../data/collectionSections';
import { getCollectionSectionBackdrop } from '../data/collectionAtlasAssets';
import { renderCollectionAtlasBackdrop } from './CollectionAtlasBackdropRenderer';

describe('CollectionAtlasBackdropRenderer', () => {
  it('背景textureが無い場合はfalseを返して何も追加しない', () => {
    const scene = createMockScene(new Set<string>());
    const root = createMockRoot();
    const result = renderCollectionAtlasBackdrop(
      scene as unknown as Phaser.Scene,
      root as unknown as Phaser.GameObjects.Container,
      collectionSections[0],
    );

    expect(result).toBe(false);
    expect(scene.add.image).not.toHaveBeenCalled();
    expect(root.add).not.toHaveBeenCalled();
  });

  it('背景textureがある場合だけ画像をrootへ追加する', () => {
    const asset = getCollectionSectionBackdrop(collectionSections[0].id);
    expect(asset).toBeDefined();
    const scene = createMockScene(new Set<string>([asset!.key]));
    const root = createMockRoot();

    const result = renderCollectionAtlasBackdrop(
      scene as unknown as Phaser.Scene,
      root as unknown as Phaser.GameObjects.Container,
      collectionSections[0],
    );

    expect(result).toBe(true);
    expect(scene.add.image).toHaveBeenCalledWith(195, 422, asset!.key);
    expect(root.add).toHaveBeenCalledTimes(1);
  });
});

function createMockScene(existingTextures: Set<string>) {
  const image = {
    setDisplaySize: vi.fn().mockReturnThis(),
    setAlpha: vi.fn().mockReturnThis(),
    setDepth: vi.fn().mockReturnThis(),
  };

  return {
    textures: {
      exists: vi.fn((key: string) => existingTextures.has(key)),
    },
    add: {
      image: vi.fn(() => image),
    },
  };
}

function createMockRoot() {
  return {
    add: vi.fn(),
  };
}
