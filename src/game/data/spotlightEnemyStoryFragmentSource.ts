import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';
import { spotlightEnemyCharacterEntries } from './spotlightEnemyCharacterSource.ts';

export const SPOTLIGHT_ENEMY_FRAGMENT_KINDS = [
  'THREAT_TRACE',
  'PAST_FRAGMENT',
  'REINTERPRETATION',
] as const;

export type SpotlightEnemyFragmentKind = (typeof SPOTLIGHT_ENEMY_FRAGMENT_KINDS)[number];

export type SpotlightEnemyStoryFragmentSeed = {
  id: string;
  enemyId: string;
  kind: SpotlightEnemyFragmentKind;
  unlockAfterStageId: string;
  title: string;
  publicText: string;
  evidenceObject: string;
  interpretationBoundary: string;
};

const seeds: readonly SpotlightEnemyStoryFragmentSeed[] = [
  {
    id: 'ownerless-name-01-wrong-label',
    enemyId: 'boss_name_without_owner',
    kind: 'THREAT_TRACE',
    unlockAfterStageId: 'forgotten_street',
    title: '剥がされた一枚',
    publicText: '無数の名札を貼り付けた影は、戦いの途中で一枚だけ自分の手で剥がした。剥がされた札が正しかったのか、間違っていたのかはまだ分からない。',
    evidenceObject: '角だけ破れた無記名の名札',
    interpretationBoundary: 'この時点では敵が味方だった、本人を知っていた、とは解釈しない。',
  },
  {
    id: 'ownerless-name-02-provisional-ledger',
    enemyId: 'boss_name_without_owner',
    kind: 'PAST_FRAGMENT',
    unlockAfterStageId: 'name_tag_alley',
    title: '本人確認前',
    publicText: '古い整理票には、持ち主不明品へ仮の名前を付けた記録が続いている。訂正欄より「本人確認前」の印が多い。仮名が便利だった時間だけが長く残った。',
    evidenceObject: '「本人確認前」と押された整理票',
    interpretationBoundary: '記録を書いた人物や組織をCurrent人物へ結び付けない。',
  },
  {
    id: 'ownerless-name-03-name-before-person',
    enemyId: 'boss_name_without_owner',
    kind: 'REINTERPRETATION',
    unlockAfterStageId: 'unposted_post_office',
    title: '名前より先に',
    publicText: '名前を守ることと、本人より先に正解を決めることは同じではなかった。宛名を隠したままでも届け方を探せると知った後では、あの影が剥がした一枚の意味も少し違って見える。',
    evidenceObject: '宛名を覆う薄紙と空欄の名札',
    interpretationBoundary: '敵の行為による被害を善意で相殺しない。改心・救済を確定しない。',
  },
  {
    id: 'closed-morning-box-01-one-beat',
    enemyId: 'boss_closed_morning_box',
    kind: 'THREAT_TRACE',
    unlockAfterStageId: 'moon_box_library',
    title: '閉じる前の一拍',
    publicText: '巨大な蓋は、閉じる直前に必ずほんの一拍だけ止まった。攻撃の予告としては十分だったが、迷いなのか機構なのかは分からない。',
    evidenceObject: '擦り減った銀の蝶番',
    interpretationBoundary: '一拍を人格や後悔の証拠として断定しない。',
  },
  {
    id: 'closed-morning-box-02-temporary-seal',
    enemyId: 'boss_closed_morning_box',
    kind: 'PAST_FRAGMENT',
    unlockAfterStageId: 'ticket_gate_station',
    title: '「今は」の札',
    publicText: '保管札には「今は開けない」とある。期限欄だけが空白だった。守るための一時保管が、いつから永続する決まりになったのかは記録されていない。',
    evidenceObject: '期限欄だけ空白の保管札',
    interpretationBoundary: '閉じる行為そのものを悪としない。期限と本人の選択権が失われたことを問題にする。',
  },
  {
    id: 'closed-morning-box-03-open-by-choice',
    enemyId: 'boss_closed_morning_box',
    kind: 'REINTERPRETATION',
    unlockAfterStageId: 'blank_card_room',
    title: '開けない自由、開ける自由',
    publicText: '空欄を埋めない選択が許されるなら、箱も全部開ける必要はない。ただし、誰かが自分で開けたい時まで閉じておく理由にもならない。銀鍵は「開ける命令」ではなく選択を戻す道具になる。',
    evidenceObject: '持ち主へ返された銀鍵',
    interpretationBoundary: '全箱開封や全過去暴露をTrue End条件にしない。',
  },
  {
    id: 'route-less-night-01-erased-road',
    enemyId: 'boss_night_without_route',
    kind: 'THREAT_TRACE',
    unlockAfterStageId: 'return_map_crossing',
    title: '最初に消えた道',
    publicText: '影は近い道からではなく、古い書き込みの多い道から消していった。危険度を知っていたのか、ただ線が多い場所を嫌ったのかは分からない。',
    evidenceObject: '一本だけ黒く塗られた地図片',
    interpretationBoundary: '敵が過去の事故を直接記憶しているとは断定しない。',
  },
  {
    id: 'route-less-night-02-five-guides',
    enemyId: 'boss_night_without_route',
    kind: 'PAST_FRAGMENT',
    unlockAfterStageId: 'old_compass_station',
    title: '五つの正しい道',
    publicText: '年代の違う案内図は五枚とも、その時代では役に立っていたらしい。橋が移り、道が塞がり、書き直されるたび「前の正解」が間違いに見えるようになった。',
    evidenceObject: '縮尺と年代が違う五枚の案内図',
    interpretationBoundary: '一人の悲劇や犯人へ収束させず、善意の訂正が積み重なった記録として扱う。',
  },
  {
    id: 'route-less-night-03-choice-remains',
    enemyId: 'boss_night_without_route',
    kind: 'REINTERPRETATION',
    unlockAfterStageId: 'ruler_rooftop',
    title: '測っても一つではない',
    publicText: '角度も距離も測れる。それでも帰り道は一つに決まらない夜がある。間違える可能性を消すため道を消すより、戻れる印を複数残す方が強い。',
    evidenceObject: '北を指さない折れた針',
    interpretationBoundary: '測定を否定しない。測定値から唯一の人生選択を自動決定しない。',
  },
  {
    id: 'black-origami-01-same-fold',
    enemyId: 'omburo_black_origami',
    kind: 'THREAT_TRACE',
    unlockAfterStageId: 'black_origami_roof',
    title: '同じ折り目',
    publicText: '形を変え続けた黒折にも、最後まで開かなかった一本の折り目があった。撃破後の黒紙にも同じ線だけが残る。',
    evidenceObject: '一本だけ深く折られた黒紙',
    interpretationBoundary: '折り目をShadow個人の署名・血縁・創造者証拠にしない。',
  },
  {
    id: 'black-origami-02-reason-outside',
    enemyId: 'omburo_black_origami',
    kind: 'PAST_FRAGMENT',
    unlockAfterStageId: 'erased_name_wall',
    title: '理由は外側にあった',
    publicText: '「見せない方がいい」と書かれた紙が何度も折り直されている。古い外側ほど理由が詳しく、内側へ進むほど理由が短くなり、最後には「開けない」だけが残る。',
    evidenceObject: '折るほど説明が減る黒い記録紙',
    interpretationBoundary: '誰が何を隠したかというMain Mysteryの答えをこの紙だけで固定しない。',
  },
  {
    id: 'black-origami-03-not-opening',
    enemyId: 'omburo_black_origami',
    kind: 'REINTERPRETATION',
    unlockAfterStageId: 'blank_card_room',
    title: '開かないことを選ぶ',
    publicText: '開けないことと、永遠に隠すことは違う。最後の黒紙を今は開かないまま持ち帰れるなら、黒折の「隠すしかない」は唯一の答えではなくなる。',
    evidenceObject: '未開封のまま保管された黒紙',
    interpretationBoundary: '黒折を仲間化・人格化することを必須にしない。再登場しても前回の勝利を無効化しない。',
  },
  {
    id: 'blank-card-01-unwritten-line',
    enemyId: 'omburo_blank_card',
    kind: 'THREAT_TRACE',
    unlockAfterStageId: 'blank_card_room',
    title: '書かれなかった一行',
    publicText: '余白枠が消える直前、中央に細い線が一本だけ現れた。文字になる前に消えたため、何を書こうとしたのかは読めない。',
    evidenceObject: '中央だけ白いカード片',
    interpretationBoundary: '線を隠しメッセージとして解読・補完しない。',
  },
  {
    id: 'blank-card-02-erased-corrections',
    enemyId: 'omburo_blank_card',
    kind: 'PAST_FRAGMENT',
    unlockAfterStageId: 'blank_card_room',
    title: '訂正の下',
    publicText: '紙を透かすと、何度も書いて消した圧痕だけが重なっている。最後に何が正しかったかより、間違いを書くこと自体を怖がるようになった過程が残っている。',
    evidenceObject: '消し跡の圧痕が重なる白カード',
    interpretationBoundary: '消された原文を新規Canonとして復元しない。',
  },
  {
    id: 'blank-card-03-valid-empty',
    enemyId: 'omburo_blank_card',
    kind: 'REINTERPRETATION',
    unlockAfterStageId: 'dawn_return_square',
    title: '未記入も記録',
    publicText: '朝になってもカードは白い。けれど図鑑の欄は欠損ではなく「未記入」として残せる。分からないことを消す必要も、適当な答えで埋める必要もない。',
    evidenceObject: '「未記入」の分類札',
    interpretationBoundary: 'Title1 Happy Endで空白の正体を全解明しない。',
  },
  {
    id: 'repair-seam-01-fixes-first',
    enemyId: 'omburo_repair_seam',
    kind: 'THREAT_TRACE',
    unlockAfterStageId: 'repair_lamp_workshop',
    title: '戦う前に直す',
    publicText: '継ぎ目はプレイヤーより先に壊れた灯具へ向かった。直した場所から黒い範囲が広がったため、善意に見える動作ほど危険だった。',
    evidenceObject: '黒い糸で縫われた灯芯',
    interpretationBoundary: '修理行動を善性や元人間の証拠と断定しない。',
  },
  {
    id: 'repair-seam-02-stopped-ledger',
    enemyId: 'omburo_repair_seam',
    kind: 'PAST_FRAGMENT',
    unlockAfterStageId: 'pressed_flower_archive',
    title: '直らなかった欄',
    publicText: '修理帳には「直せる」と書かれた行が続き、一箇所だけ途中で文章が切れている。失敗理由も廃棄理由もなく、次のページから再び「直せる」に戻っている。',
    evidenceObject: '一行だけ途中で止まった修理帳',
    interpretationBoundary: '記録者をトモリ本人へ同一化しない。',
  },
  {
    id: 'repair-seam-03-visible-mend',
    enemyId: 'omburo_repair_seam',
    kind: 'REINTERPRETATION',
    unlockAfterStageId: 'blank_card_room',
    title: '継ぎ目を隠さない',
    publicText: '直らなかった記録を空欄のまま残し、直した物には継ぎ目を残す。失敗や傷を見えなくすることより、また使えることを選べる。',
    evidenceObject: '結び目を切らずに残した修理糸',
    interpretationBoundary: '傷や故障を美化しない。直す/残すは持ち主と状況ごとに選ぶ。',
  },
  {
    id: 'dream-wave-01-soft-danger',
    enemyId: 'omburo_dream_wave',
    kind: 'THREAT_TRACE',
    unlockAfterStageId: 'dream_waterway',
    title: 'いちばん静かな危険',
    publicText: '追い詰められた時ほど夢波の波紋は静かになった。逃げ場に見える場所ほど長く留まりたくなるが、起きて動く時間は確実に減っていく。',
    evidenceObject: '波紋だけ残る水色の頁',
    interpretationBoundary: '夢・睡眠そのものを悪として扱わない。',
  },
  {
    id: 'dream-wave-02-until-morning',
    enemyId: 'omburo_dream_wave',
    kind: 'PAST_FRAGMENT',
    unlockAfterStageId: 'ruler_rooftop',
    title: '朝まで眠れたら',
    publicText: '「せめて朝まで眠れたら」と書かれた短い記録がある。誰の病気や死も書かれていない。ただ、眠れない夜に休ませたいという願いと、朝に起こす役目の記述だけが別ページへ抜け落ちている。',
    evidenceObject: '時刻欄のずれた睡眠記録',
    interpretationBoundary: '病気・死別・犠牲を後付けして感動を増幅しない。',
  },
  {
    id: 'dream-wave-03-wake-and-choose',
    enemyId: 'omburo_dream_wave',
    kind: 'REINTERPRETATION',
    unlockAfterStageId: 'dawn_return_square',
    title: '起きて選べる',
    publicText: '夢が間違いだったのではない。眠ったことも休んだことも消さず、朝になったら起きて選び直せる。その余地が夢波には欠けていた。',
    evidenceObject: '乾いた朝露の跡',
    interpretationBoundary: '夢を事実へ昇格しない。現実だけを価値ある記録とも扱わない。',
  },
  {
    id: 'nameplate-01-again',
    enemyId: 'omburo_nameplate',
    kind: 'THREAT_TRACE',
    unlockAfterStageId: 'name_tag_alley',
    title: 'また違う札',
    publicText: '倒した後に残った名札は、次に見た時には別の場所へ貼られていた。訂正というより、前の札が見えないよう上から貼り直している。',
    evidenceObject: '三枚重ねになった名札',
    interpretationBoundary: '小物っぽい挙動でもMARKEDの実害を軽視しない。',
  },
  {
    id: 'nameplate-02-no-correction-line',
    enemyId: 'omburo_nameplate',
    kind: 'PAST_FRAGMENT',
    unlockAfterStageId: 'chalk_classroom',
    title: '訂正線を引けない',
    publicText: '整理台帳には消去も訂正線もなく、新しい札を貼った跡だけが厚く残る。大きな悲劇ではなく「前の自分が間違った」と見えることを避け続けた痕跡に近い。',
    evidenceObject: '上貼り跡で厚くなった台帳',
    interpretationBoundary: '壮大な秘密や悲劇を追加せず、小さな見栄・頑固さとして残す。',
  },
  {
    id: 'nameplate-03-correct-is-not-now',
    enemyId: 'omburo_nameplate',
    kind: 'REINTERPRETATION',
    unlockAfterStageId: 'unposted_post_office',
    title: '正しくても、今ではない',
    publicText: '正しい宛名でも今届けるべきとは限らない。正しい名前でも本人が今そう呼ばれたいとは限らない。札を貼り直すだけでは、その違いを扱えない。',
    evidenceObject: '封をしたままの宛名札',
    interpretationBoundary: '名前の重要性を否定しない。本人の訂正権とtimingを追加する。',
  },
] as const;

const stageIds = new Set(series1StageCampaignContentEntries.map((stage) => stage.stageId));
const spotlightById = new Map(spotlightEnemyCharacterEntries.map((entry) => [entry.enemyId, entry]));

export const spotlightEnemyStoryFragments = seeds.map((seed, index) => {
  if (!spotlightById.has(seed.enemyId)) throw new Error(`unknown spotlight enemy fragment owner: ${seed.enemyId}`);
  if (!stageIds.has(seed.unlockAfterStageId)) throw new Error(`unknown fragment unlock stage: ${seed.unlockAfterStageId}`);
  return {
    ...seed,
    order: index + 1,
    collectionSection: 'bestiary' as const,
    optionalReading: true as const,
    grantsCombatPower: false as const,
    requiredForStoryComplete: false as const,
    requiredForAllLights: false as const,
    mainMysteryAnswerFrozen: false as const,
    authority: 'CONTENT_SOURCE_ONLY' as const,
    runtimeAutoPromotionAllowed: false as const,
  };
});

export const spotlightEnemyStoryFragmentSummary = {
  spotlightEnemyCount: spotlightEnemyCharacterEntries.length,
  fragmentCount: spotlightEnemyStoryFragments.length,
  fragmentsPerEnemy: Object.fromEntries(
    spotlightEnemyCharacterEntries.map((enemy) => [
      enemy.enemyId,
      spotlightEnemyStoryFragments.filter((fragment) => fragment.enemyId === enemy.enemyId).length,
    ]),
  ),
  kindCounts: Object.fromEntries(
    SPOTLIGHT_ENEMY_FRAGMENT_KINDS.map((kind) => [kind, spotlightEnemyStoryFragments.filter((fragment) => fragment.kind === kind).length]),
  ),
  collectionSection: 'bestiary',
  optionalReading: true,
  grantsCombatPower: false,
  requiredForStoryComplete: false,
  requiredForAllLights: false,
  mainMysteryAnswerFrozen: false,
  runtimeAutoPromotionAllowed: false,
} as const;
