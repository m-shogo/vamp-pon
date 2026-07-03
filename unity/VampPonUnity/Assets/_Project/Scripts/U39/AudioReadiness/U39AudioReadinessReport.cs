using System.Collections.Generic;

namespace VampPon.UnitySpike.U39.AudioReadiness
{
    public sealed class U39AudioReadinessReport
    {
        public bool AudioReadyForRc { get; set; }
        public bool FinalSeReady { get; set; }
        public bool AudioMixerReady { get; set; }
        public bool AudioLatencyMeasured { get; set; }
        public bool HapticMeasured { get; set; }
        public bool RcReady { get; set; }
        public bool ProductionApproved { get; set; }
        public string AudioClippingRisk { get; set; } = string.Empty;
        public List<U39SeInventoryItem> Inventory { get; } = new();
        public List<string> Blockers { get; } = new();
        public List<string> Cautions { get; } = new();
    }
}
