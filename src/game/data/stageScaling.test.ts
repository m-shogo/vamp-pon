import { describe, expect, it } from 'vitest';
import { STAGE_BALANCE_LIMITS, rewardFairnessRatio } from './stageBalance';
import { stagePowerForStage } from './stageScaling';

const FUTURE_STAGE_SAMPLES = [1, 2, 3, 4, 5, 6, 10, 20, 50, 99];

describe('stagePowerForStage', () => {
  it('未来ステージでも安全上限を超えない', () => {
    for (const stage of FUTURE_STAGE_SAMPLES) {
      const power = stagePowerForStage(stage);
      expect(power.enemyHp).toBeLessThanOrEqual(STAGE_BALANCE_LIMITS.maxEnemyHp);
      expect(power.enemyDamage).toBeLessThanOrEqual(STAGE_BALANCE_LIMITS.maxEnemyDamage);
      expect(power.enemySpeed).toBeLessThanOrEqual(STAGE_BALANCE_LIMITS.maxEnemySpeed);
      expect(power.spawnRate).toBeLessThanOrEqual(STAGE_BALANCE_LIMITS.maxSpawnRate);
      expect(power.spawnCount).toBeLessThanOrEqual(STAGE_BALANCE_LIMITS.maxSpawnCount);
      expect(power.maxAlive).toBeLessThanOrEqual(STAGE_BALANCE_LIMITS.maxAlive);
      expect(power.xp).toBeLessThanOrEqual(STAGE_BALANCE_LIMITS.maxXp);
      expect(power.reward).toBeLessThanOrEqual(STAGE_BALANCE_LIMITS.maxReward);
    }
  });

  it('ステージが進んでも報酬だけが極端に不足/過剰にならない', () => {
    for (const stage of FUTURE_STAGE_SAMPLES) {
      const ratio = rewardFairnessRatio(stagePowerForStage(stage));
      expect(ratio).toBeGreaterThanOrEqual(0.85);
      expect(ratio).toBeLessThanOrEqual(1.35);
    }
  });

  it('Stage6以降もHPだけが伸び続ける状態にならない', () => {
    const stage20 = stagePowerForStage(20);
    const stage99 = stagePowerForStage(99);
    expect(stage99.enemyHp).toBe(stage20.enemyHp);
    expect(stage99.xp).toBe(stage20.xp);
    expect(stage99.reward).toBe(stage20.reward);
  });
});
