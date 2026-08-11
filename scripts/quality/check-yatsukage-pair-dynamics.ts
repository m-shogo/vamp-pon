import { spotlightEnemyCharacterEntries } from '../../src/game/data/spotlightEnemyCharacterSource.ts';
import { yatsukageCallNames } from '../../src/game/data/yatsukageIdentitySource.ts';
import {
  yatsukagePairDynamics,
  yatsukagePairDynamicsSummary,
} from '../../src/game/data/yatsukagePairDynamicsSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const summary = yatsukagePairDynamicsSummary;
assert(summary.yatsukageCount === 8, `八影 count must remain 8, got ${summary.yatsukageCount}`);
assert(summary.possiblePairCount === 28, `8C2 must be 28, got ${summary.possiblePairCount}`);
assert(summary.authoredPairCount === 28, `all 28 八影 pairs must be authored, got ${summary.authoredPairCount}`);
assert(summary.uniquePairIdCount === 28, '八影 pair IDs must all be unique');
assert(summary.featuredPairCount === 8, `expected eight featured co-appearance pairs, got ${summary.featuredPairCount}`);
assert(summary.collisionKindCount >= 6, `八影 pairs need broad collision grammar, got ${summary.collisionKindCount}`);
assert(!summary.factionBondCreated, '八影 pair dynamics may not turn 八影 into a faction');
assert(!summary.commonMastermindImplied, '八影 pair dynamics may not imply a shared mastermind');
assert(!summary.runtimeAutoPromotionAllowed, '八影 pair content may not auto-promote runtime');

const enemyIds = spotlightEnemyCharacterEntries.map((entry) => entry.enemyId);
for (let i = 0; i < enemyIds.length; i += 1) {
  for (let j = i + 1; j < enemyIds.length; j += 1) {
    const expected = [enemyIds[i], enemyIds[j]].sort().join('::');
    assert(yatsukagePairDynamics.some((entry) => entry.pairId === expected), `missing 八影 pair: ${expected}`);
  }
}

const callNames = new Set(yatsukageCallNames.map((entry) => entry.callName));
for (const pair of yatsukagePairDynamics) {
  assert(callNames.has(pair.enemyACallName), `unknown call name A: ${pair.pairId}`);
  assert(callNames.has(pair.enemyBCallName), `unknown call name B: ${pair.pairId}`);
  assert(pair.interactionHook.length >= 20, `interaction hook too thin: ${pair.pairId}`);
  assert(pair.wrongReadingCollision.length >= 20, `wrong-reading collision too thin: ${pair.pairId}`);
  assert(pair.encounterChoreography.length >= 20, `encounter choreography too thin: ${pair.pairId}`);
  assert(pair.playerDiscovery.length >= 15, `player discovery too thin: ${pair.pairId}`);
  assert(pair.storyAfterimage.length >= 10, `story afterimage too thin: ${pair.pairId}`);
  assert(!pair.factionBondCreated, `pair may not create faction Bond: ${pair.pairId}`);
  assert(!pair.friendshipImplied, `pair may not imply friendship: ${pair.pairId}`);
  assert(!pair.commonMastermindImplied, `pair may not imply mastermind: ${pair.pairId}`);
}

const pettyPairs = yatsukagePairDynamics.filter((entry) =>
  entry.enemyAId === 'omburo_nameplate' || entry.enemyBId === 'omburo_nameplate',
);
assert(pettyPairs.length === 7, 'ペタ must have a distinct dynamic with every other 八影');
assert(
  pettyPairs.some((entry) => entry.collisionKind === 'ACCIDENTAL_COUNTER'),
  'ペタ should sometimes accidentally disrupt another 八影 instead of only amplifying danger',
);

console.log(JSON.stringify({ status: 'PASS', summary, featuredPairs: yatsukagePairDynamics.filter((entry) => entry.featuredPair).map((entry) => `${entry.enemyACallName}×${entry.enemyBCallName}`) }, null, 2));
