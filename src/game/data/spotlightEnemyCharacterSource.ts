import { enemyProductionEntries } from './enemyProductionDatabase.ts';
import type { CurrentRelationCharacterId } from './currentRelationshipInventory.ts';

export type SpotlightEnemyArchetype =
  | 'AMBIGUOUS_THREAT'
  | 'TRAGIC_MIRROR'
  | 'OVERWHELMING_FORCE'
  | 'RECURRING_RIVAL'
  | 'UNCANNY_OBSERVER'
  | 'BROKEN_CARETAKER'
  | 'TEMPTING_ESCAPE'
  | 'PETTY_NEMESIS';

export type SpotlightEnemyCharacterEntry = {
  enemyId: string;
  archetype: SpotlightEnemyArchetype;
  characterHook: string;
  currentWant: string;
  deepestFear: string;
  contradiction: string;
  recurringBehavior: string;
  communicationStyle: string;
  pastStory: string;
  pastRevealRule: string;
  mirrorCharacterIds: readonly CurrentRelationCharacterId[];
  storyBeats: readonly {
    stageId: string;
    beatKind: 'PRE_ECHO' | 'ENCOUNTER' | 'AFTERIMAGE' | 'LATE_REINTERPRETATION';
    beat: string;
  }[];
  defeatAftertaste: string;
  sympathyDoesNotEraseHarm: true;
  redemptionRequired: false;
  enemyRosterExpansionAllowed: false;
  authority: 'CONTENT_SOURCE_ONLY';
  runtimeAutoPromotionAllowed: false;
};

const spotlightSeeds: readonly SpotlightEnemyCharacterEntry[] = [
  {
    enemyId: 'boss_name_without_owner',
    archetype: 'AMBIGUOUS_THREAT',
    characterHook: '敵なのに、誰かの名前を消すのではなく「間違って付いた名前だけ」を剥がす瞬間がある。味方に見える一手が一度だけ混じる。',
    currentWant: '夜に散った名前を一つの正しい対応表へ固定し、誰も迷わない状態を作る。',
    deepestFear: '名前が本人から離れたまま残り、誰にも選び直されないこと。',
    contradiction: '本人のために名前を守りたいのに、本人より先に「正しい名前」を決めてしまう。',
    recurringBehavior: '戦闘前後に名札を並べ直す。同じ順番へ戻そうとするが、一枚だけ毎回位置が違う。',
    communicationStyle: '文章では話さない。拾った名前を断片的に呼ぶだけで、誰の名前かを確定しない。',
    pastStory: 'かつて複数の持ち主不明品へ善意で仮名を付け続けた記録があり、その仮名だけが持ち主より長く残った。敵はその「仮の答えが本人を追い越した夜」のWrong Readingを核にしている。',
    pastRevealRule: '悲しい由来を先に出して同情させない。まず怖さと執着を見せ、後から「守ろうとして固定した」履歴を小さく開示する。',
    mirrorCharacterIds: ['yui', 'asa', 'kage2', 'yubi'],
    storyBeats: [
      { stageId: 'forgotten_street', beatKind: 'ENCOUNTER', beat: '名前を貼り付けてMARKED執着を作る一方、誤った名札を一枚だけ自分で剥がす。' },
      { stageId: 'name_tag_alley', beatKind: 'AFTERIMAGE', beat: '剥がされた名札の裏に「本人確認前」とだけ残る。誰が書いたかは確定しない。' },
      { stageId: 'unposted_post_office', beatKind: 'LATE_REINTERPRETATION', beat: '宛名保護の運用と比較され、敵の失敗が「名前を守ること」ではなく「本人より先に固定したこと」だと見える。' },
    ],
    defeatAftertaste: '倒した後も全部の名札は戻らない。一枚だけ空欄の札が残り、ユイたちは埋めずに持ち帰る。',
    sympathyDoesNotEraseHarm: true,
    redemptionRequired: false,
    enemyRosterExpansionAllowed: false,
    authority: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'boss_closed_morning_box',
    archetype: 'TRAGIC_MIRROR',
    characterHook: '守ることに一切迷いがない。攻撃のたびに味方を閉じ込めるのではなく、危険なものごと外から箱で覆う「善意に見える暴力」を行う。',
    currentWant: '朝へ持ち出すものを完全に管理し、失われる可能性そのものを消す。',
    deepestFear: '一度開けたことで大切なものを二度と戻せなくなること。',
    contradiction: '残したいから閉じるのに、閉じ続けることで本人が選び直す機会を奪う。',
    recurringBehavior: '箱を閉じる前に必ず一拍だけ待つ。その一拍は「本当は開けたい」迷いの名残だが、初見ではattack cueにしか見えない。',
    communicationStyle: '蓋の開閉音と鍵の向きで意思を示す。台詞は持たせない。',
    pastStory: '誰かの朝の記憶を「今は見せない方が安全」としまった行為が起点。保護期限が失われ、「今は」が「永遠に」へ変わったことでWrong Readingが自立した。',
    pastRevealRule: '被害を受けた側の選択権を先に描き、守った側の事情は後から出す。過去が正当化にならない順番を守る。',
    mirrorCharacterIds: ['nagi', 'kage1', 'tobari', 'koyori'],
    storyBeats: [
      { stageId: 'moon_box_library', beatKind: 'ENCOUNTER', beat: 'FREEZE/SLEEP/ROOTEDを完全無効化せずdelayへ変換し、「閉じる」攻略そのものを否定しない。' },
      { stageId: 'ticket_gate_station', beatKind: 'LATE_REINTERPRETATION', beat: '帰るために開ける門と比較され、箱の問題は閉じること自体ではなく期限を失ったことだと分かる。' },
      { stageId: 'blank_card_room', beatKind: 'AFTERIMAGE', beat: '空白のカードに「開封期限」の欄だけが残る。日付は書かれていない。' },
    ],
    defeatAftertaste: '銀鍵は手に入るが、ユイたちはその場で全箱を開けない。勝利と暴露を同一化しない。',
    sympathyDoesNotEraseHarm: true,
    redemptionRequired: false,
    enemyRosterExpansionAllowed: false,
    authority: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'boss_night_without_route',
    archetype: 'OVERWHELMING_FORCE',
    characterHook: '巨大で静か。怒鳴らず急がず、地図線を一本ずつ消すだけで「戻れない」恐怖を作る。',
    currentWant: '間違った道を選ぶ可能性をなくすため、選べる道そのものを一つずつ消す。',
    deepestFear: '誰かが自分の示した道で迷い、帰れなくなること。',
    contradiction: '迷わせたくないから道を減らし、最後には帰路まで消してしまう。',
    recurringBehavior: '最短路ではなく「以前誰かが迷った道」から優先して塗りつぶす。',
    communicationStyle: '黒い地図線の引き直しだけで意思を示す。人語を話さないことで自然災害級の圧を保つ。',
    pastStory: '古い案内図、手書き地図、口伝の道順が何度も上書きされ、互いに矛盾した帰路だけが残った。Wrong Readingは「間違うくらいなら選ばせない」という形でまとまった。',
    pastRevealRule: '個人の悲劇へ縮めず、複数人の善意と訂正が積み重なった結果として見せる。',
    mirrorCharacterIds: ['michiru', 'kage3', 'gen', 'ren'],
    storyBeats: [
      { stageId: 'return_map_crossing', beatKind: 'ENCOUNTER', beat: '追尾補正とroute揺らぎで圧を作り、一本道の正解探しを崩す。' },
      { stageId: 'old_compass_station', beatKind: 'AFTERIMAGE', beat: 'ゲンの古い道が「間違い」ではなく当時は正しかったことを示し、敵の二択思考を浮かせる。' },
      { stageId: 'ruler_rooftop', beatKind: 'LATE_REINTERPRETATION', beat: 'トキの測定でも一本へ確定できない夜を置き、測定と選択を分離する。' },
    ],
    defeatAftertaste: '折れた針は北を指さない。プレイヤーは「正しい道具」を得るのでなく、複数routeを選べる余白を得る。',
    sympathyDoesNotEraseHarm: true,
    redemptionRequired: false,
    enemyRosterExpansionAllowed: false,
    authority: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_black_origami',
    archetype: 'RECURRING_RIVAL',
    characterHook: '折り目を変えるたびに戦い方まで変わる、Stage16の「覚えて帰りたくなる」看板エリート。完全な無口だが、毎回一つだけ同じ折り方を残す。',
    currentWant: '危険な意味を小さく折り畳み、誰にも見つからない形で保存する。',
    deepestFear: '開いた瞬間に誰かが傷つき、その責任を取り返せなくなること。',
    contradiction: '守るために隠すが、隠し続けるほど本人が選べなくなる。',
    recurringBehavior: '敗走時に一枚の黒紙を落とす。毎回折り目だけ同じで、中身は違う。',
    communicationStyle: '黒い折り紙と折り順が会話。文字で説明しない。',
    pastStory: '「見せない方が優しい」と判断された記録が何度も折り畳まれ、そのたびに理由だけが外側から消えた。最後に残ったのは、隠す動作そのものだった。',
    pastRevealRule: 'クロオリ本人の過去や正体へ直結させない。Shadow思想の鏡として使い、血縁・同一人物・創造者説を勝手にCanon化しない。',
    mirrorCharacterIds: ['kuroori', 'yui', 'kage2', 'yubi'],
    storyBeats: [
      { stageId: 'black_origami_roof', beatKind: 'ENCOUNTER', beat: '形態変化で攻撃角度を変え、DARK frictionを「本人の得意だけでは解けない問い」にする。' },
      { stageId: 'unposted_post_office', beatKind: 'PRE_ECHO', beat: '封を開けない選択の場面で、黒紙と同じ折り目が一瞬だけ背景にある。敵本人は出さない。' },
      { stageId: 'blank_card_room', beatKind: 'LATE_REINTERPRETATION', beat: '折る/消す/空白を別の行為として整理し、黒折の守り方にも限界があると見える。' },
    ],
    defeatAftertaste: '完全消滅させず、最後の黒紙だけは開かない選択を残す。再登場しても勝利を無効化しない。',
    sympathyDoesNotEraseHarm: true,
    redemptionRequired: false,
    enemyRosterExpansionAllowed: false,
    authority: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_blank_card',
    archetype: 'UNCANNY_OBSERVER',
    characterHook: '何も書いていない中央をプレイヤーへ向け続ける。攻撃より「見られている余白」が記憶に残る敵。',
    currentWant: '説明できないものを全部空白へ戻し、誤解そのものを起こせなくする。',
    deepestFear: '間違った説明が残り、誰かの記憶をその説明で上書きすること。',
    contradiction: '誤解を防ぐため意味を消し、結果として本人の言葉まで消してしまう。',
    recurringBehavior: '倒される直前だけ中央へ小さな線が現れるが、文字になる前に消える。',
    communicationStyle: '書かないことで拒否を示す。たまに外周の金線だけで「ここまで」を示す。',
    pastStory: '誤記だらけのカードを何度も消し直した末、正しい情報が分からなくなり、空白だけが安全だと扱われた記録から生まれた。',
    pastRevealRule: '「本当は何が書いてあったか」を最終回答にしない。空白を埋めること自体が救いではない。',
    mirrorCharacterIds: ['shiro', 'kage4', 'hana', 'sen'],
    storyBeats: [
      { stageId: 'chalk_classroom', beatKind: 'PRE_ECHO', beat: '仮説と未分類を分ける授業で、空欄を失敗扱いしないルールを先に学ぶ。' },
      { stageId: 'blank_card_room', beatKind: 'ENCOUNTER', beat: '中央を埋めようとするほどpressureが増え、保留/再構築で崩せる。' },
      { stageId: 'pressed_flower_archive', beatKind: 'LATE_REINTERPRETATION', beat: '意味が分からなくても保存できる物があると示し、空白=消去の二択をほどく。' },
    ],
    defeatAftertaste: '勝利後のカードは白いまま。図鑑にも「未記入」が正式状態として残る。',
    sympathyDoesNotEraseHarm: true,
    redemptionRequired: false,
    enemyRosterExpansionAllowed: false,
    authority: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_repair_seam',
    archetype: 'BROKEN_CARETAKER',
    characterHook: '壊れた物を見つけると戦闘中でもそちらへ向きを変え、黒い継ぎ目で勝手に「修理」してしまう。',
    currentWant: '壊れた痕跡を残さず、すべてを再使用可能な状態へ戻す。',
    deepestFear: '直せない物を前にして、自分が何もできないと認めること。',
    contradiction: '使えるようにしたいのに、持ち主の望みや傷の意味まで縫い潰す。',
    recurringBehavior: '攻撃より先に壊れた灯具や床の亀裂へ反応し、そこから危険範囲を広げる。',
    communicationStyle: '工具音と糸を引く動き。人語は持たせず、作業癖だけで人格を作る。',
    pastStory: '「直せる」と言い続けた修理記録が、直らなかった物の欄だけ途中で途切れている。失敗を記録できず、直した跡を隠すことが目的へすり替わったWrong Reading。',
    pastRevealRule: 'トモリ本人の過去と同一視しない。似た痛みを持つ鏡として置き、誰が記録を書いたかは未LOCKにする。',
    mirrorCharacterIds: ['tomori', 'kage4', 'hana', 'gen'],
    storyBeats: [
      { stageId: 'repair_lamp_workshop', beatKind: 'ENCOUNTER', beat: '設置物や灯具へ勝手に継ぎ目を作り、修理がarena pressureへ反転する。' },
      { stageId: 'pressed_flower_archive', beatKind: 'AFTERIMAGE', beat: '保存のため古い台紙を残す場面で「傷を消さない修理」を対置する。' },
      { stageId: 'blank_card_room', beatKind: 'LATE_REINTERPRETATION', beat: '直らなかった記録を空欄のまま残すことが、失敗を隠すより誠実だと分かる。' },
    ],
    defeatAftertaste: '落とす灯芯糸には結び目が残る。綺麗な新品へ戻す報酬にはしない。',
    sympathyDoesNotEraseHarm: true,
    redemptionRequired: false,
    enemyRosterExpansionAllowed: false,
    authority: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_dream_wave',
    archetype: 'TEMPTING_ESCAPE',
    characterHook: '怖い敵なのに、攻撃cueが心地よい波紋で「このまま眠れば楽」と思わせる。露骨な悪意を見せない。',
    currentWant: '現実と夢の食い違いをなくすため、全員を一つの穏やかな夢のtempoへ揃える。',
    deepestFear: '目覚めた後に、夢の中で守れたものが現実では失われていること。',
    contradiction: '苦しませたくないから眠らせ、本人が現実で選び直す機会を奪う。',
    recurringBehavior: 'プレイヤーが危険な時ほど攻撃間隔が穏やかになり、逃げ場に見える範囲を作る。',
    communicationStyle: '夢の中で聞いた気がする生活音だけを返す。具体的な台詞や死者の声を安易に使わない。',
    pastStory: '眠れない誰かのために「朝まで夢を続けたい」と書かれた記録が、朝へ起こす側の言葉を失ったまま残った。優しさの片側だけが肥大化した。',
    pastRevealRule: '死別や病気を安易な泣き装置に足さない。眠れない夜と「起こす責任」の日常から深さを作る。',
    mirrorCharacterIds: ['nemu', 'madoka', 'kage3', 'nagi'],
    storyBeats: [
      { stageId: 'dream_waterway', beatKind: 'ENCOUNTER', beat: 'DROWSYを入力遅延にせず敵側tempo pressureで表現し、眠りbuildそのものを否定しない。' },
      { stageId: 'ruler_rooftop', beatKind: 'LATE_REINTERPRETATION', beat: '測れる現実だけでも、夢だけでも足りないことをトキ/ネムの関係へ返す。' },
      { stageId: 'blank_card_room', beatKind: 'AFTERIMAGE', beat: '夢の記録に「事実ではない」の注記が追加されても、記録自体は消さない。' },
    ],
    defeatAftertaste: '朝露だけが残る。夢が間違いだったとは結論づけず、起きて選べる状態を勝利にする。',
    sympathyDoesNotEraseHarm: true,
    redemptionRequired: false,
    enemyRosterExpansionAllowed: false,
    authority: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  },
  {
    enemyId: 'omburo_nameplate',
    archetype: 'PETTY_NEMESIS',
    characterHook: '大ボスほど強くないのに、何度も「違う名札」を貼ってくる嫌な中型。小さな意地悪と実戦上の厄介さで覚えられる枠。',
    currentWant: '一度付いた名前を最後まで守り、途中で呼び直される混乱をなくす。',
    deepestFear: '自分が付けた名前が間違っていたと認めること。',
    contradiction: '名前を大切にしているのに、本人の訂正を最も受け入れない。',
    recurringBehavior: '撃破されるたび名札だけ残り、次の戦闘では前回と違う場所へ貼り直してくる。',
    communicationStyle: '貼る/剥がす/貼り直す動作が会話。少しコミカルだがMARKED pressureは本物。',
    pastStory: '名札整理の記録に、訂正線ではなく上貼りだけが延々と続いている。間違いを消すより「前の自分が間違った証拠」を隠す方を選び続けた。',
    pastRevealRule: '可哀想にしすぎない。小さな見栄、頑固さ、恥ずかしさのような日常感で親しみを作る。',
    mirrorCharacterIds: ['asa', 'yui', 'kage2', 'koyori'],
    storyBeats: [
      { stageId: 'name_tag_alley', beatKind: 'ENCOUNTER', beat: 'MARKED対象を貼り替え、誤追尾を生む。訂正した瞬間だけ隙ができる。' },
      { stageId: 'chalk_classroom', beatKind: 'AFTERIMAGE', beat: '仮ラベルへ訂正線を引いて残す授業が、敵の「上貼り」癖と対になる。' },
      { stageId: 'unposted_post_office', beatKind: 'LATE_REINTERPRETATION', beat: '正しい宛名でも今届けるべきとは限らないと学び、名前=唯一の正解からさらに離れる。' },
    ],
    defeatAftertaste: '完全消滅より「また名札だけ置いて逃げた」が似合う。ギャグ敗走でも脅威をゼロにはしない。',
    sympathyDoesNotEraseHarm: true,
    redemptionRequired: false,
    enemyRosterExpansionAllowed: false,
    authority: 'CONTENT_SOURCE_ONLY',
    runtimeAutoPromotionAllowed: false,
  },
];

const enemyIds = new Set(enemyProductionEntries.map((enemy) => enemy.id));
for (const seed of spotlightSeeds) {
  if (!enemyIds.has(seed.enemyId)) throw new Error(`spotlight enemy must reuse Enemy48 ID: ${seed.enemyId}`);
}

export const spotlightEnemyCharacterEntries = spotlightSeeds;

export const spotlightEnemyCharacterSummary = {
  spotlightCount: spotlightEnemyCharacterEntries.length,
  enemyRosterCount: enemyProductionEntries.length,
  bossSpotlightCount: spotlightEnemyCharacterEntries.filter((entry) =>
    enemyProductionEntries.find((enemy) => enemy.id === entry.enemyId)?.rank === 'boss',
  ).length,
  nonBossSpotlightCount: spotlightEnemyCharacterEntries.filter((entry) =>
    enemyProductionEntries.find((enemy) => enemy.id === entry.enemyId)?.rank !== 'boss',
  ).length,
  allExistingEnemyIds: spotlightEnemyCharacterEntries.every((entry) => enemyIds.has(entry.enemyId)),
  enemyRosterExpansionAllowed: false,
  sympathyDoesNotEraseHarm: true,
  runtimeAutoPromotionAllowed: false,
} as const;
