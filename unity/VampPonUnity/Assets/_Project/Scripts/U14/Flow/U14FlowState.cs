namespace VampPon.UnitySpike.U14.Flow
{
    public static class U14FlowState
    {
        public static string SelectedStageId { get; private set; } = "stage_01";
        public static string SelectedDifficulty { get; private set; } = "やさしい";
        public static string LastPlayedStageId { get; private set; } = "";
        public static BattleResultSummaryProof LastResultSummary { get; private set; }
        public static string FlowStep { get; private set; } = "stage_select";

        public static void ResetProof()
        {
            SelectedStageId = "stage_01";
            SelectedDifficulty = "やさしい";
            LastPlayedStageId = "";
            LastResultSummary = null;
            FlowStep = "stage_select";
        }

        public static void SetBattleStart(BattleStartRequestProof request)
        {
            SelectedStageId = request.SelectedStageId;
            SelectedDifficulty = request.SelectedDifficulty;
            FlowStep = "battle";
        }

        public static void SetResult(BattleResultSummaryProof summary)
        {
            LastPlayedStageId = summary.StageId;
            LastResultSummary = summary;
            FlowStep = "result";
        }

        public static void SetStageSelectReturn()
        {
            FlowStep = "stage_select";
        }
    }
}
