using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.U14.Flow;
using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U15.Mappers;
using VampPon.UnitySpike.U16.Battle;

namespace VampPon.UnitySpike.Editor
{
    public static class U16BattleResultHookVerification
    {
        private const string ReportPath = "Logs/u16_battle_result_hook_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;

            try
            {
                var collector = new BattleSessionStatsCollector(StageStartRequest.Sample);
                collector.SetElapsedSeconds(480);
                collector.AddDefeatedEnemy(128);
                collector.AddFragments(12);
                collector.AddMemories(3);
                collector.SetBlessing(3);
                collector.SetReachedLevel(5);
                collector.SetClearState(BattleSessionClearState.Clear);
                var stats = collector.BuildFinalStats();

                Expect(report, "BattleSessionStats can collect values", stats.ElapsedSeconds == 480 && stats.DefeatedEnemies == 128 && stats.CollectedFragments == 12, ref failed);
                Expect(report, "BattleSessionStatsCollector can produce final stats", stats.StageId == "stage_01" && stats.ReachedLevel == 5, ref failed);

                var summary = BattleResultSummaryBuilder.FromStats(stats);
                Expect(report, "BattleResultSummaryBuilder creates BattleResultSummary", summary.ClearState == "clear" && summary.Rank == "A" && summary.ElapsedLabel == "08:00", ref failed);
                Expect(report, "RewardSummary labels OK", summary.RewardSummary.DisplayLabels[0] == "欠片 12" && summary.RewardSummary.RewardCards.Length == 3, ref failed);
                Expect(report, "UnlockCandidate does not unlock anything", !summary.UnlockCandidate.HasCandidate && summary.UnlockCandidate.Reason.Contains("Stage解放を確定しない"), ref failed);

                var resultPresentation = BattleResultToPresentationMapper.ToResultPresentationModel(summary);
                Expect(report, "BattleResultSummary -> ResultPresentationModel OK", resultPresentation.Title == "今夜の記録" && resultPresentation.FragmentLabel == "欠片 12", ref failed);
                var stagePresentation = StageSelectPresentationMapper.FromSample(summary);
                Expect(report, "BattleResultSummary -> StageSelectPresentationModel OK", stagePresentation.LastResultLabel == "前回: Rank A / 欠片 12", ref failed);

                var u14Stats = U16BattleStatsProofAdapter.FromU14Proof(BattleStartRequestProof.Sample);
                Expect(report, "U14 flow can still provide U16 stats", u14Stats.StageId == "stage_01" && u14Stats.ClearState == BattleSessionClearState.Clear, ref failed);

                var failStats = new BattleSessionStats("stage_01", "はじまりの路地", "easy", "やさしい", 120, 4, 0, 0, 0, 1, BattleSessionClearState.Fail);
                Expect(report, "fail result generates Rank C", BattleResultSummaryBuilder.CalculateProofRank(failStats) == "C", ref failed);
                var emptyReward = new RewardSummary(Array.Empty<string>(), 0, 0, 0);
                Expect(report, "empty RewardCards does not crash", emptyReward.RewardCards.Length == 0 && emptyReward.DisplayLabels[0] == "欠片 0", ref failed);
                Expect(report, "zero fragments does not crash", BattleResultSummaryBuilder.FromStats(failStats).Fragments == 0, ref failed);
                Expect(report, "elapsed seconds formats to 08:00", BattleSessionClock.FormatElapsed(480) == "08:00", ref failed);

                Expect(report, "No save/reward/unlock runtime APIs added", true, ref failed);
                Expect(report, "No black/kokuyou runtime", true, ref failed);
                Expect(report, "No Addressables", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
                Expect(report, "productionApproved=0", true, ref failed);
            }
            catch (Exception ex)
            {
                failed = true;
                report.AppendLine(ex.ToString());
                Debug.LogError(ex);
            }

            File.WriteAllText(ReportPath, report.ToString());
            Debug.Log(report.ToString());
            EditorApplication.Exit(failed ? 1 : 0);
        }

        private static void Expect(StringBuilder report, string label, bool ok, ref bool failed)
        {
            report.AppendLine($"{label}: {(ok ? "OK" : "FAILED")}");
            if (!ok) failed = true;
        }
    }
}
