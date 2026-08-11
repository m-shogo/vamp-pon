import fs from 'node:fs';
import { worldSettingExpansionEntries, worldSettingExpansionSummary } from '../../src/game/data/worldSettingExpansionIndex.ts';
import { worldSettingConflictEntries, worldSettingConflictSummary } from '../../src/game/data/worldSettingConflictRegister.ts';
import {
  SAKUYAZA_CURRENT_IDENTITY,
  SAKUMEI_CANDIDATE_IDENTITY,
  sakuyazaCurrentSummary,
} from '../../src/game/data/sakumeiCandidateSource.ts';
import { stageWorldLoreEntries, stageWorldLoreSummary } from '../../src/game/data/stageWorldLoreIntegration.ts';
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

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
const master = read('docs/00-current-story-world-master.md');
const world = read('docs/WORLD.md');
const story = read('docs/STORY.md');
const feast = read('docs/dream-feast-party-social-bible-v1.md');
const lineup = read('docs/character-height-age-era-lineup-v1.md');
const conflicts = read('docs/world-setting-conflict-register-v1.md');
const source = STORY_WORLD_MASTER_SOURCE;

// P0-P2 coverage remains intact.
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

// Highest Story / World source.
assert(source.authority === 'CURRENT_HIGHEST_STORY_WORLD_AUTHORITY', 'unexpected Story / World authority');
assert(source.reality.world === 'REAL_JAPAN', 'Reality must remain real Japan');
assert(!source.era.sameEraRequired, 'Dream participants must not be forced into one Reality era');
assert(!source.era.laneCountFrozen, 'era lane count must remain extensible');
assert(!source.era.exactYearsFrozen, 'exact years must remain open');
assert(source.era.explicitTimeTagsWeakInDream, 'explicit time tags must remain weak in Dream');

// Core5 = five distinct Reality eras; exact mapping stays open.
assert(source.era.core5DistinctRealityEraRequired, 'Core5 must remain five distinct Reality eras');
assert(source.era.core5DistinctEraCount === 5, `Core5 distinct era count must stay 5, got ${source.era.core5DistinctEraCount}`);
assert(source.era.core5CharacterIds.length === 5, 'Core5 machine source must contain five IDs');
assert(new Set(source.era.core5CharacterIds).size === 5, 'Core5 machine IDs must be unique');
assert(!source.era.exactCore5EraAssignmentFrozen, 'exact Core5 person-to-era mapping must remain open');
assert(source.era.fiveDistinctErasDoNotImplyFiveEqualProtagonists, 'five eras must not force equal protagonist status');
assert(CORE5_DISTINCT_ERA_CHARACTER_IDS.length === 5, 'derived social source must keep five Core5 IDs');
assert(new Set(CORE5_DISTINCT_ERA_CHARACTER_IDS).size === 5, 'derived Core5 IDs must be unique');
assert(DREAM_SOCIAL_WORLD_RULES.core5DistinctRealityEraRequired, 'derived social source must preserve Core5 distinct eras');
assert(DREAM_SOCIAL_WORLD_RULES.core5DistinctEraCount === 5, 'derived social source must preserve Core5 era count 5');
assert(!DREAM_SOCIAL_WORLD_RULES.exactCore5EraAssignmentLocked, 'derived social source may not freeze exact Core5 mapping');

// Endless-night Dream / Waking.
assert(source.yoruNoShirube.layerType === 'DREAM_WORLD', 'Yoru-no-Shirube must remain a Dream world');
assert(!source.yoruNoShirube.finalMechanismFrozen, 'Dream final mechanism must remain open');
assert(!source.yoruNoShirube.physicalMorningExists, 'physical morning must not exist');
assert(!source.yoruNoShirube.physicalSunriseReturnAllowed, 'sunrise may not become the return condition');
assert(source.yoruNoShirube.returnMode === 'WAKING_TO_OWN_REALITY_ERA', 'return must remain Waking to own Reality era');
assert(source.yoruNoShirube.normalWakingExplicitMemoryLoss, 'normal Waking explicit-memory loss must remain');
assert(source.yoruNoShirube.normalWakingImplicitLearningCanRemain, 'implicit learning must be allowed to remain');
assert(source.yoruNoShirube.resolutionWakingMemoryRecoveryDirection, 'resolution memory-recovery direction must remain');

// Dream provisioning = discover through storage, never direct hand/open-air food spawn.
assert(!source.dreamLiving.survivalSim, 'Dream must not become a survival simulation');
assert(!source.dreamLiving.normalEconomyRequired, 'Dream basic living must not require normal economy');
assert(source.dreamLiving.provisioningMode === 'STORAGE_MEDIATED_DISCOVERY', 'Dream provisioning must remain storage-mediated');
assert(!source.dreamLiving.directHandOrAirFoodMaterializationAllowed, 'food may not directly materialize in hand/open air');
for (const item of ['FOOD', 'DRINK', 'DAILY_GOODS', 'REST', 'BASIC_LIVING_ITEMS'] as const) {
  assert(source.dreamLiving.easyProvisioning.includes(item), `missing Dream provisioning domain: ${item}`);
}
for (const item of ['CONSENT', 'MEMORY_TRUTH', 'BLACK_YOUKA', 'REALITY_INCIDENT', 'LIFE_DEATH', 'AUTHENTIC_CHOICE', 'UNIQUE_OBJECT', 'INCIDENT_EVIDENCE'] as const) {
  assert(source.dreamLiving.wishCannotOverride.includes(item), `Dream wish must not override: ${item}`);
}
assert(DREAM_SOCIAL_WORLD_RULES.provisioningMode === 'STORAGE_MEDIATED_DISCOVERY', 'derived provisioning mode drifted');
assert(!DREAM_SOCIAL_WORLD_RULES.directHandOrAirFoodMaterializationAllowed, 'derived source may not allow direct food spawn');
assert(!DREAM_SOCIAL_WORLD_RULES.provisioningCanSolveConsent, 'Dream provisioning may not solve consent');
assert(!DREAM_SOCIAL_WORLD_RULES.provisioningCanRevealMemoryTruth, 'Dream provisioning may not reveal memory truth');
assert(!DREAM_SOCIAL_WORLD_RULES.provisioningCanCreateUniqueEvidence, 'Dream provisioning may not create unique evidence');

// Party / alcohol / smoking / generic products.
assert(source.socialLife.partyAfterNamedBossOrMajorConfrontation, 'post-boss Party direction must remain enabled');
assert(source.socialLife.partyToneMustVary, 'post-boss Party tone must vary');
assert(source.socialLife.partyScenarioReservoirCount === 28, 'party reservoir must remain 28');
assert(source.socialLife.alcoholExists, 'alcohol must exist');
assert(source.socialLife.alcoholIntoxicates, 'alcohol must intoxicate');
assert(source.socialLife.alcoholFinalSceneAdultConfirmationRequired, 'final drinking scenes must require adult confirmation');
assert(!source.socialLife.intoxicationOverridesConsent, 'intoxication may not override consent');
assert(source.socialLife.minimumMajorSmokerCount >= 3, 'major smoker count must remain 3+');
assert(source.socialLife.minimumPipeSmokerCount >= 1, 'pipe smoker count must remain 1+');
assert(!source.socialLife.smokerFinalAssignmentFrozen, 'final smoker assignment must stay open pending age/era review');
assert(source.socialLife.preferGenericCommercialProductNames, 'generic product names must remain preferred');
assert(DREAM_SOCIAL_WORLD_RULES.partyScenarioReservoirCount === 28, 'derived party reservoir must remain 28');
assert(DREAM_SOCIAL_WORLD_RULES.alcoholExists && DREAM_SOCIAL_WORLD_RULES.alcoholIntoxicates, 'derived source must preserve alcohol/intoxication');
assert(DREAM_SOCIAL_WORLD_RULES.minimumMajorSmokerCount >= 3, 'derived source must preserve 3+ smokers');
assert(DREAM_SOCIAL_WORLD_RULES.minimumPipeSmokerCount >= 1, 'derived source must preserve 1+ pipe smoker');
assert(DREAM_SOCIAL_WORLD_SUMMARY.candidateSmokerCount === 3, 'initial smoker candidate set must remain three');
assert(DREAM_SOCIAL_WORLD_SUMMARY.candidatePipeSmokerCount === 1, 'initial pipe candidate set must remain one');
assert(DREAM_SOCIAL_WORLD_RULES.exampleGenericDrinkLabels.includes('黒い炭酸'), 'generic black-carbonation label must remain');
assert(DREAM_SOCIAL_WORLD_RULES.exampleGenericDrinkLabels.includes('柑橘のシュワシュワ'), 'generic fizzy-citrus label must remain');

// Stars / constellation mystery / moon depth.
assert(source.sky.starsVisible, 'stars must remain visible');
assert(!source.sky.constellationSameAcrossErasRequired, 'constellations must not be forced identical across eras');
assert(source.sky.lostOldConstellationsAllowed, 'old constellations may disappear');
assert(source.sky.newlyCreatedLaterConstellationsAllowed, 'later constellations may appear');
assert(!source.sky.finalConstellationChangeCauseFrozen, 'final constellation-change cause must remain open');
assert(source.moon.meaning === 'INCIDENT_DEPTH', 'moon phase must remain incident depth');
assert(!source.moon.elapsedTimeClock, 'moon phase must not become elapsed-time clock');
assert(!source.moon.fixedFiveStageProgression, 'moon phase progression must not become rigid five-step chronology');
assert(!source.moon.fixedEraBossRequiredAtSaku, 'Saku must not require a fixed era boss');

// 朔夜座 Current / 朔盟 legacy.
assert(source.sakuyaza.formalName === '朔夜座', 'Story master formal enemy-group name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'machine formal enemy-group name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.earlyObserverShortLabel === '八影', '八影 must remain early observer label');
assert(SAKUYAZA_CURRENT_IDENTITY.supersededCandidateName === '朔盟', '朔盟 must remain superseded candidate name');
assert(SAKUMEI_CANDIDATE_IDENTITY.status.includes('SUPERSEDED'), 'legacy 朔盟 candidate must remain superseded');
assert(SAKUMEI_CANDIDATE_IDENTITY.supersededBy === '朔夜座', 'legacy 朔盟 must route to 朔夜座');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedAbsoluteLeaderRequired, '朔夜座 must not require an absolute leader');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedHierarchyWithGunjoZankyoroKu, '朔夜座 / 群青残響録 hierarchy must remain unfixed');
assert(sakuyazaCurrentSummary.memberCount === 8, `expected 8 朔夜座 assets, got ${sakuyazaCurrentSummary.memberCount}`);
assert(sakuyazaCurrentSummary.uniqueEnemyIdCount === 8, '朔夜座 enemy IDs must remain unique');
assert(sakuyazaCurrentSummary.uniqueCallNameCount === 8, '朔夜座 call names must remain unique');
assert(sakuyazaCurrentSummary.uniqueAttachmentLaneCount === 8, '朔夜座 fan lanes must remain distinct');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, '朔夜座 final masters must remain unapproved before visual review');

// 群青残響録 is a retrospective incident-central record taxonomy, never a fixed boss roster.
const gunjo = source.gunjoZankyoroku;
assert(gunjo.formalName === '群青残響録', '群青残響録 name must remain fixed');
assert(!gunjo.fixedFaction, '群青残響録 must not become a fixed faction');
assert(!gunjo.fixedCount, '群青残響録 must not have fixed count');
assert(!gunjo.onePerEra, '群青残響録 must not become one person per era');
assert(!gunjo.mandatoryVillain, '群青残響録 members must not all be villains');
assert(!gunjo.mandatoryCombatBoss, '群青残響録 members must not be mandatory combat bosses');
assert(!gunjo.fixedHierarchyWithSakuyaza, '群青残響録 / 朔夜座 hierarchy must remain unfixed');
assert(!gunjo.formalMembersFrozen, '群青残響録 formal members must remain open');
assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('whether each major incident needs a combat boss'), 'combat-boss requirement must remain open');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('one fixed era boss per era'), 'fixed one-boss-per-era model must remain superseded');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('Core5 all come from the same Reality era'), 'same-era Core5 model must remain superseded');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('food directly materializes in hand or open air'), 'direct food-spawn model must remain superseded');

// Android / animals / ending.
assert(!source.futureAndroid.humanizationIsGoal, 'Android growth must not be becoming human');
assert(source.futureAndroid.rejectedFinalNames.includes('シオン'), 'rejected Android name シオン must stay rejected');
assert(source.futureAndroid.rejectedFinalNames.includes('イヴ・ノイン'), 'rejected Android name イヴ・ノイン must stay rejected');
assert(!source.futureAndroid.greekLettersAsPersonalNames, 'Greek version labels must not become personal names');
assert(!source.futureAndroid.starBeastProvesSoul, 'Star Beasts must not become Android soul proof');
assert(source.animals.realityDogsCatsMayEnterDream, 'Reality dogs/cats must remain eligible for Dream participation');
assert(!source.animals.realityAnimalsAreStarBeasts, 'Reality animals must remain distinct from Star Beasts');
assert(source.ending.canonicalHappyEnd, 'canonical Happy End must remain true');
assert(!source.ending.permanentDeathPrimaryTearDevice, 'permanent death must not become primary tear device');
assert(storyWorldMasterSummary.unresolvedHardContradictionCount === 0, 'Story / World master must report zero hard contradictions');
assert(!storyWorldMasterSummary.runtimeAutoPromotionAllowed, 'Story / World master must not auto-promote runtime');

// Conflict control remains blocker-free.
assert(worldSettingConflictSummary.total === 24, `expected 24 conflict lanes, got ${worldSettingConflictSummary.total}`);
assert(worldSettingConflictSummary.guarded === 18, `expected 18 guarded lanes, got ${worldSettingConflictSummary.guarded}`);
assert(worldSettingConflictSummary.openHuman === 5, `expected 5 human-open lanes, got ${worldSettingConflictSummary.openHuman}`);
assert(worldSettingConflictSummary.candidateDependent === 1, `expected 1 candidate-dependent lane, got ${worldSettingConflictSummary.candidateDependent}`);
assert(worldSettingConflictSummary.unresolvedBlocker === 0, `unresolved blocker count must be 0, got ${worldSettingConflictSummary.unresolvedBlocker}`);
assert(new Set(worldSettingConflictEntries.map((entry) => entry.id)).size === worldSettingConflictEntries.length, 'conflict IDs must be unique');

// Human-readable master must expose the explicit decisions.
for (const needle of [
  '夢世界',
  '朝が来ない',
  'Core5 distinct era count = 5 / 5',
  '目の前 / 手元へ突然生成しない',
  'Boss後Party',
  '酒は存在し、飲めば酔う',
  '最低3人以上',
  'パイプ喫煙者を最低1人',
  '朔夜座',
  '群青残響録',
  '「世代ラスボス」という固定slotへ入れない',
]) {
  assert(master.includes(needle), `master missing user-decided wording: ${needle}`);
}
assert(lineup.includes('Core5 distinct era count = 5 / 5'), 'lineup must preserve Core5 5/5 distinct-era rule');
assert(lineup.includes('5人が全部違うことは決定。誰がどこかはOpen'), 'lineup must keep exact person-to-era mapping open');
assert(feast.includes('食べ物は手元へ出現しない'), 'Feast Bible must reject direct food spawn');
assert(feast.includes('最初からそこに入っていた'), 'Feast Bible must preserve storage-mediated discovery');
assert(feast.includes('飲めば酔う'), 'Feast Bible must preserve intoxication');
assert(feast.includes('最低3人以上') && feast.includes('パイプ喫煙者を最低1人'), 'Feast Bible must preserve 3+ smokers and 1+ pipe');
assert(feast.includes('黒い炭酸') && feast.includes('柑橘のシュワシュワ'), 'Feast Bible must preserve generic fizzy-drink vocabulary');
for (let i = 1; i <= 28; i += 1) {
  const id = `P${String(i).padStart(2, '0')}`;
  assert(feast.includes(`## ${id}`), `missing Dream Party scenario ${id}`);
}
assert(world.includes('朔夜座') && world.includes('群青残響録'), 'World Hub must route current enemy / incident taxonomy');
assert(story.includes('Core5') && story.includes('別era'), 'Story Hub must preserve distinct Core5 eras');
assert(conflicts.includes('UNRESOLVED_BLOCKER   = 0'), 'conflict register must report zero blockers');

// Stage lore remains 20/20 and explicitly contains no physical morning.
assert(stageWorldLoreSummary.productionStageCount === 20, `expected Stage Production 20, got ${stageWorldLoreSummary.productionStageCount}`);
assert(stageWorldLoreSummary.integrationStageCount === 20, `expected Stage lore 20, got ${stageWorldLoreSummary.integrationStageCount}`);
assert(stageWorldLoreSummary.uniqueIntegrationStageCount === 20, 'Stage lore IDs must be unique');
assert(stageWorldLoreSummary.missingProductionStageIds.length === 0, `missing Stage lore coverage: ${stageWorldLoreSummary.missingProductionStageIds.join(', ')}`);
assert(stageWorldLoreSummary.orphanIntegrationStageIds.length === 0, `orphan Stage lore entries: ${stageWorldLoreSummary.orphanIntegrationStageIds.join(', ')}`);
assert(stageWorldLoreSummary.physicalMorningStageCount === 0, 'Stage lore must contain zero physical-morning stages');
assert(!stageWorldLoreSummary.runtimeAutoPromotionAllowed, 'Stage lore may not auto-promote runtime');
for (const entry of stageWorldLoreEntries) {
  assert(entry.knowledgeBeat.length >= 20, `Stage knowledge beat too thin: ${entry.stageId}`);
  assert(entry.ordinaryDetail.length >= 15, `Stage ordinary detail too thin: ${entry.stageId}`);
  assert(entry.forbiddenImplication.length >= 20, `Stage forbidden implication too thin: ${entry.stageId}`);
  assert(!entry.runtimeAutoPromotionAllowed, `Stage lore may not auto-promote runtime: ${entry.stageId}`);
}

console.log(`story/world master OK: ${worldSettingExpansionSummary.total} areas / ${worldSettingConflictSummary.total} conflicts / Core5 5 distinct eras / 28 party scenarios / smokers ${source.socialLife.minimumMajorSmokerCount}+ / pipe ${source.socialLife.minimumPipeSmokerCount}+ / 朔夜座 ${sakuyazaCurrentSummary.memberCount} assets / Stage lore ${stageWorldLoreSummary.integrationStageCount} / physical morning 0 / fixed era boss false`);
