namespace VampPon.UnitySpike.U15.Contracts
{
    public readonly struct StageNodePresentationModel
    {
        public StageNodePresentationModel(string stageId, string stageTitle, string visualState, string lockState)
        {
            StageId = stageId;
            StageTitle = stageTitle;
            VisualState = visualState;
            LockState = lockState;
        }

        public string StageId { get; }
        public string StageTitle { get; }
        public string VisualState { get; }
        public string LockState { get; }
    }
}
