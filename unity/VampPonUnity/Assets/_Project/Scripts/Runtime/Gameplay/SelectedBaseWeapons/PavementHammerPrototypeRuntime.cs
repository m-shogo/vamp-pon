using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    /// <summary>
    /// Caller-owned prototype telemetry for Pavement Hammer. This records observed
    /// execution outcomes only; it does not define balance or promotion policy.
    /// </summary>
    public sealed class PavementHammerPrototypeTelemetry
    {
        public int InvocationCount { get; private set; }
        public int RequestedTargetCapacityTotal { get; private set; }
        public int SelectedTargetCount { get; private set; }
        public int DamageAttemptCount { get; private set; }
        public int DefeatedTargetCount { get; private set; }
        public int StatusApplyAttemptCount { get; private set; }
        public int StatusAppliedCount { get; private set; }
        public int StatusBlockedByInternalCooldownCount { get; private set; }
        public int KnockbackAttemptCount { get; private set; }
        public int KnockbackAppliedCount { get; private set; }
        public int KnockbackRejectedCount { get; private set; }
        public int BreakStaggerAttemptCount { get; private set; }
        public int BreakStaggerAppliedCount { get; private set; }
        public int BreakStaggerRejectedCount { get; private set; }
        public int StaggerTriggeredCount { get; private set; }

        internal void RecordInvocation(int requestedTargetCapacity, int selectedTargets)
        {
            InvocationCount++;
            RequestedTargetCapacityTotal += Math.Max(0, requestedTargetCapacity);
            SelectedTargetCount += Math.Max(0, selectedTargets);
        }

        internal void RecordDamageResult(bool defeated)
        {
            DamageAttemptCount++;
            if (defeated) DefeatedTargetCount++;
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

        internal void RecordKnockbackResult(bool applied)
        {
            KnockbackAttemptCount++;
            if (applied) KnockbackAppliedCount++;
            else KnockbackRejectedCount++;
        }

        internal void RecordBreakStaggerResult(
            bool applied,
            U2EnemyBreakStaggerApplyResult result)
        {
            BreakStaggerAttemptCount++;
            if (!applied)
            {
                BreakStaggerRejectedCount++;
                return;
            }

            BreakStaggerAppliedCount++;
            if (result.StaggerTriggered) StaggerTriggeredCount++;
        }

        public void Reset()
        {
            InvocationCount = 0;
            RequestedTargetCapacityTotal = 0;
            SelectedTargetCount = 0;
            DamageAttemptCount = 0;
            DefeatedTargetCount = 0;
            StatusApplyAttemptCount = 0;
            StatusAppliedCount = 0;
            StatusBlockedByInternalCooldownCount = 0;
            KnockbackAttemptCount = 0;
            KnockbackAppliedCount = 0;
            KnockbackRejectedCount = 0;
            BreakStaggerAttemptCount = 0;
            BreakStaggerAppliedCount = 0;
            BreakStaggerRejectedCount = 0;
            StaggerTriggeredCount = 0;
        }
    }

    /// <summary>
    /// Selected16 prototype caller for pavement_hammer / 石畳の小槌.
    ///
    /// This is implementation-review evidence only and is not wired into live Stage1.
    /// Every range/damage/Status/knockback/break/stagger value is supplied by the caller.
    /// Application order is explicit: query -> damage -> surviving Status -> knockback -> break/stagger.
    /// </summary>
    public static class PavementHammerPrototypeRuntime
    {
        public const string WeaponId = "pavement_hammer";
        public const string ContentStatusId = "EXPOSED";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";
        public const string ApplicationOrder = "QUERY_DAMAGE_SURVIVING_STATUS_KNOCKBACK_BREAK_STAGGER";

        public static EnemyStatusApplicationRequest CreateExposedRequest(EnemyStatusApplicationPolicy policy)
            => new(EnemyStatusRuntimeKind.Exposed, policy);

        public static int Fire(
            IReadOnlyList<U2EnemyActor> candidates,
            List<U2EnemyActor> targetScratch,
            Vector3 origin,
            Vector2 forward,
            float innerRadius,
            float outerRadius,
            float halfAngleDegrees,
            int maxTargets,
            float damage,
            float damageFlashSeconds,
            float knockbackDistance,
            float breakAmount,
            float breakThreshold,
            float staggerDurationSeconds,
            EnemyStatusApplicationPolicy exposedPolicy)
            => Fire(
                candidates,
                targetScratch,
                origin,
                forward,
                innerRadius,
                outerRadius,
                halfAngleDegrees,
                maxTargets,
                damage,
                damageFlashSeconds,
                knockbackDistance,
                breakAmount,
                breakThreshold,
                staggerDurationSeconds,
                exposedPolicy,
                null);

        public static int Fire(
            IReadOnlyList<U2EnemyActor> candidates,
            List<U2EnemyActor> targetScratch,
            Vector3 origin,
            Vector2 forward,
            float innerRadius,
            float outerRadius,
            float halfAngleDegrees,
            int maxTargets,
            float damage,
            float damageFlashSeconds,
            float knockbackDistance,
            float breakAmount,
            float breakThreshold,
            float staggerDurationSeconds,
            EnemyStatusApplicationPolicy exposedPolicy,
            PavementHammerPrototypeTelemetry telemetry)
        {
            if (targetScratch == null)
            {
                return 0;
            }

            if (!IsFinitePositive(damage) ||
                !IsFiniteNonNegative(damageFlashSeconds) ||
                !IsFinitePositive(knockbackDistance) ||
                !IsFinitePositive(breakAmount) ||
                !IsFinitePositive(breakThreshold) ||
                !IsFinitePositive(staggerDurationSeconds))
            {
                targetScratch.Clear();
                return 0;
            }

            var selected = U2EnemySlamWaveQueryRuntime.SelectTargets(
                candidates,
                targetScratch,
                origin,
                forward,
                innerRadius,
                outerRadius,
                halfAngleDegrees,
                maxTargets);
            telemetry?.RecordInvocation(maxTargets, selected);
            if (selected <= 0)
            {
                return 0;
            }

            var statusRequest = CreateExposedRequest(exposedPolicy);
            for (var index = 0; index < targetScratch.Count; index++)
            {
                var target = targetScratch[index];
                var defeated = target.TakeDamage(damage, damageFlashSeconds);
                telemetry?.RecordDamageResult(defeated);
                if (defeated)
                {
                    continue;
                }

                var statusResult = statusRequest.ApplyTo(target.Statuses);
                telemetry?.RecordStatusResult(statusResult);

                var knockbackApplied = U2EnemyKnockbackRuntime.TryApplyFromPoint(
                    target,
                    origin,
                    knockbackDistance);
                telemetry?.RecordKnockbackResult(knockbackApplied);

                var breakApplied = U2EnemyBreakStaggerRuntime.TryApply(
                    target,
                    breakAmount,
                    breakThreshold,
                    staggerDurationSeconds,
                    out var breakResult);
                telemetry?.RecordBreakStaggerResult(breakApplied, breakResult);
            }

            return selected;
        }

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;

        private static bool IsFiniteNonNegative(float value)
            => float.IsFinite(value) && value >= 0f;
    }
}
