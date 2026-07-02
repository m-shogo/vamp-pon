namespace VampPon.UnitySpike.U21.VerticalSlice
{
    public static class U21Stage1VerticalSlicePresenter
    {
        public static string BuildFlowLabel(U21Stage1VerticalSliceState state)
        {
            if (state == null) return "U21: not started";
            var result = state.LastResultSummary == null
                ? "Result pending"
                : $"{state.LastResultSummary.ClearState} / Rank {state.LastResultSummary.Rank}";
            return $"StageSelect -> Stage1 -> Result -> StageSelect | {state.CurrentPhase} | {result}";
        }

        public static string BuildStatsLabel(U21Stage1VerticalSliceState state)
        {
            if (state == null) return "stats pending";
            return $"Lv {state.PlayerLevel} / EXP {state.CurrentExp} / KO {state.DefeatedEnemies} / 欠片 {state.CollectedFragments} / 記憶 {state.CollectedMemories} / Heart {state.CollectedHearts}";
        }
    }
}
