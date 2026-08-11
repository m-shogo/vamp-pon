using System;
using UnityEngine;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.Runtime.Gameplay.Primitives
{
    /// <summary>
    /// Reusable, balance-neutral enemy knockback primitive.
    ///
    /// This helper owns no weapon identity, duration, stun, velocity, or default distance.
    /// Callers supply the direction and displacement distance explicitly.
    /// The enemy resumes its normal movement on the next Tick unless another shared
    /// mechanic (for example break/stagger) is currently suppressing pursuit.
    /// </summary>
    public static class U2EnemyKnockbackRuntime
    {
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";

        public static bool TryApply(U2EnemyActor enemy, Vector2 direction, float distance)
        {
            if (enemy == null || !enemy.IsTargetable || distance <= 0f)
            {
                return false;
            }

            var lengthSquared = direction.x * direction.x + direction.y * direction.y;
            if (lengthSquared <= 0.000001f)
            {
                return false;
            }

            var inverseLength = 1f / (float)Math.Sqrt(lengthSquared);
            var displacement = new Vector3(
                direction.x * inverseLength * distance,
                direction.y * inverseLength * distance,
                0f);
            enemy.transform.position += displacement;
            U2EnemyBreakStaggerRuntime.NotifyExternalDisplacement(enemy);
            return true;
        }

        public static bool TryApplyFromPoint(U2EnemyActor enemy, Vector3 sourcePosition, float distance)
        {
            if (enemy == null)
            {
                return false;
            }

            var delta = enemy.transform.position - sourcePosition;
            return TryApply(enemy, new Vector2(delta.x, delta.y), distance);
        }
    }
}
