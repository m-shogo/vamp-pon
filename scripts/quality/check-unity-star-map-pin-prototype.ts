import { existsSync, readFileSync } from 'node:fs';

import { weapons } from '../../src/game/data/weapons.ts';
import {
  title1BaseWeaponRuntimeAdmissionEntries,
  unityPrototypeCallerImplementedWeaponIds,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const callerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/StarMapPinPrototypeRuntime.cs';
const metaPath = `${callerPath}.meta`;
const selectorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyHomingPrioritySelectionRuntime.cs';
const statusRequestPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs';
const battlePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
const contractPath = 'scripts/quality/unity-star-map-pin/Program.cs';
const projectPath = 'scripts/quality/unity-star-map-pin/UnityStarMapPin.Contract.csproj';
const docPath = 'docs/unity-star-map-pin-prototype-v1.md';
for (const path of [callerPath,metaPath,selectorPath,statusRequestPath,battlePath,coordinatorPath,contractPath,projectPath,docPath]) {
  assert(existsSync(path), `Star Map Pin prototype contract file missing: ${path}`);
}

const caller = readFileSync(callerPath, 'utf8');
const selector = readFileSync(selectorPath, 'utf8');
const statusRequest = readFileSync(statusRequestPath, 'utf8');
const battle = readFileSync(battlePath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');

for (const token of [
  'public sealed class StarMapPinPrototypeTelemetry','public static class StarMapPinPrototypeRuntime',
  'public const string WeaponId = "star_map_pin";','public const string ContentStatusId = "MARKED";',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'PRIORITY_SELECT_TARGETED_PROJECTILE_MARKED_ON_HIT','EnemyStatusRuntimeKind.Marked',
  'U2EnemyHomingPrioritySelectionRuntime.TrySelect(','battle.FireGameplayProjectileAtTarget(',
  'CreateMarkedRequest(markedPolicy, telemetry)','observer = telemetry.RecordStatusResult;',
]) {
  assert(caller.includes(token), `Star Map Pin prototype missing contract: ${token}`);
}
const selectionIndex = caller.indexOf('U2EnemyHomingPrioritySelectionRuntime.TrySelect(');
const projectileIndex = caller.indexOf('battle.FireGameplayProjectileAtTarget(');
const requestIndex = caller.indexOf('CreateMarkedRequest(markedPolicy, telemetry)');
assert(selectionIndex >= 0 && selectionIndex < projectileIndex && projectileIndex < requestIndex, 'Star Map Pin selection/projectile/MARKED transport order drift');
for (const forbidden of ['const float Damage','const int Pierce','DefaultRange','DefaultPriority','DefaultMarked','ParticleSystem','AudioSource','Camera.','Stage1GameplayRuntimeCoordinator','WeaponEffectType','LevelUp']) {
  assert(!caller.includes(forbidden), `Star Map Pin prototype must not own live/default behavior: ${forbidden}`);
}

assert(selector.includes('public static class U2EnemyHomingPrioritySelectionRuntime'), 'Star Map Pin caller requires real priority selector');
assert(!selector.includes('star_map_pin') && !selector.includes('MARKED'), 'generic priority selector must remain content-neutral');
assert(statusRequest.includes('private readonly Action<EnemyStatusApplyResult> resultObserver;'), 'typed Status request observer field missing');
assert(statusRequest.includes('resultObserver?.Invoke(result);'), 'typed Status request observer invocation missing');
assert(battle.includes('public bool FireGameplayProjectileAtTarget('), 'explicit-target projectile path missing');
assert(battle.includes('EnemyStatusApplicationRequest? statusApplicationRequest = null'), 'explicit-target projectile must transport typed Status request');

const starPin = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'star_map_pin');
assert(starPin, 'Star Map Pin admission row missing');
assert(unityPrototypeCallerImplementedWeaponIds.includes('star_map_pin'), 'Star Map Pin caller proof registry entry missing');
assert(starPin.missingUnityCapabilities.length === 0 && starPin.prototypeCallerImplemented, 'Star Map Pin primitive/caller proof incomplete');
assert(starPin.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && starPin.mayEnterUnityRuntimeRegistry, 'Star Map Pin implementation-review admission drift');
assert(starPin.runtimeStatus === 'NOT_IMPLEMENTED', 'Star Map Pin caller proof must not claim live runtime');

assert(!weapons.some((weapon) => weapon.id === 'star_map_pin'), 'prototype caller must not add Star Map Pin to Web live catalog');
for (const token of ['StarMapPinPrototypeRuntime','star_map_pin','U2EnemyHomingPrioritySelectionRuntime']) {
  assert(!coordinator.includes(token), `Star Map Pin prototype leaked into live Stage1 coordinator: ${token}`);
}
for (const token of ['highest priority must beat farther equal-score targets','typed MARKED request','second MARKED hit should be cooldown-blocked independently','Status cooldown must not reject projectile fire','PreferFarther must choose far target','projectile pool rejection must propagate as false','rejected projectile must not fabricate a MARKED hit','selection failure must not fabricate projectile attempt','telemetry reset failed','null battle must fail loudly']) {
  assert(contract.includes(token), `Star Map Pin executable contract missing scenario: ${token}`);
}
for (const linkedSource of ['StarMapPinPrototypeRuntime.cs','U2EnemyHomingPrioritySelectionRuntime.cs','EnemyStatusRuntimeState.cs','EnemyStatusApplicationRequest.cs']) {
  assert(project.includes(linkedSource), `Star Map Pin contract project must compile real source: ${linkedSource}`);
}
for (const token of ['PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE','CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','PRIORITY_SELECT_TARGETED_PROJECTILE_MARKED_ON_HIT','ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW','runtimeStatus = NOT_IMPLEMENTED','TEST_ONLY','Original / Canon boundary','runtimeAutoPromotionAllowed = false']) {
  assert(doc.includes(token), `Star Map Pin prototype doc missing token: ${token}`);
}

console.log(JSON.stringify({ status: 'PASS', caller: 'StarMapPinPrototypeRuntime', admission: starPin.unityDecision, liveRuntimeStatus: starPin.runtimeStatus, liveStage1Changed: false, canonTuningChanged: false }, null, 2));
