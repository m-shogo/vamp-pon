import { readFileSync } from 'node:fs';

import { selectedTitle1BaseWeaponCandidates } from '../../src/game/data/baseWeaponSelectionSource.ts';
import {
  selectedBaseWeaponRuntimeAdmissionEntries,
  selectedBaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/selectedBaseWeaponRuntimeAdmissionSource.ts';
import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
  unityPrototypeCallerImplementedWeaponIds,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';
import { CURRENT_RUNTIME_WEAPON_EFFECT_TYPES } from '../../src/game/domain/weaponRuntimeCapabilities.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(selectedTitle1BaseWeaponCandidates.length === 16, 'Title1 selected Base candidates must remain 16');
assert(selectedBaseWeaponRuntimeAdmissionEntries.length === 16, 'Selected16 Web admission matrix must remain exact');
assert(selectedBaseWeaponRuntimeAdmissionSummary.candidateCount === 16, 'Selected16 Web summary must remain exact');
assert(selectedBaseWeaponRuntimeAdmissionSummary.liveCatalogCount === 0, 'Selected16 must remain outside Web live catalog');
assert(selectedBaseWeaponRuntimeAdmissionSummary.runtimeHookImplementedCount === 0, 'Web hooks remain separate from Unity evidence');
assert(selectedBaseWeaponRuntimeAdmissionSummary.readyForAdmissionReviewCount === 0, 'Web admission must remain fail-closed');

assert(CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.join(',') === 'projectile,radial_random_projectile,bouncing_projectile,ground_area,orbit', 'unexpected Web runtime effect surface');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentWebRuntimeEffectTypes === CURRENT_RUNTIME_WEAPON_EFFECT_TYPES, 'Unity overlay must reuse Web effect authority');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentUnityWeaponExecutorTypes.join(',') === 'Projectile,GroundArea', 'Unity live executor surface must remain Projectile/GroundArea');
assert(!title1BaseWeaponRuntimeAdmissionSummary.webRuntimeSupportEqualsUnityRuntimeSupport, 'Web support must not imply Unity implementation');
assert(!title1BaseWeaponRuntimeAdmissionSummary.fakeProjectileFallbackAllowed, 'fake projectile fallback must remain forbidden');
assert(!title1BaseWeaponRuntimeAdmissionSummary.contentSelectionMayBeDowngradedToFitRuntime, 'runtime gaps must not downgrade Selected16 content');
assert(!title1BaseWeaponRuntimeAdmissionSummary.runtimeAutoPromotionAllowed, 'primitive/caller evidence must never auto-promote live runtime');

const implementedCapabilities = [
  'NEAREST_TARGET_PROJECTILE','MULTI_PROJECTILE_LOOP','CIRCULAR_GROUND_AREA','MULTI_TARGET_PROJECTILE_SELECTION','STATUS_APPLICATION',
  'TWO_TARGET_TETHER','KNOCKBACK_VECTOR','CONE_QUERY','SLAM_WAVE_QUERY','BREAK_STAGGER_APPLICATION','HOMING_PRIORITY_SELECTION',
] as const;
for (const capability of implementedCapabilities) {
  assert(currentUnityWeaponRuntimeCapabilities[capability] === 'IMPLEMENTED', `${capability} evidence drift`);
  assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === capability), `${capability} must not remain in missing frequency`);
}
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 11, `expected 11 implemented Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount === 11, `expected 11 missing Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 0, 'STATUS_APPLICATION must not remain a blocker');

const expectedCallerIds = ['ember_matchcase','rain_thread','bellows_fan','pavement_hammer','star_map_pin'] as const;
assert(new Set<string>(unityPrototypeCallerImplementedWeaponIds).size === unityPrototypeCallerImplementedWeaponIds.length, 'prototype caller proof IDs must be unique');
assert(unityPrototypeCallerImplementedWeaponIds.join(',') === expectedCallerIds.join(','), 'caller-proof registry drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.prototypeCallerImplementedCount === 5, 'caller-proof summary drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 5, `expected 5 implementation-review admissions, got ${title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 11, `expected 11 blocked Selected16 entries, got ${title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.join(',') === expectedCallerIds.join(','), 'implementation-review admitted IDs drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount === 0, 'no primitive-complete Selected16 entry should remain without caller proof after Rain Thread lands');

const upstreamById = new Map(selectedBaseWeaponRuntimeAdmissionEntries.map((entry) => [entry.weaponId, entry]));
const selectedIds = new Set(selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId));
const seenIds = new Set<string>();
for (const entry of title1BaseWeaponRuntimeAdmissionEntries) {
  assert(selectedIds.has(entry.weaponId), `Unity admission references non-Selected16 weapon: ${entry.weaponId}`);
  assert(!seenIds.has(entry.weaponId), `duplicate Unity admission entry: ${entry.weaponId}`);
  seenIds.add(entry.weaponId);
  const upstream = upstreamById.get(entry.weaponId);
  assert(upstream, `${entry.weaponId} missing upstream Web admission row`);
  assert(entry.webAdmissionState === upstream.admissionState, `${entry.weaponId} Web state must be inherited`);
  assert(entry.contentSelectionPreserved, `${entry.weaponId} Content selection must remain preserved`);
  assert(entry.runtimeStatus === 'NOT_IMPLEMENTED', `${entry.weaponId} evidence must not claim live runtime`);
}
assert(seenIds.size === 16, 'Unity admission IDs must cover Selected16 once each');

const byId = (weaponId: string) => {
  const entry = title1BaseWeaponRuntimeAdmissionEntries.find((candidate) => candidate.weaponId === weaponId);
  assert(entry, `${weaponId} admission row missing`);
  return entry;
};

const ember = byId('ember_matchcase');
assert(ember.requiredUnityCapabilities.join(',') === 'MULTI_TARGET_PROJECTILE_SELECTION,STATUS_APPLICATION', 'Ember requirements drift');
assert(ember.missingUnityCapabilities.length === 0 && ember.prototypeCallerImplemented, 'Ember primitive/caller proof incomplete');
assert(ember.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && ember.mayEnterUnityRuntimeRegistry, 'Ember implementation-review admission drift');

const rainThread = byId('rain_thread');
assert(rainThread.archetype === 'TETHER', 'Rain Thread archetype drift');
assert(rainThread.requiredUnityCapabilities.join(',') === 'TWO_TARGET_TETHER,KNOCKBACK_VECTOR,STATUS_APPLICATION', `unexpected Rain Thread requirements: ${rainThread.requiredUnityCapabilities.join(',')}`);
assert(rainThread.implementedUnityCapabilities.join(',') === 'TWO_TARGET_TETHER,KNOCKBACK_VECTOR,STATUS_APPLICATION', 'Rain Thread should inherit complete tether + position-control + Status evidence');
assert(rainThread.missingUnityCapabilities.length === 0, `Rain Thread primitive blockers should be clear: ${rainThread.missingUnityCapabilities.join(',')}`);
assert(rainThread.prototypeCallerImplemented, 'Rain Thread caller proof must be explicit');
assert(rainThread.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW', 'Rain Thread should enter implementation review after executable caller proof');
assert(rainThread.mayEnterUnityRuntimeRegistry, 'Rain Thread should pass implementation-review gate only');
assert(rainThread.runtimeStatus === 'NOT_IMPLEMENTED', 'Rain Thread implementation-review admission must not claim live runtime');

const bellows = byId('bellows_fan');
assert(bellows.requiredUnityCapabilities.join(',') === 'CONE_QUERY,KNOCKBACK_VECTOR,STATUS_APPLICATION', 'Bellows requirements drift');
assert(bellows.missingUnityCapabilities.length === 0 && bellows.prototypeCallerImplemented, 'Bellows primitive/caller proof incomplete');
assert(bellows.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && bellows.mayEnterUnityRuntimeRegistry, 'Bellows implementation-review admission drift');

const hammer = byId('pavement_hammer');
assert(hammer.requiredUnityCapabilities.join(',') === 'SLAM_WAVE_QUERY,KNOCKBACK_VECTOR,BREAK_STAGGER_APPLICATION,STATUS_APPLICATION', 'Pavement Hammer requirements drift');
assert(hammer.missingUnityCapabilities.length === 0 && hammer.prototypeCallerImplemented, 'Pavement Hammer primitive/caller proof incomplete');
assert(hammer.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && hammer.mayEnterUnityRuntimeRegistry, 'Pavement Hammer implementation-review admission drift');

const starPin = byId('star_map_pin');
assert(starPin.requiredUnityCapabilities.join(',') === 'HOMING_PRIORITY_SELECTION,STATUS_APPLICATION', `unexpected Star Map Pin requirements: ${starPin.requiredUnityCapabilities.join(',')}`);
assert(starPin.missingUnityCapabilities.length === 0 && starPin.prototypeCallerImplemented, 'Star Map Pin primitive/caller proof incomplete');
assert(starPin.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && starPin.mayEnterUnityRuntimeRegistry, 'Star Map Pin implementation-review admission drift');

const returnNeedle = byId('return_compass_needle');
assert(returnNeedle.archetype === 'RETURN_HOMING', 'Return Compass Needle archetype drift');
assert(returnNeedle.implementedUnityCapabilities.includes('HOMING_PRIORITY_SELECTION'), 'Return Compass Needle must inherit homing-priority evidence');
assert(returnNeedle.missingUnityCapabilities.includes('RETURNING_PROJECTILE'), 'Return Compass Needle must remain blocked until returning capability is separately admitted');
assert(returnNeedle.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES' && !returnNeedle.mayEnterUnityRuntimeRegistry, 'Return Compass Needle must remain primitive-blocked');

for (const entry of title1BaseWeaponRuntimeAdmissionEntries) {
  if ([...expectedCallerIds,'return_compass_needle'].includes(entry.weaponId as typeof expectedCallerIds[number] | 'return_compass_needle')) continue;
  assert(entry.missingUnityCapabilities.length >= 1, `${entry.weaponId} must retain a primitive blocker`);
  assert(!entry.prototypeCallerImplemented, `${entry.weaponId} must not claim caller proof`);
  assert(entry.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES', `${entry.weaponId} should remain primitive-blocked`);
  assert(!entry.mayEnterUnityRuntimeRegistry, `${entry.weaponId} must remain outside implementation review`);
}

const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const tetherSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyTetherPairSelectionRuntime.cs', import.meta.url), 'utf8');
const rainSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/RainThreadPrototypeRuntime.cs', import.meta.url), 'utf8');
assert(tetherSource.includes('public static class U2EnemyTetherPairSelectionRuntime'), 'two-target tether selector source missing');
for (const forbidden of ['rain_thread','SOAK','EnemyStatusRuntimeKind','TakeDamage(','LineRenderer']) {
  assert(!tetherSource.includes(forbidden), `generic tether selector must not own ${forbidden}`);
}
for (const token of [
  'public sealed class RainThreadPrototypeState',
  'public const string WeaponId = "rain_thread";',
  'public const string ContentStatusId = "SOAK";',
  'SELECT_PAIR_SOAK_BOTH_THEN_CALLER_OWNED_PULL_TICKS',
  'U2EnemyTetherPairSelectionRuntime.TrySelectPair(',
  'EnemyStatusRuntimeKind.Soak',
  'U2EnemyKnockbackRuntime.TryApply(',
  'RainThreadLinkEndReason.BrokeByDistance',
]) {
  assert(rainSource.includes(token), `Rain Thread caller evidence missing token: ${token}`);
}
assert(!coordinatorSource.includes('U2EnemyTetherPairSelectionRuntime') && !coordinatorSource.includes('RainThreadPrototypeState') && !coordinatorSource.includes('rain_thread'), 'Tether/Rain Thread prototype must remain outside live Stage1 coordinator');

const doc = readFileSync(new URL('../../docs/title1-base-weapon-runtime-admission-v1.md', import.meta.url), 'utf8');
for (const token of ['Selected16','11 implemented','11 missing','admitted=5','blocked=11','TWO_TARGET_TETHER','KNOCKBACK_VECTOR','rain_thread','RainThreadPrototypeState','ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW','return_compass_needle','RETURNING_PROJECTILE','fake projectile','CONTENT_MASTER']) {
  assert(doc.includes(token), `Base Weapon runtime admission doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS', selected16: 16, admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
  implementedPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount,
  missingPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount,
  primitiveCompleteMissingCallerProof: title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount,
  rainThread: { implemented: rainThread.implementedUnityCapabilities, missing: rainThread.missingUnityCapabilities, decision: rainThread.unityDecision, callerProof: rainThread.prototypeCallerImplemented },
  returnCompassNeedle: { implemented: returnNeedle.implementedUnityCapabilities, missing: returnNeedle.missingUnityCapabilities, decision: returnNeedle.unityDecision },
  liveStage1PrototypeCallers: 0,
}, null, 2));
