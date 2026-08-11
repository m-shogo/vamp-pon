using System;
using System.Collections.Generic;
using UnityEngine;

namespace VampPon.UnitySpike.Runtime.Gameplay.Primitives
{
    /// <summary>
    /// Deterministic caller-score-driven chain selector.
    /// Weapon identity, Status meaning, damage, cadence and visuals remain caller-owned.
    /// </summary>
    public static class U2EnemyTargetChainSelectionRuntime
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        public static int SelectChain(
            IReadOnlyList<U2EnemyActor> candidates,
            IReadOnlyList<float> priorityScores,
            Vector3 origin,
            float maxFirstRange,
            float maxHopDistance,
            int maxTargets,
            List<U2EnemyActor> results)
        {
            if (candidates == null ||
                priorityScores == null ||
                results == null ||
                ReferenceEquals(candidates, results) ||
                candidates.Count != priorityScores.Count ||
                !IsFinite(origin) ||
                !IsFinitePositive(maxFirstRange) ||
                !IsFinitePositive(maxHopDistance) ||
                maxTargets <= 0)
            {
                results?.Clear();
                return 0;
            }

            results.Clear();
            var anchor = origin;
            for (var hop = 0; hop < maxTargets; hop++)
            {
                var range = hop == 0 ? maxFirstRange : maxHopDistance;
                var rangeSquared = range * range;
                var selectedIndex = -1;
                var selectedScore = float.NegativeInfinity;
                var selectedDistanceSquared = float.PositiveInfinity;

                for (var i = 0; i < candidates.Count; i++)
                {
                    var candidate = candidates[i];
                    var score = priorityScores[i];
                    if (candidate == null ||
                        !candidate.IsTargetable ||
                        !float.IsFinite(score) ||
                        ContainsReference(results, candidate))
                    {
                        continue;
                    }

                    var distanceSquared = DistanceSquared2D(anchor, candidate.transform.position);
                    if (!float.IsFinite(distanceSquared) || distanceSquared > rangeSquared) continue;

                    if (selectedIndex < 0 ||
                        score > selectedScore ||
                        (score == selectedScore && distanceSquared < selectedDistanceSquared))
                    {
                        selectedIndex = i;
                        selectedScore = score;
                        selectedDistanceSquared = distanceSquared;
                    }
                }

                if (selectedIndex < 0) break;
                var selected = candidates[selectedIndex];
                results.Add(selected);
                anchor = selected.transform.position;
            }

            return results.Count;
        }

        private static bool ContainsReference(List<U2EnemyActor> results, U2EnemyActor candidate)
        {
            for (var i = 0; i < results.Count; i++)
            {
                if (ReferenceEquals(results[i], candidate)) return true;
            }
            return false;
        }

        private static float DistanceSquared2D(Vector3 left, Vector3 right)
        {
            var deltaX = right.x - left.x;
            var deltaY = right.y - left.y;
            return deltaX * deltaX + deltaY * deltaY;
        }

        private static bool IsFinite(Vector3 value)
            => float.IsFinite(value.x) && float.IsFinite(value.y) && float.IsFinite(value.z);

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;
    }
}
