namespace VampPon.UnitySpike.U15.Contracts
{
    public readonly struct StageInfoPresentationModel
    {
        public StageInfoPresentationModel(string stageTitle, string difficultyLabel, string stateLabel)
        {
            StageTitle = stageTitle;
            DifficultyLabel = difficultyLabel;
            StateLabel = stateLabel;
        }

        public string StageTitle { get; }
        public string DifficultyLabel { get; }
        public string StateLabel { get; }
    }
}
