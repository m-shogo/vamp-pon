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

const master = fs.readFileSync('docs/00-current-story-world-master.md', 'utf8');
const canon = fs.readFileSync('docs/CANON.md', 'utf8');
const worldHub = fs.readFileSync('docs/WORLD.md', 'utf8');
const foundation = fs.readFileSync('docs/world-foundation-authority-v1.md', 'utf8');
const lifeDeath = fs.readFileSync('docs/world-life-death-injury-rulebook-v1.md', 'utf8');
const knowledge = fs.readFileSync('docs/world-knowledge-secret-matrix-v1.md', 'utf8');
const mystery = fs.readFileSync('docs/world-mystery-foreshadow-payoff-ledger-v1.md', 'utf8');
const lineup = fs.readFileSync('docs/character-height-age-era-lineup-v1.md', 'utf8');
const sakuyazaDoc = fs.readFileSync('docs/sakuyaza-current-identity-v1.md', 'utf8');
const gunjoDoc = fs.readFileSync('docs/gunjo-zankyoroku-current-v1.md', 'utf8');
const sakumeiLegacy = fs.readFileSync('docs/sakumei-antagonist-organization-candidate-v1.md', 'utf8');
const sakumeiDeep = fs.readFileSync('docs/sakumei-member-deep-profile-candidate-v1.md', 'utf8');
const conflicts = fs.readFileSync('docs/world-setting-conflict-register-v1.md', 'utf8');
const stageLoreDoc = fs.readFileSync('docs/stage-world-lore-integration-v1.md', 'utf8');
const storyBook = fs.readFileSync('docs/story-book-v1.md', 'utf8');
const beatSheet = fs.readFileSync('docs/story-main-beat-sheet-v1.md', 'utf8');
const temporal = fs.readFileSync('docs/story-temporal-layer-and-character-connections-v1.md', 'utf8');
const civilian = fs.readFileSync('docs/world-civilian-society-bible-v1.md', 'utf8');
const institutions = fs.readFileSync('docs/world-institution-faction-map-v1.md', 'utf8');
const geography = fs.readFileSync('docs/world-geography-travel-atlas-v1.md', 'utf8');
const incidents = fs.readFileSync('docs/world-historical-incident-ledger-v1.md', 'utf8');

// 32-area expansion remains intact.
assert(worldSettingExpansionSummary.total === 32, `world setting expansion must keep 32 requested areas, got ${worldSettingExpansionSummary.total}`);
assert(worldSettingExpansionSummary.p0 === 9, `expected 9 P0 areas, got ${worldSettingExpansionSummary.p0}`);
assert(worldSettingExpansionSummary.p1 === 18, `expected 18 P1 areas, got ${worldSettingExpansionSummary.p1}`);
assert(worldSettingExpansionSummary.p2 === 5, `expected 5 P2 areas, got ${worldSettingExpansionSummary.p2}`);
assert(!worldSettingExpansionSummary.runtimeAutoPromotionAllowed, 'world setting expansion may not auto-promote runtime');

const expansionIds = worldSettingExpansionEntries.map((item) => item.id);
assert(new Set(expansionIds).size === expansionIds.length, 'world setting expansion IDs must be unique');
for (const item of worldSettingExpansionEntries) {
  assert(item.authority === 'WORLD_SETTING_EXPANSION_SOURCE', `unexpected authority for ${item.id}`);
  assert(!item.runtimeAutoPromotionAllowed, `runtime auto promotion forbidden: ${item.id}`);
  assert(item.primarySource.startsWith('docs/'), `primary source must be a docs path: ${item.id}`);
  assert(fs.existsSync(item.primarySource), `missing primary source ${item.primarySource} for ${item.id}`);
}

// Machine-readable highest Story / World authority.
assert(STORY_WORLD_MASTER_SOURCE.authority === 'CURRENT_HIGHEST_STORY_WORLD_AUTHORITY', 'story-world master authority changed unexpectedly');
assert(STORY_WORLD_MASTER_SOURCE.reality.world === 'REAL_JAPAN', 'Reality must remain real Japan');
assert(STORY_WORLD_MASTER_SOURCE.yoruNoShirube.layerType === 'DREAM_WORLD', 'Yoru-no-Shirube must remain a Dream world');
assert(!STORY_WORLD_MASTER_SOURCE.yoruNoShirube.finalMechanismFrozen, 'Dream final mechanism must remain open');
assert(!STORY_WORLD_MASTER_SOURCE.yoruNoShirube.physicalMorningExists, 'physical morning must not return to Yoru-no-Shirube');
assert(!STORY_WORLD_MASTER_SOURCE.yoruNoShirube.physicalSunriseReturnAllowed, 'sunrise may not become the return condition');
assert(STORY_WORLD_MASTER_SOURCE.yoruNoShirube.returnMode === 'WAKING_TO_OWN_REALITY_ERA', 'return mode must remain waking to own Reality era');
assert(STORY_WORLD_MASTER_SOURCE.era.explicitTimeTagsWeakInDream, 'Dream time tags must remain weak');
assert(!STORY_WORLD_MASTER_SOURCE.era.laneCountFrozen, 'era lane count must remain extensible');
assert(!STORY_WORLD_MASTER_SOURCE.dreamLiving.survivalSim, 'Dream must not become a survival logistics sim');
assert(!STORY_WORLD_MASTER_SOURCE.dreamLiving.normalEconomyRequired, 'Dream basic living must not require normal economy');
assert(STORY_WORLD_MASTER_SOURCE.dreamLiving.easyMaterialization.includes('FOOD'), 'Dream food materialization must remain allowed');
assert(STORY_WORLD_MASTER_SOURCE.dreamLiving.wishCannotOverride.includes('CONSENT'), 'Dream wishes may not override consent');
assert(STORY_WORLD_MASTER_SOURCE.sky.starsVisible, 'stars must remain visible');
assert(!STORY_WORLD_MASTER_SOURCE.sky.constellationSameAcrossErasRequired, 'Dream constellations must not be forced identical across eras');
assert(STORY_WORLD_MASTER_SOURCE.sky.lostOldConstellationsAllowed, 'old constellations must be allowed to disappear');
assert(STORY_WORLD_MASTER_SOURCE.sky.newlyCreatedLaterConstellationsAllowed, 'later constellations must be allowed to appear');
assert(STORY_WORLD_MASTER_SOURCE.moon.meaning === 'INCIDENT_DEPTH', 'moon phase must remain incident depth');
assert(!STORY_WORLD_MASTER_SOURCE.moon.elapsedTimeClock, 'moon phase may not become an elapsed-time clock');
assert(!STORY_WORLD_MASTER_SOURCE.moon.fixedEraBossRequiredAtSaku, 'Saku may not require a fixed era boss');
assert(STORY_WORLD_MASTER_SOURCE.sakuyaza.formalName === '朔夜座', 'Current formal enemy identity must be 朔夜座');
assert(STORY_WORLD_MASTER_SOURCE.sakuyaza.supersededCandidateName === '朔盟', '朔盟 must remain superseded candidate name');
assert(STORY_WORLD_MASTER_SOURCE.gunjoZankyoroku.formalName === '群青残響録', '群青残響録 name must remain fixed');
assert(!STORY_WORLD_MASTER_SOURCE.gunjoZankyoroku.fixedCount, '群青残響録 must not have fixed count');
assert(!STORY_WORLD_MASTER_SOURCE.gunjoZankyoroku.onePerEra, '群青残響録 must not become one person per era');
assert(!STORY_WORLD_MASTER_SOURCE.gunjoZankyoroku.mandatoryCombatBoss, '群青残響録 members must not be mandatory combat bosses');
assert(!STORY_WORLD_MASTER_SOURCE.gunjoZankyoroku.fixedFaction, '群青残響録 must not become a fixed faction');
assert(!STORY_WORLD_MASTER_SOURCE.gunjoZankyoroku.fixedHierarchyWithSakuyaza, '朔夜座 and 群青残響録 must not gain a fixed hierarchy');
assert(!STORY_WORLD_MASTER_SOURCE.futureAndroid.humanizationIsGoal, 'Android growth may not be becoming human');
assert(STORY_WORLD_MASTER_SOURCE.futureAndroid.rejectedFinalNames.includes('シオン'), 'rejected Android name シオン must stay rejected');
assert(STORY_WORLD_MASTER_SOURCE.futureAndroid.rejectedFinalNames.includes('イヴ・ノイン'), 'rejected Android name イヴ・ノイン must stay rejected');
assert(!STORY_WORLD_MASTER_SOURCE.futureAndroid.starBeastProvesSoul, 'Star Beasts may not become Android soul proof');
assert(STORY_WORLD_MASTER_SOURCE.animals.realityDogsCatsMayEnterDream, 'Reality dogs/cats must remain eligible for Dream participation');
assert(!STORY_WORLD_MASTER_SOURCE.animals.realityAnimalsAreStarBeasts, 'Reality animals must remain distinct from Star Beasts');
assert(STORY_WORLD_MASTER_SOURCE.ending.canonicalHappyEnd, 'canonical Happy End must remain true');
assert(!STORY_WORLD_MASTER_SOURCE.ending.permanentDeathPrimaryTearDevice, 'permanent death may not become primary tear device');
assert(storyWorldMasterSummary.unresolvedHardContradictionCount === 0, 'story-world master must have zero hard contradictions');
assert(!storyWorldMasterSummary.runtimeAutoPromotionAllowed, 'story-world master may not auto-promote runtime');
assert(STORY_WORLD_MASTER_OPEN_FIELDS.includes('whether each major incident needs a combat boss'), 'combat boss requirement must remain Open');
assert(STORY_WORLD_MASTER_SUPERSEDED.includes('one fixed era boss per era'), 'fixed era-boss model must remain explicitly superseded');

// Human-readable master must carry the same high-level meaning.
for (const required of [
  'ヨルノシルベは**夢世界**',
  'ヨルノシルベには朝が来ない',
  '時間タグ',
  '朔夜座',
  '群青残響録',
  '1世代1人ではない',
  '全員が戦闘Bossになるわけではない',
  'Androidは人間にならなくていい',
]) {
  assert(master.includes(required), `Story / World Master missing decided invariant: ${required}`);
}
assert(master.includes('食事') && master.includes('日用品') && master.includes('休息'), 'Dream living materialization rules must remain in master');
assert(master.includes('相手の同意'), 'Dream materialization must not become consent override');
assert(master.includes('「世代ラスボス」という固定slotへ入れない'), 'master must explicitly prohibit fixed era-boss slots');

// Conflict register.
assert(worldSettingConflictSummary.total === 24, `expected 24 registered conflict lanes, got ${worldSettingConflictSummary.total}`);
assert(worldSettingConflictSummary.guarded === 18, `expected 18 guarded conflict lanes, got ${worldSettingConflictSummary.guarded}`);
assert(worldSettingConflictSummary.openHuman === 5, `expected 5 human-open conflict lanes, got ${worldSettingConflictSummary.openHuman}`);
assert(worldSettingConflictSummary.candidateDependent === 1, `expected 1 candidate-dependent conflict lane, got ${worldSettingConflictSummary.candidateDependent}`);
assert(worldSettingConflictSummary.unresolvedBlocker === 0, `world setting has unresolved blockers: ${worldSettingConflictSummary.unresolvedBlocker}`);
assert(new Set(worldSettingConflictEntries.map((item) => item.id)).size === worldSettingConflictEntries.length, 'world setting conflict IDs must be unique');
assert(worldSettingConflictEntries.filter((item) => item.status === 'OPEN_HUMAN').every((item) => item.humanDecisionRequired), 'every OPEN_HUMAN conflict must require human decision');
for (const requiredId of ['CF-002', 'CF-005', 'CF-019', 'CF-020', 'CF-021', 'CF-022', 'CF-023', 'CF-024']) {
  assert(worldSettingConflictEntries.some((item) => item.id === requiredId), `missing master conflict guard ${requiredId}`);
}

// 朔夜座 Current identity + legacy assets.
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'Sakuyaza formal name must stay 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.reading === 'さくやざ', '朔夜座 reading must stay さくやざ');
assert(SAKUYAZA_CURRENT_IDENTITY.supersededCandidateName === '朔盟', '朔盟 must remain the superseded candidate name');
assert(SAKUYAZA_CURRENT_IDENTITY.earlyObserverShortLabel === '八影', '八影 must remain the early observer label');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedAbsoluteLeaderRequired, '朔夜座 must not require an absolute leader');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedHierarchyWithGunjoZankyoroKu, '朔夜座 and 群青残響録 must not gain fixed hierarchy');
assert(!SAKUYAZA_CURRENT_IDENTITY.runtimeAutoPromotionAllowed, '朔夜座 may not auto-promote runtime');
assert(SAKUMEI_CANDIDATE_IDENTITY.status.includes('SUPERSEDED'), '朔盟 must be explicitly superseded');
assert(SAKUMEI_CANDIDATE_IDENTITY.supersededBy === '朔夜座', '朔盟 legacy candidate must point to 朔夜座');
assert(sakuyazaCurrentSummary.memberCount === 8, `朔夜座 must keep eight current assets, got ${sakuyazaCurrentSummary.memberCount}`);
assert(sakuyazaCurrentSummary.uniqueEnemyIdCount === 8, '朔夜座 enemy IDs must stay unique');
assert(sakuyazaCurrentSummary.uniqueCallNameCount === 8, '朔夜座 call names must stay unique');
assert(sakuyazaCurrentSummary.uniqueAttachmentLaneCount === 8, '朔夜座 fan attachment lanes must remain distinct');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, '朔夜座 final character masters must remain unapproved before visual review');
for (const member of sakumeiCandidateMembers) {
  assert(member.ordinaryHabit.length >= 15, `朔夜座 ordinary habit too thin: ${member.callName}`);
  assert(member.frighteningPromise.length >= 15, `朔夜座 frightening promise too thin: ${member.callName}`);
  assert(member.silhouettePromise.length >= 15, `朔夜座 silhouette promise too thin: ${member.callName}`);
  assert(!member.finalMasterApproved, `朔夜座 master may not be pre-approved: ${member.callName}`);
  assert(!member.runtimeAutoPromotionAllowed, `朔夜座 member may not auto-promote runtime: ${member.callName}`);
}
assert(sakuyazaDoc.includes('朔夜座'), 'Current 朔夜座 identity doc missing');
assert(sakuyazaDoc.includes('朔盟') && sakuyazaDoc.includes('superseded'), '朔夜座 doc must preserve legacy 朔盟 migration context');
assert(sakumeiLegacy.includes('CANDIDATE') || sakumeiLegacy.includes('Candidate'), 'legacy Sakumei authored material must remain candidate material');
assert(sakumeiDeep.includes('ナシロ') && sakumeiDeep.includes('ペタ'), 'legacy deep profile must retain the eight-member authored asset lane');

// 群青残響録 non-fixed structure.
assert(gunjoDoc.includes('1時代1人'), '群青残響録 doc must explicitly address one-per-era prohibition');
assert(gunjoDoc.includes('全員戦闘Boss'), '群青残響録 doc must explicitly address mandatory combat-boss prohibition');
assert(gunjoDoc.includes('Incident central person') && gunjoDoc.includes('Stage combat Boss'), '群青残響録 doc must separate incident centrality from combat role');
assert(institutions.includes('群青残響録 — Factionではない'), 'Institution/Faction map must keep 群青残響録 outside faction taxonomy');
assert(incidents.includes('incident central person / people') && incidents.includes('combat Boss'), 'Historical Incident Ledger must keep incident centrality and combat boss separate');

// Dream / Waking downstream docs.
assert(foundation.includes('朝の来ない夢世界'), 'foundation must define endless-night Dream world');
assert(foundation.includes('1時代1人の固定Boss slotを作らない'), 'foundation must reject one fixed boss per era');
assert(lifeDeath.includes('帰還 = 目覚め'), 'life/death rule must use Waking');
assert(lifeDeath.includes('Game Over ≠ 現実肉体の死亡'), 'Game Over must remain non-death');
assert(lifeDeath.includes('Retryは蘇生ではない'), 'Retry must remain non-resurrection');
assert(civilian.includes('生存サバイバル物ではない'), 'Dream daily life must not become survival simulation');
assert(civilian.includes('物は作れても、他人の意思は作れない'), 'Dream materialization must preserve other minds and consent');
assert(geography.includes('旧`dawn`接続は使用しない'), 'Dream geography must not use dawn as transition');
assert(knowledge.includes('CONFIRMED_SYSTEMIC'), 'knowledge matrix must retain systemic-confirmation vocabulary');
assert(knowledge.includes('朔夜座 formal identity'), 'knowledge matrix must route current enemy identity to 朔夜座');
assert(mystery.includes('Aを残すためにCを投げない'), 'mystery ledger must preserve payoff debt rule');
assert(mystery.includes('Dream final mechanism / origin'), 'mystery ledger must keep final Dream mechanism Open');
assert(mystery.includes('Why constellations increase / disappear'), 'mystery ledger must include constellation-change mystery');
assert(storyBook.includes('朝の来ない夢の夜'), 'Story Book must use endless-night Dream premise');
assert(beatSheet.includes('Ending — Waking'), 'Main Beat Sheet must end via Waking rather than physical dawn');
assert(temporal.includes('帰還は**朝ではなくWaking**'), 'Temporal Backbone must use Waking');
assert(canon.includes('Dreamに朝が来るcosmologyの証明ではない'), 'Canon Hub must protect legacy dawn-named stable IDs from changing Story cosmology');
assert(lineup.includes('exact cmはHuman visual review前にCanon化しない'), 'lineup must keep exact heights unfrozen');

// Stage lore remains 20/20 while physical dawn is zero.
assert(stageWorldLoreSummary.productionStageCount === 20, `expected Stage Production 20, got ${stageWorldLoreSummary.productionStageCount}`);
assert(stageWorldLoreSummary.integrationStageCount === 20, `world lore must cover all 20 stages, got ${stageWorldLoreSummary.integrationStageCount}`);
assert(stageWorldLoreSummary.uniqueIntegrationStageCount === 20, 'Stage world lore stage IDs must be unique');
assert(stageWorldLoreSummary.missingProductionStageIds.length === 0, `missing Stage world lore coverage: ${stageWorldLoreSummary.missingProductionStageIds.join(', ')}`);
assert(stageWorldLoreSummary.orphanIntegrationStageIds.length === 0, `orphan Stage world lore entries: ${stageWorldLoreSummary.orphanIntegrationStageIds.join(', ')}`);
assert(stageWorldLoreSummary.physicalMorningStageCount === 0, 'Stage world lore must contain zero physical-morning stages');
assert(!stageWorldLoreSummary.runtimeAutoPromotionAllowed, 'Stage world lore integration may not auto-promote runtime');
for (const item of stageWorldLoreEntries) {
  assert(item.knowledgeBeat.length >= 20, `Stage knowledge beat too thin: ${item.stageId}`);
  assert(item.ordinaryDetail.length >= 15, `Stage ordinary detail too thin: ${item.stageId}`);
  assert(item.forbiddenImplication.length >= 20, `Stage forbidden implication too thin: ${item.stageId}`);
  assert(item.sakumeiRelevance === item.sakuyazaRelevance, `legacy Sakumei relevance alias drifted: ${item.stageId}`);
  assert(!item.runtimeAutoPromotionAllowed, `Stage world lore may not auto-promote runtime: ${item.stageId}`);
}

// Human-readable routing / conflict summary.
assert(conflicts.includes('UNRESOLVED_BLOCKER   = 0'), 'conflict register doc must report zero unresolved blockers');
assert(conflicts.includes('GUARDED              = 18'), 'conflict register doc guarded count must match machine source');
assert(conflicts.includes('OPEN_HUMAN           = 5'), 'conflict register doc human-open count must match machine source');
assert(worldHub.includes('群青残響録は各時代の大事件中心人物 / 人物群'), 'World Hub must route non-fixed 群青残響録 definition');
assert(stageLoreDoc.includes('Stage20 World / Lore Integration'), 'Stage world lore integration document must remain routed');

console.log(`story/world master OK: ${worldSettingExpansionSummary.total} areas / ${worldSettingConflictSummary.total} conflicts / 朔夜座 ${sakuyazaCurrentSummary.memberCount} assets / Stage lore ${stageWorldLoreSummary.integrationStageCount} / physical morning 0 / fixed era boss false`);
