import type Phaser from 'phaser';
import { assetManifest } from './assetManifest';

/**
 * 「実在する画像だけ」を Phaser のロードキューに積む。
 * 未配置のファイルは fetch(HEAD) で除外するため、404 で大量のloaderrorを出さない。
 * 画像が無い要素は各 createXView が Graphics fallback を描く。
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
