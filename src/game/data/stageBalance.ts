import type { EnemyStagePower } from './stageScaling';

export type StageBalanceLimits = {
  maxEnemyHp: number;
  maxEnemyDamage: number;
  maxEnemySpeed: number;
  maxSpawnRate: number;
  maxSpawnCount: number;
  maxAlive: number;
  maxXp: number;
  maxReward: number;
};

/**
 * 今後ステージを大量追加しても、数値だけで破綻しないための安全上限。
 * 新ステージの難しさは、基本的に敵パターン・湧き方向・地形/背景ギミックで出す。
 */
export const STAGE_BALANCE_LIMITS: StageBalanceLimits = {
  maxEnemyHp: 4.5,
  maxEnemyDamage: 2.25,
  maxEnemySpeed: 1.22,
  maxSpawnRate: 1.7,
  maxSpawnCount: 1.45,
  maxAlive: 1.7,
  maxXp: 4.5,
  maxReward: 4.5,
};

export function clampStagePower(power: EnemyStagePower): EnemyStagePower {
  return {
    enemyHp: Math.min(power.enemyHp, STAGE_BALANCE_LIMITS.maxEnemyHp),
    enemyDamage: Math.min(power.enemyDamage, STAGE_BALANCE_LIMITS.maxEnemyDamage),
    enemySpeed: Math.min(power.enemySpeed, STAGE_BALANCE_LIMITS.maxEnemySpeed),
    spawnRate: Math.min(power.spawnRate, STAGE_BALANCE_LIMITS.maxSpawnRate),
    spawnCount: Math.min(power.spawnCount, STAGE_BALANCE_LIMITS.maxSpawnCount),
    maxAlive: Math.min(power.maxAlive, STAGE_BALANCE_LIMITS.maxAlive),
    xp: Math.min(power.xp, STAGE_BALANCE_LIMITS.maxXp),
    reward: Math.min(power.reward, STAGE_BALANCE_LIMITS.maxReward),
  };
}

/**
 * ステージ倍率が報酬不足/過剰報酬になっていないか見るための簡易指標。
 * 1.0前後なら標準、1.0未満なら厳しめ、1.4超えなら稼ぎ過多寄り。
 */
export function rewardFairnessRatio(power: EnemyStagePower): number {
  const pressure = (power.enemyHp + power.enemyDamage + power.spawnRate + power.maxAlive) / 4;
  if (pressure <= 0) return 1;
  return Number((power.reward / pressure).toFixed(3));
}
