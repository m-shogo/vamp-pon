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

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
const master = read('docs/00-current-story-world-master.md');
const core5Era = read('docs/core5-era-character-master-v1.md');
const temporal = read('docs/story-temporal-layer-and-character-connections-v1.md');
const lineup = read('docs/character-height-age-era-lineup-v1.md');
const appearanceOverlay = read('docs/core5-era-appearance-overlay-v1.md');
const profileOverrides = read('docs/core5-era-profile-overrides-v1.md');
const lorebookEra = JSON.parse(read('public/lorebook/data/core5-era-canon.v1.json')) as {
  assignments: Array<{ id: string; era: string; species: string; exactYear: string | null }>;
  runtimeAutoPromotionAllowed: boolean;
};

// Existing P0-P2 world-setting coverage remains intact.
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

// Highest Story / World authority.
const source = STORY_WORLD_MASTER_SOURCE;
assert(source.authority === 'CURRENT_HIGHEST_STORY_WORLD_AUTHORITY', 'unexpected Story / World authority');
assert(source.reality.world === 'REAL_JAPAN', 'Reality must remain real Japan');
assert(!source.era.sameEraRequired, 'Dream participants must not be forced into one era');
assert(!source.era.laneCountFrozen, 'Era lane count must remain extensible');
assert(!source.era.exactYearsFrozen, 'exact years must remain open');
assert(source.era.explicitTimeTagsWeakInDream, 'Dream time tags must remain weak');

// Core5 era lane assignment is now Current, while exact years remain Open.
const expectedAssignments = new Map([
  ['tomori', '1940S_JAPAN'],
  ['michiru', '1980S_JAPAN'],
  ['nagi', '2000S_JAPAN'],
  ['yui', 'PRESENT_DAY_JAPAN'],
  ['asa', 'FUTURE_ANDROID_ROBOT_SOCIETY'],
]);

assert(source.era.core5DistinctRealityEraRequired, 'Core5 must remain five distinct Reality eras');
assert(source.era.core5DistinctEraCount === 5, 'Core5 distinct era count must stay 5');
assert(source.era.exactCore5EraAssignmentFrozen, 'Core5 person-to-era lane assignment must now be frozen Current');
assert(!source.era.core5ExactYearsFrozen, 'Core5 exact years must remain Open');
assert(source.era.yuiOverallViewpoint, 'Yui overall viewpoint must remain true');
assert(source.era.asaFutureSpecies === 'HUMAN', 'Asa must remain Human in the Future Android/Robot era');
assert(CORE5_ERA_CANON.eraAssignmentFrozenAtLaneLevel, 'Core5 lane assignment source must be Current');
assert(!CORE5_ERA_CANON.exactYearsFrozen, 'Core5 exact years may not be frozen');
assert(!CORE5_ERA_CANON.eraAutomaticallyCreatesTrauma, 'Era assignment must not auto-create trauma');
assert(!CORE5_ERA_CANON.newEraMeansTechnologyUpgrade, 'newer Era may not mean superior person');
assert(core5EraCanonSummary.characterCount === 5, 'Core5 era source must contain five characters');
assert(core5EraCanonSummary.uniqueCharacterCount === 5, 'Core5 era character IDs must be unique');
assert(core5EraCanonSummary.uniqueEraCount === 5, 'Core5 era assignments must be 5/5 unique');
assert(core5EraCanonSummary.futureHumanCount === 1, 'Future Core5 lane must contain exactly one Human Asa assignment');
assert(core5EraCanonSummary.allExactYearsOpen, 'all Core5 exact years must remain Open');

for (const entry of CORE5_ERA_ASSIGNMENTS) {
  assert(expectedAssignments.get(entry.characterId) === entry.realityEra, `unexpected Core5 era assignment: ${entry.characterId} -> ${entry.realityEra}`);
  assert(entry.species === 'HUMAN', `Core5 species changed unexpectedly: ${entry.characterId}`);
  assert(!entry.exactYearFrozen, `Core5 exact year unexpectedly frozen: ${entry.characterId}`);
}

assert(CORE5_DISTINCT_ERA_CHARACTER_IDS.length === 5, 'Dream social source must retain five Core5 IDs');
assert(new Set(CORE5_DISTINCT_ERA_CHARACTER_IDS).size === 5, 'Dream social Core5 IDs must be unique');
assert(DREAM_SOCIAL_WORLD_RULES.core5EraAssignmentLockedAtLaneLevel, 'Dream social source must preserve Current Core5 era lanes');
assert(!DREAM_SOCIAL_WORLD_RULES.core5ExactYearsLocked, 'Dream social source may not freeze exact Core5 years');
assert(DREAM_SOCIAL_WORLD_SUMMARY.assignedCore5EraCount === 5, 'Dream social source must contain five era assignments');
assert(DREAM_SOCIAL_WORLD_SUMMARY.uniqueAssignedCore5EraCount === 5, 'Dream social source must preserve five unique eras');

// Core5 human-readable authority alignment.
for (const [name, era] of [
  ['トモリ', '1940年代系'],
  ['ミチル', '1980年代系'],
  ['ナギ', '2000年代系'],
  ['ユイ', '現代日本'],
  ['アサ', '未来 Android / Robot共存社会'],
] as const) {
  assert(master.includes(name) && master.includes(era), `master missing Core5 era: ${name} / ${era}`);
  assert(core5Era.includes(name) && core5Era.includes(era), `Core5 era master missing: ${name} / ${era}`);
  assert(temporal.includes(name) && temporal.includes(era), `temporal backbone missing: ${name} / ${era}`);
  assert(lineup.includes(name) && lineup.includes(era), `visual lineup missing: ${name} / ${era}`);
}
assert(master.includes('Core5 person-to-era lane assignmentそのものは、もうOpenではない'), 'highest master must close the old Core5 lane-assignment Open state');
assert(!STORY_WORLD_MASTER_OPEN_FIELDS.includes('exact Core5 era assignment'), 'old Core5 assignment Open field must be removed');
assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('exact Core5 years / sub-era placement'), 'Core5 exact years must remain Open');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('Core5 person-to-era assignment is entirely open'), 'old fully-open Core5 mapping must be superseded');
assert(lineup.includes('Core5の**person-to-era lane assignmentは承認待ちではなくCurrent**'), 'visual lineup must treat Core5 lane assignment as Current');
assert(appearanceOverlay.includes('アサ本人をAndroid') || appearanceOverlay.includes('Human body'), 'appearance overlay must prevent Asa Android retrofit');
assert(profileOverrides.includes('夜明けへ向かうテーマ') && profileOverrides.includes('SUPERSEDED'), 'Asa obsolete Dawn-based name rationale must be explicitly superseded');

// Lorebook data mirrors the Current lane assignment without exact years.
assert(lorebookEra.assignments.length === 5, 'Lorebook Core5 era data must contain five assignments');
assert(new Set(lorebookEra.assignments.map((entry) => entry.id)).size === 5, 'Lorebook Core5 IDs must be unique');
assert(new Set(lorebookEra.assignments.map((entry) => entry.era)).size === 5, 'Lorebook Core5 eras must be unique');
for (const entry of lorebookEra.assignments) {
  assert(expectedAssignments.get(entry.id) === entry.era, `Lorebook era mismatch: ${entry.id}`);
  assert(entry.species === 'HUMAN', `Lorebook Core5 species drift: ${entry.id}`);
  assert(entry.exactYear === null, `Lorebook exact year must remain null: ${entry.id}`);
}
assert(!lorebookEra.runtimeAutoPromotionAllowed, 'Lorebook era data may not auto-promote runtime');

// Endless-night Dream / Waking and provisioning remain intact.
assert(source.yoruNoShirube.layerType === 'DREAM_WORLD', 'Yoru-no-Shirube must remain a Dream world');
assert(!source.yoruNoShirube.finalMechanismFrozen, 'Dream final mechanism must remain Open');
assert(!source.yoruNoShirube.physicalMorningExists, 'physical morning must not exist');
assert(!source.yoruNoShirube.physicalSunriseReturnAllowed, 'sunrise may not become return condition');
assert(source.yoruNoShirube.returnMode === 'WAKING_TO_OWN_REALITY_ERA', 'return must remain Waking to own Reality era');
assert(source.dreamLiving.provisioningMode === 'STORAGE_MEDIATED_DISCOVERY', 'Dream provisioning must remain storage-mediated');
assert(!source.dreamLiving.directHandOrAirFoodMaterializationAllowed, 'food may not directly materialize in hand/open air');
assert(source.dreamLiving.wishCannotOverride.includes('CONSENT'), 'Dream provisioning may not override consent');

// Party / adult-social rules remain intact.
assert(source.socialLife.partyScenarioReservoirCount === 28, 'party reservoir must remain 28');
assert(source.socialLife.alcoholExists && source.socialLife.alcoholIntoxicates, 'alcohol/intoxication must remain available');
assert(source.socialLife.minimumMajorSmokerCount >= 3, 'major smoker direction must remain 3+');
assert(source.socialLife.minimumPipeSmokerCount >= 1, 'pipe smoker direction must remain 1+');
assert(!source.socialLife.smokerFinalAssignmentFrozen, 'smoker person assignment must remain Open pending adult/era review');

// Stars / moon remain era-aware and non-clock.
assert(source.sky.starsVisible, 'stars must remain visible');
assert(!source.sky.constellationSameAcrossErasRequired, 'constellations must not be identical across eras');
assert(!source.sky.finalConstellationChangeCauseFrozen, 'constellation-change cause must remain Open');
assert(source.moon.meaning === 'INCIDENT_DEPTH', 'moon phase must remain incident depth');
assert(!source.moon.elapsedTimeClock, 'moon phase must not become elapsed-time clock');
assert(!source.moon.fixedEraBossRequiredAtSaku, 'Saku may not require a fixed era boss');

// 朔夜座 Current / 朔盟 legacy.
assert(source.sakuyaza.formalName === '朔夜座', 'Story master enemy-group name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'machine enemy-group name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.earlyObserverShortLabel === '八影', '八影 must remain early observer label');
assert(SAKUYAZA_CURRENT_IDENTITY.supersededCandidateName === '朔盟', '朔盟 must remain superseded candidate name');
assert(SAKUMEI_CANDIDATE_IDENTITY.status.includes('SUPERSEDED'), 'legacy 朔盟 candidate must remain superseded');
assert(sakuyazaCurrentSummary.memberCount === 8, '朔夜座 must retain eight member assets');
assert(sakuyazaCurrentSummary.uniqueEnemyIdCount === 8, '朔夜座 enemy IDs must remain unique');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, '朔夜座 visual masters must remain unapproved before Human Review');

// 群青残響録 must remain non-fixed and independent from five Core5 eras.
assert(source.gunjoZankyoroku.formalName === '群青残響録', '群青残響録 name must remain fixed');
assert(!source.gunjoZankyoroku.fixedFaction, '群青残響録 must not become a fixed faction');
assert(!source.gunjoZankyoroku.fixedCount, '群青残響録 must not become fixed-count');
assert(!source.gunjoZankyoroku.onePerEra, 'Core5 five eras must not create one 群青残響録 member per era');
assert(!source.gunjoZankyoroku.mandatoryCombatBoss, '群青残響録 members must not become mandatory combat bosses');
assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('whether each major incident needs a combat boss'), 'combat boss requirement must remain Open');

// Conflict register and Stage20 invariants.
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

// Android / animals / ending boundaries.
assert(source.futureAndroid.asaIsHumanFromThisEra, 'Future Asa must remain Human');
assert(!source.futureAndroid.asaPoliticalSideFrozen, 'Future Asa political side must remain Open');
assert(!source.futureAndroid.asaIncidentRoleFrozen, 'Future Asa incident role must remain Open');
assert(!source.futureAndroid.humanizationIsGoal, 'Android growth may not become becoming human');
assert(source.futureAndroid.rejectedFinalNames.includes('シオン'), 'rejected Android name シオン must stay rejected');
assert(source.futureAndroid.rejectedFinalNames.includes('イヴ・ノイン'), 'rejected Android name イヴ・ノイン must stay rejected');
assert(source.animals.realityDogsCatsMayEnterDream, 'Reality dogs/cats must remain eligible for Dream');
assert(!source.animals.realityAnimalsAreStarBeasts, 'Reality animals must remain distinct from Star Beasts');
assert(source.ending.canonicalHappyEnd, 'canonical Happy End must remain true');
assert(!source.ending.permanentDeathPrimaryTearDevice, 'permanent death must not become primary tear device');

assert(storyWorldMasterSummary.core5AssignedEraCount === 5, 'Story master summary must report five Core5 assignments');
assert(storyWorldMasterSummary.core5UniqueAssignedEraCount === 5, 'Story master summary must report five unique Core5 eras');
assert(storyWorldMasterSummary.unresolvedHardContradictionCount === 0, 'Story / World master must report zero hard contradictions');
assert(!storyWorldMasterSummary.runtimeAutoPromotionAllowed, 'Story / World master may not auto-promote runtime');

console.log(
  `story/world master OK: ${worldSettingExpansionSummary.total} areas / Core5 5 assigned eras / exact years Open / 朔夜座 ${sakuyazaCurrentSummary.memberCount} / Stage ${stageWorldLoreSummary.integrationStageCount} / physical morning 0 / fixed era boss false`,
);
