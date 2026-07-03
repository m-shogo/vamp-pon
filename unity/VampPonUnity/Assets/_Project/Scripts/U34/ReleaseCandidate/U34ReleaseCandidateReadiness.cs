using System.Collections.Generic;
using System.Linq;

namespace VampPon.UnitySpike.U34.ReleaseCandidate
{
    public sealed class U34ReleaseCandidateReadiness
    {
        public string Version { get; set; } = "U34";
        public bool RcReady { get; set; }
        public bool ProductionApproved { get; set; }
        public bool InternalPreviewReady { get; set; } = true;
        public bool MobileQaReady { get; set; } = true;
        public bool MobileMetricsReady { get; set; }
        public bool AssetReplacementReady { get; set; }
        public bool BalanceHardeningReady { get; set; } = true;
        public bool SpriteAtlasPackingReady { get; set; } = true;
        public U34RcVerdict Verdict { get; set; } = U34RcVerdict.NotReady;
        public List<U34RcChecklistItem> ChecklistItems { get; } = new();
        public List<U34RcBlocker> Blockers { get; } = new();
        public List<U34RcCaution> Cautions { get; } = new();
        public List<U34RcNextAction> NextActions { get; } = new();
        public int BlockerCount => Blockers.Count;
        public int CautionCount => Cautions.Count;
        public int NotMeasuredCount => ChecklistItems.Count(item => item.Status == U34RcStatus.NotMeasured);
    }
}
