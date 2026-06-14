import type { EvolutionDefinition } from '../domain/types';

export const evolutions: EvolutionDefinition[] = [
  {
    id: 'dawn_ink_lamp_fusion',
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
    id: 'unfinished_line_evo',
    name: '未完成の一行',
    fromWeaponId: 'night_pencil',
    requiredWeaponLevel: 5,
    requiredPassiveId: 'moonlight_bookmark',
    evolvedWeaponId: 'unfinished_line',
    title: '記憶がつながった',
    lore: '書きかけのページほど、続きを急いでいる。',
  },
  {
    id: 'north_star_lantern_evo',
    name: '北極星のランタン',
    fromWeaponId: 'stardust_shot',
    requiredWeaponLevel: 5,
    requiredPassiveId: 'gold_compass',
    evolvedWeaponId: 'north_star_lantern',
    title: '記憶がつながった',
    lore: '迷わないためではなく、迷ったことを忘れないための灯り。',
  },
];
