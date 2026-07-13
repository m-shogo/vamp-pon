import type { EvolutionDefinition } from '../domain/types';
import { weaponById } from './weapons.ts';

/**
 * 進化発動に必要な「from武器」の現在maxLevel。
 * weapons.ts 側で maxLevel を 5→7 などに動かしても、ここを通せば自動で連動する。
 * 武器定義が見つからない時は requiredWeaponLevel（互換値）→ 1 の順でフォールバック。
 */
export function requiredMainWeaponLevel(evo: EvolutionDefinition): number {
  return weaponById.get(evo.fromWeaponId)?.maxLevel
    ?? evo.requiredWeaponLevel
    ?? 1;
}

/** 合体側（requiredWeaponId）の現在maxLevel。requiredWeaponId が無ければ 1。 */
export function requiredSecondaryWeaponLevel(evo: EvolutionDefinition): number {
  if (!evo.requiredWeaponId) return 1;
  return weaponById.get(evo.requiredWeaponId)?.maxLevel
    ?? evo.requiredWeaponLevel2
    ?? 1;
}

export const evolutions: EvolutionDefinition[] = [
  {
    id: 'unforgotten_name_awakening',
    kind: 'awakening',
    name: '消えない名前',
    fromWeaponId: 'night_pencil',
    requiredWeaponLevel: 5,
    requiredRareItemId: 'name_tag',
    consumedRareItemIds: ['name_tag'],
    evolvedWeaponId: 'unforgotten_name',
    title: '名前が線になった',
    lore: '呼ばれなくなっても、そこにいたことは消えない。',
  },
  {
    id: 'memory_marble_awakening',
    kind: 'awakening',
    name: '追憶のビー玉',
    fromWeaponId: 'marble',
    requiredWeaponLevel: 5,
    requiredRareItemId: 'cracked_lens',
    consumedRareItemIds: ['cracked_lens'],
    evolvedWeaponId: 'memory_marble',
    title: '景色が丸く光った',
    lore: 'ひび割れた景色の中で、思い出だけが丸く光る。',
  },
  {
    id: 'sealed_postcard_awakening',
    kind: 'awakening',
    name: '宛先のない紙片',
    fromWeaponId: 'postcard_blade',
    requiredWeaponLevel: 5,
    requiredRareItemId: 'sealed_letter',
    consumedRareItemIds: ['sealed_letter'],
    evolvedWeaponId: 'addressless_blade',
    title: '封がひらいた',
    lore: '届かなかった言葉ほど、まっすぐ進む。',
  },
  {
    id: 'tailwind_plane_awakening',
    kind: 'awakening',
    name: '追い風の紙ひこうき',
    fromWeaponId: 'paper_airplane',
    requiredWeaponLevel: 5,
    requiredRareItemId: 'wind_mark',
    consumedRareItemIds: ['wind_mark'],
    evolvedWeaponId: 'tailwind_plane',
    title: '折り目に風が戻った',
    lore: '向かい風だった道が、少しだけ帰り道に変わる。',
  },
  {
    id: 'dawn_ink_lamp_fusion',
    kind: 'fusion',
    name: '夜明けのインク灯',
    fromWeaponId: 'black_ink_bottle',
    requiredWeaponLevel: 5,
    requiredWeaponId: 'streetlamp_ring',
    requiredWeaponLevel2: 5,
    consumedWeaponIds: ['black_ink_bottle', 'streetlamp_ring'],
    evolvedWeaponId: 'dawn_ink_lamp',
    title: '黒と灯りが混ざった',
    lore: '消すための黒と、照らすための灯り。混ざると、朝の色になる。',
  },
  {
    id: 'unfinished_line_upgrade',
    kind: 'upgrade',
    name: '未完成の一行',
    fromWeaponId: 'night_pencil',
    requiredWeaponLevel: 5,
    requiredPassiveId: 'moonlight_bookmark',
    evolvedWeaponId: 'unfinished_line',
    title: '記憶がつながった',
    lore: '書きかけのページほど、続きを急いでいる。',
  },
  {
    id: 'north_star_lantern_upgrade',
    kind: 'upgrade',
    name: '北極星のランタン',
    fromWeaponId: 'stardust_shot',
    requiredWeaponLevel: 5,
    requiredPassiveId: 'gold_compass',
    evolvedWeaponId: 'north_star_lantern',
    title: '記憶がつながった',
    lore: '迷わないためではなく、迷ったことを忘れないための灯り。',
  },
];
