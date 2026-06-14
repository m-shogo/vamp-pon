import type { WeaponDefinition } from '../domain/types';

export const weapons: WeaponDefinition[] = [
  {
    id: 'night_pencil',
    name: '夜の鉛筆',
    category: 'weapon',
    maxLevel: 5,
    tags: ['projectile', 'target_nearest', 'starter'],
    description: '近い影へ鉛筆弾を飛ばす。',
    lore: '芯は短いのに、まだ書きたいことがあるらしい。',
    levels: [
      { level: 1, effect: { type: 'projectile', damage: 16, projectiles: 1, cooldown: 0.9, pierce: 0, targeting: 'nearest' }, label: '近い影へ鉛筆弾を速く飛ばす。' },
      { level: 2, effect: { damageAdd: 5 }, label: 'ダメージ +5' },
      { level: 3, effect: { projectilesAdd: 1 }, label: '弾数 +1' },
      { level: 4, effect: { pierceAdd: 1 }, label: '貫通 +1' },
      { level: 5, effect: { cooldownMultiplier: 0.75 }, label: 'クールタイム -25%' },
    ],
  },
  {
    id: 'marble',
    name: 'ビー玉',
    category: 'weapon',
    maxLevel: 5,
    tags: ['projectile', 'bounce', 'random_direction'],
    description: 'ランダム方向へ反射するビー玉を飛ばす。',
    lore: '転がすと、一瞬だけ遠い空が映る。',
    levels: [
      { level: 1, effect: { type: 'bouncing_projectile', damage: 12, projectiles: 1, cooldown: 1.25, bounces: 1, speed: 1.15, duration: 2.8 }, label: '反射するビー玉を1個飛ばす。' },
      { level: 2, effect: { speedMultiplier: 1.25 }, label: '弾速 +25%' },
      { level: 3, effect: { projectilesAdd: 1 }, label: '弾数 +1' },
      { level: 4, effect: { bouncesAdd: 1 }, label: '反射 +1' },
      { level: 5, effect: { damageAdd: 7, durationMultiplier: 1.2 }, label: 'ダメージ +7 / 持続 +20%' },
    ],
  },
  {
    id: 'moon_bookmark',
    name: '月のしおり',
    category: 'weapon',
    maxLevel: 5,
    tags: ['orbit', 'defense', 'close_range'],
    description: '周囲を回るしおりで近くの影を払う。',
    lore: '挟まれていたページは、いつも同じ場所で止まっている。',
    levels: [
      { level: 1, effect: { type: 'orbit', damage: 10, orbiters: 1, radius: 66, hitInterval: 0.45 }, label: 'しおりが周囲を回る。' },
      { level: 2, effect: { damageAdd: 4 }, label: 'ダメージ +4' },
      { level: 3, effect: { orbitersAdd: 1 }, label: 'しおり +1' },
      { level: 4, effect: { radiusAdd: 24 }, label: '回転半径 +24' },
      { level: 5, effect: { hitIntervalMultiplier: 0.75 }, label: 'ヒット間隔 -25%' },
    ],
  },
  {
    id: 'black_ink_bottle',
    name: '黒インクの小瓶',
    category: 'weapon',
    maxLevel: 5,
    tags: ['area', 'damage_over_time', 'target_nearest'],
    description: '近くの影の足元にインクだまりを作る。',
    lore: '中身は乾いている。けれど夜になると、少しだけ増える。',
    levels: [
      { level: 1, effect: { type: 'ground_area', damagePerSecond: 8, duration: 2.3, radius: 52, cooldown: 1.7, maxAreas: 1, targeting: 'nearest' }, label: '影の足元にインクだまりを作る。' },
      { level: 2, effect: { radiusAdd: 16 }, label: '範囲 +16' },
      { level: 3, effect: { durationAdd: 1.0 }, label: '持続 +1秒' },
      { level: 4, effect: { damagePerSecondAdd: 4 }, label: '継続ダメージ +4/秒' },
      { level: 5, effect: { maxAreasAdd: 1 }, label: '同時インク数 +1' },
    ],
  },
  {
    id: 'stardust_shot',
    name: '星くず弾',
    category: 'weapon',
    maxLevel: 5,
    tags: ['projectile', 'random_direction', 'multi_shot'],
    description: 'ランダム方向へ小さな星弾を放つ。',
    lore: '小さな光が残っている。誰かが見上げた夜のかけら。',
    levels: [
      { level: 1, effect: { type: 'radial_random_projectile', damage: 9, projectiles: 4, cooldown: 1.35, speed: 1.15 }, label: 'ランダム方向へ星弾を4発放つ。' },
      { level: 2, effect: { projectilesAdd: 1 }, label: '弾数 +1' },
      { level: 3, effect: { damageAdd: 4 }, label: 'ダメージ +4' },
      { level: 4, effect: { speedMultiplier: 1.25 }, label: '弾速 +25%' },
      { level: 5, effect: { projectilesAdd: 2 }, label: '弾数 +2' },
    ],
  },
  {
    id: 'unfinished_line',
    name: '未完成の一行',
    category: 'weapon',
    maxLevel: 1,
    tags: ['projectile', 'target_nearest', 'evolved'],
    description: '濃い一行が、影を貫いて走る。',
    lore: '書きかけのページほど、続きを急いでいる。',
    levels: [
      { level: 1, effect: { type: 'projectile', damage: 42, projectiles: 4, cooldown: 0.65, pierce: 4, targeting: 'nearest', evolved: true }, label: '貫通する濃い一行を放つ。' },
    ],
  },
  {
    id: 'north_star_lantern',
    name: '北極星のランタン',
    category: 'weapon',
    maxLevel: 1,
    tags: ['projectile', 'random_direction', 'evolved'],
    description: '無数の小さな光が、夜じゅうへ散る。',
    lore: '迷わないためではなく、迷ったことを忘れないための灯り。',
    levels: [
      { level: 1, effect: { type: 'radial_random_projectile', damage: 22, projectiles: 12, cooldown: 0.85, speed: 1.55, evolved: true }, label: '十二の星弾をばらまく。' },
    ],
  },
];

export const weaponById = new Map(weapons.map((weapon) => [weapon.id, weapon]));

/** 進化後武器IDの集合（新規抽選から除外する用途）。 */
export const evolvedWeaponIds = new Set(
  weapons.filter((w) => w.tags.includes('evolved')).map((w) => w.id),
);
