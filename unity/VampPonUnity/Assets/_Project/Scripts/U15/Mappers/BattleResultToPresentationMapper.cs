using VampPon.UnitySpike.U13.Result;
using VampPon.UnitySpike.U15.Contracts;

namespace VampPon.UnitySpike.U15.Mappers
{
    public static class BattleResultToPresentationMapper
    {
        public static ResultPresentationModel ToResultPresentationModel(BattleResultSummary summary)
        {
            summary ??= BattleResultSummary.Sample;
            return new ResultPresentationModel(
                "今夜の記録",
                summary.Rank,
                $"欠片 {summary.Fragments}",
                $"記憶 {summary.Memories}",
                $"加護 +{summary.Blessing}",
                $"時間 {summary.ElapsedLabel}",
                $"討伐 {summary.DefeatedEnemies}",
                summary.RewardSummary.RewardCards,
                "次へ");
        }

        public static ResultViewModel ToU13ResultViewModel(ResultPresentationModel model, BattleResultSummary summary)
        {
            model ??= ToResultPresentationModel(summary);
            summary ??= BattleResultSummary.Sample;
            var rewards = new ResultRewardCardViewModel[model.RewardCardLabels.Length];
            for (var i = 0; i < rewards.Length; i++)
            {
                rewards[i] = new ResultRewardCardViewModel(model.RewardCardLabels[i]);
            }

            return new ResultViewModel(
                model.Title,
                model.Rank,
                summary.Fragments,
                summary.Memories,
                summary.Blessing,
                summary.ElapsedLabel,
                summary.DefeatedEnemies,
                rewards,
                model.ContinueLabel);
        }
    }
}
