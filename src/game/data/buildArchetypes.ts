import type { Id } from '../domain/types';

export type BuildArchetypeId =
  | 'focus_fire'
  | 'screen_clear'
  | 'safe_zone'
  | 'bounce_field'
  | 'growth_rush';

export type BuildArchetype = {
  id: BuildArchetypeId;
  name: string;
  summary: string;
  weaponIds: Id[];
  passiveIds: Id[];
  playHint: string;
};

/**
 * レベルアップ選択を「なんとなく強い」から「方針を選ぶ」に寄せるための分類。
 * まずは表示/調整用の土台。後続でカードUIやおすすめ表示に使う。
 */
export const buildArchetypes: BuildArchetype[] = [
  {
    id: 'focus_fire',
    name: '一点突破',
    summary: '近い敵や硬い敵を素早く削る。エリート処理が楽になる。',
    weaponIds: ['night_pencil', 'postcard_blade'],
    passiveIds: ['travel_badge', 'pressed_flower', 'small_alarm_clock'],
    playHint: 'ボスや突進敵がつらい時に選ぶ。',
  },
  {
    id: 'screen_clear',
    name: '画面掃除',
    summary: '弾数を増やして大量のオンブをまとめて消す。ストレス発散向き。',
    weaponIds: ['stardust_shot', 'paper_airplane'],
    passiveIds: ['travel_badge', 'white_margin', 'small_alarm_clock'],
    playHint: '敵が多くて気持ちよく倒したい時に選ぶ。',
  },
  {
    id: 'safe_zone',
    name: '安全地帯',
    summary: '自分の周囲や足元に攻撃を置いて、押し込まれにくくする。',
    weaponIds: ['moon_bookmark', 'black_ink_bottle', 'streetlamp_ring'],
    passiveIds: ['old_ticket', 'gold_compass', 'white_margin'],
    playHint: '被弾が多い時、回復を取りに行きたい時に選ぶ。',
  },
  {
    id: 'bounce_field',
    name: '反射フィールド',
    summary: '長く残る弾で画面内に当たり判定を増やす。移動しながら倒せる。',
    weaponIds: ['marble', 'paper_airplane'],
    passiveIds: ['white_margin', 'small_alarm_clock', 'old_ticket'],
    playHint: '逃げながら敵を削りたい時に選ぶ。',
  },
  {
    id: 'growth_rush',
    name: '成長加速',
    summary: '経験値と吸引を伸ばして早くレベルアップし、選択回数で押す。',
    weaponIds: ['night_pencil', 'stardust_shot'],
    passiveIds: ['gold_compass', 'moonlight_bookmark', 'loose_map_pin'],
    playHint: '序盤からレベルアップを連続で起こしたい時に選ぶ。',
  },
];

export function archetypesForItem(itemId: Id): BuildArchetype[] {
  return buildArchetypes.filter(
    (archetype) => archetype.weaponIds.includes(itemId) || archetype.passiveIds.includes(itemId),
  );
}
