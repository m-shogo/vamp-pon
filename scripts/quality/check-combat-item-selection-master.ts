import { readFileSync } from 'node:fs';

import { passives } from '../../src/game/data/passives.ts';
import { characterProductionPlans } from '../../src/game/data/characterProductionPlans.ts';
import {
  currentCombatItemFamilies,
  selectedCandidateCombatItemFamilies,
  title1CombatItemFamilies,
  title1CombatItemSelectionSummary,
} from '../../src/game/data/combatItemSelectionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(passives.length === 8, `Current runtime passive authority changed; expected 8, got ${passives.length}`);
assert(currentCombatItemFamilies.length === passives.length, 'Combat Item master must preserve all current runtime passives');
assert(selectedCandidateCombatItemFamilies.length === 10, `Title1 should select exactly 10 content-only candidates, got ${selectedCandidateCombatItemFamilies.length}`);
assert(title1CombatItemFamilies.length === 18, `Title1 Combat Item family target must remain 18, got ${title1CombatItemFamilies.length}`);
assert(title1CombatItemSelectionSummary.title1TargetCount === 18, 'summary target must remain 18');
assert(title1CombatItemSelectionSummary.currentRuntimeCount === 8, 'summary Current runtime count must remain 8');
assert(title1CombatItemSelectionSummary.selectedCandidateCount === 10, 'summary selected Candidate count must remain 10');
assert(title1CombatItemSelectionSummary.totalFamilyCount === 18, 'summary total family count must remain 18');

const runtimeIds = passives.map((entry) => entry.id);
const selectedCurrentIds = currentCombatItemFamilies.map((entry) => entry.itemId);
assert(runtimeIds.every((id) => selectedCurrentIds.includes(id)), 'every runtime passive must remain in Current8');
assert(new Set(selectedCurrentIds).size === selectedCurrentIds.length, 'Current8 item IDs must be unique');

const planByCharacterId = new Map(characterProductionPlans.map((plan) => [plan.characterId, plan]));
const currentNames = new Set(passives.map((entry) => entry.name));
const candidateIds = new Set<string>();
const candidateCharacters = new Set<string>();
for (const entry of selectedCandidateCombatItemFamilies) {
  const plan = planByCharacterId.get(entry.characterId);
  assert(plan, `candidate must reference an existing Current character production plan: ${entry.characterId}`);
  assert(entry.displayName === plan.passiveItem, `${entry.itemId} must use the character passive-item lineage name`);
  assert(!currentNames.has(entry.displayName), `${entry.itemId} duplicates a Current runtime passive display name: ${entry.displayName}`);
  assert(!candidateIds.has(entry.itemId), `duplicate Candidate Combat Item ID: ${entry.itemId}`);
  candidateIds.add(entry.itemId);
  assert(!candidateCharacters.has(entry.characterId), `Candidate selection should not consume two slots for one character: ${entry.characterId}`);
  candidateCharacters.add(entry.characterId);
  assert(entry.statusInteractions.length >= 1, `${entry.itemId} needs at least one explicit Status interaction`);
  assert(entry.buildRoles.length >= 2, `${entry.itemId} needs at least two build roles`);
  assert(entry.effectConcept.length >= 35, `${entry.itemId} needs a concrete effect concept`);
  assert(entry.whySelected.length >= 35, `${entry.itemId} needs a concrete selection rationale`);
  assert(entry.tradeoff.length >= 25, `${entry.itemId} needs an anti-autopick tradeoff`);
  assert(entry.mobileReadabilityHook.length >= 25, `${entry.itemId} needs a mobile readability hook`);
  assert(entry.runtimeStatus === 'CONTENT_SOURCE_ONLY', `${entry.itemId} must remain content-only`);
  assert(!entry.runtimeAutoPromotionAllowed, `${entry.itemId} must not auto-promote into runtime inventory`);
}
assert(candidateCharacters.size === 10, 'Selected10 should come from ten distinct character lineages');

const requiredRescueStatuses = ['ROOTED', 'CHILL', 'FREEZE', 'DROWSY', 'SLEEP', 'ECLIPSED', 'ERASED', 'SEALED', 'DISORIENTED'] as const;
const coveredStatuses = new Set(selectedCandidateCombatItemFamilies.flatMap((entry) => entry.statusInteractions));
for (const status of requiredRescueStatuses) {
  assert(coveredStatuses.has(status), `Title1 Combat Item selection lacks fail-forward answer for ${status}`);
}
assert(title1CombatItemSelectionSummary.statusInteractionCoverageCount >= 12, `status interaction coverage should remain broad, got ${title1CombatItemSelectionSummary.statusInteractionCoverageCount}`);
assert(title1CombatItemSelectionSummary.effectAxisCoverageCount >= 9, `Combat Item 18 should cover at least 9 effect axes, got ${title1CombatItemSelectionSummary.effectAxisCoverageCount}`);

const candidateAxes = new Set(selectedCandidateCombatItemFamilies.map((entry) => entry.effectAxis));
for (const axis of ['STATUS_GUARD', 'ROUTE', 'SUPPORT', 'BUILD_COMFORT', 'OBSERVATION', 'DREAM_CONTROL', 'DARK_RISK'] as const) {
  assert(candidateAxes.has(axis), `Selected10 must preserve non-stat gameplay axis: ${axis}`);
}

assert(!title1CombatItemSelectionSummary.runtimeAutoPromotionAllowed, 'selection master must never auto-promote Candidate items');
assert(!title1CombatItemSelectionSummary.title1SelectionIsRuntimeInventory, 'Title1 Combat Item 18 selection is not the live runtime inventory');

const doc = readFileSync(new URL('../../docs/combat-item-selection-source-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Current8',
  'Selected10',
  '18 family',
  'CONTENT_SOURCE_ONLY',
  'ROOTED',
  'ECLIPSED',
  'ERASED',
  'Build Comfort',
  'mobile',
  'runtime',
]) {
  assert(doc.includes(token), `Combat Item selection doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  currentRuntime: title1CombatItemSelectionSummary.currentRuntimeCount,
  selectedCandidates: title1CombatItemSelectionSummary.selectedCandidateCount,
  totalFamilies: title1CombatItemSelectionSummary.totalFamilyCount,
  candidateCharacters: title1CombatItemSelectionSummary.selectedCandidateCharacterCount,
  effectAxes: title1CombatItemSelectionSummary.effectAxisCoverageCount,
  statusInteractions: title1CombatItemSelectionSummary.statusInteractionCoverageCount,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
