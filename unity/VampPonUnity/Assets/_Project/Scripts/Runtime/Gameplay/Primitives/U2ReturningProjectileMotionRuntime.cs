using System;
using UnityEngine;

namespace VampPon.UnitySpike.Runtime.Gameplay.Primitives
{
    public enum U2ReturningProjectilePhase
    {
        Inactive,
        Outbound,
        Returning,
        Complete,
    }

    public readonly struct U2ReturningProjectileStepResult
    {
        public U2ReturningProjectileStepResult(
            Vector3 position,
            U2ReturningProjectilePhase phase,
            bool turnedAround,
            bool completed)
        {
            Position = position;
            Phase = phase;
            TurnedAround = turnedAround;
            Completed = completed;
        }

        public Vector3 Position { get; }
        public U2ReturningProjectilePhase Phase { get; }
        public bool TurnedAround { get; }
        public bool Completed { get; }
    }

    /// <summary>
    /// Reusable 2D outbound -> dynamic-return motion state for thrown/returning projectiles.
    ///
    /// This primitive owns only movement phase and travel-budget conservation. Callers own spawn,
    /// damage, hit policy, target selection, visuals, pooling and every tuning value. The return
    /// anchor is supplied on every step so a moving player/owner can be followed without storing
    /// weapon-specific ownership in this shared layer.
    /// </summary>
    public sealed class U2ReturningProjectileMotionState
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        private Vector3 outboundTarget;

        public U2ReturningProjectilePhase Phase { get; private set; }
            = U2ReturningProjectilePhase.Inactive;

        public bool IsActive =>
            Phase == U2ReturningProjectilePhase.Outbound ||
            Phase == U2ReturningProjectilePhase.Returning;

        public bool IsComplete => Phase == U2ReturningProjectilePhase.Complete;

        public bool TryBegin(Vector3 target)
        {
            if (!IsFinite(target))
            {
                return false;
            }

            outboundTarget = target;
            Phase = U2ReturningProjectilePhase.Outbound;
            return true;
        }

        public bool TryStep(
            Vector3 currentPosition,
            Vector3 returnAnchor,
            float speed,
            float deltaSeconds,
            float arrivalDistance,
            out U2ReturningProjectileStepResult result)
        {
            result = default;
            if (!IsActive ||
                !IsFinite(currentPosition) ||
                !IsFinite(returnAnchor) ||
                !IsFinitePositive(speed) ||
                !IsFiniteNonNegative(deltaSeconds) ||
                !IsFiniteNonNegative(arrivalDistance))
            {
                return false;
            }

            var position = currentPosition;
            var remainingTravel = speed * deltaSeconds;
            if (!float.IsFinite(remainingTravel))
            {
                return false;
            }

            var turnedAround = false;
            var completed = false;

            // At most two legs are consumed: outbound, then returning. This preserves the
            // caller's travel budget when one frame crosses the turnaround point.
            if (Phase == U2ReturningProjectilePhase.Outbound)
            {
                var outboundDistance = Distance2D(position, outboundTarget);
                if (outboundDistance <= arrivalDistance || remainingTravel >= outboundDistance)
                {
                    if (outboundDistance > 0f)
                    {
                        position = WithPreservedZ(outboundTarget, position.z);
                        remainingTravel = Math.Max(0f, remainingTravel - outboundDistance);
                    }

                    Phase = U2ReturningProjectilePhase.Returning;
                    turnedAround = true;
                }
                else if (remainingTravel > 0f)
                {
                    position = MoveTowards2D(position, outboundTarget, remainingTravel);
                    remainingTravel = 0f;
                }
            }

            if (Phase == U2ReturningProjectilePhase.Returning)
            {
                var returnDistance = Distance2D(position, returnAnchor);
                if (returnDistance <= arrivalDistance || remainingTravel >= returnDistance)
                {
                    if (returnDistance > 0f)
                    {
                        position = WithPreservedZ(returnAnchor, position.z);
                    }

                    Phase = U2ReturningProjectilePhase.Complete;
                    completed = true;
                }
                else if (remainingTravel > 0f)
                {
                    position = MoveTowards2D(position, returnAnchor, remainingTravel);
                }
            }

            result = new U2ReturningProjectileStepResult(
                position,
                Phase,
                turnedAround,
                completed);
            return true;
        }

        public void Reset()
        {
            outboundTarget = default;
            Phase = U2ReturningProjectilePhase.Inactive;
        }

        private static Vector3 MoveTowards2D(Vector3 current, Vector3 target, float distance)
        {
            var deltaX = target.x - current.x;
            var deltaY = target.y - current.y;
            var magnitude = (float)Math.Sqrt(deltaX * deltaX + deltaY * deltaY);
            if (magnitude <= 0f || distance >= magnitude)
            {
                return WithPreservedZ(target, current.z);
            }

            var scale = distance / magnitude;
            return new Vector3(
                current.x + deltaX * scale,
                current.y + deltaY * scale,
                current.z);
        }

        private static float Distance2D(Vector3 left, Vector3 right)
        {
            var deltaX = right.x - left.x;
            var deltaY = right.y - left.y;
            return (float)Math.Sqrt(deltaX * deltaX + deltaY * deltaY);
        }

        private static Vector3 WithPreservedZ(Vector3 source, float z)
            => new(source.x, source.y, z);

        private static bool IsFinite(Vector3 value)
            => float.IsFinite(value.x) &&
                float.IsFinite(value.y) &&
                float.IsFinite(value.z);

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;

        private static bool IsFiniteNonNegative(float value)
            => float.IsFinite(value) && value >= 0f;
    }
}
