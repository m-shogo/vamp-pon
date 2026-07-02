namespace VampPon.UnitySpike.U25.Stage1Loop
{
    public static class U25Stage1TransitionPresenter
    {
        public static string BuildFlowLabel(U25Stage1LoopState state)
        {
            return $"StageSelect -> Battle -> LevelUp -> Rare/Evolution/Kokuyou -> Result -> {state.Phase}";
        }

        public static string BuildResultLabel(U25Stage1LoopState state)
        {
            return $"{state.RunResult.ClearState} / Rank {state.RunResult.Rank} / Lv {state.RunResult.LevelReached} / KO {state.RunResult.KillCount}";
        }
    }
}
