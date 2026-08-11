import { spotlightEnemyCharacterEntries } from './spotlightEnemyCharacterSource.ts';
import { yatsukageCallNames } from './yatsukageIdentitySource.ts';

export type YatsukagePairCollisionKind =
  | 'AMPLIFY'
  | 'CONTRADICT'
  | 'COMPETE_FOR_CONTROL'
  | 'ACCIDENTAL_COUNTER'
  | 'FALSE_ALLIANCE'
  | 'MUTUAL_ERASURE'
  | 'CHAIN_PRESSURE';

export type YatsukagePairDynamicEntry = {
  pairId: string;
  enemyAId: string;
  enemyBId: string;
  enemyACallName: string;
  enemyBCallName: string;
  collisionKind: YatsukagePairCollisionKind;
  interactionHook: string;
  wrongReadingCollision: string;
  encounterChoreography: string;
  playerDiscovery: string;
  storyAfterimage: string;
  featuredPair: boolean;
  factionBondCreated: false;
  friendshipImplied: false;
  commonMastermindImplied: false;
  runtimeAutoPromotionAllowed: false;
};

type PairSeed = Omit<YatsukagePairDynamicEntry,
  | 'pairId'
  | 'enemyACallName'
  | 'enemyBCallName'
  | 'factionBondCreated'
  | 'friendshipImplied'
  | 'commonMastermindImplied'
  | 'runtimeAutoPromotionAllowed'
>;

const seeds: readonly PairSeed[] = [
  {
    enemyAId: 'boss_name_without_owner', enemyBId: 'boss_closed_morning_box', collisionKind: 'COMPETE_FOR_CONTROL', featuredPair: false,
    interactionHook: 'ナシロは箱の中身へ先に名前を付けたがり、アサトジは名前ごと箱を閉じて保留しようとする。',
    wrongReadingCollision: '「決めれば迷わない」と「閉じれば失わない」が同じ対象の選択権を別方向から奪う。',
    encounterChoreography: '名札MARKEDが付いた対象を箱圧が優先して囲い、playerは札を外すか箱の出口を作るかを選ぶ。',
    playerDiscovery: '二体は協力しているのではなく、同じ対象を「自分の正しい守り方」へ奪い合っていると気づく。',
    storyAfterimage: '空欄の札が閉じた箱の外に一枚だけ残る。',
  },
  {
    enemyAId: 'boss_name_without_owner', enemyBId: 'boss_night_without_route', collisionKind: 'CHAIN_PRESSURE', featuredPair: false,
    interactionHook: 'ナシロが名札で「誰」を固定すると、ミチグレがその人物の「行く道」まで一本へ絞ろうとする。',
    wrongReadingCollision: '名前の固定とrouteの固定が連鎖し、本人の選び直しを二重に奪う。',
    encounterChoreography: 'MARKED対象へroute消去が寄りやすくなり、別の仲間が道を開けることで鎖を切る。',
    playerDiscovery: '敵同士の連携ではなく、固定された情報が次のWrong Readingを呼ぶ構造だと読める。',
    storyAfterimage: '名札には行き先欄があるが、そこだけ破れている。',
  },
  {
    enemyAId: 'boss_name_without_owner', enemyBId: 'omburo_black_origami', collisionKind: 'CONTRADICT', featuredPair: false,
    interactionHook: 'ナシロは中身へ名前を貼り、オリネは中身を折って見えなくする。',
    wrongReadingCollision: '「見える答えを固定する」と「答えを見せない」が衝突するが、どちらも本人を待たない。',
    encounterChoreography: '札を貼られた黒紙が折られると追尾情報が一時消え、再展開時に別対象へ飛ぶ。',
    playerDiscovery: '正反対に見える二体が、本人不在で意味を扱う点では同じだと気づく。',
    storyAfterimage: '折られた名札の表は読めず、裏の「仮」だけ見える。',
  },
  {
    enemyAId: 'boss_name_without_owner', enemyBId: 'omburo_blank_card', collisionKind: 'MUTUAL_ERASURE', featuredPair: true,
    interactionHook: 'ナシロは空欄を埋めたがり、ハクマは書かれた内容を空白へ戻したがる。',
    wrongReadingCollision: '「空欄は未完成」と「記入は誤解」の両極が互いを消し続ける。',
    encounterChoreography: '名札が付くたび余白fieldが広がり、余白を消すと別の札が増える循環を作る。',
    playerDiscovery: 'playerはどちらかを正解にせず「未分類のまま残す」第三状態を作る。',
    storyAfterimage: '白いカードに名札の安全ピン穴だけ残る。',
  },
  {
    enemyAId: 'boss_name_without_owner', enemyBId: 'omburo_repair_seam', collisionKind: 'FALSE_ALLIANCE', featuredPair: false,
    interactionHook: 'ツグリは剥がれた名札を勝手に縫い戻し、ナシロはそれを「正しい所有」と誤認する。',
    wrongReadingCollision: '修理されたことが正しさの証明にすり替わる。',
    encounterChoreography: '剥がしたMARKEDが継ぎ目から再付与されるため、継ぎ目そのものをほどく必要がある。',
    playerDiscovery: '直った=正しい、残っている=本人のもの、ではないと学ぶ。',
    storyAfterimage: '縫われた札には元の穴と新しい穴が両方ある。',
  },
  {
    enemyAId: 'boss_name_without_owner', enemyBId: 'omburo_dream_wave', collisionKind: 'AMPLIFY', featuredPair: false,
    interactionHook: 'ユラネの夢では名前が自然に馴染み、ナシロの仮名が「昔からそうだった」感覚へ変わる。',
    wrongReadingCollision: '穏やかな夢が誤った名前の違和感を消してしまう。',
    encounterChoreography: 'DROWSY領域内では名札の警告cueが柔らかくなり、playerは視覚以外の差分を読む。',
    playerDiscovery: '心地よさが真実性を保証しないと分かる。',
    storyAfterimage: '夢頁に知らない名前が自分の筆跡で書かれている。',
  },
  {
    enemyAId: 'boss_name_without_owner', enemyBId: 'omburo_nameplate', collisionKind: 'COMPETE_FOR_CONTROL', featuredPair: true,
    interactionHook: 'ナシロは「正しい一枚」を求め、ペタは間違いを認めず何枚も上貼りする。',
    wrongReadingCollision: '完璧な固定と訂正不能な上書きが、名前を大切にするという同じ出発点から喧嘩する。',
    encounterChoreography: 'ナシロが札を整理する横でペタが勝手に貼り足し、敵側のMARKED対象すら食い違う。',
    playerDiscovery: '二体の食い違いを利用すると追尾を互いへ誤誘導できる。',
    storyAfterimage: '整列した札束の一番上だけ、ペタの札が斜めに貼られている。',
  },

  {
    enemyAId: 'boss_closed_morning_box', enemyBId: 'boss_night_without_route', collisionKind: 'AMPLIFY', featuredPair: false,
    interactionHook: 'アサトジが出口を閉じ、ミチグレが閉じた出口へ続く道そのものを消す。',
    wrongReadingCollision: '一時保護とroute削減が重なると「戻れない安全」が完成してしまう。',
    encounterChoreography: '箱圧で狭まったarenaから古いrouteが順に消え、playerは新しい出口を能動的に作る。',
    playerDiscovery: '安全圏が帰路を持つとは限らない。',
    storyAfterimage: '鍵穴の向こうに道標はあるが矢印がない。',
  },
  {
    enemyAId: 'boss_closed_morning_box', enemyBId: 'omburo_black_origami', collisionKind: 'FALSE_ALLIANCE', featuredPair: true,
    interactionHook: 'アサトジは危険を箱へしまい、オリネは危険の意味を折り畳む。見た目は息が合う。',
    wrongReadingCollision: '「今は見せない」が二重化し、誰がいつ開けるかだけが完全に失われる。',
    encounterChoreography: '折られた攻撃cueが箱の蓋に隠れ、解除順を誤ると別phaseが開く。',
    playerDiscovery: '隠す技術が重なるほど解除条件を可視化する必要がある。',
    storyAfterimage: '箱の中に黒紙があるが、どちらにも開封者の欄がない。',
  },
  {
    enemyAId: 'boss_closed_morning_box', enemyBId: 'omburo_blank_card', collisionKind: 'AMPLIFY', featuredPair: false,
    interactionHook: 'アサトジが情報を閉じ、ハクマが外側の説明まで空白へ戻す。',
    wrongReadingCollision: '守った理由が消えることで、期限のない封印がさらに正当化される。',
    encounterChoreography: '箱の解除hintが余白化され、周辺objectの履歴から条件を推測する。',
    playerDiscovery: '理由が読めないことを「永遠に開けない理由」にしてはいけない。',
    storyAfterimage: '箱ラベルには項目線だけ残り、理由欄が空白。',
  },
  {
    enemyAId: 'boss_closed_morning_box', enemyBId: 'omburo_repair_seam', collisionKind: 'COMPETE_FOR_CONTROL', featuredPair: false,
    interactionHook: 'アサトジは壊れた物を閉じて保護し、ツグリは閉じた箱ごと修理して使おうとする。',
    wrongReadingCollision: '保存と再使用が、持ち主の意思を挟まず対象を奪い合う。',
    encounterChoreography: '修理された箱は硬くなるが継ぎ目が新しい解除点になる。',
    playerDiscovery: '守る/直すのどちらも同意なしなら侵害になり得る。',
    storyAfterimage: '新品の蝶番と古い鍵が同じ箱に残る。',
  },
  {
    enemyAId: 'boss_closed_morning_box', enemyBId: 'omburo_dream_wave', collisionKind: 'AMPLIFY', featuredPair: true,
    interactionHook: 'アサトジは身体を安全な箱へ、ユラネは意識を穏やかな夢へ閉じる。',
    wrongReadingCollision: '「傷つかない場所へ置く」が重なり、本人が戻る理由を失う。',
    encounterChoreography: '箱内が安全な夢領域に見えるが、長居するほど出口cueが薄くなる。',
    playerDiscovery: '穏やかな場所にも自分で出られる出口が必要だと分かる。',
    storyAfterimage: '箱の内側に朝の絵があるが、蓋の取っ手は外側だけ。',
  },
  {
    enemyAId: 'boss_closed_morning_box', enemyBId: 'omburo_nameplate', collisionKind: 'ACCIDENTAL_COUNTER', featuredPair: false,
    interactionHook: 'ペタが箱へ勝手に別ラベルを貼り続けるせいで、アサトジの分類が崩れる。',
    wrongReadingCollision: '固定保管は、訂正不能なラベルが混ざると自分の正しさを維持できない。',
    encounterChoreography: '誤ラベル箱だけ蓋の圧が一瞬止まり、playerが脱出口として使える。',
    playerDiscovery: 'ペタの欠点が別の八影を偶然崩す、少し笑える共演になる。',
    storyAfterimage: '「危険」「安全」「たぶん」の札が同じ箱に三重貼り。',
  },

  {
    enemyAId: 'boss_night_without_route', enemyBId: 'omburo_black_origami', collisionKind: 'FALSE_ALLIANCE', featuredPair: true,
    interactionHook: 'ミチグレは道を消し、オリネは残った道標を折って見えなくする。',
    wrongReadingCollision: '選択肢を減らす行為と、選択肢を隠す行為が同じ「迷わせない」結果へ向かう。',
    encounterChoreography: '消えるrouteと折られるmap cueが交互に来るが、折り目の白線だけが次の安全routeを示す。',
    playerDiscovery: '隠された痕跡が、消された痕跡より多く情報を残すことがある。',
    storyAfterimage: '折られた地図を開くと、消された道の圧痕だけ残る。',
  },
  {
    enemyAId: 'boss_night_without_route', enemyBId: 'omburo_blank_card', collisionKind: 'MUTUAL_ERASURE', featuredPair: true,
    interactionHook: 'ミチグレは地図線を消し、ハクマは地図の注釈まで空白へ戻す。',
    wrongReadingCollision: '場所と意味が同時に消え、何を失ったかさえ分からなくなる。',
    encounterChoreography: 'routeとUI hintの両方が薄れるが、playerの通過履歴だけは残る。',
    playerDiscovery: '外部の正解ではなく、自分たちが歩いた履歴を帰路として使う。',
    storyAfterimage: '真っ白な地図に三人分の足跡だけ残る。',
  },
  {
    enemyAId: 'boss_night_without_route', enemyBId: 'omburo_repair_seam', collisionKind: 'CONTRADICT', featuredPair: false,
    interactionHook: 'ミチグレが道を消すたび、ツグリが勝手に線を縫い直す。',
    wrongReadingCollision: '消して一つにする敵と、直して元へ戻す敵が互いの仕事を否定する。',
    encounterChoreography: '消されたrouteが継ぎ目として復活するが、元と少し位置がずれて新しい危険になる。',
    playerDiscovery: '元通りに戻すことも、消すことも唯一解ではない。',
    storyAfterimage: '地図の継ぎ線だけ別色で残る。',
  },
  {
    enemyAId: 'boss_night_without_route', enemyBId: 'omburo_dream_wave', collisionKind: 'FALSE_ALLIANCE', featuredPair: false,
    interactionHook: 'ミチグレが現実の道を減らし、ユラネが夢の中だけ帰路を見せる。',
    wrongReadingCollision: '現実で選べないほど、夢の一本道が正解に見えてしまう。',
    encounterChoreography: '実routeが消えると夢routeが明るくなるが、完全に乗ると開始地点へ戻される。',
    playerDiscovery: '夢の道は休憩には使えるが、現実の選択を代行できない。',
    storyAfterimage: '夢頁の地図には出口があるが、日付が昨日。',
  },
  {
    enemyAId: 'boss_night_without_route', enemyBId: 'omburo_nameplate', collisionKind: 'ACCIDENTAL_COUNTER', featuredPair: false,
    interactionHook: 'ペタが消えた道へ「こちら」札を貼り続け、ミチグレのroute整理を台無しにする。',
    wrongReadingCollision: '行き先を固定したい二体なのに、片方の誤記がもう片方の一本道を壊す。',
    encounterChoreography: '偽案内の一部が偶然安全routeとなり、正しい札だけ追うと逆に詰む。',
    playerDiscovery: '「正しい案内を探す」攻略そのものから離れられる。',
    storyAfterimage: '道のない壁に「出口→」の札。',
  },

  {
    enemyAId: 'omburo_black_origami', enemyBId: 'omburo_blank_card', collisionKind: 'CONTRADICT', featuredPair: false,
    interactionHook: 'オリネは意味を小さく折って残し、ハクマは意味自体を空白へ戻す。',
    wrongReadingCollision: '「隠して保存」と「消して保留」が保存の定義を奪い合う。',
    encounterChoreography: '折られたprojectile cueは残るが、余白fieldに入ると輪郭だけになる。',
    playerDiscovery: '見えないことと、無いことを区別する。',
    storyAfterimage: '白いカードの裏だけ折り目がある。',
  },
  {
    enemyAId: 'omburo_black_origami', enemyBId: 'omburo_repair_seam', collisionKind: 'COMPETE_FOR_CONTROL', featuredPair: false,
    interactionHook: 'ツグリは折り目を傷として伸ばし直し、オリネは修理跡をまた折って隠す。',
    wrongReadingCollision: '見える継ぎ目を消したい敵と、折り目を保存したい敵の作業が終わらない。',
    encounterChoreography: '形態変化とrepair fieldが互いを再生成し、playerは完全修復/完全展開を狙わず途中状態を使う。',
    playerDiscovery: '未完成状態が最も安全な瞬間がある。',
    storyAfterimage: '縫われた黒紙が半分だけ開いている。',
  },
  {
    enemyAId: 'omburo_black_origami', enemyBId: 'omburo_dream_wave', collisionKind: 'AMPLIFY', featuredPair: false,
    interactionHook: 'オリネが隠した意味を、ユラネが夢の中で都合よく補完する。',
    wrongReadingCollision: '情報不足を夢が勝手に埋め、見せない配慮が別の誤解へ変わる。',
    encounterChoreography: '折られたcueの欠損部分へ夢の偽cueが現れ、白い折り目だけが本物。',
    playerDiscovery: '分からない部分を心地よい推測で埋めない。',
    storyAfterimage: '夢で開いた黒紙と、現実の折り目が一致しない。',
  },
  {
    enemyAId: 'omburo_black_origami', enemyBId: 'omburo_nameplate', collisionKind: 'ACCIDENTAL_COUNTER', featuredPair: false,
    interactionHook: 'ペタが黒紙の外側へ札を貼りまくり、オリネの「見せない」外観が逆に目立つ。',
    wrongReadingCollision: '隠したい敵と目印を増やす敵が互いの目的を壊す。',
    encounterChoreography: 'ペタの札がオリネの変形位置を先に示すことがあり、playerへ偶然telegraphを提供する。',
    playerDiscovery: '敵同士の欠点が攻略情報になる。',
    storyAfterimage: '真っ黒な紙に蛍光色のような札だけ何枚も貼られている。',
  },

  {
    enemyAId: 'omburo_blank_card', enemyBId: 'omburo_repair_seam', collisionKind: 'CONTRADICT', featuredPair: false,
    interactionHook: 'ハクマが消した記述をツグリが「欠損」とみなし、黒い糸で勝手に補う。',
    wrongReadingCollision: '空白を完成と見る敵と、空白を故障と見る敵が衝突する。',
    encounterChoreography: '白いfieldへ黒い継ぎ線が増え、線を全部消す/全部直す以外の安全域が生まれる。',
    playerDiscovery: '空白にも継ぎ目にも意味があり、一律処理できない。',
    storyAfterimage: '何も書かれていない欄だけ丁寧に縁取りされる。',
  },
  {
    enemyAId: 'omburo_blank_card', enemyBId: 'omburo_dream_wave', collisionKind: 'AMPLIFY', featuredPair: false,
    interactionHook: 'ハクマが消した内容を、ユラネの夢が「きっとこうだった」と補う。',
    wrongReadingCollision: '空白への不安と夢の補完欲求が組み合わさり、最も自然な偽物を作る。',
    encounterChoreography: 'blank zone内にだけ偽memory objectが出るが、攻撃判定を持たないものも混ぜて見分けさせる。',
    playerDiscovery: '空白を埋めない勇気を戦闘でも使う。',
    storyAfterimage: '白紙の夢頁に「たぶん」とだけ追記される。',
  },
  {
    enemyAId: 'omburo_blank_card', enemyBId: 'omburo_nameplate', collisionKind: 'COMPETE_FOR_CONTROL', featuredPair: false,
    interactionHook: 'ハクマは札を消し、ペタは空いた場所へまた札を貼る。',
    wrongReadingCollision: '消去と上貼りが無限に反復し、どちらも訂正を受け入れない。',
    encounterChoreography: '札が付く/消えるcycleを読み、切り替わり瞬間だけ安全にする。',
    playerDiscovery: '無限訂正を止めるには「未記入」を正式状態にする必要がある。',
    storyAfterimage: '白いカードの隅に剥がれかけの札が一枚。',
  },

  {
    enemyAId: 'omburo_repair_seam', enemyBId: 'omburo_dream_wave', collisionKind: 'FALSE_ALLIANCE', featuredPair: true,
    interactionHook: 'ツグリは現実を勝手に修理し、ユラネは直らない部分だけ夢で「直ったこと」にする。',
    wrongReadingCollision: '直す能力と苦痛を見せない優しさが重なり、失敗記録が完全に消える。',
    encounterChoreography: '現実fieldの継ぎ目と夢fieldの完成像がずれ、差分を踏むと敵側shieldが剥がれる。',
    playerDiscovery: '直らなかった事実を残すことが攻略になる。',
    storyAfterimage: '夢では新品の灯り、現実では結び目のある灯芯が並ぶ。',
  },
  {
    enemyAId: 'omburo_repair_seam', enemyBId: 'omburo_nameplate', collisionKind: 'FALSE_ALLIANCE', featuredPair: true,
    interactionHook: 'ツグリが直した物へペタが「修理済み」の札を貼り、直っていない箇所まで完了扱いする。',
    wrongReadingCollision: '作業したことと完了したことが同一視される。',
    encounterChoreography: '修理済み札の付いたobjectが後から壊れてarea damageを出すため、札ではなく状態を見る。',
    playerDiscovery: 'ラベルや完了報告より現物を確認する。',
    storyAfterimage: '「完了」札の下からほつれ糸が出ている。',
  },

  {
    enemyAId: 'omburo_dream_wave', enemyBId: 'omburo_nameplate', collisionKind: 'AMPLIFY', featuredPair: false,
    interactionHook: 'ペタが付けた間違い名を、ユラネの夢が昔から呼ばれていたように馴染ませる。',
    wrongReadingCollision: '小さな見栄の上書きが、夢の自然さによって記憶レベルの誤認へ育つ。',
    encounterChoreography: '夢field内だけ偽名札がUI上も自然に見え、退出すると訂正線が読める。',
    playerDiscovery: '慣れた呼び方でも本人が選んだとは限らない。',
    storyAfterimage: '目覚めると札は間違っているのに、音だけ懐かしく感じる。',
  },
] as const;

const callNameByEnemy = new Map(yatsukageCallNames.map((entry) => [entry.enemyId, entry.callName]));
const spotlightIds = spotlightEnemyCharacterEntries.map((entry) => entry.enemyId);
const spotlightIdSet = new Set(spotlightIds);

function canonicalPairId(a: string, b: string): string {
  return [a, b].sort().join('::');
}

export const yatsukagePairDynamics: readonly YatsukagePairDynamicEntry[] = seeds.map((seed) => {
  if (!spotlightIdSet.has(seed.enemyAId) || !spotlightIdSet.has(seed.enemyBId)) {
    throw new Error(`八影 pair references non-八影 ID: ${seed.enemyAId}/${seed.enemyBId}`);
  }
  if (seed.enemyAId === seed.enemyBId) throw new Error(`八影 pair cannot self-reference: ${seed.enemyAId}`);
  const enemyACallName = callNameByEnemy.get(seed.enemyAId);
  const enemyBCallName = callNameByEnemy.get(seed.enemyBId);
  if (!enemyACallName || !enemyBCallName) throw new Error(`missing 八影 call name: ${seed.enemyAId}/${seed.enemyBId}`);
  return {
    ...seed,
    pairId: canonicalPairId(seed.enemyAId, seed.enemyBId),
    enemyACallName,
    enemyBCallName,
    factionBondCreated: false,
    friendshipImplied: false,
    commonMastermindImplied: false,
    runtimeAutoPromotionAllowed: false,
  };
});

export const yatsukagePairDynamicsSummary = {
  yatsukageCount: spotlightIds.length,
  possiblePairCount: spotlightIds.length * (spotlightIds.length - 1) / 2,
  authoredPairCount: yatsukagePairDynamics.length,
  featuredPairCount: yatsukagePairDynamics.filter((entry) => entry.featuredPair).length,
  collisionKindCount: new Set(yatsukagePairDynamics.map((entry) => entry.collisionKind)).size,
  uniquePairIdCount: new Set(yatsukagePairDynamics.map((entry) => entry.pairId)).size,
  factionBondCreated: false,
  commonMastermindImplied: false,
  runtimeAutoPromotionAllowed: false,
} as const;
