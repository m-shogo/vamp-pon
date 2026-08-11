import { existsSync, readFileSync } from 'node:fs';

import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
  title1BaseWeaponRuntimeAdmissionSummary,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';
import { weapons } from '../../src/game/data/weapons.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const runtimePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyHomingPrioritySelectionRuntime.cs';
const metaPath = `${runtimePath}.meta`;
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';
const projectPath = 'scripts/quality/unity-homing-priority-selection/UnityHomingPrioritySelection.Contract.csproj';
const contractPath = 'scripts/quality/unity-homing-priority-selection/Program.cs';
const docPath = 'docs/unity-homing-priority-selection-primitive-v1.md';

for (const path of [runtimePath, metaPath, coordinatorPath, projectPath, contractPath, docPath]) {
  assert(existsSync(path), `homing priority selection contract file missing: ${path}`);
}

const source = readFileSync(runtimePath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');

for (const token of [
  'public enum U2EnemyPriorityDistanceTieBreak', 'StableInputOrder', 'PreferNearer', 'PreferFarther',
  'public readonly struct U2EnemyPrioritySelectionResult', 'public static class U2EnemyHomingPrioritySelectionRuntime',
  'public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";',
  'IReadOnlyList<U2EnemyActor> candidates', 'IReadOnlyList<float> priorityScores',
  'candidates.Count != priorityScores.Count', 'candidate == null || !candidate.IsTargetable || !float.IsFinite(score)',
  'distanceSquared = delta.x * delta.x + delta.y * delta.y', 'score > selectedScore', 'score == selectedScore && WinsDistanceTie(',
]) {
  assert(source.includes(token), `homing priority primitive missing contract: ${token}`);
}

for (const forbidden of ['star_map_pin','return_compass_needle','MARKED','EnemyStatusRuntimeKind','Boss','Elite','TakeDamage(','FireGameplayProjectile','ParticleSystem','.OrderBy(','.Sort(','new List<']) {
  assert(!source.includes(forbidden), `generic homing priority selector must not own ${forbidden}`);
}

assert(currentUnityWeaponRuntimeCapabilities.HOMING_PRIORITY_SELECTION === 'IMPLEMENTED', 'HOMING_PRIORITY_SELECTION evidence drift');
assert(!title1BaseWeaponRuntimeAdmissionSummary.missingCapabilityFrequency.some((entry) => entry.capability === 'HOMING_PRIORITY_SELECTION'), 'implemented homing priority must disappear from missing frequency');

const starPin = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'star_map_pin');
assert(starPin, 'star_map_pin admission row missing');
assert(starPin.requiredUnityCapabilities.join(',') === 'HOMING_PRIORITY_SELECTION,STATUS_APPLICATION', `unexpected star_map_pin requirements: ${starPin.requiredUnityCapabilities.join(',')}`);
assert(starPin.missingUnityCapabilities.length === 0 && starPin.prototypeCallerImplemented, 'Star Map Pin primitive/caller proof must remain complete');
assert(starPin.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && starPin.mayEnterUnityRuntimeRegistry, 'Star Map Pin implementation-review admission drift');
assert(starPin.runtimeStatus === 'NOT_IMPLEMENTED', 'Star Map Pin proof must not claim live runtime');

const returnNeedle = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'return_compass_needle');
assert(returnNeedle, 'return_compass_needle admission row missing');
assert(returnNeedle.implementedUnityCapabilities.includes('HOMING_PRIORITY_SELECTION'), 'return compass needle must inherit priority-selector evidence');
assert(returnNeedle.missingUnityCapabilities.includes('RETURNING_PROJECTILE'), 'return compass needle must remain blocked until returning projectile capability is separately admitted');
assert(returnNeedle.unityDecision === 'BLOCKED_MISSING_UNITY_PRIMITIVES' && !returnNeedle.mayEnterUnityRuntimeRegistry, 'return compass needle must remain primitive-blocked');

assert(!weapons.some((weapon) => weapon.id === 'star_map_pin'), 'shared selector/caller proof must not add Star Map Pin to Web live catalog');
assert(!coordinator.includes('U2EnemyHomingPrioritySelectionRuntime'), 'shared selector must not enter live Stage1 coordinator');
assert(!coordinator.includes('star_map_pin'), 'Star Map Pin must remain outside live Stage1 coordinator');

for (const token of [
  'highest finite in-range targetable priority must win before distance','PreferFarther must choose farthest equal-priority target',
  'PreferNearer must choose nearest equal-priority target','stable tie must preserve first eligible input',
  'range boundaries must be inclusive and negative finite priority scores must remain valid',
  'parallel priority-score length mismatch must fail closed','non-finite range must fail closed','no eligible target must return false without fabricating a result',
]) {
  assert(contract.includes(token), `homing priority executable contract missing scenario: ${token}`);
}
assert(project.includes('U2EnemyHomingPrioritySelectionRuntime.cs'), 'contract project must compile real homing priority source');

for (const token of ['HOMING_PRIORITY_SELECTION','CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','priority score','PreferFarther','star_map_pin','return_compass_needle','RETURNING_PROJECTILE','TEST_ONLY','NOT_CANON','runtimeAutoPromotionAllowed = false']) {
  assert(doc.includes(token), `homing priority primitive doc missing token: ${token}`);
}

console.log(JSON.stringify({ status: 'PASS', primitive: 'HOMING_PRIORITY_SELECTION', starMapPin: starPin.unityDecision, returnCompassNeedle: returnNeedle.unityDecision, liveStage1Changed: false }, null, 2));
