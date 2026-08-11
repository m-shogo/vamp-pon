using System;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    /// <summary>
    /// Mutable prototype-only telemetry sink. It records execution facts, never balance defaults.
    /// The sink is caller-owned so live runtime does not gain a global/static telemetry lifetime.
    /// </summary>
    public sealed class EmberMatchcasePrototypeTelemetry
    {
        public int InvocationCount { get; private set; }
        public int RequestedTargetCapacityTotal { get; private set; }
        public int FiredProjectileCount { get; private set; }
        public int StatusApplyAttemptCount { get; private set; }
        public int StatusAppliedCount { get; private set; }
        public int StatusBlockedByInternalCooldownCount { get; private set; }

        internal void RecordInvocation(int requestedTargetCapacity, int firedProjectiles)
        {
            InvocationCount++;
            RequestedTargetCapacityTotal += Math.Max(0, requestedTargetCapacity);
            FiredProjectileCount += Math.Max(0, firedProjectiles);
        }

        internal void RecordStatusResult(EnemyStatusApplyResult result)
        {
            StatusApplyAttemptCount++;
            if (result == EnemyStatusApplyResult.Applied)
            {
                StatusAppliedCount++;
            }
            else if (result == EnemyStatusApplyResult.BlockedByInternalCooldown)
            {
                StatusBlockedByInternalCooldownCount++;
            }
        }

        public void Reset()
        {
            InvocationCount = 0;
            RequestedTargetCapacityTotal = 0;
            FiredProjectileCount = 0;
            StatusApplyAttemptCount = 0;
            StatusAppliedCount = 0;
            StatusBlockedByInternalCooldownCount = 0;
        }
    }

    /// <summary>
    /// First Selected16-specific Unity caller.
    ///
    /// This is an admission/prototype boundary, not a live registry entry. Damage, pierce,
    /// target count and every BURN tuning value are supplied by the caller so this class
    /// cannot accidentally freeze prototype balance as Canon.
    /// </summary>
    public static class EmberMatchcasePrototypeRuntime
    {
        public const string WeaponId = "ember_matchcase";
        public const string ContentStatusId = "BURN";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeStatus = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";

        public static EnemyStatusApplicationRequest CreateBurnRequest(
            EnemyStatusApplicationPolicy burnPolicy)
            => CreateBurnRequest(burnPolicy, null);

        public static EnemyStatusApplicationRequest CreateBurnRequest(
            EnemyStatusApplicationPolicy burnPolicy,
            EmberMatchcasePrototypeTelemetry telemetry)
        {
            Action<EnemyStatusApplyResult> resultObserver = null;
            if (telemetry != null)
            {
                resultObserver = telemetry.RecordStatusResult;
            }

            return new EnemyStatusApplicationRequest(
                EnemyStatusRuntimeKind.Burn,
                burnPolicy,
                resultObserver);
        }

        public static int Fire(
            U2BattleController battle,
            float damage,
            int pierce,
            int maxTargets,
            EnemyStatusApplicationPolicy burnPolicy)
            => Fire(battle, damage, pierce, maxTargets, burnPolicy, null);

        public static int Fire(
            U2BattleController battle,
            float damage,
            int pierce,
            int maxTargets,
            EnemyStatusApplicationPolicy burnPolicy,
            EmberMatchcasePrototypeTelemetry telemetry)
        {
            if (battle == null) throw new ArgumentNullException(nameof(battle));
            if (maxTargets <= 0) return 0;

            var fired = battle.FireGameplayProjectilesAtNearestTargets(
                damage,
                pierce,
                maxTargets,
                CreateBurnRequest(burnPolicy, telemetry));
            telemetry?.RecordInvocation(maxTargets, fired);
            return fired;
        }
    }
}
