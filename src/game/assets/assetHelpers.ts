import type Phaser from 'phaser';
import { assetById, type AssetId } from './assetManifest';

/** そのアセット画像が Phaser に読み込まれているか。 */
export function hasAsset(scene: Phaser.Scene, id: AssetId): boolean {
  return scene.textures.exists(id);
}

/**
 * 画像があれば Image を1枚返す（指定サイズに収める）。無ければ null。
 * 呼び出し側は null のとき従来の Graphics fallback を描く。
 */
export function spriteOrNull(
  scene: Phaser.Scene,
  id: AssetId | undefined,
  displayW?: number,
  displayH?: number,
): Phaser.GameObjects.Image | null {
  if (!id || !scene.textures.exists(id)) return null;
  const img = scene.add.image(0, 0, id);
  if (displayW != null && displayH != null) img.setDisplaySize(displayW, displayH);
  return img;
}

export type AssetStatus = 'image' | 'fallback' | 'missing';

/** VisualGallery 用: 実画像 / fallback / 欠品 を判定する。 */
export function assetStatus(scene: Phaser.Scene, id: AssetId): AssetStatus {
  if (scene.textures.exists(id)) return 'image';
  return assetById.get(id)?.fallback ? 'fallback' : 'missing';
}
