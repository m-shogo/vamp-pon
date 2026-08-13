import { enemyById } from '../../src/game/data/enemyProductionDatabase.ts';
import { SAKUYAZA_CURRENT_IDENTITY, sakumeiCandidateMembers } from '../../src/game/data/sakumeiCandidateSource.ts';
import { spotlightEnemyCharacterEntries } from '../../src/game/data/spotlightEnemyCharacterSource.ts';
import { YATSUKAGE_GROUP_IDENTITY, yatsukageCallNames, yatsukageIdentitySummary } from '../../src/game/data/yatsukageIdentitySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

// Legacy label must remain available only for compatibility.
assert(YATSUKAGE_GROUP_IDENTITY.formalName === '夜綴りの八影', 'legacy formal label drift');
assert(YATSUKAGE_GROUP_IDENTITY.shortName === '八影', 'legacy short label drift');
assert(YATSUKAGE_GROUP_IDENTITY.shortReading === 'やつかげ', 'legacy short reading drift');
assert(YATSUKAGE_GROUP_IDENTITY.authority === 'SUPERSEDED_LEGACY_OBSERVER_LABEL', '八影 must not be Current naming authority');
assert(YATSUKAGE_GROUP_IDENTITY.currentFormalName === '朔夜座', 'legacy source must point to 朔夜座');
assert(YATSUKAGE_GROUP_IDENTITY.supersededBy === '朔夜座', 'legacy source supersededBy must remain 朔夜座');
assert(!YATSUKAGE_GROUP_IDENTITY.mayBeCurrentFormalTeamName, '八影 may not become Current formal team name');
assert(!YATSUKAGE_GROUP_IDENTITY.mayNameNewVisualMaster, '八影 may not name new Visual Masters');

// Current naming authority must remain Sakuyaza.
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'Current Season1 formal team must remain 朔夜座');
assert(SAKUYAZA_CURRENT_IDENTITY.seasonScope === 'S1', '朔夜座 must remain scoped to Season1');
assert(SAKUYAZA_CURRENT_IDENTITY.earlyObserverShortLabel === '八影', 'Current authority must preserve 八影 only as early observer label');
assert(SAKUYAZA_CURRENT_IDENTITY.currentMemberCount === 8, '朔夜座 S1 member count drift');

assert(yatsukageIdentitySummary.memberCount === 8, `legacy call-name source must remain 8, got ${yatsukageIdentitySummary.memberCount}`);
assert(yatsukageIdentitySummary.spotlightMemberCount === 8, 'Spotlight8 count drift');
assert(yatsukageIdentitySummary.uniqueCallNameCount === 8, 'legacy call names must remain unique');
assert(yatsukageIdentitySummary.allCallNamesAreNotTrueNames, 'call names may not freeze true names');
assert(!yatsukageIdentitySummary.factionMembershipImplied, 'legacy observer taxonomy may not define organization semantics');
assert(!yatsukageIdentitySummary.mayBeCurrentFormalTeamName, 'legacy summary may not become Current naming authority');
assert(!yatsukageIdentitySummary.runtimeAutoPromotionAllowed, 'legacy identity may not auto-promote runtime');

const spotlightIds = new Set(spotlightEnemyCharacterEntries.map((entry) => entry.enemyId));
const legacyEnemyIds = new Set(yatsukageCallNames.map((entry) => entry.enemyId));
const sakuyazaEnemyIds = new Set(sakumeiCandidateMembers.map((entry) => entry.enemyId));
const legacyCallNames = new Set(yatsukageCallNames.map((entry) => entry.callName));
const sakuyazaCallNames = new Set(sakumeiCandidateMembers.map((entry) => entry.callName));

assert(legacyEnemyIds.size === sakuyazaEnemyIds.size, 'legacy/Sakuyaza Enemy ID count mismatch');
assert(legacyCallNames.size === sakuyazaCallNames.size, 'legacy/Sakuyaza call-name count mismatch');
for (const id of legacyEnemyIds) assert(sakuyazaEnemyIds.has(id), `legacy Enemy ID missing from Sakuyaza migration: ${id}`);
for (const callName of legacyCallNames) assert(sakuyazaCallNames.has(callName), `legacy call name missing from Sakuyaza migration: ${callName}`);

for (const entry of yatsukageCallNames) {
  assert(spotlightIds.has(entry.enemyId), `non-Spotlight enemy entered legacy call-name source: ${entry.enemyId}`);
  const enemy = enemyById.get(entry.enemyId);
  assert(enemy, `unknown Enemy48 id in legacy call-name source: ${entry.enemyId}`);
  assert(enemy.name === entry.currentEnemyName, `Enemy48 Current name drift for ${entry.enemyId}: ${enemy.name} != ${entry.currentEnemyName}`);
  assert(entry.callName.length >= 2 && entry.callName.length <= 6, `call name should stay short: ${entry.callName}`);
  assert(!entry.trueNameFrozen, `true name accidentally frozen: ${entry.enemyId}`);
  assert(!entry.factionMembershipImplied, `legacy call-name row accidentally implies faction membership: ${entry.enemyId}`);
}

for (const forbidden of ['kuroori', 'yui', 'asa', 'nagi', 'michiru', 'tomori']) {
  assert(!yatsukageCallNames.some((entry) => entry.callName.toLowerCase() === forbidden), `Current Character name collision: ${forbidden}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  legacyFormalName: YATSUKAGE_GROUP_IDENTITY.formalName,
  currentFormalName: SAKUYAZA_CURRENT_IDENTITY.formalName,
  legacyAuthority: YATSUKAGE_GROUP_IDENTITY.authority,
  memberCount: yatsukageIdentitySummary.memberCount,
  migratedEnemyIdCount: sakuyazaEnemyIds.size,
  migratedCallNameCount: sakuyazaCallNames.size,
  callNames: yatsukageCallNames.map((entry) => entry.callName),
}, null, 2));
