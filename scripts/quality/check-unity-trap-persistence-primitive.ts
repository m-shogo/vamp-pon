import { existsSync, readFileSync } from 'node:fs';

import { currentUnityWeaponRuntimeCapabilities } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const runtimePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2PersistentTrapRuntime.cs';
const metaPath = `${runtimePath}.meta`;
const contractPath = 'scripts/quality/unity-trap-persistence/Program.cs';
const projectPath = 'scripts/quality/unity-trap-persistence/UnityTrapPersistence.Contract.csproj';
const docPath = 'docs/unity-trap-persistence-primitive-v1.md';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';

for (const path of [runtimePath, metaPath, contractPath, projectPath, docPath, coordinatorPath]) {
  assert(existsSync(path), `trap persistence contract file missing: ${path}`);
}

const source = readFileSync(runtimePath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');

for (const token of [
  'public enum U2PersistentTrapPhase',
  'Arming',
  'Armed',
  'Exhausted',
  'Expired',
  'public readonly struct U2PersistentTrapTickResult',
  'public sealed class U2PersistentTrapState',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'public bool TryBegin(',
  'float armingDelaySeconds',
  'float activeDurationSeconds',
  'int triggerBudget',
  'public bool TryTick(float deltaSeconds, out U2PersistentTrapTickResult result)',
  'timeBudget -= RemainingArmingSeconds;',
  'RemainingActiveSeconds -= timeBudget;',
  'public bool TryConsumeTrigger(out int remainingTriggerBudget)',
  'Phase = U2PersistentTrapPhase.Exhausted;',
  'Phase = U2PersistentTrapPhase.Expired;',
  'public void Reset()',
]) {
  assert(source.includes(token), `trap persistence primitive missing contract: ${token}`);
}

for (const forbidden of [
  'pressed_flower_cards',
  'morning_dew_dropper',
  'ROOTED',
  'SOAK',
  'EnemyStatusRuntimeKind',
  'U2EnemyActor',
  'TakeDamage(',
  'Physics2D',
  'Collider2D',
  'ParticleSystem',
  'AudioSource',
  'WeaponEffectType',
  'LevelUp',
]) {
  assert(!source.includes(forbidden), `generic trap persistence state must not own ${forbidden}`);
}

for (const token of [
  'positive arming delay must enter Arming phase',
  'active lifetime must not decay before arming completes',
  'remaining frame time after arming must reduce active lifetime',
  'second trigger should consume final budget',
  'zero trigger budget must end trap as Exhausted',
  'exact active-duration budget must expire trap',
  'one large tick must be able to arm and expire without extending lifetime',
  'time expiry must not fabricate trigger consumption',
  'invalid active operations must not mutate valid trap state',
]) {
  assert(contract.includes(token), `trap persistence executable contract missing scenario: ${token}`);
}
assert(project.includes('U2PersistentTrapRuntime.cs'), 'trap contract project must compile real shared source');

for (const token of [
  'IMPLEMENTED_SHARED_STATE_FOUNDATION',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'Time semantics',
  'Trigger budget',
  'TRAP_PERSISTENCE',
  'Shared state existence alone is not Selected16 caller proof',
  'runtimeAutoPromotionAllowed = false',
]) {
  assert(doc.includes(token), `trap persistence doc missing token: ${token}`);
}

assert(currentUnityWeaponRuntimeCapabilities.TRAP_PERSISTENCE === 'MISSING', 'foundation PR must not pre-promote TRAP_PERSISTENCE capability');
assert(!coordinator.includes('U2PersistentTrapState'), 'shared trap state must not enter live Stage1 coordinator');

console.log(JSON.stringify({
  status: 'PASS',
  primitive: 'TRAP_PERSISTENCE_STATE_FOUNDATION',
  admissionCapability: currentUnityWeaponRuntimeCapabilities.TRAP_PERSISTENCE,
  liveStage1Changed: false,
  canonTuningChanged: false,
}, null, 2));
