using System;
using UnityEngine;

namespace VampPon.UnitySpike.Runtime.Gameplay.Primitives
{
    public enum U2ReturningWaypointPhase
    {
        Inactive,
        Outbound,
        ReturningViaWaypoint,
        ReturningToAnchor,
        Complete,
    }

    public readonly struct U2ReturningWaypointStepResult
    {
        public U2ReturningWaypointStepResult(
            Vector3 position,
            U2ReturningWaypointPhase phase,
            bool turnedAround,
            bool waypointReached,
            bool completed)
        {
            Position = position;
            Phase = phase;
            TurnedAround = turnedAround;
            WaypointReached = waypointReached;
            Completed = completed;
        }

        public Vector3 Position { get; }
        public U2ReturningWaypointPhase Phase { get; }
        public bool TurnedAround { get; }
        public bool WaypointReached { get; }
        public bool Completed { get; }
    }

    /// <summary>
    /// Generic outbound -> optional dynamic return waypoint -> final dynamic return anchor motion.
    /// Weapon identity, targeting meaning, hits, damage, Status and tuning remain caller-owned.
    /// </summary>
    public sealed class U2ReturningWaypointMotionState
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        private Vector3 outboundTarget;
        private bool useReturnWaypoint;

        public U2ReturningWaypointPhase Phase { get; private set; } = U2ReturningWaypointPhase.Inactive;
        public bool IsActive => Phase is U2ReturningWaypointPhase.Outbound or U2ReturningWaypointPhase.ReturningViaWaypoint or U2ReturningWaypointPhase.ReturningToAnchor;
        public bool IsComplete => Phase == U2ReturningWaypointPhase.Complete;
        public bool UsesReturnWaypoint => useReturnWaypoint;

        public bool TryBegin(Vector3 targetPosition, bool useWaypoint)
        {
            if (IsActive || !IsFinite(targetPosition)) return false;
            outboundTarget = targetPosition;
            useReturnWaypoint = useWaypoint;
            Phase = U2ReturningWaypointPhase.Outbound;
            return true;
        }

        public bool SkipReturnWaypoint()
        {
            if (!IsActive || !useReturnWaypoint) return false;
            useReturnWaypoint = false;
            if (Phase == U2ReturningWaypointPhase.ReturningViaWaypoint)
            {
                Phase = U2ReturningWaypointPhase.ReturningToAnchor;
            }
            return true;
        }

        public bool TryStep(
            Vector3 currentPosition,
            Vector3 returnWaypoint,
            Vector3 finalReturnAnchor,
            float speed,
            float deltaSeconds,
            float arrivalDistance,
            out U2ReturningWaypointStepResult result)
        {
            result = default;
            if (!IsActive ||
                !IsFinite(currentPosition) ||
                !IsFinite(returnWaypoint) ||
                !IsFinite(finalReturnAnchor) ||
                !IsFinitePositive(speed) ||
                !IsFinitePositive(deltaSeconds) ||
                !IsFiniteNonNegative(arrivalDistance))
            {
                return false;
            }

            var travelBudget = speed * deltaSeconds;
            if (!float.IsFinite(travelBudget) || travelBudget <= 0f) return false;

            var position = currentPosition;
            var preservedZ = currentPosition.z;
            var turnedAround = false;
            var waypointReached = false;
            var completed = false;

            for (var transitionGuard = 0; transitionGuard < 4 && travelBudget > 0f && IsActive; transitionGuard++)
            {
                if (Phase == U2ReturningWaypointPhase.Outbound)
                {
                    var reached = MoveToward2D(ref position, outboundTarget, preservedZ, ref travelBudget, arrivalDistance);
                    if (!reached) break;
                    turnedAround = true;
                    Phase = useReturnWaypoint
                        ? U2ReturningWaypointPhase.ReturningViaWaypoint
                        : U2ReturningWaypointPhase.ReturningToAnchor;
                    continue;
                }

                if (Phase == U2ReturningWaypointPhase.ReturningViaWaypoint)
                {
                    var reached = MoveToward2D(ref position, returnWaypoint, preservedZ, ref travelBudget, arrivalDistance);
                    if (!reached) break;
                    waypointReached = true;
                    useReturnWaypoint = false;
                    Phase = U2ReturningWaypointPhase.ReturningToAnchor;
                    continue;
                }

                if (Phase == U2ReturningWaypointPhase.ReturningToAnchor)
                {
                    var reached = MoveToward2D(ref position, finalReturnAnchor, preservedZ, ref travelBudget, arrivalDistance);
                    if (!reached) break;
                    Phase = U2ReturningWaypointPhase.Complete;
                    completed = true;
                    break;
                }
            }

            result = new U2ReturningWaypointStepResult(position, Phase, turnedAround, waypointReached, completed);
            return true;
        }

        public void Reset()
        {
            outboundTarget = default;
            useReturnWaypoint = false;
            Phase = U2ReturningWaypointPhase.Inactive;
        }

        private static bool MoveToward2D(
            ref Vector3 currentPosition,
            Vector3 target,
            float preservedZ,
            ref float travelBudget,
            float arrivalDistance)
        {
            var deltaX = target.x - currentPosition.x;
            var deltaY = target.y - currentPosition.y;
            var distanceSquared = deltaX * deltaX + deltaY * deltaY;
            if (!float.IsFinite(distanceSquared)) return false;
            var distance = (float)Math.Sqrt(distanceSquared);

            if (distance <= arrivalDistance)
            {
                currentPosition.z = preservedZ;
                return true;
            }

            if (travelBudget >= distance)
            {
                currentPosition = new Vector3(target.x, target.y, preservedZ);
                travelBudget = Math.Max(0f, travelBudget - distance);
                return true;
            }

            if (distance <= 0.000001f)
            {
                currentPosition.z = preservedZ;
                return true;
            }

            var ratio = travelBudget / distance;
            currentPosition = new Vector3(
                currentPosition.x + deltaX * ratio,
                currentPosition.y + deltaY * ratio,
                preservedZ);
            travelBudget = 0f;
            return false;
        }

        private static bool IsFinite(Vector3 value)
            => float.IsFinite(value.x) && float.IsFinite(value.y) && float.IsFinite(value.z);

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;

        private static bool IsFiniteNonNegative(float value)
            => float.IsFinite(value) && value >= 0f;
    }
}
