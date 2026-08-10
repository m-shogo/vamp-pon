import { readFileSync } from 'node:fs';

import {
  COMBAT_ATTRIBUTES,
  attributeReactions,
  statusDefinitions,
} from '../../src/game/data/combatAffinitySource.ts';
import { series1StageCampaignContentEntries } from '../../src/game/data/series1StageCampaignContentSource.ts';
import {
  selectedTitle1BaseWeaponCandidates,
  heldBaseWeaponCandidates,
} from '../../src/game/data/baseWeaponSelectionSource.ts';
import {
  title1UnlockLearningProgressionEntries,
  title1UnlockLearningProgressionSummary,
} from '../../src/game/data/title1UnlockLearningProgressionSource.ts';
import {
  title1UnlockResolutionEntries,
  title1UnlockResolutionSummary,
} from '../../src/game/data/title1UnlockResolutionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sameOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

const stageIds = series1StageCampaignContentEntries.map((entry) => entry.stageId);
const progressionStageIds = title1UnlockLearningProgressionEntries.map((entry) => entry.stageId);
const selectedWeaponIds = new Set<string>(selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId));
const heldWeaponIds = new Set<string>(heldBaseWeaponCandidates.map((entry) => entry.weaponId));
const reactionById = new Map<string, (typeof attributeReactions)[number]>(
  attributeReactions.map((entry) => [entry.id, entry]),
);

assert(series1StageCampaignContentEntries.length === 20, 'Series1 Stage20 must remain exact');
assert(title1UnlockLearningProgressionEntries.length === 20, `unlock learning progression must cover Stage20, got ${title1UnlockLearningProgressionEntries.length}`);
assert(title1UnlockResolutionEntries.length === 20, 'unlock resolution must cover Stage20');
assert(sameOrder(stageIds, progressionStageIds), 'unlock progression must preserve Stage1-20 order');
assert(title1UnlockLearningProgressionSummary.firstStageAttributeCount === 2, `Stage1 should introduce only MEMORY/LIGHT, got ${title1UnlockLearningProgressionSummary.firstStageAttributeCount}`);
assert(title1UnlockLearningProgressionEntries[0].introducedReactionIds.length === 0, 'Stage1 must teach Reaction concept without recipe memorization');
assert(title1UnlockLearningProgressionSummary.firstFourStageReactionCount <= 2, 'first four stages should not overload Reaction recipes');
assert(title1UnlockLearningProgressionSummary.stagesWithNoNewAttribute >= 8, 'progression needs consolidation stages with no new Attribute');
assert(title1UnlockLearningProgressionSummary.stagesWithNoNewReaction >= 8, 'progression needs consolidation stages with no new Reaction');

const baseAttributes = COMBAT_ATTRIBUTES.filter((attribute) => attribute !== 'NEUTRAL');
assert(title1UnlockLearningProgressionSummary.introducedAttributeCount === baseAttributes.length, `all 14 base Attributes must be introduced exactly through progression; got ${title1UnlockLearningProgressionSummary.introducedAttributeCount}`);
assert(new Set(title1UnlockLearningProgressionSummary.introducedAttributeOrder).size === title1UnlockLearningProgressionSummary.introducedAttributeOrder.length, 'each base Attribute should have one first-introduction stage');
assert(title1UnlockLearningProgressionSummary.allBaseAttributesIntroducedByStage === 16, `all base Attributes should be introduced by Stage16, got ${title1UnlockLearningProgressionSummary.allBaseAttributesIntroducedByStage}`);
assert(title1UnlockLearningProgressionSummary.neutralAvailableFromStart, 'NEUTRAL should remain available as the baseline from start');
assert(!title1UnlockLearningProgressionSummary.neutralRequiresTutorial, 'NEUTRAL should not consume a tutorial lesson');
for (const attribute of baseAttributes) {
  assert(title1UnlockLearningProgressionSummary.introducedAttributeOrder.includes(attribute), `missing Attribute introduction: ${attribute}`);
}

assert(title1UnlockLearningProgressionSummary.introducedStatusCount === Object.keys(statusDefinitions).length, `all existing Status vocabulary must eventually be introduced; got ${title1UnlockLearningProgressionSummary.introducedStatusCount}`);
assert(title1UnlockLearningProgressionSummary.availableStatusCount === 16, 'Status authority should remain 16');
assert(title1UnlockLearningProgressionSummary.introducedReactionCount === attributeReactions.length, `all 12 initial Reactions must eventually be introduced; got ${title1UnlockLearningProgressionSummary.introducedReactionCount}`);
assert(title1UnlockLearningProgressionSummary.availableReactionCount === 12, 'initial Reaction authority should remain 12');
assert(title1UnlockLearningProgressionSummary.allInitialReactionsIntroducedByStage === 18, `all initial Reactions should be learned by Stage18, got ${title1UnlockLearningProgressionSummary.allInitialReactionsIntroducedByStage}`);

const knownAttributes = new Set<string>(['NEUTRAL']);
const knownStatuses = new Set<string>();
const knownReactions = new Set<string>();
for (const entry of title1UnlockLearningProgressionEntries) {
  assert(entry.stageNo >= 1 && entry.stageNo <= 20, `invalid stage number: ${entry.stageId}`);
  entry.introducedAttributes.forEach((attribute) => {
    assert(!knownAttributes.has(attribute), `Attribute introduced twice: ${attribute}`);
    knownAttributes.add(attribute);
  });
  entry.introducedStatuses.forEach((status) => {
    assert(status in statusDefinitions, `unknown Status introduction: ${status}`);
    assert(!knownStatuses.has(status), `Status introduced twice: ${status}`);
    knownStatuses.add(status);
  });
  for (const reactionId of entry.introducedReactionIds) {
    const reaction = reactionById.get(reactionId);
    assert(reaction, `unknown Reaction introduction: ${reactionId}`);
    assert(!knownReactions.has(reactionId), `Reaction introduced twice: ${reactionId}`);
    for (const requiredAttribute of reaction.requires) {
      assert(knownAttributes.has(requiredAttribute), `${entry.stageId} introduces ${reactionId} before Attribute ${requiredAttribute} is learned`);
    }
    knownReactions.add(reactionId);
  }
  for (const weaponId of entry.candidateWeaponRevealIds) {
    assert(selectedWeaponIds.has(weaponId), `${entry.stageId} may reveal Selected Title1 Candidate only: ${weaponId}`);
    assert(!heldWeaponIds.has(weaponId), `${entry.stageId} exposes held Candidate as gameplay access: ${weaponId}`);
  }
  assert(entry.resultLesson.length >= 35, `${entry.stageId} needs concrete Result lesson`);
  assert(entry.nextRunSuggestion.length >= 25, `${entry.stageId} needs concrete next-run suggestion`);
  assert(entry.failureHint.length >= 25, `${entry.stageId} needs fail-forward hint`);
  assert(entry.overloadGuard.length >= 25, `${entry.stageId} needs cognitive-overload guard`);
  assert(!entry.readingRequiredForGameplayPower, `${entry.stageId} must not require reading records for power`);
  assert(!entry.currencyRequiredForKnowledgeUnlock, `${entry.stageId} must not sell knowledge tutorials for currency`);
  assert(!entry.candidateRevealMeansRuntimeOwned, `${entry.stageId} Candidate reveal must not claim runtime ownership`);
  assert(entry.authority === 'CONTENT_SOURCE_ONLY', `${entry.stageId} learning source must remain content-only`);
  assert(!entry.runtimeAutoPromotionAllowed, `${entry.stageId} learning source must not auto-promote runtime`);
}

assert(title1UnlockLearningProgressionSummary.revealedCandidateWeaponCount === selectedTitle1BaseWeaponCandidates.length, `all Selected16 Candidates should be staged as learning reveals by Stage19; got ${title1UnlockLearningProgressionSummary.revealedCandidateWeaponCount}`);
const revealedIds = new Set<string>(title1UnlockLearningProgressionEntries.flatMap((entry) => entry.candidateWeaponRevealIds));
for (const selected of selectedTitle1BaseWeaponCandidates) {
  assert(revealedIds.has(selected.weaponId), `Selected Candidate lacks learning reveal: ${selected.weaponId}`);
}

assert(title1UnlockResolutionSummary.deferredHeldCampaignUnlockCount === 3, `expected three old Stage campaign weapon unlocks to be deferred after Hold decisions, got ${title1UnlockResolutionSummary.deferredHeldCampaignUnlockCount}`);
assert(sameOrder([...title1UnlockResolutionSummary.deferredHeldCampaignUnlocks].sort(), ['frost_window', 'name_reel', 'repair_spanner'].sort()), `unexpected deferred Hold set: ${title1UnlockResolutionSummary.deferredHeldCampaignUnlocks.join(',')}`);
assert(title1UnlockResolutionSummary.heldCandidatesExposedAsGameplayAccess.length === 0, `held Candidates must never become resolved gameplay access: ${title1UnlockResolutionSummary.heldCandidatesExposedAsGameplayAccess.join(',')}`);
assert(title1UnlockResolutionSummary.selectedCandidateRevealIds.length === selectedTitle1BaseWeaponCandidates.length, 'resolution should expose all Selected16 candidate families over the campaign');
assert(!title1UnlockResolutionSummary.candidateRevealMeansRuntimeOwned, 'Candidate learning reveal must not mean runtime owned');
assert(!title1UnlockResolutionSummary.campaignUnlockMeansRuntimeOwned, 'legacy campaign unlock seed must not mean runtime owned');
assert(!title1UnlockResolutionSummary.runtimeAutoPromotionAllowed, 'unlock resolution must not auto-promote runtime');

for (const resolution of title1UnlockResolutionEntries) {
  if (resolution.campaignUnlockDisposition === 'DEFERRED_HELD_CANDIDATE') {
    assert(resolution.heldCandidateIdsExplicitlyDeferred.length === 1, `${resolution.stageId} deferred campaign unlock needs explicit held ID`);
    assert(heldWeaponIds.has(resolution.heldCandidateIdsExplicitlyDeferred[0]), `${resolution.stageId} deferred ID must exist in Hold4`);
  }
  assert(!resolution.candidateRevealMeansRuntimeOwned, `${resolution.stageId} resolved candidate reveal must remain content access only`);
  assert(!resolution.campaignUnlockMeansRuntimeOwned, `${resolution.stageId} campaign unlock seed must remain non-runtime`);
  assert(!resolution.readingRequiredForGameplayPower, `${resolution.stageId} may not gate power behind reading`);
  assert(resolution.authority === 'TITLE1_UNLOCK_CONTENT_AUTHORITY', `${resolution.stageId} must use resolved Title1 unlock authority`);
}

const stage20 = title1UnlockLearningProgressionEntries.at(-1);
assert(stage20?.introducedAttributes.length === 0, 'Stage20 must not introduce a new base Attribute');
assert(stage20?.introducedStatuses.length === 0, 'Stage20 must not introduce a new Status');
assert(stage20?.introducedReactionIds.length === 0, 'Stage20 must not introduce a new Reaction');
assert(stage20?.resultLesson.includes('新しい基礎ルールを出さない'), 'Stage20 should be mastery, not tutorial surprise');
assert(stage20?.overloadGuard.includes('Happy End条件'), 'Title1 Happy End must not require full collection');

const doc = readFileSync(new URL('../../docs/title1-unlock-learning-progression-source-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Stage1-20',
  '14属性',
  'Stage16',
  '12Reaction',
  'Stage18',
  'Selected16',
  'Hold4',
  'name_reel',
  'frost_window',
  'repair_spanner',
  'Night Record',
  '未読',
  'currency',
  'Happy End',
  'CONTENT_SOURCE_ONLY',
]) {
  assert(doc.includes(token), `Title1 unlock learning doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  stages: title1UnlockLearningProgressionSummary.stageCount,
  firstStageAttributes: title1UnlockLearningProgressionSummary.firstStageAttributeCount,
  baseAttributesIntroduced: title1UnlockLearningProgressionSummary.introducedAttributeCount,
  allAttributesByStage: title1UnlockLearningProgressionSummary.allBaseAttributesIntroducedByStage,
  statusesIntroduced: title1UnlockLearningProgressionSummary.introducedStatusCount,
  reactionsIntroduced: title1UnlockLearningProgressionSummary.introducedReactionCount,
  allReactionsByStage: title1UnlockLearningProgressionSummary.allInitialReactionsIntroducedByStage,
  selectedCandidateReveals: title1UnlockLearningProgressionSummary.revealedCandidateWeaponCount,
  deferredHeldCampaignUnlocks: title1UnlockResolutionSummary.deferredHeldCampaignUnlocks,
  heldCandidatesExposedAsGameplayAccess: title1UnlockResolutionSummary.heldCandidatesExposedAsGameplayAccess,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
