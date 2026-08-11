using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.Runtime.Gameplay.Primitives
{
    public enum U2EnemyPriorityDistanceTieBreak
    {
        StableInputOrder,
        PreferNearer,
        PreferFarther,
    }

    public readonly struct U2EnemyPrioritySelectionResult
    {
        public U2EnemyPrioritySelectionResult(
            U2EnemyActor target,
            int candidateIndex,
            float priorityScore,
            float distanceSquared)
        {
            Target = target;
            CandidateIndex = candidateIndex;
            PriorityScore = priorityScore;
            DistanceSquared = distanceSquared;
        }

        public U2EnemyActor Target { get; }
        public int CandidateIndex { get; }
        public float PriorityScore { get; }
        public float DistanceSquared { get; }
    }

    /// <summary>
    /// Allocation-free, balance-neutral priority target selector for homing/precision callers.
    /// The caller owns the meaning of each priority score; this primitive only compares finite
    /// scores and applies an explicit distance tie-break inside a caller-supplied range.
    /// </summary>
    public static class U2EnemyHomingPrioritySelectionRuntime
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        public static bool TrySelect(
            IReadOnlyList<U2EnemyActor> candidates,
            IReadOnlyList<float> priorityScores,
            Vector3 origin,
            float minRange,
            float maxRange,
            U2EnemyPriorityDistanceTieBreak distanceTieBreak,
            out U2EnemyPrioritySelectionResult result)
        {
            result = default;
            if (candidates == null ||
                priorityScores == null ||
                candidates.Count != priorityScores.Count ||
                !IsFiniteNonNegative(minRange) ||
                !IsFinitePositive(maxRange) ||
                minRange > maxRange ||
                !Enum.IsDefined(typeof(U2EnemyPriorityDistanceTieBreak), distanceTieBreak))
            {
                return false;
            }

            var minRangeSquared = minRange * minRange;
            var maxRangeSquared = maxRange * maxRange;
            var found = false;
            U2EnemyActor selected = null;
            var selectedIndex = -1;
            var selectedScore = 0f;
            var selectedDistanceSquared = 0f;

            for (var index = 0; index < candidates.Count; index++)
            {
                var candidate = candidates[index];
                var score = priorityScores[index];
                if (candidate == null || !candidate.IsTargetable || !float.IsFinite(score))
                {
                    continue;
                }

                var delta = candidate.transform.position - origin;
                var distanceSquared = delta.x * delta.x + delta.y * delta.y;
                if (!float.IsFinite(distanceSquared) ||
                    distanceSquared < minRangeSquared ||
                    distanceSquared > maxRangeSquared)
                {
                    continue;
                }

                if (!found ||
                    score > selectedScore ||
                    (score == selectedScore && WinsDistanceTie(
                        distanceSquared,
                        selectedDistanceSquared,
                        distanceTieBreak)))
                {
                    found = true;
                    selected = candidate;
                    selectedIndex = index;
                    selectedScore = score;
                    selectedDistanceSquared = distanceSquared;
                }
            }

            if (!found)
            {
                return false;
            }

            result = new U2EnemyPrioritySelectionResult(
                selected,
                selectedIndex,
                selectedScore,
                selectedDistanceSquared);
            return true;
        }

        private static bool WinsDistanceTie(
            float candidateDistanceSquared,
            float selectedDistanceSquared,
            U2EnemyPriorityDistanceTieBreak distanceTieBreak)
        {
            return distanceTieBreak switch
            {
                U2EnemyPriorityDistanceTieBreak.PreferNearer => candidateDistanceSquared < selectedDistanceSquared,
                U2EnemyPriorityDistanceTieBreak.PreferFarther => candidateDistanceSquared > selectedDistanceSquared,
                _ => false,
            };
        }

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;

        private static bool IsFiniteNonNegative(float value)
            => float.IsFinite(value) && value >= 0f;
    }
}
