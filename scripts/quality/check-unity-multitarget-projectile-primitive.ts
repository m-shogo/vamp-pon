import { readFileSync } from 'node:fs';

import { title1BaseWeaponRuntimeAdmissionSummary } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const evidenceSource = readFileSync(new URL('../unity/u47-simulator-evidence-sources.ts', import.meta.url), 'utf8');

assert(battleSource.includes('private readonly List<U2EnemyActor> nearestEnemyTargetScratch = new(8);'), 'multi-target query must reuse a controller-owned scratch list');
assert(battleSource.includes('private Action<U2EnemyActor> collectTargetableEnemyAction;'), 'multi-target query should cache the pool callback rather than recreate it every shot');
assert(battleSource.includes('collectTargetableEnemyAction ??= CollectTargetableEnemyForScratch;'), 'multi-target query must lazily cache its callback');
assert(battleSource.includes('nearestEnemyTargetScratch.Clear();'), 'multi-target scratch must reset before each query');
assert(battleSource.includes('enemies.ForEach(collectTargetableEnemyAction);'), 'multi-target query must use existing enemy pool enumeration');
assert(battleSource.includes('if (enemy != null && enemy.IsTargetable) nearestEnemyTargetScratch.Add(enemy);'), 'multi-target query must include targetable enemies only');

assert(battleSource.includes('public int FireGameplayProjectilesAtNearestTargets('), 'multi-target projectile primitive missing');
assert(battleSource.includes('if (maxTargets <= 0) return 0;'), 'non-positive target caps must fail closed');
assert(battleSource.includes('var targetCount = Math.Min(maxTargets, nearestEnemyTargetScratch.Count);'), 'multi-target primitive must enforce caller target cap');
assert(battleSource.includes('SortNearestEnemyScratchPrefix(targetCount);'), 'multi-target primitive must deterministically order the selected prefix');
assert(battleSource.includes('FireGameplayProjectileAtTarget('), 'multi-target primitive must reuse canonical target projectile spawn');
assert(battleSource.includes('statusApplicationRequest))'), 'multi-target primitive must preserve optional typed Status request transport');
assert(battleSource.includes('return fired;'), 'multi-target primitive must report actual spawned projectile count');

// Selection is deterministic for equal-distance targets and only partially sorts the requested prefix.
assert(battleSource.includes('for (var i = 0; i < targetCount; i++)'), 'nearest prefix selection loop missing');
assert(battleSource.includes('candidateIndex < nearestEnemyTargetScratch.Count'), 'prefix selection must compare against all remaining targetable enemies');
assert(battleSource.includes('Math.Abs(candidateDistance - nearestDistance) <= 0.0001f && candidateInstanceId < nearestInstanceId'), 'equal-distance target ordering needs stable instance-id tie break');
assert(battleSource.includes('nearestEnemyTargetScratch[i] = nearestEnemyTargetScratch[nearestIndex];'), 'partial selection swap missing');
assert(battleSource.includes('(enemy.transform.position - playerRoot.position).sqrMagnitude'), 'distance comparison must use squared distance');

// Keep hot-path implementation simple: no per-shot LINQ, new List, or full list Sort.
const multiTargetStart = battleSource.indexOf('public int FireGameplayProjectilesAtNearestTargets(');
const findNearestStart = battleSource.indexOf('private U2EnemyActor FindNearestEnemy()', multiTargetStart);
assert(multiTargetStart >= 0 && findNearestStart > multiTargetStart, 'cannot isolate multi-target primitive source block');
const multiTargetBlock = battleSource.slice(multiTargetStart, findNearestStart);
for (const forbidden of ['Enumerable.', '.OrderBy(', '.ThenBy(', '.ToList(', 'new List<', '.Sort(']) {
  assert(!multiTargetBlock.includes(forbidden), `multi-target hot path must avoid ${forbidden}`);
}

// Existing nearest-target path remains the only live caller until a real Selected16 vertical slice lands.
assert(coordinatorSource.includes('battle.FireGameplayProjectile(damage, effect.pierce)'), 'current live coordinator must keep legacy nearest-target call');
assert(!coordinatorSource.includes('FireGameplayProjectilesAtNearestTargets'), 'multi-target primitive must have zero live callers in this PR');
assert(!coordinatorSource.includes('FireGameplayProjectileAtTarget'), 'live coordinator must not explicitly choose targets yet');

// Historical evidence remains valid only while the primitive is unreachable; exact block is normalized away.
assert(evidenceSource.includes('nearestEnemyTargetScratch = new(8)'), 'U47 normalizer must explicitly identify multi-target scratch block');
assert(evidenceSource.includes("normalized = normalized.replace(`        private readonly List<U2EnemyActor> nearestEnemyTargetScratch"), 'U47 normalizer must strip exact unreachable multi-target block');
assert(!evidenceSource.includes(".replace('battle.FireGameplayProjectilesAtNearestTargets"), 'U47 normalizer must never hide a future live multi-target call-site');

assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 0, 'unused multi-target primitive alone must not admit Selected16');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 16, 'Selected16 must remain blocked until a real archetype executor/caller is wired');
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 16, 'multi-target primitive must not change high-level Status admission');

const doc = readFileSync(new URL('../../docs/unity-multitarget-projectile-primitive-v1.md', import.meta.url), 'utf8');
for (const token of [
  'reusable scratch',
  'distinct',
  'deterministic',
  'squared distance',
  'instance ID',
  'maxTargets',
  'LINQ',
  'live caller = 0',
  'U47 evidence',
  'ember_matchcase',
]) {
  assert(doc.includes(token), `Multi-target projectile primitive doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  reusableScratch: true,
  targetableOnly: true,
  distinctByPoolEntry: true,
  deterministicNearestPrefix: true,
  equalDistanceTieBreak: 'instance-id',
  hotPathLinq: false,
  hotPathNewList: false,
  liveCallers: 0,
  selected16UnityAdmitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
}, null, 2));
