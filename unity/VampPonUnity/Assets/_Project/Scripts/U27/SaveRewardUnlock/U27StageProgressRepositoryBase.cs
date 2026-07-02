using System.Collections.Generic;

namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public abstract class U27StageProgressRepositoryBase : IU27StageProgressRepository
    {
        protected U27SaveDataModel CachedData = U27SaveDataModel.CreateDefault();

        public abstract U27SaveDataModel Load();
        public abstract void Save(U27SaveDataModel data);
        public abstract void ResetProofDebug();

        public U27StageProgressModel UpdateAfterRun(U27StageResultRecord result, U27RewardDraft reward, IReadOnlyList<U27UnlockDraftModel> unlocks)
        {
            var data = Load();
            result ??= new U27StageResultRecord { IsClear = false, Rank = "D" };
            reward ??= new U27RewardDraft { Rank = result.Rank };
            unlocks ??= new List<U27UnlockDraftModel>();
            var progress = data.GetStageProgress(result.StageId);
            progress.TotalAttempts += 1;
            progress.LastResult = result;
            progress.LastPlayedAtIso = result.PlayedAtIso;
            progress.BestLevel = Max(progress.BestLevel, result.LevelReached);
            progress.BestKillCount = Max(progress.BestKillCount, result.KillCount);
            progress.BestCollectedCount = Max(progress.BestCollectedCount, result.CollectedCount);
            progress.BestRank = BetterRank(progress.BestRank, reward.Rank);
            if (result.IsClear)
            {
                if (!progress.IsCleared) progress.FirstClearAtIso = result.PlayedAtIso;
                progress.IsCleared = true;
                progress.TotalClears += 1;
                progress.BestClearTime = progress.BestClearTime == 0 ? result.ElapsedSeconds : Min(progress.BestClearTime, result.ElapsedSeconds);
            }

            foreach (var unlock in unlocks)
            {
                if (!progress.UnlockedRewardIds.Contains(unlock.UnlockId)) progress.UnlockedRewardIds.Add(unlock.UnlockId);
                if (unlock.UnlockType == U27UnlockType.KnowledgePlaceholder && !progress.UnlockedKnowledgeIds.Contains(unlock.UnlockId))
                {
                    progress.UnlockedKnowledgeIds.Add(unlock.UnlockId);
                }
            }

            progress.Version = U27SaveVersion.Current;
            data.Version = U27SaveVersion.Current;
            data.ProductionApproved = false;
            Save(data);
            return progress;
        }

        public void MarkStageCleared(string stageId)
        {
            var data = Load();
            var progress = data.GetStageProgress(stageId);
            progress.IsCleared = true;
            if (progress.TotalClears == 0) progress.TotalClears = 1;
            Save(data);
        }

        public U27StageProgressModel GetStageProgress(string stageId) => Load().GetStageProgress(stageId);
        public U27StageResultRecord GetLastResult(string stageId) => GetStageProgress(stageId).LastResult;
        public IReadOnlyList<string> GetUnlockedRewards(string stageId) => GetStageProgress(stageId).UnlockedRewardIds;

        protected static U27SaveDataModel FallbackIfInvalid(U27SaveDataModel data)
        {
            if (data == null || data.Version != U27SaveVersion.Current || data.StageProgressList == null || data.StageProgressList.Count == 0)
            {
                return U27SaveDataModel.CreateDefault();
            }

            return data;
        }

        protected static string BetterRank(string current, string candidate)
        {
            return RankScore(candidate) > RankScore(current) ? candidate : current;
        }

        private static int RankScore(string rank)
        {
            return rank switch
            {
                "S" => 5,
                "A" => 4,
                "B" => 3,
                "C" => 2,
                "D" => 1,
                _ => 0,
            };
        }

        private static int Max(int a, int b) => a > b ? a : b;
        private static int Min(int a, int b) => a < b ? a : b;
    }
}
