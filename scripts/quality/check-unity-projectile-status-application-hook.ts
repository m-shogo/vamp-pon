import { readFileSync } from 'node:fs';

import { title1BaseWeaponRuntimeAdmissionSummary } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const requestSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusApplicationRequest.cs', import.meta.url), 'utf8');
const evidenceSource = readFileSync(new URL('../unity/u47-simulator-evidence-sources.ts', import.meta.url), 'utf8');

// Typed request owns no tuning defaults and delegates application to the shared policy/state foundation.
assert(requestSource.includes('public readonly struct EnemyStatusApplicationRequest'), 'typed Status application request missing');
assert(requestSource.includes('EnemyStatusRuntimeKind kind'), 'request must carry typed Status kind');
assert(requestSource.includes('EnemyStatusApplicationPolicy policy'), 'request must carry exact caller application policy');
assert(requestSource.includes('public EnemyStatusApplyResult ApplyTo(EnemyStatusRuntimeState state)'), 'request needs explicit ApplyTo surface');
assert(requestSource.includes('if (state == null) throw new ArgumentNullException(nameof(state));'), 'request must fail closed on null state');
assert(requestSource.includes('return state.Apply(Kind, Policy);'), 'request must delegate to shared Status policy semantics');
assert(!requestSource.includes('durationSeconds:'), 'request type must not hide hard-coded duration defaults');
assert(!requestSource.includes('maxStacks:'), 'request type must not hide hard-coded stack defaults');
assert(!requestSource.includes('magnitude:'), 'request type must not hide hard-coded magnitude defaults');

// Existing API remains source-compatible and delegates to a null request.
assert(battleSource.includes('public bool FireGameplayProjectile(float damage, int pierce)\n            => FireGameplayProjectile(damage, pierce, null);'), 'legacy FireGameplayProjectile API must remain compatible and pass no Status request');
assert(battleSource.includes('EnemyStatusApplicationRequest? statusApplicationRequest'), 'new projectile overload must accept an optional typed Status request');
assert(battleSource.includes('config.projectileLifetime,\n                statusApplicationRequest);'), 'projectile spawn must carry the optional Status request into pooled actor state');

// Pooled projectile state must not leak between shots.
assert(battleSource.includes('private EnemyStatusApplicationRequest? statusApplicationRequest;'), 'pooled projectile must store optional Status request');
assert(battleSource.includes('public bool HasStatusApplication => statusApplicationRequest.HasValue;'), 'projectile needs observable request presence for verification');
assert(battleSource.includes('this.statusApplicationRequest = statusApplicationRequest;'), 'projectile Activate must capture request');
assert(battleSource.includes('statusApplicationRequest = null;\n            base.Deactivate();'), 'projectile Deactivate must clear request before returning to pool');

// Apply only after a surviving hit so the status cannot modify the damage calculation of the same hit.
assert(battleSource.includes('var defeated = hitTarget.TakeDamage(projectile.Damage, config.damageFlashSeconds);'), 'projectile hit must preserve existing damage call and capture defeat result');
assert(battleSource.includes('if (!defeated) projectile.ApplyStatusOnHit(hitTarget);'), 'Status request should apply after damage only when target survives');
assert(battleSource.includes('return statusApplicationRequest.Value.ApplyTo(target.Statuses);'), 'projectile Status hook must route through U2EnemyActor shared Status state');
assert(battleSource.indexOf('var defeated = hitTarget.TakeDamage') < battleSource.indexOf('if (!defeated) projectile.ApplyStatusOnHit'), 'Status must apply after same-hit damage');
assert(battleSource.indexOf('if (!defeated) projectile.ApplyStatusOnHit') < battleSource.indexOf('projectile.ConsumeHit();'), 'Status application must happen before projectile hit state is consumed/deactivated');

// Current live U47 coordinator still uses the legacy no-request path. This is why historical U47
// captures remain behavior-equivalent for this hook-only PR.
assert(coordinatorSource.includes('battle.FireGameplayProjectile(damage, effect.pierce)'), 'current live coordinator must still call legacy projectile API');
assert(!coordinatorSource.includes('EnemyStatusApplicationRequest'), 'no live Stage1 weapon may construct a Status request yet');
assert(!coordinatorSource.includes('FireGameplayProjectile(damage, effect.pierce,'), 'no live Stage1 weapon may call the Status overload yet');

// U47 evidence normalization is allowed only for this unreachable optional plumbing. The live
// coordinator source remains fingerprinted and unnormalized for future request call-sites.
assert(evidenceSource.includes('The optional projectile Status hook is not used by the U47 live coordinator yet.'), 'U47 normalizer must document unused-hook boundary');
assert(evidenceSource.includes('var defeated = hitTarget.TakeDamage(projectile.Damage, config.damageFlashSeconds);'), 'U47 normalizer must explicitly revert optional projectile hit hook');
assert(evidenceSource.includes('if (!defeated) projectile.ApplyStatusOnHit(hitTarget);'), 'U47 normalizer must explicitly identify optional Status hit call');
assert(!evidenceSource.includes("if (file.endsWith('Stage1GameplayRuntimeCoordinator.cs')) normalized = normalized\n      .replace('battle.FireGameplayProjectile"), 'U47 normalizer must never hide a future live Status request call-site');

// Generic hook availability is not the same as Selected16 admission. No Selected16 definition or
// executor uses it yet, so the high-level STATUS_APPLICATION blocker remains intentionally closed.
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 0, 'hook-only PR must not admit Selected16 into Unity runtime');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 16, 'Selected16 must remain blocked until a real weapon executor uses the hook');
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 16, 'generic STATUS_APPLICATION blocker remains until live weapon evidence exists');

const doc = readFileSync(new URL('../../docs/unity-projectile-status-application-hook-v1.md', import.meta.url), 'utf8');
for (const token of [
  'optional request',
  'legacy API',
  'after damage',
  'survives',
  'pool',
  'live caller = 0',
  'STATUS_APPLICATION',
  'admitted=0',
  'U47 evidence',
  '再capture',
]) {
  assert(doc.includes(token), `Projectile Status hook doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  typedRequest: true,
  legacyProjectileApiCompatible: true,
  optionalHookCarriedByPool: true,
  statusAppliesAfterDamageToSurvivor: true,
  liveStatusRequestCallers: 0,
  selected16UnityAdmitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
  genericStatusApplicationStillBlocked: title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount,
  historicalU47EvidenceMayRemainNormalizedUntilLiveCallsite: true,
}, null, 2));
