namespace VampPon.UnitySpike.U21.VerticalSlice
{
    public sealed class U21Stage1VerticalSliceConfig
    {
        public string StageId { get; set; } = "stage_01";
        public string StageTitle { get; set; } = "はじまりの路地";
        public string DifficultyId { get; set; } = "easy";
        public string DifficultyLabel { get; set; } = "やさしい";
        public int ProofDurationSeconds { get; set; } = 480;
        public int ClearDefeatThreshold { get; set; } = 100;
        public int ExpToLevelUp { get; set; } = 100;
        public int KokuyouGaugeMax { get; set; } = 100;
        public int KokuyouDamageCharge { get; set; } = 25;
        public bool EnableRareProof { get; set; } = true;
        public bool EnableEvolutionProof { get; set; } = true;
        public bool EnableHealingDropProof { get; set; } = true;
        public int PeakProofParticleCount { get; set; } = 24;
        public int ActiveProofObjectCount { get; set; } = 96;

        public static U21Stage1VerticalSliceConfig Default => new();
    }
}
