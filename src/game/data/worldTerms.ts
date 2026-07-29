import { currentMetaCurrencyDisplayName } from './metaCurrencyDisplay';

/**
 * Player-facing world vocabulary.
 *
 * Keep this file small and semantic. Runtime IDs, save fields and balance logic
 * must not depend on display names. Persistent meta-currency display is sourced
 * from metaCurrencyDisplay so a future Human-approved rename does not require a
 * second independent terminology edit.
 */
export const WORLD_TERMS = {
  product: {
    title: 'ヨルノシルベ',
    legacyCodeNames: ['Vamp Pon', 'VAMP PON', 'ヴァンサバ改'],
  },
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
    upgrade: '灯継ぎ',
    awakening: '暁開き',
  },
  records: {
    rareSlot: '忘れ物',
    collection: '灯録',
    achievement: '記憶のしるし',
    result: '旅の記録',
    stageClear: '夜明け',
    fragment: '記憶片',
  },
  economy: {
    runFragment: '記憶片',
    persistentCurrency: currentMetaCurrencyDisplayName(),
  },
  inventory: {
    weapon: '灯具',
    passive: '持ち物',
    rareItem: '忘れ物',
    fieldDrop: '落とし物',
    recovery: '朝露',
    capsule: '記憶包み',
    // Compatibility alias for old consumers. This is the persistent wallet,
    // not the run-only 記憶片 pickup.
    currency: currentMetaCurrencyDisplayName(),
  },
  statLabels: {
    magnet: '回収',
    might: '灯力',
    xp: '成長',
    moveSpeed: '足取り',
    cooldown: '手数',
  },
  screens: {
    home: '灯りの家',
    start: '夜へ出る',
    continue: '灯を継ぐ',
    retry: 'もう一度、夜へ',
    stageSelect: '夜の地図',
    characterSelect: '旅人を選ぶ',
    characterDetail: '旅人の記録',
    collection: '灯録',
    upgrade: '旅支度',
    permanentUpgrade: '支度',
    shop: '忘れ物市',
    settings: '設定',
    initialWeapon: '最初の灯具',
    pairArtList: '灯合わせ録',
  },
  settings: {
    bgm: 'BGM',
    se: 'SE',
    haptics: '振動',
    reducedMotion: '演出を控えめに',
  },
} as const;

export type WorldTerms = typeof WORLD_TERMS;
