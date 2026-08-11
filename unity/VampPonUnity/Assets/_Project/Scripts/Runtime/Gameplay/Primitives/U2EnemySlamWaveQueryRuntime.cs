using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.Runtime.Gameplay.Primitives
{
    /// <summary>
    /// Deterministic sector-band query for directional ground-wave prototype work.
    ///
    /// The caller supplies inner/outer radii so the same primitive can represent either a
    /// one-shot directional slam (inner=0) or a propagating wave band over multiple samples.
    /// No weapon identity, timing, damage, break, Status, or knockback defaults live here.
    /// </summary>
    public static class U2EnemySlamWaveQueryRuntime
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        public static int SelectTargets(
            IReadOnlyList<U2EnemyActor> candidates,
            List<U2EnemyActor> results,
            Vector3 origin,
            Vector2 forward,
            float innerRadius,
            float outerRadius,
            float halfAngleDegrees,
            int maxTargets)
        {
            if (results == null) throw new ArgumentNullException(nameof(results));
            if (ReferenceEquals(candidates, results)) throw new ArgumentException("candidate source and result scratch must be distinct", nameof(results));

            results.Clear();
            if (candidates == null || maxTargets <= 0 || innerRadius < 0f || outerRadius <= 0f || innerRadius > outerRadius || halfAngleDegrees < 0f || halfAngleDegrees > 180f)
            {
                return 0;
            }

            var forwardLengthSquared = forward.x * forward.x + forward.y * forward.y;
            if (forwardLengthSquared <= 0.000001f)
            {
                return 0;
            }

            var forwardInverseLength = 1f / (float)Math.Sqrt(forwardLengthSquared);
            var forwardX = forward.x * forwardInverseLength;
            var forwardY = forward.y * forwardInverseLength;
            var minimumDot = (float)Math.Cos(halfAngleDegrees * Math.PI / 180.0);
            var innerRadiusSquared = innerRadius * innerRadius;
            var outerRadiusSquared = outerRadius * outerRadius;

            for (var candidateIndex = 0; candidateIndex < candidates.Count; candidateIndex++)
            {
                var candidate = candidates[candidateIndex];
                if (candidate == null || !candidate.IsTargetable)
                {
                    continue;
                }

                var delta = candidate.transform.position - origin;
                var distanceSquared = delta.x * delta.x + delta.y * delta.y;
                if (distanceSquared + 0.000001f < innerRadiusSquared || distanceSquared > outerRadiusSquared + 0.000001f)
                {
                    continue;
                }

                if (distanceSquared > 0.000001f)
                {
                    var inverseDistance = 1f / (float)Math.Sqrt(distanceSquared);
                    var dot = forwardX * delta.x * inverseDistance + forwardY * delta.y * inverseDistance;
                    if (dot + 0.000001f < minimumDot)
                    {
                        continue;
                    }
                }

                var insertIndex = results.Count;
                for (var resultIndex = 0; resultIndex < results.Count; resultIndex++)
                {
                    var existingDelta = results[resultIndex].transform.position - origin;
                    var existingDistanceSquared = existingDelta.x * existingDelta.x + existingDelta.y * existingDelta.y;
                    if (distanceSquared + 0.000001f < existingDistanceSquared)
                    {
                        insertIndex = resultIndex;
                        break;
                    }
                }

                if (insertIndex >= maxTargets)
                {
                    continue;
                }

                results.Insert(insertIndex, candidate);
                if (results.Count > maxTargets)
                {
                    results.RemoveAt(results.Count - 1);
                }
            }

            return results.Count;
        }
    }
}
