export const YUI_BASIC_48_KEYS = [
  'idle_front', 'idle_front_blink', 'idle_left', 'idle_right', 'idle_back', 'ready_front', 'ready_left', 'ready_right',
  'walk_front_a', 'walk_front_b', 'walk_left_a', 'walk_left_b', 'walk_right_a', 'walk_right_b', 'walk_back_a', 'walk_back_b',
  'cast_front', 'cast_left', 'cast_right', 'cast_back', 'attack_front', 'attack_left', 'attack_right', 'attack_back',
  'hurt_front', 'hurt_left', 'hurt_right', 'hurt_back', 'recoil_front', 'recoil_left', 'recoil_right', 'recoil_back',
  'special_normal', 'special_black', 'pickup', 'interact', 'downed', 'rest', 'emote_happy', 'emote_surprised',
  'portrait_neutral', 'portrait_alt', 'vessel_icon', 'secondary_item_icon', 'crest_normal', 'crest_black', 'memory_item_icon', 'effect_icon',
] as const;

export const YUI_EXPRESSION_RAGE_48_KEYS = [
  'portrait_determined', 'portrait_worried', 'portrait_sad', 'portrait_pained',
  'portrait_afraid', 'portrait_surprised', 'portrait_relieved', 'portrait_exhausted',
  'portrait_tearful_smile', 'portrait_memory_awakened', 'portrait_lantern_focus', 'portrait_protective',
  'cutin_ultimate_normal', 'portrait_ink_invasion', 'portrait_rage_threshold', 'cutin_ultimate_black',
  'rage_charge_25', 'rage_charge_50', 'rage_charge_75', 'rage_threshold_shiver',
  'rage_trigger_crouch', 'rage_transform_peak', 'rage_idle_front_a', 'rage_idle_front_b',
  'rage_walk_front_a', 'rage_walk_front_b', 'rage_walk_left_a', 'rage_walk_left_b',
  'rage_walk_right_a', 'rage_walk_right_b', 'rage_walk_back_a', 'rage_walk_back_b',
  'rage_cast_front', 'rage_cast_left', 'rage_cast_right', 'rage_cast_back',
  'rage_attack_front', 'rage_attack_left', 'rage_attack_right', 'rage_attack_back',
  'rage_hurt', 'rage_recoil', 'rage_ultimate_start', 'rage_ultimate_peak',
  'rage_ultimate_release', 'rage_meter_empty', 'rage_collapse', 'rage_recovery_slow',
] as const;

export type Yui96Cell = {
  index: number;
  row: number;
  column: number;
  key: string;
};

export function yui96Cells(keys: readonly string[]): Yui96Cell[] {
  return keys.map((key, index) => ({
    index,
    row: Math.floor(index / 8) + 1,
    column: (index % 8) + 1,
    key,
  }));
}

export function yuiEquipmentQaNote(cell: Yui96Cell): string {
  if (cell.index >= 40 || cell.key.includes('portrait') || cell.key.includes('cutin') || cell.key.includes('icon') || cell.key.includes('crest')) {
    return '顔・髪・フード・配色が同じユイか確認';
  }
  if (cell.key.includes('_left')) {
    return '左向き: 本人右手のランタンは奥側。完全に消さない';
  }
  if (cell.key.includes('_right')) {
    return '右向き: 本人右手のランタンは手前側';
  }
  if (cell.key.includes('_back')) {
    return '背面: 本人右手ランタン / 左腰バッグを維持';
  }
  return '本人右手=ランタン / 右肩→左腰の紐 / 左腰=バッグ';
}
