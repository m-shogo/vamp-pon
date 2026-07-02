namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27RewardCalculator
    {
        public U27RewardDraft Calculate(U27StageResultRecord result, U27StageProgressModel beforeProgress)
        {
            result ??= new U27StageResultRecord { IsClear = false, Rank = "D" };
            beforeProgress ??= U27StageProgressModel.CreateDefault("stage_01");
            var firstClear = result.IsClear && !beforeProgress.IsCleared;
            var reward = new U27RewardDraft
            {
                ClearBonus = result.IsClear ? U27RewardDraftConstants.ClearBonus : 0,
                DefeatParticipationReward = result.IsClear ? 0 : U27RewardDraftConstants.DefeatParticipationReward,
                TimeBonus = result.IsClear && result.ElapsedSeconds <= U27RewardDraftConstants.FastClearTimeSeconds ? U27RewardDraftConstants.FastClearTimeBonus : 0,
                KillCountBonus = result.KillCount / U27RewardDraftConstants.KillCountBonusDivisor,
                CollectedCountBonus = result.CollectedCount / U27RewardDraftConstants.CollectedCountBonusDivisor,
                LevelReachedBonus = result.LevelReached / U27RewardDraftConstants.LevelReachedBonusDivisor,
                FirstClearBonus = firstClear ? U27RewardDraftConstants.FirstClearBonus : 0,
                RareAcquiredBonus = result.RareAcquired ? U27RewardDraftConstants.RareAcquiredBonus : 0,
                EvolutionAchievedBonus = result.EvolutionAchieved ? U27RewardDraftConstants.EvolutionAchievedBonus : 0,
                KokuyouUsedFlavorBonus = result.KokuyouUsed ? U27RewardDraftConstants.KokuyouUsedFlavorBonus : 0,
                Rank = CalculateRank(result),
                IsEconomyFinal = false,
            };
            reward.FragmentAmount = reward.ClearBonus + reward.DefeatParticipationReward + reward.TimeBonus + reward.KillCountBonus + reward.CollectedCountBonus + reward.LevelReachedBonus + reward.FirstClearBonus;
            reward.MemoryAmount = reward.RareAcquiredBonus + reward.EvolutionAchievedBonus + reward.KokuyouUsedFlavorBonus;
            return reward;
        }

        private static string CalculateRank(U27StageResultRecord result)
        {
            if (!result.IsClear) return result.LevelReached >= 3 ? "C" : "D";
            if (result.KillCount >= 120 && result.LevelReached >= 5 && result.CollectedCount >= 12) return "A";
            if (result.KillCount >= 80 && result.LevelReached >= 4) return "B";
            return "C";
        }
    }
}
