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
  screens: {
    home: '灯りの家',
    start: '夜へ出る',
    continue: '灯を継ぐ',
    retry: 'もう一度、夜へ',
    characterSelect: '旅人を選ぶ',
    characterDetail: '旅人の記録',
    upgrade: '旅支度',
    permanentUpgrade: '支度',
    shop: '忘れ物市',
    settings: '設定',
    initialWeapon: '最初の忘れ物',
    pairArtList: '灯合わせ録',
  },
} as const;

export type WorldTerms = typeof WORLD_TERMS;
