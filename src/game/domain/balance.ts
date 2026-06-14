/**
 * バランス数値。プレイテストで調整する前提の暫定値。
 * ズレたら docs/balance-log.md に記録する（docs/82準拠）。
 */

/** 次のレベルまでに必要なXP。levelは現在レベル（1なら1→2に必要な量）。 */
export function xpToNext(level: number): number {
  // L1:8, 以降 +5/level の線形カーブ（暫定）。
  // 目標: 60秒でLv2 / 8分でLv18〜24（docs/82）。
  return 8 + (level - 1) * 5;
}

/** レベルアップ3択の抽選重み（docs/82-4）。 */
export const LEVELUP_WEIGHTS = {
  normal: {
    weapon_upgrade: 35,
    weapon_new: 20,
    passive_upgrade: 25,
    passive_new: 15,
    heal: 5,
  },
  lowHp: {
    weapon_upgrade: 30,
    weapon_new: 15,
    passive_upgrade: 20,
    passive_new: 10,
    heal: 25,
  },
} as const;

export type LevelUpCategory = keyof typeof LEVELUP_WEIGHTS.normal;
