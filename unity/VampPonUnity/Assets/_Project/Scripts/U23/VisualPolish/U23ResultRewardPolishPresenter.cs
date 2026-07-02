namespace VampPon.UnitySpike.U23.VisualPolish
{
    public static class U23ResultRewardPolishPresenter
    {
        public static string BuildSummary(U23ResultLedgerPolishState state)
        {
            return state == null
                ? "Result polish pending"
                : $"rank={state.Rank} / seal={state.HasRankSeal} / rewards={state.RewardCardCount}";
        }
    }
}
