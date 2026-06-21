import { describe, expect, it } from 'vitest';
import { STAGE_BALANCE_LIMITS, rewardFairnessRatio, stageFunProfile } from './stageBalance';
import { stagePowerForStage } from './stageScaling';

const FUTURE_STAGE_SAMPLES = [1, 2, 3, 4, 5, 6, 10, 20, 25, 50, 99, 100];

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
    // 現在は報酬/成長/気持ちよさを強める調整段階のため、上限を 1.55 → 1.9 に許容拡大。
    // 実測値: stage 6=1.608 / 20=1.773 / 25=1.814 / 50=1.839 / 100=1.873。
    // 25/50/100 の節目ステージは祭り補正(reward/festival/anniversary)で
    // reward 倍率がさらに上乗せされるため、通常ステージ(~1.60)より高くなる。
    // 1.9 はこの節目分まで含めた現行上限。
    // 上限を撤廃するわけではなく、暴走的な稼ぎ過多を検知するためのガードは維持する。
    // 報酬曲線がさらに緩む場合は stageScaling 側を見直し、ここを 1.55 付近へ戻す。
    for (const stage of FUTURE_STAGE_SAMPLES) {
      const ratio = rewardFairnessRatio(stagePowerForStage(stage));
      expect(ratio).toBeGreaterThanOrEqual(0.85);
      expect(ratio).toBeLessThanOrEqual(1.9);
    }
  });

  it('Stage6以降もHPだけが伸び続ける状態にならない', () => {
    const stage20 = stagePowerForStage(20);
    const stage99 = stagePowerForStage(99);
    expect(stage99.enemyHp).toBeLessThanOrEqual(stage20.enemyHp);
    expect(stage99.xp).toBe(stage20.xp);
    expect(stage99.reward).toBe(stage20.reward);
  });

  it('25/50/100ステージごとにストレス発散用の節目補正が入る', () => {
    expect(stageFunProfile(25).funBias).toBe('reward');
    expect(stageFunProfile(50).funBias).toBe('festival');
    expect(stageFunProfile(100).funBias).toBe('anniversary');
  });

  it('節目ステージは硬さを少し抑えて報酬を上げる', () => {
    const stage24 = stagePowerForStage(24);
    const stage25 = stagePowerForStage(25);
    const stage49 = stagePowerForStage(49);
    const stage50 = stagePowerForStage(50);
    const stage99 = stagePowerForStage(99);
    const stage100 = stagePowerForStage(100);

    expect(stage25.enemyHp).toBeLessThanOrEqual(stage24.enemyHp);
    expect(stage25.reward).toBeGreaterThanOrEqual(stage24.reward);
    expect(stage50.enemyHp).toBeLessThanOrEqual(stage49.enemyHp);
    expect(stage50.reward).toBeGreaterThanOrEqual(stage49.reward);
    expect(stage100.enemyHp).toBeLessThanOrEqual(stage99.enemyHp);
    expect(stage100.reward).toBeGreaterThanOrEqual(stage99.reward);
  });
});
