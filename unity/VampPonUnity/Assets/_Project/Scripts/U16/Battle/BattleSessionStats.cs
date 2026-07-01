namespace VampPon.UnitySpike.U16.Battle
{
    public enum BattleSessionClearState
    {
        Clear,
        Fail,
    }

    public sealed class BattleSessionStats
    {
        public BattleSessionStats(
            string stageId,
            string stageTitle,
            string difficultyId,
            string difficultyLabel,
            int elapsedSeconds,
            int defeatedEnemies,
            int collectedFragments,
            int collectedMemories,
            int blessing,
            int reachedLevel,
            BattleSessionClearState clearState)
        {
            StageId = string.IsNullOrWhiteSpace(stageId) ? "stage_01" : stageId;
            StageTitle = string.IsNullOrWhiteSpace(stageTitle) ? "はじまりの路地" : stageTitle;
            DifficultyId = string.IsNullOrWhiteSpace(difficultyId) ? "easy" : difficultyId;
            DifficultyLabel = string.IsNullOrWhiteSpace(difficultyLabel) ? "やさしい" : difficultyLabel;
            ElapsedSeconds = elapsedSeconds < 0 ? 0 : elapsedSeconds;
            DefeatedEnemies = defeatedEnemies < 0 ? 0 : defeatedEnemies;
            CollectedFragments = collectedFragments < 0 ? 0 : collectedFragments;
            CollectedMemories = collectedMemories < 0 ? 0 : collectedMemories;
            Blessing = blessing < 0 ? 0 : blessing;
            ReachedLevel = reachedLevel < 1 ? 1 : reachedLevel;
            ClearState = clearState;
        }

        public string StageId { get; }
        public string StageTitle { get; }
        public string DifficultyId { get; }
        public string DifficultyLabel { get; }
        public int ElapsedSeconds { get; }
        public int DefeatedEnemies { get; }
        public int CollectedFragments { get; }
        public int CollectedMemories { get; }
        public int Blessing { get; }
        public int ReachedLevel { get; }
        public BattleSessionClearState ClearState { get; }

        public string ClearStateId => ClearState == BattleSessionClearState.Clear ? "clear" : "fail";

        public static BattleSessionStats SampleClear => new(
            "stage_01",
            "はじまりの路地",
            "easy",
            "やさしい",
            480,
            128,
            12,
            3,
            3,
            5,
            BattleSessionClearState.Clear);
    }
}
