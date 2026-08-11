import { existsSync, readFileSync } from 'node:fs';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const runtimePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2ReturningWaypointMotionRuntime.cs';
const metaPath = `${runtimePath}.meta`;
const contractPath = 'scripts/quality/unity-returning-waypoint/Program.cs';
const projectPath = 'scripts/quality/unity-returning-waypoint/UnityReturningWaypoint.Contract.csproj';
const docPath = 'docs/unity-returning-waypoint-motion-primitive-v1.md';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';

for (const path of [runtimePath, metaPath, contractPath, projectPath, docPath, coordinatorPath]) {
  assert(existsSync(path), `returning waypoint contract file missing: ${path}`);
}

const source = readFileSync(runtimePath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');

for (const token of [
  'public enum U2ReturningWaypointPhase',
  'ReturningViaWaypoint',
  'ReturningToAnchor',
  'public readonly struct U2ReturningWaypointStepResult',
  'public sealed class U2ReturningWaypointMotionState',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'public bool TryBegin(Vector3 targetPosition, bool useWaypoint)',
  'public bool SkipReturnWaypoint()',
  'Vector3 returnWaypoint',
  'Vector3 finalReturnAnchor',
  'var travelBudget = speed * deltaSeconds;',
  'for (var transitionGuard = 0; transitionGuard < 4 && travelBudget > 0f && IsActive; transitionGuard++)',
  'Phase = useReturnWaypoint',
  'U2ReturningWaypointPhase.ReturningViaWaypoint',
  'U2ReturningWaypointPhase.ReturningToAnchor',
  'waypointReached = true;',
  'Phase = U2ReturningWaypointPhase.Complete;',
  'currentPosition = new Vector3(target.x, target.y, preservedZ);',
]) {
  assert(source.includes(token), `returning waypoint motion missing contract: ${token}`);
}

for (const forbidden of [
  'return_compass_needle',
  'repair_spanner',
  'MARKED',
  'EnemyStatusRuntimeKind',
  'TakeDamage(',
  'U2EnemyActor',
  'ParticleSystem',
  'AudioSource',
  'WeaponEffectType',
  'LevelUp',
]) {
  assert(!source.includes(forbidden), `generic returning waypoint motion must not own ${forbidden}`);
}

for (const token of [
  'same-frame outbound arrival must report turnaround',
  'same-frame return leg must report waypoint arrival',
  'remaining travel budget should continue from waypoint toward final anchor',
  'completion should use the latest dynamic final anchor and preserve z',
  'no-waypoint path should allow outbound -> final return complete in one frame',
  'pending waypoint should be skippable before turnaround',
  'active return waypoint should be skippable',
  'invalid step must not mutate active phase',
  'non-finite outbound target must fail closed',
]) {
  assert(contract.includes(token), `returning waypoint executable contract missing scenario: ${token}`);
}
assert(project.includes('U2ReturningWaypointMotionRuntime.cs'), 'contract project must compile real waypoint motion source');

for (const token of [
  'IMPLEMENTED_SHARED_MOTION_FOUNDATION',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'Same-frame travel budget',
  'Dynamic targets',
  'SkipReturnWaypoint',
  'RETURNING_PROJECTILE',
  'return_compass_needle',
  'repair_spanner',
  'runtimeAutoPromotionAllowed = false',
]) {
  assert(doc.includes(token), `returning waypoint doc missing token: ${token}`);
}

assert(!coordinator.includes('U2ReturningWaypointMotionState'), 'shared waypoint motion must not enter live Stage1 coordinator');

console.log(JSON.stringify({
  status: 'PASS',
  primitive: 'RETURNING_WAYPOINT_MOTION_FOUNDATION',
  liveStage1Changed: false,
  canonTuningChanged: false,
}, null, 2));
