import type Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { getCollectionSectionBackdrop } from '../data/collectionAtlasAssets';
import type { CollectionSection } from '../data/collectionSections';
import { hasCollectionAtlasTexture } from './collectionAtlasAssetsLoader';

export type CollectionAtlasBackdropRenderOptions = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  alpha?: number;
};

const DEFAULT_OPTIONS: Required<CollectionAtlasBackdropRenderOptions> = {
  x: GAME_WIDTH / 2,
  y: GAME_HEIGHT / 2,
  width: 332,
  height: 522,
  alpha: 0.28,
};

/**
 * 図鑑タブ背景PNGが読み込まれている場合だけ表示する。
 * PNGが無い/未ロードの場合は false を返し、既存のPhaser図形フォールバックを使う。
 */
export function renderCollectionAtlasBackdrop(
  scene: Phaser.Scene,
  root: Phaser.GameObjects.Container,
  section: CollectionSection,
  options: CollectionAtlasBackdropRenderOptions = {},
): boolean {
  const asset = getCollectionSectionBackdrop(section.id);
  if (!hasCollectionAtlasTexture(scene, asset)) return false;

  const resolved = { ...DEFAULT_OPTIONS, ...options };
  const image = scene.add.image(resolved.x, resolved.y, asset.key)
    .setDisplaySize(resolved.width, resolved.height)
    .setAlpha(resolved.alpha)
    .setDepth(-1);

  root.add(image);
  return true;
}
