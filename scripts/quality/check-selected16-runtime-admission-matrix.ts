import { selectedTitle1BaseWeaponCandidates } from '../../src/game/data/baseWeaponSelectionSource.ts';
import {
  selectedBaseWeaponRuntimeAdmissionEntries,
  selectedBaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/selectedBaseWeaponRuntimeAdmissionSource.ts';
import { selectedBaseWeaponGameplayProfiles } from '../../src/game/data/baseWeaponSelectionGameplaySource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const selectedIds = selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId);
const admissionIds = selectedBaseWeaponRuntimeAdmissionEntries.map((entry) => entry.weaponId);

assert(selectedTitle1BaseWeaponCandidates.length === 16, 'Selected Base Weapon authority must remain 16');
assert(selectedBaseWeaponGameplayProfiles.length === 16, 'Selected gameplay profiles must remain 16');
assert(selectedBaseWeaponRuntimeAdmissionEntries.length === 16, 'runtime admission matrix must cover Selected16 exactly');
assert(new Set(admissionIds).size === 16, 'runtime admission matrix IDs must be unique');
for (const id of selectedIds) assert(admissionIds.includes(id), `Selected candidate missing runtime admission row: ${id}`);

for (const entry of selectedBaseWeaponRuntimeAdmissionEntries) {
  assert(entry.requiredRuntimeHook.trim().length >= 8, `${entry.weaponId} needs an explicit runtime hook`);
  assert(entry.blockers.length > 0, `${entry.weaponId} may not be ready without explicit admission work`);
  assert(!entry.runtimeAutoPromotionAllowed, `${entry.weaponId} may not auto-promote to runtime`);
  assert(!entry.numericalTuningFrozen, `${entry.weaponId} numerical tuning must remain unfrozen before runtime playtest`);
  assert(entry.runtimeVisualQaRequired, `${entry.weaponId} must require runtime visual QA`);
}

assert(selectedBaseWeaponRuntimeAdmissionSummary.candidateCount === 16, 'summary must cover Selected16');
assert(selectedBaseWeaponRuntimeAdmissionSummary.liveCatalogCount === 0, 'Selected16 must not already exist in current live catalog');
assert(selectedBaseWeaponRuntimeAdmissionSummary.runtimeHookImplementedCount === 0, 'Selected16 hooks must not be claimed implemented before actual runtime work');
assert(selectedBaseWeaponRuntimeAdmissionSummary.statusRuntimeRequiredCount === 16, `all Selected16 currently depend on Status runtime, got ${selectedBaseWeaponRuntimeAdmissionSummary.statusRuntimeRequiredCount}`);
assert(selectedBaseWeaponRuntimeAdmissionSummary.readyForAdmissionReviewCount === 0, 'no Selected16 candidate is ready for live admission yet');
assert(selectedBaseWeaponRuntimeAdmissionSummary.candidatesBlockedByRuntimeHook.length === 16, 'all Selected16 should still be blocked by runtime hook work');
assert(selectedBaseWeaponRuntimeAdmissionSummary.candidatesBlockedByStatusRuntime.length === 16, 'all Selected16 should explicitly expose Status runtime as a shared prerequisite');
assert(selectedBaseWeaponRuntimeAdmissionSummary.candidatesMissingLiveCatalog.length === 16, 'all Selected16 should remain outside live weapons.ts');
assert(selectedBaseWeaponRuntimeAdmissionSummary.numericalTuningFrozenCount === 0, 'no Candidate numerical tuning should be frozen');
assert(!selectedBaseWeaponRuntimeAdmissionSummary.runtimeAutoPromotionAllowed, 'admission matrix must remain fail-closed');

console.log(JSON.stringify({
  status: 'PASS',
  selectedCandidates: selectedBaseWeaponRuntimeAdmissionSummary.candidateCount,
  liveCatalog: selectedBaseWeaponRuntimeAdmissionSummary.liveCatalogCount,
  runtimeHooksImplemented: selectedBaseWeaponRuntimeAdmissionSummary.runtimeHookImplementedCount,
  statusRuntimeRequired: selectedBaseWeaponRuntimeAdmissionSummary.statusRuntimeRequiredCount,
  readyForAdmissionReview: selectedBaseWeaponRuntimeAdmissionSummary.readyForAdmissionReviewCount,
  sharedPrerequisite: 'STATUS_RUNTIME',
}, null, 2));
