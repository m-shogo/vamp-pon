import {
  SERIES_CAST_SELECTION_POLICY,
  future15SeriesCandidates,
  opportunityScore,
  type SeriesCandidateFit,
} from '../../src/game/data/seriesCastSelection.ts';

let failed = false;
const fail = (message: string) => {
  failed = true;
  console.error(`FAIL: ${message}`);
};

const expectedIds = Array.from({ length: 15 }, (_, index) => `F${String(index + 1).padStart(2, '0')}`);
const ids = future15SeriesCandidates.map((entry) => entry.futureId);
if (future15SeriesCandidates.length !== SERIES_CAST_SELECTION_POLICY.futurePoolCount) {
  fail(`Future pool must remain ${SERIES_CAST_SELECTION_POLICY.futurePoolCount}; got ${future15SeriesCandidates.length}`);
}
if (new Set(ids).size !== ids.length) fail('duplicate future candidate id');
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) fail(`Future15 order/coverage drift: ${ids.join(',')}`);

const positiveKeys: Array<keyof SeriesCandidateFit> = [
  'titleThemeFit',
  'gameplayNovelty',
  'eraExpansion',
  'namedObjectBridge',
  'relationshipExpansion',
  'commercialDistinctiveness',
];
const riskKeys: Array<keyof SeriesCandidateFit> = ['oldCastDependencyRisk', 'expositionBurdenRisk'];

for (const entry of future15SeriesCandidates) {
  if (!entry.workingName || !entry.core) fail(`${entry.futureId}: missing identity`);
  for (const [label, fit] of [['title2', entry.title2], ['title3', entry.title3]] as const) {
    for (const key of [...positiveKeys, ...riskKeys]) {
      const value = fit[key];
      if (!Number.isInteger(value) || (value as number) < 1 || (value as number) > 5) {
        fail(`${entry.futureId}/${label}: ${String(key)} must be integer 1..5`);
      }
    }
    if (!fit.strongestLane || !fit.concern) fail(`${entry.futureId}/${label}: lane/concern required`);
    const score = opportunityScore(fit);
    if (!Number.isFinite(score)) fail(`${entry.futureId}/${label}: opportunity score invalid`);
  }
}

const anchorPotential = future15SeriesCandidates
  .filter((entry) => entry.currentMaturity === 'anchor_potential')
  .map((entry) => entry.workingName)
  .sort();
const expectedAnchors = ['カイ', 'クロエ', 'ナオ', 'ノア', 'ルム'].sort();
if (JSON.stringify(anchorPotential) !== JSON.stringify(expectedAnchors)) {
  fail(`anchor-potential set drift: ${anchorPotential.join(',')}`);
}
const renji = future15SeriesCandidates.find((entry) => entry.futureId === 'F04');
if (renji?.currentMaturity !== 'deepen_before_promotion') fail('Renji must remain deepen-before-promotion');
if ((renji?.title2.oldCastDependencyRisk ?? 0) < 4 || (renji?.title3.oldCastDependencyRisk ?? 0) < 4) {
  fail('Renji dependency risk must remain explicit until independently deepened');
}

if (SERIES_CAST_SELECTION_POLICY.status !== 'CANDIDATE_EVALUATION_ONLY') fail('series selection must remain candidate-only');
if (!SERIES_CAST_SELECTION_POLICY.newViewpointMajority) fail('sequel must keep new-viewpoint majority direction');
if (!SERIES_CAST_SELECTION_POLICY.noAutomaticSelectionByScore) fail('score auto-selection firewall lost');
if (!SERIES_CAST_SELECTION_POLICY.noPopularityForecastInScore) fail('pre-release popularity forecast must stay out of selection score');
for (const token of ['Happy End is real', 'resolved character growth is not reset', 'relationship type is not rewritten by popularity', 'body / age / disability / presentation identity is not marketability-retconned']) {
  if (!SERIES_CAST_SELECTION_POLICY.immutableFromTitle1.includes(token)) fail(`Title1 immutable guard missing: ${token}`);
}
for (const axis of ['commercialDistinctiveness', 'oldCastDependencyRisk', 'expositionBurdenRisk']) {
  if (!SERIES_CAST_SELECTION_POLICY.selectionAxes.includes(axis)) fail(`selection axis missing: ${axis}`);
}
if (!SERIES_CAST_SELECTION_POLICY.returningCastRule.includes('Never require all-cast return')) {
  fail('all-cast return must not become sequel default');
}

console.log('Series cast selection OK');
console.log(`  Future15 evaluated: ${future15SeriesCandidates.length}/15`);
console.log(`  Anchor potential retained: ${anchorPotential.join(', ')}`);
console.log('  Renji remains deepen-before-promotion.');
console.log('  Scores are candidate heuristics, not popularity forecasts or automatic cast locks.');
console.log('  Title1 Happy End / growth / relationship / body identity remain immutable.');

if (failed) process.exit(1);
