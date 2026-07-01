namespace VampPon.UnitySpike.U15.Contracts
{
    public sealed class StageSelectPresentationModel
    {
        public StageSelectPresentationModel(
            string title,
            StageNodePresentationModel[] nodes,
            StageInfoPresentationModel info,
            string startLabel,
            string lastResultLabel)
        {
            Title = title;
            Nodes = nodes ?? new StageNodePresentationModel[0];
            Info = info;
            StartLabel = startLabel;
            LastResultLabel = lastResultLabel;
        }

        public string Title { get; }
        public StageNodePresentationModel[] Nodes { get; }
        public StageInfoPresentationModel Info { get; }
        public string StartLabel { get; }
        public string LastResultLabel { get; }
    }
}
