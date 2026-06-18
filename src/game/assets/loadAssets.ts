import type Phaser from 'phaser';
import { assetManifest } from './assetManifest';
import { allPrototypeAssets } from './prototypeManifest';
import { ENEMY_PROTOTYPE_SHEET_LIST } from './enemyPrototypeSheet';
import { loadBackgroundManifest, getPreviewBackgrounds, getBackgroundByStageNumber } from './backgroundManifest';
import { stageBackgroundTextureKey } from '../ui/background';

/**
 * 実在する画像だけを Phaser のロードキューに積む。
 * path を持たないentryはGraphics fallback専用。
 */
export async function queueExistingAssets(scene: Phaser.Scene): Promise<number> {
  let queued = 0;
  const pendingKeys = new Set<string>();

  await Promise.all(
    assetManifest.map(async (asset) => {
      if (!asset.path) return;
      if (!reserveTextureKey(scene, pendingKeys, asset.id)) return;
      if (!(await fileExists(asset.path))) return;
      scene.load.image(asset.id, asset.path);
      queued += 1;
    }),
  );

  await Promise.all(
    ENEMY_PROTOTYPE_SHEET_LIST.map(async (sheet) => {
      if (!reserveTextureKey(scene, pendingKeys, sheet.id)) return;
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

export async function queuePrototypeAssets(scene: Phaser.Scene): Promise<number> {
  let queued = 0;
  const pendingKeys = new Set<string>();

  await Promise.all(
    allPrototypeAssets.map(async (asset) => {
      if (!reserveTextureKey(scene, pendingKeys, asset.id)) return;
      if (!(await fileExists(asset.path))) return;
      scene.load.image(asset.id, asset.path);
      queued += 1;
    }),
  );

  return queued;
}

export async function queueStageBackgrounds(
  scene: Phaser.Scene,
  stageNumber?: number | null,
): Promise<number> {
  const manifest = await loadBackgroundManifest();
  if (!manifest) return 0;

  let queued = 0;
  const pendingKeys = new Set<string>();
  const entries = stageNumber != null
    ? [getBackgroundByStageNumber(manifest, stageNumber)].filter((entry) => entry?.enabledForRuntime)
    : getPreviewBackgrounds(manifest);

  await Promise.all(
    entries.map(async (entry) => {
      if (!entry) return;
      const key = stageBackgroundTextureKey(entry);
      if (!reserveTextureKey(scene, pendingKeys, key)) return;
      if (!(await fileExists(entry.environment))) return;
      scene.load.image(key, entry.environment);
      queued += 1;
    }),
  );

  return queued;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    if (!response.ok) return false;
    const type = response.headers.get('content-type') ?? '';
    return !type.includes('text/html');
  } catch {
    return false;
  }
}

function reserveTextureKey(
  scene: Phaser.Scene,
  pendingKeys: Set<string>,
  key: string,
): boolean {
  if (pendingKeys.has(key) || scene.textures.exists(key)) return false;
  pendingKeys.add(key);
  return true;
}
