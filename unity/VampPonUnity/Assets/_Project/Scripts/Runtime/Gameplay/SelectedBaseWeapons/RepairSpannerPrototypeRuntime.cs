using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    public sealed class RepairSpannerPrototypeTelemetry
    {
        public int BeginCount { get; private set; }
        public int StepCount { get; private set; }
        public int TurnaroundCount { get; private set; }
        public int CompleteCount { get; private set; }
        public int OutboundHitCount { get; private set; }
        public int ReturnHitCount { get; private set; }
        public int DefeatedCount { get; private set; }
        public int StatusApplyAttemptCount { get; private set; }
        public int StatusAppliedCount { get; private set; }
        public int StatusBlockedByInternalCooldownCount { get; private set; }

        internal void RecordBegin() => BeginCount++;

        internal void RecordStep(U2ReturningProjectileStepResult result)
        {
            StepCount++;
            if (result.TurnedAround) TurnaroundCount++;
            if (result.Completed) CompleteCount++;
        }

        internal void RecordHit(U2ReturningProjectilePhase phase, bool defeated)
        {
            if (phase == U2ReturningProjectilePhase.Outbound) OutboundHitCount++;
            else if (phase == U2ReturningProjectilePhase.Returning) ReturnHitCount++;
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
            BeginCount = 0;
            StepCount = 0;
            TurnaroundCount = 0;
            CompleteCount = 0;
            OutboundHitCount = 0;
            ReturnHitCount = 0;
            DefeatedCount = 0;
            StatusApplyAttemptCount = 0;
            StatusAppliedCount = 0;
            StatusBlockedByInternalCooldownCount = 0;
        }
    }

    /// <summary>
    /// Prototype-only returning throw state for repair_spanner / 修理スパナ.
    ///
    /// Motion comes from the reusable returning-projectile primitive. This caller owns the
    /// outbound/return hit ledgers and typed EXPOSED application. All numeric values are supplied
    /// by the caller; this class is not connected to the live Stage1 registry or Canon balance.
    /// </summary>
    public sealed class RepairSpannerPrototypeState
    {
        public const string WeaponId = "repair_spanner";
        public const string ContentStatusId = "EXPOSED";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";
        public const string HitPolicy = "ONE_HIT_PER_TARGET_PER_LEG_OUTBOUND_AND_RETURN_SEPARATE";

        private readonly U2ReturningProjectileMotionState motion = new();
        private readonly HashSet<U2EnemyActor> outboundHits = new();
        private readonly HashSet<U2EnemyActor> returnHits = new();
        private Vector3 position;
        private Vector3 outboundTarget;

        public Vector3 Position => position;
        public U2ReturningProjectilePhase Phase => motion.Phase;
        public bool IsActive => motion.IsActive;
        public bool IsComplete => motion.IsComplete;
        public int OutboundUniqueHitCount => outboundHits.Count;
        public int ReturnUniqueHitCount => returnHits.Count;

        public bool TryBegin(
            Vector3 spawnPosition,
            Vector3 targetPosition,
            RepairSpannerPrototypeTelemetry telemetry = null)
        {
            if (!IsFinite(spawnPosition) || !IsFinite(targetPosition)) return false;
            Reset();
            if (!motion.TryBegin(targetPosition)) return false;
            position = spawnPosition;
            outboundTarget = targetPosition;
            telemetry?.RecordBegin();
            return true;
        }

        public bool TryStep(
            Vector3 returnAnchor,
            float speed,
            float deltaSeconds,
            float arrivalDistance,
            IReadOnlyList<U2EnemyActor> candidates,
            float hitRadius,
            float damage,
            float damageFlashSeconds,
            EnemyStatusApplicationPolicy exposedPolicy,
            out U2ReturningProjectileStepResult stepResult,
            RepairSpannerPrototypeTelemetry telemetry = null)
        {
            stepResult = default;
            if (candidates == null ||
                !IsFinitePositive(hitRadius) ||
                !IsFinitePositive(damage) ||
                !IsFiniteNonNegative(damageFlashSeconds))
            {
                return false;
            }

            var previousPosition = position;
            var previousPhase = motion.Phase;
            if (!motion.TryStep(
                previousPosition,
                returnAnchor,
                speed,
                deltaSeconds,
                arrivalDistance,
                out stepResult))
            {
                return false;
            }

            var statusRequest = CreateExposedRequest(exposedPolicy, telemetry);
            if (previousPhase == U2ReturningProjectilePhase.Outbound)
            {
                if (stepResult.TurnedAround)
                {
                    ProcessSegment(
                        previousPosition,
                        outboundTarget,
                        U2ReturningProjectilePhase.Outbound,
                        candidates,
                        outboundHits,
                        hitRadius,
                        damage,
                        damageFlashSeconds,
                        statusRequest,
                        telemetry);
                    ProcessSegment(
                        outboundTarget,
                        stepResult.Position,
                        U2ReturningProjectilePhase.Returning,
                        candidates,
                        returnHits,
                        hitRadius,
                        damage,
                        damageFlashSeconds,
                        statusRequest,
                        telemetry);
                }
                else
                {
                    ProcessSegment(
                        previousPosition,
                        stepResult.Position,
                        U2ReturningProjectilePhase.Outbound,
                        candidates,
                        outboundHits,
                        hitRadius,
                        damage,
                        damageFlashSeconds,
                        statusRequest,
                        telemetry);
                }
            }
            else if (previousPhase == U2ReturningProjectilePhase.Returning)
            {
                ProcessSegment(
                    previousPosition,
                    stepResult.Position,
                    U2ReturningProjectilePhase.Returning,
                    candidates,
                    returnHits,
                    hitRadius,
                    damage,
                    damageFlashSeconds,
                    statusRequest,
                    telemetry);
            }

            position = stepResult.Position;
            telemetry?.RecordStep(stepResult);
            return true;
        }

        public void Reset()
        {
            motion.Reset();
            outboundHits.Clear();
            returnHits.Clear();
            position = default;
            outboundTarget = default;
        }

        private static EnemyStatusApplicationRequest CreateExposedRequest(
            EnemyStatusApplicationPolicy policy,
            RepairSpannerPrototypeTelemetry telemetry)
        {
            Action<EnemyStatusApplyResult> observer = null;
            if (telemetry != null) observer = telemetry.RecordStatusResult;
            return new EnemyStatusApplicationRequest(EnemyStatusRuntimeKind.Exposed, policy, observer);
        }

        private static void ProcessSegment(
            Vector3 start,
            Vector3 end,
            U2ReturningProjectilePhase phase,
            IReadOnlyList<U2EnemyActor> candidates,
            HashSet<U2EnemyActor> hitLedger,
            float hitRadius,
            float damage,
            float damageFlashSeconds,
            EnemyStatusApplicationRequest statusRequest,
            RepairSpannerPrototypeTelemetry telemetry)
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
                if (!defeated) statusRequest.ApplyTo(target.Statuses);
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
