import fs from 'node:fs';
import { worldSettingExpansionEntries, worldSettingExpansionSummary } from '../../src/game/data/worldSettingExpansionIndex.ts';
import { worldSettingConflictEntries, worldSettingConflictSummary } from '../../src/game/data/worldSettingConflictRegister.ts';
import { SAKUMEI_CANDIDATE_IDENTITY, sakumeiCandidateMembers, sakumeiCandidateSummary } from '../../src/game/data/sakumeiCandidateSource.ts';
import { stageWorldLoreEntries, stageWorldLoreSummary } from '../../src/game/data/stageWorldLoreIntegration.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

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

assert(worldSettingConflictSummary.total === 18, `expected 18 registered conflict lanes, got ${worldSettingConflictSummary.total}`);
assert(worldSettingConflictSummary.guarded === 12, `expected 12 guarded conflict lanes, got ${worldSettingConflictSummary.guarded}`);
assert(worldSettingConflictSummary.openHuman === 5, `expected 5 human-open conflict lanes, got ${worldSettingConflictSummary.openHuman}`);
assert(worldSettingConflictSummary.candidateDependent === 1, `expected 1 candidate-dependent conflict lane, got ${worldSettingConflictSummary.candidateDependent}`);
assert(worldSettingConflictSummary.unresolvedBlocker === 0, `world setting has unresolved blockers: ${worldSettingConflictSummary.unresolvedBlocker}`);
assert(new Set(worldSettingConflictEntries.map((entry) => entry.id)).size === worldSettingConflictEntries.length, 'world setting conflict IDs must be unique');
assert(worldSettingConflictEntries.filter((entry) => entry.status === 'OPEN_HUMAN').every((entry) => entry.humanDecisionRequired), 'every OPEN_HUMAN conflict must require human decision');

assert(SAKUMEI_CANDIDATE_IDENTITY.formalName === '朔盟', 'Sakumei formal name must stay 朔盟');
assert(SAKUMEI_CANDIDATE_IDENTITY.earlyObserverShortLabel === '八影', '八影 must remain the early observer label during candidate migration');
assert(!SAKUMEI_CANDIDATE_IDENTITY.sharedUniformRequired, 'Sakumei must not collapse into a shared-uniform visual identity');
assert(!SAKUMEI_CANDIDATE_IDENTITY.absoluteLeaderFrozen, 'Sakumei absolute leader must remain unfrozen');
assert(!SAKUMEI_CANDIDATE_IDENTITY.runtimeAutoPromotionAllowed, 'Sakumei candidate may not auto-promote runtime');
assert(sakumeiCandidateSummary.memberCount === 8, `Sakumei must keep eight spotlight members, got ${sakumeiCandidateSummary.memberCount}`);
assert(sakumeiCandidateSummary.uniqueEnemyIdCount === 8, 'Sakumei candidate enemy IDs must be unique');
assert(sakumeiCandidateSummary.uniqueCallNameCount === 8, 'Sakumei call names must be unique');
assert(sakumeiCandidateSummary.uniqueAttachmentLaneCount === 8, 'all Sakumei members must have distinct primary fan attachment lanes');
assert(sakumeiCandidateSummary.allFinalMastersUnapproved, 'Sakumei final character masters must remain unapproved before human visual review');
for (const member of sakumeiCandidateMembers) {
  assert(member.ordinaryHabit.length >= 15, `Sakumei ordinary habit too thin: ${member.callName}`);
  assert(member.frighteningPromise.length >= 15, `Sakumei frightening promise too thin: ${member.callName}`);
  assert(member.silhouettePromise.length >= 15, `Sakumei silhouette promise too thin: ${member.callName}`);
  assert(!member.finalMasterApproved, `Sakumei master may not be pre-approved: ${member.callName}`);
  assert(!member.runtimeAutoPromotionAllowed, `Sakumei member may not auto-promote runtime: ${member.callName}`);
}

assert(stageWorldLoreSummary.productionStageCount === 20, `expected Stage Production 20, got ${stageWorldLoreSummary.productionStageCount}`);
assert(stageWorldLoreSummary.integrationStageCount === 20, `world lore must cover all 20 stages, got ${stageWorldLoreSummary.integrationStageCount}`);
assert(stageWorldLoreSummary.uniqueIntegrationStageCount === 20, 'Stage world lore stage IDs must be unique');
assert(stageWorldLoreSummary.missingProductionStageIds.length === 0, `missing Stage world lore coverage: ${stageWorldLoreSummary.missingProductionStageIds.join(', ')}`);
assert(stageWorldLoreSummary.orphanIntegrationStageIds.length === 0, `orphan Stage world lore entries: ${stageWorldLoreSummary.orphanIntegrationStageIds.join(', ')}`);
assert(stageWorldLoreSummary.sakumeiClueOrRevealStageCount === 3, `expected three explicit Sakumei clue/reveal stages, got ${stageWorldLoreSummary.sakumeiClueOrRevealStageCount}`);
assert(!stageWorldLoreSummary.runtimeAutoPromotionAllowed, 'Stage world lore integration may not auto-promote runtime');
for (const entry of stageWorldLoreEntries) {
  assert(entry.knowledgeBeat.length >= 20, `Stage knowledge beat too thin: ${entry.stageId}`);
  assert(entry.ordinaryDetail.length >= 15, `Stage ordinary detail too thin: ${entry.stageId}`);
  assert(entry.forbiddenImplication.length >= 20, `Stage forbidden implication too thin: ${entry.stageId}`);
  assert(!entry.runtimeAutoPromotionAllowed, `Stage world lore may not auto-promote runtime: ${entry.stageId}`);
}

const worldHub = fs.readFileSync('docs/WORLD.md', 'utf8');
const foundation = fs.readFileSync('docs/world-foundation-authority-v1.md', 'utf8');
const lifeDeath = fs.readFileSync('docs/world-life-death-injury-rulebook-v1.md', 'utf8');
const knowledge = fs.readFileSync('docs/world-knowledge-secret-matrix-v1.md', 'utf8');
const mystery = fs.readFileSync('docs/world-mystery-foreshadow-payoff-ledger-v1.md', 'utf8');
const lineup = fs.readFileSync('docs/character-height-age-era-lineup-v1.md', 'utf8');
const sakumei = fs.readFileSync('docs/sakumei-antagonist-organization-candidate-v1.md', 'utf8');
const sakumeiDeep = fs.readFileSync('docs/sakumei-member-deep-profile-candidate-v1.md', 'utf8');
const conflicts = fs.readFileSync('docs/world-setting-conflict-register-v1.md', 'utf8');
const stageLore = fs.readFileSync('docs/stage-world-lore-integration-v1.md', 'utf8');

for (const required of [
  '現実では人物が同時代とは限らない',
  'Game Over',
  '黒耀化',
  'Happy End',
  'Main Mystery',
]) {
  assert(worldHub.includes(required) || foundation.includes(required), `missing world invariant wording: ${required}`);
}

assert(lifeDeath.includes('Game Over ≠ 現実肉体の死亡'), 'life/death rule must keep Game Over non-death boundary');
assert(lifeDeath.includes('Retryは蘇生ではない'), 'life/death rule must keep Retry non-resurrection boundary');
assert(knowledge.includes('CONFIRMED_SYSTEMIC'), 'knowledge matrix must distinguish systemic confirmation');
assert(mystery.includes('Aを残すためにCを投げない'), 'mystery ledger must preserve Title1 payoff debt rule');
assert(lineup.includes('exact cmはHuman visual review前にCanon化しない'), 'lineup must keep exact heights unfrozen');
assert(sakumei.includes('CANDIDATE') || sakumei.includes('Candidate'), 'Sakumei redesign must remain a candidate before final migration');
assert(sakumeiDeep.includes('ナシロ') && sakumeiDeep.includes('アサトジ') && sakumeiDeep.includes('ミチグレ') && sakumeiDeep.includes('オリネ') && sakumeiDeep.includes('ハクマ') && sakumeiDeep.includes('ツグリ') && sakumeiDeep.includes('ユラネ') && sakumeiDeep.includes('ペタ'), 'Sakumei deep profile must cover all eight members');
assert(conflicts.includes('UNRESOLVED_BLOCKER   = 0'), 'conflict register doc must report zero unresolved blockers');
assert(conflicts.includes('GUARDED              = 12'), 'conflict register doc guarded count must match machine source');
assert(conflicts.includes('OPEN_HUMAN           = 5'), 'conflict register doc human-open count must match machine source');
assert(stageLore.includes('Stage20 World / Lore Integration'), 'Stage world lore integration document must remain routed');

console.log(`world setting expansion OK: ${worldSettingExpansionSummary.total} areas / ${worldSettingExpansionSummary.uniqueSourceCount} primary sources / ${worldSettingConflictSummary.total} conflict lanes / 8 Sakumei attachment lanes / 20 Stage lore entries / 0 blockers`);
