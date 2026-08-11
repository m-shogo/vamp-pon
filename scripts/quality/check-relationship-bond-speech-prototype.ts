import {
  PROTOTYPE_BOND_EVENT_WEIGHTS,
  PROTOTYPE_BOND_THRESHOLDS,
  RELATIONSHIP_BOND_TUNING_STATUS,
  relationshipBondSpeechPrototypeSummary,
  resolvePrototypeBondScoreMoment,
  resolvePrototypeRelationshipSpeech,
} from '../../src/game/data/relationshipBondSpeechPrototypeSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[Relationship Bond Speech Prototype] ${message}`);
}

assert(RELATIONSHIP_BOND_TUNING_STATUS === 'PROTOTYPE_TUNING_NOT_FINAL', 'prototype tuning status drift');
assert(relationshipBondSpeechPrototypeSummary.relationshipCount === 24, 'must cover Current24 relation lanes');
assert(relationshipBondSpeechPrototypeSummary.directedSpeechTrackCount === 48, 'must resolve all 48 directed speech tracks');
assert(relationshipBondSpeechPrototypeSummary.numericValuesFinal === false, 'prototype numbers may not become final Content Canon');
assert(relationshipBondSpeechPrototypeSummary.crisisIsSeparateFromMonotonicBond === true, 'CRISIS must stay outside monotonic Bond tiers');
assert(relationshipBondSpeechPrototypeSummary.detailedArcDeepTrustRequiresStoryGate === true, 'detailed arcs need story gate before DEEP_TRUST');
assert(relationshipBondSpeechPrototypeSummary.dawnRequiresDawnProof === true, 'DAWN voice requires Dawn proof');
assert(relationshipBondSpeechPrototypeSummary.readingDialogueAddsBondScore === false, 'reading dialogue may not add Bond score');
assert(relationshipBondSpeechPrototypeSummary.romanceAutoPromotionAllowed === false, 'Bond score may not auto-create romance');
assert(relationshipBondSpeechPrototypeSummary.runtimeAutoPromotionAllowed === false, 'prototype may not auto-promote runtime');

const thresholds = [
  PROTOTYPE_BOND_THRESHOLDS.FIRST_READ,
  PROTOTYPE_BOND_THRESHOLDS.ALLY,
  PROTOTYPE_BOND_THRESHOLDS.TRUST,
  PROTOTYPE_BOND_THRESHOLDS.DEEP_TRUST,
  PROTOTYPE_BOND_THRESHOLDS.DAWN,
];
for (let index = 1; index < thresholds.length; index += 1) {
  assert(thresholds[index] > thresholds[index - 1], 'prototype thresholds must be strictly increasing');
}
assert(resolvePrototypeBondScoreMoment(-100) === 'FIRST_READ', 'score lower clamp drift');
assert(resolvePrototypeBondScoreMoment(15) === 'ALLY', 'ALLY threshold drift');
assert(resolvePrototypeBondScoreMoment(35) === 'TRUST', 'TRUST threshold drift');
assert(resolvePrototypeBondScoreMoment(65) === 'DEEP_TRUST', 'DEEP_TRUST threshold drift');
assert(resolvePrototypeBondScoreMoment(90) === 'DAWN', 'DAWN threshold drift');
assert(resolvePrototypeBondScoreMoment(999) === 'DAWN', 'score upper clamp drift');

const yuiAsaFirst = resolvePrototypeRelationshipSpeech({
  relationId: 'yui-asa', speakerId: 'yui', bondScore: 0, storyGateState: 'NONE', crisisActive: false,
});
assert(yuiAsaFirst.effectiveMoment === 'FIRST_READ', 'Yui/Asa first moment drift');
assert(yuiAsaFirst.address === 'アサちゃん', 'Yui must start with アサちゃん in prototype presentation');
assert(yuiAsaFirst.romanceBoundary === 'NON_ROMANCE_LOCKED', 'Yui/Asa non-romance guard drift');

const yuiAsaScoreDeepNoStory = resolvePrototypeRelationshipSpeech({
  relationId: 'yui-asa', speakerId: 'yui', bondScore: 80, storyGateState: 'NONE', crisisActive: false,
});
assert(yuiAsaScoreDeepNoStory.scoreEligibleMoment === 'DEEP_TRUST', 'score eligibility should reach DEEP_TRUST');
assert(yuiAsaScoreDeepNoStory.effectiveMoment === 'TRUST', 'detailed arc must cap at TRUST before Chosen Trust story gate');
assert(yuiAsaScoreDeepNoStory.address === 'アサ', 'Yui/Asa TRUST address drift');

const yuiAsaChosen = resolvePrototypeRelationshipSpeech({
  relationId: 'yui-asa', speakerId: 'yui', bondScore: 80, storyGateState: 'CHOSEN_TRUST', crisisActive: false,
});
assert(yuiAsaChosen.effectiveMoment === 'DEEP_TRUST', 'Chosen Trust must unlock DEEP_TRUST when score eligible');

const yuiAsaNoDawnProof = resolvePrototypeRelationshipSpeech({
  relationId: 'yui-asa', speakerId: 'yui', bondScore: 100, storyGateState: 'CHOSEN_TRUST', crisisActive: false,
});
assert(yuiAsaNoDawnProof.effectiveMoment === 'DEEP_TRUST', 'high score alone may not unlock DAWN voice');

const yuiAsaDawn = resolvePrototypeRelationshipSpeech({
  relationId: 'yui-asa', speakerId: 'yui', bondScore: 100, storyGateState: 'DAWN_PROOF', crisisActive: false,
});
assert(yuiAsaDawn.effectiveMoment === 'DAWN', 'Dawn proof + eligible score should expose DAWN voice');

const asaYuiDawn = resolvePrototypeRelationshipSpeech({
  relationId: 'yui-asa', speakerId: 'asa', bondScore: 100, storyGateState: 'DAWN_PROOF', crisisActive: false,
});
assert(asaYuiDawn.address === 'ユイ', 'Asa must not need address change to show deep trust');

const yuiAsaCrisis = resolvePrototypeRelationshipSpeech({
  relationId: 'yui-asa', speakerId: 'yui', bondScore: 100, storyGateState: 'DAWN_PROOF', crisisActive: true,
});
assert(yuiAsaCrisis.effectiveMoment === 'CRISIS', 'CRISIS must override presentation without reducing stored Bond');
assert(yuiAsaCrisis.normalizedBondScore === 100, 'CRISIS may not erase stored Bond score');

const koyoriRitsu = resolvePrototypeRelationshipSpeech({
  relationId: 'ritsu-koyori', speakerId: 'koyori', bondScore: 100, storyGateState: 'DAWN_PROOF', crisisActive: false,
});
assert(koyoriRitsu.address === 'お兄ちゃん', 'Koyori must retain sibling address at Dawn');
assert(koyoriRitsu.romanceBoundary === 'SIBLING_NON_ROMANCE_LOCKED', 'sibling non-romance boundary drift');

const michiruGen = resolvePrototypeRelationshipSpeech({
  relationId: 'gen-michiru', speakerId: 'michiru', bondScore: 100, storyGateState: 'DAWN_PROOF', crisisActive: false,
});
assert(michiruGen.address === 'ゲンさん', 'high Bond must not force universal call-by-first-name/no-honorific style');

const asaKasumiCoverage = resolvePrototypeRelationshipSpeech({
  relationId: 'asa-kasumi', speakerId: 'asa', bondScore: 80, storyGateState: 'NONE', crisisActive: false,
});
assert(asaKasumiCoverage.detailedArcStoryGateRequired === false, 'coverage-only arc should not pretend detailed machine story gate exists');
assert(asaKasumiCoverage.effectiveMoment === 'DEEP_TRUST', 'coverage-only arc may reach DEEP_TRUST via prototype score while exact incident remains unfrozen');

const readEvent = PROTOTYPE_BOND_EVENT_WEIGHTS.find((event) => event.id === 'READ_DIALOGUE');
assert(readEvent?.scoreDelta === 0 && readEvent.perRunCap === 0, 'READ_DIALOGUE must not become gameplay-power payment');
const repeatedStage = PROTOTYPE_BOND_EVENT_WEIGHTS.find((event) => event.id === 'REPEATED_SAME_STAGE_DAWN');
assert(repeatedStage?.scoreDelta === 1 && repeatedStage.perRunCap === 1, 'same-stage grinding must remain heavily diminished in prototype');
for (const event of PROTOTYPE_BOND_EVENT_WEIGHTS) {
  assert(event.scoreDelta >= 0, `${event.id}: Bond prototype must not turn disagreement into negative affinity debt`);
  assert(event.perRunCap >= event.scoreDelta || event.scoreDelta === 0, `${event.id}: per-run cap must permit at least one application`);
}

let rejectedNaN = false;
try {
  resolvePrototypeBondScoreMoment(Number.NaN);
} catch {
  rejectedNaN = true;
}
assert(rejectedNaN, 'non-finite Bond score must fail closed');

console.log(`Relationship Bond Speech Prototype: PASS (relations=24, directed=48, tuning=${RELATIONSHIP_BOND_TUNING_STATUS})`);
