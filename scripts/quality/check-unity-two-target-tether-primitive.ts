import { existsSync, readFileSync } from 'node:fs';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const runtimePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyTetherPairSelectionRuntime.cs';
const metaPath = `${runtimePath}.meta`;
const projectPath = 'scripts/quality/unity-two-target-tether/UnityTwoTargetTether.Contract.csproj';
const contractPath = 'scripts/quality/unity-two-target-tether/Program.cs';
const docPath = 'docs/unity-two-target-tether-primitive-v1.md';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';

for (const path of [runtimePath, metaPath, projectPath, contractPath, docPath, coordinatorPath]) {
  assert(existsSync(path), `two-target tether contract file missing: ${path}`);
}

const source = readFileSync(runtimePath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');

for (const token of [
  'public readonly struct U2EnemyTetherPairSelectionResult',
  'public static class U2EnemyTetherPairSelectionRuntime',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'IReadOnlyList<U2EnemyActor> candidates',
  'IReadOnlyList<float> priorityScores',
  'float minOriginRange',
  'float maxOriginRange',
  'float minPairDistance',
  'float maxPairDistance',
  'var combinedScore = firstScore + secondScore;',
  'combinedScore > selectedCombinedScore',
  'pairDistanceSquared < selectedPairDistanceSquared',
  'candidate == null || !candidate.IsTargetable || !float.IsFinite(priorityScore)',
  'DistanceSquared2D',
]) {
  assert(source.includes(token), `two-target tether primitive missing contract: ${token}`);
}

for (const forbidden of [
  'EnemyStatusRuntimeKind',
  'TakeDamage(',
  'FireGameplayProjectile',
  'ParticleSystem',
  'LineRenderer',
  'AudioSource',
  'WeaponEffectType',
  'LevelUp',
  '.OrderBy(',
  '.Sort(',
  'new List<',
]) {
  assert(!source.includes(forbidden), `generic tether selector must not own ${forbidden}`);
}

for (const token of [
  'highest eligible combined-priority pair should win',
  'equal combined priority must prefer shorter pair',
  'exact pair tie must preserve first eligible input pair',
  'pair-distance band must be inclusive and caller-controlled',
  'highest combined negative priority pair mismatch',
  'score length mismatch must fail closed',
  'fewer than two candidates must fail closed',
  'no eligible pair must return false without fabricating a result',
]) {
  assert(contract.includes(token), `two-target tether executable contract missing scenario: ${token}`);
}
assert(project.includes('U2EnemyTetherPairSelectionRuntime.cs'), 'contract project must compile real tether selector source');

for (const token of [
  'IMPLEMENTED_SHARED_SELECTION_PRIMITIVE',
  'CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'combined priority score',
  'shortいpair',
  'O(n^2)',
  'TWO_TARGET_TETHER',
  'NOT_CANON',
  'runtimeAutoPromotionAllowed = false',
]) {
  assert(doc.includes(token), `two-target tether doc missing token: ${token}`);
}

assert(!coordinator.includes('U2EnemyTetherPairSelectionRuntime'), 'shared tether selector must not enter live Stage1 coordinator');

console.log(JSON.stringify({
  status: 'PASS',
  primitive: 'TWO_TARGET_TETHER_SELECTION_FOUNDATION',
  complexity: 'O(n^2)',
  liveStage1Changed: false,
  canonTuningChanged: false,
}, null, 2));
