using System.Collections.Generic;
using VampPon.UnitySpike.U25.Stage1Loop;

namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27SaveRewardUnlockIntegrator
    {
        private readonly IU27StageProgressRepository repository;
        private readonly U27RewardCalculator rewardCalculator = new();
        private readonly U27UnlockDraftResolver unlockResolver = new();

        public U27SaveRewardUnlockIntegrator(IU27StageProgressRepository repository)
        {
            this.repository = repository;
        }

        public U27ResultIntegrationModel CompleteRun(U25RunResultModel u25Result, string stageId = "stage_01")
        {
            var result = U27StageResultRecord.FromU25(u25Result, stageId);
            var before = repository.GetStageProgress(stageId);
            var reward = rewardCalculator.Calculate(result, before);
            result.Rank = reward.Rank;
            var unlocks = unlockResolver.Resolve(result, before);
            var beforeBestTime = before.BestClearTime;
            var beforeBestLevel = before.BestLevel;
            var beforeBestKills = before.BestKillCount;
            var beforeBestCollected = before.BestCollectedCount;
            var progress = repository.UpdateAfterRun(result, reward, unlocks);
            var bestUpdated = progress.BestLevel > beforeBestLevel
                || progress.BestKillCount > beforeBestKills
                || progress.BestCollectedCount > beforeBestCollected
                || (result.IsClear && (beforeBestTime == 0 || progress.BestClearTime < beforeBestTime));

            return new U27ResultIntegrationModel
            {
                StageId = stageId,
                IsClear = result.IsClear,
                RankSeal = $"Rank {reward.Rank}",
                ElapsedSeconds = result.ElapsedSeconds,
                KillCount = result.KillCount,
                LevelReached = result.LevelReached,
                CollectedCount = result.CollectedCount,
                RewardDraft = reward,
                Unlocks = new List<U27UnlockDraftModel>(unlocks),
                BestUpdated = bestUpdated,
                BestUpdatedStamp = bestUpdated ? "best updated" : "best kept",
                RetryAction = "RetryStage1",
                StageSelectAction = "ReturnStageSelect",
                ProductionApproved = false,
            };
        }

        public U27StageSelectIntegrationModel BuildStageSelect(string stageId = "stage_01")
        {
            var progress = repository.GetStageProgress(stageId);
            var last = progress.LastResult ?? new U27StageResultRecord { StageId = stageId, IsClear = false, Rank = "" };
            var stage2Unlocked = progress.UnlockedRewardIds.Contains("stage_02_placeholder");
            return new U27StageSelectIntegrationModel
            {
                Stage1StateLabel = progress.IsCleared ? "Stage1 cleared" : "Stage1 unlocked",
                Stage1Unlocked = progress.IsUnlocked,
                Stage1Cleared = progress.IsCleared,
                PreviousResultStamp = progress.TotalAttempts > 0 ? $"last {last.Rank} / KO {last.KillCount}" : "no previous result",
                BestRank = progress.BestRank,
                BestClearTime = progress.BestClearTime,
                LastPlayedResult = progress.TotalAttempts > 0 ? (last.IsClear ? "clear" : "defeat") : "",
                Stage2PlaceholderUnlocked = stage2Unlocked,
                Stage2PlaceholderLabel = stage2Unlocked ? "Stage2 placeholder unlocked" : "Stage2 placeholder locked",
                ActiveLantern = true,
                RouteLineVisible = true,
                StartAction = "StartStage1",
                RetryAction = "RetryStage1",
            };
        }

        public U27RetryFlowModel BuildRetryFlow(bool fromResult)
        {
            return new U27RetryFlowModel
            {
                NextPhase = fromResult ? "Battle" : "StageSelect",
                SavePreserved = true,
                RetryStartsStage1 = true,
                ResetDebugAvailableForVerification = true,
                DebugResetAction = "ResetProofDebug",
            };
        }

        public void ResetProofDebug() => repository.ResetProofDebug();
    }
}
