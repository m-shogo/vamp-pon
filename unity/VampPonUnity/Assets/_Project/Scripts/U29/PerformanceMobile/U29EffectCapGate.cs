namespace VampPon.UnitySpike.U29.PerformanceMobile
{
    public sealed class U29EffectCapGate
    {
        private readonly U29RuntimeCapPolicy policy;

        public U29EffectCapGate(U29RuntimeCapPolicy policy)
        {
            this.policy = policy ?? new U29RuntimeCapPolicy();
        }

        public bool CanSpawnHitEffect(int activeHitEffects) => activeHitEffects < policy.MaxHitEffects;
        public bool CanSpawnParticleBurst(int activeParticles) => activeParticles < policy.MaxParticles;
        public bool ShouldThrottleEnemySpawn(int activeEnemies) => activeEnemies >= policy.MaxEnemies;
        public bool ShouldSkipLowPriorityEffect(int activeHitEffects, bool climaxActive) => climaxActive && activeHitEffects >= policy.MaxHitEffects - 4;
    }
}
