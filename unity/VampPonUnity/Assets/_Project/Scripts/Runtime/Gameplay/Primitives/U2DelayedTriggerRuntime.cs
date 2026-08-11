using System;

namespace VampPon.UnitySpike.Runtime.Gameplay.Primitives
{
    public enum U2DelayedTriggerPhase
    {
        Inactive,
        Waiting,
        Ready,
        Fired,
        Cancelled,
    }

    public readonly struct U2DelayedTriggerTickResult
    {
        public U2DelayedTriggerTickResult(
            U2DelayedTriggerPhase phase,
            bool becameReadyThisTick,
            float remainingDelaySeconds)
        {
            Phase = phase;
            BecameReadyThisTick = becameReadyThisTick;
            RemainingDelaySeconds = remainingDelaySeconds;
        }

        public U2DelayedTriggerPhase Phase { get; }
        public bool BecameReadyThisTick { get; }
        public float RemainingDelaySeconds { get; }
    }

    /// <summary>
    /// Reusable one-shot delay gate. The caller owns placement, effect execution, targets,
    /// damage, Status, visuals and all tuning values.
    /// </summary>
    public sealed class U2DelayedTriggerState
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        public U2DelayedTriggerPhase Phase { get; private set; } = U2DelayedTriggerPhase.Inactive;
        public float RemainingDelaySeconds { get; private set; }
        public bool IsActive => Phase is U2DelayedTriggerPhase.Waiting or U2DelayedTriggerPhase.Ready;
        public bool IsReady => Phase == U2DelayedTriggerPhase.Ready;

        public bool TryBegin(float delaySeconds)
        {
            if (IsActive || !IsFiniteNonNegative(delaySeconds)) return false;
            RemainingDelaySeconds = delaySeconds;
            Phase = delaySeconds > 0f
                ? U2DelayedTriggerPhase.Waiting
                : U2DelayedTriggerPhase.Ready;
            return true;
        }

        public bool TryTick(float deltaSeconds, out U2DelayedTriggerTickResult result)
        {
            result = default;
            if (!IsActive || !IsFinitePositive(deltaSeconds)) return false;

            var becameReadyThisTick = false;
            if (Phase == U2DelayedTriggerPhase.Waiting)
            {
                if (deltaSeconds >= RemainingDelaySeconds)
                {
                    RemainingDelaySeconds = 0f;
                    Phase = U2DelayedTriggerPhase.Ready;
                    becameReadyThisTick = true;
                }
                else
                {
                    RemainingDelaySeconds -= deltaSeconds;
                }
            }

            result = new U2DelayedTriggerTickResult(Phase, becameReadyThisTick, RemainingDelaySeconds);
            return true;
        }

        public bool TryConsume()
        {
            if (Phase != U2DelayedTriggerPhase.Ready) return false;
            Phase = U2DelayedTriggerPhase.Fired;
            return true;
        }

        public bool TryCancel()
        {
            if (!IsActive) return false;
            RemainingDelaySeconds = 0f;
            Phase = U2DelayedTriggerPhase.Cancelled;
            return true;
        }

        public void Reset()
        {
            RemainingDelaySeconds = 0f;
            Phase = U2DelayedTriggerPhase.Inactive;
        }

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;

        private static bool IsFiniteNonNegative(float value)
            => float.IsFinite(value) && value >= 0f;
    }
}
