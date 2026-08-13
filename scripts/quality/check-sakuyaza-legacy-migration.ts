import {
  SAKUYAZA_LEGACY_MIGRATION_POLICY,
  applySakuyazaEncounterMemoryEvent,
  buildSakuyazaRelationPresentation,
  createEmptySakuyazaRelationMemoryState,
  current21SakuyazaRelationshipEntries,
  sakuyazaCallNames,
  sakuyazaLegacyMigrationSummary,
  sakuyazaPairDynamics,
} from '../../src/game/data/sakuyazaLegacyMigrationSource.ts';
import { SAKUYAZA_CURRENT_IDENTITY } from '../../src/game/data/sakumeiCandidateSource.ts';
import { YATSUKAGE_GROUP_IDENTITY } from '../../src/game/data/yatsukageIdentitySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(SAKUYAZA_LEGACY_MIGRATION_POLICY.currentFormalName === '朔夜座', 'Current S1 formal name must be 朔夜座');
assert(SAKUYAZA_LEGACY_MIGRATION_POLICY.legacyShortLabel === '八影', 'legacy early observer label must remain 八影');
assert(SAKUYAZA_LEGACY_MIGRATION_POLICY.legacyLabelRole === 'EARLY_OBSERVER_LABEL_ONLY', '八影 role must remain early observer only');
assert(!SAKUYAZA_LEGACY_MIGRATION_POLICY.currentVisualMasterMayUseLegacyGroupName, 'Current Visual Master may not use 八影 as formal group name');
assert(!SAKUYAZA_LEGACY_MIGRATION_POLICY.currentGuideGroupLabelMayUseLegacyNameOutsideExplicitHistoricalContext, 'Guide may not present 八影 as Current group name');
assert(SAKUYAZA_LEGACY_MIGRATION_POLICY.currentLateRevealFormalLabelMustUseSakuyaza, 'late formal reveal must use 朔夜座');
assert(!SAKUYAZA_LEGACY_MIGRATION_POLICY.runtimeAutoPromotionAllowed, 'migration facade may not auto-promote runtime');

assert(YATSUKAGE_GROUP_IDENTITY.authority === 'SUPERSEDED_LEGACY_OBSERVER_LABEL', 'legacy machine source must remain demoted');
assert(!YATSUKAGE_GROUP_IDENTITY.mayBeCurrentFormalTeamName, 'legacy machine source may not regain Current authority');
assert(SAKUYAZA_CURRENT_IDENTITY.formalName === '朔夜座', 'Sakuyaza Current authority drift');
assert(SAKUYAZA_CURRENT_IDENTITY.seasonScope === 'S1', 'Sakuyaza must remain S1-scoped');

assert(sakuyazaLegacyMigrationSummary.enemyIdSetMatches, 'legacy/current enemy ID set mismatch');
assert(sakuyazaLegacyMigrationSummary.currentMemberCount === 8, 'Sakuyaza S1 roster count drift');
assert(sakuyazaLegacyMigrationSummary.legacyCallNameCount === 8, 'legacy call-name count drift');
assert(sakuyazaLegacyMigrationSummary.current21RelationCount === 168, 'Current21 x Sakuyaza relation lane count drift');
assert(sakuyazaLegacyMigrationSummary.pairCount === 28, 'Sakuyaza pair reservoir must preserve 8C2=28');
assert(sakuyazaLegacyMigrationSummary.encounterMemoryPhaseCount === 4, 'encounter-memory phase count drift');
assert(current21SakuyazaRelationshipEntries.length === 168, 'Current alias relationship entries drift');
assert(sakuyazaPairDynamics.length === 28, 'Current alias pair dynamics drift');
assert(sakuyazaCallNames.length === 8, 'Current alias call-name count drift');

const enemyId = sakuyazaCallNames[0].enemyId;
let state = createEmptySakuyazaRelationMemoryState(enemyId, 'yui');
const migrationEvents = [
  'FIRST_ENCOUNTER_SEEN',
  'CALL_NAME_OBSERVED',
  'PAST_FRAGMENT_OBSERVED',
  'REINTERPRETATION_BEAT_SEEN',
] as const;
for (const [index, kind] of migrationEvents.entries()) {
  state = applySakuyazaEncounterMemoryEvent(state, {
    eventId: `migration-check-${index}`,
    enemyId,
    characterId: 'yui',
    kind,
  });
}

const presentation = buildSakuyazaRelationPresentation(state);
assert(state.phase === 'REINTERPRETED', 'migration test must reach REINTERPRETED');
assert(presentation.enemyDisplayName.startsWith('朔夜座・'), `Current late presentation must use 朔夜座: ${presentation.enemyDisplayName}`);
assert(!presentation.enemyDisplayName.startsWith('八影・'), 'Current late presentation may not use 八影 as formal label');

console.log(JSON.stringify({
  status: 'PASS',
  currentFormalName: sakuyazaLegacyMigrationSummary.currentFormalName,
  legacyObserverLabel: sakuyazaLegacyMigrationSummary.legacyObserverLabel,
  memberCount: sakuyazaLegacyMigrationSummary.currentMemberCount,
  relationCount: sakuyazaLegacyMigrationSummary.current21RelationCount,
  pairCount: sakuyazaLegacyMigrationSummary.pairCount,
  latePresentation: presentation.enemyDisplayName,
}, null, 2));
