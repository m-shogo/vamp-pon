import { readFileSync } from 'node:fs';

import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
  unityPrototypeCallerImplementedWeaponIds,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const coneSource = readFileSync(
  new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyConeQueryRuntime.cs', import.meta.url),
  'utf8',
);
const bellowsSource = readFileSync(
  new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/BellowsFanPrototypeRuntime.cs', import.meta.url),
  'utf8',
);
const coordinatorSource = readFileSync(
  new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url),
  'utf8',
);

for (const token of [
  'public static class U2EnemyConeQueryRuntime',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'IReadOnlyList<U2EnemyActor> candidates',
  'List<U2EnemyActor> results',
  'candidate == null || !candidate.IsTargetable',
  'distanceSquared > rangeSquared',
  'Math.Cos(halfAngleDegrees * Math.PI / 180.0)',
  'results.Insert(insertIndex, candidate);',
  'results.RemoveAt(results.Count - 1);',
]) {
  assert(coneSource.includes(token), `cone query primitive missing token: ${token}`);
}
for (const forbidden of [
  'bellows_fan',
  'black_folding_fan',
  'DISORIENTED',
  'ParticleSystem',
  'FindObjects',
  'Instantiate(',
  '.OrderBy(',
  '.Where(',
  'defaultRange',
  'defaultAngle',
]) {
  assert(!coneSource.includes(forbidden), `generic cone query must not own ${forbidden}`);
}

for (const token of [
  'public const string WeaponId = "bellows_fan";',
  'public const string ContentStatusId = "DISORIENTED";',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'EnemyStatusRuntimeKind.Disoriented',
  'U2EnemyConeQueryRuntime.SelectTargets(',
  'U2EnemyKnockbackRuntime.TryApply(',
  'statusRequest.ApplyTo(target.Statuses);',
]) {
  assert(bellowsSource.includes(token), `Bellows Fan prototype missing token: ${token}`);
}
assert(!/durationSeconds\s*:\s*[0-9]/.test(bellowsSource), 'Bellows prototype must not hard-code DISORIENTED duration');
assert(!/range\s*=\s*[0-9]/.test(bellowsSource), 'Bellows prototype must not hard-code cone range');
assert(!/halfAngleDegrees\s*=\s*[0-9]/.test(bellowsSource), 'Bellows prototype must not hard-code cone angle');
assert(!/knockbackDistance\s*=\s*[0-9]/.test(bellowsSource), 'Bellows prototype must not hard-code knockback distance');
assert(!coordinatorSource.includes('BellowsFanPrototypeRuntime'), 'Bellows prototype must not silently enter live Stage1 coordinator');

assert(currentUnityWeaponRuntimeCapabilities.CONE_QUERY === 'IMPLEMENTED', 'CONE_QUERY should be implemented with real generic source evidence');
assert(currentUnityWeaponRuntimeCapabilities.KNOCKBACK_VECTOR === 'IMPLEMENTED', 'Bellows prototype depends on shared KNOCKBACK_VECTOR');
assert(currentUnityWeaponRuntimeCapabilities.STATUS_APPLICATION === 'IMPLEMENTED', 'Bellows prototype depends on shared STATUS_APPLICATION');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount === 7, `expected seven implemented Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount === 14, `expected fourteen missing Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.prototypeCallerImplementedCount === 2, `expected two Selected16 caller proofs, got ${title1BaseWeaponRuntimeAdmissionSummary.prototypeCallerImplementedCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount === 0, 'no primitive-complete weapon may be silently awaiting an untracked caller proof');
assert(new Set(unityPrototypeCallerImplementedWeaponIds).size === 2, 'caller proof IDs must remain unique');
assert(unityPrototypeCallerImplementedWeaponIds.includes('ember_matchcase'), 'Ember caller proof must remain registered');
assert(unityPrototypeCallerImplementedWeaponIds.includes('bellows_fan'), 'Bellows caller proof must be registered');

assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 2, `expected two implementation-review admissions, got ${title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount}`);
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 14, 'remaining Selected14 must stay blocked');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('ember_matchcase'), 'Ember Matchcase admission must remain');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('bellows_fan'), 'Bellows Fan should pass primitive + caller proof admission');

const bellows = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'bellows_fan');
assert(bellows, 'bellows_fan admission row missing');
assert(bellows.archetype === 'CONE_PUSH', `bellows_fan archetype drift: ${bellows.archetype}`);
assert(bellows.requiredUnityCapabilities.join(',') === 'CONE_QUERY,KNOCKBACK_VECTOR,STATUS_APPLICATION', `unexpected Bellows requirements: ${bellows.requiredUnityCapabilities.join(',')}`);
assert(bellows.missingUnityCapabilities.length === 0, `Bellows should have no primitive blocker: ${bellows.missingUnityCapabilities.join(',')}`);
assert(bellows.prototypeCallerImplemented, 'Bellows Selected16 caller proof must be explicit');
assert(bellows.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW', 'Bellows should reach implementation review only after primitive + caller proof');
assert(bellows.mayEnterUnityRuntimeRegistry, 'Bellows should pass implementation-review gate only');
assert(bellows.runtimeStatus === 'NOT_IMPLEMENTED', 'Bellows implementation-review admission must not claim live runtime implementation');

const blackFan = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'black_folding_fan');
assert(blackFan, 'black_folding_fan admission row missing');
assert(blackFan.implementedUnityCapabilities.includes('CONE_QUERY'), 'Black Folding Fan should inherit shared cone query evidence');
assert(blackFan.missingUnityCapabilities.includes('VEIL_TRACKING_FRICTION'), 'Black Folding Fan must remain blocked on veil-specific primitive');
assert(!blackFan.mayEnterUnityRuntimeRegistry, 'shared cone implementation must not auto-admit Black Folding Fan');

const hammer = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'pavement_hammer');
assert(hammer, 'pavement_hammer admission row missing');
assert(hammer.missingUnityCapabilities.includes('SLAM_WAVE_QUERY'), 'Pavement Hammer must remain blocked on SLAM_WAVE_QUERY');
assert(!hammer.mayEnterUnityRuntimeRegistry, 'shared knockback must not auto-admit Pavement Hammer');

assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === 'CONE_QUERY'), 'implemented CONE_QUERY must disappear from missing frequency');

console.log(JSON.stringify({
  status: 'PASS',
  primitive: 'CONE_QUERY',
  prototypeCaller: 'bellows_fan',
  statusId: 'DISORIENTED',
  tuning: 'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  unityAdmission: {
    admitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
    admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
    blocked: title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount,
    implementedPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount,
    missingPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount,
  },
  liveStage1Caller: false,
}, null, 2));
