import { readFileSync } from 'node:fs';

import { title1BaseWeaponRuntimeAdmissionSummary } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const statusSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Status/EnemyStatusRuntimeState.cs', import.meta.url), 'utf8');
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

// This PR owns lifecycle only. It must not pretend hit/application/effect behavior is already connected.
assert(!battleSource.includes('.Statuses.Apply('), 'U2 battle must not claim Weapon hit → Status Apply before the next integration step');
assert(!battleSource.includes('statusState.Apply('), 'U2EnemyActor must not self-apply Status without a runtime application request');
assert(!battleSource.includes('GetStacks(EnemyStatusRuntimeKind.'), 'movement/damage behavior must remain unchanged until per-Status runtime semantics are implemented');
assert(!battleSource.includes('GetRemainingSeconds(EnemyStatusRuntimeKind.'), 'movement/damage behavior must remain unchanged in ownership-only PR');

// Historical U47 captures remain valid only because the fingerprint normalizer strips this exact
// ownership-only wiring. It must not hide future Apply/effect semantics.
assert(evidenceSource.includes("if (file.endsWith('U2BattleController.cs')) normalized = normalized"), 'U47 evidence source must explicitly normalize ownership-only U2 changes');
for (const token of [
  ".replace('using VampPon.UnitySpike.Runtime.Gameplay.Status;\\n', '')",
  ".replace('        private readonly EnemyStatusRuntimeState statusState = new();\\n', '')",
  "statusState.Clear();\\n            hp = maxHp;",
  "statusState.Tick(deltaTime);\\n            if (dying)",
  "public override void Deactivate()\\n        {\\n            statusState.Clear();",
]) {
  assert(evidenceSource.includes(token), `U47 ownership-only normalizer missing exact token: ${token}`);
}
assert(!evidenceSource.includes(".replace('        public bool TakeDamage"), 'U47 normalizer must not hide damage-path changes');
assert(!evidenceSource.includes(".replace('                hitTarget.TakeDamage"), 'U47 normalizer must not hide projectile-hit changes');
assert(!evidenceSource.includes('.Statuses.Apply('), 'U47 normalizer must never normalize away future Status application semantics');

assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 0, 'Status ownership alone must not admit Selected16 into Unity runtime');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityBlockedRuntimeCount === 16, 'Selected16 must remain Unity-blocked until hit/application and executor primitives exist');
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 16, 'STATUS_APPLICATION must remain missing after ownership-only integration');
assert(!title1BaseWeaponRuntimeAdmissionSummary.runtimeAutoPromotionAllowed, 'Status ownership must not auto-promote Candidate weapons');

const doc = readFileSync(new URL('../../docs/unity-enemy-status-owner-v1.md', import.meta.url), 'utf8');
for (const token of [
  'U2EnemyActor',
  'Activate',
  'Tick',
  'Deactivate',
  'pool',
  'STATUS_APPLICATION',
  'admitted=0',
  'hit → Apply',
  'ownership-only',
  'U47 evidence',
  '再capture',
]) {
  assert(doc.includes(token), `U2 Status owner doc missing token: ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS',
  enemyOwnsSharedStatusState: true,
  activateClears: true,
  tickConnected: true,
  deactivateClears: true,
  hitApplicationConnected: false,
  u47HistoricalEvidenceNormalizedForOwnershipOnlyChange: true,
  selected16UnityAdmitted: title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount,
  statusApplicationStillBlocked: title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount,
}, null, 2));
