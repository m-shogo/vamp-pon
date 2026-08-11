import { readFileSync } from 'node:fs';

import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(currentUnityWeaponRuntimeCapabilities.MULTI_TARGET_PROJECTILE_SELECTION === 'IMPLEMENTED', 'verified multi-target selection primitive must be promoted in Unity admission evidence');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 4, `expected four implemented Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 0, 'primitive promotion alone must not admit a Selected16 weapon');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 16, 'Selected16 must remain blocked until each full archetype/status path is live');

const ember = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'ember_matchcase');
assert(ember, 'ember_matchcase must remain in Selected16 Unity admission matrix');
assert(ember.archetype === 'SCATTER_PROJECTILE', `ember_matchcase archetype drift: ${ember.archetype}`);
assert(ember.requiredUnityCapabilities.includes('MULTI_TARGET_PROJECTILE_SELECTION'), 'ember_matchcase must require multi-target selection');
assert(ember.implementedUnityCapabilities.includes('MULTI_TARGET_PROJECTILE_SELECTION'), 'ember_matchcase must now recognize implemented multi-target primitive');
assert(!ember.missingUnityCapabilities.includes('MULTI_TARGET_PROJECTILE_SELECTION'), 'ember_matchcase must no longer be blocked on multi-target selection');
assert(ember.missingUnityCapabilities.length === 1, `ember_matchcase should now have exactly one Unity blocker, got ${ember.missingUnityCapabilities.join(',')}`);
assert(ember.missingUnityCapabilities[0] === 'STATUS_APPLICATION', `ember_matchcase remaining blocker should be STATUS_APPLICATION, got ${ember.missingUnityCapabilities.join(',')}`);
assert(!ember.mayEnterUnityRuntimeRegistry, 'ember_matchcase must remain blocked until real live Status application evidence exists');

const multiTargetFrequency = title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.find((entry) => entry.capability === 'MULTI_TARGET_PROJECTILE_SELECTION');
assert(!multiTargetFrequency, 'implemented multi-target primitive must disappear from missing capability frequency');
const statusFrequency = title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.find((entry) => entry.capability === 'STATUS_APPLICATION');
assert(statusFrequency?.blockedWeaponCount === 16, `high-level STATUS_APPLICATION must remain shared blocker16, got ${statusFrequency?.blockedWeaponCount ?? 0}`);

const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
assert(battleSource.includes('public int FireGameplayProjectilesAtNearestTargets('), 'admission proof requires live source primitive, not documentation only');
assert(battleSource.includes('private readonly List<U2EnemyActor> nearestEnemyTargetScratch = new(8);'), 'admission proof requires reusable target scratch implementation');
assert(battleSource.includes('SortNearestEnemyScratchPrefix(targetCount);'), 'admission proof requires deterministic nearest-prefix selection');
assert(battleSource.includes('FireGameplayProjectileAtTarget('), 'multi-target selection must feed canonical target-spawn primitive');
assert(!coordinatorSource.includes('FireGameplayProjectilesAtNearestTargets'), 'real Selected16 multi-target caller is still intentionally absent');

console.log(JSON.stringify({
  status: 'PASS',
  implementedUnityPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount,
  selected16Admitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
  emberMatchcase: {
    archetype: ember.archetype,
    implementedCapabilities: ember.implementedUnityCapabilities,
    remainingBlockers: ember.missingUnityCapabilities,
  },
  liveMultiTargetCallers: 0,
}, null, 2));
