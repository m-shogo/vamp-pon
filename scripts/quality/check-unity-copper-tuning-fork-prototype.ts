import { existsSync, readFileSync } from 'node:fs';

import { baseWeaponSelectionEntries } from '../../src/game/data/baseWeaponSelectionSource.ts';
import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  unityPrototypeCallerImplementedWeaponIds,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const callerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/CopperTuningForkPrototypeRuntime.cs';
const metaPath = `${callerPath}.meta`;
const chainPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyTargetChainSelectionRuntime.cs';
const statusPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs';
const requestPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs';
const projectPath = 'scripts/quality/unity-copper-tuning-fork/UnityCopperTuningFork.Contract.csproj';
const contractPath = 'scripts/quality/unity-copper-tuning-fork/Program.cs';
const docPath = 'docs/unity-copper-tuning-fork-prototype-v1.md';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
for (const path of [callerPath,metaPath,chainPath,statusPath,requestPath,projectPath,contractPath,docPath,coordinatorPath]) {
  assert(existsSync(path), `Copper Tuning Fork caller file missing: ${path}`);
}

const caller = readFileSync(callerPath, 'utf8');
const chain = readFileSync(chainPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');

for (const token of [
  'public sealed class CopperTuningForkPrototypeTelemetry',
  'public sealed class CopperTuningForkPrototypeRuntime',
  'public const string WeaponId = "copper_tuning_fork";',
  'public const string PrimaryContentStatusId = "SHOCK";',
  'public const string PreferenceContentStatusId = "CONDUCTIVE";',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'PRIORITY_SNAPSHOT_CHAIN_DAMAGE_SURVIVING_SHOCK_THEN_CONDUCTIVE',
  'candidate.Statuses.Has(EnemyStatusRuntimeKind.Conductive)',
  'score += conductivePriorityBonus;',
  'U2EnemyTargetChainSelectionRuntime.SelectChain(',
  'target.TakeDamage(damage, damageFlashSeconds)',
  'if (defeated) continue;',
  'shockRequest.ApplyTo(target.Statuses);',
  'conductiveRequest.ApplyTo(target.Statuses);',
]) {
  assert(caller.includes(token), `Copper Tuning Fork caller missing contract: ${token}`);
}
for (const forbidden of [
  'const float ConductivePriorityBonus', 'const float Damage', 'DefaultPriority', 'DefaultRange', 'long stun',
  'ParticleSystem', 'AudioSource', 'Camera.', 'Stage1GameplayRuntimeCoordinator', 'WeaponEffectType', 'LevelUp',
]) {
  assert(!caller.includes(forbidden), `Copper Tuning Fork caller must not own live/default behavior: ${forbidden}`);
}

assert(chain.includes('public static class U2EnemyTargetChainSelectionRuntime'), 'Copper requires real target-chain selector');
for (const forbidden of ['copper_tuning_fork','CONDUCTIVE','SHOCK','EnemyStatusRuntimeKind','TakeDamage(']) {
  assert(!chain.includes(forbidden), `generic target-chain selector must not own ${forbidden}`);
}

const selection = baseWeaponSelectionEntries.find((entry) => entry.weaponId === 'copper_tuning_fork');
assert(selection?.decision === 'TITLE1_SELECTED' && selection.selectedForTitle1, 'Copper Tuning Fork selection authority drift');
assert(selection.archetype === 'PULSE_CHAIN', 'Copper Tuning Fork archetype drift');
assert(selection.appliesStatuses.join(',') === 'SHOCK,CONDUCTIVE', 'Copper Tuning Fork Status identity drift');

const admission = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'copper_tuning_fork');
assert(admission, 'Copper Tuning Fork admission row missing');
assert(currentUnityWeaponRuntimeCapabilities.TARGET_CHAIN_SELECTION === 'MISSING', 'caller-only PR must not pre-promote TARGET_CHAIN_SELECTION');
assert(admission.missingUnityCapabilities.includes('TARGET_CHAIN_SELECTION'), 'Copper must remain primitive-blocked in staged caller PR');
assert(!unityPrototypeCallerImplementedWeaponIds.includes('copper_tuning_fork'), 'Copper staged caller must not be registered early');
assert(!admission.prototypeCallerImplemented, 'Copper staged caller proof must remain outside registry');
assert(admission.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES', 'Copper staged caller must remain primitive-blocked');
assert(!admission.mayEnterUnityRuntimeRegistry && admission.runtimeStatus === 'NOT_IMPLEMENTED', 'Copper staged caller must not claim implementation-review/live admission');

for (const token of [
  'caller-supplied CONDUCTIVE bonus should beat higher unmarked base score',
  'CONDUCTIVE preference must remain a caller bonus, not an absolute override',
  'chain should select first target then re-anchor to one local hop',
  'defeated target must not receive SHOCK or CONDUCTIVE after damage',
  'existing SHOCK cooldown should block only SHOCK application',
  'newly applied CONDUCTIVE must not retroactively change selection within the same pulse',
  'invalid first range must fail closed',
  'candidate/score length mismatch must fail closed',
  'non-positive maxTargets must fail closed',
  'non-positive damage must fail closed',
]) {
  assert(contract.includes(token), `Copper executable contract missing scenario: ${token}`);
}
for (const linkedSource of [
  'CopperTuningForkPrototypeRuntime.cs', 'U2EnemyTargetChainSelectionRuntime.cs',
  'EnemyStatusRuntimeState.cs', 'EnemyStatusApplicationRequest.cs',
]) {
  assert(project.includes(linkedSource), `Copper contract project must compile real source: ${linkedSource}`);
}

for (const token of [
  'TITLE1_SELECTED', 'TARGET_CHAIN_CAPABILITY_NOT_YET_PROMOTED',
  'PRIORITY_SNAPSHOT_CHAIN_DAMAGE_SURVIVING_SHOCK_THEN_CONDUCTIVE',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON', 'TARGET_CHAIN_SELECTION = MISSING',
  'BLOCKED_MISSING_UNITY_PRIMITIVES', 'runtimeStatus = NOT_IMPLEMENTED', 'runtimeAutoPromotionAllowed = false',
]) {
  assert(doc.includes(token), `Copper doc missing token: ${token}`);
}
for (const token of ['CopperTuningForkPrototypeRuntime','copper_tuning_fork','U2EnemyTargetChainSelectionRuntime']) {
  assert(!coordinator.includes(token), `Copper prototype leaked into live Stage1 coordinator: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  caller: 'CopperTuningForkPrototypeRuntime',
  selectionDecision: selection.decision,
  targetChainCapability: currentUnityWeaponRuntimeCapabilities.TARGET_CHAIN_SELECTION,
  admission: admission.unityDecision,
  callerRegistryPromoted: admission.prototypeCallerImplemented,
  liveRuntimeStatus: admission.runtimeStatus,
  liveStage1Changed: false,
  canonTuningChanged: false,
}, null, 2));
