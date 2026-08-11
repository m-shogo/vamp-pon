import { readFileSync } from 'node:fs';

import { weapons } from '../../src/game/data/weapons.ts';
import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const source = readFileSync(
  new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemySlamWaveQueryRuntime.cs', import.meta.url),
  'utf8',
);
const callerSource = readFileSync(
  new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PavementHammerPrototypeRuntime.cs', import.meta.url),
  'utf8',
);
const coordinatorSource = readFileSync(
  new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url),
  'utf8',
);

for (const token of [
  'public static class U2EnemySlamWaveQueryRuntime',
  'public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";',
  'IReadOnlyList<U2EnemyActor> candidates',
  'List<U2EnemyActor> results',
  'float innerRadius',
  'float outerRadius',
  'float halfAngleDegrees',
  'if (ReferenceEquals(candidates, results))',
  'innerRadius > outerRadius',
  'Math.Cos(halfAngleDegrees * Math.PI / 180.0)',
  'candidate == null || !candidate.IsTargetable',
  'results.Insert(insertIndex, candidate);',
]) {
  assert(source.includes(token), `slam-wave query primitive missing token: ${token}`);
}

for (const forbidden of [
  'pavement_hammer',
  'EXPOSED',
  'EnemyStatusRuntimeKind',
  'EnemyStatusApplicationPolicy',
  'U2EnemyKnockbackRuntime',
  'U2EnemyBreakStaggerRuntime',
  'BreakGauge',
  'StaggerGauge',
  'Poise',
  'Time.',
  'deltaTime',
  'ParticleSystem',
  'Instantiate(',
  '.OrderBy(',
  '.Where(',
]) {
  assert(!source.includes(forbidden), `generic slam-wave query must not own ${forbidden}`);
}

for (const token of [
  'public static class PavementHammerPrototypeRuntime',
  'U2EnemySlamWaveQueryRuntime.SelectTargets(',
  'target.TakeDamage(damage, damageFlashSeconds)',
  'EnemyStatusRuntimeKind.Exposed',
  'U2EnemyKnockbackRuntime.TryApplyFromPoint(',
  'U2EnemyBreakStaggerRuntime.TryApply(',
  'QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER',
  'PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
]) {
  assert(callerSource.includes(token), `Pavement Hammer caller must compose slam-wave primitive without mutating it: ${token}`);
}

assert(currentUnityWeaponRuntimeCapabilities.SLAM_WAVE_QUERY === 'IMPLEMENTED', 'SLAM_WAVE_QUERY must remain backed by reusable sector-band source');
assert(currentUnityWeaponRuntimeCapabilities.BREAK_STAGGER_APPLICATION === 'IMPLEMENTED', 'break/stagger runtime must remain backed by reusable implementation');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 10, `expected 10 implemented primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount === 12, `expected 12 missing primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount}`);
for (const implemented of ['SLAM_WAVE_QUERY', 'BREAK_STAGGER_APPLICATION'] as const) {
  assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === implemented), `${implemented} must disappear from missing frequency`);
}

const hammer = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'pavement_hammer');
assert(hammer, 'pavement_hammer admission row missing');
assert(hammer.archetype === 'SLAM_WAVE', `pavement_hammer archetype drift: ${hammer.archetype}`);
assert(
  hammer.requiredUnityCapabilities.join(',') === 'SLAM_WAVE_QUERY,KNOCKBACK_VECTOR,BREAK_STAGGER_APPLICATION,STATUS_APPLICATION',
  `unexpected pavement_hammer requirements: ${hammer.requiredUnityCapabilities.join(',')}`,
);
for (const capability of ['SLAM_WAVE_QUERY', 'KNOCKBACK_VECTOR', 'BREAK_STAGGER_APPLICATION', 'STATUS_APPLICATION'] as const) {
  assert(hammer.implementedUnityCapabilities.includes(capability), `pavement_hammer should inherit ${capability} evidence`);
}
assert(hammer.missingUnityCapabilities.length === 0, `pavement_hammer shared primitives should be complete, got ${hammer.missingUnityCapabilities.join(',')}`);
assert(hammer.prototypeCallerImplemented, 'pavement_hammer caller proof must remain registered after executable caller implementation');
assert(hammer.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW', 'pavement_hammer should remain implementation-review admitted');
assert(hammer.mayEnterUnityRuntimeRegistry, 'pavement_hammer should remain implementation-review eligible');
assert(hammer.runtimeStatus === 'NOT_IMPLEMENTED', 'implementation-review evidence must not claim pavement_hammer live implementation');
assert(title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount === 0, 'all primitive-complete Selected16 callers should have caller proof after Star Map Pin lands');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.join(',') === 'ember_matchcase,bellows_fan,pavement_hammer,star_map_pin', 'implementation-review admission IDs drift');
assert(!weapons.some((weapon) => weapon.id === 'pavement_hammer'), 'prototype caller work must not add pavement_hammer to Web live catalog');
assert(!coordinatorSource.includes('U2EnemySlamWaveQueryRuntime'), 'shared slam-wave query must not silently enter live Stage1 coordinator');
assert(!coordinatorSource.includes('U2EnemyBreakStaggerRuntime'), 'shared break/stagger must not silently enter live Stage1 coordinator');
assert(!coordinatorSource.includes('PavementHammerPrototypeRuntime'), 'Pavement Hammer caller must remain outside live Stage1 coordinator');
assert(!coordinatorSource.includes('pavement_hammer'), 'pavement_hammer must remain outside live Stage1 coordinator');

const doc = readFileSync(new URL('../../docs/unity-slam-wave-query-primitive-v1.md', import.meta.url), 'utf8');
for (const token of [
  'SLAM_WAVE_QUERY',
  'sector-band',
  'innerRadius',
  'outerRadius',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'pavement_hammer',
  'BREAK_STAGGER_APPLICATION',
  'PavementHammerPrototypeRuntime',
  'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW',
  'EXPOSED',
  'TEST_ONLY',
  'NOT_CANON',
  'Live Stage1',
]) {
  assert(doc.includes(token), `slam-wave primitive doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  primitive: 'SLAM_WAVE_QUERY',
  shape: 'directional sector-band',
  pavementHammer: {
    implemented: hammer.implementedUnityCapabilities,
    missing: hammer.missingUnityCapabilities,
    callerProof: hammer.prototypeCallerImplemented,
    decision: hammer.unityDecision,
    liveRuntimeStatus: hammer.runtimeStatus,
  },
  admission: {
    admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
    implementedPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount,
    missingPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount,
  },
  liveStage1Changed: false,
}, null, 2));
