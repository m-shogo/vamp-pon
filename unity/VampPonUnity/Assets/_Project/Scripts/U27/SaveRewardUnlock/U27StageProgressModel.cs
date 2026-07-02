using System.Collections.Generic;

namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27StageProgressModel
    {
        public string StageId { get; set; } = "stage_01";
        public bool IsUnlocked { get; set; } = true;
        public bool IsCleared { get; set; }
        public int BestClearTime { get; set; }
        public int BestLevel { get; set; }
        public int BestKillCount { get; set; }
        public int BestCollectedCount { get; set; }
        public string BestRank { get; set; } = "";
        public U27StageResultRecord LastResult { get; set; } = new();
        public int TotalAttempts { get; set; }
        public int TotalClears { get; set; }
        public string FirstClearAtIso { get; set; } = "";
        public string LastPlayedAtIso { get; set; } = "";
        public List<string> UnlockedRewardIds { get; set; } = new();
        public List<string> UnlockedKnowledgeIds { get; set; } = new();
        public int Version { get; set; } = U27SaveVersion.Current;

        public static U27StageProgressModel CreateDefault(string stageId)
        {
            return new U27StageProgressModel
            {
                StageId = string.IsNullOrEmpty(stageId) ? "stage_01" : stageId,
                IsUnlocked = true,
                IsCleared = false,
                BestClearTime = 0,
                BestLevel = 0,
                BestKillCount = 0,
                BestCollectedCount = 0,
                BestRank = "",
                TotalAttempts = 0,
                TotalClears = 0,
                Version = U27SaveVersion.Current,
            };
        }
    }
}
