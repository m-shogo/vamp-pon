using VampPon.UnitySpike.U13.Result;

namespace VampPon.UnitySpike.U14.Flow
{
    public sealed class BattleResultSummaryProof
    {
        public string ClearState { get; private set; } = "clear";
        public string StageId { get; private set; } = "stage_01";
        public string StageTitle { get; private set; } = "はじまりの路地";
        public string Difficulty { get; private set; } = "やさしい";
        public string ElapsedTime { get; private set; } = "08:00";
        public int DefeatedEnemies { get; private set; } = 128;
        public int Fragments { get; private set; } = 12;
        public int Memories { get; private set; } = 3;
        public int Blessing { get; private set; } = 3;
        public string Rank { get; private set; } = "A";
        public string[] RewardCards { get; private set; } = { "記憶", "墨", "灯" };

        public static BattleResultSummaryProof FromRequest(BattleStartRequestProof request)
        {
            return new BattleResultSummaryProof
            {
                StageId = request.SelectedStageId,
                Difficulty = request.SelectedDifficulty
            };
        }

        public ResultViewModel ToResultViewModel()
        {
            var rewards = new ResultRewardCardViewModel[RewardCards.Length];
            for (var i = 0; i < RewardCards.Length; i++)
            {
                rewards[i] = new ResultRewardCardViewModel(RewardCards[i]);
            }

            return new ResultViewModel("今夜の記録", Rank, Fragments, Memories, Blessing, ElapsedTime, DefeatedEnemies, rewards, "次へ");
        }
    }
}
