using System;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    /// <summary>
    /// First Selected16-specific Unity caller.
    ///
    /// This is an admission/prototype boundary, not a live registry entry. Damage, pierce,
    /// target count and every BURN tuning value are supplied by the caller so this class
    /// cannot accidentally freeze prototype balance as Canon.
    /// </summary>
    public static class EmberMatchcasePrototypeRuntime
    {
        public const string WeaponId = "ember_matchcase";
        public const string ContentStatusId = "BURN";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeStatus = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";

        public static EnemyStatusApplicationRequest CreateBurnRequest(
            EnemyStatusApplicationPolicy burnPolicy)
        {
            return new EnemyStatusApplicationRequest(
                EnemyStatusRuntimeKind.Burn,
                burnPolicy);
        }

        public static int Fire(
            U2BattleController battle,
            float damage,
            int pierce,
            int maxTargets,
            EnemyStatusApplicationPolicy burnPolicy)
        {
            if (battle == null) throw new ArgumentNullException(nameof(battle));
            if (maxTargets <= 0) return 0;

            return battle.FireGameplayProjectilesAtNearestTargets(
                damage,
                pierce,
                maxTargets,
                CreateBurnRequest(burnPolicy));
        }
    }
}
