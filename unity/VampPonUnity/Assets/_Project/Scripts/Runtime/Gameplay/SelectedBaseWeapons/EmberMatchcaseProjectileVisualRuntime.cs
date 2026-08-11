using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    /// <summary>
    /// Caller-owned scratch state. Collections allocate once when the visual context is created,
    /// then are cleared/reused for each prototype fire.
    /// </summary>
    public sealed class EmberMatchcaseProjectileVisualContext
    {
        internal List<U2ProjectileActor> ProjectileScratch { get; } = new(16);
        internal HashSet<U2ProjectileActor> ActiveStatusBeforeFire { get; } = new();
    }

    /// <summary>
    /// Prototype-only local cue for the first Selected16 vertical slice.
    /// No screen flash, bloom, fog or ParticleSystem is created here.
    /// </summary>
    public static class EmberMatchcaseProjectileVisualRuntime
    {
        public const string VisualAuthority = "PROTOTYPE_VISUAL_NOT_FINAL";
        public const float PrototypeScaleMultiplier = 0.78f;
        public static readonly Color PrototypeTint = new(1f, 0.58f, 0.24f, 1f);

        public static int FireWithPrototypeVisual(
            U2BattleController battle,
            float damage,
            int pierce,
            int maxTargets,
            EnemyStatusApplicationPolicy burnPolicy,
            EmberMatchcasePrototypeTelemetry telemetry,
            EmberMatchcaseProjectileVisualContext visualContext)
        {
            if (battle == null) throw new ArgumentNullException(nameof(battle));
            if (visualContext == null) throw new ArgumentNullException(nameof(visualContext));
            if (maxTargets <= 0) return 0;

            CaptureActiveStatusProjectiles(battle, visualContext);
            var fired = EmberMatchcasePrototypeRuntime.Fire(
                battle,
                damage,
                pierce,
                maxTargets,
                burnPolicy,
                telemetry);
            if (fired <= 0) return fired;

            ApplyCueToNewStatusProjectiles(battle, visualContext);
            return fired;
        }

        private static void CaptureActiveStatusProjectiles(
            U2BattleController battle,
            EmberMatchcaseProjectileVisualContext context)
        {
            context.ActiveStatusBeforeFire.Clear();
            FillProjectileScratch(battle, context.ProjectileScratch);
            for (var i = 0; i < context.ProjectileScratch.Count; i++)
            {
                var projectile = context.ProjectileScratch[i];
                if (projectile != null && projectile.IsActive && projectile.HasStatusApplication)
                {
                    context.ActiveStatusBeforeFire.Add(projectile);
                }
            }
        }

        private static int ApplyCueToNewStatusProjectiles(
            U2BattleController battle,
            EmberMatchcaseProjectileVisualContext context)
        {
            FillProjectileScratch(battle, context.ProjectileScratch);
            var styled = 0;
            for (var i = 0; i < context.ProjectileScratch.Count; i++)
            {
                var projectile = context.ProjectileScratch[i];
                if (projectile == null || !projectile.IsActive || !projectile.HasStatusApplication) continue;
                if (context.ActiveStatusBeforeFire.Contains(projectile)) continue;

                var renderer = projectile.GetComponent<SpriteRenderer>();
                if (renderer == null) continue;
                var resetter = projectile.GetComponent<EmberMatchcaseProjectileVisualResetter>();
                if (resetter == null)
                {
                    resetter = projectile.gameObject.AddComponent<EmberMatchcaseProjectileVisualResetter>();
                }
                resetter.Apply(renderer, PrototypeTint, PrototypeScaleMultiplier);
                styled++;
            }
            return styled;
        }

        private static void FillProjectileScratch(
            U2BattleController battle,
            List<U2ProjectileActor> scratch)
        {
            scratch.Clear();
            battle.GetComponentsInChildren(true, scratch);
        }
    }
}
