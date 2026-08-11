import { readFileSync } from 'node:fs';

import { baseWeaponSelectionSummary, selectedTitle1BaseWeaponCandidates } from '../../src/game/data/baseWeaponSelectionSource.ts';
import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(baseWeaponSelectionSummary.selectedCandidateCount === 16, `Title1 selected Base candidates must remain 16, got ${baseWeaponSelectionSummary.selectedCandidateCount}`);
assert(title1BaseWeaponRuntimeAdmissionEntries.length === 16, `runtime admission must cover Selected16, got ${title1BaseWeaponRuntimeAdmissionEntries.length}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.selectedContentWeaponCount === 16, 'runtime admission summary must bind to Selected16');
assert(title1BaseWeaponRuntimeAdmissionSummary.admittedRuntimeCount === 0, `no Selected16 weapon may enter U47 runtime yet, got admitted=${title1BaseWeaponRuntimeAdmissionSummary.admittedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.blockedRuntimeCount === 16, 'all Selected16 must remain blocked until their required primitives exist');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedPrimitiveCount === 3, 'U47 baseline should expose exactly three primitive capabilities in this admission model');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingPrimitiveCount >= 15, 'advanced Title1 weapon runtime still needs multiple primitive executors');
assert(!title1BaseWeaponRuntimeAdmissionSummary.fakeProjectileFallbackAllowed, 'unsupported archetypes must never be faked as generic projectile');
assert(!title1BaseWeaponRuntimeAdmissionSummary.contentSelectionMayBeDowngradedToFitRuntime, 'Content selection may not be weakened just to fit old runtime');
assert(!title1BaseWeaponRuntimeAdmissionSummary.runtimeAutoPromotionAllowed, 'admission source must never auto-promote runtime');

const selectedIds = new Set(selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId));
const seenIds = new Set<string>();
for (const entry of title1BaseWeaponRuntimeAdmissionEntries) {
  assert(selectedIds.has(entry.weaponId), `runtime admission references non-Selected16 weapon: ${entry.weaponId}`);
  assert(!seenIds.has(entry.weaponId), `duplicate runtime admission entry: ${entry.weaponId}`);
  seenIds.add(entry.weaponId);
  assert(entry.requiredCapabilities.length >= 1, `${entry.weaponId} needs explicit runtime capability requirements`);
  assert(entry.missingCapabilities.length >= 1, `${entry.weaponId} should remain blocked while U47 supports only Projectile/GroundArea`);
  assert(entry.decision === 'BLOCKED_MISSING_RUNTIME_PRIMITIVES', `${entry.weaponId} must fail closed before implementation`);
  assert(!entry.mayEnterRuntimeRegistry, `${entry.weaponId} must not enter live registry before required primitives exist`);
  assert(entry.contentSelectionPreserved, `${entry.weaponId} Content Master selection must remain preserved`);
  assert(entry.runtimeStatus === 'NOT_IMPLEMENTED', `${entry.weaponId} must not claim runtime implementation`);
}
assert(seenIds.size === 16, 'runtime admission IDs must cover Selected16 exactly once');

for (const [capability, expected] of Object.entries({
  NEAREST_TARGET_PROJECTILE: 'IMPLEMENTED',
  MULTI_PROJECTILE_LOOP: 'IMPLEMENTED',
  CIRCULAR_GROUND_AREA: 'IMPLEMENTED',
  STATUS_APPLICATION: 'MISSING',
  CONE_QUERY: 'MISSING',
  KNOCKBACK_VECTOR: 'MISSING',
  RETURNING_PROJECTILE: 'MISSING',
  REFLECT_WINDOW: 'MISSING',
  ORBIT_LINK: 'MISSING',
} as const)) {
  assert(currentUnityWeaponRuntimeCapabilities[capability as keyof typeof currentUnityWeaponRuntimeCapabilities] === expected, `Unity capability evidence drift: ${capability}`);
}

const definitionSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Definitions/U47GameplayDefinitions.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const importerSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Editor/U47Stage1GameplayDataImporter.cs', import.meta.url), 'utf8');

assert(definitionSource.includes('public enum WeaponEffectType { Projectile, GroundArea }'), 'admission model must be revisited when Unity WeaponEffectType expands beyond Projectile/GroundArea');
assert(importerSource.includes('source.levels[0].effect.type == "projectile" ? WeaponEffectType.Projectile : WeaponEffectType.GroundArea'), 'U47 importer executor mapping changed; update runtime capability evidence');
assert(importerSource.includes('is not ("projectile" or "ground_area")'), 'U47 importer should still fail closed on unsupported effect types');
assert(coordinatorSource.includes('definition.EffectType == WeaponEffectType.Projectile'), 'U47 coordinator projectile executor evidence missing');
assert(coordinatorSource.includes('CountAreas(owned.Id)'), 'U47 coordinator circular GroundArea executor evidence missing');
assert(battleSource.includes('public bool FireGameplayProjectile(float damage, int pierce)'), 'nearest-target projectile API evidence missing');
assert(battleSource.includes('var target = FindNearestEnemy();'), 'current projectile executor must still use nearest-target selection');
assert(!coordinatorSource.includes('WeaponEffectType.Cone'), 'Cone executor unexpectedly exists; admission capability model needs update');
assert(!coordinatorSource.includes('WeaponEffectType.Tether'), 'Tether executor unexpectedly exists; admission capability model needs update');

const archetypes = new Set(title1BaseWeaponRuntimeAdmissionEntries.map((entry) => entry.archetype));
assert(archetypes.size === 16, `Selected16 should remain 16 distinct attack archetypes, got ${archetypes.size}`);

const statusBlock = title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.find((entry) => entry.capability === 'STATUS_APPLICATION');
assert(statusBlock && statusBlock.blockedWeaponCount >= 12, `STATUS_APPLICATION should be a high-leverage shared blocker, got ${statusBlock?.blockedWeaponCount ?? 0}`);

const doc = readFileSync(new URL('../../docs/title1-base-weapon-runtime-admission-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Selected16',
  'Projectile / GroundArea',
  'admitted=0',
  'blocked=16',
  'STATUS_APPLICATION',
  'fake projectile',
  'Wave A',
  'Wave B',
  'Wave C',
  'CONTENT_MASTER',
  'runtime',
]) {
  assert(doc.includes(token), `Base Weapon runtime admission doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  selected16: title1BaseWeaponRuntimeAdmissionSummary.selectedContentWeaponCount,
  admitted: title1BaseWeaponRuntimeAdmissionSummary.admittedRuntimeCount,
  blocked: title1BaseWeaponRuntimeAdmissionSummary.blockedRuntimeCount,
  implementedPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedPrimitiveCount,
  missingPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentMissingPrimitiveCount,
  highestLeverageMissing: title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.slice(0, 6),
  fakeProjectileFallbackAllowed: false,
}, null, 2));
