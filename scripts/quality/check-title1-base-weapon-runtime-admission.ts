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
  'NEAREST_TARGET_PROJECTILE',
  'MULTI_PROJECTILE_LOOP',
  'CIRCULAR_GROUND_AREA',
  'MULTI_TARGET_PROJECTILE_SELECTION',
  'STATUS_APPLICATION',
  'KNOCKBACK_VECTOR',
  'CONE_QUERY',
  'SLAM_WAVE_QUERY',
  'BREAK_STAGGER_APPLICATION',
  'HOMING_PRIORITY_SELECTION',
] as const;
for (const capability of implementedCapabilities) {
  assert(currentUnityWeaponRuntimeCapabilities[capability] === 'IMPLEMENTED', `${capability} evidence drift`);
  assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === capability), `${capability} must not remain in missing frequency`);
}
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 10, `expected 10 implemented Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount === 12, `expected 12 missing Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 0, 'STATUS_APPLICATION must not remain a blocker');

assert(new Set<string>(unityPrototypeCallerImplementedWeaponIds).size === unityPrototypeCallerImplementedWeaponIds.length, 'prototype caller proof IDs must be unique');
assert(unityPrototypeCallerImplementedWeaponIds.join(',') === 'ember_matchcase,bellows_fan,pavement_hammer', 'caller-proof registry drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.prototypeCallerImplementedCount === 3, 'caller-proof summary drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 3, `expected 3 implementation-review admissions, got ${title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 13, `expected 13 blocked Selected16 entries, got ${title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.join(',') === 'ember_matchcase,bellows_fan,pavement_hammer', 'implementation-review admitted IDs drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount === 1, 'Star Map Pin should be the one primitive-complete caller-proof blocker');

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

const bellows = byId('bellows_fan');
assert(bellows.requiredUnityCapabilities.join(',') === 'CONE_QUERY,KNOCKBACK_VECTOR,STATUS_APPLICATION', 'Bellows requirements drift');
assert(bellows.missingUnityCapabilities.length === 0 && bellows.prototypeCallerImplemented, 'Bellows primitive/caller proof incomplete');
assert(bellows.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && bellows.mayEnterUnityRuntimeRegistry, 'Bellows implementation-review admission drift');

const hammer = byId('pavement_hammer');
assert(hammer.requiredUnityCapabilities.join(',') === 'SLAM_WAVE_QUERY,KNOCKBACK_VECTOR,BREAK_STAGGER_APPLICATION,STATUS_APPLICATION', 'Pavement Hammer requirements drift');
assert(hammer.missingUnityCapabilities.length === 0 && hammer.prototypeCallerImplemented, 'Pavement Hammer primitive/caller proof incomplete');
assert(hammer.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && hammer.mayEnterUnityRuntimeRegistry, 'Pavement Hammer implementation-review admission drift');

const starPin = byId('star_map_pin');
assert(starPin.archetype === 'HOMING_SNIPE', 'Star Map Pin archetype drift');
assert(starPin.requiredUnityCapabilities.join(',') === 'HOMING_PRIORITY_SELECTION,STATUS_APPLICATION', `unexpected Star Map Pin requirements: ${starPin.requiredUnityCapabilities.join(',')}`);
assert(starPin.implementedUnityCapabilities.join(',') === 'HOMING_PRIORITY_SELECTION,STATUS_APPLICATION', 'Star Map Pin should inherit complete shared primitive evidence');
assert(starPin.missingUnityCapabilities.length === 0, `Star Map Pin primitive blockers should be clear: ${starPin.missingUnityCapabilities.join(',')}`);
assert(!starPin.prototypeCallerImplemented, 'shared selector must not fabricate Star Map Pin caller proof');
assert(starPin.unityDecision === 'BLOCKED_MISSING_UNITY_CALLER_PROOF', 'Star Map Pin must stop at caller-proof gate');
assert(!starPin.mayEnterUnityRuntimeRegistry, 'Star Map Pin must remain outside implementation review until caller proof');

const returnNeedle = byId('return_compass_needle');
assert(returnNeedle.archetype === 'RETURN_HOMING', 'Return Compass Needle archetype drift');
assert(returnNeedle.implementedUnityCapabilities.includes('HOMING_PRIORITY_SELECTION'), 'Return Compass Needle must inherit homing-priority evidence');
assert(returnNeedle.missingUnityCapabilities.includes('RETURNING_PROJECTILE'), 'Return Compass Needle must remain blocked by returning projectile');
assert(returnNeedle.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES' && !returnNeedle.mayEnterUnityRuntimeRegistry, 'Return Compass Needle must remain primitive-blocked');

for (const entry of title1BaseWeaponRuntimeAdmissionEntries) {
  if (['ember_matchcase', 'bellows_fan', 'pavement_hammer', 'star_map_pin', 'return_compass_needle'].includes(entry.weaponId)) continue;
  assert(entry.missingUnityCapabilities.length >= 1, `${entry.weaponId} must retain a primitive blocker`);
  assert(!entry.prototypeCallerImplemented, `${entry.weaponId} must not claim caller proof`);
  assert(entry.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES', `${entry.weaponId} should remain primitive-blocked`);
  assert(!entry.mayEnterUnityRuntimeRegistry, `${entry.weaponId} must remain outside implementation review`);
}

const definitionSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Definitions/U47GameplayDefinitions.cs', import.meta.url), 'utf8');
const importerSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Editor/U47Stage1GameplayDataImporter.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const emberSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/EmberMatchcasePrototypeRuntime.cs', import.meta.url), 'utf8');
const bellowsSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/BellowsFanPrototypeRuntime.cs', import.meta.url), 'utf8');
const hammerSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PavementHammerPrototypeRuntime.cs', import.meta.url), 'utf8');
const homingSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyHomingPrioritySelectionRuntime.cs', import.meta.url), 'utf8');

assert(definitionSource.includes('public enum WeaponEffectType { Projectile, GroundArea }'), 'Unity live executor enum drift');
assert(importerSource.includes('is not ("projectile" or "ground_area")'), 'U47 importer must fail closed on unsupported effect types');
assert(battleSource.includes('public int FireGameplayProjectilesAtNearestTargets('), 'multi-target primitive missing');
assert(battleSource.includes('public bool TakeDamage(float damage, float damageFlashSeconds)'), 'enemy HP damage API missing');
assert(emberSource.includes('EnemyStatusRuntimeKind.Burn') && emberSource.includes('battle.FireGameplayProjectilesAtNearestTargets('), 'Ember caller evidence missing');
assert(bellowsSource.includes('EnemyStatusRuntimeKind.Disoriented') && bellowsSource.includes('U2EnemyConeQueryRuntime.SelectTargets('), 'Bellows caller evidence missing');
assert(hammerSource.includes('EnemyStatusRuntimeKind.Exposed') && hammerSource.includes('U2EnemyBreakStaggerRuntime.TryApply('), 'Pavement Hammer caller evidence missing');
for (const token of [
  'public static class U2EnemyHomingPrioritySelectionRuntime',
  'IReadOnlyList<float> priorityScores',
  'U2EnemyPriorityDistanceTieBreak.PreferFarther',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
]) {
  assert(homingSource.includes(token), `homing priority implementation evidence missing token: ${token}`);
}
for (const forbidden of ['star_map_pin', 'return_compass_needle', 'MARKED', 'EnemyStatusRuntimeKind']) {
  assert(!homingSource.includes(forbidden), `generic homing priority source must not own ${forbidden}`);
}

for (const forbiddenLiveToken of [
  'EmberMatchcasePrototypeRuntime',
  'BellowsFanPrototypeRuntime',
  'PavementHammerPrototypeRuntime',
  'U2EnemyHomingPrioritySelectionRuntime',
  'star_map_pin',
  'pavement_hammer',
]) {
  assert(!coordinatorSource.includes(forbiddenLiveToken), `prototype/shared primitive leaked into live Stage1 coordinator: ${forbiddenLiveToken}`);
}

const doc = readFileSync(new URL('../../docs/title1-base-weapon-runtime-admission-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Selected16',
  'Web runtime = 5',
  'Unity runtime = 2',
  '10 implemented',
  '12 missing',
  'admitted=3',
  'blocked=13',
  'star_map_pin',
  'HOMING_PRIORITY_SELECTION',
  'BLOCKED_MISSING_UNITY_CALLER_PROOF',
  'return_compass_needle',
  'RETURNING_PROJECTILE',
  'fake projectile',
  'CONTENT_MASTER',
]) {
  assert(doc.includes(token), `Base Weapon runtime admission doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  selected16: 16,
  admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
  implementedPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount,
  missingPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount,
  primitiveCompleteMissingCallerProof: title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount,
  starMapPin: {
    implemented: starPin.implementedUnityCapabilities,
    missing: starPin.missingUnityCapabilities,
    decision: starPin.unityDecision,
    callerProof: starPin.prototypeCallerImplemented,
  },
  returnCompassNeedle: {
    implemented: returnNeedle.implementedUnityCapabilities,
    missing: returnNeedle.missingUnityCapabilities,
    decision: returnNeedle.unityDecision,
  },
  liveStage1PrototypeCallers: 0,
}, null, 2));
