export const WORLD_TERMS = {
  techniqueRanks: {
    lampTechnique: '灯技',
    inheritedLight: '継灯',
    dawnLight: '暁灯',
  },
  kokuyou: {
    transformation: '黒耀化',
    backlash: '煤返り',
    gauge: '黒耀瓶',
    value: '黒耀値',
  },
  evolution: {
    weaponEvolution: '灯継ぎ',
    secondStageEvolution: '暁開き',
    fusion: '灯合わせ',
  },
  records: {
    rareSlot: '忘れ物',
    collection: '灯録',
    achievement: '記憶のしるし',
    result: '旅の記録',
    stageClear: '夜明け',
    fragment: '記憶片',
  },
} as const;

export type WorldTerms = typeof WORLD_TERMS;
