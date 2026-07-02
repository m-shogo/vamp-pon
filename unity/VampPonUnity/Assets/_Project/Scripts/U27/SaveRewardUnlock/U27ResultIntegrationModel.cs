using System.Collections.Generic;

namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27ResultIntegrationModel
    {
        public string StageId { get; set; } = "stage_01";
        public bool IsClear { get; set; }
        public string RankSeal { get; set; } = "Rank C";
        public int ElapsedSeconds { get; set; }
        public int KillCount { get; set; }
        public int LevelReached { get; set; }
        public int CollectedCount { get; set; }
        public U27RewardDraft RewardDraft { get; set; } = new();
        public List<U27UnlockDraftModel> Unlocks { get; set; } = new();
        public bool BestUpdated { get; set; }
        public string BestUpdatedStamp { get; set; } = "";
        public string RetryAction { get; set; } = "RetryStage1";
        public string StageSelectAction { get; set; } = "ReturnStageSelect";
        public bool ProductionApproved { get; set; }
    }
}
