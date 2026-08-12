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

const callerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/DreamAlarmPrototypeRuntime.cs';
const metaPath = `${callerPath}.meta`;
const delayPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2DelayedTriggerRuntime.cs';
const projectPath = 'scripts/quality/unity-dream-alarm/UnityDreamAlarm.Contract.csproj';
const contractPath = 'scripts/quality/unity-dream-alarm/Program.cs';
const docPath = 'docs/unity-dream-alarm-prototype-v1.md';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
for (const path of [callerPath,metaPath,delayPath,projectPath,contractPath,docPath,coordinatorPath]) {
  assert(existsSync(path), `Dream Alarm caller file missing: ${path}`);
}

const caller = readFileSync(callerPath, 'utf8');
const delay = readFileSync(delayPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');

for (const token of [
  'public readonly struct DreamAlarmPulseResult','public sealed class DreamAlarmPrototypeTelemetry','public sealed class DreamAlarmPrototypeState',
  'public const string WeaponId = "dream_alarm";','public const string ContentStatusId = "DROWSY";',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'PLACE_WAIT_READY_EXPLICIT_CONSUME_AREA_DROWSY','private readonly U2DelayedTriggerState trigger = new();',
  'trigger.TryBegin(delaySeconds)','trigger.TryTick(deltaSeconds, out result)','!trigger.IsReady','trigger.TryConsume()',
  'EnemyStatusRuntimeKind.Drowsy','DistanceSquared2D(position, target.transform.position)','request.ApplyTo(target.Statuses)',
]) {
  assert(caller.includes(token), `Dream Alarm caller missing contract: ${token}`);
}
for (const forbidden of ['const float PulseRadius','const float Delay','DefaultDrowsy','DefaultRange','TakeDamage(','ParticleSystem','AudioSource','Camera.','Stage1GameplayRuntimeCoordinator','WeaponEffectType','LevelUp']) {
  assert(!caller.includes(forbidden), `Dream Alarm caller must not own live/default behavior: ${forbidden}`);
}

assert(delay.includes('public sealed class U2DelayedTriggerState'), 'Dream Alarm requires real delayed trigger foundation');
for (const forbidden of ['dream_alarm','DROWSY','EnemyStatusRuntimeKind','U2EnemyActor']) {
  assert(!delay.includes(forbidden), `generic delayed trigger must not own ${forbidden}`);
}

const selection = baseWeaponSelectionEntries.find((entry) => entry.weaponId === 'dream_alarm');
assert(selection?.decision === 'TITLE1_SELECTED' && selection.selectedForTitle1, 'Dream Alarm selection authority drift');
assert(selection.archetype === 'DELAYED_PULSE', 'Dream Alarm archetype drift');
assert(selection.appliesStatuses.join(',') === 'DROWSY', 'Dream Alarm Status identity drift');

const admission = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'dream_alarm');
assert(admission, 'Dream Alarm admission row missing');
assert(currentUnityWeaponRuntimeCapabilities.DELAYED_TRIGGER === 'IMPLEMENTED', 'verified Dream Alarm caller must back DELAYED_TRIGGER');
assert(admission.implementedUnityCapabilities.join(',') === 'DELAYED_TRIGGER,STATUS_APPLICATION', `Dream Alarm implemented capabilities drift: ${admission.implementedUnityCapabilities.join(',')}`);
assert(admission.missingUnityCapabilities.length === 0, 'Dream Alarm must have no primitive blockers after delayed admission');
assert(unityPrototypeCallerImplementedWeaponIds.includes('dream_alarm'), 'Dream Alarm verified caller must be registered');
assert(admission.prototypeCallerImplemented, 'Dream Alarm caller proof must be explicit');
assert(admission.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && admission.mayEnterUnityRuntimeRegistry, 'Dream Alarm implementation-review admission drift');
assert(admission.runtimeStatus === 'NOT_IMPLEMENTED', 'Dream Alarm implementation review must not claim live runtime');

for (const token of [
  'Dream Alarm must not fire before Ready','delay overshoot must transition to Ready exactly once','Ready tick must not auto-fire or re-emit readiness',
  'pulse must include targetable XY boundary and exclude outside/untargetable candidates','in-range Dream Alarm targets must receive typed DROWSY',
  'Fired Dream Alarm must not fire twice','Ready Dream Alarm may fire into an empty area','DROWSY cooldown must block only Status application',
  'cancelled alarm must reject fire','non-positive pulse radius must fail closed','invalid fire input must not consume a valid Ready alarm',
]) {
  assert(contract.includes(token), `Dream Alarm executable contract missing scenario: ${token}`);
}
for (const linkedSource of ['DreamAlarmPrototypeRuntime.cs','U2DelayedTriggerRuntime.cs','EnemyStatusRuntimeState.cs','EnemyStatusApplicationRequest.cs']) {
  assert(project.includes(linkedSource), `Dream Alarm contract project must compile real source: ${linkedSource}`);
}

for (const token of ['TITLE1_SELECTED','DELAYED_TRIGGER = IMPLEMENTED','ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW','PLACE_WAIT_READY_EXPLICIT_CONSUME_AREA_DROWSY','CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','runtimeStatus = NOT_IMPLEMENTED','runtimeAutoPromotionAllowed = false']) {
  assert(doc.includes(token), `Dream Alarm doc missing token: ${token}`);
}
for (const token of ['DreamAlarmPrototypeState','dream_alarm','U2DelayedTriggerState']) {
  assert(!coordinator.includes(token), `Dream Alarm prototype leaked into live Stage1 coordinator: ${token}`);
}

console.log(JSON.stringify({ status: 'PASS', caller: 'DreamAlarmPrototypeState', selectionDecision: selection.decision, delayedTriggerCapability: currentUnityWeaponRuntimeCapabilities.DELAYED_TRIGGER, admission: admission.unityDecision, callerRegistryPromoted: admission.prototypeCallerImplemented, liveRuntimeStatus: admission.runtimeStatus, liveStage1Changed: false, canonTuningChanged: false }, null, 2));
