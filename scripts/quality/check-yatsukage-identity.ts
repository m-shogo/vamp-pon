import { enemyById } from '../../src/game/data/enemyProductionDatabase.ts';
import { spotlightEnemyCharacterEntries } from '../../src/game/data/spotlightEnemyCharacterSource.ts';
import { YATSUKAGE_GROUP_IDENTITY, yatsukageCallNames, yatsukageIdentitySummary } from '../../src/game/data/yatsukageIdentitySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(YATSUKAGE_GROUP_IDENTITY.formalName === '夜綴りの八影', 'formal group name drift');
assert(YATSUKAGE_GROUP_IDENTITY.shortName === '八影', 'short group name drift');
assert(YATSUKAGE_GROUP_IDENTITY.shortReading === 'やつかげ', 'short reading drift');
assert(yatsukageIdentitySummary.memberCount === 8, `八影 must remain 8, got ${yatsukageIdentitySummary.memberCount}`);
assert(yatsukageIdentitySummary.spotlightMemberCount === 8, 'Spotlight8 count drift');
assert(yatsukageIdentitySummary.uniqueCallNameCount === 8, '八影 call names must be unique');
assert(yatsukageIdentitySummary.allCallNamesAreNotTrueNames, 'call names may not freeze true names');
assert(!yatsukageIdentitySummary.factionMembershipImplied, '八影 may not become a faction by taxonomy');
assert(!yatsukageIdentitySummary.runtimeAutoPromotionAllowed, '八影 content identity may not auto-promote runtime');

const spotlightIds = new Set(spotlightEnemyCharacterEntries.map((entry) => entry.enemyId));
for (const entry of yatsukageCallNames) {
  assert(spotlightIds.has(entry.enemyId), `non-Spotlight enemy entered 八影: ${entry.enemyId}`);
  const enemy = enemyById.get(entry.enemyId);
  assert(enemy, `unknown Enemy48 id in 八影: ${entry.enemyId}`);
  assert(enemy.name === entry.currentEnemyName, `Enemy48 Current name drift for ${entry.enemyId}: ${enemy.name} != ${entry.currentEnemyName}`);
  assert(entry.callName.length >= 2 && entry.callName.length <= 6, `call name should stay short: ${entry.callName}`);
  assert(!entry.trueNameFrozen, `true name accidentally frozen: ${entry.enemyId}`);
  assert(!entry.factionMembershipImplied, `faction accidentally implied: ${entry.enemyId}`);
}

for (const forbidden of ['kuroori', 'yui', 'asa', 'nagi', 'michiru', 'tomori']) {
  assert(!yatsukageCallNames.some((entry) => entry.callName.toLowerCase() === forbidden), `Current Character name collision: ${forbidden}`);
}

console.log(JSON.stringify({ status: 'PASS', ...yatsukageIdentitySummary, callNames: yatsukageCallNames.map((entry) => entry.callName) }, null, 2));
