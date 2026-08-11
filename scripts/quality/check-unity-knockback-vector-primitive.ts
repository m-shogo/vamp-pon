import { readFileSync } from 'node:fs';

import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const source = readFileSync(
  new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyKnockbackRuntime.cs', import.meta.url),
  'utf8',
);
const coordinatorSource = readFileSync(
  new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url),
  'utf8',
);

for (const token of [
  'public static class U2EnemyKnockbackRuntime',
  'public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";',
  'public static bool TryApply(U2EnemyActor enemy, Vector2 direction, float distance)',
  'public static bool TryApplyFromPoint(U2EnemyActor enemy, Vector3 sourcePosition, float distance)',
  'enemy == null || !enemy.IsTargetable || distance <= 0f',
  'lengthSquared <= 0.000001f',
  '1f / (float)Math.Sqrt(lengthSquared)',
  'enemy.transform.position += displacement;',
  'return TryApply(enemy, new Vector2(delta.x, delta.y), distance);',
]) {
  assert(source.includes(token), `Unity knockback primitive missing token: ${token}`);
}

for (const forbidden of [
  'bellows_fan',
  'pavement_hammer',
  'EmberMatchcase',
  'ParticleSystem',
  'Camera.',
  'Time.',
  'Rigidbody',
  'NavMesh',
  'durationSeconds',
  'stunSeconds',
  'defaultDistance',
]) {
  assert(!source.includes(forbidden), `generic knockback primitive must not own ${forbidden}`);
}

assert(currentUnityWeaponRuntimeCapabilities.KNOCKBACK_VECTOR === 'IMPLEMENTED', 'KNOCKBACK_VECTOR must remain backed by the reusable runtime helper');
assert(title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount >= 6, `knockback proof requires at least the six historical implemented Unity primitives, got ${title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount}`);
assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === 'KNOCKBACK_VECTOR'), 'implemented knockback must disappear from missing capability frequency');

const bellows = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'bellows_fan');
assert(bellows, 'bellows_fan admission row missing');
assert(bellows.requiredUnityCapabilities.includes('KNOCKBACK_VECTOR'), 'bellows_fan must require shared knockback');
assert(bellows.implementedUnityCapabilities.includes('KNOCKBACK_VECTOR'), 'bellows_fan should see shared knockback as implemented');

const hammer = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'pavement_hammer');
assert(hammer, 'pavement_hammer admission row missing');
assert(hammer.requiredUnityCapabilities.includes('KNOCKBACK_VECTOR'), 'pavement_hammer must require shared knockback');
assert(hammer.implementedUnityCapabilities.includes('KNOCKBACK_VECTOR'), 'pavement_hammer should see shared knockback as implemented');
assert(hammer.missingUnityCapabilities.includes('SLAM_WAVE_QUERY'), 'pavement_hammer must remain blocked on real directional slam-wave query');
assert(!hammer.mayEnterUnityRuntimeRegistry, 'shared knockback must not auto-admit pavement_hammer');

assert(!coordinatorSource.includes('U2EnemyKnockbackRuntime'), 'shared primitive must not silently enter the live Stage1 coordinator');

console.log(JSON.stringify({
  status: 'PASS',
  primitive: 'KNOCKBACK_VECTOR',
  tuningAuthority: 'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  implementedPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentImplementedUnityPrimitiveCount,
  missingPrimitives: title1BaseWeaponRuntimeAdmissionSummary.currentMissingUnityPrimitiveCount,
  admission: {
    admitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
    admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
    bellowsFanMissing: bellows.missingUnityCapabilities,
    pavementHammerStillBlockedBy: hammer.missingUnityCapabilities,
  },
}, null, 2));
