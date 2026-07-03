using System.Collections.Generic;

namespace VampPon.UnitySpike.U40.FinalAssetReplacement
{
    public sealed class U40FinalAssetReadinessReport
    {
        public bool AssetReplacementReady { get; set; }
        public bool ProductionApproved { get; set; }
        public bool RcReady { get; set; }
        public bool MobileMetricsReady { get; set; }
        public bool SpriteAtlasPackingReady { get; set; }
        public bool FinalSeReady { get; set; }
        public bool AudioMixerReady { get; set; }
        public List<U40FinalAssetReplacementEntry> Entries { get; } = new();
        public List<string> RemainingNeedsReview { get; } = new();
        public List<string> RemainingBlockedFromRuntime { get; } = new();
    }
}
