import {
  buildYatsukagePartyEncounterPlan,
  current21YatsukageRelationshipEntries,
  current21YatsukageRelationshipSummary,
} from '../../src/game/data/current21YatsukageRelationshipSource.ts';
import { CURRENT_RELATIONSHIP_CHARACTER_IDS } from '../../src/game/data/currentRelationshipInventory.ts';
import { spotlightEnemyCharacterEntries } from '../../src/game/data/spotlightEnemyCharacterSource.ts';
import { yatsukageCallNames } from '../../src/game/data/yatsukageIdentitySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const summary = current21YatsukageRelationshipSummary;
assert(summary.currentCharacterCount === 21, `Current count drift: ${summary.currentCharacterCount}`);
assert(summary.yatsukageCount === 8, `八影 count drift: ${summary.yatsukageCount}`);
assert(summary.relationCount === 168, `21 x 8 relations must be 168, got ${summary.relationCount}`);
assert(summary.featuredArcCount === 32, `Featured relation count must be 32, got ${summary.featuredArcCount}`);
assert(summary.baselineReactionCount === 136, `Baseline relation count must be 136, got ${summary.baselineReactionCount}`);
assert(summary.charactersCovered === 21, 'all Current21 must have 八影 reactions');
assert(summary.enemiesCovered === 8, 'all 八影 must have Current21 reactions');
assert(!summary.friendshipScoreCreated, 'enemy relation must not create friendship score');
assert(!summary.enemyRecruitmentImplied, 'enemy relation must not imply recruitment');
assert(!summary.sympathyErasesHarm, 'sympathy must not erase harm');
assert(!summary.runtimeAutoPromotionAllowed, 'content matrix must not auto-promote runtime');

const uniqueRelationIds = new Set(current21YatsukageRelationshipEntries.map((entry) => entry.relationId));
assert(uniqueRelationIds.size === 168, 'all Current21 x 八影 relation IDs must be unique');

for (const characterId of CURRENT_RELATIONSHIP_CHARACTER_IDS) {
  const entries = current21YatsukageRelationshipEntries.filter((entry) => entry.characterId === characterId);
  assert(entries.length === 8, `${characterId} must have exactly 8 八影 relations, got ${entries.length}`);
}

for (const enemy of spotlightEnemyCharacterEntries) {
  const entries = current21YatsukageRelationshipEntries.filter((entry) => entry.enemyId === enemy.enemyId);
  const featured = entries.filter((entry) => entry.depth === 'FEATURED_ARC');
  assert(entries.length === 21, `${enemy.enemyId} must cover Current21, got ${entries.length}`);
  assert(featured.length === 4, `${enemy.enemyId} must have four Featured Arc mirrors, got ${featured.length}`);
  assert(
    featured.every((entry) => enemy.mirrorCharacterIds.includes(entry.characterId)),
    `${enemy.enemyId} featured relation escaped declared mirror set`,
  );
  assert(
    enemy.mirrorCharacterIds.every((id) => featured.some((entry) => entry.characterId === id)),
    `${enemy.enemyId} declared mirror missing Featured Arc`,
  );
}

const callNames = new Set(yatsukageCallNames.map((entry) => entry.callName));
assert(callNames.size === 8, '八影 call names must remain unique');
assert(
  current21YatsukageRelationshipEntries.every((entry) => callNames.has(entry.enemyCallName)),
  'relation matrix must use current 八影 call names',
);

for (const entry of current21YatsukageRelationshipEntries) {
  assert(entry.personalQuestion.length >= 10, `personalQuestion too weak: ${entry.relationId}`);
  assert(entry.firstReaction.length >= 10, `firstReaction too weak: ${entry.relationId}`);
  assert(entry.enemyFixation.length >= 10, `enemyFixation too weak: ${entry.relationId}`);
  assert(entry.battleDynamic.length >= 10, `battleDynamic too weak: ${entry.relationId}`);
  assert(entry.lateShift.length >= 10, `lateShift too weak: ${entry.relationId}`);
  assert(entry.postBattleAction.length >= 10, `postBattleAction too weak: ${entry.relationId}`);
  assert(entry.sympathyMayExist, `sympathy possibility must remain available: ${entry.relationId}`);
  assert(!entry.sympathyErasesHarm, `sympathy may not erase harm: ${entry.relationId}`);
  assert(!entry.romanceOrFriendshipScoreCreated, `enemy relation must not become Bond/Affinity score: ${entry.relationId}`);
  assert(!entry.enemyRecruitmentImplied, `enemy recruitment may not be implied: ${entry.relationId}`);
}

const sample = buildYatsukagePartyEncounterPlan('boss_name_without_owner', ['yui', 'asa', 'nagi']);
assert(sample.relations.length === 3, '3-person 八影 encounter must expose three personal relations');
assert(sample.featuredArcCharacterIds.length === 2, 'sample should expose yui/asa as featured and nagi as baseline');
assert(sample.featuredArcCharacterIds.includes('yui') && sample.featuredArcCharacterIds.includes('asa'), 'sample featured relation mismatch');
assert(!sample.groupEnemyAffinityStored, 'party enemy affinity must never be stored');
assert(!sample.partyBondCreated, '八影 encounter may not create group Bond');
assert(sample.tacticalReplyMustUseDifferentCharacterWhenPossible, 'trio encounter needs speaker fairness');
assert(sample.afterimageMayUseThirdCharacter, 'third party member must remain eligible for afterimage line');

console.log(JSON.stringify({ status: 'PASS', summary, sample }, null, 2));
