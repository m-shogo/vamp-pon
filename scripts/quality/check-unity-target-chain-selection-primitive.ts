import { existsSync, readFileSync } from 'node:fs';

import {
  currentUnityWeaponRuntimeCapabilities,
  title1BaseWeaponRuntimeAdmissionEntries,
} from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const runtimePath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyTargetChainSelectionRuntime.cs';
const metaPath = `${runtimePath}.meta`;
const contractPath = 'scripts/quality/unity-target-chain-selection/Program.cs';
const projectPath = 'scripts/quality/unity-target-chain-selection/UnityTargetChainSelection.Contract.csproj';
const docPath = 'docs/unity-target-chain-selection-primitive-v1.md';
const coordinatorPath = 'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs';

for (const path of [runtimePath, metaPath, contractPath, projectPath, docPath, coordinatorPath]) {
  assert(existsSync(path), `target chain selection contract file missing: ${path}`);
}

const source = readFileSync(runtimePath, 'utf8');
const contract = readFileSync(contractPath, 'utf8');
const project = readFileSync(projectPath, 'utf8');
const doc = readFileSync(docPath, 'utf8');
const coordinator = readFileSync(coordinatorPath, 'utf8');

for (const token of [
  'public static class U2EnemyTargetChainSelectionRuntime','CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON',
  'IReadOnlyList<U2EnemyActor> candidates','IReadOnlyList<float> priorityScores','float maxFirstRange','float maxHopDistance','int maxTargets',
  'List<U2EnemyActor> results','ReferenceEquals(candidates, results)','ContainsReference(results, candidate)',
  'score > selectedScore','score == selectedScore && distanceSquared < selectedDistanceSquared','anchor = selected.transform.position;',
]) {
  assert(source.includes(token), `target chain selector missing contract: ${token}`);
}

for (const forbidden of ['copper_tuning_fork','CONDUCTIVE','SHOCK','EnemyStatusRuntimeKind','TakeDamage(','FireGameplayProjectile','ParticleSystem','AudioSource','WeaponEffectType','LevelUp','.OrderBy(','.Sort(']) {
  assert(!source.includes(forbidden), `generic target chain selector must not own ${forbidden}`);
}

for (const token of [
  'chain must re-anchor each hop and choose highest caller priority within local range','chain must never select the same target twice',
  'equal priority must prefer nearer candidate at the current hop','exact score/distance tie must preserve stable input order',
  'finite negative priorities must remain valid and higher numeric score must win','untargetable high-priority candidate must be ignored',
  'non-finite priority must be skipped without poisoning remaining candidates','maxTargets cap must bound caller result length',
  'priority length mismatch must fail closed and clear stale results','candidate/result alias must fail closed rather than mutate while scanning',
]) {
  assert(contract.includes(token), `target chain executable contract missing scenario: ${token}`);
}
assert(project.includes('U2EnemyTargetChainSelectionRuntime.cs'), 'contract project must compile real chain selector source');

for (const token of ['IMPLEMENTED_SHARED_SELECTION_FOUNDATION','CAPABILITY_IMPLEMENTED','CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON','local anchor','TARGET_CHAIN_SELECTION','Finite negative score','no duplicate','copper_tuning_fork','runtimeAutoPromotionAllowed = false']) {
  assert(doc.includes(token), `target chain doc missing token: ${token}`);
}

assert(currentUnityWeaponRuntimeCapabilities.TARGET_CHAIN_SELECTION === 'IMPLEMENTED', 'verified Copper caller must back TARGET_CHAIN_SELECTION capability');
const copper = title1BaseWeaponRuntimeAdmissionEntries.find((entry) => entry.weaponId === 'copper_tuning_fork');
assert(copper, 'copper_tuning_fork admission row missing');
assert(copper.missingUnityCapabilities.length === 0 && copper.prototypeCallerImplemented, 'Copper chain primitive/caller proof must be complete');
assert(copper.unityDecision === 'ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW' && copper.mayEnterUnityRuntimeRegistry, 'Copper implementation-review admission drift');
assert(copper.runtimeStatus === 'NOT_IMPLEMENTED', 'Copper admission must not claim live runtime');
assert(!coordinator.includes('U2EnemyTargetChainSelectionRuntime') && !coordinator.includes('copper_tuning_fork'), 'shared chain/caller must remain outside live Stage1 coordinator');

console.log(JSON.stringify({
  status: 'PASS',
  primitive: 'TARGET_CHAIN_SELECTION',
  admissionCapability: currentUnityWeaponRuntimeCapabilities.TARGET_CHAIN_SELECTION,
  copperDecision: copper.unityDecision,
  liveStage1Changed: false,
  canonTuningChanged: false,
}, null, 2));
