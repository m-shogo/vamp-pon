namespace VampPon.UnitySpike.U41.EconomyRewardUnlock
{
    public sealed class U41RewardBand
    {
        public U41RewardReason Reason { get; set; }
        public int FragmentAmount { get; set; }
        public int MemoryAmount { get; set; }
        public string DisplayLabel { get; set; } = string.Empty;
        public U41RewardRisk Risk { get; set; }
    }
}
