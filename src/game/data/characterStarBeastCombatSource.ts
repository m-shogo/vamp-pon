import type { NonNeutralAttribute, AttributeSet } from './combatAttributeEffectivenessSource.ts';
import type { BuffKind, StatusKind } from './combatAffinitySource.ts';

export type CharacterStarBeastCombatEntry = {
  characterId: string;
  characterName: string;
  starBeast: string;
  intrinsicAttributes: AttributeSet;
  proficientAttributes: readonly NonNeutralAttribute[];
  resistedStatus: StatusKind;
  resonanceBuff: BuffKind;
  starBeastReason: string;
  characterReason: string;
  combatExpression: string;
  protagonistTier?: 'HERO_ANCHOR';
};

/**
 * Current21 only. Star-beast facts come from Character Book v4.
 * Duplicate constellation/beast families represent distinct individuals and therefore may express different mechanics.
 */
export const currentCharacterStarBeastCombatEntries: readonly CharacterStarBeastCombatEntry[] = [
  {
    characterId: 'yui', characterName: 'ユイ', starBeast: '獅子 / 子獅子', intrinsicAttributes: ['MEMORY', 'LIGHT'], proficientAttributes: ['MEMORY', 'LIGHT', 'STAR'], resistedStatus: 'ERASED', resonanceBuff: 'REMEMBER', protagonistTier: 'HERO_ANCHOR',
    starBeastReason: '獅子は前へ出て全部を倒す王ではなく、散った仲間の灯りが消えないよう中心で受け止める子獅子として扱う。',
    characterReason: 'ユイは忘れ物を拾い、名前を失ったものを再び結ぶ人物。MEMORYが本体で、LIGHTは見つける/暴く/守る補助。STARは星獣との共鳴時だけ扱いやすい熟練属性。',
    combatExpression: 'MARKEDを起点に他属性Reactionへ橋をかける。自分だけで完結する万能型ではなく、どんな武器を拾っても編成をまとめやすい強主人公。',
  },
  {
    characterId: 'asa', characterName: 'アサ', starBeast: 'おひつじ', intrinsicAttributes: ['WIND'], proficientAttributes: ['WIND', 'MEMORY', 'FIRE'], resistedStatus: 'DISORIENTED', resonanceBuff: 'TAILWIND',
    starBeastReason: 'おひつじの直進力を、最初の一歩・突破・先陣の速度へ変換する。', characterReason: '名前を返す人だが、本人の戦い方は考える前に動く速さが核。MEMORYは技術、WINDが本人属性。', combatExpression: 'first-hit、dash、紙刃、mark配布。単属性専門家だがMEMORY武器との相性は高い。',
  },
  {
    characterId: 'nagi', characterName: 'ナギ', starBeast: 'かに', intrinsicAttributes: ['ICE', 'BLANK'], proficientAttributes: ['ICE', 'BLANK', 'MEMORY'], resistedStatus: 'ECLIPSED', resonanceBuff: 'FORTIFY',
    starBeastReason: 'かにの殻と横の守りを、閉じる/守る/安全圏を作る動きへ使う。', characterReason: '危険な記憶を月箱へしまうため、ICEで時間を稼ぎBLANKで封じる。', combatExpression: '近距離防御、seal、slow、temporary wall。火力より盤面を安全にする。',
  },
  {
    characterId: 'michiru', characterName: 'ミチル', starBeast: 'こぐま', intrinsicAttributes: ['STAR', 'WIND'], proficientAttributes: ['STAR', 'WIND', 'LIGHT'], resistedStatus: 'DISORIENTED', resonanceBuff: 'STAR_GUIDE',
    starBeastReason: 'こぐま座を「北の正解」ではなく、小さくても見失わない帰路の目印として扱う。', characterReason: '道を読む/一緒に迷って帰る人物なのでSTARの導きとWINDの移動が核。', combatExpression: '遠距離照準、homing、route bonus、移動中の火力維持。',
  },
  {
    characterId: 'tomori', characterName: 'トモリ', starBeast: '獅子 / 煤けた若獅子', intrinsicAttributes: ['FIRE', 'METAL'], proficientAttributes: ['FIRE', 'METAL', 'LIGHT'], resistedStatus: 'BURN', resonanceBuff: 'REPAIR',
    starBeastReason: 'ユイと同じ獅子系でも、煤けた若獅子は前線の王ではなく火を守る工房の獣。焦げ、傷、修理履歴を持つ。', characterReason: '継火と工具の人物なのでFIRE+METAL。LIGHTは修理した灯りが戻る時にだけ強く出る。', combatExpression: 'DoT、設置、tool return、repair。長期戦で盤面を育てる。',
  },
  { characterId: 'sen', characterName: 'セン', starBeast: 'からす', intrinsicAttributes: ['EARTH'], proficientAttributes: ['EARTH', 'BLANK', 'WIND'], resistedStatus: 'DISORIENTED', resonanceBuff: 'FOCUS', starBeastReason: 'からすの観察と学習を「答えを教える」より進路を見抜く知性へ。', characterReason: '白線と教える道筋が核なのでEARTHの足場が本人属性。', combatExpression: 'lane、break、敵の進路を読む単属性専門家。' },
  { characterId: 'ritsu', characterName: 'リツ', starBeast: 'りょうけん / 大犬', intrinsicAttributes: ['METAL', 'FIRE'], proficientAttributes: ['METAL', 'FIRE', 'EARTH'], resistedStatus: 'EXPOSED', resonanceBuff: 'FORTIFY', starBeastReason: '大犬は追う獣より、妹の前へ体を置く番犬として表現。', characterReason: '半分にして守る兄。硬い道具と瞬間的な火花で近中距離を作る。', combatExpression: 'guard counter、split hit、short burst。' },
  { characterId: 'koyori', characterName: 'コヨリ', starBeast: 'りょうけん / 小犬', intrinsicAttributes: ['BLOOM', 'LIGHT'], proficientAttributes: ['BLOOM', 'LIGHT', 'MEMORY'], resistedStatus: 'ECLIPSED', resonanceBuff: 'REPAIR', starBeastReason: '同じ猟犬系でも小犬は守られる側から、呼び声で大人を引き戻す存在へ成長する。', characterReason: '紙縒り、小さな名前、補助灯からBLOOM+LIGHT。', combatExpression: 'small summon、assist、root、回復支援。' },
  { characterId: 'gen', characterName: 'ゲン', starBeast: 'おおぐま', intrinsicAttributes: ['EARTH', 'STAR'], proficientAttributes: ['EARTH', 'STAR', 'MEMORY'], resistedStatus: 'DISORIENTED', resonanceBuff: 'FORTIFY', starBeastReason: 'おおぐまの大きな基準点を、古い道を知る年長者の安定感へ。', characterReason: '昔の道を知るが新しい道を面白がれる人物。EARTHで崩れずSTARで帰路を読む。', combatExpression: 'slow/tank、safe point、heavy route control。' },
  { characterId: 'hana', characterName: 'ハナ', starBeast: 'はくちょう', intrinsicAttributes: ['BLOOM', 'WATER'], proficientAttributes: ['BLOOM', 'WATER', 'MEMORY'], resistedStatus: 'ROOTED', resonanceBuff: 'REPAIR', starBeastReason: '白鳥を優雅さだけにせず、水面を進みながら季節を渡る保存/移動の象徴へ。', characterReason: '押花を保存し手渡す年長女性。花と水の長期戦が自然。', combatExpression: 'sustain、root、healing、regrowth reaction。' },
  { characterId: 'yubi', characterName: 'ユウビ', starBeast: 'はと', intrinsicAttributes: ['WIND', 'LIGHT'], proficientAttributes: ['WIND', 'LIGHT', 'MEMORY'], resistedStatus: 'DROWSY', resonanceBuff: 'TAILWIND', starBeastReason: 'はとは帰巣と手紙の連想を持つが、現実の郵便記号そのものにはしない。', characterReason: '届くか分からないものを運ぶため、WINDで届けLIGHTで相手を見つける。', combatExpression: 'delayed projectile、return route、delivery buff。' },
  { characterId: 'madoka', characterName: 'マドカ', starBeast: 'わし', intrinsicAttributes: ['LIGHT', 'STAR'], proficientAttributes: ['LIGHT', 'STAR', 'WIND'], resistedStatus: 'ECLIPSED', resonanceBuff: 'FOCUS', starBeastReason: 'わしの遠望を「強い鳥」ではなく、遠くの異変を先に見る視野へ。', characterReason: '見ていた人から声を上げる人へ進むのでLIGHT+STAR。', combatExpression: 'reveal、sniper、critical、pre-emptive support。' },
  { characterId: 'shiro', characterName: 'シロ', starBeast: 'やまねこ', intrinsicAttributes: ['BLANK', 'MEMORY'], proficientAttributes: ['BLANK', 'MEMORY', 'DREAM'], resistedStatus: 'ERASED', resonanceBuff: 'REMEMBER', starBeastReason: 'やまねこの静かな観察を、分からないものを急いで分類しない視線へ。', characterReason: '未分類頁を捨てない人物なのでBLANK+MEMORY。', combatExpression: 'cleanse、rewrite、classification bonus。' },
  { characterId: 'tobari', characterName: 'トバリ', starBeast: 'おおいぬ', intrinsicAttributes: ['EARTH', 'METAL'], proficientAttributes: ['EARTH', 'METAL', 'LIGHT'], resistedStatus: 'DISORIENTED', resonanceBuff: 'FORTIFY', starBeastReason: 'おおいぬは門の外を追うより、帰れる境界に立つ守護へ。', characterReason: '門と改札を守るためEARTH+METAL。', combatExpression: 'boundary line、knockback resist、gate control。' },
  { characterId: 'nemu', characterName: 'ネム', starBeast: 'いるか', intrinsicAttributes: ['DREAM'], proficientAttributes: ['DREAM', 'WATER', 'MEMORY'], resistedStatus: 'DROWSY', resonanceBuff: 'FLOW', starBeastReason: 'いるかの水面と潜水を、夢と現実を行き来する呼吸へ。', characterReason: '本人の核は夢なのでDREAM単属性。WATERは夢頁の表現技術。', combatExpression: 'delay、drowsy、random high-roll、dream control。' },
  { characterId: 'kuroori', characterName: 'クロオリ', starBeast: 'カメレオン', intrinsicAttributes: ['DARK', 'BLANK'], proficientAttributes: ['DARK', 'BLANK', 'MEMORY'], resistedStatus: 'ILLUMINATED', resonanceBuff: 'FOCUS', starBeastReason: 'カメレオンを色替えギミックだけにせず、見せない/開かない/周囲へ合わせる思想へ。', characterReason: '記憶を永遠に閉じる思想的ライバルなのでDARK+BLANK。', combatExpression: 'veil、fold、high-risk concealment、buff strip。' },
  { characterId: 'kage1', characterName: 'カナメ', starBeast: 'おおかみ', intrinsicAttributes: ['EARTH', 'DARK'], proficientAttributes: ['EARTH', 'DARK', 'METAL'], resistedStatus: 'EXPOSED', resonanceBuff: 'FORTIFY', starBeastReason: 'おおかみは孤高記号ではなく、群れの前へ大きな体を置く連携の獣。', characterReason: '全部受ける守り方が偏りなのでEARTHが核、DARKはShadow側の抱え込み。', combatExpression: 'body guard、counter、damage share、stagger resistance。' },
  { characterId: 'kage2', characterName: 'カスミ', starBeast: 'こぎつね', intrinsicAttributes: ['DARK', 'DREAM'], proficientAttributes: ['DARK', 'DREAM', 'BLANK'], resistedStatus: 'ILLUMINATED', resonanceBuff: 'FLOW', starBeastReason: 'こぎつねの軽さを騙しではなく、痕跡をぼかして危険から逃がす知恵へ。', characterReason: '名前や痕跡を隠して守るためDARK+DREAM。', combatExpression: 'accuracy down、delay、decoy、escape support。' },
  { characterId: 'kage3', characterName: 'トキ', starBeast: 'つる', intrinsicAttributes: ['METAL', 'STAR'], proficientAttributes: ['METAL', 'STAR', 'EARTH'], resistedStatus: 'DISORIENTED', resonanceBuff: 'FOCUS', starBeastReason: 'つるの細長い姿勢と一点を見る静けさを、測定/角度/精密さへ。', characterReason: '測れないものを切り捨てがちな人物なのでMETAL+STAR。', combatExpression: 'angle crit、precision lane、weak-point break。' },
  { characterId: 'kage4', characterName: 'ツムギ', starBeast: 'うさぎ', intrinsicAttributes: ['BLOOM', 'BLANK'], proficientAttributes: ['BLOOM', 'BLANK', 'MEMORY'], resistedStatus: 'ERASED', resonanceBuff: 'REPAIR', starBeastReason: 'うさぎの跳躍を可愛さだけにせず、途中の空白を飛び越えず次へ渡す柔らかさへ。', characterReason: '縫う/継ぐ/未完成を残すのでBLOOM+BLANK。', combatExpression: 'stitch、root、unfinished field、support。' },
  { characterId: 'ren', characterName: 'レン', starBeast: 'こいぬ', intrinsicAttributes: ['LIGHT'], proficientAttributes: ['LIGHT', 'METAL', 'STAR'], resistedStatus: 'DISORIENTED', resonanceBuff: 'FOCUS', starBeastReason: 'こいぬは小さな違いへ先に反応する観察者。コヨリ側の小犬とは別個体・別役割。', characterReason: '確信まで黙る人物が仮説を共有する成長を、LIGHT単属性の観測専門として表す。', combatExpression: 'analysis、reveal、single-target focus。' },
] as const;

export const yuiProtagonistCombatRules = {
  primaryAttribute: 'MEMORY' as const,
  secondaryAttribute: 'LIGHT' as const,
  primaryMasteryMultiplier: 1.16,
  secondaryMasteryMultiplier: 1.08,
  markedTargetReactionAssist: 1.06,
  firstNewAttributePickupGetsMinorMastery: true,
  pickupMasteryMultiplier: 1.04,
  starBeastResonance: '子獅子が散った灯りを集めるため、ユイは自分の属性外武器でも最初の1本だけ扱いやすい。',
  balanceRule: '主人公として明確に強いが、全属性damage boostや全status immunityは持たない。専門家は専門分野でユイを上回る。',
} as const;

export const characterStarBeastCombatSummary = {
  currentCharacterCount: currentCharacterStarBeastCombatEntries.length,
  singleAttributeCharacters: currentCharacterStarBeastCombatEntries.filter((entry) => entry.intrinsicAttributes.length === 1).map((entry) => entry.characterId),
  dualAttributeCharacters: currentCharacterStarBeastCombatEntries.filter((entry) => entry.intrinsicAttributes.length === 2).map((entry) => entry.characterId),
  tripleAttributeBaseCharacters: currentCharacterStarBeastCombatEntries.filter((entry) => entry.intrinsicAttributes.length === 3).map((entry) => entry.characterId),
  yuiIsExplicitHeroAnchor: true,
  duplicateStarBeastFamiliesMayHaveDifferentMechanics: true,
} as const;
