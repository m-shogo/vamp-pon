export type KeeperRecord = {
  id: string;
  characterId: string;
  nameJa: string;
  nameEn: string;
  roleTitle: string;
  personalItem: string;
  hairstyle: string;
  headwear: string;
  lightMotif: string;
  lightType: string;
  reasonToFight: string;
  fixedWeaponPlayFlavor: string;
  strengths: string;
  weakness: string;
  merchandiseEmblem: string;
  blackFormName: string;
  blackFormRisk: string;
  dawnName: string;
  dawnAftereffect: string;
  visualContinuityNotes: string[];
  shortPoem: string;
  unlockHint: string;
  accent: number;
  tags: string[];
};

export const keeperRecords: KeeperRecord[] = [
  {
    id: 'keeper-yui',
    characterId: 'yui',
    nameJa: 'ユイ',
    nameEn: 'Yui',
    roleTitle: '忘れ物を拾う灯し手',
    personalItem: '左腰の小さな拾い物バッグ',
    hairstyle: '頬に沿う短い黒髪と、跳ねた一房',
    headwear: 'なし。髪留めは小さな星形',
    lightMotif: '小さなランタン',
    lightType: '手のひらほどの、息をするような暖色灯',
    reasonToFight: '忘れたと言えなかった心を、持ち主の帰り道へ返すため。',
    fixedWeaponPlayFlavor: '右手のランタンで近くを照らし、拾った記憶を小さな光へ変える。',
    strengths: '誰かのためなら暗がりへ一歩だけ踏み込める。',
    weakness: '自分の忘れ物だけは、見つけても名前を呼べない。',
    merchandiseEmblem: '丸いランタンと、欠けた星ひとつ',
    blackFormName: '黒曜化：黒灯のユイ',
    blackFormRisk: '黒炎に邪念が混じり、黒インクの侵食が灯りの輪郭を奪っていく。',
    dawnName: '朝明：灯を返す子',
    dawnAftereffect: '右手の灯に、拾った人の帰る方角が一瞬だけ映る。',
    visualContinuityNotes: [
      'ランタンは本人の右手。',
      'バッグ紐は右肩から左腰、バッグ本体は左腰。',
      '左向きでも奥側のランタンを完全に消さない。',
      '黒曜化は共通の黒炎・邪念・インク侵食を使い、ユイ専用の灯表現と混同しない。',
      '黒曜化の目は怖すぎず、可愛くデフォルメもしない。',
    ],
    shortPoem: 'なくしたものを照らすより先に、\nなくしたと言えなかった心を照らす。',
    unlockHint: '最初の夜明けを迎えると、ユイの記録が深まります。',
    accent: 0xf4d69a,
    tags: ['lantern', 'lost-item', 'dawn'],
  },
  {
    id: 'keeper-asa',
    characterId: 'asa',
    nameJa: 'アサ',
    nameEn: 'Asa',
    roleTitle: '朝を急がせる灯し手',
    personalItem: '止まったままの小さな懐中時計',
    hairstyle: '朝風になびく高めのひとつ結び',
    headwear: '日の出色の細いヘアバンド',
    lightMotif: '朝焼けの火花',
    lightType: '進む方向へ尾を引く、薄橙の火花',
    reasonToFight: '待っている誰かへ、朝を遅れず届けるため。',
    fixedWeaponPlayFlavor: '走った軌跡に火花を残し、戻る道まで明るくする。',
    strengths: '迷う前に動き、仲間の最初の一歩を作れる。',
    weakness: '立ち止まると、置いてきた声を一度に思い出す。',
    merchandiseEmblem: '斜めに昇る朝日と三つの火花',
    blackFormName: '黒曜化：焦げ朝のアサ',
    blackFormRisk: '急ぐ気持ちが焦げた光になり、帰るべき道まで焼き消しかける。',
    dawnName: '朝明：一番目の光',
    dawnAftereffect: '火花のひとつが遅れて残り、最後尾の仲間を待つ。',
    visualContinuityNotes: ['懐中時計は左胸。', '火花は進行方向の後ろへ流す。'],
    shortPoem: '早く進むほど、\n置いてきた声が遠くで大きくなる。',
    unlockHint: '時間条件の絵札を灯すと、アサの記録が深まります。',
    accent: 0xffb36b,
    tags: ['morning', 'speed', 'friendship'],
  },
  {
    id: 'keeper-nagi',
    characterId: 'nagi',
    nameJa: 'ナギ',
    nameEn: 'Nagi',
    roleTitle: '帰り道を描く灯し手',
    personalItem: '書き足しだらけの折り畳み星図',
    hairstyle: '襟足の長い、静かな青灰色の髪',
    headwear: '方位針を留めた小さなベレー',
    lightMotif: '星図の針',
    lightType: '点と点を細い線で結ぶ、青白い星明かり',
    reasonToFight: '遠回りした人にも、帰れる線を一本残すため。',
    fixedWeaponPlayFlavor: '星の針で目印を打ち、離れた記憶同士を道として結ぶ。',
    strengths: 'ばらばらの手掛かりから帰路を組み立てられる。',
    weakness: '正しい道を探しすぎて、自分の現在地を見失う。',
    merchandiseEmblem: '方位針と、途切れた三点星',
    blackFormName: '黒曜化：迷図のナギ',
    blackFormRisk: '星図の線が黒インクで増殖し、出口のない迷図へ変わる。',
    dawnName: '朝明：戻る道の星',
    dawnAftereffect: '描いた道に、朝まで消えない小さな星印が残る。',
    visualContinuityNotes: ['星図は左手、方位針は右手。', '左右反転時もベレーの針位置を補正する。'],
    shortPoem: '遠回りは間違いじゃない。\n帰る場所を書き足すための線だ。',
    unlockHint: '夜明け星図の隣接札を広げると、ナギの記録が深まります。',
    accent: 0x9fd4ff,
    tags: ['map', 'star', 'return'],
  },
  {
    id: 'keeper-michiru',
    characterId: 'michiru',
    nameJa: 'ミチル',
    nameEn: 'Michiru',
    roleTitle: '流れた記憶をすくう灯し手',
    personalItem: '水音を閉じ込めた青い小瓶',
    hairstyle: '水面のように揺れる長い青髪',
    headwear: '片側だけの雫形かんざし',
    lightMotif: '水面の反射光',
    lightType: '波紋の縁だけに浮かぶ、淡い月明かり',
    reasonToFight: '流してしまった言葉を、消える前にすくい直すため。',
    fixedWeaponPlayFlavor: '水面の輪を重ね、沈んだ記憶を静かに浮かび上がらせる。',
    strengths: '声にならない気持ちを急かさず待てる。',
    weakness: '誰かの悲しみを、自分の底へ沈めてしまう。',
    merchandiseEmblem: '二重の波紋とひと粒の雫',
    blackFormName: '黒曜化：沈み水のミチル',
    blackFormRisk: '水面が黒インクに覆われ、拾った記憶を底へ抱え込む。',
    dawnName: '朝明：流れをほどく手',
    dawnAftereffect: '青い小瓶に、返した言葉の水音がひとつ残る。',
    visualContinuityNotes: ['小瓶は右腰。', '雫形かんざしは本人の左側。'],
    shortPoem: '流したかったものだけが、\nいつまでも岸辺で待っている。',
    unlockHint: '記憶文を読むと、ミチルの記録が深まります。',
    accent: 0x86bfe0,
    tags: ['water', 'memory', 'quiet'],
  },
  {
    id: 'keeper-tomori',
    characterId: 'tomori',
    nameJa: 'トモリ',
    nameEn: 'Tomori',
    roleTitle: '傷を残して直す灯し手',
    personalItem: '色の違う糸を巻いた古い針差し',
    hairstyle: '縫い目のような分け目の、柔らかな赤茶髪',
    headwear: '片耳側に糸巻き形の髪飾り',
    lightMotif: '縫い目の灯り',
    lightType: 'ほつれを塞ぎきらず結ぶ、桃色の点線光',
    reasonToFight: '痛かった印を消さずに、もう一度歩ける形へ直すため。',
    fixedWeaponPlayFlavor: '光の糸で離れた欠片を縫い、あえて小さな隙間を残す。',
    strengths: '壊れた理由ごと受け止め、直しすぎずに繋げられる。',
    weakness: '直せるものを見ると、自分がほどけても手を止められない。',
    merchandiseEmblem: '輪にならない糸と一本の針',
    blackFormName: '黒曜化：ほどけ糸のトモリ',
    blackFormRisk: '黒い糸が傷を閉じ込め、動けないほど固く縫い合わせる。',
    dawnName: '朝明：直しすぎない光',
    dawnAftereffect: '直した場所に、痛みを忘れない淡い縫い目が残る。',
    visualContinuityNotes: ['針差しは左手首。', '糸巻き髪飾りは本人の右側。'],
    shortPoem: '全部きれいに直したら、\n痛かったことまで消えてしまうから。',
    unlockHint: '熟練札や秘密札を灯すと、トモリの記録が深まります。',
    accent: 0xe0b0a6,
    tags: ['repair', 'scar', 'thread'],
  },
];
