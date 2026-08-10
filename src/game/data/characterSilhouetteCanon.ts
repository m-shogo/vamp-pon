export type CharacterSilhouetteAnchor = {
  characterId: string;
  displayName: string;
  role: string;
  bodyDirection: string;
  silhouetteRead: string;
  posture: string;
  clothingShape: string;
  motionLanguage: string;
  combatReadability: string;
  topEnsembleUse: string;
  merchandiseHooks: string[];
  prohibitedShortcuts: string[];
  runtimeMigrationState: 'DESIGN_CANON_ONLY';
};

/**
 * Visual-authority anchors for Current21.
 *
 * This source is intentionally separate from runtime hitboxes / movement stats.
 * Body shape is character design canon and MUST NOT silently become balance data.
 */
export const characterSilhouetteAnchors: CharacterSilhouetteAnchor[] = [
  {
    characterId: 'hana',
    displayName: 'ハナ',
    role: 'ぽっちゃり女性 / 年長女性',
    bodyDirection: 'ふっくらした年長女性。丸みのある胴・腕・頬を保ち、細腰や若いモデル体型へ補正しない。',
    silhouetteRead: '丸いショール、やわらかな肩線、押し花の保管箱で、正面・横・座り姿のどれでも丸い輪郭が残る。',
    posture: '落ち着いた重心。縮こまらず、場所を譲りすぎない自然な座り方と立ち方。',
    clothingShape: '丸いショールと重なりのある布。体型を隠す巨大な布袋ではなく、身体の量感と衣服の落ち方を両方見せる。',
    motionLanguage: '手元は素早く正確。押し花・紙・箱を丁寧に扱う。歩行や回避を「遅い人」ギャグにしない。',
    combatReadability: '保存 / 設置 / 花脈の広がりを主語にする。体格をhitbox・鈍足・耐久の理由にしない。',
    topEnsembleUse: '灯りの近くで押し花や小物を分ける。丸い輪郭で集合の中央付近に安心感を作る。',
    merchandiseHooks: ['押し花しおり', '丸いショール柄の布小物', '花脈の保管箱モチーフ', '白鳥の星獣', 'ハナの蘇芳 #B5495B'],
    prohibitedShortcuts: ['食いしん坊だけで性格を作る', '体型いじり', '揺れを笑いにする', '汗・息切れギャグ', '細身への自動補正', '若返りで魅力を作る'],
    runtimeMigrationState: 'DESIGN_CANON_ONLY',
  },
  {
    characterId: 'kage1',
    displayName: 'カナメ',
    role: 'ぽっちゃり男性 / 若い成人',
    bodyDirection: '横幅のあるがっしり＋柔らかい若い成人男性。筋肉だけの大型体型や肥満ギャグへ寄せない。',
    silhouetteRead: '広い肩・厚い胴・太い腕と脚、受け灯の腕帯、大きな灰狼で外周守備役だと一目で読める。',
    posture: '腰を落として前へ出られる安定姿勢。猫背で小さく見せず、他人の前へ自然に立てる。',
    clothingShape: '短めの防護上着と腕帯。体格を全部隠すオーバーサイズ服ではなく、動ける余白と厚みを見せる。',
    motionLanguage: '通常は静か。守る瞬間だけ一〜二歩を素早く詰めるintercept。重い足音・遅さ・息切れを体型記号にしない。',
    combatReadability: '近距離の圧とinterceptの大きな面を主語にする。大柄だから遅い／hitboxが大きいとは扱わない。',
    topEnsembleUse: '輪の外側か風上に立つ / 座る。荷物・ランタン・仲間を背中側へ置ける大きな輪郭を使う。',
    merchandiseHooks: ['受け灯の腕帯', '灰狼の星獣', '影の折り目エンブレム', '柔らかい布系グッズ', 'カナメの蝋色 #2B2B2B'],
    prohibitedShortcuts: ['鈍重ギャグ', '大食いだけで性格を作る', '汗・息切れギャグ', '体格=高HPの短絡', '筋肉体型への置換', '細身への自動補正'],
    runtimeMigrationState: 'DESIGN_CANON_ONLY',
  },
  {
    characterId: 'gen',
    displayName: 'ゲン',
    role: '渋い年長男性',
    bodyDirection: '初老〜シニア寄り。皺と年季を消して若返らせない。',
    silhouetteRead: '古い帽子、コンパス、低い重心。',
    posture: '立ち急がず、道を見る姿勢。',
    clothingShape: '長く使った外套と実用品。',
    motionLanguage: '無駄が少ない。老人ギャグのよろめきは禁止。',
    combatReadability: '古い道と安全地帯を主語にする。',
    topEnsembleUse: '少し離れて道や空を見る。',
    merchandiseHooks: ['古いコンパス', '駅灯', '大熊の星獣'],
    prohibitedShortcuts: ['老人ギャグ', '若返り補正', '杖=弱者の短絡'],
    runtimeMigrationState: 'DESIGN_CANON_ONLY',
  },
  {
    characterId: 'shiro',
    displayName: 'シロ',
    role: '若い男性 / 中性寄り丸メガネ',
    bodyDirection: '細身寄りでもよいが、レンと同じ輪郭へ寄せない。',
    silhouetteRead: '丸メガネ、白いしおり、頁の余白。',
    posture: '頁を近くで読む前傾と、保留する静けさ。',
    clothingShape: '白〜灰の紙層を思わせる軽い重なり。',
    motionLanguage: '目線と頁の扱いで差を作る。',
    combatReadability: '未分類 / 変換 / 記録を主語にする。',
    topEnsembleUse: 'メガネ越しに頁を読む。',
    merchandiseHooks: ['白いしおり', '丸メガネ', '山猫の星獣'],
    prohibitedShortcuts: ['レンとの顔コピー', '眼鏡=知性だけの記号'],
    runtimeMigrationState: 'DESIGN_CANON_ONLY',
  },
  {
    characterId: 'ren',
    displayName: 'レン',
    role: '観察者 / 丸メガネ',
    bodyDirection: 'reserve。シロと同じ体格・髪型・姿勢へ揃えない。',
    silhouetteRead: '丸メガネに片焦点のレンズ光。',
    posture: '小さな差を見る時に顔をわずかに傾ける。',
    clothingShape: 'レンズ・透明素材の細いアクセント。',
    motionLanguage: '止まる→焦点を合わせる→共有する。',
    combatReadability: '差分 / 焦点 / meaningful differenceを主語にする。',
    topEnsembleUse: '現行TOPへreserveとして自動追加しない。',
    merchandiseHooks: ['片焦点レンズ', '観察犬の星獣', '瓶覗 #A2D7DD'],
    prohibitedShortcuts: ['シロとの顔コピー', 'reserveをCurrent20へ自動昇格'],
    runtimeMigrationState: 'DESIGN_CANON_ONLY',
  },
  {
    characterId: 'tomori',
    displayName: 'トモリ',
    role: '作業者 / ゴーグル',
    bodyDirection: '作業姿勢と道具で識別し、普通の眼鏡キャラへ寄せない。',
    silhouetteRead: '修理ゴーグル、道具袋、継火の修理ランプ。',
    posture: 'しゃがむ・覗き込む・直す姿勢が多い。',
    clothingShape: '煤や補修跡が残る実用服。',
    motionLanguage: '工具と火花の短い正確な動き。',
    combatReadability: 'repair / reignite / seamを主語にする。',
    topEnsembleUse: '会話の横で何かを直している。',
    merchandiseHooks: ['修理ゴーグル', '工具袋', '煤けた若獅子'],
    prohibitedShortcuts: ['ファッション眼鏡化', '新品すぎる衣装'],
    runtimeMigrationState: 'DESIGN_CANON_ONLY',
  },
];

export const characterSilhouetteAnchorById = new Map(
  characterSilhouetteAnchors.map((entry) => [entry.characterId, entry]),
);

export const chubbyCharacterIds = ['hana', 'kage1'] as const;

export const BODY_REPRESENTATION_RULES = {
  bodyShapeIsCanon: true,
  bodyShapeAffects: ['silhouette', 'clothing drape', 'pose', 'animation language', 'ensemble composition', 'merchandise shape language'],
  bodyShapeMustNotAffectByDefault: ['hitbox', 'movement speed', 'stamina', 'intelligence', 'comic relief status', 'moral alignment'],
  generationRule: 'Prompt / image reference must state body direction explicitly. Do not allow generic character-model defaults to slim Hana or Kaname.',
  apparelRule: 'Character apparel merchandise should use inclusive size ranges as a product policy, not as a novelty tied only to plus-size characters.',
} as const;
