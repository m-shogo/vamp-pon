namespace VampPon.UnitySpike.U34.ReleaseCandidate
{
    public sealed class U34RcBlocker
    {
        public string Id { get; set; } = string.Empty;
        public string Severity { get; set; } = "P0";
        public string Reason { get; set; } = string.Empty;
        public string Evidence { get; set; } = string.Empty;
        public string UnblockCondition { get; set; } = string.Empty;
        public string TargetPhase { get; set; } = string.Empty;
        public string RiskIfIgnored { get; set; } = string.Empty;
    }
}
