import { readFileSync } from 'node:fs';

import { weapons } from '../../src/game/data/weapons.ts';
import { title1BaseWeaponRuntimeAdmissionSummary } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const emberSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/EmberMatchcasePrototypeRuntime.cs', import.meta.url), 'utf8');
const requestSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const harnessSource = readFileSync(new URL('./unity-ember-matchcase-telemetry/Program.cs', import.meta.url), 'utf8');

for (const token of [
  'public sealed class EmberMatchcasePrototypeTelemetry',
  'public int InvocationCount { get; private set; }',
  'public int RequestedTargetCapacityTotal { get; private set; }',
  'public int FiredProjectileCount { get; private set; }',
  'public int StatusApplyAttemptCount { get; private set; }',
  'public int StatusAppliedCount { get; private set; }',
  'public int StatusBlockedByInternalCooldownCount { get; private set; }',
  'Action<EnemyStatusApplyResult> resultObserver = null;',
  'resultObserver = telemetry.RecordStatusResult;',
  'telemetry?.RecordInvocation(maxTargets, fired)',
  'public void Reset()',
]) {
  assert(emberSource.includes(token), `Ember telemetry source missing token: ${token}`);
}

assert(!emberSource.includes('static EmberMatchcasePrototypeTelemetry'), 'prototype telemetry must be caller-owned, never static/global');
assert(!emberSource.includes('new EnemyStatusApplicationPolicy('), 'telemetry source must not smuggle balance defaults into production code');
assert(!emberSource.includes('durationSeconds:'), 'telemetry source must not own BURN duration');
assert(!emberSource.includes('internalCooldownSeconds:'), 'telemetry source must not own BURN cooldown');
assert(!emberSource.includes('maxTargets ='), 'telemetry source must not own target-count tuning');
assert(!emberSource.includes('damage ='), 'telemetry source must not own damage tuning');

for (const token of [
  'private readonly Action<EnemyStatusApplyResult> resultObserver;',
  ': this(kind, policy, null)',
  'public bool HasResultObserver => resultObserver != null;',
  'var result = state.Apply(Kind, Policy);',
  'resultObserver?.Invoke(result);',
  'return result;',
]) {
  assert(requestSource.includes(token), `typed Status result observer missing token: ${token}`);
}
assert(!requestSource.includes('durationSeconds:'), 'typed request observer transport must remain balance-neutral');
assert(!requestSource.includes('internalCooldownSeconds:'), 'typed request observer transport must remain cooldown-neutral');

for (const token of [
  'StatusAppliedCount == 1',
  'StatusBlockedByInternalCooldownCount == 1',
  'RequestedTargetCapacityTotal == 5',
  'FiredProjectileCount == 2',
  'telemetry.Reset();',
  'legacy prototype overload must remain observer-free',
]) {
  assert(harnessSource.includes(token), `C# telemetry harness missing behavior proof: ${token}`);
}

assert(!weapons.some((weapon) => weapon.id === 'ember_matchcase'), 'telemetry must not promote Ember into Web live catalog');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount >= 1, 'telemetry proof requires Ember to remain implementation-review admitted');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('ember_matchcase'), 'telemetry must preserve Ember admission even as later Selected16 callers land');
assert(coordinatorSource.includes('battle.FireGameplayProjectile(effect.damage * damageMultiplier, effect.pierce)'), 'live Stage1 loop must remain unchanged');
assert(!coordinatorSource.includes('EmberMatchcasePrototypeTelemetry'), 'prototype telemetry must not be installed globally in live Stage1 loop');

const doc = readFileSync(new URL('../../docs/unity-ember-matchcase-telemetry-v1.md', import.meta.url), 'utf8');
for (const token of [
  'InvocationCount',
  'FiredProjectileCount',
  'StatusAppliedCount',
  'StatusBlockedByInternalCooldownCount',
  'caller-owned',
  'TEST_ONLY',
  'NOT_CANON',
  'live Stage1',
]) {
  assert(doc.includes(token), `Ember telemetry doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  telemetry: {
    invocation: true,
    requestedTargetCapacity: true,
    firedProjectile: true,
    statusAttempt: true,
    statusApplied: true,
    internalCooldownBlocked: true,
    resettable: true,
    callerOwned: true,
  },
  admission: {
    admitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
    admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
    blocked: title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount,
  },
  liveStage1Changed: false,
  balanceFrozen: false,
}, null, 2));
