using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    public readonly struct DreamAlarmPulseResult
    {
        public DreamAlarmPulseResult(bool fired, int targetCount, int statusAppliedCount, int statusBlockedCount)
        {
            Fired = fired;
            TargetCount = targetCount;
            StatusAppliedCount = statusAppliedCount;
            StatusBlockedCount = statusBlockedCount;
        }

        public bool Fired { get; }
        public int TargetCount { get; }
        public int StatusAppliedCount { get; }
        public int StatusBlockedCount { get; }
    }

    public sealed class DreamAlarmPrototypeTelemetry
    {
        public int BeginAttemptCount { get; private set; }
        public int BeginSuccessCount { get; private set; }
        public int TickCount { get; private set; }
        public int ReadyTransitionCount { get; private set; }
        public int FireAttemptCount { get; private set; }
        public int FireSuccessCount { get; private set; }
        public int TargetCount { get; private set; }
        public int StatusApplyAttemptCount { get; private set; }
        public int StatusAppliedCount { get; private set; }
        public int StatusBlockedByInternalCooldownCount { get; private set; }

        internal void RecordBegin(bool success)
        {
            BeginAttemptCount++;
            if (success) BeginSuccessCount++;
        }

        internal void RecordTick(U2DelayedTriggerTickResult result)
        {
            TickCount++;
            if (result.BecameReadyThisTick) ReadyTransitionCount++;
        }

        internal void RecordFire(bool success, int targetCount)
        {
            FireAttemptCount++;
            if (success) FireSuccessCount++;
            TargetCount += targetCount;
        }

        internal void RecordStatus(EnemyStatusApplyResult result)
        {
            StatusApplyAttemptCount++;
            if (result == EnemyStatusApplyResult.Applied) StatusAppliedCount++;
            else if (result == EnemyStatusApplyResult.BlockedByInternalCooldown) StatusBlockedByInternalCooldownCount++;
        }

        public void Reset()
        {
            BeginAttemptCount = 0;
            BeginSuccessCount = 0;
            TickCount = 0;
            ReadyTransitionCount = 0;
            FireAttemptCount = 0;
            FireSuccessCount = 0;
            TargetCount = 0;
            StatusApplyAttemptCount = 0;
            StatusAppliedCount = 0;
            StatusBlockedByInternalCooldownCount = 0;
        }
    }

    /// <summary>
    /// Selected16 prototype caller for dream_alarm / 夢の目覚まし.
    /// Tick only advances the reusable delay gate. The caller explicitly consumes Ready when it
    /// emits one bounded area pulse and applies typed DROWSY to targetable candidates inside the
    /// caller-supplied XY radius. No damage/default radius/delay lives here.
    /// </summary>
    public sealed class DreamAlarmPrototypeState
    {
        public const string WeaponId = "dream_alarm";
        public const string ContentStatusId = "DROWSY";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";
        public const string ApplicationOrder = "PLACE_WAIT_READY_EXPLICIT_CONSUME_AREA_DROWSY";

        private readonly U2DelayedTriggerState trigger = new();
        private Vector3 position;

        public Vector3 Position => position;
        public U2DelayedTriggerPhase Phase => trigger.Phase;
        public bool IsActive => trigger.IsActive;
        public bool IsReady => trigger.IsReady;

        public bool TryBegin(
            Vector3 placementPosition,
            float delaySeconds,
            DreamAlarmPrototypeTelemetry telemetry = null)
        {
            var began = IsFinite(placementPosition) && trigger.TryBegin(delaySeconds);
            telemetry?.RecordBegin(began);
            if (!began) return false;
            position = placementPosition;
            return true;
        }

        public bool TryTick(
            float deltaSeconds,
            out U2DelayedTriggerTickResult result,
            DreamAlarmPrototypeTelemetry telemetry = null)
        {
            if (!trigger.TryTick(deltaSeconds, out result)) return false;
            telemetry?.RecordTick(result);
            return true;
        }

        public bool TryFire(
            IReadOnlyList<U2EnemyActor> candidates,
            float pulseRadius,
            EnemyStatusApplicationPolicy drowsyPolicy,
            out DreamAlarmPulseResult result,
            DreamAlarmPrototypeTelemetry telemetry = null)
        {
            result = default;
            if (candidates == null || !IsFinitePositive(pulseRadius) || !trigger.IsReady)
            {
                telemetry?.RecordFire(false, 0);
                return false;
            }

            if (!trigger.TryConsume())
            {
                telemetry?.RecordFire(false, 0);
                return false;
            }

            Action<EnemyStatusApplyResult> observer = null;
            if (telemetry != null) observer = telemetry.RecordStatus;
            var request = new EnemyStatusApplicationRequest(EnemyStatusRuntimeKind.Drowsy, drowsyPolicy, observer);
            var radiusSquared = pulseRadius * pulseRadius;
            var targetCount = 0;
            var appliedCount = 0;
            var blockedCount = 0;

            for (var i = 0; i < candidates.Count; i++)
            {
                var target = candidates[i];
                if (target == null || !target.IsTargetable) continue;
                if (DistanceSquared2D(position, target.transform.position) > radiusSquared) continue;

                targetCount++;
                var applyResult = request.ApplyTo(target.Statuses);
                if (applyResult == EnemyStatusApplyResult.Applied) appliedCount++;
                else if (applyResult == EnemyStatusApplyResult.BlockedByInternalCooldown) blockedCount++;
            }

            result = new DreamAlarmPulseResult(true, targetCount, appliedCount, blockedCount);
            telemetry?.RecordFire(true, targetCount);
            return true;
        }

        public bool TryCancel() => trigger.TryCancel();

        public void Reset()
        {
            trigger.Reset();
            position = default;
        }

        private static float DistanceSquared2D(Vector3 left, Vector3 right)
        {
            var deltaX = right.x - left.x;
            var deltaY = right.y - left.y;
            return deltaX * deltaX + deltaY * deltaY;
        }

        private static bool IsFinite(Vector3 value)
            => float.IsFinite(value.x) && float.IsFinite(value.y) && float.IsFinite(value.z);

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;
    }
}
