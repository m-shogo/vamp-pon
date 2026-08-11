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

assert(currentUnityWeaponRuntimeCapabilities.SLAM_WAVE_QUERY === 'IMPLEMENTED', 'SLAM_WAVE_QUERY must remain backed by reusable sector-band source');
assert(currentUnityWeaponRuntimeCapabilities.BREAK_STAGGER_APPLICATION === 'IMPLEMENTED', 'break/stagger runtime must remain backed by reusable implementation');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 9, `expected 9 implemented primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount === 13, `expected 13 missing primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount}`);
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
assert(!hammer.prototypeCallerImplemented, 'pavement_hammer must not claim a Selected16 caller proof yet');
assert(hammer.unityDecision === 'BLOCKED_MISSING_UNITY_CALLER_PROOF', 'pavement_hammer must now be blocked by caller proof, not primitives');
assert(!hammer.mayEnterUnityRuntimeRegistry, 'primitive completeness must not auto-admit an incomplete hammer caller');
assert(hammer.runtimeStatus === 'NOT_IMPLEMENTED', 'shared primitives must not claim pavement_hammer live implementation');
assert(title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount === 1, 'Pavement Hammer should be the one primitive-complete caller-proof blocker');
assert(!title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('pavement_hammer'), 'pavement_hammer must remain outside implementation-review admissions');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('ember_matchcase'), 'Ember admission must remain');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('bellows_fan'), 'Bellows admission must remain');
assert(!weapons.some((weapon) => weapon.id === 'pavement_hammer'), 'shared primitive work must not add pavement_hammer to Web live catalog');
assert(!coordinatorSource.includes('U2EnemySlamWaveQueryRuntime'), 'shared slam-wave query must not silently enter live Stage1 coordinator');
assert(!coordinatorSource.includes('U2EnemyBreakStaggerRuntime'), 'shared break/stagger must not silently enter live Stage1 coordinator');
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
