import { readFileSync } from 'node:fs';

import { title1BaseWeaponRuntimeAdmissionSummary } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const statusSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs', import.meta.url), 'utf8');
const emberSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/SelectedBaseWeapons/EmberMatchcasePrototypeRuntime.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const evidenceSource = readFileSync(new URL('../unity/u47-simulator-evidence-sources.ts', import.meta.url), 'utf8');

assert(battleSource.includes('using VampPon.UnitySpike.Runtime.Gameplay.Status;'), 'U2 battle runtime must import the shared Status foundation');
assert(battleSource.includes('private readonly EnemyStatusRuntimeState statusState = new();'), 'each pooled U2EnemyActor must own exactly one reusable Status state');
assert(battleSource.match(/private readonly EnemyStatusRuntimeState statusState = new\(\);/g)?.length === 1, 'U2EnemyActor should have exactly one Status state field');
assert(battleSource.includes('public EnemyStatusRuntimeState Statuses => statusState;'), 'U2EnemyActor needs an explicit Status inspection/application surface');
assert(battleSource.includes('public int ActiveStatusCount => statusState.ActiveCount;'), 'U2EnemyActor needs low-cost active Status observability');

const activateAnchor = 'public void Activate(Vector3 position, float maxHp)\n        {\n            statusState.Clear();\n            hp = maxHp;';
assert(battleSource.includes(activateAnchor), 'pooled enemy Activate must clear stale Status state before restoring HP');
const tickAnchor = 'public void Tick(Vector3 playerPosition, float speed, float deltaTime)\n        {\n            statusState.Tick(deltaTime);\n            if (dying)';
assert(battleSource.includes(tickAnchor), 'enemy Tick must advance Status lifecycle even while death animation is finishing');
const deactivateAnchor = 'public override void Deactivate()\n        {\n            statusState.Clear();\n            base.Deactivate();\n        }';
assert(battleSource.includes(deactivateAnchor), 'pooled enemy Deactivate must clear Status state before returning to pool');

assert(battleSource.includes('enemy.Activate(position, config.enemyHp);'), 'spawn path must continue through U2EnemyActor.Activate so pooled Status state resets');
assert(battleSource.includes('enemies.ForEach(actor => actor.Deactivate());'), 'run reset must continue through enemy Deactivate so Status state clears');
assert(battleSource.includes('if (spriteAnimator.DeathComplete) Deactivate();'), 'death completion must return through Status-clearing Deactivate');

assert(statusSource.includes('public sealed class EnemyStatusRuntimeState'), 'U2EnemyActor must depend on the shared pure C# Status foundation');
assert(statusSource.includes('public void Clear()'), 'Status foundation must retain explicit Clear lifecycle');
assert(statusSource.includes('public void Tick(float deltaSeconds)'), 'Status foundation must retain explicit Tick lifecycle');
assert(!battleSource.includes('statusState.Apply('), 'U2EnemyActor must not self-apply Status without a typed runtime request');
assert(!battleSource.includes('GetStacks(EnemyStatusRuntimeKind.'), 'movement/damage behavior must remain separate from generic ownership until effect semantics are explicitly implemented');
assert(!battleSource.includes('GetRemainingSeconds(EnemyStatusRuntimeKind.'), 'movement/damage behavior must not silently consume Status state yet');

// Application is now connected through the typed projectile request path, while ownership itself remains unchanged.
assert(battleSource.includes('return statusApplicationRequest.Value.ApplyTo(target.Statuses);'), 'typed projectile Status request must apply through the enemy-owned shared Status state');
assert(battleSource.includes('if (!defeated) projectile.ApplyStatusOnHit(hitTarget);'), 'surviving projectile hit must invoke typed Status application');
assert(emberSource.includes('EnemyStatusRuntimeKind.Burn'), 'first Selected16 caller must prove BURN against the shared owner');
assert(emberSource.includes('battle.FireGameplayProjectilesAtNearestTargets('), 'first Selected16 caller must use the recovered multi-target projectile path');
assert(emberSource.includes('CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON'), 'Selected16 caller must not freeze Status tuning in the ownership layer');
assert(coordinatorSource.includes('battle.FireGameplayProjectile(effect.damage * damageMultiplier, effect.pierce)'), 'live Stage1 loop must remain unchanged by prototype admission');
assert(!coordinatorSource.includes('EmberMatchcasePrototypeRuntime'), 'prototype caller must not silently enter the live Stage1 loop');

// Historical U47 evidence normalizes foundation/reusable primitives only. It must never hide a live caller.
assert(evidenceSource.includes("if (file.endsWith('U2BattleController.cs')) normalized = normalized"), 'U47 evidence source must explicitly normalize U2 foundation changes');
assert(evidenceSource.includes('PR169_PROJECTILE_RECOVERY_NORMALIZER'), 'U47 evidence source must mark recovered reusable projectile primitives');
assert(!evidenceSource.includes(".replace('battle.FireGameplayProjectile(effect.damage * damageMultiplier, effect.pierce)'"), 'U47 normalizer must never hide current live coordinator calls');
assert(!evidenceSource.includes('EmberMatchcasePrototypeRuntime'), 'historical normalizer must not fabricate or hide Selected16 prototype caller evidence');

assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount >= 1, 'shared owner + Ember caller must preserve at least the first implementation-review admission');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedWeaponIds.includes('ember_matchcase'), 'enemy Status ownership must continue to support Ember admission');
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 0, 'STATUS_APPLICATION must no longer be a missing shared primitive');
assert(!title1BaseWeaponRuntimeAdmissionSummary.runtimeAutoPromotionAllowed, 'Status ownership/application must not auto-promote Candidate weapons into live runtime');

const historicalDoc = readFileSync(new URL('../../docs/unity-enemy-status-owner-v1.md', import.meta.url), 'utf8');
for (const token of [
  'U2EnemyActor',
  'Activate',
  'Tick',
  'Deactivate',
  'pool',
  'STATUS_APPLICATION',
  'ownership-only',
  'U47 evidence',
]) {
  assert(historicalDoc.includes(token), `historical U2 Status owner doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  enemyOwnsSharedStatusState: true,
  activateClears: true,
  tickConnected: true,
  deactivateClears: true,
  typedHitApplicationConnected: true,
  firstSelected16Caller: 'ember_matchcase',
  selected16UnityAdmitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
  selected16UnityBlocked: title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount,
  statusApplicationStillBlocked: false,
  liveStage1PrototypeCaller: false,
}, null, 2));
