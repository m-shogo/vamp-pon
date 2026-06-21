export type EnemyPrototypeFacing = 'front' | 'left';

const ENEMY_PROTOTYPE_SHEET_FRAME = {
  frameWidth: 180,
  frameHeight: 180,
  endFrame: 47,
} as const;

export const ENEMY_PROTOTYPE_SHEETS = {
  front: {
    id: 'enemy_48_prototype_front',
    path: 'assets/prototypes/sprite-sheets/enemies-original/enemy-48-right-1440x1080-rgba.png',
    ...ENEMY_PROTOTYPE_SHEET_FRAME,
  },
  left: {
    id: 'enemy_48_prototype_left',
    path: 'assets/prototypes/sprite-sheets/enemies-original/enemy-48-left-1440x1080-rgba.png',
    ...ENEMY_PROTOTYPE_SHEET_FRAME,
  },
} as const;

/**
 * Latest runtime-facing enemy prototype sheets.
 *
 * These live under `public/assets/prototypes/sprite-sheets/enemies-original/`.
 * They are the current prototype runtime source, not production / hand-final art.
 */
export const ENEMY_PROTOTYPE_SHEET_LIST = [
  ENEMY_PROTOTYPE_SHEETS.front,
  ENEMY_PROTOTYPE_SHEETS.left,
] as const;

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

/**
 * Side art is used for horizontal and ordinary diagonal movement.
 * Front art is kept for strongly vertical movement so enemies do not snap sideways while
 * approaching from above or below.
 */
export function enemyPrototypeFacingForMotion(dirX: number, dirY: number): EnemyPrototypeFacing {
  const horizontal = Math.abs(dirX);
  const vertical = Math.abs(dirY);
  if (horizontal <= 0.05) return 'front';
  return horizontal >= vertical * 0.65 ? 'left' : 'front';
}
