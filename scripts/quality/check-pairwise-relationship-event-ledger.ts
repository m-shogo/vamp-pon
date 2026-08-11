import {
  PAIRWISE_RELATIONSHIP_EVENT_RULES,
  admitPairwiseRelationshipLedgerEvent,
  buildTrioAssistRelationshipEvent,
  decomposeTrioSharedDawnEvents,
  pairwiseRelationshipEventLedgerSummary,
} from '../../src/game/data/pairwiseRelationshipEventLedgerSource.ts';
import { PROTOTYPE_BOND_EVENT_WEIGHTS } from '../../src/game/data/relationshipBondSpeechPrototypeSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function expectThrow(run: () => unknown, message: string): void {
  let threw = false;
  try {
    run();
  } catch {
    threw = true;
  }
  assert(threw, message);
}

const summary = pairwiseRelationshipEventLedgerSummary;
assert(summary.eventKindCount === 12, `relationship event kinds must be 12, got ${summary.eventKindCount}`);
assert(summary.legacyPrototypeBondEventKindCount === 7, `legacy prototype Bond event kinds should be 7, got ${summary.legacyPrototypeBondEventKindCount}`);
assert(summary.legacyPrototypeBondEventKindsCovered === 7, `all seven legacy Bond event kinds must be covered, got ${summary.legacyPrototypeBondEventKindsCovered}`);
assert(summary.bondIsSharedHistory, 'Bond must remain shared pair history');
assert(summary.bondCombatGrowthAllowed, 'meaningful combat history may grow shared Bond');
assert(!summary.genericCombatAffinityGrowthAllowed, 'generic combat may not manufacture directed Affinity');
assert(summary.affinityChangesRequireAuthoredDirection, 'Affinity changes must require authored direction');
assert(summary.authoredAffinityMayDecrease, 'authored story events must be able to reduce one directed Affinity without rewriting Bond');
assert(!summary.combatDefeatDecreasesRelationship, 'combat defeat alone may not punish relationship state');
assert(!summary.dialogueReadChangesRelationship, 'reading dialogue may not change relationship power');
assert(summary.trioEventsDecomposeToPairs, 'trio relationship events must decompose into pair events');
assert(!summary.groupBondCreated, 'group/trio Bond must not exist');
assert(!summary.transitiveAffinityCreated, 'A→B and B→C may not create A→C Affinity');
assert(!summary.numericDeltaFrozen, 'numeric deltas must remain prototype/not frozen');
assert(!summary.runtimeImplemented, 'content ledger may not claim runtime implementation');
assert(!summary.runtimeAutoPromotionAllowed, 'content ledger may not auto-promote runtime');

const ruleKinds = new Set(PAIRWISE_RELATIONSHIP_EVENT_RULES.map((entry) => entry.kind));
for (const legacy of PROTOTYPE_BOND_EVENT_WEIGHTS) {
  assert(ruleKinds.has(legacy.id), `legacy Bond event missing from ledger: ${legacy.id}`);
}

const partySelected = admitPairwiseRelationshipLedgerEvent({
  eventId: 'party-select-yui-asa',
  kind: 'PARTY_SELECTED',
  participants: ['yui', 'asa'],
});
assert(partySelected.sharedBondCredit === 'NONE', 'party selection may not grant Bond');
assert(partySelected.directedAffinityCredit === 'NONE', 'party selection may not grant Affinity');

const assistEvent = buildTrioAssistRelationshipEvent(['yui', 'asa', 'nagi'], 'yui', 'asa', 'assist-001');
const assistAdmission = admitPairwiseRelationshipLedgerEvent(assistEvent);
assert(assistAdmission.pairKey === 'yui__asa', `Assist must credit actor/target pair only, got ${assistAdmission.pairKey}`);
assert(assistAdmission.sharedBondCredit === 'REPEATABLE_CAPPED', 'Assist should contribute capped shared Bond history');
assert(assistAdmission.directedAffinityCredit === 'NONE', 'generic Assist may not grant directed Affinity');
assert(assistAdmission.authoredAffinityDirections.length === 0, 'generic Assist may not carry hidden Affinity directions');

const affinityShift = admitPairwiseRelationshipLedgerEvent({
  eventId: 'asa-recognizes-yui-waited',
  kind: 'AUTHORED_AFFINITY_SHIFT',
  participants: ['yui', 'asa'],
  authoredAffinityDirections: [
    { from: 'asa', to: 'yui', direction: 'UP', reasonKey: 'asa_sees_yui_return_choice' },
  ],
});
assert(affinityShift.sharedBondCredit === 'NONE', 'pure authored Affinity shift need not modify shared history');
assert(affinityShift.directedAffinityCredit === 'EXPLICIT_DIRECTION_ONLY', 'authored Affinity shift must stay directional');
assert(affinityShift.authoredAffinityDirections[0]?.from === 'asa', 'authored direction must preserve A→B asymmetry');

const downwardShift = admitPairwiseRelationshipLedgerEvent({
  eventId: 'asa-frustrated-yui-overreach',
  kind: 'AUTHORED_AFFINITY_SHIFT',
  participants: ['yui', 'asa'],
  authoredAffinityDirections: [
    { from: 'asa', to: 'yui', direction: 'DOWN', reasonKey: 'asa_rejects_yui_overreach' },
  ],
});
assert(downwardShift.authoredAffinityDirections[0]?.direction === 'DOWN', 'authored Affinity must support story-driven decrease');

expectThrow(
  () => admitPairwiseRelationshipLedgerEvent({
    eventId: 'bad-assist-affinity',
    kind: 'ASSIST_SUCCESS',
    participants: ['yui', 'asa'],
    actorId: 'yui',
    targetId: 'asa',
    authoredAffinityDirections: [
      { from: 'asa', to: 'yui', direction: 'UP', reasonKey: 'generic_rescue_should_not_equal_like' },
    ],
  }),
  'ASSIST_SUCCESS must reject smuggled directed Affinity changes',
);

const mutualChoice = admitPairwiseRelationshipLedgerEvent({
  eventId: 'yui-asa-chosen-trust',
  kind: 'AUTHORED_MUTUAL_CHOICE',
  participants: ['yui', 'asa'],
  storyKey: 'yui_asa_chosen_trust_v1',
  authoredAffinityDirections: [
    { from: 'yui', to: 'asa', direction: 'UP', reasonKey: 'yui_chooses_changed_asa' },
    { from: 'asa', to: 'yui', direction: 'UNCHANGED', reasonKey: 'asa_trust_already_explicit' },
  ],
});
assert(mutualChoice.sharedBondCredit === 'ONCE_PER_STORY_KEY', 'mutual choice should record one shared story history');
assert(mutualChoice.authoredAffinityDirections.length === 2, 'mutual choice must author both directions independently');

expectThrow(
  () => admitPairwiseRelationshipLedgerEvent({
    eventId: 'bad-mutual-one-way',
    kind: 'AUTHORED_MUTUAL_CHOICE',
    participants: ['yui', 'asa'],
    storyKey: 'bad_mutual',
    authoredAffinityDirections: [
      { from: 'yui', to: 'asa', direction: 'UP', reasonKey: 'only_one_direction' },
    ],
  }),
  'AUTHORED_MUTUAL_CHOICE must require explicit outcomes for both directed Affinity lanes',
);

const trioDawnEvents = decomposeTrioSharedDawnEvents(
  ['yui', 'asa', 'nagi'],
  'forgotten_street',
  'dawn-run-001',
);
assert(trioDawnEvents.length === 3, `trio shared dawn must decompose to three pair events, got ${trioDawnEvents.length}`);
const trioDawnAdmissions = trioDawnEvents.map(admitPairwiseRelationshipLedgerEvent);
assert(new Set(trioDawnAdmissions.map((entry) => entry.pairKey)).size === 3, 'trio shared dawn must credit AB/AC/BC exactly once each');
assert(trioDawnAdmissions.every((entry) => !entry.groupBondCreated), 'trio shared dawn must never create group Bond');
assert(trioDawnAdmissions.every((entry) => entry.directedAffinityCredit === 'NONE'), 'shared dawn may not infer Affinity among all party members');

const defeat = admitPairwiseRelationshipLedgerEvent({
  eventId: 'defeat-yui-nagi',
  kind: 'COMBAT_DEFEAT',
  participants: ['yui', 'nagi'],
});
const readDialogue = admitPairwiseRelationshipLedgerEvent({
  eventId: 'read-yui-nagi',
  kind: 'READ_DIALOGUE',
  participants: ['yui', 'nagi'],
});
assert(defeat.sharedBondCredit === 'NONE' && defeat.directedAffinityCredit === 'NONE', 'combat defeat alone must not damage relationship');
assert(readDialogue.sharedBondCredit === 'NONE' && readDialogue.directedAffinityCredit === 'NONE', 'reading dialogue may not be relationship farming');

expectThrow(
  () => buildTrioAssistRelationshipEvent(['yui', 'asa', 'nagi'], 'yui', 'tomori', 'bad-assist'),
  'trio Assist must reject a target outside the selected party',
);

console.log(JSON.stringify({
  status: 'PASS',
  summary,
  assistAdmission,
  affinityShift,
  downwardShift,
  mutualChoice,
  trioPairKeys: trioDawnAdmissions.map((entry) => entry.pairKey),
}, null, 2));
