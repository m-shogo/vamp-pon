import type Phaser from 'phaser';
import {
  collectionAtlasSectionAssets,
  keeperEmblemAssets,
  lostItemCardAssets,
} from '../data/collectionAtlasAssets';
import type { CollectionAtlasImageAsset } from '../data/collectionAtlasAssets';

export type CollectionAtlasAssetLoadOptions = {
  /**
   * 現状はプロトタイプ素材が存在しないことも多いため、既定では読み込みを無効にする。
   * 実画像を配置した段階で true にする。
   */
  enabled?: boolean;
};

export function getCollectionAtlasImageAssets(): CollectionAtlasImageAsset[] {
  const assets = [
    ...collectionAtlasSectionAssets.map((asset) => asset.backdrop),
    ...lostItemCardAssets.map((asset) => asset.image),
    ...keeperEmblemAssets.map((asset) => asset.image),
  ];
  return dedupeAssetsByKey(assets);
}

export function preloadCollectionAtlasAssets(
  scene: Phaser.Scene,
  options: CollectionAtlasAssetLoadOptions = {},
): CollectionAtlasImageAsset[] {
  const assets = getCollectionAtlasImageAssets();
  if (!options.enabled) return assets;

  for (const asset of assets) {
    if (scene.textures.exists(asset.key)) continue;
    scene.load.image(asset.key, asset.path);
  }

  return assets;
}

export function hasCollectionAtlasTexture(scene: Phaser.Scene, asset: CollectionAtlasImageAsset | undefined): asset is CollectionAtlasImageAsset {
  return Boolean(asset && scene.textures.exists(asset.key));
}

function dedupeAssetsByKey(assets: CollectionAtlasImageAsset[]): CollectionAtlasImageAsset[] {
  const seen = new Set<string>();
  const deduped: CollectionAtlasImageAsset[] = [];
  for (const asset of assets) {
    if (seen.has(asset.key)) continue;
    seen.add(asset.key);
    deduped.push(asset);
  }
  return deduped;
}
