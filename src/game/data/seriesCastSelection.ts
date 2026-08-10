export type SeriesTitleId = 'yoruno-2' | 'yoruno-3';

export type SeriesCandidateFit = {
  titleThemeFit: number;
  gameplayNovelty: number;
  eraExpansion: number;
  namedObjectBridge: number;
  relationshipExpansion: number;
  commercialDistinctiveness: number;
  oldCastDependencyRisk: number;
  expositionBurdenRisk: number;
  strongestLane: string;
  concern: string;
};

export type FutureCastSeriesCandidate = {
  futureId: string;
  workingName: string;
  core: string;
  currentMaturity: 'anchor_potential' | 'high_priority' | 'deepen_before_promotion';
  title2: SeriesCandidateFit;
  title3: SeriesCandidateFit;
};

const fit = (
  titleThemeFit: number,
  gameplayNovelty: number,
  eraExpansion: number,
  namedObjectBridge: number,
  relationshipExpansion: number,
  commercialDistinctiveness: number,
  oldCastDependencyRisk: number,
  expositionBurdenRisk: number,
  strongestLane: string,
  concern: string,
): SeriesCandidateFit => ({
  titleThemeFit,
  gameplayNovelty,
  eraExpansion,
  namedObjectBridge,
  relationshipExpansion,
  commercialDistinctiveness,
  oldCastDependencyRisk,
  expositionBurdenRisk,
  strongestLane,
  concern,
});

/**
 * Candidate evaluation only.
 * Scores are editorial heuristics, not popularity forecasts and not Canon locks.
 */
export const future15SeriesCandidates: FutureCastSeriesCandidate[] = [
  {
    futureId: 'F01', workingName: 'ヒヨリ', currentMaturity: 'high_priority',
    core: '人を肯定するのが速いが、自分の弱音だけ遅らせる。',
    title2: fit(4,4,3,3,5,5,1,2,'social relay / receiving help','明るさが継承テーマを軽くする長所がある一方、Series 2の中心Mystery説明役にはしない。'),
    title3: fit(3,4,3,2,5,5,1,2,'community / letting others carry','終盤の宇宙論を背負わせず、他者へ任せる日常側の答えに強い。'),
  },
  {
    futureId: 'F02', workingName: 'セリカ', currentMaturity: 'high_priority',
    core: '責任を引き受けることを礼儀だと思い、頼ることが下手。',
    title2: fit(5,4,4,3,5,4,1,3,'receive / delegate / inherited responsibility','家・時代設定を大きくしすぎると人物より制度説明が前へ出る。'),
    title3: fit(3,4,4,3,4,4,1,3,'release responsibility','恋愛/家柄だけを終盤テーマの装置にしない。'),
  },
  {
    futureId: 'F03', workingName: 'クロエ', currentMaturity: 'anchor_potential',
    core: '不老の成人女性。愛した人が必ず自分より先へ行くことを知りすぎた。',
    title2: fit(5,5,5,5,5,5,2,5,'generation handoff / long memory','強すぎる設定でSeries 2を「魔女の過去説明」にしない。'),
    title3: fit(5,5,5,5,5,5,2,4,'keep / release / long-lived witness','Series final anchor適性が高い。起源を全部知る全知人物にはしない。'),
  },
  {
    futureId: 'F04', workingName: 'レンジ', currentMaturity: 'deepen_before_promotion',
    core: '有限だから時間を止めずに生きたい年を取る弟子。',
    title2: fit(5,4,5,4,5,3,5,3,'mentor succession / finite time','現状クロエ依存が強い。単独のGameplay/生活/関係を深めるまでanchor化しない。'),
    title3: fit(4,4,5,4,5,3,5,3,'finite life answering permanence','クロエとの関係だけで人物価値を決めない。'),
  },
  {
    futureId: 'F05', workingName: 'トウマ', currentMaturity: 'high_priority',
    core: '自分の名前より、作ったものが残ればいいと思う職人。',
    title2: fit(5,5,4,5,5,5,1,2,'craft lineage / maker-to-user handoff','「名を残さない職人」美談だけで自己消去を肯定しない。'),
    title3: fit(5,5,4,5,5,5,1,2,'what deserves a maker name','Series終盤でもsexualityを悲劇装置にしない。'),
  },
  {
    futureId: 'F06', workingName: 'クウ', currentMaturity: 'high_priority',
    core: '名前ではなく匂い・声・歩き方で人を覚える現実由来の犬。',
    title2: fit(4,5,3,3,5,5,1,2,'memory beyond labels / rescue route','人間より真実を知るoracle animalへしない。'),
    title3: fit(4,5,3,3,5,5,1,2,'what remains without language','星獣と役割を混同しない。'),
  },
  {
    futureId: 'F07', workingName: 'ヨモ', currentMaturity: 'high_priority',
    core: '違う名で呼ばれても一匹の人生は分裂しない現実由来の猫。',
    title2: fit(3,4,4,2,5,5,1,2,'multiple keepers / multiple names','名前テーマがアサ/カスミの再演だけにならないよう、現実動物の生活を主語にする。'),
    title3: fit(5,4,4,3,5,5,1,2,'identity after labels are released','マスコット人気だけで中心Mysteryを解かせない。'),
  },
  {
    futureId: 'F08', workingName: 'ノア', currentMaturity: 'anchor_potential',
    core: '同一snapshotから二bodyが起動し、両方が同じ根拠で本人と言える人工人格。',
    title2: fit(5,5,5,4,5,5,1,4,'continuity / copy / inherited memory','tech twistが紙・灯り・生活の手触りを上書きしないよう抑える。'),
    title3: fit(5,5,5,4,5,5,1,4,'what must remain identical','Series 2で中心回答を払った場合、3で同じ問いをresetしない。'),
  },
  {
    futureId: 'F09', workingName: 'ルム', currentMaturity: 'anchor_potential',
    core: '共有memoryから「ぼく」が生まれる小型灯守機。',
    title2: fit(5,5,5,5,5,5,1,4,'maintenance handoff / selective sync','かわいい小型Robotだけで終わらせず、灯守maintenance gameplayを持たせる。'),
    title3: fit(5,5,5,5,5,5,1,4,'maintainer system / choose what not to sync','Night maintainer真相を全部知るsystem adminにはしない。'),
  },
  {
    futureId: 'F10', workingName: 'マキ', currentMaturity: 'high_priority',
    core: '決断が速く、頼られる側でいることに慣れすぎる成人女性。',
    title2: fit(4,5,3,2,5,4,1,2,'delegate decisions / receive uncertainty','Bisexualityを選択テーマの比喩に絶対使わない。'),
    title3: fit(3,5,3,2,5,4,1,2,'leave choices to others','強いdecision gameplayが他Characterのagencyを奪わない設計が必要。'),
  },
  {
    futureId: 'F11', workingName: 'スズ', currentMaturity: 'high_priority',
    core: '装うことは嘘ではなく、自分で選んだ表現だと知る成人男性。',
    title2: fit(3,5,3,3,5,5,1,2,'roles we inherit vs roles we choose','feminine presentationを正体/性別twistにしない。'),
    title3: fit(4,5,3,3,5,5,1,2,'when a role can be put down','「素の自分=装わない姿」という結論へしない。'),
  },
  {
    futureId: 'F12', workingName: 'イオ', currentMaturity: 'high_priority',
    core: '分類される前に、目の前の音や人を聞く。',
    title2: fit(4,4,3,3,5,5,1,3,'provisional naming / received categories','性別当てをMystery化しない。分類テーマを本人のgenderへ回収しない。'),
    title3: fit(5,4,3,3,5,5,1,3,'what can remain unclassified','「何も決めない」が正解にならないよう暫定判断も扱う。'),
  },
  {
    futureId: 'F13', workingName: 'カイ', currentMaturity: 'anchor_potential',
    core: '二人で一つ扱いされる安心を手放すのが怖い双子A。',
    title2: fit(5,5,3,3,5,5,2,3,'shared inheritance / separation','ナオと常にsetでしか機能しない設計を避け、個人sceneも持つ。'),
    title3: fit(4,5,3,3,5,5,2,3,'what remains shared after separation','Robot identity問題の人間版コピーにならない。'),
  },
  {
    futureId: 'F14', workingName: 'ナオ', currentMaturity: 'anchor_potential',
    core: '「双子だから同じ」を嫌い、違いを作りすぎる双子B。',
    title2: fit(5,5,3,3,5,5,2,3,'shared inheritance / over-differentiation','カイの反対意見だけの人物にしない。'),
    title3: fit(4,5,3,3,5,5,2,3,'choose what can stay shared','Robot identity問題の人間版コピーにならない。'),
  },
  {
    futureId: 'F15', workingName: 'アマネ', currentMaturity: 'high_priority',
    core: '速く移動するのが好きで、助けより選択肢を求めるwheelchair user。',
    title2: fit(5,5,4,4,5,5,1,2,'inherited routes / accessible handoff','治ることをHappy Endにしない。移動routeを本人だけの問題にしない。'),
    title3: fit(4,5,4,4,5,5,1,2,'which systems should remain / change','accessibilityを世界観の善人判定装置にしない。'),
  },
];

export function opportunityScore(value: SeriesCandidateFit): number {
  const upside = value.titleThemeFit
    + value.gameplayNovelty
    + value.eraExpansion
    + value.namedObjectBridge
    + value.relationshipExpansion
    + value.commercialDistinctiveness;
  return upside - value.oldCastDependencyRisk - value.expositionBurdenRisk;
}

export const SERIES_CAST_SELECTION_POLICY = {
  status: 'CANDIDATE_EVALUATION_ONLY',
  futurePoolCount: 15,
  title2Question: '自分が始めていないものを、どう受け継ぐか？',
  title3Question: '残すための仕組みは、いつ手放してよいのか？',
  newViewpointMajority: true,
  noAutomaticSelectionByScore: true,
  noPopularityForecastInScore: true,
  returningCastRule: 'Return only when an existing growth, Named Object, relationship or era link directly serves the new title question. Never require all-cast return.',
  immutableFromTitle1: [
    'Happy End is real',
    'resolved character growth is not reset',
    'relationship type is not rewritten by popularity',
    'body / age / disability / presentation identity is not marketability-retconned',
  ],
  selectionAxes: [
    'titleThemeFit',
    'gameplayNovelty',
    'eraExpansion',
    'namedObjectBridge',
    'relationshipExpansion',
    'commercialDistinctiveness',
    'oldCastDependencyRisk',
    'expositionBurdenRisk',
  ],
} as const;
