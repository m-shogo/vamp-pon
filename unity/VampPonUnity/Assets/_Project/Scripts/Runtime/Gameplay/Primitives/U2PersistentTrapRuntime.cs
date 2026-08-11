using System;
using UnityEngine;

namespace VampPon.UnitySpike.Runtime.Gameplay.Primitives
{
    public enum U2PersistentTrapPhase
    {
        Inactive,
        Arming,
        Armed,
        Exhausted,
        Expired,
    }

    public readonly struct U2PersistentTrapTickResult
    {
        public U2PersistentTrapTickResult(
            U2PersistentTrapPhase phase,
            bool armedThisTick,
            bool expiredThisTick,
            float remainingArmingSeconds,
            float remainingActiveSeconds,
            int remainingTriggerBudget)
        {
            Phase = phase;
            ArmedThisTick = armedThisTick;
            ExpiredThisTick = expiredThisTick;
            RemainingArmingSeconds = remainingArmingSeconds;
            RemainingActiveSeconds = remainingActiveSeconds;
            RemainingTriggerBudget = remainingTriggerBudget;
        }

        public U2PersistentTrapPhase Phase { get; }
        public bool ArmedThisTick { get; }
        public bool ExpiredThisTick { get; }
        public float RemainingArmingSeconds { get; }
        public float RemainingActiveSeconds { get; }
        public int RemainingTriggerBudget { get; }
    }

    /// <summary>
    /// Reusable state for a caller-owned persistent trap entity.
    /// Weapon identity, placement rules, overlap queries, damage, Status and VFX remain outside.
    /// </summary>
    public sealed class U2PersistentTrapState
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        public Vector3 Position { get; private set; }
        public U2PersistentTrapPhase Phase { get; private set; } = U2PersistentTrapPhase.Inactive;
        public float RemainingArmingSeconds { get; private set; }
        public float RemainingActiveSeconds { get; private set; }
        public int RemainingTriggerBudget { get; private set; }
        public bool IsActive => Phase is U2PersistentTrapPhase.Arming or U2PersistentTrapPhase.Armed;
        public bool IsArmed => Phase == U2PersistentTrapPhase.Armed;

        public bool TryBegin(
            Vector3 position,
            float armingDelaySeconds,
            float activeDurationSeconds,
            int triggerBudget)
        {
            if (IsActive ||
                !IsFinite(position) ||
                !IsFiniteNonNegative(armingDelaySeconds) ||
                !IsFinitePositive(activeDurationSeconds) ||
                triggerBudget <= 0)
            {
                return false;
            }

            Position = position;
            RemainingArmingSeconds = armingDelaySeconds;
            RemainingActiveSeconds = activeDurationSeconds;
            RemainingTriggerBudget = triggerBudget;
            Phase = armingDelaySeconds > 0f
                ? U2PersistentTrapPhase.Arming
                : U2PersistentTrapPhase.Armed;
            return true;
        }

        public bool TryTick(float deltaSeconds, out U2PersistentTrapTickResult result)
        {
            result = default;
            if (!IsActive || !IsFinitePositive(deltaSeconds)) return false;

            var timeBudget = deltaSeconds;
            var armedThisTick = false;
            var expiredThisTick = false;

            if (Phase == U2PersistentTrapPhase.Arming)
            {
                if (timeBudget < RemainingArmingSeconds)
                {
                    RemainingArmingSeconds -= timeBudget;
                    timeBudget = 0f;
                }
                else
                {
                    timeBudget -= RemainingArmingSeconds;
                    RemainingArmingSeconds = 0f;
                    Phase = U2PersistentTrapPhase.Armed;
                    armedThisTick = true;
                }
            }

            if (Phase == U2PersistentTrapPhase.Armed && timeBudget > 0f)
            {
                if (timeBudget >= RemainingActiveSeconds)
                {
                    RemainingActiveSeconds = 0f;
                    Phase = U2PersistentTrapPhase.Expired;
                    expiredThisTick = true;
                }
                else
                {
                    RemainingActiveSeconds -= timeBudget;
                }
            }

            result = new U2PersistentTrapTickResult(
                Phase,
                armedThisTick,
                expiredThisTick,
                RemainingArmingSeconds,
                RemainingActiveSeconds,
                RemainingTriggerBudget);
            return true;
        }

        public bool TryConsumeTrigger(out int remainingTriggerBudget)
        {
            remainingTriggerBudget = RemainingTriggerBudget;
            if (Phase != U2PersistentTrapPhase.Armed || RemainingTriggerBudget <= 0) return false;

            RemainingTriggerBudget--;
            remainingTriggerBudget = RemainingTriggerBudget;
            if (RemainingTriggerBudget == 0)
            {
                Phase = U2PersistentTrapPhase.Exhausted;
            }
            return true;
        }

        public void Reset()
        {
            Position = default;
            Phase = U2PersistentTrapPhase.Inactive;
            RemainingArmingSeconds = 0f;
            RemainingActiveSeconds = 0f;
            RemainingTriggerBudget = 0;
        }

        private static bool IsFinite(Vector3 value)
            => float.IsFinite(value.x) && float.IsFinite(value.y) && float.IsFinite(value.z);

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;

        private static bool IsFiniteNonNegative(float value)
            => float.IsFinite(value) && value >= 0f;
    }
}
