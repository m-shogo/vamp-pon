using VampPon.UnitySpike.U27.SaveRewardUnlock;

namespace VampPon.UnitySpike.U41.EconomyRewardUnlock
{
    public sealed class U41EconomyReadinessFactory
    {
        public U41EconomyReadinessReport Create()
        {
            var report = new U41EconomyReadinessReport
            {
                EconomyReadyForRc = true,
                RewardReadyForRc = true,
                UnlockReadyForRc = true,
                SaveEconomySafe = true,
                ProductionApproved = false,
                RcReady = false,
                ProductionEconomyFinal = false,
                MobileMetricsReady = false,
                AudioMixerReady = false,
                HapticMeasured = false,
            };

            report.RankBands.Add(new U41RankRewardBand { Rank = "S", Criteria = "clear <=420s, kills>=125, level>=6, collected>=24", FragmentBonus = 6, Reason = "chase rank" });
            report.RankBands.Add(new U41RankRewardBand { Rank = "A", Criteria = "clear, kills>=105, level>=5, collected>=16", FragmentBonus = 4, Reason = "strong clear" });
            report.RankBands.Add(new U41RankRewardBand { Rank = "B", Criteria = "clear or near-clear, kills>=70, level>=4", FragmentBonus = 2, Reason = "good run" });
            report.RankBands.Add(new U41RankRewardBand { Rank = "C", Criteria = "defeat with level>=3 or low clear", FragmentBonus = 0, Reason = "progress kept" });
            report.RankBands.Add(new U41RankRewardBand { Rank = "D", Criteria = "early defeat", FragmentBonus = 0, Reason = "retry safely" });

            AddUnlock(report, "stage_02_placeholder", U27UnlockType.StagePlaceholder, "Stage1 clear", "Stage2 placeholder", U41UnlockDisplayPriority.StagePlaceholder, "Stage2 body is not implemented");
            AddUnlock(report, "knowledge_first_clear_stage1", U27UnlockType.KnowledgePlaceholder, "first clear", "朝の記憶 placeholder", U41UnlockDisplayPriority.Knowledge, "Collection later");
            AddUnlock(report, "reward_card_level5_stage1", U27UnlockType.RewardCardPlaceholder, "level reached", "ランタン強化 card placeholder", U41UnlockDisplayPriority.RewardCard, "Card catalog later");
            AddUnlock(report, "collection_evolution_stage1", U27UnlockType.CollectionEntryPlaceholder, "evolution achieved", "進化記録 placeholder", U41UnlockDisplayPriority.Collection, "Collection later");
            AddUnlock(report, "rare_memory_stage1", U27UnlockType.RareMemoryPlaceholder, "rare acquired", "レア記憶 placeholder", U41UnlockDisplayPriority.RareMemory, "Collection later");

            report.RemainingCautions.Add("production economy is not final");
            report.RemainingCautions.Add("mobile metrics are NOT_MEASURED");
            report.RemainingCautions.Add("AudioMixer remains not final");
            report.RemainingCautions.Add("Stage2 unlock remains placeholder");
            return report;
        }

        private static void AddUnlock(U41EconomyReadinessReport report, string id, U27UnlockType type, string reason, string label, U41UnlockDisplayPriority priority, string note)
        {
            report.UnlockRules.Add(new U41UnlockHardeningRule
            {
                UnlockId = id,
                UnlockType = type,
                UnlockReason = reason,
                DisplayLabel = label,
                Priority = priority,
                ReadinessStatus = U41UnlockReadinessStatus.RcCandidatePlaceholder,
                FutureProductionNote = note,
            });
        }
    }
}
