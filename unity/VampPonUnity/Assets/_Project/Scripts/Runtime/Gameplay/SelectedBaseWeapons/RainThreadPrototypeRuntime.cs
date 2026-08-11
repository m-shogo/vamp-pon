using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    public enum RainThreadLinkEndReason
    {
        None,
        Expired,
        EndpointLost,
        BrokeByDistance,
    }

    public readonly struct RainThreadTickResult
    {
        public RainThreadTickResult(
            bool activeAfterTick,
            bool pullApplied,
            float pairDistanceBeforePull,
            float pullDistancePerEndpoint,
            RainThreadLinkEndReason endReason)
        {
            ActiveAfterTick = activeAfterTick;
            PullApplied = pullApplied;
            PairDistanceBeforePull = pairDistanceBeforePull;
            PullDistancePerEndpoint = pullDistancePerEndpoint;
            EndReason = endReason;
        }

        public bool ActiveAfterTick { get; }
        public bool PullApplied { get; }
        public float PairDistanceBeforePull { get; }
        public float PullDistancePerEndpoint { get; }
        public RainThreadLinkEndReason EndReason { get; }
    }

    public sealed class RainThreadPrototypeTelemetry
    {
        public int BeginAttemptCount { get; private set; }
        public int BeginSuccessCount { get; private set; }
        public int TickCount { get; private set; }
        public int PullTickCount { get; private set; }
        public int StatusApplyAttemptCount { get; private set; }
        public int StatusAppliedCount { get; private set; }
        public int StatusBlockedByInternalCooldownCount { get; private set; }
        public int ExpiredCount { get; private set; }
        public int EndpointLostCount { get; private set; }
        public int DistanceBreakCount { get; private set; }
        public float LastCombinedPriorityScore { get; private set; }
        public float LastPairDistanceSquared { get; private set; }

        internal void RecordBeginAttempt() => BeginAttemptCount++;

        internal void RecordBeginSuccess(U2EnemyTetherPairSelectionResult selection)
        {
            BeginSuccessCount++;
            LastCombinedPriorityScore = selection.CombinedPriorityScore;
            LastPairDistanceSquared = selection.PairDistanceSquared;
        }

        internal void RecordStatusResult(EnemyStatusApplyResult result)
        {
            StatusApplyAttemptCount++;
            if (result == EnemyStatusApplyResult.Applied) StatusAppliedCount++;
            else if (result == EnemyStatusApplyResult.BlockedByInternalCooldown) StatusBlockedByInternalCooldownCount++;
        }

        internal void RecordTick(bool pulled, RainThreadLinkEndReason endReason)
        {
            TickCount++;
            if (pulled) PullTickCount++;
            if (endReason == RainThreadLinkEndReason.Expired) ExpiredCount++;
            else if (endReason == RainThreadLinkEndReason.EndpointLost) EndpointLostCount++;
            else if (endReason == RainThreadLinkEndReason.BrokeByDistance) DistanceBreakCount++;
        }

        public void Reset()
        {
            BeginAttemptCount = 0;
            BeginSuccessCount = 0;
            TickCount = 0;
            PullTickCount = 0;
            StatusApplyAttemptCount = 0;
            StatusAppliedCount = 0;
            StatusBlockedByInternalCooldownCount = 0;
            ExpiredCount = 0;
            EndpointLostCount = 0;
            DistanceBreakCount = 0;
            LastCombinedPriorityScore = 0f;
            LastPairDistanceSquared = 0f;
        }
    }

    public sealed class RainThreadPrototypeState
    {
        public const string WeaponId = "rain_thread";
        public const string ContentStatusId = "SOAK";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";
        public const string ApplicationOrder = "SELECT_PAIR_SOAK_BOTH_THEN_CALLER_OWNED_PULL_TICKS";

        private U2EnemyActor first;
        private U2EnemyActor second;
        private float remainingSeconds;

        public U2EnemyActor First => first;
        public U2EnemyActor Second => second;
        public float RemainingSeconds => remainingSeconds;
        public bool IsActive => first != null && second != null && remainingSeconds > 0f;

        public bool TryBegin(
            IReadOnlyList<U2EnemyActor> candidates,
            IReadOnlyList<float> priorityScores,
            Vector3 origin,
            float minOriginRange,
            float maxOriginRange,
            float minPairDistance,
            float maxPairDistance,
            float linkDurationSeconds,
            EnemyStatusApplicationPolicy soakPolicy,
            out U2EnemyTetherPairSelectionResult selection,
            RainThreadPrototypeTelemetry telemetry = null)
        {
            selection = default;
            telemetry?.RecordBeginAttempt();
            if (IsActive || !IsFinitePositive(linkDurationSeconds)) return false;

            if (!U2EnemyTetherPairSelectionRuntime.TrySelectPair(
                candidates,
                priorityScores,
                origin,
                minOriginRange,
                maxOriginRange,
                minPairDistance,
                maxPairDistance,
                out selection))
            {
                return false;
            }

            Reset();
            first = selection.First;
            second = selection.Second;
            remainingSeconds = linkDurationSeconds;

            var soakRequest = CreateSoakRequest(soakPolicy, telemetry);
            soakRequest.ApplyTo(first.Statuses);
            soakRequest.ApplyTo(second.Statuses);
            telemetry?.RecordBeginSuccess(selection);
            return true;
        }

        public bool TryTick(
            float deltaSeconds,
            float tensionStartDistance,
            float pullDistancePerSecond,
            float maxLinkDistance,
            out RainThreadTickResult result,
            RainThreadPrototypeTelemetry telemetry = null)
        {
            result = default;
            if (!IsActive ||
                !IsFinitePositive(deltaSeconds) ||
                !IsFiniteNonNegative(tensionStartDistance) ||
                !IsFiniteNonNegative(pullDistancePerSecond) ||
                !IsFinitePositive(maxLinkDistance) ||
                tensionStartDistance > maxLinkDistance)
            {
                return false;
            }

            if (!first.IsTargetable || !second.IsTargetable)
            {
                End(RainThreadLinkEndReason.EndpointLost, false, 0f, 0f, out result, telemetry);
                return true;
            }

            var firstPosition = first.transform.position;
            var secondPosition = second.transform.position;
            var deltaX = secondPosition.x - firstPosition.x;
            var deltaY = secondPosition.y - firstPosition.y;
            var pairDistanceSquared = deltaX * deltaX + deltaY * deltaY;
            if (!float.IsFinite(pairDistanceSquared)) return false;
            var pairDistance = (float)Math.Sqrt(pairDistanceSquared);

            if (pairDistance > maxLinkDistance)
            {
                End(RainThreadLinkEndReason.BrokeByDistance, false, pairDistance, 0f, out result, telemetry);
                return true;
            }

            var effectiveDelta = Math.Min(deltaSeconds, remainingSeconds);
            var pullDistance = 0f;
            var pulled = false;
            if (pairDistance > tensionStartDistance && pullDistancePerSecond > 0f && pairDistance > 0.000001f)
            {
                var maxPerEndpointWithoutCrossing = Math.Max(0f, (pairDistance - tensionStartDistance) * 0.5f);
                pullDistance = Math.Min(pullDistancePerSecond * effectiveDelta, maxPerEndpointWithoutCrossing);
                if (pullDistance > 0f)
                {
                    var firstDirection = new Vector2(deltaX, deltaY);
                    var secondDirection = new Vector2(-deltaX, -deltaY);
                    var firstPulled = U2EnemyKnockbackRuntime.TryApply(first, firstDirection, pullDistance);
                    var secondPulled = U2EnemyKnockbackRuntime.TryApply(second, secondDirection, pullDistance);
                    pulled = firstPulled && secondPulled;
                }
            }

            remainingSeconds = Math.Max(0f, remainingSeconds - deltaSeconds);
            if (remainingSeconds <= 0f)
            {
                End(RainThreadLinkEndReason.Expired, pulled, pairDistance, pullDistance, out result, telemetry);
                return true;
            }

            result = new RainThreadTickResult(true, pulled, pairDistance, pullDistance, RainThreadLinkEndReason.None);
            telemetry?.RecordTick(pulled, RainThreadLinkEndReason.None);
            return true;
        }

        public void Reset()
        {
            first = null;
            second = null;
            remainingSeconds = 0f;
        }

        private static EnemyStatusApplicationRequest CreateSoakRequest(
            EnemyStatusApplicationPolicy soakPolicy,
            RainThreadPrototypeTelemetry telemetry)
        {
            Action<EnemyStatusApplyResult> observer = null;
            if (telemetry != null) observer = telemetry.RecordStatusResult;
            return new EnemyStatusApplicationRequest(EnemyStatusRuntimeKind.Soak, soakPolicy, observer);
        }

        private void End(
            RainThreadLinkEndReason reason,
            bool pulled,
            float pairDistance,
            float pullDistance,
            out RainThreadTickResult result,
            RainThreadPrototypeTelemetry telemetry)
        {
            result = new RainThreadTickResult(false, pulled, pairDistance, pullDistance, reason);
            telemetry?.RecordTick(pulled, reason);
            Reset();
        }

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;

        private static bool IsFiniteNonNegative(float value)
            => float.IsFinite(value) && value >= 0f;
    }
}
