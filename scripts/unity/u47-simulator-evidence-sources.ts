export const u47SimulatorEvidenceSourceFiles = [
  'scripts/unity/u47-simulator-capture-catalog.ts',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Diagnostics/U47AiSimulatorSmokeBridge.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Stage1GameplayRuntimeCoordinator.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/U47GroundAreaActor.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/GameplayServices.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/State/RunGameplayState.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpDemoController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/U4/U4LevelUpOverlay.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/U46RuntimeShell.cs',
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Result/RunResultViewModelBuilder.cs',
] as const;

export function normalizeU47SimulatorEvidenceSource(file: string, source: Buffer): Buffer {
  let normalized = source.toString('utf8');
  if (file.endsWith('Stage1GameplayRuntimeCoordinator.cs')) normalized = normalized
      .replace('public bool ActivateKokuyou() { var activated = kokuyou.Activate(Run, runtimePaused); if (activated) U43RuntimeFeedbackBridge.Instance?.PlayKokuyou(); return activated; }','public bool ActivateKokuyou() => kokuyou.Activate(Run, runtimePaused);')
      .replace('public DamageOutcome ApplyPlayerDamage(float amount) { var before = Run.Kokuyou.Phase; var result = Damage.Apply(Run, amount, runtimePaused); if (result != DamageOutcome.Blocked) U43RuntimeFeedbackBridge.Instance?.PlayPlayerDamage(); if (before != KokuyouPhase.Ready && Run.Kokuyou.Phase == KokuyouPhase.Ready) U43RuntimeFeedbackBridge.Instance?.PlayKokuyouReady(); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); return result; }','public DamageOutcome ApplyPlayerDamage(float amount) { var result = Damage.Apply(Run, amount, runtimePaused); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); return result; }')
      .replace('var previousKokuyouPhase = Run.Kokuyou.Phase; kokuyou.Tick(Run, dt, false); if (previousKokuyouPhase == KokuyouPhase.Active && Run.Kokuyou.Phase == KokuyouPhase.Ending) U43RuntimeFeedbackBridge.Instance?.PlayKokuyouEnding(); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); TickWeapons(dt); TickAreas(dt);','kokuyou.Tick(Run, dt, false); statCalculator.Recalculate(Run, registry); ApplyPlayerStats(); TickWeapons(dt); TickAreas(dt);');
  // PR169_PROJECTILE_RECOVERY_NORMALIZER: reusable primitives only; live coordinator call-sites are never normalized.
  if (file.endsWith('U2BattleController.cs')) normalized = normalized
      .replace(`        private readonly List<U2EnemyActor> nearestEnemyTargetScratch = new(8);
`, '')
      .replace(`        public bool FireGameplayProjectile(float damage, int pierce)
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

`, `        public bool FireGameplayProjectile(float damage, int pierce)
        {
            var target = FindNearestEnemy();
            var projectile = FirstInactive(projectiles);
            if (target == null || projectile == null) return false;
            projectile.Activate(player.position, target, config.projectileSpeed, damage, pierce);
            feedbackBridge?.PlayWeaponFire(); FiredProjectileCount++; PlayerAttackFired?.Invoke(); return true;
        }

`)
      .replace(`                    var hitPosition = projectile.transform.position;
                    var hitTarget = projectile.Target;
                    var defeated = hitTarget.TakeDamage(projectile.Damage > 0f ? projectile.Damage : config.projectileDamage, config.damageFlashSeconds);
                    if (!defeated) projectile.ApplyStatusOnHit(hitTarget);
                    projectile.ConsumeHit();
                    feedbackBridge?.PlayEnemyHit();
`, `                    var hitPosition = projectile.transform.position;
                    var hitTarget = projectile.Target;
                    projectile.ConsumeHit();
                    var defeated = hitTarget.TakeDamage(projectile.Damage > 0f ? projectile.Damage : config.projectileDamage, config.damageFlashSeconds);
                    feedbackBridge?.PlayEnemyHit();
`)
      .replace(`        private Vector3 direction;
        private float speed;
        private float lifeSeconds;
        private EnemyStatusApplicationRequest? statusApplicationRequest;

        public U2EnemyActor Target { get; private set; }
        public float Damage { get; private set; }
        public int PierceRemaining { get; private set; }
        public bool HasStatusApplication => statusApplicationRequest.HasValue;
`, `        private Vector3 direction;
        private float speed;
        private float lifeSeconds;

        public U2EnemyActor Target { get; private set; }
        public float Damage { get; private set; }
        public int PierceRemaining { get; private set; }
`)
      .replace(`        public void Activate(Vector3 origin, U2EnemyActor target, float projectileSpeed, float damage, int pierce)
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

`, `        public void Activate(Vector3 origin, U2EnemyActor target, float projectileSpeed, float damage, int pierce)
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

`);
  if (file.endsWith('U2BattleController.cs')) normalized = normalized
      .replace('using VampPon.UnitySpike.Runtime.Gameplay.Status;\n', '')
      .replace('        private readonly EnemyStatusRuntimeState statusState = new();\n', '')
      .replace('        public EnemyStatusRuntimeState Statuses => statusState;\n        public int ActiveStatusCount => statusState.ActiveCount;\n', '')
      .replace('        public void Activate(Vector3 position, float maxHp)\n        {\n            statusState.Clear();\n            hp = maxHp;', '        public void Activate(Vector3 position, float maxHp)\n        {\n            hp = maxHp;')
      .replace('        public void Tick(Vector3 playerPosition, float speed, float deltaTime)\n        {\n            statusState.Tick(deltaTime);\n            if (dying)', '        public void Tick(Vector3 playerPosition, float speed, float deltaTime)\n        {\n            if (dying)')
      .replace('        public override void Deactivate()\n        {\n            statusState.Clear();\n            base.Deactivate();\n        }\n\n', '');
  if (file.endsWith('U46RuntimeShell.cs')) normalized = normalized.replace(`            if (result != null && state == AppFlowState.Result)
            {
                result.Show(flow.LastResult);
                U43RuntimeFeedbackBridge.Instance?.PlayResult();
                if (flow.LastResult?.rewardIds?.Count > 0) U43RuntimeFeedbackBridge.Instance?.PlayRewardCard();
                if (flow.LastResult?.newlyUnlockedIds?.Count > 0) U43RuntimeFeedbackBridge.Instance?.PlayUnlockReveal();
            }
            else if (result != null) result.gameObject.SetActive(false);`, '            if (result != null && state == AppFlowState.Result) result.Show(flow.LastResult); else if (result != null) result.gameObject.SetActive(false);');
  return Buffer.from(normalized, 'utf8');
}
