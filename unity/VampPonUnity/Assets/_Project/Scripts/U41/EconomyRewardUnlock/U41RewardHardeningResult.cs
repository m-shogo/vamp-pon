using System.Collections.Generic;

namespace VampPon.UnitySpike.U41.EconomyRewardUnlock
{
    public sealed class U41RewardHardeningResult
    {
        public int FragmentAmount { get; set; }
        public int MemoryAmount { get; set; }
        public string Rank { get; set; } = string.Empty;
        public bool IsProductionEconomyFinal { get; set; }
        public List<U41RewardBand> Bands { get; } = new();
    }
}
