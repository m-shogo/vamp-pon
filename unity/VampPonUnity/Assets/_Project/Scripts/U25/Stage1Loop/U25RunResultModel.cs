namespace VampPon.UnitySpike.U25.Stage1Loop
{
    public sealed class U25RunResultModel
    {
        public string ClearState { get; set; } = "clear";
        public string Rank { get; set; } = "A";
        public int ElapsedSeconds { get; set; } = 480;
        public int KillCount { get; set; } = 128;
        public int LevelReached { get; set; } = 5;
        public int CollectedFragments { get; set; } = 12;
        public int CollectedMemories { get; set; } = 3;
        public bool KokuyouUsed { get; set; } = true;
        public bool EvolutionAchieved { get; set; } = true;
        public bool RareAcquired { get; set; } = true;
    }
}
