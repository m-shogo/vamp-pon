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

export type StageFunProfile = {
  stageNumber: number;
  milestoneEvery: 25 | 50 | 100 | null;
  isMilestone: boolean;
  label: string;
  /** 敵を硬くするより、倒せる数と報酬を増やすための気持ちよさ補正。 */
  funBias: 'normal' | 'reward' | 'festival' | 'anniversary';
  /** 節目ステージで敵HPを少し抑え、爽快感を残す。 */
  enemyHpSoftener: number;
  /** 節目ステージで報酬/経験値を少し盛る。 */
  rewardBonus: number;
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

export function stageFunProfile(stageNumber: number): StageFunProfile {
  const stage = Math.max(1, Math.floor(Number.isFinite(stageNumber) ? stageNumber : 1));
  if (stage % 100 === 0) {
    return {
      stageNumber: stage,
      milestoneEvery: 100,
      isMilestone: true,
      label: '100ステージ節目・大祭',
      funBias: 'anniversary',
      enemyHpSoftener: 0.88,
      rewardBonus: 1.28,
    };
  }
  if (stage % 50 === 0) {
    return {
      stageNumber: stage,
      milestoneEvery: 50,
      isMilestone: true,
      label: '50ステージ節目・黒曜祭',
      funBias: 'festival',
      enemyHpSoftener: 0.92,
      rewardBonus: 1.18,
    };
  }
  if (stage % 25 === 0) {
    return {
      stageNumber: stage,
      milestoneEvery: 25,
      isMilestone: true,
      label: '25ステージ節目・ご褒美夜道',
      funBias: 'reward',
      enemyHpSoftener: 0.95,
      rewardBonus: 1.1,
    };
  }
  return {
    stageNumber: stage,
    milestoneEvery: null,
    isMilestone: false,
    label: '通常ステージ',
    funBias: 'normal',
    enemyHpSoftener: 1,
    rewardBonus: 1,
  };
}

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
 * 25/50/100などの節目は、難しさよりストレス発散を優先する。
 * 敵HPだけを抑え、出現密度は維持して「たくさん倒せる」感触を残す。
 */
export function applyStageFunProfile(power: EnemyStagePower, stageNumber: number): EnemyStagePower {
  const profile = stageFunProfile(stageNumber);
  return clampStagePower({
    ...power,
    enemyHp: power.enemyHp * profile.enemyHpSoftener,
    xp: power.xp * profile.rewardBonus,
    reward: power.reward * profile.rewardBonus,
  });
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
