using UnityEngine;

namespace VampPon.UnitySpike.U22.BattleVisual
{
    public sealed class U22BattleVisualPolishState
    {
        public Vector2 PlayerPosition { get; set; } = new(0f, -118f);
        public Vector2 PlayerFacing { get; set; } = new(1f, 0f);
        public float PlayerHpNormalized { get; set; } = 0.72f;
        public int PlayerLevel { get; set; } = 5;
        public float CurrentExpNormalized { get; set; } = 0.64f;
        public int DefeatedEnemies { get; set; } = 128;
        public int FragmentCount { get; set; } = 12;
        public int MemoryCount { get; set; } = 3;
        public float KokuyouGaugeNormalized { get; set; } = 1f;
        public bool KokuyouReady { get; set; } = true;
        public bool KokuyouActive { get; set; }
        public int EnemyVisualCount { get; set; } = 5;
        public int ProjectileVisualCount { get; set; } = 3;
        public int ExpPickupVisualCount { get; set; } = 5;
        public bool HeartDropVisible { get; set; } = true;
        public bool MemoryShardVisible { get; set; } = true;
        public bool LastHitFeedback { get; set; } = true;
        public bool LastPickupFeedback { get; set; } = true;
        public bool LastKokuyouFeedback { get; set; } = true;
        public int ParticleCount { get; set; } = 30;
        public int ActiveObjectCount { get; set; } = 112;
        public bool ProofDebugVisible { get; set; } = true;
        public float TimeScaleFinal { get; set; } = 1f;
        public string PhaseLabel { get; set; } = "Stage1 Playing";
        public string ProofLabel { get; set; } = "U22 Battle Visual Proof / productionApproved=0";
    }
}
