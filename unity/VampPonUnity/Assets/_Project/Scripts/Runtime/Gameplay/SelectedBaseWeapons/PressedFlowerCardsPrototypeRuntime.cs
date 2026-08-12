using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    public readonly struct PressedFlowerCardTriggerResult
    {
        public PressedFlowerCardTriggerResult(
            bool triggered,
            bool exhausted,
            int remainingTriggerBudget,
            EnemyStatusApplyResult? rootedResult)
        {
            Triggered = triggered;
            Exhausted = exhausted;
            RemainingTriggerBudget = remainingTriggerBudget;
            RootedResult = rootedResult;
        }

        public bool Triggered { get; }
        public bool Exhausted { get; }
        public int RemainingTriggerBudget { get; }
        public EnemyStatusApplyResult? RootedResult { get; }
    }

    public sealed class PressedFlowerCardsPrototypeTelemetry
    {
        public int BeginAttemptCount { get; private set; }
        public int BeginSuccessCount { get; private set; }
        public int TickCount { get; private set; }
        public int ArmedTransitionCount { get; private set; }
        public int ExpiredTransitionCount { get; private set; }
        public int TriggerAttemptCount { get; private set; }
        public int TriggerSuccessCount { get; private set; }
        public int TriggerRejectedCount { get; private set; }
        public int ExhaustedCount { get; private set; }
        public int RootedApplyAttemptCount { get; private set; }
        public int RootedAppliedCount { get; private set; }
        public int RootedBlockedByInternalCooldownCount { get; private set; }

        internal void RecordBegin(bool success)
        {
            BeginAttemptCount++;
            if (success) BeginSuccessCount++;
        }

        internal void RecordTick(U2PersistentTrapTickResult result)
        {
            TickCount++;
            if (result.ArmedThisTick) ArmedTransitionCount++;
            if (result.ExpiredThisTick) ExpiredTransitionCount++;
        }

        internal void RecordRejectedTrigger()
        {
            TriggerAttemptCount++;
            TriggerRejectedCount++;
        }

        internal void RecordTrigger(bool exhausted, EnemyStatusApplyResult rootedResult)
        {
            TriggerAttemptCount++;
            TriggerSuccessCount++;
            if (exhausted) ExhaustedCount++;
            RootedApplyAttemptCount++;
            if (rootedResult == EnemyStatusApplyResult.Applied) RootedAppliedCount++;
            else if (rootedResult == EnemyStatusApplyResult.BlockedByInternalCooldown) RootedBlockedByInternalCooldownCount++;
        }

        public void Reset()
        {
            BeginAttemptCount = 0;
            BeginSuccessCount = 0;
            TickCount = 0;
            ArmedTransitionCount = 0;
            ExpiredTransitionCount = 0;
            TriggerAttemptCount = 0;
            TriggerSuccessCount = 0;
            TriggerRejectedCount = 0;
            ExhaustedCount = 0;
            RootedApplyAttemptCount = 0;
            RootedAppliedCount = 0;
            RootedBlockedByInternalCooldownCount = 0;
        }
    }

    /// <summary>
    /// One placed Pressed Flower Card prototype instance. A multi-card weapon may own several of
    /// these instances; this caller deliberately does not define pool size, placement cadence or
    /// Canon counts. Persistent lifetime/budget live in U2PersistentTrapState while ROOTED and
    /// overlap policy remain caller-owned.
    /// </summary>
    public sealed class PressedFlowerCardsPrototypeState
    {
        public const string WeaponId = "pressed_flower_cards";
        public const string ContentStatusId = "ROOTED";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";
        public const string ApplicationOrder = "PLACE_ARM_WAIT_TARGET_ENTER_CONSUME_TRIGGER_THEN_TYPED_ROOTED";

        private readonly U2PersistentTrapState trap = new();
        private readonly HashSet<U2EnemyActor> triggeredTargets = new();

        public Vector3 Position => trap.Position;
        public U2PersistentTrapPhase Phase => trap.Phase;
        public bool IsActive => trap.IsActive;
        public bool IsArmed => trap.IsArmed;
        public int RemainingTriggerBudget => trap.RemainingTriggerBudget;
        public int UniqueTriggeredTargetCount => triggeredTargets.Count;

        public bool TryBegin(
            Vector3 position,
            float armingDelaySeconds,
            float activeDurationSeconds,
            int triggerBudget,
            PressedFlowerCardsPrototypeTelemetry telemetry = null)
        {
            var began = trap.TryBegin(position, armingDelaySeconds, activeDurationSeconds, triggerBudget);
            telemetry?.RecordBegin(began);
            if (!began) return false;
            triggeredTargets.Clear();
            return true;
        }

        public bool TryTick(
            float deltaSeconds,
            out U2PersistentTrapTickResult result,
            PressedFlowerCardsPrototypeTelemetry telemetry = null)
        {
            if (!trap.TryTick(deltaSeconds, out result)) return false;
            telemetry?.RecordTick(result);
            return true;
        }

        public bool TryTrigger(
            U2EnemyActor target,
            float triggerRadius,
            EnemyStatusApplicationPolicy rootedPolicy,
            out PressedFlowerCardTriggerResult result,
            PressedFlowerCardsPrototypeTelemetry telemetry = null)
        {
            result = default;
            if (!trap.IsArmed ||
                target == null ||
                !target.IsTargetable ||
                !IsFinitePositive(triggerRadius) ||
                triggeredTargets.Contains(target) ||
                DistanceSquared2D(trap.Position, target.transform.position) > triggerRadius * triggerRadius)
            {
                telemetry?.RecordRejectedTrigger();
                return false;
            }

            if (!trap.TryConsumeTrigger(out var remainingBudget))
            {
                telemetry?.RecordRejectedTrigger();
                return false;
            }

            triggeredTargets.Add(target);
            var rootedRequest = new EnemyStatusApplicationRequest(
                EnemyStatusRuntimeKind.Rooted,
                rootedPolicy);
            var rootedResult = rootedRequest.ApplyTo(target.Statuses);
            var exhausted = trap.Phase == U2PersistentTrapPhase.Exhausted;
            result = new PressedFlowerCardTriggerResult(true, exhausted, remainingBudget, rootedResult);
            telemetry?.RecordTrigger(exhausted, rootedResult);
            return true;
        }

        public void Reset()
        {
            trap.Reset();
            triggeredTargets.Clear();
        }

        private static float DistanceSquared2D(Vector3 left, Vector3 right)
        {
            var deltaX = right.x - left.x;
            var deltaY = right.y - left.y;
            return deltaX * deltaX + deltaY * deltaY;
        }

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;
    }
}
