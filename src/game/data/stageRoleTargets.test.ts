import { describe, expect, it } from 'vitest';
import { enemies } from './enemies';
import { stageRoleTargetForStage, stageRoleTargets, totalRoleWeight } from './stageRoleTargets';

const knownRoles = new Set(enemies.flatMap((enemy) => enemy.roles));

describe('stageRoleTargets', () => {
  it('各ステージのロール比率合計が100になる', () => {
    for (const target of stageRoleTargets) {
      expect(totalRoleWeight(target.weights)).toBe(100);
    }
  });

  it('参照するロールが敵データに実在する', () => {
    for (const target of stageRoleTargets) {
      for (const role of Object.keys(target.weights)) {
        expect(knownRoles.has(role)).toBe(true);
      }
    }
  });

  it('25/50/100などの節目ステージはご褒美寄りの目標を返す', () => {
    expect(stageRoleTargetForStage(25).label).toBe('ご褒美夜道');
    expect(stageRoleTargetForStage(50).label).toBe('黒曜祭');
    expect(stageRoleTargetForStage(100).label).toBe('大祭');
  });

  it('通常の未来ステージはStage5相当の全ロール混合目標へ寄せる', () => {
    expect(stageRoleTargetForStage(6).stageNumber).toBe(5);
    expect(stageRoleTargetForStage(24).stageNumber).toBe(5);
    expect(stageRoleTargetForStage(99).stageNumber).toBe(5);
  });
});
