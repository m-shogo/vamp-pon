import { existsSync, readFileSync } from 'node:fs';

import { weapons } from '../../src/game/data/weapons.ts';
import { baseWeaponSelectionEntries } from '../../src/game/data/baseWeaponSelectionSource.ts';
import {
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
  unityPrototypeCallerImplementedWeaponIds,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const callerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/RainThreadPrototypeRuntime.cs';
const metaPath = `${callerPath}.meta`;
const tetherPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyTetherPairSelectionRuntime.cs';
const knockbackPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyKnockbackRuntime.cs';
const statusRequestPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
const contractPath = 'scripts/quality/unity-rain-thread/Program.cs';
const projectPath = 'scripts/quality/unity-rain-thread/UnityRainThread.Contract.csproj';
const docPath = 'docs/unity-rain-thread-prototype-v1.md';

for (const path of [callerPath, metaPath, tetherPath, knockbackPath, statusRequestPath, coordinatorPath, contractPath, projectPath, docPath]) {
  assert(existsSync(path), `Rain Thread prototype contract file missing: ${path}`);
}

const caller = readFileSync(callerPath, 'utf8');
const tether = readFileSync(tetherPath, 'utf8');
const knockback = readFileSync(knockbackPath, 'utf8');
const statusRequest = readFileSync(statusRequestPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');

for (const token of [
  'public sealed class RainThreadPrototypeTelemetry','public sealed class RainThreadPrototypeState',
  'public const string WeaponId = "rain_thread";','public const string ContentStatusId = "SOAK";',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'SELECT_PAIR_SOAK_BOTH_THEN_CALLER_OWNED_PULL_TICKS','U2EnemyTetherPairSelectionRuntime.TrySelectPair(',
  'EnemyStatusRuntimeKind.Soak','U2EnemyKnockbackRuntime.TryApply(first','U2EnemyKnockbackRuntime.TryApply(second',
  'RainThreadLinkEndReason.EndpointLost','RainThreadLinkEndReason.BrokeByDistance','RainThreadLinkEndReason.Expired',
  'if (IsActive || !IsFinitePositive(linkDurationSeconds)) return false;',
]) {
  assert(caller.includes(token), `Rain Thread prototype missing contract: ${token}`);
}

for (const forbidden of ['const float LinkDuration','const float PullDistance','const float MaxLinkDistance','DefaultSoak','DefaultRange','LineRenderer','ParticleSystem','AudioSource','Camera.','Stage1GameplayRuntimeCoordinator','WeaponEffectType','LevelUp']) {
  assert(!caller.includes(forbidden), `Rain Thread prototype must not own live/default behavior: ${forbidden}`);
}

assert(tether.includes('public static class U2EnemyTetherPairSelectionRuntime'), 'Rain Thread requires real pair selector');
assert(!tether.includes('rain_thread') && !tether.includes('SOAK'), 'generic tether selector must remain content-neutral');
assert(knockback.includes('public static class U2EnemyKnockbackRuntime'), 'Rain Thread requires shared displacement primitive');
assert(statusRequest.includes('public readonly struct EnemyStatusApplicationRequest'), 'Rain Thread requires typed Status request transport');

const rainThread = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'rain_thread');
assert(rainThread, 'rain_thread admission row missing');
assert(rainThread.requiredUnityCapabilities.join(',') === 'TWO_TARGET_TETHER,KNOCKBACK_VECTOR,STATUS_APPLICATION', `Rain Thread requirements drift: ${rainThread.requiredUnityCapabilities.join(',')}`);
assert(rainThread.missingUnityCapabilities.length === 0, `Rain Thread shared primitive gap remains: ${rainThread.missingUnityCapabilities.join(',')}`);
assert(unityPrototypeCallerImplementedWeaponIds.includes('rain_thread'), 'Rain Thread caller proof registry entry missing');
assert(rainThread.prototypeCallerImplemented, 'Rain Thread caller proof must be registered');
assert(rainThread.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW', 'Rain Thread must enter implementation review after caller proof');
assert(rainThread.mayEnterUnityRuntimeRegistry, 'Rain Thread implementation-review eligibility should be true');
assert(rainThread.runtimeStatus === 'NOT_IMPLEMENTED', 'Rain Thread caller proof must not claim live runtime');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('rain_thread'), 'Rain Thread must remain in the implementation-review admitted set');

const nameReel = baseWeaponSelectionEntries.find((entry) => entry.weaponId === 'name_reel');
assert(nameReel?.decision === 'HOLD_TARGET_LINK_READABILITY' && !nameReel.selectedForTitle1, 'Rain Thread caller must preserve Name Reel Hold decision');
assert(!weapons.some((weapon) => weapon.id === 'rain_thread'), 'prototype caller must not add Rain Thread to Web live catalog');
for (const token of ['RainThreadPrototypeState', 'rain_thread', 'U2EnemyTetherPairSelectionRuntime']) {
  assert(!coordinator.includes(token), `Rain Thread prototype leaked into live Stage1 coordinator: ${token}`);
}

for (const token of [
  'highest combined-priority pair should become Rain Thread endpoints','both Rain Thread endpoints must receive SOAK at begin',
  'Rain Thread pull must move both endpoints symmetrically toward the pre-move center','pair at tension threshold must not receive extra pull',
  'link duration must expire without leaking active endpoints','re-begin SOAK attempts should be cooldown-blocked independently from link activation',
  'untargetable endpoint must break active Rain Thread link','pair beyond max link distance must break before pull',
  'active Rain Thread must reject replacement begin instead of mutating the current link','invalid tick must not destroy the active link',
]) {
  assert(contract.includes(token), `Rain Thread executable contract missing scenario: ${token}`);
}
for (const linkedSource of ['RainThreadPrototypeRuntime.cs','U2EnemyTetherPairSelectionRuntime.cs','U2EnemyKnockbackRuntime.cs','EnemyStatusRuntimeState.cs','EnemyStatusApplicationRequest.cs']) {
  assert(project.includes(linkedSource), `Rain Thread contract project must compile real source: ${linkedSource}`);
}

for (const token of ['PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE','CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','SELECT_PAIR_SOAK_BOTH_THEN_CALLER_OWNED_PULL_TICKS','ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW','runtimeStatus = NOT_IMPLEMENTED','HOLD_TARGET_LINK_READABILITY','runtimeAutoPromotionAllowed = false','Original / Canon boundary']) {
  assert(doc.includes(token), `Rain Thread prototype doc missing token: ${token}`);
}

console.log(JSON.stringify({ status: 'PASS', caller: 'RainThreadPrototypeState', admission: rainThread.unityDecision, liveRuntimeStatus: rainThread.runtimeStatus, admittedIds: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds, liveStage1Changed: false, canonTuningChanged: false }, null, 2));
