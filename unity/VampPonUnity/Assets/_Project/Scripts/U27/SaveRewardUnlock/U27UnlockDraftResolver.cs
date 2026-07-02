using System.Collections.Generic;

namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27UnlockDraftResolver
    {
        public IReadOnlyList<U27UnlockDraftModel> Resolve(U27StageResultRecord result, U27StageProgressModel beforeProgress)
        {
            result ??= new U27StageResultRecord { IsClear = false };
            beforeProgress ??= U27StageProgressModel.CreateDefault("stage_01");
            var existing = new HashSet<string>(beforeProgress.UnlockedRewardIds);
            var unlocks = new List<U27UnlockDraftModel>();
            if (result.IsClear)
            {
                Add(unlocks, existing, "stage_02_placeholder", U27UnlockType.StagePlaceholder, "Stage1 clear", "Stage2 placeholder");
                if (!beforeProgress.IsCleared) Add(unlocks, existing, "knowledge_first_clear_stage1", U27UnlockType.KnowledgePlaceholder, "first clear", "朝の記憶 placeholder");
            }

            if (result.LevelReached >= 5) Add(unlocks, existing, "reward_card_level5_stage1", U27UnlockType.RewardCardPlaceholder, "level reached", "ランタン強化 card placeholder");
            if (result.EvolutionAchieved) Add(unlocks, existing, "collection_evolution_stage1", U27UnlockType.CollectionEntryPlaceholder, "evolution achieved", "進化記録 placeholder");
            if (result.RareAcquired) Add(unlocks, existing, "rare_memory_stage1", U27UnlockType.RareMemoryPlaceholder, "rare acquired", "レア記憶 placeholder");
            return unlocks;
        }

        private static void Add(List<U27UnlockDraftModel> unlocks, HashSet<string> existing, string id, U27UnlockType type, string reason, string label)
        {
            unlocks.Add(new U27UnlockDraftModel
            {
                UnlockId = id,
                UnlockType = type,
                UnlockReason = reason,
                IsNew = !existing.Contains(id),
                DisplayLabel = label,
            });
        }
    }
}
