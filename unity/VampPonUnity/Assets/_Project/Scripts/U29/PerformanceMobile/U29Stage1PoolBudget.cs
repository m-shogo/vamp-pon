namespace VampPon.UnitySpike.U29.PerformanceMobile
{
    public sealed class U29Stage1PoolBudget
    {
        public int EnemyPoolSize { get; set; } = 42;
        public int PickupPoolSize { get; set; } = 56;
        public int ProjectilePoolSize { get; set; } = 28;
        public int HitEffectPoolSize { get; set; } = 20;
        public int DamageNumberPoolSize { get; set; } = 12;
        public int ParticleBurstPoolSize { get; set; } = 16;
        public string PoolingInterfaceDraft { get; set; } = "TryRent / Return / ResetAllOnSceneTransition";
        public bool GcAllocationTargetPerFrameZero { get; set; } = true;
    }
}
