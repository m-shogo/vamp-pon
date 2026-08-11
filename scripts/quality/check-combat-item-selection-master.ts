import { readFileSync } from 'node:fs';

import { combatItemEffectCandidates, combatItemEffectSummary } from '../../src/game/data/combatItemEffectSource.ts';
import { title1UnlockLearningProgressionEntries } from '../../src/game/data/title1UnlockLearningProgressionSource.ts';
import {
  title1CombatItemPlacements,
  title1CombatItemSelectionSummary,
} from '../../src/game/data/combatItemSelectionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(combatItemEffectCandidates.length === 18, `Combat Item candidate authority must remain 18, got ${combatItemEffectCandidates.length}`);
assert(combatItemEffectSummary.passiveCount === 14, `expected 14 PASSIVE candidates, got ${combatItemEffectSummary.passiveCount}`);
assert(combatItemEffectSummary.fieldItemCount === 2, `expected 2 FIELD_ITEM candidates, got ${combatItemEffectSummary.fieldItemCount}`);
assert(combatItemEffectSummary.rareSupportCount === 2, `expected 2 RARE_SUPPORT candidates, got ${combatItemEffectSummary.rareSupportCount}`);
assert(!combatItemEffectSummary.autoPromoteToRuntime, 'Combat Item candidate authority must remain content-only');

assert(title1CombatItemPlacements.length === 18, `Title1 placement must cover all existing 18 candidates, got ${title1CombatItemPlacements.length}`);
assert(title1CombatItemSelectionSummary.candidateAuthorityCount === 18, 'selection summary must bind to the existing 18-candidate authority');
assert(title1CombatItemSelectionSummary.selectedCount === 18, 'all 18 curated candidates should receive a Title1 placement');
assert(title1CombatItemSelectionSummary.passiveCount === 14, 'placement must preserve 14 PASSIVE entries');
assert(title1CombatItemSelectionSummary.fieldDropCount === 2, 'placement must preserve 2 FIELD_ITEM entries');
assert(title1CombatItemSelectionSummary.rareSupportCount === 2, 'placement must preserve 2 RARE_SUPPORT entries');
assert(title1CombatItemSelectionSummary.unplacedCandidateIds.length === 0, `all candidates must be placed, missing: ${title1CombatItemSelectionSummary.unplacedCandidateIds.join(',')}`);
assert(title1CombatItemSelectionSummary.maxPlacementsOnSingleStage <= 2, `no stage should introduce more than two Combat Items, got ${title1CombatItemSelectionSummary.maxPlacementsOnSingleStage}`);
assert(title1CombatItemSelectionSummary.latestPlacementStage <= 17, 'Stage18-20 should remain Combat Item mastery, not new-item tutorial');
assert(!title1CombatItemSelectionSummary.runtimeAutoPromotionAllowed, 'placement master must never auto-promote Combat Items');
assert(!title1CombatItemSelectionSummary.title1PlacementIsRuntimeInventory, 'content placement is not the live runtime inventory');

const authorityIds = new Set(combatItemEffectCandidates.map((entry) => entry.id));
const placementIds = new Set<string>();
const laneByKind = {
  PASSIVE: 'LEVEL_UP_POOL',
  FIELD_ITEM: 'FIELD_DROP',
  RARE_SUPPORT: 'RARE_SUPPORT',
} as const;

for (const placement of title1CombatItemPlacements) {
  assert(authorityIds.has(placement.itemId), `placement references non-authority Combat Item: ${placement.itemId}`);
  assert(!placementIds.has(placement.itemId), `Combat Item placed twice: ${placement.itemId}`);
  placementIds.add(placement.itemId);
  assert(placement.itemName === placement.candidate.name, `${placement.itemId} placement name must derive from candidate authority`);
  assert(placement.itemKind === placement.candidate.kind, `${placement.itemId} placement kind must derive from candidate authority`);
  assert(placement.accessLane === laneByKind[placement.itemKind], `${placement.itemId} uses wrong access lane for ${placement.itemKind}`);
  assert(placement.stageNo >= 1 && placement.stageNo <= 20, `${placement.itemId} has invalid Stage number`);
  assert(placement.learningPurpose.length >= 35, `${placement.itemId} needs concrete learning purpose`);
  assert(placement.antiOverloadRule.length >= 25, `${placement.itemId} needs anti-overload rule`);
  assert(placement.mobileReadabilityHook.length >= 25, `${placement.itemId} needs mobile readability hook`);
  assert(placement.candidate.rule.length >= 20, `${placement.itemId} candidate rule regressed`);
  assert(placement.candidate.tradeoff.trim().length >= 8, `${placement.itemId} candidate tradeoff must remain explicit`);
  assert(placement.candidate.storySeed.trim().length >= 12, `${placement.itemId} candidate story seed must remain explicit`);
  assert(placement.candidate.runtimeStatus === 'CONTENT_SOURCE_ONLY', `${placement.itemId} authority candidate must remain content-only`);
  assert(placement.runtimeStatus === 'CONTENT_SOURCE_ONLY', `${placement.itemId} placement must remain content-only`);
  assert(!placement.runtimeAutoPromotionAllowed, `${placement.itemId} placement must not auto-promote runtime`);
}
assert(placementIds.size === authorityIds.size, 'Title1 placement IDs must exactly match Combat Item authority IDs');

const disruptiveStatuses = ['ROOTED', 'CHILL', 'FREEZE', 'DROWSY', 'SLEEP', 'ECLIPSED', 'ERASED', 'SEALED', 'DISORIENTED'] as const;
const counteredStatuses = new Set(combatItemEffectCandidates.flatMap((item) => [...item.resistsStatuses, ...item.cleansesStatuses]));
for (const status of disruptiveStatuses) {
  assert(counteredStatuses.has(status), `Combat Item 18 lacks fail-forward counterplay for ${status}`);
}

for (const placement of title1CombatItemPlacements) {
  const knownAttributes = new Set<string>(['NEUTRAL']);
  const knownStatuses = new Set<string>();
  const knownReactions = new Set<string>();
  for (const learning of title1UnlockLearningProgressionEntries) {
    if (learning.stageNo > placement.stageNo) break;
    learning.introducedAttributes.forEach((id) => knownAttributes.add(id));
    learning.introducedStatuses.forEach((id) => knownStatuses.add(id));
    learning.introducedReactionIds.forEach((id) => knownReactions.add(id));
  }

  for (const attribute of placement.candidate.attributeBias) {
    assert(knownAttributes.has(attribute), `${placement.itemId} appears on Stage${placement.stageNo} before Attribute ${attribute} is taught`);
  }
  for (const status of [...placement.candidate.resistsStatuses, ...placement.candidate.cleansesStatuses]) {
    assert(knownStatuses.has(status), `${placement.itemId} appears on Stage${placement.stageNo} before Status ${status} is taught`);
  }
  if (placement.candidate.reactionAssist) {
    assert(knownReactions.has(placement.candidate.reactionAssist), `${placement.itemId} appears on Stage${placement.stageNo} before Reaction ${placement.candidate.reactionAssist} is taught`);
  }
}

const stage18to20Placements = title1CombatItemPlacements.filter((entry) => entry.stageNo >= 18);
assert(stage18to20Placements.length === 0, 'Stage18-20 should not introduce new Combat Items');

const doc = readFileSync(new URL('../../docs/combat-item-selection-source-v1.md', import.meta.url), 'utf8');
for (const token of [
  '既存18',
  'PASSIVE 14',
  'FIELD_ITEM 2',
  'RARE_SUPPORT 2',
  'Stage17',
  'Stage18-20',
  'CONTENT_SOURCE_ONLY',
  '先バレ',
  'mobile',
  'runtime',
]) {
  assert(doc.includes(token), `Combat Item placement doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  authorityCandidates: combatItemEffectCandidates.length,
  placedCandidates: title1CombatItemPlacements.length,
  passives: title1CombatItemSelectionSummary.passiveCount,
  fieldItems: title1CombatItemSelectionSummary.fieldDropCount,
  rareSupport: title1CombatItemSelectionSummary.rareSupportCount,
  stagesWithPlacements: title1CombatItemSelectionSummary.stageCountWithPlacements,
  maxPerStage: title1CombatItemSelectionSummary.maxPlacementsOnSingleStage,
  latestPlacementStage: title1CombatItemSelectionSummary.latestPlacementStage,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
