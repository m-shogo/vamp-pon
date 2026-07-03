using VampPon.UnitySpike.U29.PerformanceMobile;

namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35RuntimeCountSampler
    {
        public U35RuntimeCountSample BuildBudgetSample()
        {
            return new U35RuntimeCountSample
            {
                ActiveEnemiesCount = U29Stage1PerformanceConstants.MaxActiveEnemies,
                ActivePickupsCount = U29Stage1PerformanceConstants.MaxActivePickups,
                ActiveProjectilesCount = U29Stage1PerformanceConstants.MaxActiveProjectiles,
                ActiveHitEffectsCount = U29Stage1PerformanceConstants.MaxActiveHitEffects,
                ActiveParticlesCount = U29Stage1PerformanceConstants.MaxActiveParticles,
            };
        }
    }
}
