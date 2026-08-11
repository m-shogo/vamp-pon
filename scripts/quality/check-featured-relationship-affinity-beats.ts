import { currentRelationshipInventory } from '../../src/game/data/currentRelationshipInventory.ts';
import {
  featuredRelationshipAffinityArcs,
  featuredRelationshipAffinityBeatSummary,
  featuredRelationshipAffinityBeats,
} from '../../src/game/data/featuredRelationshipAffinityBeatSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const summary = featuredRelationshipAffinityBeatSummary;
assert(summary.relationCount === 24, `Featured Affinity arcs must cover Current24, got ${summary.relationCount}`);
assert(summary.beatCount === 72, `Current24 must have three Affinity beats each, got ${summary.beatCount}`);
assert(summary.frictionBeatCount === 24, 'every Featured relation needs one friction beat');
assert(summary.recognitionBeatCount === 24, 'every Featured relation needs one recognition beat');
assert(summary.chosenTrustBeatCount === 24, 'every Featured relation needs one chosen-trust beat');
assert(summary.downwardDirectedOutcomeCount >= 20, 'Featured relations need real friction/downward movement, not only positive progression');
assert(summary.unchangedDirectedOutcomeCount >= 3, 'Featured relations need multiple UNCHANGED outcomes so every climax is not artificial mutual-up');
assert(summary.upwardDirectedOutcomeCount >= 40, 'Featured relations still need substantial recognition/trust progression');
assert(!summary.exactIncidentFrozen, 'exact incidents must remain flexible until scene writing locks them');
assert(!summary.exactStageFrozen, 'exact Stage placement must remain flexible');
assert(!summary.numericDeltaFrozen, 'Affinity numeric deltas remain playtest tuning');
assert(!summary.romanceInferred, 'Affinity direction must not infer romance');
assert(!summary.runtimeAutoPromotionAllowed, 'Affinity beat content must not auto-promote runtime');

const currentIds = new Set(currentRelationshipInventory.map((entry) => entry.id));
const arcIds = new Set(featuredRelationshipAffinityArcs.map((entry) => entry.relationId));
assert(arcIds.size === 24, 'Featured Affinity relation IDs must be unique');
assert(currentIds.size === 24, 'Current relationship inventory must remain 24 for this contract');
for (const id of currentIds) assert(arcIds.has(id), `missing Featured Affinity arc for ${id}`);

const beatIds = new Set(featuredRelationshipAffinityBeats.map((entry) => entry.beatId));
assert(beatIds.size === 72, 'all Featured Affinity beat IDs must be unique');

for (const arc of featuredRelationshipAffinityArcs) {
  assert(arc.beats.length === 3, `${arc.relationId} must have exactly three beats`);
  assert(arc.beats[0].kind === 'FRICTION' && arc.beats[0].placementBand === 'EARLY_FLEX', `${arc.relationId} friction ordering drift`);
  assert(arc.beats[1].kind === 'RECOGNITION' && arc.beats[1].placementBand === 'MID_FLEX', `${arc.relationId} recognition ordering drift`);
  assert(arc.beats[2].kind === 'CHOSEN_TRUST' && arc.beats[2].placementBand === 'LATE_FLEX', `${arc.relationId} chosen-trust ordering drift`);
  assert(arc.asymmetricProgressionAllowed, `${arc.relationId} must permit asymmetric Affinity progression`);
  assert(arc.frictionMustNotEraseBond, `${arc.relationId} friction may not erase shared Bond history`);
  assert(arc.chosenTrustMustAuthorBothDirections, `${arc.relationId} chosen trust must author both directions separately`);
  assert(!arc.romanceInferred, `${arc.relationId} may not infer romance from Affinity`);

  const pair = new Set(arc.participants);
  for (const beat of arc.beats) {
    assert(beat.storyMeaning.length >= 25, `${beat.beatId} story meaning too thin`);
    assert(beat.gameplayEcho.length >= 15, `${beat.beatId} gameplay echo too thin`);
    assert(!beat.exactIncidentFrozen && !beat.exactStageFrozen, `${beat.beatId} may not freeze exact scene placement yet`);
    assert(!beat.numericDeltaFrozen, `${beat.beatId} numeric delta must remain unfrozen`);
    assert(!beat.romanceInferred, `${beat.beatId} may not infer romance`);
    assert(!beat.runtimeAutoPromotionAllowed, `${beat.beatId} may not auto-promote runtime`);
    for (const direction of beat.admission.authoredAffinityDirections) {
      assert(pair.has(direction.from) && pair.has(direction.to), `${beat.beatId} Affinity direction escaped its pair`);
    }
  }

  assert(arc.beats[0].admission.kind === 'AUTHORED_AFFINITY_SHIFT', `${arc.relationId} friction must be one directed authored shift`);
  assert(arc.beats[0].admission.authoredAffinityDirections.length === 1, `${arc.relationId} friction must move one direction only`);
  assert(arc.beats[1].admission.kind === 'AUTHORED_AFFINITY_SHIFT', `${arc.relationId} recognition must be one directed authored shift`);
  assert(arc.beats[1].admission.authoredAffinityDirections.length === 1, `${arc.relationId} recognition must move one direction only`);
  assert(arc.beats[2].admission.kind === 'AUTHORED_MUTUAL_CHOICE', `${arc.relationId} climax must use authored mutual choice`);
  assert(arc.beats[2].admission.authoredAffinityDirections.length === 2, `${arc.relationId} climax must specify both directions`);
}

const sibling = featuredRelationshipAffinityArcs.find((entry) => entry.relationId === 'ritsu-koyori');
assert(sibling, 'Ritsu/Koyori Featured arc missing');
const siblingChosen = sibling.beats[2].admission.authoredAffinityDirections;
assert(siblingChosen.some((entry) => entry.direction === 'UNCHANGED'), 'Ritsu/Koyori climax should preserve family love without forcing both scores upward');

const guarded = featuredRelationshipAffinityArcs.find((entry) => entry.relationId === 'yui-kuroori');
assert(guarded, 'Yui/Kuroori Featured arc missing');
assert(guarded.beats[2].admission.authoredAffinityDirections.some((entry) => entry.direction === 'UNCHANGED'), 'Yui/Kuroori should allow guarded trust to remain measured');

console.log(JSON.stringify({ status: 'PASS', summary, siblingChosen }, null, 2));
