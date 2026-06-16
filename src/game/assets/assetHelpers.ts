import type Phaser from 'phaser';
import { assetById, type AssetId } from './assetManifest';
import { ENEMY_PROTOTYPE_SHEET, enemyPrototypeFrameForAsset } from './enemyPrototypeSheet';

/** そのアセット画像が Phaser に読み込まれているか。 */
export function hasAsset(scene: Phaser.Scene, id: AssetId): boolean {
  const prototypeFrame = enemyPrototypeFrameForAsset(id);
  return scene.textures.exists(id)
    || Boolean(prototypeFrame && scene.textures.exists(ENEMY_PROTOTYPE_SHEET.id));
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
  const prototypeFrame = enemyPrototypeFrameForAsset(id);
  if (prototypeFrame && scene.textures.exists(ENEMY_PROTOTYPE_SHEET.id)) {
    const img = scene.add.image(
      0,
      prototypeFrame.offsetY ?? 0,
      ENEMY_PROTOTYPE_SHEET.id,
      prototypeFrame.frame,
    );
    img.setDisplaySize(prototypeFrame.displayWidth, prototypeFrame.displayHeight);
    img.setData('assetSource', 'enemy-48-prototype-sheet');
    img.setData('assetFrame', prototypeFrame.frame);
    return img;
  }

  if (!id || !scene.textures.exists(id)) return null;
  const img = scene.add.image(0, 0, id);
  if (displayW != null && displayH != null) img.setDisplaySize(displayW, displayH);
  return img;
}

export type AssetStatus = 'image' | 'fallback' | 'missing';

/** VisualGallery 用: 実画像 / fallback / 欠品 を判定する。 */
export function assetStatus(scene: Phaser.Scene, id: AssetId): AssetStatus {
  if (hasAsset(scene, id)) return 'image';
  return assetById.get(id)?.fallback ? 'fallback' : 'missing';
}
