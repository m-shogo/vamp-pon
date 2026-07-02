namespace VampPon.UnitySpike.U29.PerformanceMobile
{
    public sealed class U29RuntimeCapPolicy
    {
        public int MaxEnemies { get; set; } = U29Stage1PerformanceConstants.MaxActiveEnemies;
        public int MaxPickups { get; set; } = U29Stage1PerformanceConstants.MaxActivePickups;
        public int MaxProjectiles { get; set; } = U29Stage1PerformanceConstants.MaxActiveProjectiles;
        public int MaxHitEffects { get; set; } = U29Stage1PerformanceConstants.MaxActiveHitEffects;
        public int MaxParticles { get; set; } = U29Stage1PerformanceConstants.MaxActiveParticles;
        public string CapReachedFallback { get; set; } = "prefer offscreen cleanup, spawn throttle, or effect skip; do not delete visible enemies suddenly";
        public string RetryResetPolicy { get; set; } = "return pooled instances and clear transient effects on retry";
        public string ResultTransitionCleanupPolicy { get; set; } = "clear projectiles, pickups, hit effects, particles, climax overlays before Result";
        public string KokuyouEvolutionCapPolicy { get; set; } = "reserve effect slots for Kokuyou / Evolution while skipping low-priority hit puffs";
    }
}
