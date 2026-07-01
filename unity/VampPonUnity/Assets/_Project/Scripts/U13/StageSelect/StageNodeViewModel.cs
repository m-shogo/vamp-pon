namespace VampPon.UnitySpike.U13.StageSelect
{
    public enum StageNodeVisualState
    {
        Active,
        Locked,
    }

    public readonly struct StageNodeViewModel
    {
        public StageNodeViewModel(string stageId, string title, StageNodeVisualState visualState)
        {
            StageId = stageId;
            Title = title;
            VisualState = visualState;
        }

        public string StageId { get; }
        public string Title { get; }
        public StageNodeVisualState VisualState { get; }
    }
}
