using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    /// <summary>
    /// Selected16 prototype caller for 送り風の扇 / bellows_fan.
    ///
    /// This is implementation-review evidence only. It is intentionally not wired into
    /// Stage1GameplayRuntimeCoordinator or the live weapon registry.
    /// All cone, knockback, and Status tuning remains caller supplied.
    /// </summary>
    public static class BellowsFanPrototypeRuntime
    {
        public const string WeaponId = "bellows_fan";
        public const string ContentStatusId = "DISORIENTED";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";

        public static EnemyStatusApplicationRequest CreateDisorientedRequest(EnemyStatusApplicationPolicy policy)
            => new(EnemyStatusRuntimeKind.Disoriented, policy);

        public static int Fire(
            IReadOnlyList<U2EnemyActor> candidates,
            List<U2EnemyActor> targetScratch,
            Vector3 origin,
            Vector2 forward,
            float range,
            float halfAngleDegrees,
            int maxTargets,
            float knockbackDistance,
            EnemyStatusApplicationPolicy disorientedPolicy)
        {
            if (targetScratch == null)
            {
                return 0;
            }

            if (maxTargets <= 0 || range <= 0f || knockbackDistance <= 0f)
            {
                targetScratch.Clear();
                return 0;
            }

            var selected = U2EnemyConeQueryRuntime.SelectTargets(
                candidates,
                targetScratch,
                origin,
                forward,
                range,
                halfAngleDegrees,
                maxTargets);
            if (selected <= 0)
            {
                return 0;
            }

            var statusRequest = CreateDisorientedRequest(disorientedPolicy);
            for (var index = 0; index < targetScratch.Count; index++)
            {
                var target = targetScratch[index];
                statusRequest.ApplyTo(target.Statuses);
                var delta = target.transform.position - origin;
                U2EnemyKnockbackRuntime.TryApply(
                    target,
                    new Vector2(delta.x, delta.y),
                    knockbackDistance);
            }

            return selected;
        }
    }
}
