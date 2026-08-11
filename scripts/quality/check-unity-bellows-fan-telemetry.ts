import { readFileSync } from 'node:fs';

import { weapons } from '../../src/game/data/weapons.ts';
import {
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const bellowsSource = readFileSync(
  new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/BellowsFanPrototypeRuntime.cs', import.meta.url),
  'utf8',
);
const coordinatorSource = readFileSync(
  new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url),
  'utf8',
);
const harnessSource = readFileSync(new URL('./unity-bellows-fan-telemetry/Program.cs', import.meta.url), 'utf8');

for (const token of [
  'public sealed class BellowsFanPrototypeTelemetry',
  'public int InvocationCount { get; private set; }',
  'public int RequestedTargetCapacityTotal { get; private set; }',
  'public int SelectedTargetCount { get; private set; }',
  'public int StatusApplyAttemptCount { get; private set; }',
  'public int StatusAppliedCount { get; private set; }',
  'public int StatusBlockedByInternalCooldownCount { get; private set; }',
  'public int KnockbackAttemptCount { get; private set; }',
  'public int KnockbackAppliedCount { get; private set; }',
  'public int KnockbackRejectedCount { get; private set; }',
  'internal void RecordInvocation(int requestedTargetCapacity, int selectedTargets)',
  'internal void RecordStatusResult(EnemyStatusApplyResult result)',
  'internal void RecordKnockbackResult(bool applied)',
  'public void Reset()',
  'BellowsFanPrototypeTelemetry telemetry)',
  'telemetry?.RecordInvocation(maxTargets, selected);',
  'var statusResult = statusRequest.ApplyTo(target.Statuses);',
  'telemetry?.RecordStatusResult(statusResult);',
  'var knockbackApplied = U2EnemyKnockbackRuntime.TryApply(',
  'telemetry?.RecordKnockbackResult(knockbackApplied);',
]) {
  assert(bellowsSource.includes(token), `Bellows telemetry source missing token: ${token}`);
}

assert(!bellowsSource.includes('static BellowsFanPrototypeTelemetry'), 'Bellows telemetry must remain caller-owned, not static/global');
assert(!bellowsSource.includes('new EnemyStatusApplicationPolicy('), 'telemetry integration must not smuggle Status balance defaults into runtime source');
assert(!bellowsSource.includes('durationSeconds:'), 'telemetry integration must not own DISORIENTED duration');
assert(!bellowsSource.includes('internalCooldownSeconds:'), 'telemetry integration must not own DISORIENTED cooldown');
assert(!bellowsSource.includes('defaultRange'), 'telemetry integration must not own cone range');
assert(!bellowsSource.includes('defaultAngle'), 'telemetry integration must not own cone angle');
assert(!bellowsSource.includes('defaultKnockback'), 'telemetry integration must not own knockback distance');

const recordInvocation = bellowsSource.indexOf('telemetry?.RecordInvocation(maxTargets, selected);');
const zeroSelectionReturn = bellowsSource.indexOf('if (selected <= 0)', recordInvocation);
assert(recordInvocation >= 0 && zeroSelectionReturn > recordInvocation, 'valid zero-selection queries must still record invocation/selection evidence');

for (const token of [
  'telemetry.InvocationCount == 4',
  'telemetry.RequestedTargetCapacityTotal == 6',
  'telemetry.SelectedTargetCount == 5',
  'telemetry.StatusApplyAttemptCount == 5',
  'telemetry.StatusAppliedCount == 3',
  'telemetry.StatusBlockedByInternalCooldownCount == 2',
  'telemetry.KnockbackAttemptCount == 5',
  'telemetry.KnockbackAppliedCount == 4',
  'telemetry.KnockbackRejectedCount == 1',
  'knockback remains independent from Status cooldown',
  'invalid precondition must not masquerade as an executed cone query',
  'telemetry.Reset();',
]) {
  assert(harnessSource.includes(token), `Bellows telemetry executable contract missing behavior proof: ${token}`);
}

const bellows = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'bellows_fan');
assert(bellows, 'bellows_fan admission row missing');
assert(bellows.prototypeCallerImplemented, 'Bellows telemetry must sit on the explicit Selected16 caller proof');
assert(bellows.mayEnterUnityRuntimeRegistry, 'Bellows should remain implementation-review admitted');
assert(bellows.runtimeStatus === 'NOT_IMPLEMENTED', 'telemetry must not claim Bellows live implementation');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('bellows_fan'), 'telemetry must preserve Bellows implementation-review admission');
assert(!title1BaseWeaponRuntimeAdmissionSummary.runtimeAutoPromotionAllowed, 'telemetry must not auto-promote runtime');
assert(!weapons.some((weapon) => weapon.id === 'bellows_fan'), 'telemetry must not add Bellows to Web live catalog');
assert(!coordinatorSource.includes('BellowsFanPrototypeTelemetry'), 'caller-owned telemetry must not be installed globally in live Stage1 coordinator');
assert(!coordinatorSource.includes('BellowsFanPrototypeRuntime'), 'Bellows prototype must remain outside live Stage1 coordinator');

const doc = readFileSync(new URL('../../docs/unity-bellows-fan-telemetry-v1.md', import.meta.url), 'utf8');
for (const token of [
  'InvocationCount',
  'SelectedTargetCount',
  'StatusAppliedCount',
  'StatusBlockedByInternalCooldownCount',
  'KnockbackAppliedCount',
  'KnockbackRejectedCount',
  'caller-owned',
  'TEST_ONLY',
  'NOT_CANON',
  'live Stage1',
]) {
  assert(doc.includes(token), `Bellows telemetry doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  weaponId: 'bellows_fan',
  telemetry: {
    invocation: true,
    requestedTargetCapacity: true,
    selectedTargetCount: true,
    statusAttempt: true,
    statusApplied: true,
    statusCooldownBlocked: true,
    knockbackAttempt: true,
    knockbackApplied: true,
    knockbackRejected: true,
    resettable: true,
    callerOwned: true,
  },
  admission: {
    admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
    bellowsRuntimeStatus: bellows.runtimeStatus,
  },
  liveStage1Changed: false,
  balanceFrozen: false,
}, null, 2));
