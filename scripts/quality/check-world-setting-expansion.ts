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

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const master = fs.readFileSync('docs/00-current-story-world-master.md', 'utf8');
const worldHub = fs.readFileSync('docs/WORLD.md', 'utf8');
const foundation = fs.readFileSync('docs/world-foundation-authority-v1.md', 'utf8');
const lifeDeath = fs.readFileSync('docs/world-life-death-injury-rulebook-v1.md', 'utf8');
const knowledge = fs.readFileSync('docs/world-knowledge-secret-matrix-v1.md', 'utf8');
const mystery = fs.readFileSync('docs/world-mystery-foreshadow-payoff-ledger-v1.md', 'utf8');
const lineup = fs.readFileSync('docs/character-height-age-era-lineup-v1.md', 'utf8');
const sakumeiLegacy = fs.readFileSync('docs/sakumei-antagonist-organization-candidate-v1.md', 'utf8');
const sakumeiDeep = fs.readFileSync('docs/sakumei-member-deep-profile-candidate-v1.md', 'utf8');
const conflicts = fs.readFileSync('docs/world-setting-conflict-register-v1.md', 'utf8');
const stageLore = fs.readFileSync('docs/stage-world-lore-integration-v1.md', 'utf8');

// User-requested 32-area expansion remains covered.
assert(worldSettingExpansionSummary.total === 32, `world setting expansion must keep 32 requested areas, got ${worldSettingExpansionSummary.total}`);
assert(worldSettingExpansionSummary.p0 === 9, `expected 9 P0 areas, got ${worldSettingExpansionSummary.p0}`);
assert(worldSettingExpansionSummary.p1 === 18, `expected 18 P1 areas, got ${worldSettingExpansionSummary.p1}`);
assert(worldSettingExpansionSummary.p2 === 5, `expected 5 P2 areas, got ${worldSettingExpansionSummary.p2}`);
assert(!worldSettingExpansionSummary.runtimeAutoPromotionAllowed, 'world setting expansion may not auto-promote runtime');

const ids = worldSettingExpansionEntries.map((entry) => entry.id);
assert(new Set(ids).size === ids.length, 'world setting expansion IDs must be unique');
for (const entry of worldSettingExpansionEntries) {
  assert(entry.authority === 'WORLD_SETTING_EXPANSION_SOURCE', `unexpected authority for ${entry.id}`);
  assert(!entry.runtimeAutoPromotionAllowed, `runtime auto promotion forbidden: ${entry.id}`);
  assert(entry.primarySource.startsWith('docs/'), `primary source must be a docs path: ${entry.id}`);
  assert(fs.existsSync(entry.primarySource), `missing primary source ${entry.primarySource} for ${entry.id}`);
}

// Conflict register grew to cover the new master decisions.
assert(worldSettingConflictSummary.total === 24, `expected 24 registered conflict lanes, got ${worldSettingConflictSummary.total}`);
assert(worldSettingConflictSummary.guarded === 18, `expected 18 guarded conflict lanes, got ${worldSettingConflictSummary.guarded}`);
assert(worldSettingConflictSummary.openHuman === 5, `expected 5 human-open conflict lanes, got ${worldSettingConflictSummary.openHuman}`);
assert(worldSettingConflictSummary.candidateDependent === 1, `expected 1 candidate-dependent conflict lane, got ${worldSettingConflictSummary.candidateDependent}`);
assert(worldSettingConflictSummary.unresolvedBlocker === 0, `world setting has unresolved blockers: ${worldSettingConflictSummary.unresolvedBlocker}`);
assert(new Set(worldSettingConflictEntries.map((entry) => entry.id)).size === worldSettingConflictEntries.length, 'world setting conflict IDs must be unique');
assert(worldSettingConflictEntries.filter((entry) => entry.status === 'OPEN_HUMAN').every((entry) => entry.humanDecisionRequired), 'every OPEN_HUMAN conflict must require human decision');

for (const requiredId of ['CF-002', 'CF-005', 'CF-019', 'CF-020', 'CF-021', 'CF-022', 'CF-023', 'CF-024']) {
  assert(worldSettingConflictEntries.some((entry) => entry.id === requiredId), `missing master conflict guard ${requiredId}`);
}

// Highest Story / World Master hard decisions.
for (const required of [
  'ヨルノシルベは**夢世界**',
  'ヨルノシルベには朝が来ない',
  '夢から目覚めて、自分の時代へ戻る',
  '時間タグの記憶が弱い',
  '昔はあったが現代では存在しない星座',
  '月相 ≠ 時間経過',
  '朔夜座',
  '群青残響録',
  '1世代1人ではない',
  '全員が戦闘Bossになるわけではない',
  'Androidは人間にならなくていい',
  'Reality動物と星獣を別category',
]) {
  assert(master.includes(required), `Story / World Master missing decided invariant: ${required}`);
}

assert(master.includes('食事') && master.includes('日用品') && master.includes('休息'), 'Dream living materialization rules must remain in master');
assert(master.includes('相手の同意'), 'Dream materialization must not become consent override');
assert(!master.includes('異なる世代の大事件中心人物 / 世代ラスボス群'), 'fixed era-boss grouping wording must not return');
assert(master.includes('「世代ラスボス」という固定slotへ入れない'), 'master must explicitly prohibit fixed era-boss slots');

// Foundation and life/death must have migrated off physical dawn-return semantics.
assert(foundation.includes('朝の来ない夢世界'), 'foundation must define Yoru-no-Shirube as an endless-night dream world');
assert(foundation.includes('1時代1人の固定Boss slotを作らない'), 'foundation must reject one-fixed-boss-per-era design');
assert(foundation.includes('食事') && foundation.includes('Not wish-solvable'), 'foundation must separate dream living materialization from plot-solving');
assert(lifeDeath.includes('帰還 = 目覚め'), 'life/death rule must use waking instead of dawn return');
assert(lifeDeath.includes('Game Over ≠ 現実肉体の死亡'), 'life/death rule must keep Game Over non-death boundary');
assert(lifeDeath.includes('Retryは蘇生ではない'), 'life/death rule must keep Retry non-resurrection boundary');
assert(lifeDeath.includes('必ず戦闘Bossになるわけではない'), 'life/death rule must not force incident-central figures into combat boss slots');

// Sakuyaza is Current; Sakumei survives only as a legacy namespace/assets.
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'Current formal enemy-group name must be 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.reading === 'さくやざ', '朔夜座 reading must stay さくやざ');
assert(SAKUYAZA_CURRENT_IDENTITY.supersededCandidateName === '朔盟', '朔盟 must remain the superseded candidate name');
assert(SAKUYAZA_CURRENT_IDENTITY.earlyObserverShortLabel === '八影', '八影 must remain the early observer label');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedAbsoluteLeaderRequired, '朔夜座 must not require an absolute leader');
assert(!SAKUYAZA_CURRENT_IDENTITY.fixedHierarchyWithGunjoZankyoroKu, '朔夜座 and 群青残響録 must not gain a fixed hierarchy');
assert(!SAKUYAZA_CURRENT_IDENTITY.runtimeAutoPromotionAllowed, '朔夜座 content identity may not auto-promote runtime');

assert(SAKUMEI_CANDIDATE_IDENTITY.status.includes('SUPERSEDED'), '朔盟 must be explicitly superseded');
assert(SAKUMEI_CANDIDATE_IDENTITY.supersededBy === '朔夜座', '朔盟 legacy candidate must point to 朔夜座');
assert(sakuyazaCurrentSummary.memberCount === 8, `朔夜座 must keep eight current spotlight assets, got ${sakuyazaCurrentSummary.memberCount}`);
assert(sakuyazaCurrentSummary.uniqueEnemyIdCount === 8, '朔夜座 candidate assets must preserve eight unique enemy IDs');
assert(sakuyazaCurrentSummary.uniqueCallNameCount === 8, '朔夜座 call names must remain unique');
assert(sakuyazaCurrentSummary.uniqueAttachmentLaneCount === 8, 'all 朔夜座 members must keep distinct fan attachment lanes');
assert(sakuyazaCurrentSummary.allFinalMastersUnapproved, '朔夜座 final character masters must remain unapproved before human visual review');
for (const member of sakumeiCandidateMembers) {
  assert(member.ordinaryHabit.length >= 15, `朔夜座 ordinary habit too thin: ${member.callName}`);
  assert(member.frighteningPromise.length >= 15, `朔夜座 frightening promise too thin: ${member.callName}`);
  assert(member.silhouettePromise.length >= 15, `朔夜座 silhouette promise too thin: ${member.callName}`);
  assert(!member.finalMasterApproved, `朔夜座 master may not be pre-approved: ${member.callName}`);
  assert(!member.runtimeAutoPromotionAllowed, `朔夜座 member may not auto-promote runtime: ${member.callName}`);
}

// Existing authored assets are retained rather than deleted.
assert(sakumeiLegacy.includes('CANDIDATE') || sakumeiLegacy.includes('Candidate'), 'legacy Sakumei authored material must remain identifiable as candidate material');
assert(sakumeiDeep.includes('ナシロ') && sakumeiDeep.includes('アサトジ') && sakumeiDeep.includes('ミチグレ') && sakumeiDeep.includes('オリネ') && sakumeiDeep.includes('ハクマ') && sakumeiDeep.includes('ツグリ') && sakumeiDeep.includes('ユラネ') && sakumeiDeep.includes('ペタ'), 'legacy deep profile must still cover all eight assets');

// Stage lore remains complete; naming migration can be gradual without losing IDs.
assert(stageWorldLoreSummary.productionStageCount === 20, `expected Stage Production 20, got ${stageWorldLoreSummary.productionStageCount}`);
assert(stageWorldLoreSummary.integrationStageCount === 20, `world lore must cover all 20 stages, got ${stageWorldLoreSummary.integrationStageCount}`);
assert(stageWorldLoreSummary.uniqueIntegrationStageCount === 20, 'Stage world lore stage IDs must be unique');
assert(stageWorldLoreSummary.missingProductionStageIds.length === 0, `missing Stage world lore coverage: ${stageWorldLoreSummary.missingProductionStageIds.join(', ')}`);
assert(stageWorldLoreSummary.orphanIntegrationStageIds.length === 0, `orphan Stage world lore entries: ${stageWorldLoreSummary.orphanIntegrationStageIds.join(', ')}`);
assert(!stageWorldLoreSummary.runtimeAutoPromotionAllowed, 'Stage world lore integration may not auto-promote runtime');
for (const entry of stageWorldLoreEntries) {
  assert(entry.knowledgeBeat.length >= 20, `Stage knowledge beat too thin: ${entry.stageId}`);
  assert(entry.ordinaryDetail.length >= 15, `Stage ordinary detail too thin: ${entry.stageId}`);
  assert(entry.forbiddenImplication.length >= 20, `Stage forbidden implication too thin: ${entry.stageId}`);
  assert(!entry.runtimeAutoPromotionAllowed, `Stage world lore may not auto-promote runtime: ${entry.stageId}`);
}

// Preserve earlier content-system quality guards.
assert(knowledge.includes('CONFIRMED_SYSTEMIC'), 'knowledge matrix must distinguish systemic confirmation');
assert(mystery.includes('Aを残すためにCを投げない'), 'mystery ledger must preserve Title1 payoff debt rule');
assert(lineup.includes('exact cmはHuman visual review前にCanon化しない'), 'lineup must keep exact heights unfrozen');
assert(conflicts.includes('UNRESOLVED_BLOCKER   = 0'), 'conflict register doc must report zero unresolved blockers');
assert(conflicts.includes('GUARDED              = 18'), 'conflict register doc guarded count must match machine source');
assert(conflicts.includes('OPEN_HUMAN           = 5'), 'conflict register doc human-open count must match machine source');
assert(worldHub.includes('群青残響録は各時代の大事件中心人物 / 人物群'), 'World Hub must route the non-fixed 群青残響録 definition');
assert(stageLore.includes('Stage20 World / Lore Integration'), 'Stage world lore integration document must remain routed');

console.log(`world setting expansion OK: ${worldSettingExpansionSummary.total} areas / ${worldSettingConflictSummary.total} conflict lanes / 朔夜座 8 assets / Stage lore 20 / 0 blockers`);
