export type KeeperRecord = {
  id: string;
  characterId: string;
  nameJa: string;
  nameEn: string;
  roleTitle: string;
  luminousPossessionId: string;
  luminousPossessionName: string;
  personalItem: string;
  legacyPersonalItems: string[];
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
    roleTitle: '持ち主を急いで決めず、忘れ物を返す灯し手',
    luminousPossessionId: 'named-object:yui:luminous_possession',
    luminousPossessionName: '持ち主待ちのランタン',
    personalItem: '持ち主待ちのランタン',
    legacyPersonalItems: ['左腰の小さな拾い物バッグ'],
    hairstyle: '頬に沿う短い黒髪と、跳ねた一房',
    headwear: 'なし。髪留めは小さな星形',
    lightMotif: '呼吸するランタンの暖色',
    lightType: '手のひらほどの灯が呼吸するように明滅し、持ち主不明の物へ静かに向く。',
    reasonToFight: '忘れたと言えなかった心を、持ち主を決めつけず帰り道へ返すため。',
    fixedWeaponPlayFlavor: '夜の鉛筆とランタンで記憶片を集め、拾った物を保留してから返す。',
    strengths: '誰かのためなら暗がりへ一歩踏み込み、分からない物を分からないまま持てる。',
    weakness: '返すことを急ぐと、本人がまだ選んでいない持ち主まで決めてしまう。',
    merchandiseEmblem: '丸いランタンと、持ち主の空いた名札',
    blackFormName: '黒耀化（Working）：すべてを強制的に返す灯',
    blackFormRisk: '保留する優しさが失われ、持ち主不明でも一つの答えへ強制回収しようとする。',
    dawnName: '暁開き：消えない名前',
    dawnAftereffect: '返さなかった物にも小さな灯が残り、本人が選ぶまで待てるようになる。',
    visualContinuityNotes: [
      '持ち主待ちのランタンは本人の右手。',
      '旧小物の拾い物バッグはsecondary propとして左腰に残せる。',
      'バッグ紐は右肩から左腰、バッグ本体は左腰。',
      '左向きでも奥側のランタンを完全に消さない。',
      '黒耀化ではランタンを別武器へ交換せず、回収光だけが極端化する。',
    ],
    shortPoem: 'なくしたものを照らすより先に、\n持ち主を決められなかった心を待つ。',
    unlockHint: '最初の夜明けと、持ち主不明の物を保留する記憶のしるしで記録が深まります。',
    accent: 0xf4d69a,
    tags: ['lantern', 'lost-item', 'hold', 'dawn'],
  },
  {
    id: 'keeper-asa',
    characterId: 'asa',
    nameJa: 'アサ',
    nameEn: 'Asa',
    roleTitle: '名前を本人と結び直す灯し手',
    luminousPossessionId: 'named-object:asa:luminous_possession',
    luminousPossessionName: '名結びの小鋏',
    personalItem: '名結びの小鋏',
    legacyPersonalItems: ['止まったままの小さな懐中時計'],
    hairstyle: '朝風になびく高めのひとつ結び',
    headwear: '日の出色の細いヘアバンド',
    lightMotif: '切った紙端に残る朝色',
    lightType: '刃ではなく、切り離した紙端と名札の縁が薄橙に光る。',
    reasonToFight: '消された名前を戻し、どの呼び名を残すか本人が選べるようにするため。',
    fixedWeaponPlayFlavor: '絵はがきカッターで印を付け、名札を結んだ相手への攻撃と支援を変える。',
    strengths: '曖昧な相手にも輪郭を与え、本人の言い直しを待ちながら名前を結べる。',
    weakness: '早く明らかにしようとすると、本人が選ぶ前の呼び名を固定してしまう。',
    merchandiseEmblem: '小鋏と、結び直せる二枚の名札',
    blackFormName: '黒耀化（Working）：名前を一つへ固定する鋏',
    blackFormRisk: '名前を守る力が極端化し、本人の許可なく呼び名と意味を一つへ固定する。',
    dawnName: '暁開き：暁に結ぶ名',
    dawnAftereffect: '一度ほどいた名札を、本人が選んだ呼び名で結び直せる余白が残る。',
    visualContinuityNotes: [
      '名結びの小鋏は腰または手元に見える小型prop。',
      '旧小物の懐中時計はhistorical propとして左胸へ残せる。',
      '切断表現は身体ではなく紙・名札・印の線へ限定する。',
    ],
    shortPoem: '名前を明かすことより、\nどの名前で呼ばれたいかを待つ。',
    unlockHint: '印付きの相手をほどき、名前を戻す記憶のしるしで記録が深まります。',
    accent: 0xffb36b,
    tags: ['name', 'mark', 'consent', 'paper'],
  },
  {
    id: 'keeper-nagi',
    characterId: 'nagi',
    nameJa: 'ナギ',
    nameEn: 'Nagi',
    roleTitle: '危ないものをしまい、必要な時に開き直す灯し手',
    luminousPossessionId: 'named-object:nagi:luminous_possession',
    luminousPossessionName: '月箱の銀鍵',
    personalItem: '月箱の銀鍵',
    legacyPersonalItems: ['書き足しだらけの折り畳み星図'],
    hairstyle: '襟足の長い、静かな青灰色の髪',
    headwear: '月輪を留めた小さなベレー',
    lightMotif: '鍵穴へ近づく青白い月輪',
    lightType: '危険へ近づくほど輪が閉じ、許可を得て開く時だけ鍵穴から光が漏れる。',
    reasonToFight: '危険を誰か一人へ背負わせず、閉じる時と開く時を仲間と選ぶため。',
    fixedWeaponPlayFlavor: '月のしおりで敵の勢いを封じ、必要な瞬間だけ月箱を開いて守りを流す。',
    strengths: '危険を一度しまい、仲間が態勢を整える時間を作れる。',
    weakness: '守ることを優先しすぎると、必要な物や言葉まで二度と開けなくなる。',
    merchandiseEmblem: '銀鍵と、開きかけの月箱',
    blackFormName: '黒耀化（Working）：すべての鍵穴を閉じる月輪',
    blackFormRisk: '封じる力が極端化し、安全のために全ての鍵穴と選択肢を閉じてしまう。',
    dawnName: '暁開き：夜をしまう箱',
    dawnAftereffect: '閉じた箱に、本人以外も開け方を選べる小さな第二の鍵穴が残る。',
    visualContinuityNotes: [
      '月箱の銀鍵を主objectとして手元または胸元へ見せる。',
      '旧小物の折り畳み星図は過去の記録・secondary propとして保持する。',
      '箱を閉じる演出だけでなく、合意して開き直す演出を必ず用意する。',
    ],
    shortPoem: '閉じることだけが守りじゃない。\n開け方を残すことも、同じ鍵の役目だ。',
    unlockHint: '封印を一度解除し、守りを仲間へ渡して夜明けすると記録が深まります。',
    accent: 0x9fd4ff,
    tags: ['seal', 'key', 'box', 'reopen'],
  },
  {
    id: 'keeper-michiru',
    characterId: 'michiru',
    nameJa: 'ミチル',
    nameEn: 'Michiru',
    roleTitle: '複数の帰り道を示し、歩いて選ぶ灯し手',
    luminousPossessionId: 'named-object:michiru:luminous_possession',
    luminousPossessionName: '帰り針のコンパス',
    personalItem: '帰り針のコンパス',
    legacyPersonalItems: ['水音を閉じ込めた青い小瓶'],
    hairstyle: '道筋のようにゆるく流れる長い青髪',
    headwear: '片側だけの方位線かんざし',
    lightMotif: '複数へ枝分かれする地図線',
    lightType: '正解を一点で指さず、進める方向を複数の薄い星線として示す。',
    reasonToFight: '帰り道を正解として押し付けず、歩いた本人が戻る方角を選べるようにするため。',
    fixedWeaponPlayFlavor: '街灯の輪と地図線で安全路を作り、移動するたび別の帰路へつなぎ直す。',
    strengths: '一つの道が塞がれても、現在地から別の帰路を描き直せる。',
    weakness: '正しい道を証明しようとすると、歩いて確かめる前に他の可能性を消してしまう。',
    merchandiseEmblem: '複数方向へ分かれる帰り針と星',
    blackFormName: '黒耀化（Working）：一つの正解以外を消す帰り針',
    blackFormRisk: '道を示す力が極端化し、一つの最短経路以外を間違いとして消してしまう。',
    dawnName: '暁開き：帰り道の星',
    dawnAftereffect: '選ばなかった道も薄い星線として残り、後から歩き直せる。',
    visualContinuityNotes: [
      '帰り針のコンパスを主objectとして手元へ見せる。',
      '旧小物の青い小瓶は旅の記憶・secondary propとして右腰へ残せる。',
      '地図線は一本の正解矢印ではなく、太さの違う複数候補として描く。',
    ],
    shortPoem: '道は答えではなく、\n歩いたあとに帰れるよう残す線だ。',
    unlockHint: '安全路を描き直し、別の帰路を選んで夜明けすると記録が深まります。',
    accent: 0x86bfe0,
    tags: ['route', 'compass', 'choice', 'return'],
  },
  {
    id: 'keeper-tomori',
    characterId: 'tomori',
    nameJa: 'トモリ',
    nameEn: 'Tomori',
    roleTitle: '傷を残して直し、続きを選べる灯し手',
    luminousPossessionId: 'named-object:tomori:luminous_possession',
    luminousPossessionName: '継火の修理ランプ',
    personalItem: '継火の修理ランプ',
    legacyPersonalItems: ['色の違う糸を巻いた古い針差し'],
    hairstyle: '縫い目のような分け目の、柔らかな赤茶髪',
    headwear: '片耳側に糸巻き形の髪飾り',
    lightMotif: '色の違う継ぎ目の点線光',
    lightType: '直した場所だけ色の異なる点線が灯り、傷と修理の両方を見えるまま残す。',
    reasonToFight: '痛かった印を消さずに、もう一度歩ける形へ直し、続きを本人へ返すため。',
    fixedWeaponPlayFlavor: '黒インクの小瓶と修理灯を設置し、壊れた範囲を時間をかけて継ぎ直す。',
    strengths: '壊れた理由ごと受け止め、直しすぎずに次へつなげられる。',
    weakness: '直せるものを見ると、自分の余白がなくなるまで完成させようとしてしまう。',
    merchandiseEmblem: '修理ランプと、色の違う一筋の継ぎ目',
    blackFormName: '黒耀化（Working）：傷まで消して固める修理灯',
    blackFormRisk: '修理する力が極端化し、古い傷と未完成の余白まで消して動けない完成へ固める。',
    dawnName: '暁開き：夜を直す灯',
    dawnAftereffect: '直した場所に色違いの継ぎ目が残り、完成後も続きを選べる余白ができる。',
    visualContinuityNotes: [
      '継火の修理ランプを主objectとして手元または道具袋へ接続する。',
      '旧小物の針差しはsecondary propとして左手首へ残せる。',
      '修理後も継ぎ目を消さず、異なる色で見える状態を維持する。',
    ],
    shortPoem: '全部きれいに直したら、\n痛かったことも、続ける余白も消えてしまう。',
    unlockHint: '未完成を保ったあと、一つだけ完成させて夜明けすると記録が深まります。',
    accent: 0xe0b0a6,
    tags: ['repair', 'scar', 'lamp', 'blank'],
  },
];
