namespace VampPon.UnitySpike.U13.StageSelect
{
    public sealed class StageSelectViewModel
    {
        public StageSelectViewModel(string title, StageNodeViewModel[] nodes, StageInfoViewModel info, string startLabel)
        {
            Title = title;
            Nodes = nodes;
            Info = info;
            StartLabel = startLabel;
        }

        public string Title { get; }
        public StageNodeViewModel[] Nodes { get; }
        public StageInfoViewModel Info { get; }
        public string StartLabel { get; }

        public static StageSelectViewModel Sample => new(
            "今夜の行き先",
            new[]
            {
                new StageNodeViewModel("stage_01", "はじまりの路地", StageNodeVisualState.Active),
                new StageNodeViewModel("stage_02", "灯りの曲がり角", StageNodeVisualState.Locked),
                new StageNodeViewModel("stage_03", "黒い橋", StageNodeVisualState.Locked),
            },
            new StageInfoViewModel("はじまりの路地", "やさしい", "選択中"),
            "出発");
    }
}
