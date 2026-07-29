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

  it('旧Enemy・bossの7札をruntime bridge付きreviewへ隔離する', () => {
    expect(forgottenStreetCompatibilitySummary.reviewEnemyRebind).toBe(7);
    const reviewCells = forgottenStreetNightBoardCompatibility.cells.filter(
      (cell) => cell.migrationClass === 'REVIEW_ENEMY_REBIND',
    );
    expect(reviewCells.map((cell) => cell.id)).toEqual([
      'fs_001_release_ink_shadow',
      'fs_002_release_paper_scrap_shadow',
      'fs_003_release_night_haze',
      'fs_004_release_black_label_shadow',
      'fs_005_calm_bag_yorishiro',
      'fs_023_calm_yorishiro_with_ultimate',
      'fs_024_release_onbro_fast',
    ]);
    expect(reviewCells.every((cell) => cell.legacyRuntimeBinding)).toBe(true);
  });

  it('夜主ネモリ札をEnemyではなくLegacy story bindingとして分離する', () => {
    expect(forgottenStreetCompatibilitySummary.reviewLegacyStoryBinding).toBe(1);
    const cell = forgottenStreetNightBoardCompatibility.cells.find(
      (candidate) => candidate.id === 'fs_025_view_nemori_record',
    );
    expect(cell?.migrationClass).toBe('REVIEW_LEGACY_STORY_BINDING');
    expect(cell?.legacyRuntimeBinding?.legacyRuntimeId).toBe('yanushi_nemori');
    expect(cell?.legacyRuntimeBinding?.successorRelation).toBe('NO_CURRENT_SUCCESSOR');
  });

  it('8札を同一後継・役割後継・別Stage移動・後継なしへ分類する', () => {
    expect(forgottenStreetCompatibilitySummary.exactStage1SuccessorCells).toBe(1);
    expect(forgottenStreetCompatibilitySummary.roleStage1SuccessorCells).toBe(4);
    expect(forgottenStreetCompatibilitySummary.movedToOtherStageCells).toBe(1);
    expect(forgottenStreetCompatibilitySummary.noCurrentSuccessorCells).toBe(2);
  });

  it('compatibility layerだけではsave migration済みにしない', () => {
    expect(forgottenStreetNightBoardCompatibility.saveMigrationApplied).toBe(false);
    expect(forgottenStreetNightBoardCompatibility.definitionVersion).toBe('stage1-compat-v2');
  });
});
