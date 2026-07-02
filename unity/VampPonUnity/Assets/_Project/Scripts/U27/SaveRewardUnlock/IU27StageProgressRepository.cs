using System.Collections.Generic;

namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public interface IU27StageProgressRepository
    {
        U27SaveDataModel Load();
        void Save(U27SaveDataModel data);
        void ResetProofDebug();
        U27StageProgressModel UpdateAfterRun(U27StageResultRecord result, U27RewardDraft reward, IReadOnlyList<U27UnlockDraftModel> unlocks);
        void MarkStageCleared(string stageId);
        U27StageProgressModel GetStageProgress(string stageId);
        U27StageResultRecord GetLastResult(string stageId);
        IReadOnlyList<string> GetUnlockedRewards(string stageId);
    }
}
