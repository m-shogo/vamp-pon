import { describe, expect, it } from 'vitest';
import { enemyById as currentEnemyById } from './enemyProductionDatabase';
import {
  getAcceptedStage1ProgressIds,
  hasCalmedStage1LegacyTarget,
  hasReleasedStage1LegacyTarget,
  stage1LegacyRuntimeCompatibilityByBoardCellId,
  stage1LegacyRuntimeCompatibilityById,
  stage1LegacyRuntimeCompatibilityEntries,
  validateStage1LegacyRuntimeCompatibility,
} from './stage1LegacyRuntimeCompatibility';

describe('Stage1 legacy runtime compatibility', () => {
  it('旧runtimeの6 Enemy・1 boss・1 story recordを漏れなく分類する', () => {
    expect(stage1LegacyRuntimeCompatibilityEntries).toHaveLength(8);
    expect(stage1LegacyRuntimeCompatibilityById.has('ink_shadow')).toBe(true);
    expect(stage1LegacyRuntimeCompatibilityById.has('paper_scrap_shadow')).toBe(true);
    expect(stage1LegacyRuntimeCompatibilityById.has('lost_direction')).toBe(true);
    expect(stage1LegacyRuntimeCompatibilityById.has('black_capsule')).toBe(true);
    expect(stage1LegacyRuntimeCompatibilityById.has('night_haze')).toBe(true);
    expect(stage1LegacyRuntimeCompatibilityById.has('black_label_shadow')).toBe(true);
    expect(stage1LegacyRuntimeCompatibilityById.has('bag_yorishiro')).toBe(true);
    expect(stage1LegacyRuntimeCompatibilityById.has('yanushi_nemori')).toBe(true);
  });

  it('Legacy bindingを持つ8札を全てbridgeへ載せる', () => {
    expect([...stage1LegacyRuntimeCompatibilityByBoardCellId.keys()].sort()).toEqual([
      'fs_001_release_ink_shadow',
      'fs_002_release_paper_scrap_shadow',
      'fs_003_release_night_haze',
      'fs_004_release_black_label_shadow',
      'fs_005_calm_bag_yorishiro',
      'fs_023_calm_yorishiro_with_ultimate',
      'fs_024_release_onbro_fast',
      'fs_025_view_nemori_record',
    ]);
  });

  it('同一Stage1後継と役割後継だけをdual-read対象にする', () => {
    expect(getAcceptedStage1ProgressIds('ink_shadow')).toEqual([
      'ink_shadow',
      'ombu_small_ink',
    ]);
    expect(getAcceptedStage1ProgressIds('black_label_shadow')).toEqual([
      'black_label_shadow',
      'omburo_ink_arm',
    ]);
    expect(getAcceptedStage1ProgressIds('bag_yorishiro')).toEqual([
      'bag_yorishiro',
      'boss_name_without_owner',
    ]);
  });

  it('別Stageへ移動したモチーフはStage1達成へ流用しない', () => {
    expect(getAcceptedStage1ProgressIds('paper_scrap_shadow')).toEqual([
      'paper_scrap_shadow',
    ]);
    expect(getAcceptedStage1ProgressIds('lost_direction')).toEqual([
      'lost_direction',
    ]);
    expect(getAcceptedStage1ProgressIds('black_capsule')).toEqual([
      'black_capsule',
    ]);
  });

  it('旧IDとCurrent Stage1 IDのどちらでも対象札を達成できる', () => {
    expect(
      hasReleasedStage1LegacyTarget(
        'ink_shadow',
        { ombu_small_ink: 1 },
        {},
      ),
    ).toBe(true);
    expect(
      hasReleasedStage1LegacyTarget(
        'black_label_shadow',
        {},
        { omburo_ink_arm: 1 },
      ),
    ).toBe(true);
    expect(
      hasReleasedStage1LegacyTarget(
        'paper_scrap_shadow',
        { ombu_small_paper: 1 },
        {},
      ),
    ).toBe(false);
  });

  it('boss calm状態も旧IDとCurrent IDをdual-readする', () => {
    expect(hasCalmedStage1LegacyTarget('bag_yorishiro', ['bag_yorishiro'])).toBe(true);
    expect(hasCalmedStage1LegacyTarget('bag_yorishiro', ['boss_name_without_owner'])).toBe(true);
    expect(hasCalmedStage1LegacyTarget('yanushi_nemori', ['boss_name_without_owner'])).toBe(false);
  });

  it('Current targetの存在とStage affinityを検証する', () => {
    const result = validateStage1LegacyRuntimeCompatibility();
    expect(result.errors).toEqual([]);
    expect(currentEnemyById.get('ombu_small_ink')?.stageAffinity).toContain('forgotten_street');
    expect(currentEnemyById.get('omburo_ink_arm')?.stageAffinity).toContain('forgotten_street');
    expect(currentEnemyById.get('boss_name_without_owner')?.stageAffinity).toContain('forgotten_street');
    expect(currentEnemyById.get('ombu_small_paper')?.stageAffinity).not.toContain('forgotten_street');
  });
});
