import type Phaser from 'phaser';
import { assetManifest } from './assetManifest';
import { allPrototypeAssets } from './prototypeManifest';
import { ENEMY_PROTOTYPE_SHEET } from './enemyPrototypeSheet';

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

  // 48体シートは prototype-reference のまま、現行6敵の見た目だけを安全に差し替える。
  // 候補は新しい方を先に確認し、存在しない場合のみ旧ファイルへフォールバックする。
  const enemySheetPath = await firstExisting(ENEMY_PROTOTYPE_SHEET.paths);
  if (enemySheetPath) {
    scene.load.spritesheet(ENEMY_PROTOTYPE_SHEET.id, enemySheetPath, {
      frameWidth: ENEMY_PROTOTYPE_SHEET.frameWidth,
      frameHeight: ENEMY_PROTOTYPE_SHEET.frameHeight,
      endFrame: ENEMY_PROTOTYPE_SHEET.endFrame,
    });
    queued += 1;
  }

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

async function firstExisting(paths: readonly string[]): Promise<string | null> {
  for (const path of paths) {
    if (await fileExists(path)) return path;
  }
  return null;
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
