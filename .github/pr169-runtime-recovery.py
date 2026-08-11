from pathlib import Path

BATTLE_PATH = Path('unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs')
EVIDENCE_PATH = Path('scripts/unity/u47-simulator-evidence-sources.ts')


def require_once(text: str, needle: str, label: str) -> None:
    count = text.count(needle)
    if count != 1:
        raise SystemExit(f'{label} anchor mismatch: {count}')


def replace_once(text: str, old: str, new: str, label: str) -> str:
    require_once(text, old, label)
    return text.replace(old, new, 1)


def replace_between(text: str, start: str, end: str, replacement: str, label: str) -> str:
    start_index = text.find(start)
    if start_index < 0:
        raise SystemExit(f'{label} start anchor missing')
    end_index = text.find(end, start_index)
    if end_index < 0:
        raise SystemExit(f'{label} end anchor missing')
    if text.find(start, start_index + len(start)) >= 0:
        raise SystemExit(f'{label} start anchor duplicated')
    return text[:start_index] + replacement + text[end_index:]


OLD_FIRE = '''        public bool FireGameplayProjectile(float damage, int pierce)
        {
            var target = FindNearestEnemy();
            var projectile = FirstInactive(projectiles);
            if (target == null || projectile == null) return false;
            projectile.Activate(player.position, target, config.projectileSpeed, damage, pierce);
            feedbackBridge?.PlayWeaponFire(); FiredProjectileCount++; PlayerAttackFired?.Invoke(); return true;
        }

'''

NEW_FIRE = '''        public bool FireGameplayProjectile(float damage, int pierce)
            => FireGameplayProjectile(damage, pierce, null);

        public bool FireGameplayProjectile(
            float damage,
            int pierce,
            EnemyStatusApplicationRequest? statusApplicationRequest)
        {
            var target = FindNearestEnemy();
            return FireGameplayProjectileAtTarget(target, damage, pierce, statusApplicationRequest);
        }

        public bool FireGameplayProjectileAtTarget(
            U2EnemyActor target,
            float damage,
            int pierce,
            EnemyStatusApplicationRequest? statusApplicationRequest = null)
        {
            if (target == null || !target.IsTargetable) return false;
            var projectile = FirstInactive(projectiles);
            if (projectile == null) return false;
            projectile.Activate(player.position, target, config.projectileSpeed, damage, pierce, statusApplicationRequest);
            feedbackBridge?.PlayWeaponFire();
            FiredProjectileCount++;
            PlayerAttackFired?.Invoke();
            return true;
        }

        public int FireGameplayProjectilesAtNearestTargets(
            float damage,
            int pierce,
            int maxTargets,
            EnemyStatusApplicationRequest? statusApplicationRequest = null)
        {
            if (maxTargets <= 0) return 0;
            nearestEnemyTargetScratch.Clear();
            for (var enemyIndex = 0; enemyIndex < enemies.Count; enemyIndex++)
            {
                var enemy = enemies[enemyIndex];
                if (enemy != null && enemy.IsTargetable) nearestEnemyTargetScratch.Add(enemy);
            }
            if (nearestEnemyTargetScratch.Count == 0) return 0;

            var targetCount = Math.Min(maxTargets, nearestEnemyTargetScratch.Count);
            SortNearestEnemyScratchPrefix(targetCount);
            var fired = 0;
            for (var i = 0; i < targetCount; i++)
            {
                if (FireGameplayProjectileAtTarget(
                    nearestEnemyTargetScratch[i],
                    damage,
                    pierce,
                    statusApplicationRequest)) fired++;
            }
            return fired;
        }

        private void SortNearestEnemyScratchPrefix(int targetCount)
        {
            for (var i = 0; i < targetCount; i++)
            {
                var nearestIndex = i;
                var nearestDistance = DistanceSquaredFromPlayer(nearestEnemyTargetScratch[i]);
                var nearestPoolOrder = PoolOrderOf(nearestEnemyTargetScratch[i]);
                for (var candidateIndex = i + 1; candidateIndex < nearestEnemyTargetScratch.Count; candidateIndex++)
                {
                    var candidate = nearestEnemyTargetScratch[candidateIndex];
                    var candidateDistance = DistanceSquaredFromPlayer(candidate);
                    var candidatePoolOrder = PoolOrderOf(candidate);
                    if (candidateDistance < nearestDistance ||
                        (Math.Abs(candidateDistance - nearestDistance) <= 0.0001f && candidatePoolOrder < nearestPoolOrder))
                    {
                        nearestIndex = candidateIndex;
                        nearestDistance = candidateDistance;
                        nearestPoolOrder = candidatePoolOrder;
                    }
                }
                if (nearestIndex == i) continue;
                var swap = nearestEnemyTargetScratch[i];
                nearestEnemyTargetScratch[i] = nearestEnemyTargetScratch[nearestIndex];
                nearestEnemyTargetScratch[nearestIndex] = swap;
            }
        }

        private float DistanceSquaredFromPlayer(U2EnemyActor enemy)
            => (enemy.transform.position - player.position).sqrMagnitude;

        private int PoolOrderOf(U2EnemyActor enemy) => enemies.IndexOf(enemy);

'''

OLD_HIT = '''                    var hitPosition = projectile.transform.position;
                    var hitTarget = projectile.Target;
                    projectile.ConsumeHit();
                    var defeated = hitTarget.TakeDamage(projectile.Damage > 0f ? projectile.Damage : config.projectileDamage, config.damageFlashSeconds);
                    feedbackBridge?.PlayEnemyHit();
'''

NEW_HIT = '''                    var hitPosition = projectile.transform.position;
                    var hitTarget = projectile.Target;
                    var defeated = hitTarget.TakeDamage(projectile.Damage > 0f ? projectile.Damage : config.projectileDamage, config.damageFlashSeconds);
                    if (!defeated) projectile.ApplyStatusOnHit(hitTarget);
                    projectile.ConsumeHit();
                    feedbackBridge?.PlayEnemyHit();
'''

OLD_PROJECTILE_FIELDS = '''        private Vector3 direction;
        private float speed;
        private float lifeSeconds;

        public U2EnemyActor Target { get; private set; }
        public float Damage { get; private set; }
        public int PierceRemaining { get; private set; }
'''

NEW_PROJECTILE_FIELDS = '''        private Vector3 direction;
        private float speed;
        private float lifeSeconds;
        private EnemyStatusApplicationRequest? statusApplicationRequest;

        public U2EnemyActor Target { get; private set; }
        public float Damage { get; private set; }
        public int PierceRemaining { get; private set; }
        public bool HasStatusApplication => statusApplicationRequest.HasValue;
'''

OLD_PROJECTILE_ACTIVATE = '''        public void Activate(Vector3 origin, U2EnemyActor target, float projectileSpeed, float damage, int pierce)
        {
            Target = target;
            Damage = damage;
            PierceRemaining = Mathf.Max(0, pierce);
            speed = projectileSpeed;
            lifeSeconds = 1.8f;
            transform.position = origin;
            var targetPosition = target != null ? target.transform.position : origin + Vector3.up;
            direction = (targetPosition - origin).sqrMagnitude > 0.0001f ? (targetPosition - origin).normalized : Vector3.up;
            IsActive = true;
            gameObject.SetActive(true);
        }

'''

NEW_PROJECTILE_ACTIVATE = '''        public void Activate(Vector3 origin, U2EnemyActor target, float projectileSpeed, float damage, int pierce)
            => Activate(origin, target, projectileSpeed, damage, pierce, null);

        public void Activate(
            Vector3 origin,
            U2EnemyActor target,
            float projectileSpeed,
            float damage,
            int pierce,
            EnemyStatusApplicationRequest? statusApplicationRequest)
        {
            Target = target;
            Damage = damage;
            PierceRemaining = Mathf.Max(0, pierce);
            speed = projectileSpeed;
            lifeSeconds = 1.8f;
            this.statusApplicationRequest = statusApplicationRequest;
            transform.position = origin;
            var targetPosition = target != null ? target.transform.position : origin + Vector3.up;
            direction = (targetPosition - origin).sqrMagnitude > 0.0001f ? (targetPosition - origin).normalized : Vector3.up;
            IsActive = true;
            gameObject.SetActive(true);
        }

        public EnemyStatusApplyResult? ApplyStatusOnHit(U2EnemyActor target)
        {
            if (target == null || !statusApplicationRequest.HasValue) return null;
            return statusApplicationRequest.Value.ApplyTo(target.Statuses);
        }

        public override void Deactivate()
        {
            statusApplicationRequest = null;
            Target = null;
            base.Deactivate();
        }

'''

SCRATCH_LINE = '        private readonly List<U2EnemyActor> nearestEnemyTargetScratch = new(8);\n'
SCRATCH_ANCHOR = '        private readonly List<U2EnemyActor> activeEnemies = new(64);\n'


def patch_battle() -> bool:
    text = BATTLE_PATH.read_text()
    if 'public int FireGameplayProjectilesAtNearestTargets(' in text and 'ApplyStatusOnHit(U2EnemyActor target)' in text:
        print('U2 projectile primitives already recovered; runtime patch no-op')
        return False

    if SCRATCH_LINE not in text:
        text = replace_once(text, SCRATCH_ANCHOR, SCRATCH_ANCHOR + SCRATCH_LINE, 'scratch field')

    text = replace_between(
        text,
        '        public bool FireGameplayProjectile(float damage, int pierce)\n',
        '        public bool TryGetNearestEnemyPosition(out Vector3 position)\n',
        NEW_FIRE,
        'gameplay projectile methods',
    )
    text = replace_once(text, OLD_HIT, NEW_HIT, 'projectile hit order')
    text = replace_once(text, OLD_PROJECTILE_FIELDS, NEW_PROJECTILE_FIELDS, 'projectile fields')
    text = replace_between(
        text,
        '        public void Activate(Vector3 origin, U2EnemyActor target, float projectileSpeed, float damage, int pierce)\n',
        '        public void ConsumeHit()\n',
        NEW_PROJECTILE_ACTIVATE,
        'projectile activate/status methods',
    )
    BATTLE_PATH.write_text(text)
    return True


def ts_template(value: str) -> str:
    if '`' in value or '${' in value:
        raise SystemExit('normalizer template contains unsafe template token')
    return '`' + value + '`'


def patch_evidence() -> bool:
    text = EVIDENCE_PATH.read_text()
    marker = 'PR169_PROJECTILE_RECOVERY_NORMALIZER'
    if marker in text:
        return False
    anchor = "  if (file.endsWith('U2BattleController.cs')) normalized = normalized\n"
    require_once(text, anchor, 'U2 evidence normalizer')
    block = (
        f"  // {marker}: reusable primitives only; live coordinator call-sites are never normalized.\n"
        "  if (file.endsWith('U2BattleController.cs')) normalized = normalized\n"
        f"      .replace({ts_template(SCRATCH_LINE)}, '')\n"
        f"      .replace({ts_template(NEW_FIRE)}, {ts_template(OLD_FIRE)})\n"
        f"      .replace({ts_template(NEW_HIT)}, {ts_template(OLD_HIT)})\n"
        f"      .replace({ts_template(NEW_PROJECTILE_FIELDS)}, {ts_template(OLD_PROJECTILE_FIELDS)})\n"
        f"      .replace({ts_template(NEW_PROJECTILE_ACTIVATE)}, {ts_template(OLD_PROJECTILE_ACTIVATE)});\n"
    )
    EVIDENCE_PATH.write_text(text.replace(anchor, block + anchor, 1))
    return True


PROJECTILE_STATUS_CHECKER = r'''import { readFileSync } from 'node:fs';

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
'''

TARGETED_CHECKER = r'''import { readFileSync } from 'node:fs';
import { title1BaseWeaponRuntimeAdmissionSummary } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const evidenceSource = readFileSync(new URL('../unity/u47-simulator-evidence-sources.ts', import.meta.url), 'utf8');
assert(battleSource.includes('public bool FireGameplayProjectileAtTarget('), 'targeted projectile primitive missing');
assert(battleSource.includes('U2EnemyActor target,'), 'targeted primitive must take typed enemy actor');
assert(battleSource.includes('EnemyStatusApplicationRequest? statusApplicationRequest = null'), 'targeted primitive must preserve Status transport');
assert(battleSource.includes('if (target == null || !target.IsTargetable) return false;'), 'targeted primitive must fail closed');
assert(battleSource.includes('var projectile = FirstInactive(projectiles);'), 'targeted primitive must reuse current pool');
assert(battleSource.includes('projectile.Activate(player.position, target, config.projectileSpeed, damage, pierce, statusApplicationRequest);'), 'targeted primitive must preserve current target-based architecture');
assert(battleSource.includes('return FireGameplayProjectileAtTarget(target, damage, pierce, statusApplicationRequest);'), 'nearest API must delegate to canonical target spawn');
assert(battleSource.match(/public bool FireGameplayProjectileAtTarget\(/g)?.length === 1, 'targeted spawn must have one implementation');
assert(battleSource.includes('FireGameplayProjectilesAtNearestTargets'), 'multi-target primitive must compose targeted spawn');
assert(coordinatorSource.includes('battle.FireGameplayProjectile(effect.damage * damageMultiplier, effect.pierce)'), 'live coordinator must remain nearest-target');
assert(!coordinatorSource.includes('FireGameplayProjectileAtTarget'), 'live coordinator must not choose explicit targets yet');
assert(evidenceSource.includes('PR169_PROJECTILE_RECOVERY_NORMALIZER'), 'U47 normalizer recovery marker missing');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 0, 'targeted primitive alone must not admit Selected16');
console.log(JSON.stringify({ status: 'PASS', canonicalProjectileSpawnPrimitive: 'FireGameplayProjectileAtTarget', liveTargetSelection: 'nearest-target' }, null, 2));
'''

MULTITARGET_CHECKER = r'''import { readFileSync } from 'node:fs';
import { title1BaseWeaponRuntimeAdmissionSummary } from '../../src/game/data/title1BaseWeaponRuntimeAdmissionSource.ts';
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const battleSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs', import.meta.url), 'utf8');
const coordinatorSource = readFileSync(new URL('../../unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs', import.meta.url), 'utf8');
const evidenceSource = readFileSync(new URL('../unity/u47-simulator-evidence-sources.ts', import.meta.url), 'utf8');
assert(battleSource.includes('private readonly List<U2EnemyActor> nearestEnemyTargetScratch = new(8);'), 'multi-target scratch missing');
assert(battleSource.includes('for (var enemyIndex = 0; enemyIndex < enemies.Count; enemyIndex++)'), 'multi-target query must enumerate existing pool');
assert(battleSource.includes('if (enemy != null && enemy.IsTargetable) nearestEnemyTargetScratch.Add(enemy);'), 'only targetable enemies may enter scratch');
assert(battleSource.includes('public int FireGameplayProjectilesAtNearestTargets('), 'multi-target primitive missing');
assert(battleSource.includes('if (maxTargets <= 0) return 0;'), 'non-positive target cap must fail closed');
assert(battleSource.includes('var targetCount = Math.Min(maxTargets, nearestEnemyTargetScratch.Count);'), 'target cap must be enforced');
assert(battleSource.includes('SortNearestEnemyScratchPrefix(targetCount);'), 'deterministic nearest-prefix selection missing');
assert(battleSource.includes('FireGameplayProjectileAtTarget('), 'multi-target must reuse canonical target spawn');
assert(battleSource.includes('Math.Abs(candidateDistance - nearestDistance) <= 0.0001f && candidatePoolOrder < nearestPoolOrder'), 'equal-distance tie must use deterministic pool order');
assert(battleSource.includes('private int PoolOrderOf(U2EnemyActor enemy) => enemies.IndexOf(enemy);'), 'pool-order tie break missing');
assert(!battleSource.includes('GetInstanceID()'), 'runtime target ordering must not depend on GetInstanceID');
assert(battleSource.includes('(enemy.transform.position - player.position).sqrMagnitude'), 'distance must use squared distance from current player transform');
const start = battleSource.indexOf('public int FireGameplayProjectilesAtNearestTargets(');
const end = battleSource.indexOf('public bool TryGetNearestEnemyPosition', start);
assert(start >= 0 && end > start, 'cannot isolate multi-target block');
const block = battleSource.slice(start, end);
for (const forbidden of ['Enumerable.', '.OrderBy(', '.ThenBy(', '.ToList(', 'new List<', '.Sort(']) assert(!block.includes(forbidden), `multi-target hot path must avoid ${forbidden}`);
assert(coordinatorSource.includes('battle.FireGameplayProjectile(effect.damage * damageMultiplier, effect.pierce)'), 'live coordinator must remain nearest-target');
assert(!coordinatorSource.includes('FireGameplayProjectilesAtNearestTargets'), 'multi-target live caller must remain zero before first Selected16 vertical slice');
assert(evidenceSource.includes('PR169_PROJECTILE_RECOVERY_NORMALIZER'), 'U47 normalizer recovery marker missing');
assert(title1BaseWeaponRuntimeAdmissionSummary.unityAdmittedRuntimeCount === 0, 'unused multi-target primitive must not admit Selected16');
assert(title1BaseWeaponRuntimeAdmissionSummary.statusApplicationBlockedWeaponCount === 16, 'STATUS_APPLICATION remains shared blocker');
console.log(JSON.stringify({ status: 'PASS', deterministicNearestPrefix: true, equalDistanceTieBreak: 'pool-order', getInstanceIdDependency: false, liveCallers: 0 }, null, 2));
'''


def write_checker(path: str, content: str) -> None:
    Path(path).write_text(content)


def cleanup_control_plane() -> None:
    for name in [
        '.github/workflows/u2-projectile-status-hook-one-shot.yml',
        '.github/workflows/u2-targeted-projectile-one-shot.yml',
        '.github/workflows/u2-multitarget-projectile-one-shot.yml',
        '.github/workflows/u47-targeted-projectile-normalizer-one-shot.yml',
        '.github/workflows/u47-multitarget-normalizer-one-shot.yml',
        '.github/workflows/runtime-projectile-recovery-one-shot.yml',
        '.github/pr169-recovery-trigger',
        '.github/pr169-runtime-recovery.py',
    ]:
        Path(name).unlink(missing_ok=True)


changed = patch_battle()
changed = patch_evidence() or changed
write_checker('scripts/quality/check-unity-projectile-status-application-hook.ts', PROJECTILE_STATUS_CHECKER)
write_checker('scripts/quality/check-unity-targeted-projectile-primitive.ts', TARGETED_CHECKER)
write_checker('scripts/quality/check-unity-multitarget-projectile-primitive.ts', MULTITARGET_CHECKER)
cleanup_control_plane()
print('PR169 runtime recovery prepared; runtime_changed=', changed)
