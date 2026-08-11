import { enemyProductionEntries } from './enemyProductionDatabase.ts';
import { spotlightEnemyCharacterEntries } from './spotlightEnemyCharacterSource.ts';

export type SpotlightEnemyRecognitionSeed = {
  enemyId: string;
  recognitionRole: 'ICONIC_BOSS' | 'RECURRING_ELITE' | 'PETTY_RIVAL';
  signatureGesture: string;
  entranceRitual: string;
  idleRitual: string;
  attackAnticipationDelta: string;
  defeatGesture: string;
  recurrenceRule: string;
  collectionPose: string;
  soundTexture: string;
  humanizingBeatWithoutAbsolution: string;
  mobileRecognitionRule: string;
  accessibilityRule: string;
  forbiddenShortcut: string;
};

const seeds: readonly SpotlightEnemyRecognitionSeed[] = [
  {
    enemyId: 'boss_name_without_owner',
    recognitionRole: 'ICONIC_BOSS',
    signatureGesture: '周囲へ名札を撒く前、必ず一枚だけ自分の正面へ持ち上げ、読めないまま裏返す。',
    entranceRitual: 'arena中央へ出る前に床の名札を一直線へ並べ直し、最後の一枚だけ列から外す。',
    idleRitual: '名札の角を揃え続ける。playerへ顔を向けるより先に札の位置を直す。',
    attackAnticipationDelta: 'MARKED系attackでは札の面がplayer方向へ揃う。通常cueの前に「揃える」動作を追加し、文字や色だけに依存しない。',
    defeatGesture: '散った名札を回収しようとして一枚だけ手を止め、その空欄を残したまま崩れる。',
    recurrenceRule: '再戦や図鑑animationでも「一枚だけ列から外す」を固定し、別形態でもritualを失わない。',
    collectionPose: '名札の列を背にし、空欄の一枚だけ手前へ置く。説明文字をsprite内へ描かない。',
    soundTexture: '乾いた紙の擦れ + 小さな札の接触音。声や人語をsignatureにしない。',
    humanizingBeatWithoutAbsolution: '誤った札を自分で一枚剥がす瞬間だけ、攻撃を一拍止める。善行判定や味方化にはしない。',
    mobileRecognitionRule: '小画面では「大量の四角札 + 一枚だけ外れた札 + 中央の縦姿勢」の三要素で識別できること。',
    accessibilityRule: 'MARKED cueは色だけでなく札の向き・揃うmotion・輪郭変化で読む。点滅を使わない。',
    forbiddenShortcut: '顔を付けて喋らせる、実在言語の名前を大書きする、他作品の仮面/名札悪役の固有意匠を借りる。',
  },
  {
    enemyId: 'boss_closed_morning_box',
    recognitionRole: 'ICONIC_BOSS',
    signatureGesture: '蓋を閉じる直前だけ、蝶番側が一拍止まる。全phaseでこの「迷いに見える間」を維持する。',
    entranceRitual: '最初から全開で現れず、半開きの暗い箱が一度player方向へ傾いてからゆっくり正面を向く。',
    idleRitual: '鍵が閉じる/開く寸前まで動いて戻る微細loop。完全lock状態で静止し続けない。',
    attackAnticipationDelta: 'hard-control変換attackは蓋の影が先に狭まり、安全域が視覚的に読める。画面暗転で表現しない。',
    defeatGesture: '蓋が完全に開くのではなく、銀鍵だけが外れて半開きのまま停止する。',
    recurrenceRule: '別sceneでも「半開き」「閉じる前の一拍」「外れた銀鍵」のどれか二つを必ず残す。',
    collectionPose: '半開きの箱 + 手前に外れた銀鍵。中身を見せてMain Mysteryをvisual leakしない。',
    soundTexture: '木/紙箱の低い軋み + 銀鍵の一音。重い爆音より静かな圧を優先。',
    humanizingBeatWithoutAbsolution: '攻撃後、開いた隙間へ落ちた小物を一度だけ内側へ戻す。保護に見えるがplayerの選択権は返さない。',
    mobileRecognitionRule: '128px級でなくても、幅広い箱silhouette・斜め蓋・単独銀鍵が読めること。',
    accessibilityRule: '蓋の角度と影面積でattack phaseを読めるようにし、青/銀の色差だけへ依存しない。',
    forbiddenShortcut: '箱の中へ泣いている人間や死者を直接描き、悲劇を一枚絵で説明する。',
  },
  {
    enemyId: 'boss_night_without_route',
    recognitionRole: 'ICONIC_BOSS',
    signatureGesture: '地図線を消す前、角/先端が消す対象のrouteへ静かに向く。突進より「選んで消す」所作をsignatureにする。',
    entranceRitual: 'arenaの端から大きく横切らず、既存route線の上へ重なるよう静止し、その線だけが遅れて黒くなる。',
    idleRitual: '複数routeへ順に向きを変えるが、すぐ攻撃しない。何を消すか測っているように見える。',
    attackAnticipationDelta: '消去対象routeを輪郭/線幅/方向motionで先に示す。UI矢印を敵本体へ貼らない。',
    defeatGesture: '崩れる直前に一本だけrouteを消さず残し、折れた針が別方向へ落ちる。',
    recurrenceRule: '形態が変わっても「静止→対象routeへ向く→線が遅れて変化」の三拍を維持する。',
    collectionPose: '複数の地図線の上に立ち、一本だけ足元を通り抜ける構図。正解routeを強調しない。',
    soundTexture: '遠い線路/紙を引くような低摩擦音。咆哮を主signatureにしない。',
    humanizingBeatWithoutAbsolution: '古い書き込みが多いrouteから優先して消す癖を見せるが、その理由をその場で説明しない。',
    mobileRecognitionRule: '大きい単色塊だけでなく、長い方向性silhouette + 足元routeとの重なりで識別する。',
    accessibilityRule: 'route消去cueは明度差・線幅・方向の三重化。full-screen flash/strobe禁止。',
    forbiddenShortcut: '鹿/駅/時計など別visual authorityのboss意匠へ勝手に寄せ、既存Enemy48 sourceを上書きする。',
  },
  {
    enemyId: 'omburo_black_origami',
    recognitionRole: 'RECURRING_ELITE',
    signatureGesture: '形態変化のたび一本だけ同じ深い折り目が残る。輪郭が変わってもその折線位置をrecognition anchorにする。',
    entranceRitual: '黒紙が一度平らに見え、最小限の2〜3折りで現在形へなる。複雑な変形showcaseにしない。',
    idleRitual: '角を少し開いては戻す。中身を見せそうで見せない小さなloop。',
    attackAnticipationDelta: '攻撃方向側の折角だけ先に開くため、DARK色を見分けなくても射線を予測できる。',
    defeatGesture: '爆散ではなく平たい黒紙へ戻り、一本の折り目だけ消えず残る。',
    recurrenceRule: '再登場では折り形を変えてよいが、同じ一本の折り目と「開きかけて戻す」idleを固定する。',
    collectionPose: '平紙と戦闘形を二重表示せず、一つの形に深い折線だけ見せる。',
    soundTexture: '厚い和紙ではなく乾いた薄紙の折れ音 + 黒インクの湿った擦れ。',
    humanizingBeatWithoutAbsolution: 'playerが危険な記録へ近づいた時だけ、その記録を先に折り隠す挙動を一度見せる。',
    mobileRecognitionRule: '色ではなく非対称折角 + 一本の深い折線 + 薄いpaper silhouetteでOmbro他個体と分ける。',
    accessibilityRule: 'DARK/BLACKの濃淡だけでphaseを示さず、角度と開閉motionを併用する。',
    forbiddenShortcut: '有名折り紙/式神/紙使いキャラの固有シルエット、印、技名を参照再現する。',
  },
  {
    enemyId: 'omburo_blank_card',
    recognitionRole: 'RECURRING_ELITE',
    signatureGesture: '常に白い中央面をplayerへ向けるが、中央に顔・目・文字を足さない。余白そのものを視線にする。',
    entranceRitual: '画面外から飛び込まず、背景の紙面から輪郭だけ遅れて浮き上がる。',
    idleRitual: '外周だけが微細にずれ、中央は不自然なほど静止する。',
    attackAnticipationDelta: 'attack前は外周が内側へ寄る。中央色を変えるのではなく「余白が狭くなる」形でcueする。',
    defeatGesture: '消滅前に中央へ一本の線が出るが文字になる前に途切れ、外周から薄くなる。',
    recurrenceRule: '毎回「中央は書かない」を守る。情報追加で人気を作ろうとして顔や秘密文を増やさない。',
    collectionPose: '正面の白い中央 + quiet outer rim。図鑑側で未記入状態を明示し、spriteへ文字は描かない。',
    soundTexture: '消し粉/紙を擦る小音。無音区間をsignatureとして使い、常時効果音を鳴らさない。',
    humanizingBeatWithoutAbsolution: '誤ったラベルが床にある時だけ一度消すが、正しい情報まで消す危険性は残る。',
    mobileRecognitionRule: 'negative-space中央と太さ一定の外周で42〜76px級でも識別可能にする。',
    accessibilityRule: '白/黒コントラストに加えて外周収縮motionをattack cueへ使う。',
    forbiddenShortcut: '空白へ顔を描く、glitch文字を出す、ホラー字幕で怖さを説明する。',
  },
  {
    enemyId: 'omburo_repair_seam',
    recognitionRole: 'RECURRING_ELITE',
    signatureGesture: '周囲の壊れたpropへplayerより先に反応し、黒い継ぎ目を一本だけ通す。',
    entranceRitual: '既に壊れているobjectの横へ現れ、playerを見ず最初の一針/一継ぎを行ってから戦闘姿勢へ移る。',
    idleRitual: '自分の継ぎ目を直すのではなく、近くの亀裂へ向きを変える。caretaker obsessionをidleへ出す。',
    attackAnticipationDelta: '糸/継ぎ目の始点が先に固定され、そこから危険範囲が伸びる。線の色だけでなく始点gestureを読む。',
    defeatGesture: '最後の糸を切らず結び目だけ残し、自分の輪郭から先にほどける。',
    recurrenceRule: '再登場時も周囲propへ一度反応する。arenaにpropがない場合は自分が付けた古い継ぎ目を確認する。',
    collectionPose: '一本のvisible seamと結び目を正面へ。新品のように綺麗な完成品poseにしない。',
    soundTexture: '糸を引く擦れ + 小さな工具接触音。機械ロボット音へ寄せない。',
    humanizingBeatWithoutAbsolution: '攻撃で壊れた小物を戦闘中に直してしまうが、持ち主の許可を聞く能力はない。',
    mobileRecognitionRule: '継ぎ目line + 一つの大きな結び目 + repair方向へ傾くsilhouetteを主要3記号にする。',
    accessibilityRule: '危険線は始点固定→伸長の時間差で読ませ、赤色warningだけに依存しない。',
    forbiddenShortcut: '縫合痕を身体損壊ホラーへ寄せる、既存の縫いぐるみ悪役の顔/ボタン目を借りる。',
  },
  {
    enemyId: 'omburo_dream_wave',
    recognitionRole: 'RECURRING_ELITE',
    signatureGesture: '危険時ほどmotionがゆっくり滑らかになる。激しくなる通常敵と逆のtempoをsignatureにする。',
    entranceRitual: '水面/床へ一つの波紋が出た後、本体が遅れてその中心へ浮く。',
    idleRitual: '呼吸のような長周期の膨張/収縮。sleep表現でも目・枕・zzz記号を足さない。',
    attackAnticipationDelta: 'DROWSY pressure前は波紋間隔が広がる。入力遅延ではなく敵側cue timingだけで眠気を表現する。',
    defeatGesture: '波紋が一度だけ朝露の小滴へまとまり、音を立てず平らになる。',
    recurrenceRule: '再登場でも「危険ほど静か」を維持し、phase強化で急に高速bullet hellへしない。',
    collectionPose: '低い波形silhouette + 中央の静かな空間。眠っている人間の顔を入れない。',
    soundTexture: '遠い水音 + 布越しの生活音に近いsoft texture。具体的な人物voiceは使わない。',
    humanizingBeatWithoutAbsolution: '瀕死player付近に一瞬だけ安全地帯に見える静かな波を作るが、留まるほどtempoを奪う矛盾を残す。',
    mobileRecognitionRule: '低い横長wave silhouetteと長周期motionで識別し、淡色paletteだけへ依存しない。',
    accessibilityRule: 'DROWSY cueは波紋の間隔/輪郭/音間隔で三重化し、blurや画面暗転を避ける。',
    forbiddenShortcut: '夢=死者との再会を定番演出として足す、眠り目アイコンや他作品の夢魔意匠を借りる。',
  },
  {
    enemyId: 'omburo_nameplate',
    recognitionRole: 'PETTY_RIVAL',
    signatureGesture: '貼り間違えた札を剥がさず、その上から新しい札を少しずらして重ねる。回数が増えるほど厚みだけ増す。',
    entranceRitual: 'playerへ向かう前に近くのobjectへ一枚貼り、すぐ違うと気づいたように二枚目を上貼りする。',
    idleRitual: '貼った札を気にして端を押さえるが、剥がして訂正はしない。少し滑稽な執着を作る。',
    attackAnticipationDelta: 'MARKED attack前は札束を一度めくるため、同族と見分けやすい手前motionを持つ。',
    defeatGesture: '本体は逃げる/崩れるが、厚い札束だけその場へ残る。最後の一枚が少し斜め。',
    recurrenceRule: '再登場時は前回より札が一枚増えていてよい。ただし強さの数値成長や永続追跡を勝手にCanon化しない。',
    collectionPose: '少し斜めに重なった3枚の札を前面に。文字内容は読ませない。',
    soundTexture: '紙をぺたっと貼る乾いた小音。Boss級低音を付けず、小物感をCharmとして残す。',
    humanizingBeatWithoutAbsolution: '間違いに気づいた瞬間だけ動きが止まり、剥がす代わりに上貼りする。恥ずかしさ/見栄を大悲劇へ膨らませない。',
    mobileRecognitionRule: '重なった札の段差 + 斜め一枚 + 前傾bodyの三要素で識別する。',
    accessibilityRule: 'MARKED cueは札束をめくるmotionと貼付音で補い、dawn pink等の色だけに依存しない。',
    forbiddenShortcut: 'コミカルだから無害にする、台詞でツンデレ化する、有名小物系悪役の口癖/顔を移植する。',
  },
] as const;

const productionById = new Map(enemyProductionEntries.map((entry) => [entry.id, entry]));
const spotlightIds = new Set(spotlightEnemyCharacterEntries.map((entry) => entry.enemyId));

export const spotlightEnemyRecognitionEntries = seeds.map((seed) => {
  const production = productionById.get(seed.enemyId);
  if (!production) throw new Error(`Spotlight recognition enemy missing from Enemy48: ${seed.enemyId}`);
  if (!spotlightIds.has(seed.enemyId)) throw new Error(`recognition source may only target Spotlight8: ${seed.enemyId}`);
  return {
    ...seed,
    baseEnemyName: production.name,
    baseRank: production.rank,
    baseSilhouetteAuthority: production.silhouette,
    basePaletteAuthority: production.palette,
    baseAttackCueAuthority: production.attackCue,
    geometryOverrideAllowed: false as const,
    paletteOverrideAllowed: false as const,
    enemyRosterExpansionAllowed: false as const,
    assetProductionStatus: 'RECOGNITION_GUIDE_NOT_FINAL_ART' as const,
    authority: 'CONTENT_SOURCE_ONLY' as const,
    runtimeAutoPromotionAllowed: false as const,
  };
});

export const spotlightEnemyRecognitionSummary = {
  spotlightCount: spotlightEnemyCharacterEntries.length,
  recognitionEntryCount: spotlightEnemyRecognitionEntries.length,
  iconicBossCount: spotlightEnemyRecognitionEntries.filter((entry) => entry.recognitionRole === 'ICONIC_BOSS').length,
  recurringEliteCount: spotlightEnemyRecognitionEntries.filter((entry) => entry.recognitionRole === 'RECURRING_ELITE').length,
  pettyRivalCount: spotlightEnemyRecognitionEntries.filter((entry) => entry.recognitionRole === 'PETTY_RIVAL').length,
  allReuseEnemy48: spotlightEnemyRecognitionEntries.every((entry) => productionById.has(entry.enemyId)),
  geometryOverrideAllowed: false,
  paletteOverrideAllowed: false,
  finalArtApproved: false,
  enemyRosterExpansionAllowed: false,
  runtimeAutoPromotionAllowed: false,
} as const;
