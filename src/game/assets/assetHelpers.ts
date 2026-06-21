import type Phaser from 'phaser';
import { assetById, type AssetId } from './assetManifest';
import {
  ENEMY_PROTOTYPE_SHEET_LIST,
  ENEMY_PROTOTYPE_SHEETS,
  enemyPrototypeFrameForAsset,
} from './enemyPrototypeSheet';

/** そのアセット画像が Phaser に読み込まれているか。 */
export function hasAsset(scene: Phaser.Scene, id: AssetId): boolean {
  const prototypeFrame = enemyPrototypeFrameForAsset(id);
  return scene.textures.exists(id)
    || Boolean(
      prototypeFrame
      && ENEMY_PROTOTYPE_SHEET_LIST.some((sheet) => scene.textures.exists(sheet.id)),
    );
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
  if (prototypeFrame) {
    const initialSheet = scene.textures.exists(ENEMY_PROTOTYPE_SHEETS.front.id)
      ? ENEMY_PROTOTYPE_SHEETS.front
      : scene.textures.exists(ENEMY_PROTOTYPE_SHEETS.left.id)
        ? ENEMY_PROTOTYPE_SHEETS.left
        : null;

    if (initialSheet) {
      const img = scene.add.image(
        0,
        prototypeFrame.offsetY ?? 0,
        initialSheet.id,
        prototypeFrame.frame,
      );
      img.setDisplaySize(prototypeFrame.displayWidth, prototypeFrame.displayHeight);
      img.setData('assetSource', 'enemy-48-directional-sheet');
      img.setData('assetFrame', prototypeFrame.frame);
      img.setData('enemyPrototypeDirectional', true);
      img.setData('enemyPrototypeFrame', prototypeFrame.frame);
      return img;
    }
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
