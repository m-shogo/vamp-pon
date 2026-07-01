namespace VampPon.UnitySpike.U15.Contracts
{
    public readonly struct StageStartRequest
    {
        public StageStartRequest(string stageId, string stageTitle, string difficultyId, string difficultyLabel, string requestedAt, string source)
        {
            StageId = stageId;
            StageTitle = stageTitle;
            DifficultyId = difficultyId;
            DifficultyLabel = difficultyLabel;
            RequestedAt = requestedAt;
            Source = source;
        }

        public string StageId { get; }
        public string StageTitle { get; }
        public string DifficultyId { get; }
        public string DifficultyLabel { get; }
        public string RequestedAt { get; }
        public string Source { get; }

        public static StageStartRequest Sample => new("stage_01", "はじまりの路地", "easy", "やさしい", "proof-start", "stage_select");
    }
}
