using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    public sealed class ReturnCompassNeedlePrototypeTelemetry
    {
        public int BeginAttemptCount { get; private set; }
        public int BeginSuccessCount { get; private set; }
        public int ReturnWaypointSelectedCount { get; private set; }
        public int MarkedPreferredWaypointCount { get; private set; }
        public int WaypointLostCount { get; private set; }
        public int StepCount { get; private set; }
        public int TurnaroundCount { get; private set; }
        public int WaypointReachedCount { get; private set; }
        public int CompleteCount { get; private set; }
        public int OutboundHitCount { get; private set; }
        public int ReturnHitCount { get; private set; }
        public int DefeatedCount { get; private set; }
        public int StatusApplyAttemptCount { get; private set; }
        public int StatusAppliedCount { get; private set; }
        public int StatusBlockedByInternalCooldownCount { get; private set; }
        public int LastSelectedCandidateIndex { get; private set; } = -1;
        public float LastSelectedPriorityScore { get; private set; }
        public float LastSelectedDistanceSquared { get; private set; }

        internal void RecordBeginAttempt() => BeginAttemptCount++;

        internal void RecordBeginSuccess(
            bool waypointSelected,
            bool selectedWasMarked,
            U2EnemyPrioritySelectionResult selection)
        {
            BeginSuccessCount++;
            if (!waypointSelected) return;
            ReturnWaypointSelectedCount++;
            if (selectedWasMarked) MarkedPreferredWaypointCount++;
            LastSelectedCandidateIndex = selection.CandidateIndex;
            LastSelectedPriorityScore = selection.PriorityScore;
            LastSelectedDistanceSquared = selection.DistanceSquared;
        }

        internal void RecordWaypointLost() => WaypointLostCount++;

        internal void RecordStep(U2ReturningWaypointStepResult result)
        {
            StepCount++;
            if (result.TurnedAround) TurnaroundCount++;
            if (result.WaypointReached) WaypointReachedCount++;
            if (result.Completed) CompleteCount++;
        }

        internal void RecordHit(U2ReturningWaypointPhase phase, bool defeated)
        {
            if (phase == U2ReturningWaypointPhase.Outbound) OutboundHitCount++;
            else ReturnHitCount++;
            if (defeated) DefeatedCount++;
        }

        internal void RecordStatusResult(EnemyStatusApplyResult result)
        {
            StatusApplyAttemptCount++;
            if (result == EnemyStatusApplyResult.Applied) StatusAppliedCount++;
            else if (result == EnemyStatusApplyResult.BlockedByInternalCooldown) StatusBlockedByInternalCooldownCount++;
        }

        public void Reset()
        {
            BeginAttemptCount = 0;
            BeginSuccessCount = 0;
            ReturnWaypointSelectedCount = 0;
            MarkedPreferredWaypointCount = 0;
            WaypointLostCount = 0;
            StepCount = 0;
            TurnaroundCount = 0;
            WaypointReachedCount = 0;
            CompleteCount = 0;
            OutboundHitCount = 0;
            ReturnHitCount = 0;
            DefeatedCount = 0;
            StatusApplyAttemptCount = 0;
            StatusAppliedCount = 0;
            StatusBlockedByInternalCooldownCount = 0;
            LastSelectedCandidateIndex = -1;
            LastSelectedPriorityScore = 0f;
            LastSelectedDistanceSquared = 0f;
        }
    }

    /// <summary>
    /// Selected16 prototype caller for return_compass_needle / 帰針.
    /// Outbound is a straight line; return may bend once through a priority-selected waypoint,
    /// with currently MARKED candidates receiving only a caller-supplied bonus.
    /// </summary>
    public sealed class ReturnCompassNeedlePrototypeState
    {
        public const string WeaponId = "return_compass_needle";
        public const string ContentStatusId = "MARKED";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";
        public const string ApplicationOrder = "OUTBOUND_LINE_THEN_MARKED_PRIORITY_RETURN_WAYPOINT_THEN_OWNER";
        public const string HitPolicy = "ONE_HIT_PER_TARGET_PER_LEG_OUTBOUND_AND_RETURN_SEPARATE";

        private readonly U2ReturningWaypointMotionState motion = new();
        private readonly HashSet<U2EnemyActor> outboundHits = new();
        private readonly HashSet<U2EnemyActor> returnHits = new();
        private readonly List<float> returnPriorityScratch = new();
        private Vector3 position;
        private Vector3 outboundTargetPosition;
        private U2EnemyActor returnWaypointTarget;

        public Vector3 Position => position;
        public U2ReturningWaypointPhase Phase => motion.Phase;
        public bool IsActive => motion.IsActive;
        public bool IsComplete => motion.IsComplete;
        public U2EnemyActor ReturnWaypointTarget => returnWaypointTarget;
        public int OutboundUniqueHitCount => outboundHits.Count;
        public int ReturnUniqueHitCount => returnHits.Count;

        public bool TryBegin(
            Vector3 spawnPosition,
            U2EnemyActor outboundTarget,
            IReadOnlyList<U2EnemyActor> returnCandidates,
            IReadOnlyList<float> baseReturnPriorityScores,
            float minReturnRange,
            float maxReturnRange,
            float markedPriorityBonus,
            U2EnemyPriorityDistanceTieBreak tieBreak,
            out U2EnemyPrioritySelectionResult returnSelection,
            ReturnCompassNeedlePrototypeTelemetry telemetry = null)
        {
            returnSelection = default;
            telemetry?.RecordBeginAttempt();
            if (IsActive ||
                outboundTarget == null ||
                !outboundTarget.IsTargetable ||
                returnCandidates == null ||
                baseReturnPriorityScores == null ||
                returnCandidates.Count != baseReturnPriorityScores.Count ||
                !IsFinite(spawnPosition) ||
                !IsFiniteNonNegative(markedPriorityBonus))
            {
                return false;
            }

            returnPriorityScratch.Clear();
            for (var i = 0; i < returnCandidates.Count; i++)
            {
                var candidate = returnCandidates[i];
                var baseScore = baseReturnPriorityScores[i];
                if (!float.IsFinite(baseScore) || candidate == null || ReferenceEquals(candidate, outboundTarget))
                {
                    returnPriorityScratch.Add(float.NaN);
                    continue;
                }

                var score = baseScore;
                if (candidate.IsTargetable && candidate.Statuses.Has(EnemyStatusRuntimeKind.Marked))
                {
                    score += markedPriorityBonus;
                }
                returnPriorityScratch.Add(float.IsFinite(score) ? score : float.NaN);
            }

            var selectedWaypoint = U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                returnCandidates,
                returnPriorityScratch,
                spawnPosition,
                minReturnRange,
                maxReturnRange,
                tieBreak,
                out returnSelection);

            Reset();
            outboundTargetPosition = outboundTarget.transform.position;
            returnWaypointTarget = selectedWaypoint ? returnSelection.Target : null;
            if (!motion.TryBegin(outboundTargetPosition, selectedWaypoint))
            {
                Reset();
                return false;
            }
            position = spawnPosition;

            var selectedWasMarked = selectedWaypoint && returnWaypointTarget.Statuses.Has(EnemyStatusRuntimeKind.Marked);
            telemetry?.RecordBeginSuccess(selectedWaypoint, selectedWasMarked, returnSelection);
            return true;
        }

        public bool TryStep(
            Vector3 finalReturnAnchor,
            float speed,
            float deltaSeconds,
            float arrivalDistance,
            IReadOnlyList<U2EnemyActor> hitCandidates,
            float hitRadius,
            float damage,
            float damageFlashSeconds,
            EnemyStatusApplicationPolicy markedPolicy,
            out U2ReturningWaypointStepResult stepResult,
            ReturnCompassNeedlePrototypeTelemetry telemetry = null)
        {
            stepResult = default;
            if (hitCandidates == null ||
                !IsFinite(finalReturnAnchor) ||
                !IsFinitePositive(hitRadius) ||
                !IsFinitePositive(damage) ||
                !IsFiniteNonNegative(damageFlashSeconds))
            {
                return false;
            }

            if (returnWaypointTarget != null && !returnWaypointTarget.IsTargetable && motion.UsesReturnWaypoint)
            {
                if (motion.SkipReturnWaypoint()) telemetry?.RecordWaypointLost();
                returnWaypointTarget = null;
            }

            var previousPosition = position;
            var previousPhase = motion.Phase;
            var waypointSnapshot = returnWaypointTarget != null
                ? returnWaypointTarget.transform.position
                : finalReturnAnchor;

            if (!motion.TryStep(
                previousPosition,
                waypointSnapshot,
                finalReturnAnchor,
                speed,
                deltaSeconds,
                arrivalDistance,
                out stepResult))
            {
                return false;
            }

            var markedRequest = CreateMarkedRequest(markedPolicy, telemetry);
            ProcessStepSegments(
                previousPosition,
                previousPhase,
                waypointSnapshot,
                stepResult,
                hitCandidates,
                hitRadius,
                damage,
                damageFlashSeconds,
                markedRequest,
                telemetry);

            position = stepResult.Position;
            if (stepResult.WaypointReached) returnWaypointTarget = null;
            telemetry?.RecordStep(stepResult);
            return true;
        }

        public void Reset()
        {
            motion.Reset();
            outboundHits.Clear();
            returnHits.Clear();
            returnPriorityScratch.Clear();
            position = default;
            outboundTargetPosition = default;
            returnWaypointTarget = null;
        }

        private void ProcessStepSegments(
            Vector3 previousPosition,
            U2ReturningWaypointPhase previousPhase,
            Vector3 waypointSnapshot,
            U2ReturningWaypointStepResult stepResult,
            IReadOnlyList<U2EnemyActor> candidates,
            float hitRadius,
            float damage,
            float damageFlashSeconds,
            EnemyStatusApplicationRequest markedRequest,
            ReturnCompassNeedlePrototypeTelemetry telemetry)
        {
            if (previousPhase == U2ReturningWaypointPhase.Outbound)
            {
                if (!stepResult.TurnedAround)
                {
                    ProcessSegment(previousPosition, stepResult.Position, U2ReturningWaypointPhase.Outbound, candidates, outboundHits, hitRadius, damage, damageFlashSeconds, markedRequest, telemetry);
                    return;
                }

                ProcessSegment(previousPosition, outboundTargetPosition, U2ReturningWaypointPhase.Outbound, candidates, outboundHits, hitRadius, damage, damageFlashSeconds, markedRequest, telemetry);
                if (stepResult.WaypointReached)
                {
                    ProcessSegment(outboundTargetPosition, waypointSnapshot, U2ReturningWaypointPhase.ReturningViaWaypoint, candidates, returnHits, hitRadius, damage, damageFlashSeconds, markedRequest, telemetry);
                    ProcessSegment(waypointSnapshot, stepResult.Position, U2ReturningWaypointPhase.ReturningToAnchor, candidates, returnHits, hitRadius, damage, damageFlashSeconds, markedRequest, telemetry);
                }
                else
                {
                    ProcessSegment(outboundTargetPosition, stepResult.Position, stepResult.Phase, candidates, returnHits, hitRadius, damage, damageFlashSeconds, markedRequest, telemetry);
                }
                return;
            }

            if (previousPhase == U2ReturningWaypointPhase.ReturningViaWaypoint && stepResult.WaypointReached)
            {
                ProcessSegment(previousPosition, waypointSnapshot, U2ReturningWaypointPhase.ReturningViaWaypoint, candidates, returnHits, hitRadius, damage, damageFlashSeconds, markedRequest, telemetry);
                ProcessSegment(waypointSnapshot, stepResult.Position, U2ReturningWaypointPhase.ReturningToAnchor, candidates, returnHits, hitRadius, damage, damageFlashSeconds, markedRequest, telemetry);
                return;
            }

            ProcessSegment(previousPosition, stepResult.Position, previousPhase, candidates, returnHits, hitRadius, damage, damageFlashSeconds, markedRequest, telemetry);
        }

        private static EnemyStatusApplicationRequest CreateMarkedRequest(
            EnemyStatusApplicationPolicy markedPolicy,
            ReturnCompassNeedlePrototypeTelemetry telemetry)
        {
            Action<EnemyStatusApplyResult> observer = null;
            if (telemetry != null) observer = telemetry.RecordStatusResult;
            return new EnemyStatusApplicationRequest(EnemyStatusRuntimeKind.Marked, markedPolicy, observer);
        }

        private static void ProcessSegment(
            Vector3 start,
            Vector3 end,
            U2ReturningWaypointPhase phase,
            IReadOnlyList<U2EnemyActor> candidates,
            HashSet<U2EnemyActor> hitLedger,
            float hitRadius,
            float damage,
            float damageFlashSeconds,
            EnemyStatusApplicationRequest markedRequest,
            ReturnCompassNeedlePrototypeTelemetry telemetry)
        {
            var hitRadiusSquared = hitRadius * hitRadius;
            for (var i = 0; i < candidates.Count; i++)
            {
                var target = candidates[i];
                if (target == null || !target.IsTargetable || hitLedger.Contains(target)) continue;
                if (DistanceSquaredPointToSegment2D(target.transform.position, start, end) > hitRadiusSquared) continue;

                hitLedger.Add(target);
                var defeated = target.TakeDamage(damage, damageFlashSeconds);
                telemetry?.RecordHit(phase, defeated);
                if (!defeated) markedRequest.ApplyTo(target.Statuses);
            }
        }

        private static float DistanceSquaredPointToSegment2D(Vector3 point, Vector3 start, Vector3 end)
        {
            var segmentX = end.x - start.x;
            var segmentY = end.y - start.y;
            var lengthSquared = segmentX * segmentX + segmentY * segmentY;
            if (lengthSquared <= 0.000001f)
            {
                var pointX = point.x - start.x;
                var pointY = point.y - start.y;
                return pointX * pointX + pointY * pointY;
            }

            var relativeX = point.x - start.x;
            var relativeY = point.y - start.y;
            var projection = (relativeX * segmentX + relativeY * segmentY) / lengthSquared;
            projection = Math.Max(0f, Math.Min(1f, projection));
            var closestX = start.x + segmentX * projection;
            var closestY = start.y + segmentY * projection;
            var deltaX = point.x - closestX;
            var deltaY = point.y - closestY;
            return deltaX * deltaX + deltaY * deltaY;
        }

        private static bool IsFinite(Vector3 value)
            => float.IsFinite(value.x) && float.IsFinite(value.y) && float.IsFinite(value.z);

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;

        private static bool IsFiniteNonNegative(float value)
            => float.IsFinite(value) && value >= 0f;
    }
}
