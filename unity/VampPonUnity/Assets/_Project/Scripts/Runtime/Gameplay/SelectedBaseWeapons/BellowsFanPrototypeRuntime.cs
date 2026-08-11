using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    /// <summary>
    /// Caller-owned, prototype-only execution telemetry for Bellows Fan.
    /// It records observed runtime outcomes and owns no balance defaults.
    /// </summary>
    public sealed class BellowsFanPrototypeTelemetry
    {
        public int InvocationCount { get; private set; }
        public int RequestedTargetCapacityTotal { get; private set; }
        public int SelectedTargetCount { get; private set; }
        public int StatusApplyAttemptCount { get; private set; }
        public int StatusAppliedCount { get; private set; }
        public int StatusBlockedByInternalCooldownCount { get; private set; }
        public int KnockbackAttemptCount { get; private set; }
        public int KnockbackAppliedCount { get; private set; }
        public int KnockbackRejectedCount { get; private set; }

        internal void RecordInvocation(int requestedTargetCapacity, int selectedTargets)
        {
            InvocationCount++;
            RequestedTargetCapacityTotal += Math.Max(0, requestedTargetCapacity);
            SelectedTargetCount += Math.Max(0, selectedTargets);
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
            if (applied)
            {
                KnockbackAppliedCount++;
            }
            else
            {
                KnockbackRejectedCount++;
            }
        }

        public void Reset()
        {
            InvocationCount = 0;
            RequestedTargetCapacityTotal = 0;
            SelectedTargetCount = 0;
            StatusApplyAttemptCount = 0;
            StatusAppliedCount = 0;
            StatusBlockedByInternalCooldownCount = 0;
            KnockbackAttemptCount = 0;
            KnockbackAppliedCount = 0;
            KnockbackRejectedCount = 0;
        }
    }

    /// <summary>
    /// Selected16 prototype caller for 送り風の扇 / bellows_fan.
    ///
    /// This is implementation-review evidence only. It is intentionally not wired into
    /// Stage1GameplayRuntimeCoordinator or the live weapon registry.
    /// All cone, knockback, and Status tuning remains caller supplied.
    /// </summary>
    public static class BellowsFanPrototypeRuntime
    {
        public const string WeaponId = "bellows_fan";
        public const string ContentStatusId = "DISORIENTED";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";

        public static EnemyStatusApplicationRequest CreateDisorientedRequest(EnemyStatusApplicationPolicy policy)
            => new(EnemyStatusRuntimeKind.Disoriented, policy);

        public static int Fire(
            IReadOnlyList<U2EnemyActor> candidates,
            List<U2EnemyActor> targetScratch,
            Vector3 origin,
            Vector2 forward,
            float range,
            float halfAngleDegrees,
            int maxTargets,
            float knockbackDistance,
            EnemyStatusApplicationPolicy disorientedPolicy)
            => Fire(
                candidates,
                targetScratch,
                origin,
                forward,
                range,
                halfAngleDegrees,
                maxTargets,
                knockbackDistance,
                disorientedPolicy,
                null);

        public static int Fire(
            IReadOnlyList<U2EnemyActor> candidates,
            List<U2EnemyActor> targetScratch,
            Vector3 origin,
            Vector2 forward,
            float range,
            float halfAngleDegrees,
            int maxTargets,
            float knockbackDistance,
            EnemyStatusApplicationPolicy disorientedPolicy,
            BellowsFanPrototypeTelemetry telemetry)
        {
            if (targetScratch == null)
            {
                return 0;
            }

            if (maxTargets <= 0 || range <= 0f || knockbackDistance <= 0f)
            {
                targetScratch.Clear();
                return 0;
            }

            var selected = U2EnemyConeQueryRuntime.SelectTargets(
                candidates,
                targetScratch,
                origin,
                forward,
                range,
                halfAngleDegrees,
                maxTargets);
            telemetry?.RecordInvocation(maxTargets, selected);
            if (selected <= 0)
            {
                return 0;
            }

            var statusRequest = CreateDisorientedRequest(disorientedPolicy);
            for (var index = 0; index < targetScratch.Count; index++)
            {
                var target = targetScratch[index];
                var statusResult = statusRequest.ApplyTo(target.Statuses);
                telemetry?.RecordStatusResult(statusResult);

                var delta = target.transform.position - origin;
                var knockbackApplied = U2EnemyKnockbackRuntime.TryApply(
                    target,
                    new Vector2(delta.x, delta.y),
                    knockbackDistance);
                telemetry?.RecordKnockbackResult(knockbackApplied);
            }

            return selected;
        }
    }
}
