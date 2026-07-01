namespace VampPon.UnitySpike.U13.StageSelect
{
    public readonly struct StageInfoViewModel
    {
        public StageInfoViewModel(string selectedStageTitle, string difficultyLabel, string stateLabel)
        {
            SelectedStageTitle = selectedStageTitle;
            DifficultyLabel = difficultyLabel;
            StateLabel = stateLabel;
        }

        public string SelectedStageTitle { get; }
        public string DifficultyLabel { get; }
        public string StateLabel { get; }
    }
}
