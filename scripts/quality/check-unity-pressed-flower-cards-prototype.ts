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

const callerPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/PressedFlowerCardsPrototypeRuntime.cs';
const metaPath = `${callerPath}.meta`;
const trapPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2PersistentTrapRuntime.cs';
const projectPath = 'scripts/quality/unity-pressed-flower-cards/UnityPressedFlowerCards.Contract.csproj';
const contractPath = 'scripts/quality/unity-pressed-flower-cards/Program.cs';
const docPath = 'docs/unity-pressed-flower-cards-prototype-v1.md';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
for (const path of [callerPath,metaPath,trapPath,projectPath,contractPath,docPath,coordinatorPath]) {
  assert(existsSync(path), `Pressed Flower Cards caller file missing: ${path}`);
}

const caller = readFileSync(callerPath, 'utf8');
const trap = readFileSync(trapPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');

for (const token of [
  'public readonly struct PressedFlowerCardTriggerResult','public sealed class PressedFlowerCardsPrototypeTelemetry','public sealed class PressedFlowerCardsPrototypeState',
  'public const string WeaponId = "pressed_flower_cards";','public const string ContentStatusId = "ROOTED";',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE',
  'PLACE_ARM_WAIT_TARGET_ENTER_CONSUME_TRIGGER_THEN_TYPED_ROOTED','private readonly U2PersistentTrapState trap = new();',
  'private readonly HashSet<U2EnemyActor> triggeredTargets = new();','trap.TryConsumeTrigger(out var remainingBudget)',
  'EnemyStatusRuntimeKind.Rooted','rootedRequest.ApplyTo(target.Statuses)','DistanceSquared2D(trap.Position, target.transform.position)',
]) {
  assert(caller.includes(token), `Pressed Flower Cards caller missing contract: ${token}`);
}
for (const forbidden of ['const float TriggerRadius','const float ArmingDelay','DefaultRoot','DefaultRange','DefaultCardCount','TakeDamage(','ParticleSystem','AudioSource','Camera.','Stage1GameplayRuntimeCoordinator','WeaponEffectType','LevelUp']) {
  assert(!caller.includes(forbidden), `Pressed Flower Cards caller must not own live/default behavior: ${forbidden}`);
}

assert(trap.includes('public sealed class U2PersistentTrapState'), 'Pressed Flower Cards requires real persistent trap foundation');
for (const forbidden of ['pressed_flower_cards','ROOTED','EnemyStatusRuntimeKind','U2EnemyActor']) {
  assert(!trap.includes(forbidden), `generic trap state must not own ${forbidden}`);
}

const selection = baseWeaponSelectionEntries.find((entry) => entry.weaponId === 'pressed_flower_cards');
assert(selection?.decision === 'TITLE1_SELECTED' && selection.selectedForTitle1, 'Pressed Flower Cards selection authority drift');
assert(selection.archetype === 'TRAP_FIELD', 'Pressed Flower Cards archetype drift');
assert(selection.appliesStatuses.join(',') === 'ROOTED', 'Pressed Flower Cards Status identity drift');

const admission = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'pressed_flower_cards');
assert(admission, 'Pressed Flower Cards admission row missing');
assert(currentUnityWeaponRuntimeCapabilities.TRAP_PERSISTENCE === 'IMPLEMENTED', 'verified Pressed Flower caller must back TRAP_PERSISTENCE');
assert(admission.implementedUnityCapabilities.join(',') === 'TRAP_PERSISTENCE,STATUS_APPLICATION', `Pressed Flower implemented capabilities drift: ${admission.implementedUnityCapabilities.join(',')}`);
assert(admission.missingUnityCapabilities.length === 0, 'Pressed Flower Cards must have no primitive blockers after trap admission');
assert(unityPrototypeCallerImplementedWeaponIds.includes('pressed_flower_cards'), 'Pressed Flower Cards verified caller must be registered');
assert(admission.prototypeCallerImplemented, 'Pressed Flower Cards caller proof must be explicit');
assert(admission.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && admission.mayEnterUnityRuntimeRegistry, 'Pressed Flower Cards implementation-review admission drift');
assert(admission.runtimeStatus === 'NOT_IMPLEMENTED', 'Pressed Flower Cards implementation review must not claim live runtime');

for (const token of [
  'arming card must reject trigger before it becomes armed','arming overshoot must arm card and carry leftover time into active lifetime',
  'target outside caller trigger radius must not consume the card','successful card trigger must apply typed ROOTED',
  'same target must not consume the same placed card twice','final trigger should exhaust shared trap budget',
  'ROOTED internal cooldown should block only Status application','ROOTED cooldown must not refund consumed trap trigger budget',
  'arming carryover should consume active lifetime and expire without frame-rate extension','non-positive trigger radius must fail closed',
]) {
  assert(contract.includes(token), `Pressed Flower Cards executable contract missing scenario: ${token}`);
}
for (const linkedSource of ['PressedFlowerCardsPrototypeRuntime.cs','U2PersistentTrapRuntime.cs','EnemyStatusRuntimeState.cs','EnemyStatusApplicationRequest.cs']) {
  assert(project.includes(linkedSource), `Pressed Flower Cards contract project must compile real source: ${linkedSource}`);
}

for (const token of ['TITLE1_SELECTED','TRAP_PERSISTENCE = IMPLEMENTED','ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW','PLACE_ARM_WAIT_TARGET_ENTER_CONSUME_TRIGGER_THEN_TYPED_ROOTED','CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','runtimeStatus = NOT_IMPLEMENTED','Boss boundary','runtimeAutoPromotionAllowed = false']) {
  assert(doc.includes(token), `Pressed Flower Cards doc missing token: ${token}`);
}
for (const token of ['PressedFlowerCardsPrototypeState','pressed_flower_cards','U2PersistentTrapState']) {
  assert(!coordinator.includes(token), `Pressed Flower Cards prototype leaked into live Stage1 coordinator: ${token}`);
}

console.log(JSON.stringify({ status: 'PASS', caller: 'PressedFlowerCardsPrototypeState', selectionDecision: selection.decision, trapCapability: currentUnityWeaponRuntimeCapabilities.TRAP_PERSISTENCE, admission: admission.unityDecision, callerRegistryPromoted: admission.prototypeCallerImplemented, bossConversionImplemented: false, liveRuntimeStatus: admission.runtimeStatus, liveStage1Changed: false, canonTuningChanged: false }, null, 2));
