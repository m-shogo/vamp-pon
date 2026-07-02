namespace VampPon.UnitySpike.U20.MobileQA
{
    public readonly struct U20MobileQAResult
    {
        public U20MobileQAResult(string label, U20MobileQAStatus status, string note)
        {
            Label = label;
            Status = status;
            Note = note;
        }

        public string Label { get; }
        public U20MobileQAStatus Status { get; }
        public string Note { get; }
        public bool IsBlockingFailure => Status == U20MobileQAStatus.Fail;
    }
}
