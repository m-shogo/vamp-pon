import type Phaser from 'phaser';
import { assetManifest } from './assetManifest';
import { allPrototypeAssets } from './prototypeManifest';
import { ENEMY_PROTOTYPE_SHEET_LIST } from './enemyPrototypeSheet';

/**
 * 「実在する画像だけ」を Phaser のロードキューに積む。
 * 未配置のファイルは fetch(HEAD) で除外するため、404 で大量のloaderrorを出さない。
 * 画像が無い要素は各 createXView / preview が Graphics fallback を描く。
 *
 * @returns 積んだ件数（0 ならロード不要）
 */
export async function queueExistingAssets(scene: Phaser.Scene): Promise<number> {
  let queued = 0;
  await Promise.all(
    assetManifest.map(async (a) => {
      if (!(await fileExists(a.path))) return;
      scene.load.image(a.id, a.path);
      queued += 1;
    }),
  );

  // 48体シートは正面・左向きを別テクスチャとして読み込む。
  // 右向き専用画像は使わず、ゲーム中に左向き画像を flipX して描画する。
  await Promise.all(
    ENEMY_PROTOTYPE_SHEET_LIST.map(async (sheet) => {
      if (!(await fileExists(sheet.path))) return;
      scene.load.spritesheet(sheet.id, sheet.path, {
        frameWidth: sheet.frameWidth,
        frameHeight: sheet.frameHeight,
        endFrame: sheet.endFrame,
      });
      queued += 1;
    }),
  );

  return queued;
}

/**
 * 比較用 prototype 画像をロードキューに積む（ギャラリー / Core5 preview 用）。
 * 本番 assetManifest とは別管理。存在するものだけ積む。
 *
 * @returns 積んだ件数
 */
export async function queuePrototypeAssets(scene: Phaser.Scene): Promise<number> {
  let queued = 0;
  await Promise.all(
    allPrototypeAssets.map(async (a) => {
      if (!(await fileExists(a.path))) return;
      scene.load.image(a.id, a.path);
      queued += 1;
    }),
  );
  return queued;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    const res = await fetch(path, { method: 'HEAD' });
    if (!res.ok) return false;
    // Vite dev が index.html を返すケース等を弾く
    const type = res.headers.get('content-type') ?? '';
    return !type.includes('text/html');
  } catch {
    return false;
  }
}
