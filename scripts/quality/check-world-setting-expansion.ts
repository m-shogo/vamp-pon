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

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const read = (path: string) => fs.readFileSync(path, 'utf8');
const master = read('docs/00-current-story-world-master.md');
const canon = read('docs/CANON.md');
const world = read('docs/WORLD.md');
const foundation = read('docs/world-foundation-authority-v1.md');
const conflicts = read('docs/world-setting-conflict-register-v1.md');
const lifeDeath = read('docs/world-life-death-injury-rulebook-v1.md');
const civilian = read('docs/world-civilian-society-bible-v1.md');
const institutions = read('docs/world-institution-faction-map-v1.md');
const geography = read('docs/world-geography-travel-atlas-v1.md');
const knowledge = read('docs/world-knowledge-secret-matrix-v1.md');
const mystery = read('docs/world-mystery-foreshadow-payoff-ledger-v1.md');
const incidents = read('docs/world-historical-incident-ledger-v1.md');
const storyBook = read('docs/story-book-v1.md');
const beatSheet = read('docs/story-main-beat-sheet-v1.md');
const temporal = read('docs/story-temporal-layer-and-character-connections-v1.md');
const ending = read('docs/story-ending-sequel-architecture-v1.md');
const sakuyaza = read('docs/sakuyaza-current-identity-v1.md');
const gunjo = read('docs/gunjo-zankyoroku-current-v1.md');
const migration = read('docs/story-world-master-migration-ledger-v1.md');
const lineup = read('docs/character-height-age-era-lineup-v1.md');

// Existing 32-area world-setting expansion remains intact.
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

// Highest Story / World authority: validate machine source rather than brittle prose formatting.
const source = STORY_WORLD_MASTER_SOURCE;
assert(source.authority === 'CURRENT_HIGHEST_STORY_WORLD_AUTHORITY', 'unexpected Story / World authority');
assert(source.reality.world === 'REAL_JAPAN', 'Reality must remain real Japan');
assert(source.era.sameEraRequired === false, 'Dream participants must not be forced into one era');
assert(source.era.laneCountFrozen === false, 'era lane count must remain extensible');
assert(source.era.exactYearsFrozen === false, 'exact years must remain open');
assert(source.era.explicitTimeTagsWeakInDream, 'explicit time tags must remain weak in Dream');
assert(source.yoruNoShirube.layerType === 'DREAM_WORLD', 'Yoru-no-Shirube must remain a Dream world');
assert(!source.yoruNoShirube.finalMechanismFrozen, 'Dream final mechanism must remain open');
assert(!source.yoruNoShirube.physicalMorningExists, 'physical morning must not exist inside Yoru-no-Shirube');
assert(!source.yoruNoShirube.physicalSunriseReturnAllowed, 'sunrise must not become the return condition');
assert(source.yoruNoShirube.returnMode === 'WAKING_TO_OWN_REALITY_ERA', 'return must remain Waking to own Reality era');
assert(source.yoruNoShirube.normalWakingExplicitMemoryLoss, 'normal Waking explicit-memory loss direction must remain');
assert(source.yoruNoShirube.normalWakingImplicitLearningCanRemain, 'implicit learning must be allowed to remain');
assert(source.yoruNoShirube.resolutionWakingMemoryRecoveryDirection, 'major-resolution memory-recovery direction must remain');
assert(!source.dreamLiving.survivalSim, 'Dream must not become a survival simulation');
assert(!source.dreamLiving.normalEconomyRequired, 'Dream basic living must not require a normal economy');
for (const item of ['FOOD', 'DRINK', 'DAILY_GOODS', 'REST', 'BASIC_LIVING_ITEMS'] as const) {
  assert(source.dreamLiving.easyMaterialization.includes(item), `missing easy Dream materialization domain: ${item}`);
}
for (const item of ['CONSENT', 'MEMORY_TRUTH', 'BLACK_YOUKA', 'REALITY_INCIDENT', 'LIFE_DEATH', 'AUTHENTIC_CHOICE'] as const) {
  assert(source.dreamLiving.wishCannotOverride.includes(item), `Dream wish must not override: ${item}`);
}
assert(source.sky.starsVisible, 'stars must remain visible');
assert(!source.sky.constellationSameAcrossErasRequired, 'Dream constellations must not be identical across all eras');
assert(source.sky.lostOldConstellationsAllowed, 'old constellations must be allowed to disappear');
assert(source.sky.newlyCreatedLaterConstellationsAllowed, 'later constellations must be allowed to appear');
assert(!source.sky.finalConstellationChangeCauseFrozen, 'constellation-change cause must remain open');
assert(source.moon.meaning === 'INCIDENT_DEPTH', 'moon phase must remain incident depth');
assert(!source.moon.elapsedTimeClock, 'moon phase must not become an elapsed-time clock');
assert(!source.moon.fixedFiveStageProgression, 'moon progression must not be fixed to five stages');
assert(!source.moon.fixedEraBossRequiredAtSaku, 'Saku must not require a fixed era boss');

// 朔夜座 current identity; 八影 and 朔盟 remain migration assets only.
assert(source.sakuyaza.formalName === '朔夜座', 'Story master formal enemy-group name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'machine enemy-group formal name must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.earlyObserverShortLabel === '八影', '八影 must remain the early observer label');
assert(SAKUYAZA_CURRENT_IDENTITY.supersededCandidateName === '朔盟', '朔盟 must remain the superseded candidate name');
assert(SAKUMEI_CANDIDATE_IDENTITY.status.includes('SUPERSEDED'), 'legacy 朔盟 candidate must be marked superseded');
assert(SAKUMEI_CANDIDATE_IDENTITY.supersededBy === '朔夜座', 'legacy 朔盟 candidate must route to 朔夜座');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedAbsoluteLeaderRequired, '朔夜座 must not require an absolute leader');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedHierarchyWithGunjoZankyoroKu, '朔夜座 / 群青残響録 hierarchy must remain unfixed');
assert(sakuyazaCurrentSummary.memberCount === 8, `expected eight current 朔夜座 assets, got ${sakuyazaCurrentSummary.memberCount}`);
assert(sakuyazaCurrentSummary.uniqueEnemyIdCount === 8, '朔夜座 enemy IDs must remain unique');
assert(sakuyazaCurrentSummary.uniqueCallNameCount === 8, '朔夜座 call names must remain unique');
assert(sakuyazaCurrentSummary.uniqueAttachmentLaneCount === 8, '朔夜座 fan-attachment lanes must remain distinct');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, '朔夜座 final character masters must remain unapproved');
for (const member of sakumeiCandidateMembers) {
  assert(!member.finalMasterApproved, `朔夜座 final master unexpectedly approved: ${member.callName}`);
  assert(!member.runtimeAutoPromotionAllowed, `朔夜座 runtime auto-promotion forbidden: ${member.callName}`);
}

// 群青残響録 is explicitly not a fixed era-boss roster.
const gunjoSource = source.gunjoZankyoroku;
assert(gunjoSource.formalName === '群青残響録', '群青残響録 name must remain fixed');
assert(!gunjoSource.fixedFaction, '群青残響録 must not become a fixed faction');
assert(!gunjoSource.fixedCount, '群青残響録 must not have a fixed count');
assert(!gunjoSource.onePerEra, '群青残響録 must not become one person per era');
assert(!gunjoSource.mandatoryVillain, '群青残響録 members must not all be villains');
assert(!gunjoSource.mandatoryCombatBoss, '群青残響録 members must not be mandatory combat bosses');
assert(!gunjoSource.fixedHierarchyWithSakuyaza, '群青残響録 / 朔夜座 hierarchy must remain unfixed');
assert(!gunjoSource.formalMembersFrozen, '群青残響録 formal membership must remain open');
assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('whether each major incident needs a combat boss'), 'combat-boss requirement must remain open');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('one fixed era boss per era'), 'fixed one-boss-per-era model must remain explicitly superseded');

// Android / animals / ending guards.
assert(!source.futureAndroid.humanizationIsGoal, 'Android growth must not be becoming human');
assert(source.futureAndroid.rejectedFinalNames.includes('シオン'), 'rejected Android name シオン must stay rejected');
assert(source.futureAndroid.rejectedFinalNames.includes('イヴ・ノイン'), 'rejected Android name イヴ・ノイン must stay rejected');
assert(!source.futureAndroid.greekLettersAsPersonalNames, 'Greek version labels must not become Android personal names');
assert(!source.futureAndroid.starBeastProvesSoul, 'Star Beasts must not become Android soul proof');
assert(source.animals.realityDogsCatsMayEnterDream, 'Reality dogs/cats must remain eligible for Dream participation');
assert(!source.animals.realityAnimalsAreStarBeasts, 'Reality animals must remain distinct from Star Beasts');
assert(source.ending.canonicalHappyEnd, 'canonical Happy End must remain true');
assert(!source.ending.permanentDeathPrimaryTearDevice, 'permanent death must not become the primary tear device');
assert(storyWorldMasterSummary.unresolvedHardContradictionCount === 0, 'Story / World master must report zero hard contradictions');
assert(!storyWorldMasterSummary.runtimeAutoPromotionAllowed, 'Story / World master must not auto-promote runtime');

// Conflict register reflects the migrated authority.
assert(worldSettingConflictSummary.total === 24, `expected 24 conflict lanes, got ${worldSettingConflictSummary.total}`);
assert(worldSettingConflictSummary.guarded === 18, `expected 18 guarded conflict lanes, got ${worldSettingConflictSummary.guarded}`);
assert(worldSettingConflictSummary.openHuman === 5, `expected 5 human-open conflict lanes, got ${worldSettingConflictSummary.openHuman}`);
assert(worldSettingConflictSummary.candidateDependent === 1, `expected 1 candidate-dependent conflict lane, got ${worldSettingConflictSummary.candidateDependent}`);
assert(worldSettingConflictSummary.unresolvedBlocker === 0, `world-setting unresolved blocker count must be zero, got ${worldSettingConflictSummary.unresolvedBlocker}`);
assert(new Set(worldSettingConflictEntries.map((entry) => entry.id)).size === worldSettingConflictEntries.length, 'conflict IDs must be unique');

// Human-readable authorities must expose the critical decisions without depending on exact formatting.
for (const [name, text, needles] of [
  ['master', master, ['夢世界', '朝が来ない', '目覚めて、自分の時代へ戻る', '朔夜座', '群青残響録', '固定slot']],
  ['canon', canon, ['朝の来ない夢世界', 'Waking', '朔夜座', '群青残響録']],
  ['world', world, ['ヨルノシルベは夢世界', '朔夜座', '群青残響録', '固定人数']],
  ['foundation', foundation, ['朝の来ない夢世界', '1時代1人の固定Boss slotを作らない']],
  ['life/death', lifeDeath, ['帰還 = 目覚め', 'Game Over ≠ 現実肉体の死亡', 'Retryは蘇生ではない']],
  ['civilian', civilian, ['生存サバイバル物ではない', '物は作れても、他人の意思は作れない']],
  ['institutions', institutions, ['群青残響録 — Factionではない', '朔夜座']],
  ['geography', geography, ['旧`dawn`接続は使用しない', '朔地点 = 固定時代Boss roomではない']],
  ['knowledge', knowledge, ['CONFIRMED_SYSTEMIC', '朔夜座 formal identity', 'fixed boss roster']],
  ['mystery', mystery, ['Aを残すためにCを投げない', 'Dream final mechanism / origin', 'Why constellations increase / disappear']],
  ['incidents', incidents, ['incident central person / people', 'combat Boss', '群青残響録 admission rule']],
  ['story book', storyBook, ['朝の来ない夢の夜', '固定「世代ラスボス」']],
  ['beat sheet', beatSheet, ['Ending — Waking', '固定「世代ラスボス」']],
  ['temporal', temporal, ['帰還は**朝ではなくWaking**', '1時代1人の固定Bossを作らない']],
  ['ending', ending, ['朝は来ない', 'Waking', '群青残響録memberはfixed final bossesではない']],
  ['sakuyaza', sakuyaza, ['朔夜座', 'superseded redesign candidate']],
  ['gunjo', gunjo, ['1時代1人', '全員戦闘Boss', 'Incident central person', 'Stage combat Boss']],
  ['migration', migration, ['STORY SEMANTIC', 'LEGACY PRODUCT NAME', 'STABLE ID / INTERNAL TOKEN']],
] as const) {
  for (const needle of needles) assert(text.includes(needle), `${name} missing required master-aligned wording: ${needle}`);
}
assert(lineup.includes('Core5を5つのEraへ一人ずつ割り当てるhard ruleではない'), 'lineup must not fix Core5 to one distinct era each');
assert(lineup.includes('exact cmはHuman visual review前にCanon化しない'), 'lineup must keep exact height unfrozen');
assert(conflicts.includes('UNRESOLVED_BLOCKER   = 0'), 'human conflict register must report zero unresolved blockers');

// Stage lore keeps stable IDs while Story semantics contain zero physical-morning stages.
assert(stageWorldLoreSummary.productionStageCount === 20, `expected 20 production stages, got ${stageWorldLoreSummary.productionStageCount}`);
assert(stageWorldLoreSummary.integrationStageCount === 20, `expected 20 integrated stages, got ${stageWorldLoreSummary.integrationStageCount}`);
assert(stageWorldLoreSummary.uniqueIntegrationStageCount === 20, 'Stage lore IDs must be unique');
assert(stageWorldLoreSummary.missingProductionStageIds.length === 0, `missing Stage lore: ${stageWorldLoreSummary.missingProductionStageIds.join(', ')}`);
assert(stageWorldLoreSummary.orphanIntegrationStageIds.length === 0, `orphan Stage lore: ${stageWorldLoreSummary.orphanIntegrationStageIds.join(', ')}`);
assert(stageWorldLoreSummary.physicalMorningStageCount === 0, 'current Stage lore must contain zero physical-morning stages');
assert(!stageWorldLoreSummary.runtimeAutoPromotionAllowed, 'Stage lore must not auto-promote runtime');
for (const entry of stageWorldLoreEntries) {
  assert(entry.sakuyazaRelevance === entry.sakumeiRelevance, `legacy Sakumei relevance alias drifted: ${entry.stageId}`);
  assert(!entry.runtimeAutoPromotionAllowed, `Stage lore runtime auto-promotion forbidden: ${entry.stageId}`);
}

console.log(`story/world master OK: ${worldSettingExpansionSummary.total} areas / ${worldSettingConflictSummary.total} conflicts / 朔夜座 ${sakuyazaCurrentSummary.memberCount} assets / Stage lore ${stageWorldLoreSummary.integrationStageCount} / physical morning 0 / fixed era boss false`);
