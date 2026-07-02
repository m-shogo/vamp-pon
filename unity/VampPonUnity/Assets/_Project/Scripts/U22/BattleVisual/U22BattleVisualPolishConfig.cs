namespace VampPon.UnitySpike.U22.BattleVisual
{
    public sealed class U22BattleVisualPolishConfig
    {
        public int ProofDurationSeconds { get; set; } = 480;
        public int EnemyVisualCount { get; set; } = 5;
        public int ProjectileVisualCount { get; set; } = 3;
        public int ExpPickupVisualCount { get; set; } = 5;
        public int PeakProofParticleCount { get; set; } = 30;
        public int ActiveProofObjectCount { get; set; } = 112;
        public bool ProofDebugVisible { get; set; } = true;

        public static U22BattleVisualPolishConfig Default => new();
    }
}
