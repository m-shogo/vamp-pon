import { existsSync, readFileSync } from 'node:fs';

import { currentUnityWeaponRuntimeCapabilities } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const runtimePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2DelayedTriggerRuntime.cs';
const metaPath = `${runtimePath}.meta`;
const projectPath = 'scripts/quality/unity-delayed-trigger/UnityDelayedTrigger.Contract.csproj';
const contractPath = 'scripts/quality/unity-delayed-trigger/Program.cs';
const docPath = 'docs/unity-delayed-trigger-primitive-v1.md';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
for (const path of [runtimePath, metaPath, projectPath, contractPath, docPath, coordinatorPath]) {
  assert(existsSync(path), `delayed trigger contract file missing: ${path}`);
}

const source = readFileSync(runtimePath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');

for (const token of [
  'public enum U2DelayedTriggerPhase',
  'Inactive',
  'Waiting',
  'Ready',
  'Fired',
  'Cancelled',
  'public readonly struct U2DelayedTriggerTickResult',
  'public sealed class U2DelayedTriggerState',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'public bool TryBegin(float delaySeconds)',
  'public bool TryTick(float deltaSeconds, out U2DelayedTriggerTickResult result)',
  'deltaSeconds >= RemainingDelaySeconds',
  'becameReadyThisTick = true;',
  'public bool TryConsume()',
  'Phase = U2DelayedTriggerPhase.Fired;',
  'public bool TryCancel()',
  'Phase = U2DelayedTriggerPhase.Cancelled;',
  'public void Reset()',
]) {
  assert(source.includes(token), `delayed trigger primitive missing contract: ${token}`);
}

for (const forbidden of [
  'WeaponId',
  'EnemyStatusRuntimeKind',
  'TakeDamage(',
  'U2EnemyActor',
  'Physics2D',
  'Overlap',
  'ParticleSystem',
  'AudioSource',
  'Stage1GameplayRuntimeCoordinator',
  'WeaponEffectType',
  'LevelUp',
  'PlayerPrefs',
]) {
  assert(!source.includes(forbidden), `generic delayed trigger must not own ${forbidden}`);
}

for (const token of [
  'positive delay begin should succeed',
  'waiting trigger must reject early consume',
  'overshoot tick must become ready exactly once and clamp remaining delay to zero',
  'ready trigger may wait without re-emitting BecameReadyThisTick',
  'ready trigger must consume exactly once',
  'zero delay must begin immediately Ready',
  'immediate Ready trigger must still require one explicit consume',
  'active waiting trigger must support cancellation',
  'caller may cancel a Ready trigger before effect consume',
  'negative delay must fail closed',
  'non-finite delta must fail closed',
  'invalid active operations must not mutate valid delay state',
]) {
  assert(contract.includes(token), `delayed trigger executable contract missing scenario: ${token}`);
}
assert(project.includes('U2DelayedTriggerRuntime.cs'), 'contract project must compile real delayed trigger source');

for (const token of [
  'IMPLEMENTED_SHARED_DELAY_FOUNDATION',
  'CAPABILITY_NOT_YET_PROMOTED',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'explicit consume',
  'DELAYED_TRIGGER = MISSING',
  'runtimeAutoPromotionAllowed = false',
]) {
  assert(doc.includes(token), `delayed trigger doc missing token: ${token}`);
}

assert(currentUnityWeaponRuntimeCapabilities.DELAYED_TRIGGER === 'MISSING', 'foundation alone must not promote DELAYED_TRIGGER capability');
assert(!coordinator.includes('U2DelayedTriggerState'), 'delayed trigger foundation must not enter live Stage1 coordinator');
assert(!coordinator.includes('DELAYED_TRIGGER'), 'delayed trigger foundation must not expand live Stage1 executor');

console.log(JSON.stringify({
  status: 'PASS',
  primitive: 'DELAYED_TRIGGER_FOUNDATION',
  phases: ['Inactive', 'Waiting', 'Ready', 'Fired', 'Cancelled'],
  explicitConsume: true,
  capabilityPromoted: false,
  liveStage1Changed: false,
  canonTuningChanged: false,
}, null, 2));
