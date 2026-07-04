using System;
using VampPon.UnitySpike.U27.SaveRewardUnlock;

namespace VampPon.UnitySpike.U41.EconomyRewardUnlock
{
    public sealed class U41RewardHardeningCalculator
    {
        public U41RewardHardeningResult Calculate(U27StageResultRecord result, U27StageProgressModel beforeProgress)
        {
            result ??= new U27StageResultRecord { IsClear = false, Rank = "D" };
            beforeProgress ??= U27StageProgressModel.CreateDefault("stage_01");
            var output = new U41RewardHardeningResult
            {
                Rank = CalculateRank(result),
                IsProductionEconomyFinal = false,
            };

            Add(output, U41RewardReason.Clear, result.IsClear ? U41RewardHardeningConstants.ClearReward : 0, 0, "clear reward", U41RewardRisk.Low);
            Add(output, U41RewardReason.DefeatParticipation, result.IsClear ? 0 : U41RewardHardeningConstants.DefeatReward, 0, "defeat progress", U41RewardRisk.Low);
            Add(output, U41RewardReason.FirstClear, result.IsClear && !beforeProgress.IsCleared ? U41RewardHardeningConstants.FirstClearBonus : 0, 0, "first clear", U41RewardRisk.Medium);
            Add(output, U41RewardReason.Rank, RankBonus(output.Rank), 0, $"rank {output.Rank}", U41RewardRisk.Low);
            Add(output, U41RewardReason.Time, result.IsClear && result.ElapsedSeconds <= U41RewardHardeningConstants.FastClearSeconds ? U41RewardHardeningConstants.TimeBonus : 0, 0, "time bonus", U41RewardRisk.Low);
            Add(output, U41RewardReason.Kill, result.KillCount / U41RewardHardeningConstants.KillBonusDivisor, 0, "KO bonus", U41RewardRisk.Low);
            Add(output, U41RewardReason.Collected, result.CollectedCount / U41RewardHardeningConstants.CollectedBonusDivisor, 0, "pickup bonus", U41RewardRisk.Low);
            Add(output, U41RewardReason.Level, result.LevelReached / U41RewardHardeningConstants.LevelBonusDivisor, 0, "level bonus", U41RewardRisk.Low);
            Add(output, U41RewardReason.Rare, 0, result.RareAcquired ? U41RewardHardeningConstants.RareBonus : 0, "rare memory", U41RewardRisk.Medium);
            Add(output, U41RewardReason.Evolution, 0, result.EvolutionAchieved ? U41RewardHardeningConstants.EvolutionBonus : 0, "evolution memory", U41RewardRisk.Medium);
            Add(output, U41RewardReason.Kokuyou, 0, result.KokuyouUsed ? U41RewardHardeningConstants.KokuyouBonus : 0, "black ink memory", U41RewardRisk.Low);

            output.FragmentAmount = Math.Clamp(output.FragmentAmount, U41RewardHardeningConstants.MinimumFragmentRewardDraft, U41RewardHardeningConstants.MaxFragmentRewardCapDraft);
            return output;
        }

        public string CalculateRank(U27StageResultRecord result)
        {
            if (result == null || !result.IsClear) return result != null && result.LevelReached >= 3 ? "C" : "D";
            if (result.ElapsedSeconds <= 420 && result.KillCount >= 125 && result.LevelReached >= 6 && result.CollectedCount >= 24) return "S";
            if (result.KillCount >= 105 && result.LevelReached >= 5 && result.CollectedCount >= 16) return "A";
            if (result.KillCount >= 70 && result.LevelReached >= 4) return "B";
            return "C";
        }

        private static int RankBonus(string rank)
        {
            return rank switch
            {
                "S" => U41RewardHardeningConstants.RankSBonus,
                "A" => U41RewardHardeningConstants.RankABonus,
                "B" => U41RewardHardeningConstants.RankBBonus,
                _ => 0,
            };
        }

        private static void Add(U41RewardHardeningResult result, U41RewardReason reason, int fragment, int memory, string label, U41RewardRisk risk)
        {
            result.FragmentAmount += fragment;
            result.MemoryAmount += memory;
            if (fragment > 0 || memory > 0) result.Bands.Add(new U41RewardBand { Reason = reason, FragmentAmount = fragment, MemoryAmount = memory, DisplayLabel = label, Risk = risk });
        }
    }
}
