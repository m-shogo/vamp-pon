import fs from 'node:fs';
import {
  CONSTELLATION_HISTORY_RESEARCH_RULES,
  CONSTELLATION_HISTORY_EVIDENCE,
  CONSTELLATION_HISTORY_YORUNO_CANDIDATES,
  constellationHistoryResearchSummary,
} from '../../src/game/data/constellationHistoryResearch.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

assert(CONSTELLATION_HISTORY_RESEARCH_RULES.status === 'RESEARCH_EVIDENCE_NON_CANON', 'constellation research status drift');
assert(CONSTELLATION_HISTORY_RESEARCH_RULES.officialModernConstellationCount === 88, 'modern constellation count drift');
assert(CONSTELLATION_HISTORY_RESEARCH_RULES.modernNameSetStandardizedBeforePostwarCore5Lane, 'modern constellation standardization must predate postwar Core5 lane');
assert(!CONSTELLATION_HISTORY_RESEARCH_RULES.tomoriVsYuiOfficial88SetDiffersByEra, 'Tomori-vs-Yui official 88 list may not differ by era');
assert(!CONSTELLATION_HISTORY_RESEARCH_RULES.obsoleteConstellationMayBeShownAsTomoriEraOfficialSet, 'obsolete constellation may not be presented as Tomori-era official set');
assert(CONSTELLATION_HISTORY_RESEARCH_RULES.obsoleteConstellationMayAppearInOlderInheritedAtlas, 'older inherited atlas use must remain allowed');
assert(CONSTELLATION_HISTORY_RESEARCH_RULES.obsoleteNameMaySurviveInModernDerivedName, 'surviving obsolete-name fossil use must remain allowed');
assert(CONSTELLATION_HISTORY_RESEARCH_RULES.dreamMayLayerHistoricalAtlasEvidence, 'Dream may layer historical atlas evidence');
assert(!CONSTELLATION_HISTORY_RESEARCH_RULES.dreamLayerMakesHistoricalClaimAutomaticallyCanon, 'Dream historical layer may not auto-Canonize claim');
assert(!CONSTELLATION_HISTORY_RESEARCH_RULES.futureOfficialSetChangeMayBeAssumedFromHistory, 'future official set change may not be assumed');
assert(!CONSTELLATION_HISTORY_RESEARCH_RULES.merchandiseIdentityShouldDependOnObsoleteSetByDefault, 'main merch identity should not depend on obsolete set by default');
assert(!CONSTELLATION_HISTORY_RESEARCH_RULES.runtimeAutoPromotionAllowed, 'constellation research may not auto-promote runtime');

assert(CONSTELLATION_HISTORY_EVIDENCE.length >= 10, `constellation evidence too thin: ${CONSTELLATION_HISTORY_EVIDENCE.length}`);
assert(CONSTELLATION_HISTORY_YORUNO_CANDIDATES.length >= 5, `constellation story candidate set too thin: ${CONSTELLATION_HISTORY_YORUNO_CANDIDATES.length}`);
assert(constellationHistoryResearchSummary.evidenceRows === CONSTELLATION_HISTORY_EVIDENCE.length, 'constellation evidence summary drift');
assert(constellationHistoryResearchSummary.candidateRows === CONSTELLATION_HISTORY_YORUNO_CANDIDATES.length, 'constellation candidate summary drift');
assert(constellationHistoryResearchSummary.veryHighCandidates >= 2, 'need at least two very-high usable constellation candidates');
assert(constellationHistoryResearchSummary.blockedCandidates >= 1, 'historically false Core5 use must remain explicitly blocked');
assert(!constellationHistoryResearchSummary.tomoriVsYuiOfficial88SetDiffersByEra, 'summary may not reintroduce Tomori-vs-Yui official-list difference');
assert(!constellationHistoryResearchSummary.runtimeAutoPromotionAllowed, 'summary may not auto-promote runtime');

const evidenceById = new Map(CONSTELLATION_HISTORY_EVIDENCE.map((entry) => [entry.id, entry]));
for (const id of ['iau-88-standardization','quadrans-muralis','argo-navis','antinous','felis','machina-electrica','officina-typographica','robur-carolinum','plancius-southern-set','lacaille-instrument-set']) {
  assert(evidenceById.has(id), `constellation evidence missing: ${id}`);
}
assert(evidenceById.get('quadrans-muralis')?.kind === 'SURVIVING_NAME_FOSSIL', 'Quadrans Muralis must remain surviving-name fossil');
assert(evidenceById.get('quadrans-muralis')?.modernStatus.includes('QUADRANTID'), 'Quadrantid name fossil link missing');
assert(evidenceById.get('argo-navis')?.kind === 'LARGE_HISTORIC_CONSTELLATION_RESTRUCTURED', 'Argo Navis restructuring classification drift');
assert(evidenceById.get('machina-electrica')?.yorunoUse.includes('Asa/Noa/Rum'), 'technology-constellation Future mirror missing');

const candidateById = new Map(CONSTELLATION_HISTORY_YORUNO_CANDIDATES.map((entry) => [entry.id, entry]));
assert(candidateById.get('quadrantid-ghost-name-clue')?.strength === 'VERY_HIGH', 'Quadrantid clue priority drift');
assert(candidateById.get('old-atlas-inherited-layer')?.strength === 'VERY_HIGH', 'old-atlas clue priority drift');
assert(candidateById.get('old-atlas-inherited-layer')?.safeForCurrentCore5Eras, 'old-atlas clue must remain safe for Current Core5 eras');
assert(candidateById.get('official-list-difference-tomori-yui')?.status === 'REJECT_AS_HISTORICALLY_FALSE_FOR_CURRENT_ERA_BANDS', 'false Tomori/Yui official-list clue must remain rejected');
assert(candidateById.get('official-list-difference-tomori-yui')?.requiresPre1930CharacterEra, 'official-list-difference clue must require pre-standardization era');

const doc = fs.readFileSync('docs/research/constellation-history-usable-v1.md', 'utf8');
for (const token of [
  '「1940年代〜戦後のトモリの時代と、現代ユイの時代では、IAU公式の星座一覧そのものが違う」という伏線は、現在のCore5年代設定のままでは史実として使えない。',
  'Quadrans Muralis',
  'Quadrantids / しぶんぎ座流星群',
  '人物の現在年代ではなく「その資料が作られた年代」',
  'Argo Navis',
  'Machina Electrica',
  'Officina Typographica',
  'Main Characterの永続テーマ星座',
  'REJECT / current Core5年代では史実不一致。',
  '星座の史実を使うなら「昔は何でも違った」にしない。変わったもの、変わらなかったもの、名前だけ残ったものを分ける。その方が伏線は強い。',
]) assert(doc.includes(token), `constellation research doc guard missing: ${token}`);

console.log(JSON.stringify({
  evidenceRows: CONSTELLATION_HISTORY_EVIDENCE.length,
  storyCandidates: CONSTELLATION_HISTORY_YORUNO_CANDIDATES.length,
  veryHighCandidates: constellationHistoryResearchSummary.veryHighCandidates,
  blockedHistoricallyFalseCandidates: constellationHistoryResearchSummary.blockedCandidates,
  tomoriVsYuiOfficial88SetDiffersByEra: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
