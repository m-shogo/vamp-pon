import { readFileSync } from 'node:fs';

import {
  weaponAwakeningCandidates,
  weaponFusionCandidates,
  weaponSynthesisCandidates,
  weaponTransformationSummary,
} from '../../src/game/data/weaponTransformationSource.ts';
import {
  heldBaseWeaponCandidates,
  selectedTitle1BaseWeaponCandidates,
  baseWeaponSelectionSummary,
} from '../../src/game/data/baseWeaponSelectionSource.ts';
import { currentBaseWeaponIds } from '../../src/game/data/weaponExpansionSource.ts';
import {
  heldTitle1WeaponTransformations,
  selectedTitle1WeaponTransformations,
  weaponTransformationSelectionEntries,
  weaponTransformationSelectionSummary,
} from '../../src/game/data/weaponTransformationSelectionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function sameSet(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value) => right.includes(value));
}

assert(weaponTransformationSummary.totalCandidateTransformations === 38, `Transformation authority must remain 38, got ${weaponTransformationSummary.totalCandidateTransformations}`);
assert(weaponFusionCandidates.length === 18, 'Fusion authority must remain 18');
assert(weaponSynthesisCandidates.length === 12, 'Synthesis authority must remain 12');
assert(weaponAwakeningCandidates.length === 8, 'Awakening authority must remain 8');
assert(!weaponTransformationSummary.autoPromoteToRuntime, 'Transformation authority must remain content-only');

assert(baseWeaponSelectionSummary.plannedTitle1BaseFamilyCount === 24, `Title1 Base Weapon graph must remain Current8 + Selected16 = 24, got ${baseWeaponSelectionSummary.plannedTitle1BaseFamilyCount}`);
assert(currentBaseWeaponIds.length === 8, 'Current Base Weapon authority must remain 8');
assert(selectedTitle1BaseWeaponCandidates.length === 16, 'Title1 selected Base Weapon candidates must remain 16');
assert(heldBaseWeaponCandidates.length === 4, 'Base Weapon Hold reservoir must remain 4');

assert(weaponTransformationSelectionEntries.length === 38, `selection must cover all 38 transformations, got ${weaponTransformationSelectionEntries.length}`);
assert(weaponTransformationSelectionSummary.authorityCount === 38, 'selection summary must bind to exact Transformation38 authority');
assert(weaponTransformationSelectionSummary.selectedCount === 29, `expected 29 Title1-selectable Transformations after Base24 filtering, got ${weaponTransformationSelectionSummary.selectedCount}`);
assert(weaponTransformationSelectionSummary.heldCount === 9, `expected 9 Transformations blocked by Base Hold4, got ${weaponTransformationSelectionSummary.heldCount}`);
assert(weaponTransformationSelectionSummary.selectedFusionCount === 11, `expected Fusion 11 selected, got ${weaponTransformationSelectionSummary.selectedFusionCount}`);
assert(weaponTransformationSelectionSummary.heldFusionCount === 7, `expected Fusion 7 held, got ${weaponTransformationSelectionSummary.heldFusionCount}`);
assert(weaponTransformationSelectionSummary.selectedSynthesisCount === 11, `expected Synthesis 11 selected, got ${weaponTransformationSelectionSummary.selectedSynthesisCount}`);
assert(weaponTransformationSelectionSummary.heldSynthesisCount === 1, `expected Synthesis 1 held, got ${weaponTransformationSelectionSummary.heldSynthesisCount}`);
assert(weaponTransformationSelectionSummary.selectedAwakeningCount === 7, `expected Awakening 7 selected, got ${weaponTransformationSelectionSummary.selectedAwakeningCount}`);
assert(weaponTransformationSelectionSummary.heldAwakeningCount === 1, `expected Awakening 1 held, got ${weaponTransformationSelectionSummary.heldAwakeningCount}`);

const expectedHeldIds = [
  'fusion_frost_foundation',
  'fusion_living_archive',
  'fusion_lucid_record',
  'fusion_overclock_tool',
  'fusion_thermal_window',
  'fusion_street_foundation',
  'fusion_posted_memory',
  'synth_spanner_magnet',
  'awake_noa_divergent_tool',
] as const;
const actualHeldIds = heldTitle1WeaponTransformations.map((entry) => entry.transformationId);
assert(sameSet(actualHeldIds, expectedHeldIds), `unexpected Transformation Hold set: ${actualHeldIds.join(',')}`);

const heldBaseIds = new Set(heldBaseWeaponCandidates.map((entry) => entry.weaponId));
const title1AvailableBaseIds = new Set<string>([
  ...currentBaseWeaponIds,
  ...selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId),
]);
const seenIds = new Set<string>();
for (const entry of weaponTransformationSelectionEntries) {
  assert(!seenIds.has(entry.transformationId), `duplicate Transformation selection entry: ${entry.transformationId}`);
  seenIds.add(entry.transformationId);
  assert(entry.runtimeStatus === 'CONTENT_SOURCE_ONLY', `${entry.transformationId} must remain content-only`);
  assert(!entry.runtimeAutoPromotionAllowed, `${entry.transformationId} must not auto-promote runtime`);
  assert(entry.keepInCandidateReservoir, `${entry.transformationId} must stay in candidate reservoir`);
  assert(entry.selectionReason.length >= 35, `${entry.transformationId} needs explicit selection/hold rationale`);

  if (entry.selectedForTitle1) {
    assert(entry.decision === 'TITLE1_SELECTED', `${entry.transformationId} selected flag/decision mismatch`);
    assert(entry.blockedByHeldBaseWeaponIds.length === 0, `${entry.transformationId} selected Transformation may not depend on Hold4`);
    for (const inputId of entry.inputWeaponIds) {
      assert(title1AvailableBaseIds.has(inputId), `${entry.transformationId} selected input is outside Base24: ${inputId}`);
    }
  } else {
    assert(entry.decision === 'HOLD_BLOCKED_BY_BASE_WEAPON', `${entry.transformationId} held flag/decision mismatch`);
    assert(entry.blockedByHeldBaseWeaponIds.length >= 1, `${entry.transformationId} held Transformation needs an explicit Base Hold blocker`);
    for (const blocker of entry.blockedByHeldBaseWeaponIds) {
      assert(heldBaseIds.has(blocker), `${entry.transformationId} blocker is not in Base Hold4: ${blocker}`);
    }
  }
}
assert(seenIds.size === 38, 'Transformation selection IDs must cover authority exactly once');

for (const selected of selectedTitle1WeaponTransformations) {
  assert(selected.inputWeaponIds.every((id) => !heldBaseIds.has(id)), `${selected.transformationId} leaks Base Hold4 into Title1 selected graph`);
}
for (const held of heldTitle1WeaponTransformations) {
  assert(held.inputWeaponIds.some((id) => heldBaseIds.has(id)), `${held.transformationId} is held without a Base Hold4 dependency`);
}

assert(weaponTransformationSelectionSummary.currentKitLinkedAwakeningHeldIds.length === 0, `Current21 linked Awakening may not be blocked by Base Hold4: ${weaponTransformationSelectionSummary.currentKitLinkedAwakeningHeldIds.join(',')}`);
assert(weaponTransformationSelectionSummary.currentKitLinkedAwakeningSelectedCount === weaponTransformationSelectionSummary.currentKitLinkedAwakeningCount, 'every existing Current21 linked Awakening must remain Title1-selectable');
assert(!weaponTransformationSelectionSummary.runtimeAutoPromotionAllowed, 'selection master must not auto-promote runtime Transformations');
assert(!weaponTransformationSelectionSummary.heldTransformationsDeleted, 'Base-blocked Transformations must be held, not deleted');

const doc = readFileSync(new URL('../../docs/weapon-transformation-selection-source-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Transformation38',
  'Selected29',
  'Hold9',
  'Fusion 11 / 7',
  'Synthesis 11 / 1',
  'Awakening 7 / 1',
  'Hold4',
  'frost_window',
  'repair_spanner',
  'name_reel',
  'morning_dew_dropper',
  'CONTENT_SOURCE_ONLY',
  'runtime',
]) {
  assert(doc.includes(token), `Transformation selection doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  authority: weaponTransformationSelectionSummary.authorityCount,
  selected: weaponTransformationSelectionSummary.selectedCount,
  held: weaponTransformationSelectionSummary.heldCount,
  fusion: { selected: weaponTransformationSelectionSummary.selectedFusionCount, held: weaponTransformationSelectionSummary.heldFusionCount },
  synthesis: { selected: weaponTransformationSelectionSummary.selectedSynthesisCount, held: weaponTransformationSelectionSummary.heldSynthesisCount },
  awakening: { selected: weaponTransformationSelectionSummary.selectedAwakeningCount, held: weaponTransformationSelectionSummary.heldAwakeningCount },
  currentKitLinkedAwakenings: weaponTransformationSelectionSummary.currentKitLinkedAwakeningCount,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
