namespace VampPon.UnitySpike.U34.ReleaseCandidate
{
    public sealed class U34RcChecklistItem
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string PassCriteria { get; set; } = string.Empty;
        public string CurrentStatus { get; set; } = string.Empty;
        public string Evidence { get; set; } = string.Empty;
        public U34RcStatus Status { get; set; } = U34RcStatus.Blocked;
        public string OwnerFuturePhase { get; set; } = string.Empty;
        public string NextAction { get; set; } = string.Empty;
    }
}
