import type { Id } from '../domain/types';

export type RelationshipPairKind = 'important' | 'generic';

export type CharacterDesignTag =
  | 'lamp'
  | 'flame'
  | 'water'
  | 'wind'
  | 'map'
  | 'support'
  | 'rush'
  | 'calm'
  | 'memory'
  | 'family'
  | 'protect'
  | 'lonely'
  | 'leader'
  | 'night'
  | 'healing'
  | 'craft';

export type PlannedCharacterSeed = {
  id: Id;
  name: string;
  implemented: boolean;
  defaultSubEffectId: Id;
  carryItem: string;
  hair: string;
  headGear: string;
  lightKind: string;
  reasonToFight: string;
  fixedWeaponFlavor: string;
  strengths: string[];
  weaknesses: string[];
  tags: CharacterDesignTag[];
  dailyTone: string;
};

export type BondLevelReward = {
  level: 1 | 2 | 3 | 4 | 5;
  unlock: 'daily_talk' | 'sub_effect_plus' | 'pair_ultimate' | 'special_episode' | 'title';
  description: string;
};

export type SubCharacterEffectTemplate = {
  id: Id;
  name: string;
  stat: 'hp' | 'moveSpeed' | 'xpMultiplier' | 'cooldownMultiplier' | 'ultimateCharge' | 'healing';
  baseValue: number;
  perBondLevel: number;
  description: string;
};

export type PairUltimateTemplate = {
  id: Id;
  name: string;
  kind: RelationshipPairKind;
  requiredBondLevel: number;
  tags?: CharacterDesignTag[];
  pair?: [Id, Id];
  effectSummary: string;
  useCase: string;
};

export type ImportantPairBlueprint = {
  pair: [Id, Id];
  title: string;
  relationshipAxis: string;
  uniqueSubEffect: string;
  uniqueUltimateId: Id;
  dailyTalkSeeds: string[];
};

export type GenericAffinityRule = {
  id: Id;
  tags: [CharacterDesignTag, CharacterDesignTag];
  name: string;
  effectSummary: string;
  talkPrompt: string;
};

export const bondLevelRewards: BondLevelReward[] = [
  { level: 1, unlock: 'daily_talk', description: '日常会話1を解放。相手の口調と距離感を見せる。' },
  { level: 2, unlock: 'sub_effect_plus', description: 'サブキャラ効果を少し強化。性能目的の周回導線を作る。' },
  { level: 3, unlock: 'daily_talk', description: '日常会話2を解放。戦う理由や弱さを少し見せる。' },
  { level: 4, unlock: 'pair_ultimate', description: 'ペア必殺を解放。重要ペアは固有、通常ペアは汎用必殺。' },
  { level: 5, unlock: 'special_episode', description: '特別エピソードを解放。重要ペアは固有称号候補も追加。' },
];

export const plannedCharacterSeeds: PlannedCharacterSeed[] = [
  {
    id: 'yui',
    name: 'ユイ',
    implemented: true,
    defaultSubEffectId: 'sub_xp',
    carryItem: '小さなランタン。本人の右手固定。',
    hair: 'やわらかい中髪。動きで少し跳ねる。',
    headGear: '大きすぎないリボン/髪留め候補。',
    lightKind: 'ランタンの暖色光。ユイ専用の灯。',
    reasonToFight: '忘れ物と名前をもう一度呼び戻すため。',
    fixedWeaponFlavor: '夜の鉛筆で影に名前の輪郭を描き直す。',
    strengths: ['回収', '安定', '初心者向け'],
    weaknesses: ['瞬間火力は控えめ', 'ボス単体処理は相棒次第'],
    tags: ['lamp', 'memory', 'support', 'calm'],
    dailyTone: 'やさしいが弱くない。相手の小さな変化に気づく。',
  },
  {
    id: 'asa',
    name: 'アサ',
    implemented: false,
    defaultSubEffectId: 'sub_ultimate',
    carryItem: '火のついた小さなマッチケース。',
    hair: '短めで勢いのある髪。',
    headGear: '焦げ跡のあるヘアピン。',
    lightKind: '火花と朝焼けの赤橙。',
    reasonToFight: '誰かが怖がる前に先に飛び込むため。',
    fixedWeaponFlavor: '火花を散らしながら近距離を切り開く。',
    strengths: ['突進', '火力', '短期決戦'],
    weaknesses: ['被弾しやすい', '回収が苦手'],
    tags: ['flame', 'rush', 'protect', 'family'],
    dailyTone: '強がり。すぐ前に出るが、褒められると弱い。',
  },
  {
    id: 'nagi',
    name: 'ナギ',
    implemented: false,
    defaultSubEffectId: 'sub_speed',
    carryItem: '折りたたみ地図と紙ひこうき。',
    hair: '風で流れる長めの髪。',
    headGear: '小さな方位磁針の髪飾り。',
    lightKind: '風に揺れる青白い光。',
    reasonToFight: '帰り道を失くした人へ道を残すため。',
    fixedWeaponFlavor: '紙ひこうきと風で敵の進路を変える。',
    strengths: ['移動', '誘導', '広範囲'],
    weaknesses: ['直線火力は低め', '重い敵に弱い'],
    tags: ['wind', 'map', 'support', 'calm'],
    dailyTone: '静かで観察型。迷子にだけ少し早口になる。',
  },
  {
    id: 'michiru',
    name: 'ミチル',
    implemented: false,
    defaultSubEffectId: 'sub_healing',
    carryItem: '水入りの小瓶とにじまない栞。',
    hair: '水面のようにまとまった髪。',
    headGear: '透明な雫飾り。',
    lightKind: '水面反射の淡い光。',
    reasonToFight: 'にじんだ記憶を、流しきらずに受け止めるため。',
    fixedWeaponFlavor: '水の輪でインクを薄め、足場を作る。',
    strengths: ['防御', '回復', '地形対策'],
    weaknesses: ['殲滅速度は遅い', '序盤火力が低い'],
    tags: ['water', 'healing', 'calm', 'protect'],
    dailyTone: '落ち着いている。怒るより先に心配する。',
  },
  {
    id: 'tomori',
    name: 'トモリ',
    implemented: false,
    defaultSubEffectId: 'sub_hp',
    carryItem: '古い懐中電灯と修理道具。',
    hair: '少し乱れた作業向きの髪。',
    headGear: '小さなゴーグル。',
    lightKind: '機械的な白い光。',
    reasonToFight: '壊れた灯りを直し、夜でも迷わない場所を作るため。',
    fixedWeaponFlavor: '設置物と修理光で安全地帯を作る。',
    strengths: ['設置', '持続火力', '安全地帯'],
    weaknesses: ['機動力が低い', '即応性が低い'],
    tags: ['craft', 'leader', 'support', 'night'],
    dailyTone: 'ぶっきらぼうだが面倒見が良い。説明が少し長い。',
  },
];

export const subCharacterEffectTemplates: SubCharacterEffectTemplate[] = [
  { id: 'sub_hp', name: '見守り', stat: 'hp', baseValue: 0.04, perBondLevel: 0.01, description: '最大HPを少し上げる。' },
  { id: 'sub_speed', name: '追い風', stat: 'moveSpeed', baseValue: 0.03, perBondLevel: 0.005, description: '移動速度を少し上げる。' },
  { id: 'sub_xp', name: '記憶拾い', stat: 'xpMultiplier', baseValue: 0.04, perBondLevel: 0.01, description: '経験値獲得量を少し上げる。' },
  { id: 'sub_cooldown', name: '息合わせ', stat: 'cooldownMultiplier', baseValue: -0.03, perBondLevel: -0.005, description: '武器クールタイムを少し短くする。' },
  { id: 'sub_ultimate', name: '合図', stat: 'ultimateCharge', baseValue: 0.06, perBondLevel: 0.01, description: '必殺ゲージ上昇量を上げる。' },
  { id: 'sub_healing', name: '手当て', stat: 'healing', baseValue: 0.08, perBondLevel: 0.015, description: '回復量を上げる。' },
];

export const genericAffinityRules: GenericAffinityRule[] = [
  { id: 'lamp_flame', tags: ['lamp', 'flame'], name: '灯りと火花', effectSummary: '必殺ゲージ上昇。', talkPrompt: '火を強くしすぎないよう、灯りの距離を話す。' },
  { id: 'wind_map', tags: ['wind', 'map'], name: '道しるべの風', effectSummary: '移動速度上昇。', talkPrompt: '迷わない道と、あえて遠回りする道の話。' },
  { id: 'support_rush', tags: ['support', 'rush'], name: '背中押し', effectSummary: '攻撃速度上昇。', talkPrompt: '飛び出す側と支える側の呼吸合わせ。' },
  { id: 'memory_calm', tags: ['memory', 'calm'], name: '静かな記憶', effectSummary: '経験値獲得量上昇。', talkPrompt: '忘れたくない小物について話す。' },
  { id: 'family_protect', tags: ['family', 'protect'], name: '守る約束', effectSummary: '被ダメージ軽減。', talkPrompt: '守ることと、守られっぱなしでいないこと。' },
  { id: 'water_healing', tags: ['water', 'healing'], name: 'にじまない手当て', effectSummary: '回復量上昇。', talkPrompt: '傷と記憶がにじまないようにする話。' },
];

export const pairUltimateTemplates: PairUltimateTemplate[] = [
  {
    id: 'generic_light_trail',
    name: 'ふたりの光跡',
    kind: 'generic',
    requiredBondLevel: 4,
    effectSummary: '前方に光の道を出し、敵を押し返しながらダメージを与える。',
    useCase: '通常ペア用。囲まれた時の脱出と爽快感。',
  },
  {
    id: 'generic_overlapped_memory',
    name: '重なる記憶',
    kind: 'generic',
    requiredBondLevel: 4,
    effectSummary: '一定時間、攻撃速度と経験値吸引を上げる。',
    useCase: '通常ペア用。ビルド育成とラッシュ向け。',
  },
  {
    id: 'generic_crossing_lights',
    name: '交差する灯り',
    kind: 'generic',
    requiredBondLevel: 4,
    effectSummary: '周囲に円形範囲攻撃を出し、小型敵をまとめてほどく。',
    useCase: '通常ペア用。大量湧き・ご褒美ステージ向け。',
  },
  {
    id: 'yui_asa_two_lanterns',
    name: 'ふたりの灯り道',
    kind: 'important',
    requiredBondLevel: 4,
    pair: ['yui', 'asa'],
    effectSummary: 'ランタンと火花で画面中央に光の道を作り、敵を押し返して記憶片へ変える。',
    useCase: 'ユイ×アサ固有。防御と突破を両立。',
  },
  {
    id: 'yui_nagi_star_map_wind',
    name: '星図の追い風',
    kind: 'important',
    requiredBondLevel: 4,
    pair: ['yui', 'nagi'],
    effectSummary: '地図の線に沿って紙ひこうきと星弾を連射する。',
    useCase: 'ユイ×ナギ固有。広範囲殲滅と誘導。',
  },
];

export const importantPairBlueprints: ImportantPairBlueprint[] = [
  {
    pair: ['yui', 'asa'],
    title: '先に走る火花と、あとから照らす灯り',
    relationshipAxis: 'アサが前に出すぎ、ユイが呼び戻す。恋愛ではなく、危なっかしい信頼。',
    uniqueSubEffect: '被ダメージ後、短時間だけ必殺ゲージ上昇。',
    uniqueUltimateId: 'yui_asa_two_lanterns',
    dailyTalkSeeds: ['マッチの火をランタンに近づけすぎてユイが慌てる。', 'アサが強がり、ユイが小さな怪我に気づく。'],
  },
  {
    pair: ['yui', 'nagi'],
    title: '忘れ物係と帰り道係',
    relationshipAxis: 'ユイが忘れ物を拾い、ナギが帰り道を残す。静かな相互補完。',
    uniqueSubEffect: '経験値吸引範囲と移動速度を少し上げる。',
    uniqueUltimateId: 'yui_nagi_star_map_wind',
    dailyTalkSeeds: ['地図の余白にユイが拾った小物を置く。', 'ナギが迷子になりかけたふりをしてユイを試す。'],
  },
  {
    pair: ['asa', 'tomori'],
    title: '壊す勢いと直す手つき',
    relationshipAxis: 'アサが突破し、トモリが後から直す。喧嘩しつつ噛み合う。',
    uniqueSubEffect: '設置物/範囲武器の持続時間を上げる。',
    uniqueUltimateId: 'generic_crossing_lights',
    dailyTalkSeeds: ['アサが壊した道具をトモリが黙って直す。', 'トモリの長い説明をアサが半分だけ聞く。'],
  },
  {
    pair: ['michiru', 'nagi'],
    title: '流れる水と迷わない風',
    relationshipAxis: 'ミチルが受け止め、ナギが道を作る。落ち着いた支援組。',
    uniqueSubEffect: 'インク床/持続ダメージへの耐性を少し上げる。',
    uniqueUltimateId: 'generic_overlapped_memory',
    dailyTalkSeeds: ['水でにじんだ地図をナギが読もうとする。', 'ミチルがナギの遠回り癖を静かに指摘する。'],
  },
];

export function pairKey(a: Id, b: Id): string {
  return [a, b].sort().join('__');
}

export function isImportantPair(a: Id, b: Id): boolean {
  const key = pairKey(a, b);
  return importantPairBlueprints.some((pair) => pairKey(pair.pair[0], pair.pair[1]) === key);
}
