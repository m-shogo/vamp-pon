namespace VampPon.UnitySpike.U30.ApprovalGate
{
    public sealed class U30ApprovalState
    {
        public string StageId { get; set; } = "stage1";
        public string VersionTag { get; set; } = "U30-2026-07-03";
        public bool ProductionApproved { get; set; }
        public bool InternalPreviewReady { get; set; }
        public bool MobileQaReady { get; set; }
        public bool AssetReplacementReady { get; set; }
        public bool PerformanceQaReady { get; set; }
        public int GateCount { get; set; }
        public int PassCount { get; set; }
        public int CautionCount { get; set; }
        public int FailCount { get; set; }
        public int NotMeasuredCount { get; set; }
        public int CriticalBlockerCount { get; set; }
    }
}
