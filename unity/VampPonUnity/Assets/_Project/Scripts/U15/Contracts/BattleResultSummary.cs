namespace VampPon.UnitySpike.U15.Contracts
{
    public sealed class BattleResultSummary
    {
        public BattleResultSummary(
            string clearState,
            string stageId,
            string stageTitle,
            string difficultyId,
            string difficultyLabel,
            int elapsedSeconds,
            string elapsedLabel,
            int defeatedEnemies,
            int fragments,
            int memories,
            int blessing,
            string rank,
            RewardSummary rewardSummary,
            UnlockCandidate unlockCandidate)
        {
            ClearState = clearState;
            StageId = stageId;
            StageTitle = stageTitle;
            DifficultyId = difficultyId;
            DifficultyLabel = difficultyLabel;
            ElapsedSeconds = elapsedSeconds;
            ElapsedLabel = elapsedLabel;
            DefeatedEnemies = defeatedEnemies;
            Fragments = fragments;
            Memories = memories;
            Blessing = blessing;
            Rank = rank;
            RewardSummary = rewardSummary ?? RewardSummary.Empty;
            UnlockCandidate = unlockCandidate;
        }

        public string ClearState { get; }
        public string StageId { get; }
        public string StageTitle { get; }
        public string DifficultyId { get; }
        public string DifficultyLabel { get; }
        public int ElapsedSeconds { get; }
        public string ElapsedLabel { get; }
        public int DefeatedEnemies { get; }
        public int Fragments { get; }
        public int Memories { get; }
        public int Blessing { get; }
        public string Rank { get; }
        public RewardSummary RewardSummary { get; }
        public UnlockCandidate UnlockCandidate { get; }

        public static BattleResultSummary Sample => new(
            "clear",
            "stage_01",
            "はじまりの路地",
            "easy",
            "やさしい",
            480,
            "08:00",
            128,
            12,
            3,
            3,
            "A",
            RewardSummary.Sample,
            UnlockCandidate.None);
    }
}
