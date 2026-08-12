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
assert(title1BaseWeaponRuntimeAdmissionSummary.currentUnityWeaponExecutorTypes.join(',') === 'Projectile,GroundArea', 'Unity live executor surface must remain Projectile/GroundArea');
assert(!title1BaseWeaponRuntimeAdmissionSummary.webRuntimeSupportEqualsUnityRuntimeSupport, 'Web support must not imply Unity implementation');
assert(!title1BaseWeaponRuntimeAdmissionSummary.fakeProjectileFallbackAllowed, 'fake projectile fallback must remain forbidden');
assert(!title1BaseWeaponRuntimeAdmissionSummary.contentSelectionMayBeDowngradedToFitRuntime, 'runtime gaps must not downgrade Selected16 content');
assert(!title1BaseWeaponRuntimeAdmissionSummary.runtimeAutoPromotionAllowed, 'primitive/caller evidence must never auto-promote live runtime');

const implementedCapabilities = [
  'NEAREST_TARGET_PROJECTILE','MULTI_PROJECTILE_LOOP','CIRCULAR_GROUND_AREA','MULTI_TARGET_PROJECTILE_SELECTION','STATUS_APPLICATION',
  'TWO_TARGET_TETHER','KNOCKBACK_VECTOR','CONE_QUERY','TARGET_CHAIN_SELECTION','SLAM_WAVE_QUERY','BREAK_STAGGER_APPLICATION',
  'HOMING_PRIORITY_SELECTION','RETURNING_PROJECTILE','TRAP_PERSISTENCE','DELAYED_TRIGGER',
] as const;
for (const capability of implementedCapabilities) {
  assert(currentUnityWeaponRuntimeCapabilities[capability] === 'IMPLEMENTED', `${capability} evidence drift`);
  assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === capability), `${capability} must not remain in missing frequency`);
}
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 15, `expected 15 implemented Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount === 7, `expected 7 missing Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 0, 'STATUS_APPLICATION must not remain a blocker');

const expectedCallerIds = ['ember_matchcase','rain_thread','bellows_fan','copper_tuning_fork','pavement_hammer','pressed_flower_cards','dream_alarm','star_map_pin','return_compass_needle'] as const;
assert(new Set<string>(unityPrototypeCallerImplementedWeaponIds).size === unityPrototypeCallerImplementedWeaponIds.length, 'prototype caller proof IDs must be unique');
assert(unityPrototypeCallerImplementedWeaponIds.join(',') === expectedCallerIds.join(','), 'caller-proof registry drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.prototypeCallerImplementedCount === 9, 'caller-proof summary drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 9, `expected 9 implementation-review admissions, got ${title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 7, `expected 7 blocked Selected16 entries, got ${title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.join(',') === expectedCallerIds.join(','), 'implementation-review admitted IDs drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount === 0, 'no primitive-complete Selected16 entry should remain without caller proof');

const upstreamById = new Map(selectedBaseWeaponRuntimeAdmissionEntries.map((entry) => [entry.weaponId, entry]));
const selectedIds = new Set(selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId));
for (const entry of title1BaseWeaponRuntimeAdmissionEntries) {
  assert(selectedIds.has(entry.weaponId), `Unity admission references non-Selected16 weapon: ${entry.weaponId}`);
  const upstream = upstreamById.get(entry.weaponId);
  assert(upstream, `${entry.weaponId} missing upstream Web admission row`);
  assert(entry.webAdmissionState === upstream.admissionState, `${entry.weaponId} Web state must be inherited`);
  assert(entry.contentSelectionPreserved, `${entry.weaponId} Content selection must remain preserved`);
  assert(entry.runtimeStatus === 'NOT_IMPLEMENTED', `${entry.weaponId} evidence must not claim live runtime`);
}

const byId = (weaponId: string) => {
  const entry = title1BaseWeaponRuntimeAdmissionEntries.find((candidate) => candidate.weaponId === weaponId);
  assert(entry, `${weaponId} admission row missing`);
  return entry;
};

for (const weaponId of ['ember_matchcase','rain_thread','bellows_fan','copper_tuning_fork','pavement_hammer','pressed_flower_cards','star_map_pin','return_compass_needle'] as const) {
  const entry = byId(weaponId);
  assert(entry.missingUnityCapabilities.length === 0 && entry.prototypeCallerImplemented, `${weaponId} primitive/caller proof incomplete`);
  assert(entry.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && entry.mayEnterUnityRuntimeRegistry, `${weaponId} implementation-review admission drift`);
}

const dream = byId('dream_alarm');
assert(dream.archetype === 'DELAYED_PULSE', 'Dream Alarm archetype drift');
assert(dream.requiredUnityCapabilities.join(',') === 'DELAYED_TRIGGER,STATUS_APPLICATION', `Dream Alarm requirements drift: ${dream.requiredUnityCapabilities.join(',')}`);
assert(dream.implementedUnityCapabilities.join(',') === 'DELAYED_TRIGGER,STATUS_APPLICATION', 'Dream Alarm should inherit verified delay + Status primitives');
assert(dream.missingUnityCapabilities.length === 0 && dream.prototypeCallerImplemented, 'Dream Alarm primitive/caller proof incomplete');
assert(dream.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && dream.mayEnterUnityRuntimeRegistry, 'Dream Alarm implementation-review admission drift');
assert(dream.runtimeStatus === 'NOT_IMPLEMENTED', 'Dream Alarm implementation review must not claim live runtime');

for (const entry of title1BaseWeaponRuntimeAdmissionEntries) {
  if (expectedCallerIds.includes(entry.weaponId as typeof expectedCallerIds[number])) continue;
  assert(entry.missingUnityCapabilities.length >= 1, `${entry.weaponId} must retain a primitive blocker`);
  assert(!entry.prototypeCallerImplemented, `${entry.weaponId} must not claim caller proof`);
  assert(entry.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES', `${entry.weaponId} should remain primitive-blocked`);
  assert(!entry.mayEnterUnityRuntimeRegistry, `${entry.weaponId} must remain outside implementation review`);
}

const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const dreamSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/DreamAlarmPrototypeRuntime.cs', import.meta.url), 'utf8');
for (const token of ['public sealed class DreamAlarmPrototypeState','public const string WeaponId = "dream_alarm";','PLACE_WAIT_READY_EXPLICIT_CONSUME_AREA_DROWSY','U2DelayedTriggerState','EnemyStatusRuntimeKind.Drowsy','trigger.TryConsume()']) {
  assert(dreamSource.includes(token), `Dream Alarm caller evidence missing token: ${token}`);
}
assert(!coordinatorSource.includes('DreamAlarmPrototypeState') && !coordinatorSource.includes('dream_alarm') && !coordinatorSource.includes('U2DelayedTriggerState'), 'Dream Alarm prototype must remain outside live Stage1 coordinator');

const doc = readFileSync(new URL('../../docs/title1-base-weapon-runtime-admission-v1.md', import.meta.url), 'utf8');
for (const token of ['Selected16','15 implemented','7 missing','admitted=9','blocked=7','DELAYED_TRIGGER','dream_alarm','DreamAlarmPrototypeState','TRAP_PERSISTENCE','TARGET_CHAIN_SELECTION','RETURNING_PROJECTILE','Boss conversion','fake projectile','CONTENT_MASTER']) {
  assert(doc.includes(token), `Base Weapon runtime admission doc missing token: ${token}`);
}

console.log(JSON.stringify({ status: 'PASS', selected16: 16, admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds, implementedPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount, missingPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount, dreamAlarm: { implemented: dream.implementedUnityCapabilities, missing: dream.missingUnityCapabilities, decision: dream.unityDecision, callerProof: dream.prototypeCallerImplemented, runtimeStatus: dream.runtimeStatus }, liveStage1PrototypeCallers: 0 }, null, 2));
