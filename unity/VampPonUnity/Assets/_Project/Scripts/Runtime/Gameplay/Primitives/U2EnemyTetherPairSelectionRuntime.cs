using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.Runtime.Gameplay.Primitives
{
    public readonly struct U2EnemyTetherPairSelectionResult
    {
        public U2EnemyTetherPairSelectionResult(
            U2EnemyActor first,
            U2EnemyActor second,
            int firstCandidateIndex,
            int secondCandidateIndex,
            float combinedPriorityScore,
            float pairDistanceSquared)
        {
            First = first;
            Second = second;
            FirstCandidateIndex = firstCandidateIndex;
            SecondCandidateIndex = secondCandidateIndex;
            CombinedPriorityScore = combinedPriorityScore;
            PairDistanceSquared = pairDistanceSquared;
        }

        public U2EnemyActor First { get; }
        public U2EnemyActor Second { get; }
        public int FirstCandidateIndex { get; }
        public int SecondCandidateIndex { get; }
        public float CombinedPriorityScore { get; }
        public float PairDistanceSquared { get; }
    }

    /// <summary>
    /// Allocation-free pair selection for two-target tether/link callers.
    ///
    /// Callers own the meaning of each candidate score and all damage/Status/tether lifetime.
    /// This primitive only finds the highest combined-priority eligible pair inside caller-supplied
    /// origin and pair-distance bands. Equal combined scores prefer the shorter pair; exact ties
    /// remain stable by candidate input order.
    /// </summary>
    public static class U2EnemyTetherPairSelectionRuntime
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        public static bool TrySelectPair(
            IReadOnlyList<U2EnemyActor> candidates,
            IReadOnlyList<float> priorityScores,
            Vector3 origin,
            float minOriginRange,
            float maxOriginRange,
            float minPairDistance,
            float maxPairDistance,
            out U2EnemyTetherPairSelectionResult result)
        {
            result = default;
            if (candidates == null ||
                priorityScores == null ||
                candidates.Count != priorityScores.Count ||
                candidates.Count < 2 ||
                !IsFiniteNonNegative(minOriginRange) ||
                !IsFinitePositive(maxOriginRange) ||
                minOriginRange > maxOriginRange ||
                !IsFiniteNonNegative(minPairDistance) ||
                !IsFinitePositive(maxPairDistance) ||
                minPairDistance > maxPairDistance ||
                !IsFinite(origin))
            {
                return false;
            }

            var minOriginRangeSquared = minOriginRange * minOriginRange;
            var maxOriginRangeSquared = maxOriginRange * maxOriginRange;
            var minPairDistanceSquared = minPairDistance * minPairDistance;
            var maxPairDistanceSquared = maxPairDistance * maxPairDistance;
            if (!float.IsFinite(maxOriginRangeSquared) || !float.IsFinite(maxPairDistanceSquared))
            {
                return false;
            }

            var found = false;
            U2EnemyActor selectedFirst = null;
            U2EnemyActor selectedSecond = null;
            var selectedFirstIndex = -1;
            var selectedSecondIndex = -1;
            var selectedCombinedScore = 0f;
            var selectedPairDistanceSquared = 0f;

            for (var firstIndex = 0; firstIndex < candidates.Count - 1; firstIndex++)
            {
                var first = candidates[firstIndex];
                var firstScore = priorityScores[firstIndex];
                if (!IsEligible(first, firstScore, origin, minOriginRangeSquared, maxOriginRangeSquared))
                {
                    continue;
                }

                for (var secondIndex = firstIndex + 1; secondIndex < candidates.Count; secondIndex++)
                {
                    var second = candidates[secondIndex];
                    var secondScore = priorityScores[secondIndex];
                    if (!IsEligible(second, secondScore, origin, minOriginRangeSquared, maxOriginRangeSquared))
                    {
                        continue;
                    }

                    var pairDistanceSquared = DistanceSquared2D(
                        first.transform.position,
                        second.transform.position);
                    if (!float.IsFinite(pairDistanceSquared) ||
                        pairDistanceSquared < minPairDistanceSquared ||
                        pairDistanceSquared > maxPairDistanceSquared)
                    {
                        continue;
                    }

                    var combinedScore = firstScore + secondScore;
                    if (!float.IsFinite(combinedScore))
                    {
                        continue;
                    }

                    if (!found ||
                        combinedScore > selectedCombinedScore ||
                        (combinedScore == selectedCombinedScore &&
                            pairDistanceSquared < selectedPairDistanceSquared))
                    {
                        found = true;
                        selectedFirst = first;
                        selectedSecond = second;
                        selectedFirstIndex = firstIndex;
                        selectedSecondIndex = secondIndex;
                        selectedCombinedScore = combinedScore;
                        selectedPairDistanceSquared = pairDistanceSquared;
                    }
                }
            }

            if (!found)
            {
                return false;
            }

            result = new U2EnemyTetherPairSelectionResult(
                selectedFirst,
                selectedSecond,
                selectedFirstIndex,
                selectedSecondIndex,
                selectedCombinedScore,
                selectedPairDistanceSquared);
            return true;
        }

        private static bool IsEligible(
            U2EnemyActor candidate,
            float priorityScore,
            Vector3 origin,
            float minRangeSquared,
            float maxRangeSquared)
        {
            if (candidate == null || !candidate.IsTargetable || !float.IsFinite(priorityScore))
            {
                return false;
            }

            var distanceSquared = DistanceSquared2D(candidate.transform.position, origin);
            return float.IsFinite(distanceSquared) &&
                distanceSquared >= minRangeSquared &&
                distanceSquared <= maxRangeSquared;
        }

        private static float DistanceSquared2D(Vector3 left, Vector3 right)
        {
            var deltaX = right.x - left.x;
            var deltaY = right.y - left.y;
            return deltaX * deltaX + deltaY * deltaY;
        }

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
