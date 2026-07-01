namespace VampPon.UnitySpike.U15.Contracts
{
    public readonly struct UnlockCandidate
    {
        public UnlockCandidate(bool hasCandidate, string stageId, string stageTitle, string reason)
        {
            HasCandidate = hasCandidate;
            StageId = stageId;
            StageTitle = stageTitle;
            Reason = reason;
        }

        public bool HasCandidate { get; }
        public string StageId { get; }
        public string StageTitle { get; }
        public string Reason { get; }

        public static UnlockCandidate None => new(false, string.Empty, string.Empty, "U15ではunlock確定しない");
    }
}
