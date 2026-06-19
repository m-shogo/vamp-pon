import { applyStageFunProfile, clampStagePower } from './stageBalance';

export type EnemyStagePower = {
  enemyHp: number;
  enemyDamage: number;
  enemySpeed: number;
  spawnRate: number;
  spawnCount: number;
  maxAlive: number;
  xp: number;
  reward: number;
};

const STAGE_POWER_TABLE: Record<number, EnemyStagePower> = {
  1: {
    enemyHp: 1,
    enemyDamage: 1,
    enemySpeed: 1,
    spawnRate: 1,
    spawnCount: 1,
    maxAlive: 1,
    xp: 1,
    reward: 1,
  },
  2: {
    enemyHp: 1.18,
    enemyDamage: 1.08,
    enemySpeed: 1.03,
    spawnRate: 1.08,
    spawnCount: 1.05,
    maxAlive: 1.08,
    xp: 1.18,
    reward: 1.2,
  },
  3: {
    enemyHp: 1.42,
    enemyDamage: 1.17,
    enemySpeed: 1.06,
    spawnRate: 1.16,
    spawnCount: 1.1,
    maxAlive: 1.16,
    xp: 1.42,
    reward: 1.45,
  },
  4: {
    enemyHp: 1.72,
    enemyDamage: 1.28,
    enemySpeed: 1.09,
    spawnRate: 1.25,
    spawnCount: 1.16,
    maxAlive: 1.24,
    xp: 1.72,
    reward: 1.75,
  },
  5: {
    enemyHp: 2.08,
    enemyDamage: 1.4,
    enemySpeed: 1.12,
    spawnRate: 1.34,
    spawnCount: 1.22,
    maxAlive: 1.34,
    xp: 2.08,
    reward: 2.1,
  },
};

const POST_STAGE5_STEP: EnemyStagePower = {
  enemyHp: 0.22,
  enemyDamage: 0.06,
  enemySpeed: 0.01,
  spawnRate: 0.04,
  spawnCount: 0.03,
  maxAlive: 0.04,
  xp: 0.22,
  reward: 0.22,
};

function roundPower(value: number): number {
  return Number(value.toFixed(3));
}

function roundStagePower(power: EnemyStagePower): EnemyStagePower {
  return {
    enemyHp: roundPower(power.enemyHp),
    enemyDamage: roundPower(power.enemyDamage),
    enemySpeed: roundPower(power.enemySpeed),
    spawnRate: roundPower(power.spawnRate),
    spawnCount: roundPower(power.spawnCount),
    maxAlive: roundPower(power.maxAlive),
    xp: roundPower(power.xp),
    reward: roundPower(power.reward),
  };
}

/**
 * ステージ番号に応じた敵・報酬の基礎倍率。
 * HPだけを硬くせず、数・密度・経験値も一緒に上げて「強いけど気持ちいい」伸びにする。
 * Stage6以降は安全上限で丸め、難しさは新パターン/湧き方/ステージギミックで出す。
 * 25/50/100などの節目は、敵HPを少し抑えて報酬を盛り、ストレス発散の爽快感を残す。
 */
export function stagePowerForStage(stageNumber: number): EnemyStagePower {
  const stage = Math.max(1, Math.floor(Number.isFinite(stageNumber) ? stageNumber : 1));
  const fixed = STAGE_POWER_TABLE[stage];
  if (fixed) return roundStagePower(applyStageFunProfile(clampStagePower(fixed), stage));

  const over = stage - 5;
  const base = STAGE_POWER_TABLE[5];
  return roundStagePower(applyStageFunProfile(clampStagePower({
    enemyHp: base.enemyHp + POST_STAGE5_STEP.enemyHp * over,
    enemyDamage: base.enemyDamage + POST_STAGE5_STEP.enemyDamage * over,
    enemySpeed: base.enemySpeed + POST_STAGE5_STEP.enemySpeed * over,
    spawnRate: base.spawnRate + POST_STAGE5_STEP.spawnRate * over,
    spawnCount: base.spawnCount + POST_STAGE5_STEP.spawnCount * over,
    maxAlive: base.maxAlive + POST_STAGE5_STEP.maxAlive * over,
    xp: base.xp + POST_STAGE5_STEP.xp * over,
    reward: base.reward + POST_STAGE5_STEP.reward * over,
  }), stage));
}

/**
 * ステージ内の時間経過倍率。2分後に楽勝にならないよう、後半ほど少しだけ密度を上げる。
 * ただし HP はここで上げない。硬さではなく、敵の流量で圧を作る。
 */
export function runPressureForElapsed(elapsedSec: number): Pick<EnemyStagePower, 'spawnRate' | 'maxAlive'> {
  const minute = Math.max(0, elapsedSec) / 60;
  return {
    spawnRate: roundPower(1 + Math.min(0.34, minute * 0.045)),
    maxAlive: roundPower(1 + Math.min(0.22, minute * 0.032)),
  };
}
