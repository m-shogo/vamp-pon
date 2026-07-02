namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27StageSelectIntegrationModel
    {
        public string Stage1StateLabel { get; set; } = "Stage1 unlocked";
        public bool Stage1Unlocked { get; set; } = true;
        public bool Stage1Cleared { get; set; }
        public string PreviousResultStamp { get; set; } = "no previous result";
        public string BestRank { get; set; } = "";
        public int BestClearTime { get; set; }
        public string LastPlayedResult { get; set; } = "";
        public bool Stage2PlaceholderUnlocked { get; set; }
        public string Stage2PlaceholderLabel { get; set; } = "Stage2 placeholder locked";
        public bool ActiveLantern { get; set; } = true;
        public bool RouteLineVisible { get; set; } = true;
        public string StartAction { get; set; } = "StartStage1";
        public string RetryAction { get; set; } = "RetryStage1";
    }
}
