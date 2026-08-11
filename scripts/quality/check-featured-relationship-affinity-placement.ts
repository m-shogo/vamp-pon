import { CURRENT_RELATIONSHIP_CHARACTER_IDS } from '../../src/game/data/currentRelationshipInventory.ts';
import {
  FEATURED_AFFINITY_PLACEMENT_WINDOWS,
  featuredRelationshipAffinityBeatPlacements,
  featuredRelationshipAffinityPlacementSummary,
  resolveFeaturedAffinityBeatPlacement,
} from '../../src/game/data/featuredRelationshipAffinityPlacementSource.ts';
import { series1StageCampaignContentEntries } from '../../src/game/data/series1StageCampaignContentSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const summary = featuredRelationshipAffinityPlacementSummary;
assert(summary.stageCount === 20, `Title1 Stage count must remain 20, got ${summary.stageCount}`);
assert(summary.relationCount === 24, `Featured relation count must remain 24, got ${summary.relationCount}`);
assert(summary.beatPlacementCount === 72, `all 72 Featured Affinity beats need placement, got ${summary.beatPlacementCount}`);
assert(summary.frictionPlacementCount === 24, 'all 24 friction beats need placement');
assert(summary.recognitionPlacementCount === 24, 'all 24 recognition beats need placement');
assert(summary.chosenTrustPlacementCount === 24, 'all 24 chosen-trust beats need placement');
assert(summary.resultPresentationCapPerRun === 1, 'one Result may present at most one relationship beat');
assert(summary.allBeatsHaveHubFallback, 'all relationship beats need Hub fallback');
assert(summary.allBeatsReplayable, 'seen relationship beats must be replayable');
assert(!summary.anyBeatRequiredForMainStory, 'Featured relationship beats may not gate Main Story');
assert(!summary.anyBeatBlocksStage20Clear, 'unseen relationship beats may not block Stage20 clear');
assert(!summary.readingGrantsPower, 'reading relationship scenes may not grant combat power');
assert(!summary.exactStageFrozen, 'exact Stage placement must remain flexible until editorial lock');
assert(!summary.runtimeAutoPromotionAllowed, 'placement content may not auto-promote runtime');

assert(FEATURED_AFFINITY_PLACEMENT_WINDOWS.length === 3, 'FRICTION/RECOGNITION/CHOSEN_TRUST need three windows');
const windowKinds = new Set(FEATURED_AFFINITY_PLACEMENT_WINDOWS.map((entry) => entry.beatKind));
assert(windowKinds.size === 3, 'placement windows must be unique by beat kind');
for (const window of FEATURED_AFFINITY_PLACEMENT_WINDOWS) {
  const [start, end] = window.preferredResultWindow;
  assert(start <= end, `${window.beatKind} preferred Result window is inverted`);
  assert(window.unlockAfterStageOrdinal <= start, `${window.beatKind} must unlock by preferred Result window`);
  assert(window.hubFallbackAfterStageOrdinal >= start, `${window.beatKind} Hub fallback may not pre-empt its preferred Result window`);
  assert(window.latestEditorialWindowStageOrdinal <= 19, `${window.beatKind} editorial window must finish before Stage20 ending`);
  assert(!window.mainStoryRequired && !window.exactStageFrozen, `${window.beatKind} may not become a hard Main Story Stage lock`);
}

const placementIds = new Set(featuredRelationshipAffinityBeatPlacements.map((entry) => entry.beatId));
assert(placementIds.size === 72, 'Featured Affinity placement IDs must all be unique');
for (const placement of featuredRelationshipAffinityBeatPlacements) {
  assert(placement.requiresBothParticipantsInSelectedPartyForResult, `${placement.beatId} Result must require the actual pair in selected Party`);
  assert(placement.requiresBothParticipantsAvailableForHub, `${placement.beatId} Hub scene must require both participants available`);
  assert(placement.resultPresentationCapPerRun === 1, `${placement.beatId} Result cap drift`);
  assert(placement.unseenBeatsRemainAvailable, `${placement.beatId} must remain available after missing preferred Result`);
  assert(!placement.mainStoryRequired, `${placement.beatId} may not gate Main Story`);
  assert(!placement.stage20ClearBlockedIfUnseen, `${placement.beatId} may not block Stage20 clear`);
  assert(!placement.readingGrantsPower, `${placement.beatId} reading may not grant power`);
  assert(!placement.exactStageFrozen, `${placement.beatId} exact Stage may not be frozen yet`);
}

const stage3 = series1StageCampaignContentEntries[2]?.stageId;
const stage7 = series1StageCampaignContentEntries[6]?.stageId;
const stage8 = series1StageCampaignContentEntries[7]?.stageId;
const stage19 = series1StageCampaignContentEntries[18]?.stageId;
const stage20 = series1StageCampaignContentEntries[19]?.stageId;
assert(stage3 && stage7 && stage8 && stage19 && stage20, 'Title1 Stage ordinals 3/7/8/19/20 must exist');

const allAvailable = [...CURRENT_RELATIONSHIP_CHARACTER_IDS];
const earlyResult = resolveFeaturedAffinityBeatPlacement({
  currentStageId: stage3,
  clearedStageOrdinal: 3,
  selectedParty: ['yui', 'asa', 'nagi'],
  availableCharacterIds: allAvailable,
  seenBeatIds: [],
});
assert(earlyResult.resultCandidate?.relationId === 'yui-asa', `Yui/Asa friction should be Result-eligible with both selected, got ${earlyResult.resultCandidate?.relationId}`);
assert(earlyResult.resultCandidate.kind === 'FRICTION', 'early Result must surface friction before later beats');
assert(earlyResult.hubCandidates.length === 0, 'Hub fallback should not flood before its fallback milestone');

const missedParty = resolveFeaturedAffinityBeatPlacement({
  currentStageId: stage7,
  clearedStageOrdinal: 7,
  selectedParty: ['nagi', 'michiru', 'tomori'],
  availableCharacterIds: allAvailable,
  seenBeatIds: [],
});
assert(missedParty.hubCandidates.some((entry) => entry.relationId === 'yui-asa' && entry.kind === 'FRICTION'), 'missed Yui/Asa preferred Result must become available in Hub');

const twoEligiblePairs = resolveFeaturedAffinityBeatPlacement({
  currentStageId: stage7,
  clearedStageOrdinal: 7,
  selectedParty: ['yui', 'asa', 'tomori'],
  availableCharacterIds: allAvailable,
  seenBeatIds: [],
});
assert(twoEligiblePairs.resultCandidate !== null, 'a Party containing Featured pairs should receive a Result candidate');
assert(twoEligiblePairs.resultPresentationCap === 1, 'Result relationship presentation must remain capped at one');
const selectedPairRelations = new Set(['yui-asa', 'yui-tomori']);
assert(selectedPairRelations.has(twoEligiblePairs.resultCandidate.relationId), 'Result candidate must belong to an actually selected pair');
assert(twoEligiblePairs.hubCandidates.some((entry) => selectedPairRelations.has(entry.relationId) && entry.relationId !== twoEligiblePairs.resultCandidate?.relationId), 'the other eligible selected pair must remain recoverable through Hub fallback');

const yuiAsaFriction = featuredRelationshipAffinityBeatPlacements.find((entry) => entry.relationId === 'yui-asa' && entry.kind === 'FRICTION');
assert(yuiAsaFriction, 'Yui/Asa friction placement missing');
const afterSeen = resolveFeaturedAffinityBeatPlacement({
  currentStageId: stage8,
  clearedStageOrdinal: 8,
  selectedParty: ['yui', 'asa', 'nagi'],
  availableCharacterIds: allAvailable,
  seenBeatIds: [yuiAsaFriction.beatId],
});
assert(!afterSeen.hubCandidates.some((entry) => entry.beatId === yuiAsaFriction.beatId), 'seen beat may not reappear as unseen Hub candidate');
assert(afterSeen.replayCandidates.some((entry) => entry.beatId === yuiAsaFriction.beatId), 'seen beat must become Relationship Book replay candidate');

const lateNoPair = resolveFeaturedAffinityBeatPlacement({
  currentStageId: stage19,
  clearedStageOrdinal: 19,
  selectedParty: ['asa', 'nagi', 'michiru'],
  availableCharacterIds: allAvailable,
  seenBeatIds: [],
});
assert(lateNoPair.hubCandidates.some((entry) => entry.kind === 'CHOSEN_TRUST'), 'unseen late relationship beats must have Hub fallback by Stage19');

const endingSafety = resolveFeaturedAffinityBeatPlacement({
  currentStageId: stage20,
  clearedStageOrdinal: 20,
  selectedParty: ['yui', 'asa', 'nagi'],
  availableCharacterIds: allAvailable,
  seenBeatIds: [],
});
assert(!endingSafety.unseenRequiredForStage20Clear, 'unseen relationship scenes must never block Title1 Happy End');
assert(endingSafety.resultCandidate === null, 'Stage20 ending should not introduce/consume optional Featured relationship Result beats');

console.log(JSON.stringify({
  status: 'PASS',
  summary,
  earlyResult: earlyResult.resultCandidate,
  missedHubCount: missedParty.hubCandidates.length,
  endingHubCount: endingSafety.hubCandidates.length,
}, null, 2));
