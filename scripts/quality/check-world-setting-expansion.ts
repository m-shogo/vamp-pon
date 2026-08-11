import fs from 'node:fs';
import { worldSettingExpansionEntries, worldSettingExpansionSummary } from '../../src/game/data/worldSettingExpansionIndex.ts';
import { worldSettingConflictEntries, worldSettingConflictSummary } from '../../src/game/data/worldSettingConflictRegister.ts';
import {
  SAKUYAZA_CURRENT_IDENTITY,
  SAKUMEI_CANDIDATE_IDENTITY,
  sakuyazaCurrentSummary,
} from '../../src/game/data/sakumeiCandidateSource.ts';
import { stageWorldLoreSummary } from '../../src/game/data/stageWorldLoreIntegration.ts';
import {
  STORY_WORLD_MASTER_SOURCE,
  STORY_WORLD_MASTER_OPEN_FIELDS,
  STORY_WORLD_MASTER_SUPERSEDED,
  storyWorldMasterSummary,
} from '../../src/game/data/storyWorldMasterSource.ts';
import {
  CORE5_DISTINCT_ERA_CHARACTER_IDS,
  DREAM_SOCIAL_WORLD_RULES,
  DREAM_SOCIAL_WORLD_SUMMARY,
} from '../../src/game/data/dreamSocialWorldSource.ts';
import {
  CORE5_ERA_ASSIGNMENTS,
  CORE5_ERA_CANON,
  core5EraCanonSummary,
} from '../../src/game/data/core5EraCanon.ts';
import {
  SERIES_SEASON_RULES,
  SEASON_PROBLEM_LANES,
  OPTIONAL_SEASON3,
  CURRENT21_SEASON_ASSIGNMENTS,
  FUTURE15_SEASON_ASSIGNMENTS,
  SAKUYAZA_SEASON_FOCUS,
  seasonArchitectureSummary,
} from '../../src/game/data/seasonArchitecture.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
const mustExist = (path: string) => assert(fs.existsSync(path), `missing authority file: ${path}`);

const requiredHumanSources = [
  'docs/00-current-story-world-master.md',
  'docs/STORY.md',
  'docs/core5-era-character-master-v1.md',
  'docs/research/era-society-food-future-sourcebook-v1.md',
  'docs/story-temporal-layer-and-character-connections-v1.md',
  'docs/character-height-age-era-lineup-v1.md',
  'docs/core5-era-appearance-overlay-v1.md',
  'docs/core5-era-profile-overrides-v1.md',
  'docs/era-satire-cross-generation-dialogue-bible-v1.md',
  'docs/era-family-generation-lens-v1.md',
  'docs/character-family-household-atlas-v1.md',
  'docs/season-architecture-cast-matrix-v1.md',
  'docs/season-ending-escalation-v1.md',
  'docs/dream-feast-party-social-bible-v1.md',
  'public/lorebook/data/core5-era-canon.v1.json',
] as const;
requiredHumanSources.forEach(mustExist);

const master = read('docs/00-current-story-world-master.md');
const story = read('docs/STORY.md');
const core5Era = read('docs/core5-era-character-master-v1.md');
const eraResearch = read('docs/research/era-society-food-future-sourcebook-v1.md');
const temporal = read('docs/story-temporal-layer-and-character-connections-v1.md');
const lineup = read('docs/character-height-age-era-lineup-v1.md');
const appearanceOverlay = read('docs/core5-era-appearance-overlay-v1.md');
const profileOverrides = read('docs/core5-era-profile-overrides-v1.md');
const satire = read('docs/era-satire-cross-generation-dialogue-bible-v1.md');
const generationLens = read('docs/era-family-generation-lens-v1.md');
const familyAtlas = read('docs/character-family-household-atlas-v1.md');
const seasonMatrix = read('docs/season-architecture-cast-matrix-v1.md');
const seasonEnding = read('docs/season-ending-escalation-v1.md');

const lorebookEra = JSON.parse(read('public/lorebook/data/core5-era-canon.v1.json')) as {
  schemaVersion: number;
  exactYearsFrozen: boolean;
  exactDecadesAreExamplesNotAuthority: boolean;
  assignments: Array<{ id: string; era: string; eraLabel: string; species: string; exactYear: string | null }>;
  runtimeAutoPromotionAllowed: boolean;
};

// P0-P2 coverage.
assert(worldSettingExpansionSummary.total === 32, `expected 32 world-setting areas, got ${worldSettingExpansionSummary.total}`);
assert(worldSettingExpansionSummary.p0 === 9, `expected 9 P0 areas, got ${worldSettingExpansionSummary.p0}`);
assert(worldSettingExpansionSummary.p1 === 18, `expected 18 P1 areas, got ${worldSettingExpansionSummary.p1}`);
assert(worldSettingExpansionSummary.p2 === 5, `expected 5 P2 areas, got ${worldSettingExpansionSummary.p2}`);
assert(!worldSettingExpansionSummary.runtimeAutoPromotionAllowed, 'world-setting expansion must not auto-promote runtime');
assert(new Set(worldSettingExpansionEntries.map((entry) => entry.id)).size === worldSettingExpansionEntries.length, 'world-setting IDs must be unique');
for (const entry of worldSettingExpansionEntries) {
  mustExist(entry.primarySource);
  assert(!entry.runtimeAutoPromotionAllowed, `runtime auto-promotion forbidden: ${entry.id}`);
}

const source = STORY_WORLD_MASTER_SOURCE;
assert(source.authority === 'CURRENT_HIGHEST_STORY_WORLD_AUTHORITY', 'unexpected Story / World authority');
assert(source.reality.world === 'REAL_JAPAN', 'Reality must remain real Japan');
assert(source.reality.realHistoricalIncidentsAreResearchEvidenceNotRenameCopyMaterial, 'real incidents must remain research evidence');
assert(source.reality.fictionalMajorIncidentsRequired, 'Era major incidents must remain fictional');

// Core5 Era bands.
const expectedAssignments = new Map([
  ['tomori', 'POSTWAR_RECOVERY_SCARCITY_JAPAN'],
  ['michiru', 'LATE_HIGH_GROWTH_POLLUTION_ENERGY_TRANSITION_JAPAN'],
  ['nagi', 'POST_BUBBLE_EARLY_MOBILE_INTERNET_JAPAN'],
  ['yui', 'PRESENT_DAY_JAPAN'],
  ['asa', 'FAR_FUTURE_HUMAN_ANDROID_ROBOT_AVATAR_SOCIETY'],
]);

assert(!source.era.sameEraRequired, 'Dream participants must not be forced into one Era');
assert(!source.era.laneCountFrozen, 'Era lane count must remain extensible');
assert(!source.era.exactYearsFrozen, 'exact years must remain Open');
assert(source.era.exactDecadesAreExamplesNotAuthority, 'exact decade examples must not become authority');
assert(source.era.explicitTimeTagsWeakInDream, 'Dream time tags must remain weak');
assert(source.era.core5DistinctRealityEraRequired && source.era.core5DistinctEraCount === 5, 'Core5 must remain 5/5 distinct Era bands');
assert(source.era.core5EraBandsCurrent, 'Core5 Era bands must remain Current');
assert(!source.era.core5ExactYearsFrozen, 'Core5 exact years must remain Open');
assert(source.era.yuiOverallViewpoint, 'Yui must remain overall viewpoint');
assert(source.era.asaFutureSpecies === 'HUMAN', 'Asa must remain Human');
assert(source.era.eraIncidentMustBeEraSpecific && !source.era.eraIncidentMayTransferUnchangedToAnotherEra, 'Era incidents must remain Era-specific');

assert(CORE5_ERA_CANON.eraBandsCurrent, 'Core5 machine Era bands must remain Current');
assert(CORE5_ERA_CANON.exactDecadesAreExamplesNotAuthority, 'machine source must reject exact-decade lock');
assert(!CORE5_ERA_CANON.exactYearsFrozen, 'Core5 exact years may not freeze');
assert(!CORE5_ERA_CANON.eraAutomaticallyCreatesTrauma, 'Era assignment may not auto-create trauma');
assert(!CORE5_ERA_CANON.newerEraMeansSuperiorPerson, 'newer Era may not mean superior person');
assert(!CORE5_ERA_CANON.realHistoricalIncidentMayBeRenamedAndCopied, 'real history may not be rename-copied');
assert(CORE5_ERA_CANON.fictionalIncidentsMustBeEraSpecific, 'fictional incidents must remain Era-specific');
assert(CORE5_ERA_CANON.fictionalIncidentsMustIncludeOrdinaryLifeContext, 'fictional incidents must include ordinary-life context');

assert(core5EraCanonSummary.characterCount === 5 && core5EraCanonSummary.uniqueCharacterCount === 5, 'Core5 Era source must contain five unique characters');
assert(core5EraCanonSummary.uniqueEraCount === 5, 'Core5 Era assignments must be 5/5 unique');
assert(core5EraCanonSummary.uniquePrimaryPressureCount === 5, 'Core5 primary Era pressures must be distinct');
assert(core5EraCanonSummary.futureHumanCount === 1, 'Far Future Core5 must contain one Human Asa');
assert(core5EraCanonSummary.allExactYearsOpen, 'all Core5 exact years must remain Open');

for (const entry of CORE5_ERA_ASSIGNMENTS) {
  assert(expectedAssignments.get(entry.characterId) === entry.realityEra, `unexpected Core5 Era: ${entry.characterId} -> ${entry.realityEra}`);
  assert(entry.species === 'HUMAN', `Core5 species drift: ${entry.characterId}`);
  assert(!entry.exactYearFrozen, `Core5 exact year frozen: ${entry.characterId}`);
}

assert(CORE5_DISTINCT_ERA_CHARACTER_IDS.length === 5 && new Set(CORE5_DISTINCT_ERA_CHARACTER_IDS).size === 5, 'Dream social source must retain five unique Core5 IDs');
assert(DREAM_SOCIAL_WORLD_RULES.core5EraAssignmentLockedAtLaneLevel, 'Dream social source must preserve Current Core5 Era bands');
assert(!DREAM_SOCIAL_WORLD_RULES.core5ExactYearsLocked, 'Dream social source may not freeze exact Core5 years');
assert(DREAM_SOCIAL_WORLD_SUMMARY.assignedCore5EraCount === 5 && DREAM_SOCIAL_WORLD_SUMMARY.uniqueAssignedCore5EraCount === 5, 'Dream social source must preserve five unique assigned Eras');

const humanEraLabels = [
  ['トモリ', '戦後復興・物資不足期'],
  ['ミチル', '高度成長末期〜公害・石油危機の転換期'],
  ['ナギ', 'バブル崩壊後〜携帯Internet初期'],
  ['ユイ', '現代日本'],
  ['アサ', '遠未来 Human / Android / Robot / Avatar共存社会'],
] as const;
for (const [name, era] of humanEraLabels) {
  for (const [label, doc] of [
    ['master', master],
    ['Core5 Era master', core5Era],
    ['temporal backbone', temporal],
    ['visual lineup', lineup],
  ] as const) {
    assert(doc.includes(name) && doc.includes(era), `${label} missing Core5 Era band: ${name} / ${era}`);
  }
}

assert(master.includes('1940 / 1980 / 2000'), 'highest master must retain decade-example migration note');
assert(story.includes('Initial 1940 / 1980 / 2000'), 'Story Hub must mark initial decade numbers as examples');
assert(eraResearch.includes('実在事件は背景研究に使う') && eraResearch.includes('各Era大事件は架空'), 'Era research must separate history research from fictional incidents');
assert(appearanceOverlay.includes('軍服') && appearanceOverlay.includes('neon cyber suit'), 'appearance overlay must guard historical/future shorthand');
assert(profileOverrides.includes('SUPERSEDED') && profileOverrides.includes('夜明けへ向かうテーマ'), 'Asa Dawn-based name rationale must remain superseded');

assert(lorebookEra.schemaVersion >= 2, 'Lorebook Core5 Era schema must be v2+');
assert(!lorebookEra.exactYearsFrozen && lorebookEra.exactDecadesAreExamplesNotAuthority, 'Lorebook must keep exact years Open and decade examples non-authoritative');
assert(lorebookEra.assignments.length === 5, 'Lorebook must contain five Core5 Era assignments');
assert(new Set(lorebookEra.assignments.map((entry) => entry.id)).size === 5, 'Lorebook Core5 IDs must be unique');
assert(new Set(lorebookEra.assignments.map((entry) => entry.era)).size === 5, 'Lorebook Core5 Eras must be unique');
for (const entry of lorebookEra.assignments) {
  assert(expectedAssignments.get(entry.id) === entry.era, `Lorebook Era mismatch: ${entry.id}`);
  assert(entry.species === 'HUMAN', `Lorebook species drift: ${entry.id}`);
  assert(entry.exactYear === null, `Lorebook exact year must remain null: ${entry.id}`);
}
assert(!lorebookEra.runtimeAutoPromotionAllowed, 'Lorebook Era data may not auto-promote runtime');

// Era x Generation x Household.
assert(source.generationAndHousehold.worldAxis === 'ERA_X_GENERATION_X_HOUSEHOLD', 'world axis must remain Era x Generation x Household');
assert(!source.generationAndHousehold.onePersonRepresentsWholeEra, 'one person may not represent a whole Era');
assert(!source.generationAndHousehold.oneHouseholdTypeRepresentsWholeEra, 'one household may not represent a whole Era');
assert(source.generationAndHousehold.requiredPopulationLenses.length >= 6, 'generation lens set must remain broad');
assert(!source.generationAndHousehold.fatherEqualsWorkOnly, 'father stereotype guard failed');
assert(!source.generationAndHousehold.motherEqualsHouseworkOnly, 'mother stereotype guard failed');
assert(!source.generationAndHousehold.grandparentEqualsWisdomOnly, 'grandparent stereotype guard failed');
assert(!source.generationAndHousehold.auntUncleEqualsComicReliefOnly, 'aunt/uncle stereotype guard failed');
assert(!source.generationAndHousehold.childEqualsPureTruthOnly, 'child stereotype guard failed');
assert(!source.generationAndHousehold.exactCore5FamilyMembersFrozen, 'Core5 exact family members must remain Open');

assert(generationLens.includes('Eraを一人で代表させない'), 'generation lens must reject one-person Era representation');
assert(generationLens.includes('Aunt / Uncle Lens') && generationLens.includes('Child Lens'), 'generation lens must include aunt/uncle and child views');
assert(familyAtlas.includes('父') && familyAtlas.includes('伯父叔母') && familyAtlas.includes('祖父母') && familyAtlas.includes('子ども'), 'family atlas must cover multiple family generations');
assert(satire.includes('昔のCharacter → 現代を風刺') && satire.includes('現代Character → 昔を風刺'), 'satire must remain bidirectional');
assert(satire.includes('制度の矛盾') && satire.includes('人を笑うのではなく'), 'satire must target systems/contradictions rather than victims');
assert(source.socialLife.crossGenerationSatireTargetsSystemsNotVictims, 'machine satire guard must remain true');
assert(source.socialLife.presentEraIsNotDefaultCorrectSide, 'Present Era may not become default correct side');
assert(source.socialLife.futureEraIsNotHumanUpgrade, 'Future Era may not become Human upgrade');

// Season architecture.
assert(!SERIES_SEASON_RULES.seasonEqualsEra, 'Season must not equal Era');
assert(SERIES_SEASON_RULES.core5RecurringAcrossSeasons, 'Core5 must recur across Seasons');
assert(!SERIES_SEASON_RULES.characterGrowthResetsBetweenSeasons, 'growth may not reset between Seasons');
assert(SERIES_SEASON_RULES.mainSpineContinuesAcrossSeasons, 'main spine must continue across Seasons');
assert(!SERIES_SEASON_RULES.everySeasonMustFullySolveMacroProblem, 'every Season must not fully solve its macro problem');
assert(!SERIES_SEASON_RULES.everySeasonMustEndHappy, 'every Season must not be forced Happy');
assert(SERIES_SEASON_RULES.seriesCanonicalEnding === 'HAPPY_END', 'series canonical ending must remain Happy End');
assert(!SERIES_SEASON_RULES.finalSeasonCountFrozen, 'final Season count must remain Open');
assert(SERIES_SEASON_RULES.allowedFinalSeasonCounts.includes(2) && SERIES_SEASON_RULES.allowedFinalSeasonCounts.includes(3), '2- or 3-Season architecture must remain available');
assert(SERIES_SEASON_RULES.season1EndingDirection === 'UNEASY_PARTIAL_VICTORY', 'S1 must remain uneasy partial victory direction');
assert(OPTIONAL_SEASON3.enabledAsCandidateArchitecture && !OPTIONAL_SEASON3.mandatory, 'S3 must remain optional Candidate');
assert(OPTIONAL_SEASON3.mustNotBeJustBiggerEnemy, 'optional S3 must not be just a bigger enemy');

assert(SEASON_PROBLEM_LANES.length === 2, 'S1/S2 working macro-problem lanes must remain defined');
assert(SEASON_PROBLEM_LANES[0].workingCode !== SEASON_PROBLEM_LANES[1].workingCode, 'S1 and S2 macro problems must differ');
assert(SEASON_PROBLEM_LANES[0].endingResolution.seriesMystery === 'INTENTIONALLY_UNRESOLVED', 'S1 series mystery must remain unresolved');

assert(CURRENT21_SEASON_ASSIGNMENTS.length === 21 && new Set(CURRENT21_SEASON_ASSIGNMENTS.map((entry) => entry.id)).size === 21, 'Current21 must have unique S1/S2 assignments');
assert(FUTURE15_SEASON_ASSIGNMENTS.length === 15 && new Set(FUTURE15_SEASON_ASSIGNMENTS.map((entry) => entry.id)).size === 15, 'Future15 must have unique S1/S2 working assignments');
assert(FUTURE15_SEASON_ASSIGNMENTS.every((entry) => !entry.rosterPromotion), 'Future15 Season assignment may not auto-promote roster');
assert(seasonArchitectureSummary.totalCharacterAssignmentCount === 36, 'Season matrix must cover 36 character candidates');
assert(seasonArchitectureSummary.core5RecurringCount === 5, 'all Core5 must recur across S1/S2');
assert(seasonArchitectureSummary.future15AutoPromotionCount === 0, 'Future15 Season use may not auto-promote roster');
assert(seasonArchitectureSummary.seriesCanonicalHappyEnd, 'Season architecture must retain series Happy End');
assert(SAKUYAZA_SEASON_FOCUS.recurringAllSeasons && !SAKUYAZA_SEASON_FOCUS.permanentSeasonTeams && SAKUYAZA_SEASON_FOCUS.pairMissionRemainsDynamic, 'Sakuyaza Season recurrence/pair rules must remain dynamic');

assert(seasonMatrix.includes('Season ≠ Era') && seasonMatrix.includes('Current21 Season Matrix') && seasonMatrix.includes('Future15 Season Assignment'), 'Season matrix human source incomplete');
assert(seasonEnding.includes('勝利は本物。安心だけがまだ早い'), 'S1 uneasy-partial-victory quality bar missing');
assert(seasonEnding.includes('2 Seasonsか3 Seasonsか'), '2/3 final Season Open state missing');
assert(story.includes('Season finale ≠ automatic complete Happy End'), 'Story Hub must allow partial Season finales');

// Dream / Party / stars / enemies.
assert(source.yoruNoShirube.layerType === 'DREAM_WORLD', 'Yoru-no-Shirube must remain Dream');
assert(!source.yoruNoShirube.finalMechanismFrozen, 'Dream final mechanism must remain Open');
assert(!source.yoruNoShirube.physicalMorningExists && !source.yoruNoShirube.physicalSunriseReturnAllowed, 'physical morning must remain impossible');
assert(source.yoruNoShirube.returnMode === 'WAKING_TO_OWN_REALITY_ERA', 'return must remain Waking');
assert(source.dreamLiving.provisioningMode === 'STORAGE_MEDIATED_DISCOVERY', 'provisioning must remain storage-mediated');
assert(!source.dreamLiving.directHandOrAirFoodMaterializationAllowed, 'direct food materialization must remain forbidden');
assert(source.dreamLiving.wishCannotOverride.includes('CONSENT'), 'Dream provisioning may not override consent');
assert(source.socialLife.partyScenarioReservoirCount === 28, 'Party reservoir must remain 28');
assert(source.socialLife.alcoholExists && source.socialLife.alcoholIntoxicates, 'alcohol/intoxication must remain');
assert(source.socialLife.minimumMajorSmokerCount >= 3 && source.socialLife.minimumPipeSmokerCount >= 1, 'smoker/pipe direction must remain');
assert(!source.socialLife.smokerFinalAssignmentFrozen, 'smoker identities must remain Open pending adult review');

assert(source.sky.starsVisible && !source.sky.constellationSameAcrossErasRequired, 'stars must remain visible and constellations Era-variable');
assert(!source.sky.finalConstellationChangeCauseFrozen, 'constellation final cause must remain Open');
assert(source.moon.meaning === 'INCIDENT_DEPTH' && !source.moon.elapsedTimeClock, 'Moon must remain incident depth, not clock');
assert(!source.moon.fixedEraBossRequiredAtSaku, 'Saku may not require fixed Era Boss');

assert(source.sakuyaza.formalName === '朔夜座' && SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'Current enemy-group name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.earlyObserverShortLabel === '八影' && SAKUYAZA_CURRENT_IDENTITY.supersededCandidateName === '朔盟', '八影 / 朔盟 migration identities drifted');
assert(SAKUMEI_CANDIDATE_IDENTITY.status.includes('SUPERSEDED'), 'legacy 朔盟 must remain superseded');
assert(sakuyazaCurrentSummary.memberCount === 8 && sakuyazaCurrentSummary.uniqueEnemyIdCount === 8, '朔夜座 must retain 8 unique enemy assets');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, '朔夜座 final masters must remain unapproved');

assert(source.gunjoZankyoroku.formalName === '群青残響録', '群青残響録 name must remain');
assert(!source.gunjoZankyoroku.fixedFaction && !source.gunjoZankyoroku.fixedCount && !source.gunjoZankyoroku.onePerEra, '群青残響録 must remain non-fixed');
assert(!source.gunjoZankyoroku.mandatoryCombatBoss, '群青残響録 must not become mandatory combat Boss roster');
assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('whether each major incident needs a combat boss'), 'combat Boss requirement must remain Open');

// Existing conflict / Stage integrity.
assert(worldSettingConflictSummary.total === 24, `expected 24 conflict lanes, got ${worldSettingConflictSummary.total}`);
assert(worldSettingConflictSummary.guarded === 18, `expected 18 guarded lanes, got ${worldSettingConflictSummary.guarded}`);
assert(worldSettingConflictSummary.openHuman === 5, `expected 5 OPEN_HUMAN lanes, got ${worldSettingConflictSummary.openHuman}`);
assert(worldSettingConflictSummary.candidateDependent === 1, `expected 1 candidate-dependent lane, got ${worldSettingConflictSummary.candidateDependent}`);
assert(worldSettingConflictSummary.unresolvedBlocker === 0, `unresolved world-setting blockers: ${worldSettingConflictSummary.unresolvedBlocker}`);
assert(new Set(worldSettingConflictEntries.map((entry) => entry.id)).size === worldSettingConflictEntries.length, 'conflict IDs must remain unique');
assert(stageWorldLoreSummary.productionStageCount === 20 && stageWorldLoreSummary.integrationStageCount === 20, 'Stage20 integration must remain 20/20');
assert(stageWorldLoreSummary.missingProductionStageIds.length === 0 && stageWorldLoreSummary.orphanIntegrationStageIds.length === 0, 'Stage lore IDs must remain complete');
assert(stageWorldLoreSummary.physicalMorningStageCount === 0, 'Stage lore must contain zero physical morning stages');

// Future / animals / final ending.
assert(source.futureAndroid.asaIsHumanFromThisEra, 'Asa must remain Future Human');
assert(!source.futureAndroid.asaPoliticalSideFrozen && !source.futureAndroid.asaIncidentRoleFrozen, 'Asa exact future role must remain Open');
assert(!source.futureAndroid.humanizationIsGoal, 'Android growth may not become becoming Human');
assert(source.futureAndroid.studyQuestionStructuresFromLongLivedScienceFictionAllowed, 'durable SF question-structure study must remain allowed');
assert(!source.futureAndroid.copyFranchiseSpecificTermsOrganizationsOrPlotsAllowed, 'franchise-specific copying must remain forbidden');
assert(source.futureAndroid.rejectedFinalNames.includes('シオン') && source.futureAndroid.rejectedFinalNames.includes('イヴ・ノイン'), 'rejected Android names must remain rejected');
assert(source.animals.realityDogsCatsMayEnterDream && !source.animals.realityAnimalsAreStarBeasts, 'Reality animals / Star Beast boundary drifted');
assert(source.ending.canonicalHappyEnd && source.ending.canonicalHappyEndAppliesAtSeriesLevel, 'series canonical Happy End must remain');
assert(!source.ending.everySeasonMustBeHappy, 'every Season must not be forced Happy');
assert(!source.ending.permanentDeathPrimaryTearDevice, 'permanent death must not become primary tear device');

assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('final season count: 2 or 3'), 'final Season count must remain Open');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('initial 1940/1980/2000 decade examples are exact Canon'), 'decade-example lock must remain superseded');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('every Season must end with a complete Happy End'), 'per-Season complete Happy End must remain superseded');
assert(storyWorldMasterSummary.core5AssignedEraCount === 5 && storyWorldMasterSummary.core5UniqueAssignedEraCount === 5, 'Story master summary must report five unique Core5 Era bands');
assert(storyWorldMasterSummary.generationLensCount >= 6, 'Story master summary must retain broad generation lenses');
assert(storyWorldMasterSummary.allowedFinalSeasonCountOptions === 2, 'Story master must retain 2/3 final Season options');
assert(storyWorldMasterSummary.unresolvedHardContradictionCount === 0, 'Story / World master must report zero hard contradictions');
assert(!storyWorldMasterSummary.runtimeAutoPromotionAllowed, 'Story / World master may not auto-promote runtime');

console.log(
  `story/world master OK: ${worldSettingExpansionSummary.total} areas / Core5 5 Era bands / Era×Generation×Household / 36 S1-S2 assignments / S1 uneasy partial victory / final Happy End in S2 or optional S3 / 朔夜座 ${sakuyazaCurrentSummary.memberCount} / Stage ${stageWorldLoreSummary.integrationStageCount}`,
);
