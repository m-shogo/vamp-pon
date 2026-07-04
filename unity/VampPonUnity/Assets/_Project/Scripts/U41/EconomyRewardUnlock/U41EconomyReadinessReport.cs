using System.Collections.Generic;

namespace VampPon.UnitySpike.U41.EconomyRewardUnlock
{
    public sealed class U41EconomyReadinessReport
    {
        public bool EconomyReadyForRc { get; set; }
        public bool RewardReadyForRc { get; set; }
        public bool UnlockReadyForRc { get; set; }
        public bool SaveEconomySafe { get; set; }
        public bool ProductionApproved { get; set; }
        public bool RcReady { get; set; }
        public bool ProductionEconomyFinal { get; set; }
        public bool MobileMetricsReady { get; set; }
        public bool AudioMixerReady { get; set; }
        public bool HapticMeasured { get; set; }
        public List<U41RankRewardBand> RankBands { get; } = new();
        public List<U41UnlockHardeningRule> UnlockRules { get; } = new();
        public List<string> RemainingCautions { get; } = new();
    }
}
