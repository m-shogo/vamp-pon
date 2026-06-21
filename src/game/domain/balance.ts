/**
 * バランス数値。プレイテストで調整する前提の暫定値。
 * ズレたら docs/balance-log.md に記録する（docs/82準拠）。
 */

/** 次のレベルまでに必要なXP。levelは現在レベル（1なら1→2に必要な量）。 */
export function xpToNext(level: number): number {
  // L1:5, 以降 +3/level の線形カーブ。
  // Stage1の序盤で選択回数を増やし、武器差・ビルド差を早く見せる。
  return 5 + (level - 1) * 3;
}

/** Lv2〜Lv6かつ武器+忘れ物が4個未満なら、新しい遊びを早めに見せる。 */
export const EARLY_DISCOVERY_MAX_LEVEL = 6;
export const EARLY_DISCOVERY_MIN_ITEMS = 4;

/** レベルアップ3択の抽選重み（docs/82-4）。 */
export const LEVELUP_WEIGHTS = {
  early: {
    weapon_upgrade: 18,
    weapon_new: 36,
    passive_upgrade: 10,
    passive_new: 28,
    rare_new: 4,
    heal: 4,
  },
  normal: {
    weapon_upgrade: 34,
    weapon_new: 20,
    passive_upgrade: 20,
    passive_new: 15,
    rare_new: 6,
    heal: 5,
  },
  lowHp: {
    weapon_upgrade: 28,
    weapon_new: 15,
    passive_upgrade: 16,
    passive_new: 10,
    rare_new: 6,
    heal: 25,
  },
} as const;

export type LevelUpCategory = keyof typeof LEVELUP_WEIGHTS.normal;
