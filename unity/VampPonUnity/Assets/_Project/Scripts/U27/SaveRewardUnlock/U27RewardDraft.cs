namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27RewardDraft
    {
        public int FragmentAmount { get; set; }
        public int MemoryAmount { get; set; }
        public int ClearBonus { get; set; }
        public int DefeatParticipationReward { get; set; }
        public int TimeBonus { get; set; }
        public int KillCountBonus { get; set; }
        public int CollectedCountBonus { get; set; }
        public int LevelReachedBonus { get; set; }
        public int FirstClearBonus { get; set; }
        public int RareAcquiredBonus { get; set; }
        public int EvolutionAchievedBonus { get; set; }
        public int KokuyouUsedFlavorBonus { get; set; }
        public string Rank { get; set; } = "C";
        public bool IsEconomyFinal { get; set; }
    }
}
