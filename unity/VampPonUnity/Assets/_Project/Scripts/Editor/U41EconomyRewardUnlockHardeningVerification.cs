using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using VampPon.UnitySpike.U27.SaveRewardUnlock;
using VampPon.UnitySpike.U41.EconomyRewardUnlock;

namespace VampPon.UnitySpike.Editor
{
    public static class U41EconomyRewardUnlockHardeningVerification
    {
        private const string ReportPath = "Logs/u41_economy_reward_unlock_hardening_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var readiness = new U41EconomyReadinessFactory().Create();
                Require(readiness.EconomyReadyForRc, "economy ready for RC candidate");
                Require(readiness.RewardReadyForRc, "reward ready for RC candidate");
                Require(readiness.UnlockReadyForRc, "unlock ready for RC candidate");
                Require(readiness.SaveEconomySafe, "save economy safe");
                Require(!readiness.ProductionApproved, "productionApproved remains false");
                Require(!readiness.RcReady, "rcReady remains false");
                Require(!readiness.ProductionEconomyFinal, "production economy not final");
                Require(!readiness.MobileMetricsReady, "mobile metrics remain not measured");
                Require(!readiness.AudioMixerReady, "AudioMixer remains not final");
                Require(!readiness.HapticMeasured, "haptic remains not measured");
                Require(readiness.RankBands.Count >= 5, "rank bands");
                Require(readiness.UnlockRules.Count >= 5, "unlock rules");

                var calculator = new U41RewardHardeningCalculator();
                var clear = calculator.Calculate(new U27StageResultRecord
                {
                    IsClear = true,
                    ElapsedSeconds = 410,
                    KillCount = 130,
                    LevelReached = 6,
                    CollectedCount = 26,
                    RareAcquired = true,
                    EvolutionAchieved = true,
                    KokuyouUsed = true,
                }, U27StageProgressModel.CreateDefault("stage_01"));
                Require(clear.Rank == "S", "S rank chase exists");
                Require(clear.FragmentAmount <= U41RewardHardeningConstants.MaxFragmentRewardCapDraft, "fragment cap");
                Require(clear.FragmentAmount >= U41RewardHardeningConstants.MinimumFragmentRewardDraft, "minimum reward");
                Require(clear.MemoryAmount > 0, "memory reward for special moments");
                Require(!clear.IsProductionEconomyFinal, "clear reward not final economy");

                var defeat = calculator.Calculate(new U27StageResultRecord
                {
                    IsClear = false,
                    KillCount = 24,
                    LevelReached = 3,
                    CollectedCount = 10,
                }, U27StageProgressModel.CreateDefault("stage_01"));
                Require(defeat.Rank == "C", "defeat can still show progress");
                Require(defeat.FragmentAmount >= U41RewardHardeningConstants.MinimumFragmentRewardDraft, "defeat minimum reward");

                var duplicateGuard = new U41UnlockDuplicateGuard();
                var deduped = duplicateGuard.PrioritizeNewUnlocks(new[]
                {
                    new U27UnlockDraftModel { UnlockId = "reward_card_level5_stage1", UnlockType = U27UnlockType.RewardCardPlaceholder },
                    new U27UnlockDraftModel { UnlockId = "stage_02_placeholder", UnlockType = U27UnlockType.StagePlaceholder },
                    new U27UnlockDraftModel { UnlockId = "stage_02_placeholder", UnlockType = U27UnlockType.StagePlaceholder },
                });
                Require(deduped.Count == 2, "duplicate unlock guard");
                Require(deduped[0].UnlockType == U27UnlockType.StagePlaceholder, "unlock priority");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, "U41 economy reward unlock hardening verification passed; economyReadyForRc=true; productionApproved=false; rcReady=false");
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                File.WriteAllText(ReportPath, ex.ToString());
                UnityEngine.Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static void Require(bool condition, string label)
        {
            if (!condition) throw new InvalidOperationException(label);
        }
    }
}
