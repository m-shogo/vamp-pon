import { readFileSync } from 'node:fs';

import { title1BaseWeaponRuntimeAdmissionSummary } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const evidenceSource = readFileSync(new URL('../unity/u47-simulator-evidence-sources.ts', import.meta.url), 'utf8');

assert(battleSource.includes('public bool FireGameplayProjectileAtTarget('), 'U2 battle runtime needs explicit target projectile primitive');
assert(battleSource.includes('U2EnemyActor target,'), 'targeted projectile primitive must take a typed enemy actor');
assert(battleSource.includes('EnemyStatusApplicationRequest? statusApplicationRequest = null'), 'targeted projectile primitive must preserve optional Status request transport');
assert(battleSource.includes('if (target == null || !target.IsTargetable) return false;'), 'targeted projectile primitive must fail closed for null/non-targetable enemies');
assert(battleSource.includes('target.transform.position - playerRoot.position'), 'targeted projectile primitive must aim at the caller-selected enemy');
assert(battleSource.includes('config.projectileLifetime,\n                statusApplicationRequest);'), 'targeted projectile primitive must reuse existing projectile pool/config/request transport');

const nearestDelegate = `        public bool FireGameplayProjectile(\n            float damage,\n            int pierce,\n            EnemyStatusApplicationRequest? statusApplicationRequest)\n        {\n            var target = FindNearestEnemy();\n            return FireGameplayProjectileAtTarget(target, damage, pierce, statusApplicationRequest);\n        }`;
assert(battleSource.includes(nearestDelegate), 'existing nearest-target API must delegate into explicit target primitive');
assert(battleSource.match(/public bool FireGameplayProjectileAtTarget\(/g)?.length === 1, 'targeted projectile primitive must have one canonical implementation');
assert(battleSource.match(/var projectile = GetPooled\(projectiles\);/g)?.length === 1, 'projectile pooling/spawn logic should have one canonical implementation');

// No scatter/multi-target behavior is claimed in this PR. Target selection remains nearest-target for live callers.
assert(coordinatorSource.includes('battle.FireGameplayProjectile(damage, effect.pierce)'), 'live Stage1 coordinator must still use existing nearest-target API');
assert(!coordinatorSource.includes('FireGameplayProjectileAtTarget'), 'live coordinator must not select explicit targets yet');
assert(!coordinatorSource.includes('FindNearestEnemies'), 'multi-target selection must not be silently introduced in targeted-primitive PR');
assert(!battleSource.includes('FireGameplayProjectilesAtNearestTargets'), 'scatter executor must remain a separate next step');

// Historical U47 evidence can remain only because this refactor normalizes exactly back to the prior optional-hook source.
assert(evidenceSource.includes("normalized = normalized.replace(`        public bool FireGameplayProjectile("), 'U47 evidence normalizer must contain explicit targeted-projectile pre-normalization');
assert(evidenceSource.includes('return FireGameplayProjectileAtTarget(target, damage, pierce, statusApplicationRequest);'), 'normalizer must explicitly identify targeted delegation');
assert(evidenceSource.includes('public bool FireGameplayProjectileAtTarget('), 'normalizer must explicitly strip the new target primitive for historical equivalence');
assert(!evidenceSource.includes(".replace('battle.FireGameplayProjectile(damage, effect.pierce)'"), 'normalizer must never hide live coordinator behavior');

assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 0, 'target-spawn refactor alone must not admit Selected16');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 16, 'Selected16 must remain blocked until real archetype executors exist');
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 16, 'target-spawn refactor must not change high-level Status admission');

const doc = readFileSync(new URL('../../docs/unity-targeted-projectile-primitive-v1.md', import.meta.url), 'utf8');
for (const token of [
  'target selection',
  'projectile spawn',
  'nearest-target',
  'FireGameplayProjectileAtTarget',
  'scatter',
  'behavior-equivalent',
  'U47 evidence',
  'admitted=0',
  'next',
]) {
  assert(doc.includes(token), `Targeted projectile primitive doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  canonicalProjectileSpawnPrimitive: 'FireGameplayProjectileAtTarget',
  liveTargetSelection: 'nearest-target',
  multiTargetSelectionImplemented: false,
  scatterExecutorImplemented: false,
  statusRequestTransportPreserved: true,
  selected16UnityAdmitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
}, null, 2));
