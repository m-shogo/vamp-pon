export const ENEMY_PROTOTYPE_SHEET = {
  id: 'enemy_48_prototype_runtime',
  paths: [
    'assets/prototypes/sprite-sheets/enemies-original/最初のモンスター横横向き.png',
    'assets/prototypes/sprite-sheets/enemies-original/最初のモンスター横向き.png',
  ],
  frameWidth: 180,
  frameHeight: 180,
  endFrame: 47,
} as const;

export type EnemyPrototypeFrame = {
  /** 0-based frame index in the canonical 8x6 / 48-cell sheet. */
  frame: number;
  /** Display size of the whole 180px cell. Transparent padding remains intact. */
  displayWidth: number;
  displayHeight: number;
  /** Small anchor correction for uneven transparent padding. */
  offsetY?: number;
};

/**
 * Legacy runtime visual ids -> canonical prototype-sheet frames.
 *
 * This is intentionally a visual bridge only. Gameplay ids, hit radii, stats and wave logic
 * are left untouched until the staged runtime migration is implemented.
 */
export const ENEMY_PROTOTYPE_FRAME_BY_ASSET_ID: Readonly<Record<string, EnemyPrototypeFrame>> = {
  enemy_ink_blob: { frame: 0, displayWidth: 68, displayHeight: 68, offsetY: 2 },
  enemy_paper_scrap: { frame: 2, displayWidth: 66, displayHeight: 66, offsetY: 3 },
  enemy_haze: { frame: 3, displayWidth: 72, displayHeight: 72, offsetY: 4 },
  enemy_capsule: { frame: 12, displayWidth: 72, displayHeight: 72, offsetY: 3 },
  enemy_signpost: { frame: 17, displayWidth: 70, displayHeight: 70, offsetY: -2 },
  enemy_elite_label: { frame: 25, displayWidth: 92, displayHeight: 92, offsetY: 2 },
};

export function enemyPrototypeFrameForAsset(assetId: string | undefined): EnemyPrototypeFrame | undefined {
  return assetId ? ENEMY_PROTOTYPE_FRAME_BY_ASSET_ID[assetId] : undefined;
}
