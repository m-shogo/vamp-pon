import type { EnemyRole } from '../domain/types';

export type StageRoleWeights = Partial<Record<EnemyRole, number>>;

export type StageRoleTarget = {
  stageNumber: number;
  label: string;
  intent: string;
  weights: StageRoleWeights;
};

/**
 * ステージ設計で目安にする敵ロール比率。
 * 実際のwaveは手触り優先で調整するが、将来ステージ追加時に
 * 「HPだけ高い」「全部同じ敵構成」へ寄らないためのガードレール。
 */
export const stageRoleTargets: StageRoleTarget[] = [
  {
    stageNumber: 1,
    label: '導入・爽快',
    intent: '倒しやすいpressureを主役にしつつ、charger/flank/supplyを早めに見せる。',
    weights: {
      pressure: 55,
      charger: 14,
      flank: 12,
      supply: 8,
      swarm: 8,
      elite: 3,
    },
  },
  {
    stageNumber: 2,
    label: '包囲入門',
    intent: 'pressureを少し下げ、flankとswarmで逃げ道を揺さぶる。',
    weights: {
      pressure: 44,
      charger: 14,
      flank: 18,
      supply: 8,
      swarm: 12,
      elite: 4,
    },
  },
  {
    stageNumber: 3,
    label: '交差圧力',
    intent: '上下左右とaround湧きに合わせ、flank/charger比率を上げる。',
    weights: {
      pressure: 38,
      charger: 18,
      flank: 20,
      supply: 7,
      swarm: 13,
      elite: 4,
    },
  },
  {
    stageNumber: 4,
    label: '黒い回廊',
    intent: 'swarmとchargerで進路を削り、safe zone系ビルドの価値を出す。',
    weights: {
      pressure: 34,
      charger: 20,
      flank: 16,
      supply: 7,
      swarm: 18,
      elite: 5,
    },
  },
  {
    stageNumber: 5,
    label: '夜明け前',
    intent: '終盤ステージとして全ロール混合。HPではなく密度と役割差で圧を作る。',
    weights: {
      pressure: 32,
      charger: 18,
      flank: 17,
      supply: 8,
      swarm: 19,
      elite: 6,
    },
  },
  {
    stageNumber: 25,
    label: 'ご褒美夜道',
    intent: '25区切りはストレス発散。pressureとsupplyを増やして大量撃破と報酬感を出す。',
    weights: {
      pressure: 62,
      charger: 8,
      flank: 8,
      supply: 16,
      swarm: 4,
      elite: 2,
    },
  },
  {
    stageNumber: 50,
    label: '黒曜祭',
    intent: '50区切りは祭。倒せる敵を多くしつつ、eliteとsupplyで大きな報酬山を作る。',
    weights: {
      pressure: 52,
      charger: 8,
      flank: 8,
      supply: 20,
      swarm: 6,
      elite: 6,
    },
  },
  {
    stageNumber: 100,
    label: '大祭',
    intent: '100区切りは苦行にしない。報酬と大量撃破を優先し、硬さではなく祝祭感を出す。',
    weights: {
      pressure: 58,
      charger: 6,
      flank: 6,
      supply: 22,
      swarm: 4,
      elite: 4,
    },
  },
];

export function stageRoleTargetForStage(stageNumber: number): StageRoleTarget {
  const stage = Math.max(1, Math.floor(Number.isFinite(stageNumber) ? stageNumber : 1));
  const exact = stageRoleTargets.find((target) => target.stageNumber === stage);
  if (exact) return exact;
  if (stage % 100 === 0) return stageRoleTargets.find((target) => target.stageNumber === 100)!;
  if (stage % 50 === 0) return stageRoleTargets.find((target) => target.stageNumber === 50)!;
  if (stage % 25 === 0) return stageRoleTargets.find((target) => target.stageNumber === 25)!;
  if (stage >= 5) return stageRoleTargets.find((target) => target.stageNumber === 5)!;
  return stageRoleTargets.find((target) => target.stageNumber === 1)!;
}

export function totalRoleWeight(weights: StageRoleWeights): number {
  return Object.values(weights).reduce((sum, value) => sum + (value ?? 0), 0);
}
