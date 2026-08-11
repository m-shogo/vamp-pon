import { readFileSync } from 'node:fs';

import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(currentUnityWeaponRuntimeCapabilities.MULTI_TARGET_PROJECTILE_SELECTION === 'IMPLEMENTED', 'verified multi-target primitive must remain implemented');
assert(currentUnityWeaponRuntimeCapabilities.STATUS_APPLICATION === 'IMPLEMENTED', 'Selected16-specific Status caller must promote shared STATUS_APPLICATION primitive');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount >= 5, `multi-target proof requires at least the five historical implemented primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 1, 'exactly first Selected16 weapon should pass primitive admission');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 15, 'remaining Selected15 must stay blocked');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.join(',') === 'ember_matchcase', `unexpected admitted IDs: ${title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.join(',')}`);

const ember = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'ember_matchcase');
assert(ember, 'ember_matchcase must remain in Selected16 Unity admission matrix');
assert(ember.archetype === 'SCATTER_PROJECTILE', `ember_matchcase archetype drift: ${ember.archetype}`);
assert(ember.requiredUnityCapabilities.join(',') === 'MULTI_TARGET_PROJECTILE_SELECTION,STATUS_APPLICATION', `unexpected Ember requirements: ${ember.requiredUnityCapabilities.join(',')}`);
assert(ember.implementedUnityCapabilities.includes('MULTI_TARGET_PROJECTILE_SELECTION'), 'Ember must recognize multi-target primitive');
assert(ember.implementedUnityCapabilities.includes('STATUS_APPLICATION'), 'Ember must recognize Status application primitive');
assert(ember.missingUnityCapabilities.length === 0, `Ember should have no remaining primitive blocker: ${ember.missingUnityCapabilities.join(',')}`);
assert(ember.mayEnterUnityRuntimeRegistry, 'Ember should be admitted for implementation review');
assert(ember.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW', 'Ember decision drift');
assert(ember.runtimeStatus === 'NOT_IMPLEMENTED', 'primitive admission must not claim live runtime implementation');

assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === 'MULTI_TARGET_PROJECTILE_SELECTION'), 'implemented multi-target primitive must not remain missing');
assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === 'STATUS_APPLICATION'), 'implemented Status primitive must not remain missing');

const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const emberSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/EmberMatchcasePrototypeRuntime.cs', import.meta.url), 'utf8');
assert(battleSource.includes('public int FireGameplayProjectilesAtNearestTargets('), 'admission proof requires real multi-target primitive');
assert(battleSource.includes('EnemyStatusApplicationRequest? statusApplicationRequest'), 'admission proof requires typed Status transport');
assert(emberSource.includes('public const string WeaponId = "ember_matchcase";'), 'admission proof must bind exact Selected16 ID');
assert(emberSource.includes('EnemyStatusRuntimeKind.Burn'), 'admission proof must bind exact BURN status');
assert(emberSource.includes('battle.FireGameplayProjectilesAtNearestTargets('), 'admission proof requires Selected16-specific real caller');
assert(emberSource.includes('CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON'), 'admission proof must preserve prototype tuning boundary');
assert(!coordinatorSource.includes('EmberMatchcasePrototypeRuntime'), 'implementation-review admission must not silently enable live Stage1 loop');

console.log(JSON.stringify({
  status: 'PASS',
  implementedUnityPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount,
  selected16Admitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
  admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
  emberMatchcase: {
    archetype: ember.archetype,
    implementedCapabilities: ember.implementedUnityCapabilities,
    remainingBlockers: ember.missingUnityCapabilities,
    liveRuntimeStatus: ember.runtimeStatus,
  },
  liveStage1Callers: 0,
}, null, 2));
