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
const feast = read('docs/dream-feast-party-social-bible-v1.md');

const lorebookEra = JSON.parse(read('public/lorebook/data/core5-era-canon.v1.json')) as {
  schemaVersion: number;
  exactYearsFrozen: boolean;
  exactDecadesAreExamplesNotAuthority: boolean;
  assignments: Array<{
    id: string;
    era: string;
    eraLabel: string;
    species: string;
    exactYear: string | null;
  }>;
  runtimeAutoPromotionAllowed: boolean;
};

// -----------------------------------------------------------------------------
// P0-P2 world-setting coverage remains intact.
// -----------------------------------------------------------------------------

assert(worldSettingExpansionSummary.total === 32, `expected 32 world-setting areas, got ${worldSettingExpansionSummary.total}`);
assert(worldSettingExpansionSummary.p0 === 9, `expected 9 P0 areas, got ${worldSettingExpansionSummary.p0}`);
assert(worldSettingExpansionSummary.p1 === 18, `expected 18 P1 areas, got ${worldSettingExpansionSummary.p1}`);
assert(worldSettingExpansionSummary.p2 === 5, `expected 5 P2 areas, got ${worldSettingExpansionSummary.p2}`);
assert(!worldSettingExpansionSummary.runtimeAutoPromotionAllowed, 'world-setting expansion must not auto-promote runtime');
assert(new Set(worldSettingExpansionEntries.map((entry) => entry.id)).size === worldSettingExpansionEntries.length, 'world-setting IDs must be unique');
for (const entry of worldSettingExpansionEntries) {
  assert(fs.existsSync(entry.primarySource), `missing world-setting source: ${entry.primarySource}`);
  assert(!entry.runtimeAutoPromotionAllowed, `runtime auto-promotion forbidden: ${entry.id}`);
}

// -----------------------------------------------------------------------------
// Highest Story / World authority.
// -----------------------------------------------------------------------------

const source = STORY_WORLD_MASTER_SOURCE;
assert(source.authority === 'CURRENT_HIGHEST_STORY_WORLD_AUTHORITY', 'unexpected Story / World authority');
assert(source.reality.world === 'REAL_JAPAN', 'Reality must remain real Japan');
assert(source.reality.realHistoricalIncidentsAreResearchEvidenceNotRenameCopyMaterial, 'real incidents must remain research evidence, not rename-copy material');
assert(source.reality.fictionalMajorIncidentsRequired, 'major Era incidents must remain fictional');
assert(!source.era.sameEraRequired, 'Dream participants must not be forced into one era');
assert(!source.era.laneCountFrozen, 'Era lane count must remain extensible');
assert(!source.era.exactYearsFrozen, 'exact years must remain open');
assert(source.era.exactDecadesAreExamplesNotAuthority, 'initial exact-decade examples must not become authority');
assert(source.era.explicitTimeTagsWeakInDream, 'Dream time tags must remain weak');
assert(source.era.eraIncidentMustBeEraSpecific, 'Era incidents must remain Era-specific');
assert(!source.era.eraIncidentMayTransferUnchangedToAnotherEra, 'same incident may not be moved unchanged across Eras');

// -----------------------------------------------------------------------------
// Core5 researched Era bands.
// -----------------------------------------------------------------------------

const expectedAssignments = new Map([
  ['tomori', 'POSTWAR_RECOVERY_SCARCITY_JAPAN'],
  ['michiru', 'LATE_HIGH_GROWTH_POLLUTION_ENERGY_TRANSITION_JAPAN'],
  ['nagi', 'POST_BUBBLE_EARLY_MOBILE_INTERNET_JAPAN'],
  ['yui', 'PRESENT_DAY_JAPAN'],
  ['asa', 'FAR_FUTURE_HUMAN_ANDROID_ROBOT_AVATAR_SOCIETY'],
]);

assert(source.era.core5DistinctRealityEraRequired, 'Core5 must remain five distinct Reality eras');
assert(source.era.core5DistinctEraCount === 5, 'Core5 distinct era count must stay 5');
assert(source.era.core5EraBandsCurrent, 'Core5 Era bands must remain Current');
assert(!source.era.core5ExactYearsFrozen, 'Core5 exact years must remain Open');
assert(source.era.yuiOverallViewpoint, 'Yui overall viewpoint must remain true');
assert(source.era.asaFutureSpecies === 'HUMAN', 'Asa must remain Human in Far Future');

assert(CORE5_ERA_CANON.eraBandsCurrent, 'Core5 machine Era bands must remain Current');
assert(CORE5_ERA_CANON.exactDecadesAreExamplesNotAuthority, 'machine source must reject exact-decade example lock');
assert(!CORE5_ERA_CANON.exactYearsFrozen, 'Core5 exact years may not be frozen');
assert(!CORE5_ERA_CANON.eraAutomaticallyCreatesTrauma, 'Era assignment must not auto-create trauma');
assert(!CORE5_ERA_CANON.newerEraMeansSuperiorPerson, 'newer Era may not mean superior person');
assert(!CORE5_ERA_CANON.realHistoricalIncidentMayBeRenamedAndCopied, 'real historical incidents may not be rename-copied');
assert(CORE5_ERA_CANON.fictionalIncidentsMustBeEraSpecific, 'fictional incidents must be Era-specific');
assert(CORE5_ERA_CANON.fictionalIncidentsMustIncludeOrdinaryLifeContext, 'fictional incidents must include ordinary-life context');

assert(core5EraCanonSummary.characterCount === 5, 'Core5 era source must contain five characters');
assert(core5EraCanonSummary.uniqueCharacterCount === 5, 'Core5 era character IDs must be unique');
assert(core5EraCanonSummary.uniqueEraCount === 5, 'Core5 era assignments must be 5/5 unique');
assert(core5EraCanonSummary.uniquePrimaryPressureCount === 5, 'Core5 primary Era pressures must be 5/5 distinct');
assert(core5EraCanonSummary.futureHumanCount === 1, 'Far Future Core5 lane must contain exactly one Human Asa assignment');
assert(core5EraCanonSummary.allExactYearsOpen, 'all Core5 exact years must remain Open');

for (const entry of CORE5_ERA_ASSIGNMENTS) {
  assert(expectedAssignments.get(entry.characterId) === entry.realityEra, `unexpected Core5 era assignment: ${entry.characterId} -> ${entry.realityEra}`);
  assert(entry.species === 'HUMAN', `Core5 species changed unexpectedly: ${entry.characterId}`);
  assert(!entry.exactYearFrozen, `Core5 exact year unexpectedly frozen: ${entry.characterId}`);
}

assert(CORE5_DISTINCT_ERA_CHARACTER_IDS.length === 5, 'Dream social source must retain five Core5 IDs');
assert(new Set(CORE5_DISTINCT_ERA_CHARACTER_IDS).size === 5, 'Dream social Core5 IDs must be unique');
assert(DREAM_SOCIAL_WORLD_RULES.core5EraAssignmentLockedAtLaneLevel, 'Dream social source must preserve Current Core5 Era bands');
assert(!DREAM_SOCIAL_WORLD_RULES.core5ExactYearsLocked, 'Dream social source may not freeze exact Core5 years');
assert(DREAM_SOCIAL_WORLD_SUMMARY.assignedCore5EraCount === 5, 'Dream social source must contain five era assignments');
assert(DREAM_SOCIAL_WORLD_SUMMARY.uniqueAssignedCore5EraCount === 5, 'Dream social source must preserve five unique eras');

const humanEraLabels = [
  ['トモリ', '戦後復興・物資不足期'],
  ['ミチル', '高度成長末期〜公害・石油危機の転換期'],
  ['ナギ', 'バブル崩壊後〜携帯Internet初期'],
  ['ユイ', '現代日本'],
  ['アサ', '遠未来 Human / Android / Robot / Avatar共存社会'],
] as const;

for (const [name, era] of humanEraLabels) {
  assert(master.includes(name) && master.includes(era), `master missing Core5 Era band: ${name} / ${era}`);
  assert(core5Era.includes(name) && core5Era.includes(era), `Core5 Era master missing: ${name} / ${era}`);
  assert(temporal.includes(name) && temporal.includes(era), `temporal backbone missing: ${name} / ${era}`);
  assert(lineup.includes(name) && lineup.includes(era), `visual lineup missing: ${name} / ${era}`);
}

assert(master.includes('1940 / 1980 / 2000'), 'highest master must explicitly mark initial decade examples as non-authority');
assert(story.includes('Initial 1940 / 1980 / 2000 numbers were exploration examples'), 'Story Hub must mark exact-decade examples as exploration only');
assert(eraResearch.includes('実在事件は背景研究に使う。ヨルノシルベの各Era大事件は架空'), 'Era research must separate real history from fictional incidents');
assert(appearanceOverlay.includes('Tomori does not become war-costume shorthand') || appearanceOverlay.includes('war-costume shorthand'), 'appearance overlay must guard Tomori war shorthand');
assert(profileOverrides.includes('夜明けへ向かうテーマ') && profileOverrides.includes('SUPERSEDED'), 'Asa obsolete Dawn-based name rationale must be explicitly superseded');

// Lorebook data mirrors Current Era bands without exact years.
assert(lorebookEra.schemaVersion >= 2, 'Lorebook Core5 Era schema must be v2+');
assert(!lorebookEra.exactYearsFrozen, 'Lorebook exact years must remain Open');
assert(lorebookEra.exactDecadesAreExamplesNotAuthority, 'Lorebook must reject exact decade example lock');
assert(lorebookEra.assignments.length === 5, 'Lorebook Core5 era data must contain five assignments');
assert(new Set(lorebookEra.assignments.map((entry) => entry.id)).size === 5, 'Lorebook Core5 IDs must be unique');
assert(new Set(lorebookEra.assignments.map((entry) => entry.era)).size === 5, 'Lorebook Core5 eras must be unique');
for (const entry of lorebookEra.assignments) {
  assert(expectedAssignments.get(entry.id) === entry.era, `Lorebook Era mismatch: ${entry.id}`);
  assert(entry.species === 'HUMAN', `Lorebook Core5 species drift: ${entry.id}`);
  assert(entry.exactYear === null, `Lorebook exact year must remain null: ${entry.id}`);
}
assert(!lorebookEra.runtimeAutoPromotionAllowed, 'Lorebook era data may not auto-promote runtime');

// -----------------------------------------------------------------------------
// Era × Generation × Household.
// -----------------------------------------------------------------------------

assert(source.generationAndHousehold.worldAxis === 'ERA_X_GENERATION_X_HOUSEHOLD', 'world generation axis must remain Era x Generation x Household');
assert(!source.generationAndHousehold.onePersonRepresentsWholeEra, 'one person may not represent a whole Era');
assert(!source.generationAndHousehold.oneHouseholdTypeRepresentsWholeEra, 'one household type may not represent a whole Era');
assert(source.generationAndHousehold.requiredPopulationLenses.length >= 6, 'generation/household population lens set must remain broad');
assert(!source.generationAndHousehold.fatherEqualsWorkOnly, 'father may not be work-only stereotype');
assert(!source.generationAndHousehold.motherEqualsHouseworkOnly, 'mother may not be housework-only stereotype');
assert(!source.generationAndHousehold.grandparentEqualsWisdomOnly, 'grandparent may not be wisdom-only stereotype');
assert(!source.generationAndHousehold.auntUncleEqualsComicReliefOnly, 'aunt/uncle may not be comic-relief-only stereotype');
assert(!source.generationAndHousehold.childEqualsPureTruthOnly, 'child may not be pure-truth-only stereotype');
assert(!source.generationAndHousehold.exactCore5FamilyMembersFrozen, 'Core5 exact family members must remain Open');

assert(generationLens.includes('Eraを一人で代表させない'), 'generation lens must reject one-person Era representation');
assert(generationLens.includes('Aunt / Uncle Lens'), 'generation lens must include aunt/uncle perspective');
assert(generationLens.includes('Child Lens'), 'generation lens must include child perspective');
assert(familyAtlas.includes('Eraを一人で代表させない'), 'family atlas must include multi-generation Era guard');
assert(satire.includes('昔のCharacter → 現代を風刺'), 'satire source must remain bidirectional across Eras');
assert(satire.includes('personを笑うよりsystem / custom / contradictionを笑う'), 'satire must target systems/customs/contradictions rather than people');

// -----------------------------------------------------------------------------
// Season architecture and unresolved Season finales.
// -----------------------------------------------------------------------------

assert(!SERIES_SEASON_RULES.seasonEqualsEra, 'Season must not equal Era');
assert(SERIES_SEASON_RULES.core5RecurringAcrossSeasons, 'Core5 must recur across Seasons');
assert(!SERIES_SEASON_RULES.characterGrowthResetsBetweenSeasons, 'character growth may not reset between Seasons');
assert(SERIES_SEASON_RULES.mainSpineContinuesAcrossSeasons, 'main spine must continue across Seasons');
assert(!SERIES_SEASON_RULES.everySeasonMustFullySolveMacroProblem, 'every Season must not be forced to fully solve its macro problem');
assert(!SERIES_SEASON_RULES.everySeasonMustEndHappy, 'every Season must not be forced to end Happy');
assert(SERIES_SEASON_RULES.seriesCanonicalEnding === 'HAPPY_END', 'series canonical ending must remain Happy End');
assert(!SERIES_SEASON_RULES.finalSeasonCountFrozen, 'final Season count must remain Open');
assert(SERIES_SEASON_RULES.allowedFinalSeasonCounts.includes(2) && SERIES_SEASON_RULES.allowedFinalSeasonCounts.includes(3), '2- or 3-Season final architecture must remain available');
assert(SERIES_SEASON_RULES.season1EndingDirection === 'UNEASY_PARTIAL_VICTORY', 'S1 ending direction must remain uneasy partial victory');
assert(OPTIONAL_SEASON3.enabledAsCandidateArchitecture && !OPTIONAL_SEASON3.mandatory, 'S3 must remain optional Candidate architecture');
assert(OPTIONAL_SEASON3.mustNotBeJustBiggerEnemy, 'optional S3 must not be just a bigger enemy');

assert(SEASON_PROBLEM_LANES.length === 2, 'S1/S2 working macro-problem lanes must remain defined');
assert(SEASON_PROBLEM_LANES[0].workingCode !== SEASON_PROBLEM_LANES[1].workingCode, 'S1 and S2 must have different macro problems');
assert(SEASON_PROBLEM_LANES[0].endingResolution.seriesMystery === 'INTENTIONALLY_UNRESOLVED', 'S1 series mystery must remain intentionally unresolved');

assert(CURRENT21_SEASON_ASSIGNMENTS.length === 21, 'Current21 must all receive S1/S2 Season assignments');
assert(new Set(CURRENT21_SEASON_ASSIGNMENTS.map((entry) => entry.id)).size === 21, 'Current21 Season assignment IDs must be unique');
assert(FUTURE15_SEASON_ASSIGNMENTS.length === 15, 'Future15 must all receive S1/S2 working assignments');
assert(new Set(FUTURE15_SEASON_ASSIGNMENTS.map((entry) => entry.id)).size === 15, 'Future15 Season assignment IDs must be unique');
assert(FUTURE15_SEASON_ASSIGNMENTS.every((entry) => !entry.rosterPromotion), 'Future15 Season assignment must not auto-promote roster');
assert(seasonArchitectureSummary.totalCharacterAssignmentCount === 36, 'S1/S2 Season matrix must cover 36 character candidates');
assert(seasonArchitectureSummary.core5RecurringCount === 5, 'all Core5 must recur strongly across S1/S2');
assert(seasonArchitectureSummary.future15AutoPromotionCount === 0, 'Future15 Season use must not auto-promote roster');
assert(seasonArchitectureSummary.seriesCanonicalHappyEnd, 'Season architecture must retain series Happy End');
assert(SAKUYAZA_SEASON_FOCUS.recurringAllSeasons, 'Sakuyaza must recur across Seasons');
assert(!SAKUYAZA_SEASON_FOCUS.permanentSeasonTeams, 'Sakuyaza may not be split into permanent Season teams');
assert(SAKUYAZA_SEASON_FOCUS.pairMissionRemainsDynamic, 'Sakuyaza pair mission rule must remain dynamic');

assert(seasonMatrix.includes('Season ≠ Era'), 'Season matrix must explicitly separate Season from Era');
assert(seasonMatrix.includes('Current21 Season Matrix'), 'Season matrix must include Current21 allocation');
assert(seasonMatrix.includes('Future15 Season Assignment'), 'Season matrix must include Future15 allocation');
assert(seasonEnding.includes('勝利は本物。安心だけがまだ早い'), 'Season ending source must preserve uneasy partial-victory quality bar');
assert(seasonEnding.includes('2 Seasonsか3 Seasonsか'), 'final Season count must remain 2/3 Open');
assert(story.includes('Series canonical ending = Happy End'), 'Story Hub must define Happy End at series level');
assert(story.includes('Season finale ≠ automatic complete Happy End'), 'Story Hub must allow unresolved Season finales');

// -----------------------------------------------------------------------------
// Endless-night Dream / Waking / provisioning / Party.
// -----------------------------------------------------------------------------

assert(source.yoruNoShirube.layerType === 'DREAM_WORLD', 'Yoru-no-Shirube must remain a Dream world');
assert(!source.yoruNoShirube.finalMechanismFrozen, 'Dream final mechanism must remain Open');
assert(!source.yoruNoShirube.physicalMorningExists, 'physical morning must not exist');
assert(!source.yoruNoShirube.physicalSunriseReturnAllowed, 'sunrise may not become return condition');
assert(source.yoruNoShirube.returnMode === 'WAKING_TO_OWN_REALITY_ERA', 'return must remain Waking to own Reality era');
assert(source.dreamLiving.provisioningMode === 'STORAGE_MEDIATED_DISCOVERY', 'Dream provisioning must remain storage-mediated');
assert(!source.dreamLiving.directHandOrAirFoodMaterializationAllowed, 'food may not directly materialize in hand/open air');
assert(source.dreamLiving.wishCannotOverride.includes('CONSENT'), 'Dream provisioning may not override consent');
assert(feast.includes('28') || DREAM_SOCIAL_WORLD_RULES.partyScenarioReservoirCount === 28, 'Party scenario reservoir must remain available');

assert(source.socialLife.partyScenarioReservoirCount === 28, 'party reservoir must remain 28');
assert(source.socialLife.alcoholExists && source.socialLife.alcoholIntoxicates, 'alcohol/intoxication must remain available');
assert(source.socialLife.minimumMajorSmokerCount >= 3, 'major smoker direction must remain 3+');
assert(source.socialLife.minimumPipeSmokerCount >= 1, 'pipe smoker direction must remain 1+');
assert(!source.socialLife.smokerFinalAssignmentFrozen, 'smoker person assignment must remain Open pending adult/era review');
assert(source.socialLife.crossGenerationSatireTargetsSystemsNotVictims, 'cross-generation satire must target systems, not victims');
assert(!source.socialLife.presentEraIsNotDefaultCorrectSide === false || source.socialLife.presentEraIsNotDefaultCorrectSide, 'Present Era must not become default correct side');

// -----------------------------------------------------------------------------
// Stars / Moon / enemy identity / Gunjo.
// -----------------------------------------------------------------------------

assert(source.sky.starsVisible, 'stars must remain visible');
assert(!source.sky.constellationSameAcrossErasRequired, 'constellations must not be identical across eras');
assert(!source.sky.finalConstellationChangeCauseFrozen, 'constellation-change cause must remain Open');
assert(source.moon.meaning === 'INCIDENT_DEPTH', 'moon phase must remain incident depth');
assert(!source.moon.elapsedTimeClock, 'moon phase must not become elapsed-time clock');
assert(!source.moon.fixedEraBossRequiredAtSaku, 'Saku may not require a fixed era boss');

assert(source.sakuyaza.formalName === '朔夜座', 'Story master enemy-group name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'machine enemy-group name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.earlyObserverShortLabel === '八影', '八影 must remain early observer label');
assert(SAKUYAZA_CURRENT_IDENTITY.supersededCandidateName === '朔盟', '朔盟 must remain superseded candidate name');
assert(SAKUMEI_CANDIDATE_IDENTITY.status.includes('SUPERSEDED'), 'legacy 朔盟 candidate must remain superseded');
assert(sakuyazaCurrentSummary.memberCount === 8, '朔夜座 must retain eight member assets');
assert(sakuyazaCurrentSummary.uniqueEnemyIdCount === 8, '朔夜座 enemy IDs must remain unique');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, '朔夜座 visual masters must remain unapproved before Human Review');

assert(source.gunjoZankyoroku.formalName === '群青残響録', '群青残響録 name must remain fixed');
assert(!source.gunjoZankyoroku.fixedFaction, '群青残響録 must not become a fixed faction');
assert(!source.gunjoZankyoroku.fixedCount, '群青残響録 must not become fixed-count');
assert(!source.gunjoZankyoroku.onePerEra, 'five Core5 Eras must not create one Gunjo member per Era');
assert(!source.gunjoZankyoroku.mandatoryCombatBoss, 'Gunjo members must not become mandatory combat bosses');
assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('whether each major incident needs a combat boss'), 'combat boss requirement must remain Open');

// -----------------------------------------------------------------------------
// Conflict register / Stage20 invariants.
// -----------------------------------------------------------------------------

assert(worldSettingConflictSummary.total === 24, `expected 24 conflict lanes, got ${worldSettingConflictSummary.total}`);
assert(worldSettingConflictSummary.guarded === 18, `expected 18 guarded conflict lanes, got ${worldSettingConflictSummary.guarded}`);
assert(worldSettingConflictSummary.openHuman === 5, `expected 5 OPEN_HUMAN lanes, got ${worldSettingConflictSummary.openHuman}`);
assert(worldSettingConflictSummary.candidateDependent === 1, `expected 1 candidate-dependent lane, got ${worldSettingConflictSummary.candidateDependent}`);
assert(worldSettingConflictSummary.unresolvedBlocker === 0, `world-setting unresolved blockers: ${worldSettingConflictSummary.unresolvedBlocker}`);
assert(new Set(worldSettingConflictEntries.map((entry) => entry.id)).size === worldSettingConflictEntries.length, 'conflict IDs must remain unique');

assert(stageWorldLoreSummary.productionStageCount === 20, 'Stage Production count must remain 20');
assert(stageWorldLoreSummary.integrationStageCount === 20, 'Stage lore integration must remain 20/20');
assert(stageWorldLoreSummary.missingProductionStageIds.length === 0, 'Stage lore must not miss production stages');
assert(stageWorldLoreSummary.orphanIntegrationStageIds.length === 0, 'Stage lore must not contain orphan stages');
assert(stageWorldLoreSummary.physicalMorningStageCount === 0, 'Stage lore must contain zero physical-morning stages');

// -----------------------------------------------------------------------------
// Android / animals / ending boundaries.
// -----------------------------------------------------------------------------

assert(source.futureAndroid.asaIsHumanFromThisEra, 'Future Asa must remain Human');
assert(!source.futureAndroid.asaPoliticalSideFrozen, 'Future Asa political side must remain Open');
assert(!source.futureAndroid.asaIncidentRoleFrozen, 'Future Asa incident role must remain Open');
assert(!source.futureAndroid.humanizationIsGoal, 'Android growth may not become becoming human');
assert(source.futureAndroid.studyQuestionStructuresFromLongLivedScienceFictionAllowed, 'future design must allow study of durable SF question structures');
assert(!source.futureAndroid.copyFranchiseSpecificTermsOrganizationsOrPlotsAllowed, 'future design may not copy franchise-specific terms, organizations or plots');
assert(source.futureAndroid.rejectedFinalNames.includes('シオン'), 'rejected Android name シオン must stay rejected');
assert(source.futureAndroid.rejectedFinalNames.includes('イヴ・ノイン'), 'rejected Android name イヴ・ノイン must stay rejected');

assert(source.animals.realityDogsCatsMayEnterDream, 'Reality dogs/cats must remain eligible for Dream');
assert(!source.animals.realityAnimalsAreStarBeasts, 'Reality animals must remain distinct from Star Beasts');
assert(source.ending.canonicalHappyEnd, 'canonical Happy End must remain true');
assert(source.ending.canonicalHappyEndAppliesAtSeriesLevel, 'Happy End must apply at series level');
assert(!source.ending.everySeasonMustBeHappy, 'each Season must not be forced Happy');
assert(!source.ending.permanentDeathPrimaryTearDevice, 'permanent death must not become primary tear device');

assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('final season count: 2 or 3'), 'final Season count must remain Open');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('initial 1940/1980/2000 decade examples are exact Canon'), 'exact decade example lock must remain superseded');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('every Season must end with a complete Happy End'), 'per-Season mandatory Happy End must remain superseded');

assert(storyWorldMasterSummary.core5AssignedEraCount === 5, 'Story master summary must report five Core5 assignments');
assert(storyWorldMasterSummary.core5UniqueAssignedEraCount === 5, 'Story master summary must report five unique Core5 Era bands');
assert(storyWorldMasterSummary.generationLensCount >= 6, 'Story master summary must preserve generation lens breadth');
assert(storyWorldMasterSummary.allowedFinalSeasonCountOptions === 2, 'Story master must preserve two allowed final Season counts: 2 or 3');
assert(storyWorldMasterSummary.unresolvedHardContradictionCount === 0, 'Story / World master must report zero hard contradictions');
assert(!storyWorldMasterSummary.runtimeAutoPromotionAllowed, 'Story / World master may not auto-promote runtime');

console.log(
  `story/world master OK: ${worldSettingExpansionSummary.total} areas / Core5 5 researched Era bands / 36 S1-S2 cast assignments / S1 uneasy partial victory / final Happy End in S2 or optional S3 / 朔夜座 ${sakuyazaCurrentSummary.memberCount} / Stage ${stageWorldLoreSummary.integrationStageCount}`,
);
