using VampPon.UnitySpike.U13.StageSelect;
using VampPon.UnitySpike.U15.Contracts;

namespace VampPon.UnitySpike.U15.Mappers
{
    public static class StageSelectPresentationMapper
    {
        public static StageSelectPresentationModel FromSample(BattleResultSummary lastResult = null)
        {
            var lastResultLabel = lastResult == null
                ? "前回: なし"
                : $"前回: Rank {lastResult.Rank} / 欠片 {lastResult.Fragments}";

            return new StageSelectPresentationModel(
                "今夜の行き先",
                new[]
                {
                    new StageNodePresentationModel("stage_01", "はじまりの路地", "active", "unlocked"),
                    new StageNodePresentationModel("stage_02", "灯りの曲がり角", "locked", "locked"),
                    new StageNodePresentationModel("stage_03", "黒い橋", "locked", "locked"),
                },
                new StageInfoPresentationModel("はじまりの路地", string.IsNullOrWhiteSpace(lastResult?.DifficultyLabel) ? "やさしい" : lastResult.DifficultyLabel, "選択中"),
                "出発",
                lastResultLabel);
        }

        public static StageSelectViewModel ToU13StageSelectViewModel(StageSelectPresentationModel model)
        {
            model ??= FromSample();
            var nodes = new StageNodeViewModel[model.Nodes.Length];
            for (var i = 0; i < nodes.Length; i++)
            {
                var node = model.Nodes[i];
                var state = node.VisualState == "active" ? StageNodeVisualState.Active : StageNodeVisualState.Locked;
                nodes[i] = new StageNodeViewModel(node.StageId, node.StageTitle, state);
            }

            return new StageSelectViewModel(
                model.Title,
                nodes,
                new StageInfoViewModel(model.Info.StageTitle, model.Info.DifficultyLabel, model.Info.StateLabel),
                model.StartLabel);
        }
    }
}
