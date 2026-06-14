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

/** レベルアップ3択の抽選重み（docs/82-4）。 */
export const LEVELUP_WEIGHTS = {
  normal: {
    weapon_upgrade: 40,
    weapon_new: 18,
    passive_upgrade: 24,
    passive_new: 13,
    heal: 5,
  },
  lowHp: {
    weapon_upgrade: 32,
    weapon_new: 14,
    passive_upgrade: 20,
    passive_new: 9,
    heal: 25,
  },
} as const;

export type LevelUpCategory = keyof typeof LEVELUP_WEIGHTS.normal;
