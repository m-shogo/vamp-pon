import { describe, expect, it } from 'vitest';
import { forgottenStreetNightBoard } from './collectionProgress';
import {
  forgottenStreetCompatibilitySummary,
  forgottenStreetNightBoardCompatibility,
} from './collectionProgressCompatibility';

describe('collection progress compatibility', () => {
  it('既存25セルのIDと座標を維持する', () => {
    expect(forgottenStreetNightBoardCompatibility.cells).toHaveLength(
      forgottenStreetNightBoard.cells.length,
    );
    expect(forgottenStreetNightBoardCompatibility.cells.map((cell) => cell.id)).toEqual(
      forgottenStreetNightBoard.cells.map((cell) => cell.id),
    );
    expect(
      forgottenStreetNightBoardCompatibility.cells.map((cell) => `${cell.x},${cell.y}`),
    ).toEqual(forgottenStreetNightBoard.cells.map((cell) => `${cell.x},${cell.y}`));
  });

  it('active Stage1星図はCurrentの黒耀化表記を使う', () => {
    const cell = forgottenStreetNightBoard.cells.find(
      (candidate) => candidate.id === 'fs_008_clear_depth_1_no_black_form',
    );
    expect(cell?.condition).toContain('黒耀化');
    expect(cell?.condition).not.toContain('黒曜化');
  });

  it('旧表記をcompatibility履歴へ残しCurrent表示へ正規化する', () => {
    const cell = forgottenStreetNightBoardCompatibility.cells.find(
      (candidate) => candidate.id === 'fs_008_clear_depth_1_no_black_form',
    );
    expect(cell?.migrationClass).toBe('RENAME_DISPLAY_ONLY');
    expect(cell?.originalCondition).toContain('黒曜化');
    expect(cell?.currentDisplayCondition).toContain('黒耀化');
    expect(cell?.currentDisplayCondition).not.toContain('黒曜化');
  });

  it('旧Enemy名は推測でCurrent48へ置換せずreviewへ隔離する', () => {
    expect(forgottenStreetCompatibilitySummary.reviewEnemyRebind).toBe(6);
    const reviewCells = forgottenStreetNightBoardCompatibility.cells.filter(
      (cell) => cell.migrationClass === 'REVIEW_ENEMY_REBIND',
    );
    expect(reviewCells.map((cell) => cell.id)).toContain('fs_001_release_ink_shadow');
    expect(reviewCells.map((cell) => cell.id)).toContain('fs_005_calm_bag_yorishiro');
    expect(reviewCells.map((cell) => cell.id)).toContain('fs_024_release_onbro_fast');
  });

  it('compatibility layerだけではsave migration済みにしない', () => {
    expect(forgottenStreetNightBoardCompatibility.saveMigrationApplied).toBe(false);
    expect(forgottenStreetNightBoardCompatibility.definitionVersion).toBe('stage1-compat-v1');
  });
});
