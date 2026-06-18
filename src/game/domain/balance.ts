/**
 * バランス数値。プレイテストで調整する前提の暫定値。
 * ズレたら docs/balance-log.md に記録する（docs/82準拠）。
 */

/** 次のレベルまでに必要なXP。levelは現在レベル（1なら1→2に必要な量）。 */
export function xpToNext(level: number): number {
  // L1:6, 以降 +4/level の線形カーブ。
  // 3回プレイで「敵が硬い / 攻撃が遅い / クリアできない」ため、初回MVPは上振れを早く出す。
  return 6 + (level - 1) * 4;
}

/** Lv2〜Lv4かつ武器+忘れ物が3個未満なら、新しい遊びを早めに見せる。 */
export const EARLY_DISCOVERY_MAX_LEVEL = 4;
export const EARLY_DISCOVERY_MIN_ITEMS = 3;

/** レベルアップ3択の抽選重み（docs/82-4）。 */
export const LEVELUP_WEIGHTS = {
  early: {
    weapon_upgrade: 24,
    weapon_new: 29,
    passive_upgrade: 12,
    passive_new: 24,
    rare_new: 5,
    heal: 6,
  },
  normal: {
    weapon_upgrade: 38,
    weapon_new: 17,
    passive_upgrade: 22,
    passive_new: 12,
    rare_new: 6,
    heal: 5,
  },
  lowHp: {
    weapon_upgrade: 30,
    weapon_new: 13,
    passive_upgrade: 18,
    passive_new: 8,
    rare_new: 6,
    heal: 25,
  },
} as const;

export type LevelUpCategory = keyof typeof LEVELUP_WEIGHTS.normal;
