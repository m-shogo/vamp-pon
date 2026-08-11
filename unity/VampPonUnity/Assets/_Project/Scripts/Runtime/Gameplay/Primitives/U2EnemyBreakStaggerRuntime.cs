using System;
using UnityEngine;
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

    public readonly struct U2EnemyBreakStaggerSnapshot
    {
        public U2EnemyBreakStaggerSnapshot(
            float accumulatedBreak,
            float staggerSecondsRemaining)
        {
            AccumulatedBreak = accumulatedBreak;
            StaggerSecondsRemaining = staggerSecondsRemaining;
        }

        public float AccumulatedBreak { get; }
        public float StaggerSecondsRemaining { get; }
        public bool IsStaggered => StaggerSecondsRemaining > 0f;
    }

    /// <summary>
    /// Balance-neutral enemy break/stagger state. Every application supplies its own
    /// break amount, threshold and stagger duration; there are no weapon defaults here.
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
                // A single application emits one stagger event. Oversized caller values keep
                // only residual gauge instead of inventing stacked/default stun semantics.
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

        public U2EnemyBreakStaggerSnapshot Snapshot()
            => new(AccumulatedBreak, StaggerSecondsRemaining);

        public void Clear()
        {
            AccumulatedBreak = 0f;
            StaggerSecondsRemaining = 0f;
        }

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;
    }

    [DefaultExecutionOrder(1000)]
    internal sealed class U2EnemyBreakStaggerDriver : MonoBehaviour
    {
        private readonly U2EnemyBreakStaggerState state = new();
        private U2EnemyActor enemy;
        private Vector3 frozenPosition;

        internal U2EnemyBreakStaggerState State => state;

        internal void Bind(U2EnemyActor target)
        {
            enemy = target;
        }

        internal bool TryApply(
            float breakAmount,
            float breakThreshold,
            float staggerDurationSeconds,
            out U2EnemyBreakStaggerApplyResult result)
        {
            if (enemy == null || !enemy.IsTargetable)
            {
                result = default;
                return false;
            }

            var applied = state.TryApply(
                breakAmount,
                breakThreshold,
                staggerDurationSeconds,
                out result);
            if (applied && result.StaggerTriggered)
            {
                frozenPosition = transform.position;
            }
            return applied;
        }

        internal void NotifyExternalDisplacement()
        {
            if (state.IsStaggered)
            {
                frozenPosition = transform.position;
            }
        }

        private void LateUpdate()
        {
            if (enemy == null || !enemy.IsTargetable)
            {
                state.Clear();
                return;
            }
            if (!state.IsStaggered)
            {
                return;
            }

            // U2BattleController performs ordinary pursuit in Update. Restoring the captured
            // position in LateUpdate suppresses voluntary pursuit while staggered. Knockback's
            // generic displacement signal refreshes this anchor so external pushes survive.
            transform.position = frozenPosition;
            state.Tick(Time.deltaTime);
        }

        private void OnDisable()
        {
            state.Clear();
        }
    }

    /// <summary>
    /// Reusable break/stagger application boundary. It owns no weapon identity, damage,
    /// threshold, duration, VFX, Status, cooldown or live-registry admission.
    /// </summary>
    public static class U2EnemyBreakStaggerRuntime
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        static U2EnemyBreakStaggerRuntime()
        {
            U2EnemyKnockbackRuntime.EnemyDisplaced += NotifyExternalDisplacement;
        }

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

            var driver = enemy.GetComponent<U2EnemyBreakStaggerDriver>();
            if (driver == null)
            {
                driver = enemy.gameObject.AddComponent<U2EnemyBreakStaggerDriver>();
                driver.Bind(enemy);
            }

            return driver.TryApply(
                breakAmount,
                breakThreshold,
                staggerDurationSeconds,
                out result);
        }

        public static bool TryGetSnapshot(
            U2EnemyActor enemy,
            out U2EnemyBreakStaggerSnapshot snapshot)
        {
            snapshot = default;
            if (enemy == null)
            {
                return false;
            }

            var driver = enemy.GetComponent<U2EnemyBreakStaggerDriver>();
            if (driver == null)
            {
                return false;
            }

            snapshot = driver.State.Snapshot();
            return true;
        }

        private static void NotifyExternalDisplacement(U2EnemyActor enemy)
        {
            if (enemy == null)
            {
                return;
            }

            enemy.GetComponent<U2EnemyBreakStaggerDriver>()?.NotifyExternalDisplacement();
        }
    }
}
