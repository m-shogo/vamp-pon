using System;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.Runtime.Gameplay.Primitives
{
    public readonly struct U2EnemyBreakStaggerApplyResult
    {
        public U2EnemyBreakStaggerApplyResult(
            float accumulatedBreak,
            bool staggerTriggered,
            float staggerSecondsRemaining)
        {
            AccumulatedBreak = accumulatedBreak;
            StaggerTriggered = staggerTriggered;
            StaggerSecondsRemaining = staggerSecondsRemaining;
        }

        public float AccumulatedBreak { get; }
        public bool StaggerTriggered { get; }
        public float StaggerSecondsRemaining { get; }
    }

    /// <summary>
    /// Enemy-owned, balance-neutral break/stagger state.
    /// Every application supplies break amount, threshold and stagger duration explicitly.
    /// No weapon-specific defaults, decay rate, damage, VFX or status rules live here.
    /// </summary>
    public sealed class U2EnemyBreakStaggerState
    {
        public float AccumulatedBreak { get; private set; }
        public float StaggerSecondsRemaining { get; private set; }
        public bool IsStaggered => StaggerSecondsRemaining > 0f;

        public bool TryApply(
            float breakAmount,
            float breakThreshold,
            float staggerDurationSeconds,
            out U2EnemyBreakStaggerApplyResult result)
        {
            result = default;
            if (!IsFinitePositive(breakAmount) ||
                !IsFinitePositive(breakThreshold) ||
                !IsFinitePositive(staggerDurationSeconds))
            {
                return false;
            }

            var nextBreak = AccumulatedBreak + breakAmount;
            if (!float.IsFinite(nextBreak))
            {
                return false;
            }

            var staggerTriggered = nextBreak >= breakThreshold;
            if (staggerTriggered)
            {
                // One hit produces one stagger event. Preserve only the residual gauge so
                // oversized caller values cannot silently create stacked/default stun semantics.
                var completedThresholds = Math.Floor(nextBreak / breakThreshold);
                nextBreak -= (float)(completedThresholds * breakThreshold);
                if (nextBreak < 0f || nextBreak >= breakThreshold)
                {
                    nextBreak = 0f;
                }
                StaggerSecondsRemaining = Math.Max(StaggerSecondsRemaining, staggerDurationSeconds);
            }

            AccumulatedBreak = nextBreak;
            result = new U2EnemyBreakStaggerApplyResult(
                AccumulatedBreak,
                staggerTriggered,
                StaggerSecondsRemaining);
            return true;
        }

        public bool Tick(float deltaSeconds)
        {
            if (!float.IsFinite(deltaSeconds) || deltaSeconds < 0f)
            {
                return false;
            }
            if (deltaSeconds == 0f || StaggerSecondsRemaining <= 0f)
            {
                return true;
            }

            StaggerSecondsRemaining = Math.Max(0f, StaggerSecondsRemaining - deltaSeconds);
            return true;
        }

        public void Clear()
        {
            AccumulatedBreak = 0f;
            StaggerSecondsRemaining = 0f;
        }

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;
    }

    /// <summary>
    /// Shared application boundary for break/stagger. The caller owns all tuning.
    /// This helper refuses null/dying targets and does not connect itself to live Stage1.
    /// </summary>
    public static class U2EnemyBreakStaggerRuntime
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        public static bool TryApply(
            U2EnemyActor enemy,
            float breakAmount,
            float breakThreshold,
            float staggerDurationSeconds,
            out U2EnemyBreakStaggerApplyResult result)
        {
            result = default;
            if (enemy == null || !enemy.IsTargetable)
            {
                return false;
            }

            return enemy.BreakStagger.TryApply(
                breakAmount,
                breakThreshold,
                staggerDurationSeconds,
                out result);
        }
    }
}
