import fs from 'node:fs';
import {
  ERA_MAJOR_INCIDENT_RULES,
  ERA_MAJOR_INCIDENTS,
  ERA_MAJOR_INCIDENT_SEASON_WEAVE,
  eraMajorIncidentSummary,
} from '../../src/game/data/eraMajorIncidentFamilyLens.ts';
import { CORE5_ERA_ASSIGNMENTS } from '../../src/game/data/core5EraCanon.ts';
import {
  CHARACTER_REALITY_ROOTS,
  REALITY_ROOT_RULES,
} from '../../src/game/data/characterRealityRootRegistry.ts';
import {
  CROSS_ERA_REVEAL_BUDGET,
  CROSS_ERA_BLOODLINE_CANDIDATES,
} from '../../src/game/data/crossEraLineageMemory.ts';
import { SERIES_SEASON_RULES } from '../../src/game/data/seasonArchitecture.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
const mustExist = (path: string) => assert(fs.existsSync(path), `missing Era incident source: ${path}`);

const required = [
  'docs/00-current-story-world-master.md',
  'docs/core5-era-character-master-v1.md',
  'docs/research/era-major-incident-social-sourcebook-v1.md',
  'docs/era-major-incident-family-lens-atlas-v1.md',
  'docs/era-family-generation-lens-v1.md',
  'docs/character-reality-root-registry-v1.md',
  'docs/cross-era-lineage-reveal-map-v1.md',
  'docs/world-historical-incident-ledger-v1.md',
  'src/game/data/eraMajorIncidentFamilyLens.ts',
] as const;
required.forEach(mustExist);

const master = read('docs/00-current-story-world-master.md');
const research = read('docs/research/era-major-incident-social-sourcebook-v1.md');
const atlas = read('docs/era-major-incident-family-lens-atlas-v1.md');
const generationLens = read('docs/era-family-generation-lens-v1.md');
const rootRegistry = read('docs/character-reality-root-registry-v1.md');
const revealMap = read('docs/cross-era-lineage-reveal-map-v1.md');

assert(ERA_MAJOR_INCIDENT_RULES.fictionalMajorIncidentsRequired, 'Era major incidents must remain fictional');
assert(!ERA_MAJOR_INCIDENT_RULES.exactRealIncidentRenameCopyAllowed, 'real incidents may not be renamed/copied');
assert(ERA_MAJOR_INCIDENT_RULES.usefulSystemMustExistBeforeFailure, 'each incident must begin with a genuinely useful system');
assert(ERA_MAJOR_INCIDENT_RULES.ordinaryLifeMustBeVisibleBeforeCrisis, 'ordinary life must appear before incident crisis');
assert(!ERA_MAJOR_INCIDENT_RULES.oneGenerationRepresentsEra, 'one generation may not represent a whole Era');
assert(ERA_MAJOR_INCIDENT_RULES.minimumGenerationOrSocialLensCount >= 5, 'generation/social lens floor is too low');
assert(!ERA_MAJOR_INCIDENT_RULES.incidentMustTransferUnchangedToAnotherEra, 'Era incidents must not transfer unchanged');
assert(!ERA_MAJOR_INCIDENT_RULES.incidentCentralPersonEqualsCombatBossByDefault, 'incident centrality must remain separate from combat Boss');
assert(!ERA_MAJOR_INCIDENT_RULES.gunjoFixedOnePersonPerEra, 'Gunjo may not become one fixed person per Era');
assert(!ERA_MAJOR_INCIDENT_RULES.sakuyazaMembersMustShareOnePosition, 'Sakuyaza members may disagree by incident');
assert(ERA_MAJOR_INCIDENT_RULES.localThirdOptionRequired, 'every Era incident needs a local Third Option');
assert(!ERA_MAJOR_INCIDENT_RULES.everySeasonFullySolvesSeriesProblem, 'Season must not fully solve the series macro problem by default');
assert(!ERA_MAJOR_INCIDENT_RULES.exactFamilyTraumaAutoCreatedByIncident, 'incident may not auto-create family trauma');
assert(!ERA_MAJOR_INCIDENT_RULES.dreamErasesRealityHistory, 'Dream must not erase Reality history');
assert(!ERA_MAJOR_INCIDENT_RULES.runtimeAutoPromotionAllowed, 'Era incidents may not auto-promote runtime');

assert(eraMajorIncidentSummary.incidentCount === 5, `expected five Core5 incident lanes, got ${eraMajorIncidentSummary.incidentCount}`);
assert(eraMajorIncidentSummary.uniqueIncidentIdCount === 5, 'Era incident IDs must be unique');
assert(eraMajorIncidentSummary.uniqueCore5Count === 5, 'all five Core5 must own one distinct incident lane');
assert(eraMajorIncidentSummary.uniqueEraCount === 5, 'all five incident lanes must use distinct Eras');
assert(eraMajorIncidentSummary.allHaveFivePlusLenses, 'each Era incident needs 5+ generation/social lenses');
assert(eraMajorIncidentSummary.allHaveThirdOption, 'each Era incident needs a Third Option');
assert(eraMajorIncidentSummary.allEraSpecific, 'each Era incident must fail transfer test');
assert(eraMajorIncidentSummary.allExactYearsOpen, 'exact Era incident years must remain Open');
assert(eraMajorIncidentSummary.allExactPlacesOpen, 'exact Era incident places must remain Open');
assert(!eraMajorIncidentSummary.runtimeAutoPromotionAllowed, 'summary may not auto-promote runtime');

const expected = new Map(CORE5_ERA_ASSIGNMENTS.map((entry) => [entry.characterId, entry.realityEra]));
for (const incident of ERA_MAJOR_INCIDENTS) {
  assert(expected.get(incident.core5Id) === incident.era, `Era mismatch for ${incident.core5Id}: ${incident.era}`);
  assert(incident.status.includes('CANDIDATE'), `${incident.id} must remain Candidate-level`);
  assert(!incident.exactYearFrozen, `${incident.id} exact year unexpectedly frozen`);
  assert(!incident.exactPlaceFrozen, `${incident.id} exact place unexpectedly frozen`);
  assert(!incident.exactVictimCountFrozen, `${incident.id} victim count unexpectedly frozen`);
  assert(incident.generationLenses.length >= 5, `${incident.id} lacks generation/social lenses`);
  assert(incident.ordinaryLifeAnchors.length >= 4, `${incident.id} lacks ordinary-life anchors`);
  assert(incident.thirdOption.length >= 3, `${incident.id} Third Option too narrow`);
  assert(incident.forbiddenShortcuts.length >= 4, `${incident.id} needs explicit shortcut guards`);
  assert(incident.transferableUnchangedToAnotherEra === false, `${incident.id} failed Era transfer guard`);
  assert(incident.combatBoss === 'SEPARATE_GAMEPLAY_ROLE', `${incident.id} incorrectly binds incident to Boss`);
  assert(incident.sakuyazaRelation.includes('OPEN'), `${incident.id} prematurely fixes Sakuyaza role`);
}

const tomori = ERA_MAJOR_INCIDENTS.find((entry) => entry.core5Id === 'tomori');
const michiru = ERA_MAJOR_INCIDENTS.find((entry) => entry.core5Id === 'michiru');
const nagi = ERA_MAJOR_INCIDENTS.find((entry) => entry.core5Id === 'nagi');
const yui = ERA_MAJOR_INCIDENTS.find((entry) => entry.core5Id === 'yui');
const asa = ERA_MAJOR_INCIDENTS.find((entry) => entry.core5Id === 'asa');
assert(tomori?.failureMode === 'NOT_RECORDED_BECOMES_NOT_ELIGIBLE', 'Tomori incident domain drift');
assert(michiru?.failureMode === 'OFF_PRIORITY_ROUTE_BECOMES_INVISIBLE_COST', 'Michiru incident domain drift');
assert(nagi?.failureMode === 'WARNING_COPIES_TRAVEL_FASTER_THAN_CORRECTIONS', 'Nagi incident domain drift');
assert(yui?.failureMode === 'UNVERIFIED_TRUE_SOS_DISAPPEARS_FROM_TRUSTED_ATTENTION_SURFACE', 'Yui incident domain drift');
assert(asa?.failureMode === 'ONLY_ONE_ACTIVE_CONTINUITY_IS_ALLOWED_TO_HAVE_FULL_PERSON_STATUS', 'Asa incident domain drift');
assert(new Set(ERA_MAJOR_INCIDENTS.map((entry) => entry.failureMode)).size === 5, 'all five incidents need distinct failure mechanisms');
assert(new Set(ERA_MAJOR_INCIDENTS.map((entry) => entry.usefulSystem)).size === 5, 'all five incidents need distinct useful systems');

assert(nagi?.forbiddenShortcuts.includes('GENERATIVE_AI_OR_DEEPFAKE_PRIMARY'), 'Nagi must not steal present-day gen-AI/deepfake theme');
assert(yui?.forbiddenShortcuts.includes('REAL_DISASTER_RENAME_COPY'), 'Yui incident must guard against real-disaster rename-copy');
assert(asa?.forbiddenShortcuts.includes('COPY_GHOST_IN_THE_SHELL_TERMS_OR_PLOT'), 'Asa incident must guard franchise copying');
assert(tomori?.forbiddenShortcuts.includes('AUTO_WAR_TRAUMA_FOR_TOMORI'), 'Tomori may not auto-acquire war trauma');
assert(michiru?.forbiddenShortcuts.includes('STOP_ALL_INDUSTRY_AS_RESOLUTION'), 'Michiru resolution may not be stop-all-development');

assert(SERIES_SEASON_RULES.seasonEqualsEra === false, 'Season must remain distinct from Era');
assert(SERIES_SEASON_RULES.core5RecurringAcrossSeasons, 'Core5 must recur across Seasons');
assert(!SERIES_SEASON_RULES.characterGrowthResetsBetweenSeasons, 'growth may not reset between Seasons');
assert(!SERIES_SEASON_RULES.everySeasonMustFullySolveMacroProblem, 'every Season may not fully solve macro problem');
assert(ERA_MAJOR_INCIDENT_SEASON_WEAVE.season1.theme === 'RECOGNITION_RECORD_BELONGING', 'S1 incident weave theme drift');
assert(ERA_MAJOR_INCIDENT_SEASON_WEAVE.season1.primaryIncidentIds.length === 3, 'S1 should have three primary incident lanes');
assert(ERA_MAJOR_INCIDENT_SEASON_WEAVE.season1.evidenceSeedIncidentIds.length === 2, 'S1 should seed two later Era incidents');
assert(!ERA_MAJOR_INCIDENT_SEASON_WEAVE.season1.exactBloodRevealAllowed, 'S1 exact blood reveal remains forbidden');
assert(ERA_MAJOR_INCIDENT_SEASON_WEAVE.season1.endingDirection === 'UNEASY_PARTIAL_VICTORY', 'S1 ending direction drift');
assert(ERA_MAJOR_INCIDENT_SEASON_WEAVE.season2.primaryIncidentIds.length === 3, 'S2 should have three primary incident lanes');
assert(!ERA_MAJOR_INCIDENT_SEASON_WEAVE.season2.macroProblemFullySolvedRequired, 'S2 must not be forced to solve series problem unless final');
assert(!ERA_MAJOR_INCIDENT_SEASON_WEAVE.optionalSeason3.repeatAllFiveIncidents, 'S3 may not simply repeat five incident arcs');

assert(CROSS_ERA_REVEAL_BUDGET.season1ExactBloodRevealMaximum === 0, 'S1 lineage budget and incident weave disagree');
const nagiYui = CROSS_ERA_BLOODLINE_CANDIDATES.find((entry) => entry.id === 'candidate_parent_nagi_yui');
assert(nagiYui?.status.includes('NOT_CANON'), 'Nagi/Yui lineage must remain non-Canon candidate');
assert(nagiYui?.earliestFullRevealSeason === 'S2', 'Nagi/Yui reveal cannot occur during S1 incident');
assert(nagi?.crossEraEchoes.includes('NAGI_YUI_PARENT_CHILD_CANDIDATE_CLUES_ONLY'), 'Nagi incident must preserve lineage clue-only boundary');
assert(yui?.forbiddenShortcuts.includes('NAGI_YUI_BLOOD_REVEAL_IN_S1'), 'Yui incident must preserve S1 blood reveal guard');

const yuiRoot = CHARACTER_REALITY_ROOTS.find((entry) => entry.id === 'yui');
assert(yuiRoot?.root === '東京都荒川区', 'Yui must remain Arakawa-ku rooted');
assert(REALITY_ROOT_RULES.yuiArakawaCurrent, 'Yui Arakawa user decision must remain Current');
assert(yui?.ordinaryLifeAnchors.includes('ARAKAWA_ORDINARY_LIFE'), 'Yui incident must use Arakawa as ordinary life, not tourist set');

assert(master.includes('実在の大事件は背景研究に使う') && master.includes('Era大事件は架空'), 'highest master must separate real research from fictional incidents');
assert(master.includes('Core5 distinct era count = 5 / 5'), 'highest master must retain Core5 five distinct Eras');
assert(research.includes('実在事件の名前・被害者・犠牲者構造・企業・地域をコピーしてゲーム事件へ置換しない'), 'research source must retain real-history guard');
assert(research.includes('平成13年版情報通信白書') && research.includes('Digital Identity Wallet'), 'research source must cover early Internet and future identity anchors');
assert(atlas.includes('空欄世帯事件') && atlas.includes('一本線計画事件') && atlas.includes('安心共有名簿事件') && atlas.includes('消えたSOS事件') && atlas.includes('一人分しか通らない'), 'human atlas must contain all five working incident names');
assert(atlas.includes('Child Lens') && atlas.includes('Parent-age Adult Lens'), 'human atlas must include family/generation lenses');
assert(atlas.includes('unverified != false') || atlas.includes('UNVERIFIED'), 'human atlas must preserve Yui verification distinction');
assert(generationLens.includes('Eraを一人で代表させない'), 'generation lens source must reject one-person Era representation');
assert(rootRegistry.includes('origin != incident location'), 'Reality root registry must preserve mobility coherence');
assert(revealMap.includes('S1では答えを出さない'), 'lineage reveal map must preserve S1 clue-only design');

console.log(JSON.stringify({
  incidents: eraMajorIncidentSummary.incidentCount,
  uniqueCore5: eraMajorIncidentSummary.uniqueCore5Count,
  uniqueEras: eraMajorIncidentSummary.uniqueEraCount,
  allFivePlusLenses: eraMajorIncidentSummary.allHaveFivePlusLenses,
  allEraSpecific: eraMajorIncidentSummary.allEraSpecific,
  s1Primary: ERA_MAJOR_INCIDENT_SEASON_WEAVE.season1.primaryIncidentIds.length,
  s2Primary: ERA_MAJOR_INCIDENT_SEASON_WEAVE.season2.primaryIncidentIds.length,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
