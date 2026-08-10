export type Current21SilhouetteMatrixEntry = {
  characterId: string;
  displayName: string;
  visualLane: string;
  silhouetteRead: string;
  posture: string;
  clothingShape: string;
  objectAnchor: string;
  motionSignature: string;
  ensemblePosition: string;
  generationGuard: string;
};

/**
 * 21/21 ensemble differentiation layer.
 *
 * This matrix does not invent exact measurements for characters whose body
 * type is not already locked. It fixes shape language, posture, clothing
 * mass, object placement and motion so generation does not collapse the cast
 * into one generic slim anime template.
 *
 * Hard body/age/accessory locks remain in characterSilhouetteCanon.ts.
 */
export const current21SilhouetteMatrix: Current21SilhouetteMatrixEntry[] = [
  {
    characterId: 'yui', displayName: 'ユイ', visualLane: '主人公 / 拾い手',
    silhouetteRead: '青いフード + 身体より少し前へ出るランタン + 拾った紙片',
    posture: '半歩前。落とし物へ先に手が伸び、火を見る時だけ両手が近づく。',
    clothingShape: '短いフード外衣。ランタン側へ非対称な重み。', objectAnchor: '持ち主待ちのランタン',
    motionSignature: '拾う → 確認する → 相手へ向ける', ensemblePosition: '中央寄り。ただし正面hero pose固定ではなく、人へ物を回す。',
    generationGuard: 'generic heroine / sword-user silhouetteへ寄せない。',
  },
  {
    characterId: 'asa', displayName: 'アサ', visualLane: '行動派 / 名づけ',
    silhouetteRead: '短い前髪 + 名札 + 紙片 + 先に差し出す片腕',
    posture: '止まるより半歩先へ出る。名前を聞く時だけ正面を向く。',
    clothingShape: '短い上衣 + 名札面。紙の角を外形へ出す。', objectAnchor: '名結びの小鋏',
    motionSignature: '書く / 切る / 渡すを短く速く', ensemblePosition: '輪の中を動きながら名前を書いて回る。',
    generationGuard: 'ユイの色違い、speed=極端な細身、常時笑顔へ寄せない。',
  },
  {
    characterId: 'nagi', displayName: 'ナギ', visualLane: '静かな守り / 封じ手',
    silhouetteRead: '月箱 + 銀鍵 + 身体に近い肘 + 外へだけ開く月輪',
    posture: '物を身体の内側へ寄せ、閉じる前に二度確認する。',
    clothingShape: '縦に静かな面 + 箱を抱えられる前身頃。', objectAnchor: '月箱の銀鍵',
    motionSignature: '確認 → 閉じる → 戻れるか見る', ensemblePosition: '小物を預かれる内側。出入口を完全には塞がない。',
    generationGuard: '守護=重装tank、無口=猫背、病弱な華奢表現へ寄せない。',
  },
  {
    characterId: 'michiru', displayName: 'ミチル', visualLane: '道読み / 帰路',
    silhouetteRead: '斜め掛け地図 + コンパス + 道糸 + 歩き出した片脚',
    posture: '次の曲がり角を見る。時々後ろの仲間を確認する。',
    clothingShape: '歩行で開く裾 + 斜めの収納線。', objectAnchor: '帰り針のコンパス',
    motionSignature: '長めの歩幅 + 小さな方向修正', ensemblePosition: '輪と外側を行き来し、道を紙へ描く。',
    generationGuard: 'runner costume、方向音痴ギャグ、ユイと同じ青主人公へ寄せない。',
  },
  {
    characterId: 'tomori', displayName: 'トモリ', visualLane: '作業者 / repair',
    silhouetteRead: '修理ゴーグル + 道具袋 + 修理ランプ + 煤と継ぎ目',
    posture: 'しゃがむ / 覗き込む / 直す姿勢を多く使う。',
    clothingShape: '煤や補修跡が残る実用服。', objectAnchor: '継火の修理ランプ',
    motionSignature: '工具 → 火花 → 継ぎ目確認', ensemblePosition: '会話の横で何かを直している。',
    generationGuard: '普通の眼鏡キャラ、新品衣装、発明家白衣へ寄せない。',
  },
  {
    characterId: 'sen', displayName: 'セン', visualLane: '成人 / 教える人',
    silhouetteRead: 'チョーク灯 + 空中の白線 + 少し長い上衣 + 小烏',
    posture: '相手を囲まず、空中へ線を引いて横へ場所を空ける。',
    clothingShape: '教室と作業着の中間。袖の動きが白線を追う。', objectAnchor: '白線のチョーク灯',
    motionSignature: '説明する → 待つ → 教わる側へ回る', ensemblePosition: '石や紙片を使う小集団の端。',
    generationGuard: '教師=スーツ/眼鏡、説明役だけの無個性へ寄せない。',
  },
  {
    characterId: 'ritsu', displayName: 'リツ', visualLane: '兄 / 分ける守り',
    silhouetteRead: '半灯りの飴缶 + 分ける両手 + 大きい猟犬',
    posture: '誰かの分を先に確保するよう片側を空ける。',
    clothingShape: '左右で小さく分かれる意匠。妹とお揃い服にはしない。', objectAnchor: '半灯りの飴缶',
    motionSignature: '分ける → 渡す → 一歩退いて任せる', ensemblePosition: 'コヨリと近いが常に背後へ置かない。',
    generationGuard: '兄=巨漢、カナメの小型版、妹の付属品へ寄せない。',
  },
  {
    characterId: 'koyori', displayName: 'コヨリ', visualLane: '子ども / 小型silhouette',
    silhouetteRead: '低い目線 + 小さな名札 + 紙縒り札 + 小さい猟犬',
    posture: '見上げるだけでなく、自分から机や地面へ物を並べる。',
    clothingShape: '軽い層 + 小さな名札。幼児装飾を盛りすぎない。', objectAnchor: '呼び名の紙縒り札',
    motionSignature: '短い歩幅 + 多い手数 + 補助灯を結ぶ', ensemblePosition: '人の間を移動して名前と小物を繋ぐ。',
    generationGuard: '成人body縮小、赤ちゃん化、守られるだけへ寄せない。',
  },
  {
    characterId: 'gen', displayName: 'ゲン', visualLane: '渋い年長男性',
    silhouetteRead: '古い帽子 + コンパス + 年季のある外套 + 低い重心',
    posture: '立ち急がず、現在地より帰り道を先に確認する。',
    clothingShape: '長く使った外套と実用品。新品の賢者服にしない。', objectAnchor: '古針の駅灯',
    motionSignature: '無駄なく歩く → 道具を見る → 若い相手へ渡す', ensemblePosition: '少し離れて古い道や空を見る。',
    generationGuard: '若返り、老人ギャグ、杖=弱者、wizard化を禁止。',
  },
  {
    characterId: 'hana', displayName: 'ハナ', visualLane: 'ぽっちゃり女性 / 年長女性',
    silhouetteRead: '丸い胴・腕・頬 + 丸いショール + 押し花の保管箱 + 白鳥',
    posture: '場所を譲りすぎず自然に座る/立つ。手元は素早く正確。',
    clothingShape: '身体の量感と布の落ち方を両方見せる重なり。巨大布で隠さない。', objectAnchor: '花脈の保管箱',
    motionSignature: '紙を整える → 花を移す → 誰かへ返す', ensemblePosition: '灯りの内側。丸い輪郭で生活の安心感を作る。',
    generationGuard: 'PLUS_SIZE_HARD_LOCK: 細身化 / 若返り / 食いしん坊・鈍足・体型ギャグ禁止。',
  },
  {
    characterId: 'yubi', displayName: 'ユウビ', visualLane: '配達人 / 時間差',
    silhouetteRead: '斜め掛け配達鞄 + 封筒 + 消印 + 遅れて残る軌跡',
    posture: '相手へ押し付けず、受け取れる距離を測る。',
    clothingShape: '鞄の斜線と郵便灯の一点で非対称。', objectAnchor: '返事待ちの郵便灯',
    motionSignature: '運ぶ → 待つ → 受取可能時に渡す', ensemblePosition: '輪の外から手紙を持ち込み、受取人の前を空ける。',
    generationGuard: '郵便制服コスプレだけ、常時疾走、speedster細身へ寄せない。',
  },
  {
    characterId: 'madoka', displayName: 'マドカ', visualLane: '観測者 / 遠景',
    silhouetteRead: '観測レンズ + 紙飛行機 + 窓の縦線 + 遠くへ向く視線',
    posture: '身体はその場に残し、視線だけ遠くへ先行する。',
    clothingShape: 'すっきりした縦面 + 紙翼の横線。', objectAnchor: '見送り窓の観測レンズ',
    motionSignature: '静止 → 見つける → 差だけ共有', ensemblePosition: '窓/空が見える外縁。気づいた時だけ輪へ戻る。',
    generationGuard: '長身美女テンプレ、遠距離=弓、無感情observerへ寄せない。',
  },
  {
    characterId: 'shiro', displayName: 'シロ', visualLane: '若い男性 / 中性寄り丸メガネ',
    silhouetteRead: '丸メガネ + 白いしおり + 未分類頁 + 山猫',
    posture: '頁を近くで読む前傾。答えを急がず止まれる。',
    clothingShape: '白〜灰の紙層の軽い重なり。', objectAnchor: '未分類の白栞灯',
    motionSignature: '読む → 保留する → 頁を戻す', ensemblePosition: '本/紙がある位置。レンと並べても焦点姿勢を変える。',
    generationGuard: 'レンとの顔コピー、眼鏡=秀才だけの記号を禁止。',
  },
  {
    characterId: 'tobari', displayName: 'トバリ', visualLane: '門番 / 帰路管理',
    silhouetteRead: '直線的な外衣 + 改札鋏 + 切符穴 + 足元の境界 + 番犬',
    posture: '通路の端で、通す側と止める側を身体の向きで分ける。',
    clothingShape: '駅/幕を思わせる縦面。裾で門の線を作る。', objectAnchor: '往復穴の改札鋏',
    motionSignature: '一歩ずらす → 鋏を入れる → 門を開閉', ensemblePosition: '輪の入口側。帰る道を物理的に空けておく。',
    generationGuard: '駅員コスプレだけ、門番=巨漢、重装guardへ寄せない。',
  },
  {
    characterId: 'nemu', displayName: 'ネム', visualLane: '夢見 / ゆらぐ道',
    silhouetteRead: '夢日記 + 水面頁 + やや長い袖 + 揺れる裾 + 小イルカ',
    posture: '座る/寄る姿勢も使うが、必要な時は自分で立つ。',
    clothingShape: '水面の波のような柔らかい袖と裾。', objectAnchor: '夢頁の水面日記',
    motionSignature: '緩い予備動作 → 一瞬だけ明確な方向を示す', ensemblePosition: '輪の端で日記を開き、時々会話へ戻る。',
    generationGuard: '常時寝落ち、パジャマ固定、ぼんやり=無能へ寄せない。',
  },
  {
    characterId: 'kuroori', displayName: 'クロオリ', visualLane: '思想的ライバル / 預かり手',
    silhouetteRead: '黒い折り紙 + 折り目の紫光 + 内側へ預かる腕 + カメレオン',
    posture: '物を身体の内側へ預かるが、相手へ背を向け切らない。',
    clothingShape: '折り紙の面を思わせる角と重なり。', objectAnchor: '折り目だけ光る黒紙',
    motionSignature: '折る → 留める → 必要な時だけ開く', ensemblePosition: '輪の少し外。最後に小さな折り紙だけ中央へ置く。',
    generationGuard: '悪役cape、不健康な極細、常時敵対poseへ寄せない。',
  },
  {
    characterId: 'kage1', displayName: 'カナメ', visualLane: 'ぽっちゃり男性 / 若い成人',
    silhouetteRead: '広い肩 + 厚い柔らかな胴 + 太い腕脚 + 受け灯の腕帯 + 灰狼',
    posture: '広い安定stance。守る瞬間だけ一〜二歩を速く詰める。',
    clothingShape: '短い防護上衣 + 腕帯。身体を巨大な服で隠さない。', objectAnchor: '受け灯の腕帯',
    motionSignature: '静止 → fast intercept → 任せる時は一歩下がる', ensemblePosition: '輪の外周/風上。背中側に仲間と荷物を置ける。',
    generationGuard: 'PLUS_SIZE_HARD_LOCK: 細身化 / bodybuilder化 / 鈍重・大食い・体型ギャグ禁止。',
  },
  {
    characterId: 'kage2', displayName: 'カスミ', visualLane: '輪郭をぼかす守り / Shadow',
    silhouetteRead: '半身の姿勢 + 消し跡の白灯 + 濃淡布 + 小狐',
    posture: '真正面で塞がず、少し横を向いて出口を残す。',
    clothingShape: '透けではなく濃淡の重なり。顔隠しhood固定にしない。', objectAnchor: '消し跡の白灯',
    motionSignature: '隠す → 痕跡を残す → 選択を本人へ戻す', ensemblePosition: '共同メモ等の横。人の前を奪わない。',
    generationGuard: 'ninja/assassin、永久顔隠し、存在感の消しすぎへ寄せない。',
  },
  {
    characterId: 'kage3', displayName: 'トキ', visualLane: '計測者 / 細い縦線',
    silhouetteRead: '細身寄りの縦長線 + 夜定規 + 角度光 + 鶴',
    posture: '軸は真っ直ぐ。測る時だけ身体を傾け角度を合わせる。',
    clothingShape: '細い直線 + 一つだけ外れた目盛り。', objectAnchor: '星目盛りの夜定規',
    motionSignature: '測る → 記録 → 測定外へ一度だけ目を向ける', ensemblePosition: '空や灯りの影が読める場所。',
    generationGuard: '細身=神経質、眼鏡追加、sniper templateへ寄せない。',
  },
  {
    characterId: 'kage4', displayName: 'ツムギ', visualLane: '余白 / 継ぎ目',
    silhouetteRead: '糸巻き + 未完成の裾 + 広めの白い余白面 + 野兎',
    posture: '座って縫う。立つ時も片側へ意図的な空白を残す。',
    clothingShape: '完成しすぎない裾と継ぎ目。ぼろ布ではなく意図的未完。', objectAnchor: '余白を縫う糸巻き',
    motionSignature: '縫う → 止める → 糸を切り続きを残す', ensemblePosition: '紙/布のある場所。最後の一箇所を空ける。',
    generationGuard: '幽霊白服、ぼろ布、儚いだけの極細化へ寄せない。',
  },
  {
    characterId: 'ren', displayName: 'レン', visualLane: 'reserve / 観察者',
    silhouetteRead: '丸メガネ + 片焦点レンズ光 + 透明な小物 + 観察犬',
    posture: '小さな差を見る時だけ顔をわずかに傾ける。',
    clothingShape: '透明/銀の細いアクセント。シロの紙層と分ける。', objectAnchor: '片焦点のレンズ灯',
    motionSignature: '止まる → 焦点 → 仮説として共有', ensemblePosition: 'reserveのためCurrent20集合へ自動追加しない。',
    generationGuard: 'シロとの顔コピー、reserve自動昇格、同じ丸眼鏡poseを禁止。',
  }
];

export const current21SilhouetteMatrixById = new Map(
  current21SilhouetteMatrix.map((entry) => [entry.characterId, entry]),
);

export const CURRENT21_SILHOUETTE_IDS = [
  'yui', 'asa', 'nagi', 'michiru', 'tomori',
  'sen', 'ritsu', 'koyori', 'gen', 'hana', 'yubi', 'madoka', 'shiro', 'tobari', 'nemu',
  'kuroori', 'kage1', 'kage2', 'kage3', 'kage4', 'ren',
] as const;

export const CURRENT21_SILHOUETTE_RULES = {
  targetCount: 21,
  plusSizeHardLockIds: ['hana', 'kage1'],
  reserveIds: ['ren'],
  noGenericBodyTemplate: true,
  principle: 'Differentiate by body/age facts where canon exists, and by posture, clothing mass, object placement and motion everywhere else.',
} as const;
