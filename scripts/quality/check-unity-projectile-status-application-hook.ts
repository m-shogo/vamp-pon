import { readFileSync } from 'node:fs';

import { title1BaseWeaponRuntimeAdmissionSummary } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const requestSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs', import.meta.url), 'utf8');
const evidenceSource = readFileSync(new URL('../unity/u47-simulator-evidence-sources.ts', import.meta.url), 'utf8');

assert(requestSource.includes('public readonly struct EnemyStatusApplicationRequest'), 'typed Status request missing');
assert(requestSource.includes('EnemyStatusRuntimeKind kind'), 'request must carry typed Status kind');
assert(requestSource.includes('EnemyStatusApplicationPolicy policy'), 'request must carry exact caller policy');
assert(requestSource.includes('return state.Apply(Kind, Policy);'), 'request must delegate to shared Status state');
assert(battleSource.includes('public bool FireGameplayProjectile(float damage, int pierce)\n            => FireGameplayProjectile(damage, pierce, null);'), 'legacy projectile API must remain source-compatible');
assert(battleSource.includes('EnemyStatusApplicationRequest? statusApplicationRequest'), 'projectile API must accept optional typed Status request');
assert(battleSource.includes('private EnemyStatusApplicationRequest? statusApplicationRequest;'), 'pooled projectile must own optional Status request state');
assert(battleSource.includes('public bool HasStatusApplication => statusApplicationRequest.HasValue;'), 'projectile request state must be observable');
assert(battleSource.includes('this.statusApplicationRequest = statusApplicationRequest;'), 'projectile Activate must capture request');
assert(battleSource.includes('statusApplicationRequest = null;\n            Target = null;\n            base.Deactivate();'), 'pooled projectile must clear request and target');
assert(battleSource.includes('return statusApplicationRequest.Value.ApplyTo(target.Statuses);'), 'Status request must reach shared enemy Status state');
const damage = battleSource.indexOf('var defeated = hitTarget.TakeDamage(');
const apply = battleSource.indexOf('if (!defeated) projectile.ApplyStatusOnHit(hitTarget);');
const consume = battleSource.indexOf('projectile.ConsumeHit();', damage);
assert(damage >= 0 && apply > damage && consume > apply, 'same-hit order must be damage -> surviving Status -> consume');
assert(coordinatorSource.includes('battle.FireGameplayProjectile(effect.damage * damageMultiplier, effect.pierce)'), 'live coordinator must remain legacy no-request caller');
assert(!coordinatorSource.includes('EnemyStatusApplicationRequest'), 'generic recovery must not invent a live Selected16 caller');
assert(evidenceSource.includes('PR169_PROJECTILE_RECOVERY_NORMALIZER'), 'historical U47 normalizer must explicitly strip only reusable primitives');
assert(!evidenceSource.includes(".replace('battle.FireGameplayProjectile(effect.damage * damageMultiplier, effect.pierce)'"), 'historical normalizer must never hide live coordinator call-sites');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 0, 'generic hook alone must not admit Selected16');
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 16, 'STATUS_APPLICATION remains blocked until a real Selected16 caller');
console.log(JSON.stringify({ status: 'PASS', typedRequest: true, pooledRequestReset: true, liveStatusRequestCallers: 0 }, null, 2));
