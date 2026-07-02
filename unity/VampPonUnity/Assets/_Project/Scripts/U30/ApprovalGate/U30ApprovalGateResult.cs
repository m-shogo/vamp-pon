namespace VampPon.UnitySpike.U30.ApprovalGate
{
    public sealed class U30ApprovalGateResult
    {
        public U30ApprovalGateResult(
            string id,
            string label,
            U30ApprovalGateStatus status,
            bool critical,
            string evidence,
            string note)
        {
            Id = id;
            Label = label;
            Status = status;
            Critical = critical;
            Evidence = evidence;
            Note = note;
        }

        public string Id { get; }
        public string Label { get; }
        public U30ApprovalGateStatus Status { get; }
        public bool Critical { get; }
        public string Evidence { get; }
        public string Note { get; }
    }
}
