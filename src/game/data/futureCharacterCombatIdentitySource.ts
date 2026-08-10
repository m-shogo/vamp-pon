import type { AttributeSet, NonNeutralAttribute } from './combatAttributeEffectivenessSource.ts';
import type { BuffKind, StatusKind } from './combatAffinitySource.ts';

export type FutureCharacterCombatIdentity = {
  characterId: string;
  characterName: string;
  intrinsicAttributes: AttributeSet;
  proficientAttributes: readonly NonNeutralAttribute[];
  resistedStatus: StatusKind;
  resonanceBuff: BuffKind;
  storyReason: string;
  starBeastCandidateRule: string;
  threeAttributeReason?: string;
  status: 'FUTURE_CAST_CANDIDATE';
};

/** Future15 are not Current21 canon. Attribute identities remain sequel candidates. */
export const futureCharacterCombatIdentities: readonly FutureCharacterCombatIdentity[] = [
  { characterId: 'F01', characterName: 'ヒヨリ', intrinsicAttributes: ['FIRE', 'LIGHT'], proficientAttributes: ['FIRE', 'LIGHT', 'WIND'], resistedStatus: 'DROWSY', resonanceBuff: 'WARMTH', storyReason: '他人を肯定する速さをLIGHT、場を温め続ける無理をFIREへ。強制positive fieldへ偏る黒耀化とも接続する。', starBeastCandidateRule: 'くじゃく座Candidateは派手さではなく、安心した時だけ尾羽が一枚ずつ立つ「場の温度」へ接続。' , status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F02', characterName: 'セリカ', intrinsicAttributes: ['WATER', 'STAR'], proficientAttributes: ['WATER', 'STAR', 'LIGHT'], resistedStatus: 'ECLIPSED', resonanceBuff: 'STAR_GUIDE', storyReason: '責任を一人で抱えず配る成長をWATERの流れ、静かな精密支援をSTARへ。', starBeastCandidateRule: 'こうま座Candidateは身分記号ではなく、誰かに荷を全部背負わせない伴走へ。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F03', characterName: 'クロエ', intrinsicAttributes: ['DREAM', 'DARK', 'MEMORY'], proficientAttributes: ['DREAM', 'DARK', 'MEMORY', 'BLANK'], resistedStatus: 'SLEEP', resonanceBuff: 'REMEMBER', storyReason: '不老ゆえに時代をまたいで夢のような記憶を蓄え、別れを恐れて夜へ留めようとする。', starBeastCandidateRule: 'うみへび座Candidateは長さ/持続を「永遠に強い」にせず、過去が切れず続く怖さへ。', threeAttributeReason: '長寿で複数時代のMemoryが現在のDream/Darkへ重なること自体が物語核。三属性は強さのご褒美ではなく時間の重さ。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F04', characterName: 'レンジ', intrinsicAttributes: ['FIRE', 'MEMORY'], proficientAttributes: ['FIRE', 'MEMORY', 'EARTH'], resistedStatus: 'ERASED', resonanceBuff: 'WARMTH', storyReason: '有限時間を燃やして進むFIREと、師匠から受け取ったものを自分流へ変えるMEMORY。', starBeastCandidateRule: 'やぎ座Candidateは長い登攀と足場選びへ。老いを弱体記号にしない。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F05', characterName: 'トウマ', intrinsicAttributes: ['METAL'], proficientAttributes: ['METAL', 'FIRE', 'EARTH'], resistedStatus: 'EXPOSED', resonanceBuff: 'REPAIR', storyReason: '名前より作ったものが残ればいい職人なので、本人属性は工具/素材のMETALへ絞る。', starBeastCandidateRule: '星獣Candidateは職人気質をそのまま動物化せず、「作ったものが他人へ渡る」行動で選定する。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F06', characterName: 'クウ', intrinsicAttributes: ['WIND', 'EARTH'], proficientAttributes: ['WIND', 'EARTH', 'MEMORY'], resistedStatus: 'DISORIENTED', resonanceBuff: 'FLOW', storyReason: '犬自身の嗅覚と走路をWIND、地面に残る匂い/足跡をEARTHへ。人間の言葉を使わず記憶へ近づく。', starBeastCandidateRule: '実在動物の犬と星獣を混同しない。クウ自身がStar Beast化する設計は禁止。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F07', characterName: 'ヨモ', intrinsicAttributes: ['DARK'], proficientAttributes: ['DARK', 'DREAM', 'MEMORY'], resistedStatus: 'DROWSY', resonanceBuff: 'FOCUS', storyReason: '複数の名を持っても一匹である猫。本人属性は気配/間合いのDARKへ絞り、MEMORYは物語側で使う。', starBeastCandidateRule: '現実の猫とStar Beastを同一視しない。別名=別個体という属性ギミックは禁止。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F08', characterName: 'ノア', intrinsicAttributes: ['METAL', 'MEMORY', 'BLANK'], proficientAttributes: ['METAL', 'MEMORY', 'BLANK', 'THUNDER'], resistedStatus: 'ERASED', resonanceBuff: 'REMEMBER', storyReason: '人工bodyのMETAL、同一snapshotのMEMORY、同じ過去から別の現在を書けるBLANK。', starBeastCandidateRule: '人工人格へ既存動物を安易に当てはめず、Star Beastが本人を「original/copy」に判定しないこと自体を伏線候補にする。', threeAttributeReason: '三属性の理由が「機械だから多機能」ではなく、body / shared past / divergent presentという人格問題の三層に対応する。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F09', characterName: 'ルム', intrinsicAttributes: ['THUNDER', 'METAL', 'MEMORY'], proficientAttributes: ['THUNDER', 'METAL', 'MEMORY', 'LIGHT'], resistedStatus: 'SHOCK', resonanceBuff: 'OVERCHARGE', storyReason: 'maintenance networkのTHUNDER、機体のMETAL、「ぼくら」から「ぼく」が生まれるMEMORY。', starBeastCandidateRule: 'Star Beastとの接続は人型化報酬にしない。共有記憶へ星獣がどう反応するかをSeries3伏線候補へ。', threeAttributeReason: 'network / body / private memoryの三層が明確で、三属性の複雑さそのものがキャラの問いになる。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F10', characterName: 'マキ', intrinsicAttributes: ['EARTH', 'FIRE'], proficientAttributes: ['EARTH', 'FIRE', 'METAL'], resistedStatus: 'EXPOSED', resonanceBuff: 'FORTIFY', storyReason: '大きな身体で決めて押すEARTH、頼られる側で燃え続けるFIRE。', starBeastCandidateRule: '大柄=熊のような単純連想を避け、本人の決断/競技/支える癖から選定する。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F11', characterName: 'スズ', intrinsicAttributes: ['LIGHT', 'BLOOM'], proficientAttributes: ['LIGHT', 'BLOOM', 'BLANK'], resistedStatus: 'ILLUMINATED', resonanceBuff: 'FOCUS', storyReason: '装うことを偽装ではなく自分で選ぶLIGHT、日々スタイルを育てるBLOOM。', starBeastCandidateRule: '性表現を星獣の雌雄や変身ギミックで説明しない。本人の選択を先に置く。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F12', characterName: 'イオ', intrinsicAttributes: ['BLANK'], proficientAttributes: ['BLANK', 'WIND', 'DREAM'], resistedStatus: 'DISORIENTED', resonanceBuff: 'FLOW', storyReason: '分類される前に音や人を見る人物なのでBLANK単属性。WIND/DREAMは聴覚・流れの技術として習熟。', starBeastCandidateRule: '性別判別のヒントになる星獣選定は禁止。分類しない関係を支える候補にする。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F13', characterName: 'カイ', intrinsicAttributes: ['WATER', 'MEMORY'], proficientAttributes: ['WATER', 'MEMORY', 'LIGHT'], resistedStatus: 'SOAK', resonanceBuff: 'REMEMBER', storyReason: '共有基盤を流れとして受け入れるWATERと、双子の共有記憶MEMORY。', starBeastCandidateRule: '双子のStar Beastは同種/同座でもよいが、同じ個体扱いはしない。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F14', characterName: 'ナオ', intrinsicAttributes: ['THUNDER', 'STAR'], proficientAttributes: ['THUNDER', 'STAR', 'MEMORY'], resistedStatus: 'SHOCK', resonanceBuff: 'FOCUS', storyReason: '同じ扱いから瞬発的に外れるTHUNDER、自分の方向を選ぶSTAR。', starBeastCandidateRule: 'カイとの差を髪色のようにStar Beast種だけで作らず、同系でも反応/距離感を変える。', status: 'FUTURE_CAST_CANDIDATE' },
  { characterId: 'F15', characterName: 'アマネ', intrinsicAttributes: ['WIND', 'METAL'], proficientAttributes: ['WIND', 'METAL', 'STAR'], resistedStatus: 'DISORIENTED', resonanceBuff: 'TAILWIND', storyReason: '速度を愛するWINDと、wheelchairを身体と別の道具にせず移動systemとして扱うMETAL。', starBeastCandidateRule: '障害を癒す/治す星獣能力は禁止。選べるrouteと速度を増やす関係へ。', status: 'FUTURE_CAST_CANDIDATE' },
] as const;

export const futureCharacterCombatIdentitySummary = {
  candidateCount: futureCharacterCombatIdentities.length,
  singleAttributeCount: futureCharacterCombatIdentities.filter((entry) => entry.intrinsicAttributes.length === 1).length,
  dualAttributeCount: futureCharacterCombatIdentities.filter((entry) => entry.intrinsicAttributes.length === 2).length,
  tripleAttributeCount: futureCharacterCombatIdentities.filter((entry) => entry.intrinsicAttributes.length === 3).length,
  tripleAttributeCharacters: futureCharacterCombatIdentities.filter((entry) => entry.intrinsicAttributes.length === 3).map((entry) => entry.characterId),
  currentPromotionAllowed: false,
} as const;
