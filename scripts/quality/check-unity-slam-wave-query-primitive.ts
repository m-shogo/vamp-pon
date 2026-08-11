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

const source = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemySlamWaveQueryRuntime.cs', import.meta.url), 'utf8');
const callerSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PavementHammerPrototypeRuntime.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');

for (const token of [
  'public static class U2EnemySlamWaveQueryRuntime','public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";',
  'IReadOnlyList<U2EnemyActor> candidates','List<U2EnemyActor> results','float innerRadius','float outerRadius','float halfAngleDegrees',
  'if (ReferenceEquals(candidates, results))','innerRadius > outerRadius','Math.Cos(halfAngleDegrees * Math.PI / 180.0)',
  'candidate == null || !candidate.IsTargetable','results.Insert(insertIndex, candidate);',
]) {
  assert(source.includes(token), `slam-wave query primitive missing token: ${token}`);
}
for (const forbidden of ['pavement_hammer','EXPOSED','EnemyStatusRuntimeKind','EnemyStatusApplicationPolicy','U2EnemyKnockbackRuntime','U2EnemyBreakStaggerRuntime','BreakGauge','StaggerGauge','Poise','Time.','deltaTime','ParticleSystem','Instantiate(','.OrderBy(','.Where(']) {
  assert(!source.includes(forbidden), `generic slam-wave query must not own ${forbidden}`);
}
for (const token of ['public static class PavementHammerPrototypeRuntime','U2EnemySlamWaveQueryRuntime.SelectTargets(','target.TakeDamage(damage, damageFlashSeconds)','EnemyStatusRuntimeKind.Exposed','U2EnemyKnockbackRuntime.TryApplyFromPoint(','U2EnemyBreakStaggerRuntime.TryApply(','QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER','PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE']) {
  assert(callerSource.includes(token), `Pavement Hammer caller must compose slam-wave primitive without mutating it: ${token}`);
}

assert(currentUnityWeaponRuntimeCapabilities.SLAM_WAVE_QUERY === 'IMPLEMENTED', 'SLAM_WAVE_QUERY must remain implemented');
assert(currentUnityWeaponRuntimeCapabilities.BREAK_STAGGER_APPLICATION === 'IMPLEMENTED', 'BREAK_STAGGER_APPLICATION must remain implemented');
for (const implemented of ['SLAM_WAVE_QUERY','BREAK_STAGGER_APPLICATION'] as const) {
  assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === implemented), `${implemented} must disappear from missing frequency`);
}
const hammer = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'pavement_hammer');
assert(hammer, 'pavement_hammer admission row missing');
assert(hammer.requiredUnityCapabilities.join(',') === 'SLAM_WAVE_QUERY,KNOCKBACK_VECTOR,BREAK_STAGGER_APPLICATION,STATUS_APPLICATION', 'Pavement Hammer requirements drift');
assert(hammer.missingUnityCapabilities.length === 0 && hammer.prototypeCallerImplemented, 'Pavement Hammer primitive/caller proof incomplete');
assert(hammer.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && hammer.mayEnterUnityRuntimeRegistry, 'Pavement Hammer implementation-review admission drift');
assert(hammer.runtimeStatus === 'NOT_IMPLEMENTED', 'Pavement Hammer proof must not claim live implementation');
assert(!weapons.some((weapon) => weapon.id === 'pavement_hammer'), 'prototype caller must not add Pavement Hammer to Web live catalog');
for (const token of ['U2EnemySlamWaveQueryRuntime','U2EnemyBreakStaggerRuntime','PavementHammerPrototypeRuntime','pavement_hammer']) {
  assert(!coordinatorSource.includes(token), `Pavement Hammer prototype/shared primitive leaked into live Stage1 coordinator: ${token}`);
}

const doc = readFileSync(new URL('../../docs/unity-slam-wave-query-primitive-v1.md', import.meta.url), 'utf8');
for (const token of ['SLAM_WAVE_QUERY','sector-band','innerRadius','outerRadius','CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','pavement_hammer','BREAK_STAGGER_APPLICATION','PavementHammerPrototypeRuntime','ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW','EXPOSED','TEST_ONLY','NOT_CANON','Live Stage1']) {
  assert(doc.includes(token), `slam-wave primitive doc missing token: ${token}`);
}

console.log(JSON.stringify({ status: 'PASS', primitive: 'SLAM_WAVE_QUERY', shape: 'directional sector-band', pavementHammer: hammer.unityDecision, liveStage1Changed: false }, null, 2));
