namespace VampPon.UnitySpike.U14.Flow
{
    public readonly struct BattleStartRequestProof
    {
        public BattleStartRequestProof(string selectedStageId, string selectedDifficulty, string startTime)
        {
            SelectedStageId = selectedStageId;
            SelectedDifficulty = selectedDifficulty;
            StartTime = startTime;
        }

        public string SelectedStageId { get; }
        public string SelectedDifficulty { get; }
        public string StartTime { get; }

        public static BattleStartRequestProof Sample => new("stage_01", "やさしい", "proof-start");
    }
}
