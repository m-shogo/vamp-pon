using VampPon.UnitySpike.U25.Stage1Loop;

namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27StageResultRecord
    {
        public string StageId { get; set; } = "stage_01";
        public bool IsClear { get; set; } = true;
        public int ElapsedSeconds { get; set; } = 480;
        public int KillCount { get; set; } = 128;
        public int LevelReached { get; set; } = 5;
        public int CollectedCount { get; set; } = 15;
        public string Rank { get; set; } = "A";
        public bool KokuyouUsed { get; set; }
        public bool EvolutionAchieved { get; set; }
        public bool RareAcquired { get; set; }
        public string PlayedAtIso { get; set; } = "placeholder-played-at";
        public int Version { get; set; } = U27SaveVersion.Current;

        public static U27StageResultRecord FromU25(U25RunResultModel result, string stageId = "stage_01")
        {
            result ??= new U25RunResultModel();
            return new U27StageResultRecord
            {
                StageId = stageId,
                IsClear = result.ClearState == "clear",
                ElapsedSeconds = result.ElapsedSeconds,
                KillCount = result.KillCount,
                LevelReached = result.LevelReached,
                CollectedCount = result.CollectedFragments + result.CollectedMemories,
                Rank = result.Rank,
                KokuyouUsed = result.KokuyouUsed,
                EvolutionAchieved = result.EvolutionAchieved,
                RareAcquired = result.RareAcquired,
                PlayedAtIso = "placeholder-played-at",
                Version = U27SaveVersion.Current,
            };
        }
    }
}
