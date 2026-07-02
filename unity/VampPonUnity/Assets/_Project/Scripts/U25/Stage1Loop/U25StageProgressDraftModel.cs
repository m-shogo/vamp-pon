namespace VampPon.UnitySpike.U25.Stage1Loop
{
    public sealed class U25StageProgressDraftModel
    {
        public string StageId { get; set; } = "stage_01";
        public bool IsPlayable { get; set; } = true;
        public bool IsClearDraft { get; set; } = true;
        public string PreviousResultStamp { get; set; } = "Rank A / 欠片 12";
        public bool IsSaveFinal { get; set; }
    }
}
