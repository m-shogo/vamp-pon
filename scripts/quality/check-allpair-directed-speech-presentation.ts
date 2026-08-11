import {
  BASELINE_ADDRESS_STATUS,
  allPairDirectedSpeechLanes,
  allPairDirectedSpeechPresentationSummary,
  resolveAllPairDirectedSpeechPresentation,
} from '../../src/game/data/allPairDirectedSpeechPresentationSource.ts';
import { CURRENT_RELATIONSHIP_CHARACTER_IDS } from '../../src/game/data/currentRelationshipInventory.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const summary = allPairDirectedSpeechPresentationSummary;
assert(summary.pairCount === 210, `pair count must remain 210, got ${summary.pairCount}`);
assert(summary.directedLaneCount === 420, `directed presentation lanes must be 420, got ${summary.directedLaneCount}`);
assert(summary.featuredDirectedLaneCount === 48, `Featured24 must provide 48 authored directions, got ${summary.featuredDirectedLaneCount}`);
assert(summary.baselineDirectedLaneCount === 372, `remaining 186 pairs must provide 372 fallback directions, got ${summary.baselineDirectedLaneCount}`);
assert(summary.speakerProfileCount === 21, `all Current21 need a fallback voice profile, got ${summary.speakerProfileCount}`);
assert(summary.addressPrototypeNotCanonCount === 372, 'baseline exact default address drafts must remain explicitly non-Canon');
assert(summary.affinityAsymmetryPreserved, 'directed Affinity asymmetry must be preserved');
assert(!summary.universalNicknameProgressionRequired, 'high Bond may not require nickname/call-name changes');
assert(!summary.romanceAutoPromotionAllowed, 'score may not auto-promote romance');
assert(!summary.runtimeAutoPromotionAllowed, 'prototype presentation may not auto-promote runtime');

const uniqueDirections = new Set(allPairDirectedSpeechLanes.map((entry) => entry.directionKey));
assert(uniqueDirections.size === 420, 'all directed relationship speech keys must be unique');
for (const characterId of CURRENT_RELATIONSHIP_CHARACTER_IDS) {
  const outgoing = allPairDirectedSpeechLanes.filter((entry) => entry.speakerId === characterId);
  const incoming = allPairDirectedSpeechLanes.filter((entry) => entry.targetId === characterId);
  assert(outgoing.length === 20, `${characterId} must speak toward the other 20 Current characters`);
  assert(incoming.length === 20, `${characterId} must receive speech from the other 20 Current characters`);
}

const yuiToAsaEarly = resolveAllPairDirectedSpeechPresentation({
  speakerId: 'yui', targetId: 'asa', sharedBondScore: 0, directedAffinityScore: 0, storyGateState: 'NONE', crisisActive: false,
});
const yuiToAsaDawn = resolveAllPairDirectedSpeechPresentation({
  speakerId: 'yui', targetId: 'asa', sharedBondScore: 100, directedAffinityScore: 100, storyGateState: 'DAWN_PROOF', crisisActive: false,
});
assert(yuiToAsaEarly.source === 'FEATURED_AUTHORED_OVERRIDE', 'Yui/Asa must use authored override');
assert(yuiToAsaEarly.address === 'アサちゃん', `Yui early address drift: ${yuiToAsaEarly.address}`);
assert(yuiToAsaDawn.address === 'アサ', `Yui dawn address drift: ${yuiToAsaDawn.address}`);
assert(yuiToAsaDawn.addressStatus === 'AUTHORED_CURRENT', 'Featured address must be Current-authored');

const koyoriToRitsu = resolveAllPairDirectedSpeechPresentation({
  speakerId: 'koyori', targetId: 'ritsu', sharedBondScore: 100, directedAffinityScore: 100, storyGateState: 'DAWN_PROOF', crisisActive: false,
});
assert(koyoriToRitsu.address === 'お兄ちゃん', 'Koyori must keep sibling address even at max scores');
assert(!koyoriToRitsu.romanceAutoPromotionAllowed, 'sibling relation may never auto-promote romance');

const yuiToNagi = resolveAllPairDirectedSpeechPresentation({
  speakerId: 'yui', targetId: 'nagi', sharedBondScore: 80, directedAffinityScore: 80, storyGateState: 'CHOSEN_TRUST', crisisActive: false,
});
const nagiToYui = resolveAllPairDirectedSpeechPresentation({
  speakerId: 'nagi', targetId: 'yui', sharedBondScore: 80, directedAffinityScore: 10, storyGateState: 'CHOSEN_TRUST', crisisActive: false,
});
assert(yuiToNagi.source === 'BASELINE_GENERIC_REGISTER', 'Yui/Nagi should exercise baseline fallback');
assert(nagiToYui.source === 'BASELINE_GENERIC_REGISTER', 'Nagi/Yui should exercise baseline fallback');
assert(yuiToNagi.effectiveMoment === 'DEEP_TRUST', `expected Yui->Nagi DEEP_TRUST, got ${yuiToNagi.effectiveMoment}`);
assert(nagiToYui.effectiveMoment === 'FIRST_READ', `low directed affinity must keep Nagi->Yui guarded, got ${nagiToYui.effectiveMoment}`);
assert(yuiToNagi.addressStatus === BASELINE_ADDRESS_STATUS, 'baseline address must remain prototype/non-Canon');
assert(nagiToYui.addressStatus === BASELINE_ADDRESS_STATUS, 'baseline reverse address must remain prototype/non-Canon');

const baselineNoDawnProof = resolveAllPairDirectedSpeechPresentation({
  speakerId: 'yui', targetId: 'nagi', sharedBondScore: 100, directedAffinityScore: 100, storyGateState: 'CHOSEN_TRUST', crisisActive: false,
});
const baselineWithDawnProof = resolveAllPairDirectedSpeechPresentation({
  speakerId: 'yui', targetId: 'nagi', sharedBondScore: 100, directedAffinityScore: 100, storyGateState: 'DAWN_PROOF', crisisActive: false,
});
assert(baselineNoDawnProof.effectiveMoment === 'DEEP_TRUST', 'baseline relation may not present DAWN before Dawn proof');
assert(baselineWithDawnProof.effectiveMoment === 'DAWN', 'baseline relation should be eligible for Dawn presentation after Dawn proof');

const crisis = resolveAllPairDirectedSpeechPresentation({
  speakerId: 'yui', targetId: 'nagi', sharedBondScore: 80, directedAffinityScore: 80, storyGateState: 'CHOSEN_TRUST', crisisActive: true,
});
assert(crisis.effectiveMoment === 'CRISIS', 'crisis must temporarily override presentation');
assert(crisis.combinedSpeechScore === 80, 'crisis presentation may not reduce stored/combined prototype score');

console.log(JSON.stringify({
  status: 'PASS',
  summary,
  featuredExample: { early: yuiToAsaEarly.address, dawn: yuiToAsaDawn.address },
  asymmetricBaselineExample: { yuiToNagi: yuiToNagi.effectiveMoment, nagiToYui: nagiToYui.effectiveMoment },
}, null, 2));
