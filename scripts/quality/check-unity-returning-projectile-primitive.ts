import { existsSync, readFileSync } from 'node:fs';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const runtimePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2ReturningProjectileMotionRuntime.cs';
const metaPath = `${runtimePath}.meta`;
const projectPath = 'scripts/quality/unity-returning-projectile/UnityReturningProjectile.Contract.csproj';
const contractPath = 'scripts/quality/unity-returning-projectile/Program.cs';
const docPath = 'docs/unity-returning-projectile-primitive-v1.md';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';

for (const path of [runtimePath, metaPath, projectPath, contractPath, docPath, coordinatorPath]) {
  assert(existsSync(path), `returning projectile contract file missing: ${path}`);
}

const source = readFileSync(runtimePath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');

for (const token of [
  'public enum U2ReturningProjectilePhase',
  'Inactive',
  'Outbound',
  'Returning',
  'Complete',
  'public readonly struct U2ReturningProjectileStepResult',
  'public sealed class U2ReturningProjectileMotionState',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'public bool TryBegin(Vector3 target)',
  'public bool TryStep(',
  'Vector3 returnAnchor',
  'var remainingTravel = speed * deltaSeconds;',
  'remainingTravel = Math.Max(0f, remainingTravel - outboundDistance);',
  'Phase = U2ReturningProjectilePhase.Returning;',
  'Phase = U2ReturningProjectilePhase.Complete;',
  'MoveTowards2D',
  'WithPreservedZ',
  'public void Reset()',
]) {
  assert(source.includes(token), `returning projectile primitive missing contract: ${token}`);
}

for (const forbidden of [
  'return_compass_needle',
  'star_map_pin',
  'EnemyStatusRuntimeKind',
  'TakeDamage(',
  'FireGameplayProjectile',
  'U2BattleController',
  'ParticleSystem',
  'AudioSource',
  'LevelUp',
  'WeaponEffectType',
  'PlayerPrefs',
]) {
  assert(!source.includes(forbidden), `generic returning motion must not own ${forbidden}`);
}

for (const token of [
  'first step phase mismatch',
  'remaining travel budget must continue on return leg and preserve z',
  'return path must chase current XY anchor and preserve projectile z',
  'return arrival must complete motion',
  'complete state must reject further steps until reset/begin',
  'arrival epsilon may transition both legs',
  'zero speed must fail closed',
  'negative delta must fail closed',
  'non-finite return anchor must fail closed',
]) {
  assert(contract.includes(token), `returning projectile executable contract missing scenario: ${token}`);
}
assert(project.includes('U2ReturningProjectileMotionRuntime.cs'), 'contract project must compile real returning motion source');

for (const token of [
  'IMPLEMENTED_SHARED_MOTION_PRIMITIVE',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'Travel budget conservation',
  'Dynamic return anchor',
  'z preserve',
  'return_compass_needle',
  'RETURNING_PROJECTILE',
  'NOT_CANON',
  'runtimeAutoPromotionAllowed = false',
]) {
  assert(doc.includes(token), `returning projectile doc missing token: ${token}`);
}

assert(!coordinator.includes('U2ReturningProjectileMotionState'), 'shared returning motion must not enter live Stage1 coordinator');
assert(!coordinator.includes('RETURNING_PROJECTILE'), 'returning primitive must not silently expand live Stage1');

console.log(JSON.stringify({
  status: 'PASS',
  primitive: 'RETURNING_PROJECTILE_MOTION_FOUNDATION',
  phases: ['Inactive', 'Outbound', 'Returning', 'Complete'],
  liveStage1Changed: false,
  canonTuningChanged: false,
}, null, 2));
