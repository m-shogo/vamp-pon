import fs from 'node:fs';
import { worldSettingExpansionEntries, worldSettingExpansionSummary } from '../../src/game/data/worldSettingExpansionIndex.ts';
import { worldSettingConflictEntries, worldSettingConflictSummary } from '../../src/game/data/worldSettingConflictRegister.ts';
import {
  SAKUYAZA_CURRENT_IDENTITY,
  SAKUMEI_CANDIDATE_IDENTITY,
  sakumeiCandidateMembers,
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
const canon = read('docs/CANON.md');
const world = read('docs/WORLD.md');
const story = read('docs/STORY.md');
const foundation = read('docs/world-foundation-authority-v1.md');
const conflicts = read('docs/world-setting-conflict-register-v1.md');
const lifeDeath = read('docs/world-life-death-injury-rulebook-v1.md');
const feast = read('docs/dream-feast-party-social-bible-v1.md');
const lineup = read('docs/character-height-age-era-lineup-v1.md');
const sakuyaza = read('docs/sakuyaza-current-identity-v1.md');
const gunjo = read('docs/gunjo-zankyoroku-current-v1.md');
const mystery = read('docs/world-mystery-foreshadow-payoff-ledger-v1.md');
const knowledge = read('docs/world-knowledge-secret-matrix-v1.md');
const stageLoreDoc = read('docs/stage-world-lore-integration-v1.md');

// 32-area expansion foundation remains intact.
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

const source = STORY_WORLD_MASTER_SOURCE;
assert(source.authority === 'CURRENT_HIGHEST_STORY_WORLD_AUTHORITY', 'unexpected Story / World authority');
assert(source.reality.world === 'REAL_JAPAN', 'Reality must remain real Japan');
assert(source.era.sameEraRequired === false, 'Dream participants must not be forced into one era');
assert(source.era.laneCountFrozen === false, 'era lane count must remain extensible');
assert(source.era.exactYearsFrozen === false, 'exact years must remain open');
assert(source.era.explicitTimeTagsWeakInDream, 'explicit time tags must remain weak in Dream');

// Core5: all five distinct Reality eras, exact mapping remains open.
assert(source.era.core5DistinctRealityEraRequired, 'Core5 must remain five distinct Reality eras');
assert(source.era.core5DistinctEraCount === 5, `Core5 distinct era count must stay 5, got ${source.era.core5DistinctEraCount}`);
assert(source.era.core5CharacterIds.length === 5, 'Core5 machine source must contain exactly five IDs');
assert(new Set(source.era.core5CharacterIds).size === 5, 'Core5 machine source IDs must be unique');
assert(!source.era.exactCore5EraAssignmentFrozen, 'exact Core5 person-to-era assignment must remain open');
assert(source.era.fiveDistinctErasDoNotImplyFiveEqualProtagonists, 'Era count must not force equal narrative role');
assert(CORE5_DISTINCT_ERA_CHARACTER_IDS.length === 5, 'Dream social source must preserve Core5 count 5');
assert(new Set(CORE5_DISTINCT_ERA_CHARACTER_IDS).size === 5, 'Dream social Core5 IDs must be unique');
assert(DREAM_SOCIAL_WORLD_RULES.core5DistinctRealityEraRequired, 'Dream social source must preserve distinct Core5 eras');
assert(DREAM_SOCIAL_WORLD_RULES.core5DistinctEraCount === 5, 'Dream social source must preserve Core5 era count 5');
assert(!DREAM_SOCIAL_WORLD_RULES.exactCore5EraAssignmentLocked, 'Dream social source may not freeze exact Core5 mapping');

// Endless-night Dream / Waking.
assert(source.yoruNoShirube.layerType === 'DREAM_WORLD', 'Yoru-no-Shirube must remain a Dream world');
assert(!source.yoruNoShirube.finalMechanismFrozen, 'Dream final mechanism must remain open');
assert(!source.yoruNoShirube.physicalMorningExists, 'physical morning must not exist inside Yoru-no-Shirube');
assert(!source.yoruNoShirube.physicalSunriseReturnAllowed, 'sunrise must not become the return condition');
assert(source.yoruNoShirube.returnMode === 'WAKING_TO_OWN_REALITY_ERA', 'return must remain Waking to own Reality era');
assert(source.yoruNoShirube.normalWakingExplicitMemoryLoss, 'normal Waking explicit-memory loss direction must remain');
assert(source.yoruNoShirube.normalWakingImplicitLearningCanRemain, 'implicit learning must be allowed to remain');
assert(source.yoruNoShirube.resolutionWakingMemoryRecoveryDirection, 'resolution Waking memory-recovery direction must remain');

// Storage-mediated provisioning, not hand/open-air spawn.
assert(!source.dreamLiving.survivalSim, 'Dream must not become a survival simulation');
assert(!source.dreamLiving.normalEconomyRequired, 'Dream basic living must not require normal economy');
assert(source.dreamLiving.provisioningMode === 'STORAGE_MEDIATED_DISCOVERY', 'Dream provisioning must remain storage-mediated');
assert(!source.dreamLiving.directHandOrAirFoodMaterializationAllowed, 'food may not directly materialize in hand/open air');
for (const item of ['FOOD', 'DRINK', 'DAILY_GOODS', 'REST', 'BASIC_LIVING_ITEMS'] as const) {
  assert(source.dreamLiving.easyProvisioning.includes(item), `missing easy Dream provisioning domain: ${item}`);
}
for (const item of ['CONSENT', 'MEMORY_TRUTH', 'BLACK_YOUKA', 'REALITY_INCIDENT', 'LIFE_DEATH', 'AUTHENTIC_CHOICE', 'UNIQUE_OBJECT', 'INCIDENT_EVIDENCE'] as const) {
  assert(source.dreamLiving.wishCannotOverride.includes(item), `Dream wish must not override: ${item}`);
}
assert(DREAM_SOCIAL_WORLD_RULES.provisioningMode === 'STORAGE_MEDIATED_DISCOVERY', 'Dream social provisioning mode drifted');
assert(!DREAM_SOCIAL_WORLD_RULES.directHandOrAirFoodMaterializationAllowed, 'Dream social source may not allow direct food spawn');
assert(!DREAM_SOCIAL_WORLD_RULES.provisioningCanSolveConsent, 'Dream provisioning may not solve consent');
assert(!DREAM_SOCIAL_WORLD_RULES.provisioningCanRevealMemoryTruth, 'Dream provisioning may not reveal memory truth');
assert(!DREAM_SOCIAL_WORLD_RULES.provisioningCanCreateUniqueEvidence, 'Dream provisioning may not create unique evidence');

// Boss parties / alcohol / tobacco / generic product naming.
assert(source.socialLife.partyAfterNamedBossOrMajorConfrontation, 'post-boss party/decompression direction must remain enabled');
assert(source.socialLife.partyToneMustVary, 'party tone must vary');
assert(source.socialLife.partyScenarioReservoirCount === 28, 'party scenario reservoir must remain 28');
assert(source.socialLife.alcoholExists, 'alcohol must exist in Dream social life');
assert(source.socialLife.alcoholIntoxicates, 'alcohol must intoxicate');
assert(source.socialLife.alcoholFinalSceneAdultConfirmationRequired, 'final alcohol scenes must require adult confirmation');
assert(!source.socialLife.intoxicationOverridesConsent, 'intoxication may not override consent');
assert(source.socialLife.minimumMajorSmokerCount >= 3, 'minimum major smoker count must remain at least 3');
assert(source.socialLife.minimumPipeSmokerCount >= 1, 'minimum pipe smoker count must remain at least 1');
assert(!source.socialLife.smokerFinalAssignmentFrozen, 'final smoker assignment must remain open before age/era review');
assert(source.socialLife.preferGenericCommercialProductNames, 'generic commercial naming must remain preferred');
assert(DREAM_SOCIAL_WORLD_RULES.partyAfterNamedBossOrMajorConfrontation, 'derived social source must preserve post-boss Party');
assert(DREAM_SOCIAL_WORLD_RULES.partyScenarioReservoirCount === 28, 'derived social source must preserve 28 party scenarios');
assert(DREAM_SOCIAL_WORLD_RULES.alcoholExists && DREAM_SOCIAL_WORLD_RULES.alcoholIntoxicates, 'derived social source must preserve alcohol/intoxication');
assert(DREAM_SOCIAL_WORLD_RULES.minimumMajorSmokerCount >= 3, 'derived social source must preserve 3+ smokers');
assert(DREAM_SOCIAL_WORLD_RULES.minimumPipeSmokerCount >= 1, 'derived social source must preserve 1+ pipe smoker');
assert(DREAM_SOCIAL_WORLD_SUMMARY.candidateSmokerCount === 3, 'initial smoker candidate set must remain 3');
assert(DREAM_SOCIAL_WORLD_SUMMARY.candidatePipeSmokerCount === 1, 'initial pipe candidate set must remain 1');
assert(DREAM_SOCIAL_WORLD_RULES.exampleGenericDrinkLabels.includes('黒い炭酸'), 'generic black carbonation label must remain');
assert(DREAM_SOCIAL_WORLD_RULES.exampleGenericDrinkLabels.includes('柑橘のシュワシュワ'), 'generic citrus fizzy label must remain');

// Sky / moon.
assert(source.sky.starsVisible, 'stars must remain visible');
assert(!source.sky.constellationSameAcrossErasRequired, 'Dream constellations must not be identical across all eras');
assert(source.sky.lostOldConstellationsAllowed, 'old constellations must be allowed to disappear');
assert(source.sky.newlyCreatedLaterConstellationsAllowed, 'later constellations must be allowed to appear');
assert(!source.sky.finalConstellationChangeCauseFrozen, 'constellation-change cause must remain open');
assert(source.moon.meaning === 'INCIDENT_DEPTH', 'moon phase must remain incident depth');
assert(!source.moon.elapsedTimeClock, 'moon phase must not become elapsed-time clock');
assert(!source.moon.fixedFiveStageProgression, 'moon progression must not become a rigid five-step timeline');
assert(!source.moon.fixedEraBossRequiredAtSaku, 'Saku must not require a fixed era boss');

// 朔夜座 Current identity.
assert(source.sakuyaza.formalName === '朔夜座', 'Story master formal enemy-group name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'machine enemy-group formal name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.earlyObserverShortLabel === '八影', '八影 must remain early observer label');
assert(SAKUYAZA_CURRENT_IDENTITY.supersededCandidateName === '朔盟', '朔盟 must remain superseded candidate name');
assert(SAKUMEI_CANDIDATE_IDENTITY.status.includes('SUPERSEDED'), 'legacy 朔盟 candidate must be superseded');
assert(SAKUMEI_CANDIDATE_IDENTITY.supersededBy === '朔夜座', 'legacy 朔盟 candidate must route to 朔夜座');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedAbsoluteLeaderRequired, '朔夜座 must not require absolute leader');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedHierarchyWithGunjoZankyoroKu, '朔夜座 / 群青残響録 hierarchy must remain unfixed');
assert(sakuyazaCurrentSummary.memberCount === 8, `expected 8 朔夜座 assets, got ${sakuyazaCurrentSummary.memberCount}`);
assert(sakuyazaCurrentSummary.uniqueEnemyIdCount === 8, '朔夜座 enemy IDs must remain unique');
assert(sakuyazaCurrentSummary.uniqueCallNameCount === 8, '朔夜座 call names must remain unique');
assert(sakuyazaCurrentSummary.uniqueAttachmentLaneCount === 8, '朔夜座 fan lanes must remain distinct');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, '朔夜座 final masters must remain unapproved before visual review');
for (const member of sakumeiCandidateMembers) {
  assert(!member.finalMasterApproved, `朔夜座 final master unexpectedly approved: ${member.callName}`);
  assert(!member.runtimeAutoPromotionAllowed, `朔夜座 runtime auto-promotion forbidden: ${member.callName}`);
}

// 群青残響録 is NOT a fixed generation-boss roster.
const gunjoSource = source.gunjoZankyoroku;
assert(gunjoSource.formalName === '群青残響録', '群青残響録 name must remain fixed');
assert(!gunjoSource.fixedFaction, '群青残響録 must not become a fixed faction');
assert(!gunjoSource.fixedCount, '群青残響録 must not have fixed count');
assert(!gunjoSource.onePerEra, '群青残響録 must not become one person per era');
assert(!gunjoSource.mandatoryVillain, '群青残響録 members must not all be villains');
assert(!gunjoSource.mandatoryCombatBoss, '群青残響録 members must not be mandatory combat bosses');
assert(!gunjoSource.fixedHierarchyWithSakuyaza, '群青残響録 / 朔夜座 hierarchy must remain unfixed');
assert(!gunjoSource.formalMembersFrozen, '群青残響録 formal membership must remain open');
assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('whether each major incident needs a combat boss'), 'combat-boss requirement must remain open');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('one fixed era boss per era'), 'fixed one-boss-per-era model must remain explicitly superseded');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('Core5 all come from the same Reality era'), 'same-era Core5 model must remain explicitly superseded');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('food directly materializes in hand or open air'), 'direct food-spawn model must remain explicitly superseded');

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

// Conflict register remains blocker-free.
assert(worldSettingConflictSummary.total === 24, `expected 24 conflict lanes, got ${worldSettingConflictSummary.total}`);
assert(worldSettingConflictSummary.guarded === 18, `expected 18 guarded conflict lanes, got ${worldSettingConflictSummary.guarded}`);
assert(worldSettingConflictSummary.openHuman === 5, `expected 5 human-open lanes, got ${worldSettingConflictSummary.openHuman}`);
assert(worldSettingConflictSummary.candidateDependent === 1, `expected 1 candidate-dependent lane, got ${worldSettingConflictSummary.candidateDependent}`);
assert(worldSettingConflictSummary.unresolvedBlocker === 0, `unresolved blocker count must be zero, got ${worldSettingConflictSummary.unresolvedBlocker}`);
assert(new Set(worldSettingConflictEntries.map((entry) => entry.id)).size === worldSettingConflictEntries.length, 'conflict IDs must be unique');

// Human-readable authorities carry the explicit user decisions.
for (const needle of ['夢世界', '朝が来ない', 'Core5 distinct era count = 5 / 5', '目の前 / 手元へ突然生成しない', 'Boss後Party', '酒は存在し、飲めば酔う', '最低3人以上', 'パイプ喫煙者を最低1人', '朔夜座', '群青残響録', '「世代ラスボス」という固定slotへ入れない']) {
  assert(master.includes(needle), `master missing user-decided wording: ${needle}`);
}
assert(lineup.includes('Core5 distinct era count = 5 / 5'), 'lineup must preserve Core5 5/5 distinct-era rule');
assert(lineup.includes('5人が全部違うことは決定。誰がどこかはOpen'), 'lineup must separate distinct-era rule from exact mapping');
assert(lineup.includes('exact cmはHuman visual review前にCanon化しない'), 'lineup must keep exact cm unfrozen');
assert(feast.includes('食べ物は手元へ出現しない'), 'Feast Bible must reject direct food spawn');
assert(feast.includes('最初からそこに入っていた'), 'Feast Bible must preserve storage-mediated discovery');
assert(feast.includes('Named Boss / major confrontation'), 'Feast Bible must preserve post-boss Party direction');
assert(feast.includes('飲めば酔う'), 'Feast Bible must preserve intoxication');
assert(feast.includes('最低3人以上') && feast.includes('パイプ喫煙者を最低1人'), 'Feast Bible must preserve 3+ smokers / 1+ pipe');
assert(feast.includes('黒い炭酸') && feast.includes('柑橘のシュワシュワ'), 'Feast Bible must preserve generic fizzy drink vocabulary');
for (let i = 1; i <= 28; i += 1) {
  const id = `P${String(i).padStart(2, '0')}`;
  assert(feast.includes(`## ${id}`), `missing Dream party scenario ${id}`);
}

// Hubs / downstream guards that should not regress.
assert(canon.includes('Dreamに朝が来るcosmologyの証明ではない') || canon.includes('朝の来ない夢世界'), 'Canon must protect no-morning story semantics');
assert(world.includes('朔夜座') && world.includes('群青残響録'), 'World Hub must route current antagonist / incident taxonomy');
assert(story.includes('Core5の5人はRealityで全員が別era / generation') || story.includes('5 different eras'), 'Story Hub must route Core5 distinct-era rule');
assert(foundation.includes('朝の来ない夢世界'), 'Foundation must preserve endless-night Dream premise');
assert(foundation.includes('1時代1人の固定Boss slotを作らない'), 'Foundation must reject fixed generation-boss slot');
assert(lifeDeath.includes('帰還 = 目覚め'), 'Life/Death must use Waking instead of dawn return');
assert(knowledge.includes('CONFIRMED_SYSTEMIC'), 'Knowledge Matrix must retain systemic confirmation vocabulary');
assert(mystery.includes('Aを残すためにCを投げない'), 'Mystery ledger must retain payoff-debt rule');
assert(sakuyaza.includes('朔夜座'), 'Current 朔夜座 identity doc missing');
assert(gunjo.includes('1時代1人') && gunjo.includes('全員戦闘Boss'), '群青残響録 doc must explicitly reject fixed one-per-era combat-boss roster');
assert(conflicts.includes('UNRESOLVED_BLOCKER   = 0'), 'human conflict register must report zero blockers');
assert(conflicts.includes('Core5は5/5で別Reality era'), 'conflict register must guard Core5 distinct-era rule');
assert(conflicts.includes('食糧庫・冷蔵庫・棚・厨房'), 'conflict register must guard storage-mediated provisioning');

// Stage lore remains 20/20, with zero physical-morning stages.
assert(stageWorldLoreSummary.productionStageCount === 20, `expected Stage Production 20, got ${stageWorldLoreSummary.productionStageCount}`);
assert(stageWorldLoreSummary.integrationStageCount === 20, `world lore must cover all 20 stages, got ${stageWorldLoreSummary.integrationStageCount}`);
assert(stageWorldLoreSummary.uniqueIntegrationStageCount === 20, 'Stage world lore IDs must be unique');
assert(stageWorldLoreSummary.missingProductionStageIds.length === 0, `missing Stage lore coverage: ${stageWorldLoreSummary.missingProductionStageIds.join(', ')}`);
assert(stageWorldLoreSummary.orphanIntegrationStageIds.length === 0, `orphan Stage lore entries: ${stageWorldLoreSummary.orphanIntegrationStageIds.join(', ')}`);
assert(stageWorldLoreSummary.physicalMorningStageCount === 0, 'Stage world lore must contain zero physical-morning stages');
assert(!stageWorldLoreSummary.runtimeAutoPromotionAllowed, 'Stage world lore may not auto-promote runtime');
for (const entry of stageWorldLoreEntries) {
  assert(entry.knowledgeBeat.length >= 20, `Stage knowledge beat too thin: ${entry.stageId}`);
  assert(entry.ordinaryDetail.length >= 15, `Stage ordinary detail too thin: ${entry.stageId}`);
  assert(entry.forbiddenImplication.length >= 20, `Stage forbidden implication too thin: ${entry.stageId}`);
  assert(entry.sakumeiRelevance === entry.sakuyazaRelevance, `legacy Sakumei relevance alias drifted: ${entry.stageId}`);
  assert(!entry.runtimeAutoPromotionAllowed, `Stage lore may not auto-promote runtime: ${entry.stageId}`);
}
assert(stageLoreDoc.includes('Stage20 World / Lore Integration'), 'Stage20 World/Lore document must remain routed');

console.log(`story/world master OK: ${worldSettingExpansionSummary.total} areas / ${worldSettingConflictSummary.total} conflicts / Core5 5 distinct eras / 28 party scenarios / smokers ${source.socialLife.minimumMajorSmokerCount}+ / pipe ${source.socialLife.minimumPipeSmokerCount}+ / 朔夜座 ${sakuyazaCurrentSummary.memberCount} assets / Stage lore ${stageWorldLoreSummary.integrationStageCount} / physical morning 0 / fixed era boss false`);
