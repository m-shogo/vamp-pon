using System.Collections.Generic;

namespace VampPon.UnitySpike.Runtime.Result
{
    public sealed class RunResultViewModel
    {
        public string Title { get; set; }
        public string OutcomeLabel { get; set; }
        public string StageTitle { get; set; }
        public string ElapsedTimeLabel { get; set; }
        public string DefeatedEnemyLabel { get; set; }
        public string FragmentLabel { get; set; }
        public string ReachedLevelLabel { get; set; }
        public string Rank { get; set; }
        public IReadOnlyList<string> RewardCards { get; set; }
        public IReadOnlyList<string> NewRecordRows { get; set; }
        public bool CanRetry { get; set; }
        public bool CanReturnToStageSelect { get; set; }
        public bool SaveSucceeded { get; set; }
        public string SaveStatusLabel { get; set; }
    }
}
