import {
  applyYatsukageEncounterMemoryEvent,
  buildYatsukageRelationPresentation,
  buildYatsukageTrioEncounterPresentationPlan,
  createEmptyYatsukageRelationMemoryState,
  replayYatsukageEncounterMemory,
  yatsukageEncounterMemorySummary,
} from '../../src/game/data/yatsukageEncounterMemorySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const summary = yatsukageEncounterMemorySummary;
assert(summary.relationCount === 168, `八影 relation memory must cover 168 relations, got ${summary.relationCount}`);
assert(summary.phaseCount === 4, `八影 relation memory phases must be four, got ${summary.phaseCount}`);
assert(summary.semanticProgressEventCount === 4, 'only four semantic observation events may deepen presentation');
assert(summary.combatClearProgressValue === 0, 'combat clear must not deepen 八影 relationship');
assert(summary.duplicateEventIdempotent, 'duplicate semantic event IDs must be idempotent');
assert(!summary.readingGrantsPower, 'reading 八影 relation must not grant power');
assert(!summary.friendshipOrRecruitmentProgressCreated, '八影 encounter memory must not create friendship/recruitment progress');
assert(!summary.runtimeImplemented, 'Content ledger contract must not claim runtime implementation');

let state = createEmptyYatsukageRelationMemoryState('boss_name_without_owner', 'yui');
assert(state.phase === 'FIRST_ENCOUNTER', 'empty state must present first-encounter reaction');

for (let i = 0; i < 20; i += 1) {
  state = applyYatsukageEncounterMemoryEvent(state, {
    eventId: `clear-${i}`,
    enemyId: 'boss_name_without_owner',
    characterId: 'yui',
    kind: 'COMBAT_CLEAR',
  });
}
assert(state.phase === 'FIRST_ENCOUNTER', 'combat-clear farming may not advance relationship phase');
assert(state.combatClearCountObserved === 20, 'combat clear may be observed for analytics without becoming relationship power');

state = applyYatsukageEncounterMemoryEvent(state, {
  eventId: 'first', enemyId: 'boss_name_without_owner', characterId: 'yui', kind: 'FIRST_ENCOUNTER_SEEN',
});
state = applyYatsukageEncounterMemoryEvent(state, {
  eventId: 'name', enemyId: 'boss_name_without_owner', characterId: 'yui', kind: 'CALL_NAME_OBSERVED',
});
assert(state.phase === 'CALL_NAME_RECOGNIZED', 'first encounter + call name should reach CALL_NAME_RECOGNIZED');

const duplicateReplay = replayYatsukageEncounterMemory('boss_name_without_owner', 'yui', [
  { eventId: 'first', enemyId: 'boss_name_without_owner', characterId: 'yui', kind: 'FIRST_ENCOUNTER_SEEN' },
  { eventId: 'name', enemyId: 'boss_name_without_owner', characterId: 'yui', kind: 'CALL_NAME_OBSERVED' },
  { eventId: 'name', enemyId: 'boss_name_without_owner', characterId: 'yui', kind: 'CALL_NAME_OBSERVED' },
  { eventId: 'past', enemyId: 'boss_name_without_owner', characterId: 'yui', kind: 'PAST_FRAGMENT_OBSERVED' },
]);
assert(duplicateReplay.phase === 'PAST_CONTEXT_KNOWN', 'duplicate event IDs must not break progression');

const reinterpreted = replayYatsukageEncounterMemory('boss_name_without_owner', 'yui', [
  { eventId: 'reinterpret-too-early', enemyId: 'boss_name_without_owner', characterId: 'yui', kind: 'REINTERPRETATION_BEAT_SEEN' },
  { eventId: 'first', enemyId: 'boss_name_without_owner', characterId: 'yui', kind: 'FIRST_ENCOUNTER_SEEN' },
  { eventId: 'name', enemyId: 'boss_name_without_owner', characterId: 'yui', kind: 'CALL_NAME_OBSERVED' },
  { eventId: 'past', enemyId: 'boss_name_without_owner', characterId: 'yui', kind: 'PAST_FRAGMENT_OBSERVED' },
]);
assert(reinterpreted.phase === 'REINTERPRETED', 'out-of-order semantic observations may resolve once all prerequisites are known');
assert(!reinterpreted.powerRewardGrantedByReading, 'reinterpreted relation may not grant power');

const presentation = buildYatsukageRelationPresentation(reinterpreted);
assert(presentation.phase === 'REINTERPRETED', 'presentation must match memory phase');
assert(presentation.enemyDisplayName.includes('ナシロ'), 'presentation must use 八影 call name after recognition');
assert(!presentation.powerRewardAttached, 'presentation must remain editorial, not power reward');

const asaState = replayYatsukageEncounterMemory('boss_name_without_owner', 'asa', [
  { eventId: 'asa-first', enemyId: 'boss_name_without_owner', characterId: 'asa', kind: 'FIRST_ENCOUNTER_SEEN' },
]);
const nagiState = createEmptyYatsukageRelationMemoryState('boss_name_without_owner', 'nagi');
const trio = buildYatsukageTrioEncounterPresentationPlan(
  'boss_name_without_owner',
  ['yui', 'asa', 'nagi'],
  [reinterpreted, asaState, nagiState],
);
assert(trio.personalPresentations.length === 3, 'trio encounter memory must expose three personal presentations');
assert(new Set(trio.openingCandidates).size === 3, 'opening candidates must preserve all three party members');
assert(new Set(trio.tacticalReplyCandidates).size === 3, 'tactical candidates must preserve all three party members');
assert(new Set(trio.afterimageCandidates).size === 3, 'afterimage candidates must preserve all three party members');
assert(trio.sameSpeakerMayNotTakeAllThreeSlots, 'one character may not monopolize enemy dialogue');
assert(!trio.combatClearFarmAdvancesRelationship, 'trio combat clear may not farm enemy relationship');
assert(trio.runtimeSpeakerHistoryRequiredForFinalArbitration, 'final speaker choice must wait for runtime seen-line history');

console.log(JSON.stringify({ status: 'PASS', summary, samplePhase: reinterpreted.phase, trio }, null, 2));
