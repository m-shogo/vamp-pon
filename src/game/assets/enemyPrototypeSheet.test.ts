import { describe, expect, it } from 'vitest';
import {
  ENEMY_PROTOTYPE_FRAME_BY_ASSET_ID,
  ENEMY_PROTOTYPE_SHEET_LIST,
  ENEMY_PROTOTYPE_SHEETS,
  enemyPrototypeFacingForMotion,
  enemyPrototypeFrameForAsset,
} from './enemyPrototypeSheet';

describe('enemy prototype runtime bridge', () => {
  it('keeps the canonical 8x6 / 48-cell contract for both directions', () => {
    expect(ENEMY_PROTOTYPE_SHEET_LIST).toHaveLength(2);

    for (const sheet of ENEMY_PROTOTYPE_SHEET_LIST) {
      expect(sheet.frameWidth).toBe(180);
      expect(sheet.frameHeight).toBe(180);
      expect(sheet.endFrame).toBe(47);
      expect(sheet.path).toContain('enemies-original');
    }

    expect(ENEMY_PROTOTYPE_SHEETS.front.id).not.toBe(ENEMY_PROTOTYPE_SHEETS.left.id);
    expect(ENEMY_PROTOTYPE_SHEETS.left.path).toContain('enemy-48-left');
  });

  it('uses the latest prototype enemy sheets as the runtime candidate source', () => {
    expect(ENEMY_PROTOTYPE_SHEETS.front.path).toBe(
      'assets/prototypes/sprite-sheets/enemies-original/enemy-48-right-1440x1080-rgba.png',
    );
    expect(ENEMY_PROTOTYPE_SHEETS.left.path).toBe(
      'assets/prototypes/sprite-sheets/enemies-original/enemy-48-left-1440x1080-rgba.png',
    );
  });

  it('maps every legacy runtime enemy visual to a valid canonical frame', () => {
    const requiredAssetIds = [
      'enemy_ink_blob',
      'enemy_paper_scrap',
      'enemy_signpost',
      'enemy_capsule',
      'enemy_haze',
      'enemy_elite_label',
    ];

    for (const assetId of requiredAssetIds) {
      const mapping = enemyPrototypeFrameForAsset(assetId);
      expect(mapping, assetId).toBeDefined();
      expect(mapping?.frame).toBeGreaterThanOrEqual(0);
      expect(mapping?.frame).toBeLessThanOrEqual(47);
      expect(mapping?.displayWidth).toBeGreaterThan(0);
      expect(mapping?.displayHeight).toBeGreaterThan(0);
    }

    expect(Object.keys(ENEMY_PROTOTYPE_FRAME_BY_ASSET_ID)).toHaveLength(requiredAssetIds.length);
  });

  it('uses the intended canonical cells for the current six-enemy loop', () => {
    expect(enemyPrototypeFrameForAsset('enemy_ink_blob')?.frame).toBe(0); // 01 オンブ・欠片色
    expect(enemyPrototypeFrameForAsset('enemy_paper_scrap')?.frame).toBe(2); // 03 紙くずの影
    expect(enemyPrototypeFrameForAsset('enemy_haze')?.frame).toBe(3); // 04 夜のもや
    expect(enemyPrototypeFrameForAsset('enemy_capsule')?.frame).toBe(12); // 13 箱影 (temporary alias)
    expect(enemyPrototypeFrameForAsset('enemy_signpost')?.frame).toBe(17); // 18 迷子の方角
    expect(enemyPrototypeFrameForAsset('enemy_elite_label')?.frame).toBe(25); // 26 紙墓の大喰らい (temporary alias)
  });

  it('uses front art for vertical motion and side art for horizontal or diagonal motion', () => {
    expect(enemyPrototypeFacingForMotion(0, 1)).toBe('front');
    expect(enemyPrototypeFacingForMotion(0.2, 1)).toBe('front');
    expect(enemyPrototypeFacingForMotion(-1, 0)).toBe('left');
    expect(enemyPrototypeFacingForMotion(1, 0)).toBe('left');
    expect(enemyPrototypeFacingForMotion(0.8, 1)).toBe('left');
  });
});
