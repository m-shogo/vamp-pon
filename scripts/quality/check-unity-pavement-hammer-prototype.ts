import { existsSync, readFileSync } from 'node:fs';

import { weapons } from '../../src/game/data/weapons.ts';
import {
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
  unityPrototypeCallerImplementedWeaponIds,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const callerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PavementHammerPrototypeRuntime.cs';
const metaPath = `${callerPath}.meta`;
const slamPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemySlamWaveQueryRuntime.cs';
const knockbackPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyKnockbackRuntime.cs';
const breakPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyBreakStaggerRuntime.cs';
const statusRequestPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
const contractPath = 'scripts/quality/unity-pavement-hammer/Program.cs';
const projectPath = 'scripts/quality/unity-pavement-hammer/UnityPavementHammer.Contract.csproj';
const docPath = 'docs/unity-pavement-hammer-prototype-v1.md';

for (const path of [
  callerPath,
  metaPath,
  slamPath,
  knockbackPath,
  breakPath,
  statusRequestPath,
  coordinatorPath,
  contractPath,
  projectPath,
  docPath,
]) {
  assert(existsSync(path), `Pavement Hammer prototype contract file missing: ${path}`);
}

const caller = readFileSync(callerPath, 'utf8');
const slam = readFileSync(slamPath, 'utf8');
const knockback = readFileSync(knockbackPath, 'utf8');
const breakSource = readFileSync(breakPath, 'utf8');
const statusRequest = readFileSync(statusRequestPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');

for (const token of [
  'public sealed class PavementHammerPrototypeTelemetry',
  'public static class PavementHammerPrototypeRuntime',
  'public const string WeaponId = "pavement_hammer";',
  'public const string ContentStatusId = "EXPOSED";',
  'public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";',
  'public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";',
  'public const string ApplicationOrder = "QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER";',
  'EnemyStatusRuntimeKind.Exposed',
  'U2EnemySlamWaveQueryRuntime.SelectTargets(',
  'var defeated = target.TakeDamage(damage, damageFlashSeconds);',
  'if (defeated)',
  'var statusResult = statusRequest.ApplyTo(target.Statuses);',
  'U2EnemyKnockbackRuntime.TryApplyFromPoint(',
  'U2EnemyBreakStaggerRuntime.TryApply(',
  'telemetry?.RecordDamageResult(defeated);',
  'telemetry?.RecordStatusResult(statusResult);',
  'telemetry?.RecordKnockbackResult(knockbackApplied);',
  'telemetry?.RecordBreakStaggerResult(breakApplied, breakResult);',
  'IsFinitePositive(damage)',
  'IsFiniteNonNegative(damageFlashSeconds)',
]) {
  assert(caller.includes(token), `Pavement Hammer prototype missing contract: ${token}`);
}

const orderTokens = [
  'U2EnemySlamWaveQueryRuntime.SelectTargets(',
  'target.TakeDamage(damage, damageFlashSeconds)',
  'statusRequest.ApplyTo(target.Statuses)',
  'U2EnemyKnockbackRuntime.TryApplyFromPoint(',
  'U2EnemyBreakStaggerRuntime.TryApply(',
] as const;
let previous = -1;
for (const token of orderTokens) {
  const index = caller.indexOf(token);
  assert(index > previous, `Pavement Hammer application order drifted at ${token}`);
  previous = index;
}

for (const forbidden of [
  'const float Damage',
  'const float Break',
  'const float Knockback',
  'const float Stagger',
  'DefaultDamage',
  'DefaultBreak',
  'DefaultKnockback',
  'DefaultStagger',
  'ParticleSystem',
  'AudioSource',
  'Camera.',
  'Stage1GameplayRuntimeCoordinator',
  'WeaponEffectType',
  'LevelUp',
]) {
  assert(!caller.includes(forbidden), `Pavement Hammer prototype must not own live/default behavior: ${forbidden}`);
}

assert(slam.includes('public static class U2EnemySlamWaveQueryRuntime'), 'Pavement caller requires real slam-wave shared primitive');
assert(knockback.includes('public static class U2EnemyKnockbackRuntime'), 'Pavement caller requires real knockback shared primitive');
assert(breakSource.includes('public static class U2EnemyBreakStaggerRuntime'), 'Pavement caller requires real break/stagger shared primitive');
assert(statusRequest.includes('public readonly struct EnemyStatusApplicationRequest'), 'Pavement caller requires typed Status request transport');

const hammer = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'pavement_hammer');
assert(hammer, 'Pavement Hammer admission row missing');
assert(hammer.prototypeCallerImplemented, 'Pavement Hammer caller proof must be registered');
assert(hammer.missingUnityCapabilities.length === 0, 'Pavement Hammer shared primitive set must be complete');
assert(hammer.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW', 'Pavement Hammer must remain implementation-review admitted');
assert(hammer.mayEnterUnityRuntimeRegistry, 'Pavement Hammer implementation-review eligibility should remain true');
assert(hammer.runtimeStatus === 'NOT_IMPLEMENTED', 'implementation review must remain distinct from live runtime');
assert(unityPrototypeCallerImplementedWeaponIds.join(',') === 'ember_matchcase,bellows_fan,pavement_hammer', 'prototype caller proof registry drift');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 3, 'expected three implementation-review admissions');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 13, 'expected thirteen blocked Selected16 entries');
assert(title1BaseWeaponRuntimeAdmissionSummary.primitiveCompleteButMissingCallerProofCount === 1, 'Star Map Pin should be the one primitive-complete caller blocker after homing priority lands');

assert(!weapons.some((weapon) => weapon.id === 'pavement_hammer'), 'prototype caller must not add Pavement Hammer to Web live catalog');
for (const token of [
  'PavementHammerPrototypeRuntime',
  'pavement_hammer',
  'U2EnemySlamWaveQueryRuntime',
  'U2EnemyBreakStaggerRuntime',
]) {
  assert(!coordinator.includes(token), `Pavement Hammer prototype leaked into live Stage1 coordinator: ${token}`);
}

for (const token of [
  'defeated target must not receive EXPOSED after damage',
  'defeated target must not receive break/stagger driver',
  'defeated target must not be knocked back after damage',
  'surviving target must receive EXPOSED',
  'first slam should accumulate sub-threshold break',
  'second EXPOSED attempts should hit independent cooldown',
  'second 60-point slam should cross 100-point TEST_ONLY threshold',
  'threshold crossing should preserve 20 residual break',
  'second knockback must apply before stagger anchor',
  'invalid caller tuning must fail closed and clear scratch',
]) {
  assert(contract.includes(token), `Pavement Hammer executable contract missing scenario: ${token}`);
}
for (const linkedSource of [
  'PavementHammerPrototypeRuntime.cs',
  'U2EnemySlamWaveQueryRuntime.cs',
  'U2EnemyKnockbackRuntime.cs',
  'U2EnemyBreakStaggerRuntime.cs',
  'EnemyStatusRuntimeState.cs',
  'EnemyStatusApplicationRequest.cs',
]) {
  assert(project.includes(linkedSource), `Pavement Hammer contract project must compile real source: ${linkedSource}`);
}

for (const token of [
  'PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER',
  'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW',
  'runtimeStatus = NOT_IMPLEMENTED',
  'TEST_ONLY / NOT_CANON',
  'Original / Canon boundary',
  'runtimeAutoPromotionAllowed = false',
]) {
  assert(doc.includes(token), `Pavement Hammer prototype doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  caller: 'PavementHammerPrototypeRuntime',
  applicationOrder: 'QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER',
  admission: hammer.unityDecision,
  liveRuntimeStatus: hammer.runtimeStatus,
  admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds,
  liveStage1Changed: false,
  canonTuningChanged: false,
}, null, 2));
