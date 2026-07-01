using VampPon.UnitySpike.U15.Contracts;

namespace VampPon.UnitySpike.U16.Battle
{
    public static class BattleResultSummaryBuilder
    {
        public static BattleResultSummary FromStats(BattleSessionStats stats)
        {
            stats ??= BattleSessionStats.SampleClear;
            var reward = new RewardSummary(
                new[] { "記憶", "墨", "灯" },
                stats.CollectedFragments,
                stats.CollectedMemories,
                stats.Blessing);

            var unlock = new UnlockCandidate(
                false,
                string.Empty,
                string.Empty,
                "U16ではStage解放を確定しない");

            return new BattleResultSummary(
                stats.ClearStateId,
                stats.StageId,
                stats.StageTitle,
                stats.DifficultyId,
                stats.DifficultyLabel,
                stats.ElapsedSeconds,
                BattleSessionClock.FormatElapsed(stats.ElapsedSeconds),
                stats.DefeatedEnemies,
                stats.CollectedFragments,
                stats.CollectedMemories,
                stats.Blessing,
                CalculateProofRank(stats),
                reward,
                unlock);
        }

        public static string CalculateProofRank(BattleSessionStats stats)
        {
            stats ??= BattleSessionStats.SampleClear;
            if (stats.ClearState == BattleSessionClearState.Clear && stats.ElapsedSeconds >= 480 && stats.DefeatedEnemies >= 100)
            {
                return "A";
            }

            return stats.ClearState == BattleSessionClearState.Clear ? "B" : "C";
        }
    }
}
