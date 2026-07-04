using VampPon.UnitySpike.U27.SaveRewardUnlock;

namespace VampPon.UnitySpike.U41.EconomyRewardUnlock
{
    public sealed class U41UnlockHardeningRule
    {
        public string UnlockId { get; set; } = string.Empty;
        public U27UnlockType UnlockType { get; set; }
        public string UnlockReason { get; set; } = string.Empty;
        public string DisplayLabel { get; set; } = string.Empty;
        public U41UnlockDisplayPriority Priority { get; set; }
        public U41UnlockReadinessStatus ReadinessStatus { get; set; }
        public string FutureProductionNote { get; set; } = string.Empty;
    }
}
