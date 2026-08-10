import { readFileSync } from 'node:fs';

import { COMBAT_ATTRIBUTES } from '../../src/game/data/combatAffinitySource.ts';
import {
  baseWeaponCandidates,
  currentBaseWeaponIds,
} from '../../src/game/data/weaponExpansionSource.ts';
import {
  currentCharacterCombatKitEntries,
} from '../../src/game/data/currentCharacterCombatKitSource.ts';
import {
  baseWeaponSelectionEntries,
  selectedTitle1BaseWeaponCandidates,
  heldBaseWeaponCandidates,
  baseWeaponSelectionSummary,
} from '../../src/game/data/baseWeaponSelectionSource.ts';
import {
  selectedBaseWeaponGameplayProfiles,
  selectedBaseWeaponGameplayProfileById,
  selectedBaseWeaponGameplaySummary,
} from '../../src/game/data/baseWeaponSelectionGameplaySource.ts';
import { series1StageCampaignContentEntries } from '../../src/game/data/series1StageCampaignContentSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(currentBaseWeaponIds.length === 8, `expected 8 Current Base Weapon families, got ${currentBaseWeaponIds.length}`);
assert(baseWeaponCandidates.length === 20, `expected 20 Base Weapon candidates, got ${baseWeaponCandidates.length}`);
assert(baseWeaponSelectionEntries.length === 20, 'every Base Weapon candidate needs an explicit selection decision');
assert(new Set(baseWeaponSelectionEntries.map((entry) => entry.weaponId)).size === 20, 'Base Weapon selection ids must be unique');
assert(selectedTitle1BaseWeaponCandidates.length === 16, `Title1 should select 16 candidate families after risk review, got ${selectedTitle1BaseWeaponCandidates.length}`);
assert(heldBaseWeaponCandidates.length === 4, `expected 4 held candidates, got ${heldBaseWeaponCandidates.length}`);
assert(baseWeaponSelectionSummary.plannedTitle1BaseFamilyCount === 24, `Current8 + Selected16 should produce 24 planned Title1 families, got ${baseWeaponSelectionSummary.plannedTitle1BaseFamilyCount}`);
assert(baseWeaponSelectionSummary.plannedTitle1BaseFamilyCount >= 24 && baseWeaponSelectionSummary.plannedTitle1BaseFamilyCount <= 28, 'planned Base Weapon family count must stay inside 24-28 target');
assert(baseWeaponSelectionSummary.selectedAttackArchetypeCount === 16, 'selected candidate families must keep distinct attack archetypes');
assert(baseWeaponSelectionSummary.heldAttackArchetypeCount === 4, 'held candidates remain distinct reservoir archetypes, not deleted duplicates');

const heldIds = new Set(heldBaseWeaponCandidates.map((entry) => entry.weaponId));
for (const expectedHeldId of ['frost_window', 'repair_spanner', 'name_reel', 'morning_dew_dropper']) {
  assert(heldIds.has(expectedHeldId), `risk-based Hold set drifted: missing ${expectedHeldId}`);
}
for (const held of heldBaseWeaponCandidates) {
  assert(held.reason.length >= 35, `held weapon needs concrete reason: ${held.weaponId}`);
  assert(held.overlapOrRisk.length >= 25, `held weapon needs overlap/risk explanation: ${held.weaponId}`);
  assert(held.keepInCandidateReservoir, `held weapon must remain in candidate reservoir: ${held.weaponId}`);
  assert(held.runtimeStatus === 'CONTENT_SOURCE_ONLY', `held weapon must remain content-only: ${held.weaponId}`);
  assert(!held.runtimeAutoPromotionAllowed, `held weapon must not auto-promote: ${held.weaponId}`);
}

for (const selected of selectedTitle1BaseWeaponCandidates) {
  assert(selected.reason.length >= 35, `selected weapon needs gameplay reason: ${selected.weaponId}`);
  assert(selected.overlapOrRisk.length >= 20, `selected weapon needs overlap guard: ${selected.weaponId}`);
  assert(selected.runtimeStatus === 'CONTENT_SOURCE_ONLY', `selection is not runtime promotion: ${selected.weaponId}`);
  assert(!selected.runtimeAutoPromotionAllowed, `selected weapon must not auto-promote runtime: ${selected.weaponId}`);
  const profile = selectedBaseWeaponGameplayProfileById.get(selected.weaponId);
  assert(profile, `selected weapon needs gameplay spec: ${selected.weaponId}`);
}

assert(selectedBaseWeaponGameplayProfiles.length === 16, 'every selected candidate needs a detailed gameplay profile');
assert(selectedBaseWeaponGameplaySummary.uniqueArchetypes === 16, 'gameplay specs must preserve unique selected archetypes');
assert(selectedBaseWeaponGameplaySummary.profilesWithCharacterAffinity === 16, 'all selected weapons need Character affinity');
assert(selectedBaseWeaponGameplaySummary.profilesWithStageAffinity === 16, 'all selected weapons need Stage affinity');
assert(selectedBaseWeaponGameplaySummary.profilesWithAnyTransformation >= 14, 'most selected weapons need Fusion/Synthesis/Awakening hooks before runtime selection');
assert(selectedBaseWeaponGameplaySummary.currentRuntimeEvolutionAdded === 0, 'selection source must not invent runtime evolution recipes');
assert(!selectedBaseWeaponGameplaySummary.runtimeAutoPromotionAllowed, 'gameplay source must not auto-promote runtime');

// Japanese prose can be semantically concrete with fewer code points than equivalent English prose.
// These thresholds reject label-like placeholders without rewarding artificial sentence padding.
for (const profile of selectedBaseWeaponGameplayProfiles) {
  assert(profile.scalingIntent.length >= 25, `selected weapon needs scaling intent: ${profile.weaponId}`);
  assert(profile.weakness.length >= 15, `selected weapon needs weakness: ${profile.weaponId}`);
  assert(profile.buildCompensation.length >= 20, `selected weapon needs build compensation: ${profile.weaponId}`);
  assert(profile.requiredRuntimeHook.length > 0, `selected weapon needs runtime hook declaration: ${profile.weaponId}`);
  assert(profile.vfxSafety.includes('No full-screen'), `selected weapon must preserve VFX safety: ${profile.weaponId}`);
  assert(profile.audioCue.length > 0, `selected weapon needs audio language: ${profile.weaponId}`);
  assert(profile.runtimeEvolutionId === null, `candidate weapon may not claim runtime evolution before implementation: ${profile.weaponId}`);
  assert(profile.authority === 'CONTENT_SOURCE_ONLY', `selected gameplay profile must remain content-only: ${profile.weaponId}`);
  assert(!profile.runtimeAutoPromotionAllowed, `selected gameplay profile must not auto-promote: ${profile.weaponId}`);
}

const candidateStarterIds = new Set(
  currentCharacterCombatKitEntries
    .filter((entry) => entry.startingWeapon.sourceKind === 'BASE_CANDIDATE')
    .map((entry) => entry.startingWeapon.weaponId),
);
assert(candidateStarterIds.size === baseWeaponSelectionSummary.candidateStarterWeaponCount, 'candidate starter summary must derive from Current21 combat kits');
assert(baseWeaponSelectionSummary.candidateStartersHeldCount === 0, `Current21 starting plans must not point at held Title1 weapons; held=${[...candidateStarterIds].filter((id) => heldIds.has(id)).join(',')}`);
assert(baseWeaponSelectionSummary.candidateStartersSelectedCount === candidateStarterIds.size, 'all Current21 candidate starter weapon families should remain in Title1 selection');

assert(baseWeaponSelectionSummary.title1AttributeCoverage.length === COMBAT_ATTRIBUTES.length, `Current + selected Base Weapons should preserve all Attribute vocabulary; coverage=${baseWeaponSelectionSummary.title1AttributeCoverage.join(',')}`);
assert(baseWeaponSelectionSummary.stagesWithAnySelectedOrCurrentRecommendation.length === series1StageCampaignContentEntries.length, `all Stage20 need at least one Current/Selected recommended Base Weapon; covered=${baseWeaponSelectionSummary.stagesWithAnySelectedOrCurrentRecommendation.length}`);
assert(!baseWeaponSelectionSummary.runtimeAutoPromotionAllowed, 'selection decisions must not auto-promote runtime');
assert(!baseWeaponSelectionSummary.heldWeaponsDeleted, 'Hold means preserve candidate, never delete it');

const doc = readFileSync(new URL('../../docs/base-weapon-selection-source-v1.md', import.meta.url), 'utf8');
for (const token of [
  '24-28',
  'Current8 + Selected16 = 24',
  '数合わせ',
  'Hold 4',
  'frost_window',
  'repair_spanner',
  'name_reel',
  'morning_dew_dropper',
  'scaling',
  'weakness',
  'Fusion / Synthesis / Awakening',
  'CONTENT_SOURCE_ONLY',
]) {
  assert(doc.includes(token), `Base Weapon selection doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  currentBaseFamilies: baseWeaponSelectionSummary.currentBaseFamilyCount,
  candidates: baseWeaponSelectionSummary.candidateCount,
  selectedCandidates: baseWeaponSelectionSummary.selectedCandidateCount,
  heldCandidates: baseWeaponSelectionSummary.heldCandidateCount,
  plannedTitle1Families: baseWeaponSelectionSummary.plannedTitle1BaseFamilyCount,
  selectedArchetypes: baseWeaponSelectionSummary.selectedAttackArchetypeCount,
  attributeCoverage: baseWeaponSelectionSummary.title1AttributeCoverage,
  selectedGameplayProfiles: selectedBaseWeaponGameplaySummary.selectedProfiles,
  profilesWithAnyTransformation: selectedBaseWeaponGameplaySummary.profilesWithAnyTransformation,
  candidateStarterWeaponsHeld: baseWeaponSelectionSummary.candidateStartersHeldCount,
  stagesWithWeaponAnswer: baseWeaponSelectionSummary.stagesWithAnySelectedOrCurrentRecommendation.length,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
