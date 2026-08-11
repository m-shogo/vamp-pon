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

// Upstream Content/Web authority stays exact and fail-closed.
assert(selectedTitle1BaseWeaponCandidates.length === 16, 'Title1 selected Base candidates must remain 16');
assert(selectedBaseWeaponRuntimeAdmissionEntries.length === 16, 'Selected16 Web admission matrix must remain exact');
assert(selectedBaseWeaponRuntimeAdmissionSummary.candidateCount === 16, 'Selected16 Web summary must remain exact');
assert(selectedBaseWeaponRuntimeAdmissionSummary.liveCatalogCount === 0, 'Selected16 must remain outside Web live catalog');
assert(selectedBaseWeaponRuntimeAdmissionSummary.runtimeHookImplementedCount === 0, 'Web hooks remain separate from Unity prototype evidence');
assert(selectedBaseWeaponRuntimeAdmissionSummary.readyForAdmissionReviewCount === 0, 'Web admission must remain fail-closed');

assert(CURRENT_RUNTIME_WEAPON_EFFECT_TYPES.join(',') === 'projectile,radial_random_projectile,bouncing_projectile,ground_area,orbit', 'unexpected Web runtime effect surface');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentWebRuntimeEffectTypes === CURRENT_RUNTIME_WEAPON_EFFECT_TYPES, 'Unity overlay must reuse Web effect authority');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentUnityWeaponExecutorTypes.join(',') === 'Projectile,GroundArea', 'Unity U47 live executor surface must remain Projectile/GroundArea');
assert(!title1BaseWeaponRuntimeAdmissionSummary.webRuntimeSupportEqualsUnityRuntimeSupport, 'Web capability must never imply Unity implementation');
assert(!title1BaseWeaponRuntimeAdmissionSummary.fakeProjectileFallbackAllowed, 'fake projectile fallback must remain forbidden');
assert(!title1BaseWeaponRuntimeAdmissionSummary.contentSelectionMayBeDowngradedToFitRuntime, 'runtime gaps must not downgrade Content selection');
assert(!title1BaseWeaponRuntimeAdmissionSummary.runtimeAutoPromotionAllowed, 'shared primitive work must never auto-promote live runtime');

// Shared primitive evidence after SLAM_WAVE_QUERY plus explicit missing break/stagger capability.
for (const capability of [
  'NEAREST_TARGET_PROJECTILE',
  'MULTI_PROJECTILE_LOOP',
  'CIRCULAR_GROUND_AREA',
  'MULTI_TARGET_PROJECTILE_SELECTION',
  'STATUS_APPLICATION',
  'KNOCKBACK_VECTOR',
  'CONE_QUERY',
  'SLAM_WAVE_QUERY',
] as const) {
  assert(currentUnityWeaponRuntimeCapabilities[capability] === 'IMPLEMENTED', `${capability} evidence drift`);
}
assert(currentUnityWeaponRuntimeCapabilities.BREAK_STAGGER_APPLICATION === 'MISSING', 'break/stagger runtime must remain explicitly missing until implemented');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 8, `expected 8 implemented Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount === 14, `expected 14 missing Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 0, 'STATUS_APPLICATION must not remain a blocker');
assert(title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === 'BREAK_STAGGER_APPLICATION'), 'break/stagger gap must remain visible in missing capability frequency');
for (const implementedCapability of ['STATUS_APPLICATION', 'KNOCKBACK_VECTOR', 'CONE_QUERY', 'SLAM_WAVE_QUERY'] as const) {
  assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === implementedCapability), `${implementedCapability} must not remain in missing capability frequency`);
}

// Caller-proof registry remains explicit. Primitive completeness alone is insufficient by design.
assert(new Set<string>(unityPrototypeCallerImplementedWeaponIds).size === unityPrototypeCallerImplementedWeaponIds.length, 'prototype caller proof IDs must be unique');
assert(unityPrototypeCallerImplementedWeaponIds.length === 2, 'exactly Ember + Bellows caller proofs should exist');
assert(unityPrototypeCallerImplementedWeaponIds.includes('ember_matchcase'), 'Ember caller proof missing');
assert(unityPrototypeCallerImplementedWeaponIds.includes('bellows_fan'), 'Bellows caller proof missing');
assert(!new Set<string>(unityPrototypeCallerImplementedWeaponIds).has('pavement_hammer'), 'Pavement Hammer caller proof must remain absent');
assert(title1BaseWeaponRuntimeAdmissionSummary.prototypeCallerImplementedCount === 2, 'caller-proof summary drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount === 0, 'no weapon should currently be primitive-complete without caller proof after break/stagger audit');

// Unity implementation-review Admission remains only the two actually proven Selected16 callers.
assert(title1BaseWeaponRuntimeAdmissionEntries.length === 16, 'Unity overlay must cover Selected16 exactly');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 2, `expected 2 implementation-review admissions, got ${title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 14, `expected 14 blocked Selected16 entries, got ${title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.join(',') === 'ember_matchcase,bellows_fan', `unexpected admitted IDs: ${title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.join(',')}`);

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
  assert(entry.runtimeStatus === 'NOT_IMPLEMENTED', `${entry.weaponId} implementation-review evidence must not claim live runtime`);
}
assert(seenIds.size === 16, 'Unity admission IDs must cover Selected16 once each');

const ember = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'ember_matchcase');
assert(ember, 'ember_matchcase admission row missing');
assert(ember.archetype === 'SCATTER_PROJECTILE', 'Ember archetype drift');
assert(ember.requiredUnityCapabilities.join(',') === 'MULTI_TARGET_PROJECTILE_SELECTION,STATUS_APPLICATION', `unexpected Ember requirements: ${ember.requiredUnityCapabilities.join(',')}`);
assert(ember.missingUnityCapabilities.length === 0 && ember.prototypeCallerImplemented, 'Ember must have complete primitive + caller proof');
assert(ember.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && ember.mayEnterUnityRuntimeRegistry, 'Ember implementation-review admission drift');

const bellows = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'bellows_fan');
assert(bellows, 'bellows_fan admission row missing');
assert(bellows.archetype === 'CONE_PUSH', 'Bellows archetype drift');
assert(bellows.requiredUnityCapabilities.join(',') === 'CONE_QUERY,KNOCKBACK_VECTOR,STATUS_APPLICATION', `unexpected Bellows requirements: ${bellows.requiredUnityCapabilities.join(',')}`);
assert(bellows.missingUnityCapabilities.length === 0 && bellows.prototypeCallerImplemented, 'Bellows must have complete primitive + caller proof');
assert(bellows.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && bellows.mayEnterUnityRuntimeRegistry, 'Bellows implementation-review admission drift');

const hammer = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'pavement_hammer');
assert(hammer, 'pavement_hammer admission row missing');
assert(hammer.archetype === 'SLAM_WAVE', 'Pavement Hammer archetype drift');
assert(
  hammer.requiredUnityCapabilities.join(',') === 'SLAM_WAVE_QUERY,KNOCKBACK_VECTOR,BREAK_STAGGER_APPLICATION,STATUS_APPLICATION',
  `unexpected Pavement Hammer requirements: ${hammer.requiredUnityCapabilities.join(',')}`,
);
assert(hammer.implementedUnityCapabilities.join(',') === 'SLAM_WAVE_QUERY,KNOCKBACK_VECTOR,STATUS_APPLICATION', `unexpected Pavement Hammer implemented capabilities: ${hammer.implementedUnityCapabilities.join(',')}`);
assert(hammer.missingUnityCapabilities.join(',') === 'BREAK_STAGGER_APPLICATION', `Pavement Hammer must be blocked by break/stagger runtime only, got ${hammer.missingUnityCapabilities.join(',')}`);
assert(!hammer.prototypeCallerImplemented, 'Pavement Hammer caller proof must remain absent');
assert(hammer.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES', 'Pavement Hammer must remain primitive-blocked until break/stagger exists');
assert(!hammer.mayEnterUnityRuntimeRegistry, 'Pavement Hammer must not enter implementation-review Admission yet');

// Every other Selected16 entry still has a real primitive blocker and no caller proof.
for (const entry of title1BaseWeaponRuntimeAdmissionEntries) {
  if (entry.weaponId === 'ember_matchcase' || entry.weaponId === 'bellows_fan' || entry.weaponId === 'pavement_hammer') continue;
  assert(entry.missingUnityCapabilities.length >= 1, `${entry.weaponId} must retain a primitive blocker`);
  assert(!entry.prototypeCallerImplemented, `${entry.weaponId} must not claim caller proof`);
  assert(entry.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES', `${entry.weaponId} should remain primitive-blocked`);
  assert(!entry.mayEnterUnityRuntimeRegistry, `${entry.weaponId} must remain outside implementation review`);
}

// Real source evidence and live boundary.
const definitionSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Definitions/U47GameplayDefinitions.cs', import.meta.url), 'utf8');
const importerSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Editor/U47Stage1GameplayDataImporter.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const emberSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/EmberMatchcasePrototypeRuntime.cs', import.meta.url), 'utf8');
const bellowsSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/BellowsFanPrototypeRuntime.cs', import.meta.url), 'utf8');
const knockbackSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyKnockbackRuntime.cs', import.meta.url), 'utf8');
const coneSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyConeQueryRuntime.cs', import.meta.url), 'utf8');
const slamSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemySlamWaveQueryRuntime.cs', import.meta.url), 'utf8');

assert(definitionSource.includes('public enum WeaponEffectType { Projectile, GroundArea }'), 'Unity live executor enum drift');
assert(importerSource.includes('is not ("projectile" or "ground_area")'), 'U47 importer must fail closed on unsupported effect types');
assert(battleSource.includes('public int FireGameplayProjectilesAtNearestTargets('), 'multi-target primitive missing');
assert(battleSource.includes('public bool TakeDamage(float damage, float damageFlashSeconds)'), 'enemy HP damage API missing');
assert(!battleSource.includes('breakGauge') && !battleSource.includes('staggerGauge') && !battleSource.includes('poiseGauge'), 'break/stagger must not be claimed implemented through hidden U2 fields');
assert(emberSource.includes('EnemyStatusRuntimeKind.Burn') && emberSource.includes('battle.FireGameplayProjectilesAtNearestTargets('), 'Ember caller evidence missing');
assert(bellowsSource.includes('EnemyStatusRuntimeKind.Disoriented') && bellowsSource.includes('U2EnemyConeQueryRuntime.SelectTargets(') && bellowsSource.includes('U2EnemyKnockbackRuntime.TryApply('), 'Bellows caller evidence missing');
assert(knockbackSource.includes('public static class U2EnemyKnockbackRuntime'), 'knockback helper missing');
assert(coneSource.includes('public static class U2EnemyConeQueryRuntime'), 'cone helper missing');
assert(slamSource.includes('public static class U2EnemySlamWaveQueryRuntime'), 'slam-wave helper missing');
assert(!slamSource.includes('pavement_hammer') && !slamSource.includes('EXPOSED'), 'generic slam-wave query must not own Pavement Hammer identity');

for (const forbiddenLiveToken of [
  'EmberMatchcasePrototypeRuntime',
  'BellowsFanPrototypeRuntime',
  'U2EnemyKnockbackRuntime',
  'U2EnemyConeQueryRuntime',
  'U2EnemySlamWaveQueryRuntime',
  'pavement_hammer',
]) {
  assert(!coordinatorSource.includes(forbiddenLiveToken), `prototype/shared primitive leaked into live Stage1 coordinator: ${forbiddenLiveToken}`);
}

const doc = readFileSync(new URL('../../docs/title1-base-weapon-runtime-admission-v1.md', import.meta.url), 'utf8');
for (const token of [
  'Selected16',
  'Web runtime = 5',
  'Unity runtime = 2',
  'admitted=2',
  'blocked=14',
  'ember_matchcase',
  'bellows_fan',
  'pavement_hammer',
  'SLAM_WAVE_QUERY',
  'BREAK_STAGGER_APPLICATION',
  'BLOCKED_MISSING_UNITY_PRIMITIVES',
  'BLOCKED_MISSING_UNITY_CALLER_PROOF',
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
  pavementHammer: {
    implemented: hammer.implementedUnityCapabilities,
    missing: hammer.missingUnityCapabilities,
    decision: hammer.unityDecision,
    callerProof: hammer.prototypeCallerImplemented,
  },
  liveStage1PrototypeCallers: 0,
}, null, 2));
