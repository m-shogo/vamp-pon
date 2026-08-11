import { existsSync, readFileSync } from 'node:fs';

import { weapons } from '../../src/game/data/weapons.ts';
import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const callerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/RepairSpannerPrototypeRuntime.cs';
const metaPath = `${callerPath}.meta`;
const motionPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2ReturningProjectileMotionRuntime.cs';
const statusRequestPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs';
const statusStatePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
const contractPath = 'scripts/quality/unity-repair-spanner/Program.cs';
const projectPath = 'scripts/quality/unity-repair-spanner/UnityRepairSpanner.Contract.csproj';
const docPath = 'docs/unity-repair-spanner-prototype-v1.md';

for (const path of [callerPath, metaPath, motionPath, statusRequestPath, statusStatePath, coordinatorPath, contractPath, projectPath, docPath]) {
  assert(existsSync(path), `Repair Spanner prototype contract file missing: ${path}`);
}

const caller = readFileSync(callerPath, 'utf8');
const motion = readFileSync(motionPath, 'utf8');
const statusRequest = readFileSync(statusRequestPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');

for (const token of [
  'public sealed class RepairSpannerPrototypeTelemetry',
  'public sealed class RepairSpannerPrototypeState',
  'public const string WeaponId = "repair_spanner";',
  'public const string ContentStatusId = "EXPOSED";',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'ONE_HIT_PER_TARGET_PER_LEG_OUTBOUND_AND_RETURN_SEPARATE',
  'private readonly U2ReturningProjectileMotionState motion = new();',
  'private readonly HashSet<U2EnemyActor> outboundHits = new();',
  'private readonly HashSet<U2EnemyActor> returnHits = new();',
  'motion.TryBegin(targetPosition)',
  'motion.TryStep(',
  'ProcessSegment(',
  'target.TakeDamage(damage, damageFlashSeconds)',
  'if (!defeated) statusRequest.ApplyTo(target.Statuses);',
  'EnemyStatusRuntimeKind.Exposed',
  'DistanceSquaredPointToSegment2D',
]) {
  assert(caller.includes(token), `Repair Spanner prototype missing contract: ${token}`);
}

for (const forbidden of [
  'const float Damage',
  'const float Speed',
  'const float HitRadius',
  'DefaultDamage',
  'DefaultSpeed',
  'DefaultRange',
  'ParticleSystem',
  'AudioSource',
  'Camera.',
  'Stage1GameplayRuntimeCoordinator',
  'WeaponEffectType',
  'LevelUp',
]) {
  assert(!caller.includes(forbidden), `Repair Spanner prototype must not own live/default behavior: ${forbidden}`);
}

assert(motion.includes('public sealed class U2ReturningProjectileMotionState'), 'Repair Spanner requires real returning motion foundation');
assert(motion.includes('U2ReturningProjectilePhase.Outbound') && motion.includes('U2ReturningProjectilePhase.Returning'), 'returning motion phases missing');
assert(!motion.includes('repair_spanner') && !motion.includes('EXPOSED'), 'generic returning motion must remain content-neutral');
assert(statusRequest.includes('public readonly struct EnemyStatusApplicationRequest'), 'Repair Spanner requires typed Status request transport');

const repairSpanner = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'repair_spanner');
assert(repairSpanner, 'repair_spanner admission row missing');
assert(currentUnityWeaponRuntimeCapabilities.RETURNING_PROJECTILE === 'MISSING', 'caller proof PR must not pre-promote RETURNING_PROJECTILE capability');
assert(repairSpanner.missingUnityCapabilities.includes('RETURNING_PROJECTILE'), 'repair_spanner must remain capability-blocked until overlay promotion PR');
assert(!repairSpanner.prototypeCallerImplemented, 'caller registry promotion must remain a separate admission gate in this PR');
assert(repairSpanner.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES', 'repair_spanner decision must remain primitive-blocked before overlay promotion');
assert(!repairSpanner.mayEnterUnityRuntimeRegistry, 'Repair Spanner must remain outside implementation review before overlay promotion');
assert(repairSpanner.runtimeStatus === 'NOT_IMPLEMENTED', 'prototype caller must never claim live Repair Spanner runtime');

assert(!weapons.some((weapon) => weapon.id === 'repair_spanner'), 'prototype caller must not add Repair Spanner to Web live catalog');
for (const token of ['RepairSpannerPrototypeState', 'repair_spanner', 'U2ReturningProjectileMotionState']) {
  assert(!coordinator.includes(token), `Repair Spanner prototype leaked into live Stage1 coordinator: ${token}`);
}

for (const token of [
  'first outbound target should be hit once',
  'low-HP target should be defeated on outbound leg',
  'defeated target must not receive EXPOSED after damage',
  'same target must not hit twice on outbound leg',
  'outbound/return ledgers must allow exactly one hit per target per leg',
  'return EXPOSED attempts should be cooldown-blocked independently of damage',
  'off-path target must not be hit',
  'return motion must preserve projectile z',
  'reset must clear motion phase and both hit ledgers',
  'zero speed must fail closed without hits',
]) {
  assert(contract.includes(token), `Repair Spanner executable contract missing scenario: ${token}`);
}
for (const linkedSource of [
  'RepairSpannerPrototypeRuntime.cs',
  'U2ReturningProjectileMotionRuntime.cs',
  'EnemyStatusRuntimeState.cs',
  'EnemyStatusApplicationRequest.cs',
]) {
  assert(project.includes(linkedSource), `Repair Spanner contract project must compile real source: ${linkedSource}`);
}

for (const token of [
  'PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'RETURNING_CAPABILITY_NOT_YET_PROMOTED',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'ONE_HIT_PER_TARGET_PER_LEG_OUTBOUND_AND_RETURN_SEPARATE',
  'BLOCKED_MISSING_UNITY_PRIMITIVES',
  'runtimeAutoPromotionAllowed = false',
  'Original / Canon boundary',
]) {
  assert(doc.includes(token), `Repair Spanner prototype doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  caller: 'RepairSpannerPrototypeState',
  weaponId: 'repair_spanner',
  returningCapability: currentUnityWeaponRuntimeCapabilities.RETURNING_PROJECTILE,
  admission: repairSpanner.unityDecision,
  callerRegistryPromoted: repairSpanner.prototypeCallerImplemented,
  liveRuntimeStatus: repairSpanner.runtimeStatus,
  liveStage1Changed: false,
  canonTuningChanged: false,
}, null, 2));
