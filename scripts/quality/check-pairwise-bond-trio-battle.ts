import {
  currentPairwiseBondLanes,
  pairwiseBondTrioBattleSummary,
  resolveTrioRelationshipView,
  trioBattleRelationshipRules,
} from '../../src/game/data/pairwiseBondTrioBattleSource.ts';
import { CURRENT_RELATIONSHIP_CHARACTER_IDS } from '../../src/game/data/currentRelationshipInventory.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(pairwiseBondTrioBattleSummary.currentCharacterCount === 21, 'Current relationship roster must remain 21');
assert(pairwiseBondTrioBattleSummary.allPairCount === 210, `21C2 must be 210, got ${pairwiseBondTrioBattleSummary.allPairCount}`);
assert(pairwiseBondTrioBattleSummary.featuredPairCount === 24, `featured relation count must remain 24, got ${pairwiseBondTrioBattleSummary.featuredPairCount}`);
assert(pairwiseBondTrioBattleSummary.baselinePairCount === 186, `baseline pair count must be 186, got ${pairwiseBondTrioBattleSummary.baselinePairCount}`);
assert(pairwiseBondTrioBattleSummary.directedAffinityLaneCount === 420, `directed affinity lane count must be 420, got ${pairwiseBondTrioBattleSummary.directedAffinityLaneCount}`);
assert(pairwiseBondTrioBattleSummary.possibleTrioCombinationCount === 1330, `21C3 must be 1330, got ${pairwiseBondTrioBattleSummary.possibleTrioCombinationCount}`);
assert(pairwiseBondTrioBattleSummary.pairCountPerTrio === 3, 'trio must expose exactly AB/AC/BC');
assert(pairwiseBondTrioBattleSummary.directedAffinityCountPerTrio === 6, 'trio must expose 6 directed affinity lanes');
assert(!pairwiseBondTrioBattleSummary.storedTrioBondExists, 'group/trio Bond must not be stored');
assert(!pairwiseBondTrioBattleSummary.runtimeAutoPromotionAllowed, 'content architecture may not auto-promote runtime');

assert(new Set(currentPairwiseBondLanes.map((entry) => entry.pairKey)).size === 210, 'pair keys must be unique');
for (const lane of currentPairwiseBondLanes) {
  assert(lane.participants[0] !== lane.participants[1], `self pair detected: ${lane.pairKey}`);
  assert(lane.sharedBondStoredPerPair, `shared pair Bond missing: ${lane.pairKey}`);
  assert(lane.directedAffinityStoredPerDirection, `directed affinity missing: ${lane.pairKey}`);
  assert(lane.directedAffinityKeys.length === 2, `pair must have 2 directions: ${lane.pairKey}`);
  assert(!lane.thirdCharacterMayTransferAffinity, `third-character transitive affinity forbidden: ${lane.pairKey}`);
  assert(!lane.romanceInferredFromScores, `scores may not infer romance: ${lane.pairKey}`);
  assert(!lane.relationTypeInferredFromScores, `scores may not infer relation type: ${lane.pairKey}`);
}

const example = resolveTrioRelationshipView(['yui', 'asa', 'nagi']);
assert(example.members.length === 3, 'trio example must contain 3 members');
assert(new Set(example.pairKeys).size === 3, 'trio pair keys must be distinct');
assert(example.pairLanes.length === 3, 'trio must resolve three pair lanes');
assert(!example.storedTrioBondExists && !example.trioAffinityExists, 'trio-level affection storage forbidden');
assert(example.partyMayReadPairStateOnly, 'party must derive relation state from pair state only');
assert(trioBattleRelationshipRules.selectedCharacterCount === 3, 'battle selection plan must remain exactly 3');
assert(!trioBattleRelationshipRules.friendshipTransitive, 'friendship/affinity may not be transitive');

let duplicateRejected = false;
try { resolveTrioRelationshipView(['yui', 'yui', 'asa']); } catch { duplicateRejected = true; }
assert(duplicateRejected, 'duplicate trio members must fail closed');

for (const id of CURRENT_RELATIONSHIP_CHARACTER_IDS) {
  const laneCount = currentPairwiseBondLanes.filter((entry) => entry.participants.includes(id)).length;
  assert(laneCount === 20, `${id} must have a pair lane with every other Current Character, got ${laneCount}`);
}

console.log(JSON.stringify({ status: 'PASS', ...pairwiseBondTrioBattleSummary, sampleTrio: example }, null, 2));
