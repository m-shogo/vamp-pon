import { CHARACTER_ERA_SCENE_SEEDS } from './characterEraSceneSeedRegistry.ts';

export const CROSS_ERA_ECHO_RULES = {
  authority: 'docs/cross-character-era-echo-chains-v1.md',
  status: 'AUTHOR_CANDIDATE_NON_CANON',
  exactYearAllowed: false,
  relationshipAutoCanonAllowed: false,
  groupMembershipAutoCanonAllowed: false,
  starBeastAutoAssignmentAllowed: false,
  obsoleteConstellationAutoAssignmentAllowed: false,
  oneClueMayProveEra: false,
  oneObjectMayProveIdentity: false,
  tomoriYuiOfficialConstellationSetDifferenceAllowed: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type CrossEraEchoUsefulness = 'CORE' | 'STRONG' | 'SUPPORT';

export type CrossEraEchoChain = Readonly<{
  id: string;
  storyUsefulness: CrossEraEchoUsefulness;
  participantIds: readonly string[];
  sourceSceneSeedIds: readonly string[];
  setupScene: string;
  setupDialogue: readonly string[];
  plausibleMisread: string;
  counterScene: string;
  evidenceGate: readonly string[];
  payoffScene: string;
  payoffDialogue: readonly string[];
  storyFunction: string;
  canonStatus: 'AUTHOR_CANDIDATE';
  forbiddenShortcut: string;
}>;

export const CHARACTER_CROSS_ERA_ECHO_CHAINS: readonly CrossEraEchoChain[] = [
  {
    id: 'repair-trace-tomori-yui',
    storyUsefulness: 'CORE',
    participantIds: ['tomori', 'yui'],
    sourceSceneSeedIds: ['tomori', 'yui'],
    setupScene: '序盤、ユイが傷んだ包みや小物を捨てようとし、トモリだけが端の傷み方を見て止める。',
    setupDialogue: ['トモリ「それ、捨てるのか？」', 'ユイ「もう破れてるよ？」', 'トモリ「破れたのは端だけだ。役目まで終わったわけじゃない」'],
    plausibleMisread: 'トモリの几帳面さ・節約癖として処理できる。',
    counterScene: '後の時代の人物は同じ物を「古いから残っているだけ」と説明し、トモリとの直接関係を否定する。',
    evidenceGate: ['同じ癖を持つ補修線が別時代のランタンに存在すること', '補修技法の時系列が人物の生年を直接確定しないこと', '物の来歴が複数Sourceで矛盾しないこと'],
    payoffScene: 'ユイがデジタル記録より先に実物の補修線へ気づき、序盤の台詞を思い出す。',
    payoffDialogue: ['ユイ「これ……直した人、同じ癖がある」', 'ユイ「残ってたんじゃない。誰かが、残したんだ」'],
    storyFunction: '物の修理痕を「時代を越える残響」に変え、Happy Endの「壊れた＝終わりではない」へ接続する。',
    canonStatus: 'AUTHOR_CANDIDATE',
    forbiddenShortcut: '補修痕だけでトモリの所有・戦災・家族死・正確な年代を確定しない。',
  },
  {
    id: 'quadrantid-name-fossil-shiro-tomori',
    storyUsefulness: 'CORE',
    participantIds: ['shiro', 'tomori', 'yui'],
    sourceSceneSeedIds: ['shiro', 'tomori', 'yui'],
    setupScene: '現代側で「しぶんぎ座流星群」という名称だけが先に出て、シロが名称と現在の星図の不一致を保留する。',
    setupDialogue: ['ユイ「しぶんぎ座って、星座ある？」', 'シロ「今の星図にはない。だから、分からないまま残す」'],
    plausibleMisread: '単なる天文雑学・古い名称の名残に見える。',
    counterScene: 'トモリの持つ古い資料候補を見ても、本人の時代の公式星座一覧が違った証拠にはならないとシロが止める。',
    evidenceGate: ['Quadrans MuralisとQuadrantids名称史の史実Source', '古星図そのものの年代・版・来歴', 'トモリがその資料をRealityで持ち得た経路の検証'],
    payoffScene: '古星図のQuadrans Muralisと現代の流星群名が同じ夜に重なり、「形が消えても名前が残る」ことが物語上の残響へ反転する。',
    payoffDialogue: ['シロ「名前が残ってる。形の方が先に消えたんだ」', 'トモリ「消えたんじゃない。見なくなっただけかもしれないな」'],
    storyFunction: '群青残響録の思想へ繋がる強いCandidate。群青残響録を組織化せず、「後世の記録が残響を束ねる」意味を補強する。',
    canonStatus: 'AUTHOR_CANDIDATE',
    forbiddenShortcut: 'Tomori official constellation set != Yui official constellation set にしない。古星座をStar Beast・運命・敵性へ自動接続しない。',
  },
  {
    id: 'route-erasure-michiru-tobari-gen',
    storyUsefulness: 'CORE',
    participantIds: ['michiru', 'tobari', 'gen'],
    sourceSceneSeedIds: ['michiru', 'tobari', 'gen'],
    setupScene: 'ミチルが現行地図にない曲がり方を選び、トバリが「閉鎖」と「消失」を分けて説明する。',
    setupDialogue: ['ミチル「近い道と、帰れる道は同じじゃないよ」', 'トバリ「閉まってるだけなら、道が消えたわけじゃない」'],
    plausibleMisread: '地元勘・方向感覚・都市交通知識の違いに見える。',
    counterScene: 'ゲンの古い呼び名が地図に存在せず、三人とも違う理由で「道はある」と言っているように見える。',
    evidenceGate: ['旧道の古写真・地割・案内記録', 'サービス閉鎖と物理通路消失を区別する資料', '俗称が後世資料に残った根拠'],
    payoffScene: '同じ場所に「物理的に残る道」「地図から消えた道」「名前だけ残る道」が重なっていたと分かる。',
    payoffDialogue: ['ゲン「道は消えても、曲がり方までは消えん」', 'ミチル「じゃあ、帰り道って一つじゃなかったんだ」'],
    storyFunction: '地理を時代伏線へ変え、Dream overlayで複数Eraを同時表示する理由を感情へ接続する。',
    canonStatus: 'AUTHOR_CANDIDATE',
    forbiddenShortcut: 'Reality Root・出生地・事件現場を同一地点にせず、地図知識を知性や善悪へ結びつけない。',
  },
  {
    id: 'access-consent-nagi-asa',
    storyUsefulness: 'CORE',
    participantIds: ['nagi', 'asa'],
    sourceSceneSeedIds: ['nagi', 'asa'],
    setupScene: 'ナギが開けられる記録でも許可を取り、アサが登録名より呼ばれたい名前を優先する。',
    setupDialogue: ['ナギ「これ、見てもいい？」', 'アサ「登録名じゃなくて、呼ばれたい方を教えて」'],
    plausibleMisread: '二人とも礼儀や気遣いが強いだけに見える。',
    counterScene: '別人物が「アクセス権があるなら見ていい」「登録名なら正しい」と合理的に反論する。',
    evidenceGate: ['ナギ側の転送・複製痕跡', 'アサ側のidentity recordで登録名・身体・分岐・選択名が別項目であること', '両時代の制度差を混同しないSource'],
    payoffScene: '過去側の「見られる／見せた」と未来側の「登録された／選んだ」が同じ境界問題の別時代表現だと分かる。',
    payoffDialogue: ['ナギ「開くのと、見せてもらうのは別だから」', 'アサ「記録されてるのと、私が選んだのも別だよ」'],
    storyFunction: 'Dream/Realityを跨いでprivacy・identity・名前を一つのMain Mystery語彙へ束ねる。',
    canonStatus: 'AUTHOR_CANDIDATE',
    forbiddenShortcut: 'ナギへ未来技術知識を与えず、アサをAndroid化・万能解説役化しない。',
  },
  {
    id: 'copy-personhood-noa-rum',
    storyUsefulness: 'CORE',
    participantIds: ['noa', 'rum'],
    sourceSceneSeedIds: ['noa', 'rum'],
    setupScene: '同じデータを共有する二人が、同じ質問に違う答えを返す。',
    setupDialogue: ['ノア「同じ記憶なら、同じ人？」', 'ルム「知識は同じ。でも、この返事をしたのは私」'],
    plausibleMisread: '技術仕様の差・個体差の説明に見える。',
    counterScene: '第三者が「snapshotが同じなら本質的に同一」と技術的等価性を主張する。',
    evidenceGate: ['同一snapshotからの分岐履歴', '共通知識層と個体decision logの分離', 'identity continuityの世界ルール'],
    payoffScene: '同じ過去を持つことと、今同じ選択をすることは別だと二人が互いの返事で証明する。',
    payoffDialogue: ['ノア「そこまでは同じ。そこから先は、もう二つある」', 'ルム「共有してるからこそ、違う返事が見えるんだよ」'],
    storyFunction: 'Robot/AI Characterの哲学を説明台詞ではなく選択差で見せ、Happy Endの「選び直せる」へ接続する。',
    canonStatus: 'AUTHOR_CANDIDATE',
    forbiddenShortcut: '魂の有無を作者が即答せず、コピー＝同一人物／人間性獲得一本道にしない。',
  },
  {
    id: 'household-name-ritsu-koyori',
    storyUsefulness: 'STRONG',
    participantIds: ['ritsu', 'koyori'],
    sourceSceneSeedIds: ['ritsu', 'koyori'],
    setupScene: 'コヨリだけが公式記録にない呼び名を当然のように使い、リツが一度止める。',
    setupDialogue: ['コヨリ「でも、みんなそう呼んでたよ？」', 'リツ「紙にないなら……いや、家ではそうだったな」'],
    plausibleMisread: '子どもの記憶違い・家だけのあだ名に見える。',
    counterScene: '正式な連絡記録には呼び名がなく、リツ自身も外では別の呼称を使っていた痕跡が出る。',
    evidenceGate: ['同一household設定とEra整合', '私物の裏書き・家庭内メモ', '正式記録との呼称差が人物同一性を壊さないこと'],
    payoffScene: '書類から消えた呼び名が、二人の私物だけに同じ筆跡・使い方で残っていたと分かる。',
    payoffDialogue: ['コヨリ「ほら、書いてある」', 'リツ「……紙にない名前も、なくなったわけじゃないな」'],
    storyFunction: '名前と記憶のテーマを家庭内の小さな残響へ落とし込み、記録にないものを「存在しない」としない。',
    canonStatus: 'AUTHOR_CANDIDATE',
    forbiddenShortcut: '親代わり・両親不在・家庭悲劇など未確定の家族史を自動追加しない。',
  },
  {
    id: 'twin-same-choice-kai-nao',
    storyUsefulness: 'STRONG',
    participantIds: ['kai', 'nao'],
    sourceSceneSeedIds: ['kai', 'nao'],
    setupScene: '二人が同じ物を選び、周囲だけが「区別できなくなる」と気にする。',
    setupDialogue: ['カイ「同じのが好きな日まで、別人の証明しなくていいだろ」', 'ナオ「今日は同じがいい。違う日は、勝手に来るから」'],
    plausibleMisread: '双子らしい軽口・依存・競争に見える。',
    counterScene: '後で同型の私物が見つかるが、使用痕・書き込み・選び方の理由だけが違う。',
    evidenceGate: ['同一Era・Reality Root・household migration整合', '個別の使用痕・記録', '双子をcopy-personhood問題の比喩だけにしないScene設計'],
    payoffScene: '「違うから別人」でも「同じだから同一」でもないことが、二人の同じ選択と違う理由から伝わる。',
    payoffDialogue: ['ナオ「同じにしたの、真似じゃないよ」', 'カイ「知ってる。俺も同じ理由じゃないし」'],
    storyFunction: 'Noa/Rumの哲学テーマを人間の双子へ単純対応させず、identityの別角度として響かせる。',
    canonStatus: 'AUTHOR_CANDIDATE',
    forbiddenShortcut: '双子をコピー問題だけに還元せず、別Era・別出生・対立運命を自動付与しない。',
  },
  {
    id: 'record-authority-sen-madoka-io',
    storyUsefulness: 'STRONG',
    participantIds: ['sen', 'madoka', 'io'],
    sourceSceneSeedIds: ['sen', 'madoka', 'io'],
    setupScene: 'センは「本にあること」と決着を分け、マドカは写真の端を見て、イオは編集権限を気にする。',
    setupDialogue: ['セン「本にはこう書いてあります。ただし、決着したこととは別です」', 'マドカ「みんな中心しか見てないから、端を見るの」', 'イオ「内容は合ってる。今はね。誰が直せる？」'],
    plausibleMisread: '三人それぞれの職人気質・観察癖・管理癖に見える。',
    counterScene: '同じ事件について、教科書・写真・データベースがすべて「間違ってはいない」のに結論だけ食い違う。',
    evidenceGate: ['版・撮影範囲・編集履歴のSource', '三資料が同じ原典へ依存していないかの確認', 'Authorityと真実を同一視しない世界ルール'],
    payoffScene: '欠けていた情報ではなく「誰が、何を、どこまで記録できたか」の差がMain Mysteryを解く鍵になる。',
    payoffDialogue: ['マドカ「写ってないんじゃない。外にいたんだ」', 'セン「資料が嘘だったわけではありません」', 'イオ「権限の外だった、ってことか」'],
    storyFunction: 'Main Mysteryを「隠された真実」一辺倒にせず、正しい部分記録同士のズレから解く構造を作る。',
    canonStatus: 'AUTHOR_CANDIDATE',
    forbiddenShortcut: '陰謀・改ざん・悪意を自動原因にせず、観察力やAuthorityを全知化しない。',
  },
  {
    id: 'cross-era-chloe-shiro-toki',
    storyUsefulness: 'STRONG',
    participantIds: ['chloe', 'shiro', 'toki'],
    sourceSceneSeedIds: ['chloe', 'shiro', 'toki'],
    setupScene: 'クロエが離れた時代の習慣を二つ自然に知り、トキが時系列矛盾として気づく。',
    setupDialogue: ['クロエ「それ、昔もこうしたよ」', 'トキ「その『昔』、さっきの話と同じ時代じゃないよね」'],
    plausibleMisread: '博識・研究経験・聞きかじりで説明できる。',
    counterScene: 'シロが資料照合しても本人同一性を証明できず、OPENとして保留する。',
    evidenceGate: ['複数Era資料の独立性', '類似署名・癖が本人同一性を証明しないこと', 'Reality Root exact birthplace Openの維持'],
    payoffScene: '答えを確定する代わりに、「分からないまま残す」こと自体がSeries Mysteryの正しい扱いだと分かる。',
    payoffDialogue: ['シロ「一致してる。でも、同じ人だとはまだ書けない」', 'クロエ「それでいいよ。今はね」'],
    storyFunction: 'クロエのSeries Mysteryを早期解答せず、OPENを欠落ではなく意図的な物語状態として見せる。',
    canonStatus: 'AUTHOR_CANDIDATE',
    forbiddenShortcut: '不老不死・出生年・正体・朔夜座所属・群青残響録所属を自動確定しない。',
  },
  {
    id: 'obsolete-motif-yomo-shiro',
    storyUsefulness: 'SUPPORT',
    participantIds: ['yomo', 'shiro'],
    sourceSceneSeedIds: ['yomo', 'shiro'],
    setupScene: 'Felis掲載古星図を見た第三者が、猫モチーフのヨモへ「似合う」と軽く結びつける。',
    setupDialogue: ['誰か「猫の星座、ヨモっぽい」', 'ヨモ「似合うと、私のになるは別でしょ」'],
    plausibleMisread: 'キャラと星座モチーフを結ぶファンサービスに見える。',
    counterScene: 'シロが古星座の歴史分類とCharacter Star Beast Authorityを別Sourceとして扱う。',
    evidenceGate: ['Felisの天文学史Source', 'Character Star Beast current authority', 'obsolete constellation researchとCharacter assignmentの分離'],
    payoffScene: '似たモチーフでも所有・運命・敵性は発生しないことを、作中会話そのものが教える。',
    payoffDialogue: ['シロ「資料にあるのは星座の履歴。ヨモの履歴じゃない」', 'ヨモ「なら、かわいいだけ借りとく」'],
    storyFunction: '作者・プレイヤー双方に「モチーフ一致 != Canon assignment」のルールを自然に示す。',
    canonStatus: 'AUTHOR_CANDIDATE',
    forbiddenShortcut: 'Felis・obsolete constellation・Star Beast・朔夜座・敵性を自動接続しない。',
  },
];

const sceneSeedIds = new Set(CHARACTER_ERA_SCENE_SEEDS.map((entry) => entry.id));
export const CHARACTER_CROSS_ERA_ECHO_COVERAGE = CHARACTER_CROSS_ERA_ECHO_CHAINS.map((chain) => ({
  id: chain.id,
  participantsResolvable: chain.participantIds.every((id) => sceneSeedIds.has(id)),
  sourceSeedsResolvable: chain.sourceSceneSeedIds.every((id) => sceneSeedIds.has(id)),
}));
