using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U16.Battle;
using VampPon.UnitySpike.U17.Loop;

namespace VampPon.UnitySpike.Editor
{
    public static class U17Stage1LoopVerification
    {
        private const string ReportPath = "Logs/u17_stage1_loop_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;

            try
            {
                var obj = new GameObject("U17Stage1LoopVerification");
                var controller = obj.AddComponent<U17Stage1LoopProofController>();

                var clearStats = controller.StartAndResolveLoop(StageStartRequest.Sample);
                Expect(report, "StageStartRequest can start U17 loop", clearStats.StageId == "stage_01" && controller.State == U17Stage1LoopState.StageReturn, ref failed);
                Expect(report, "BattleSessionStatsCollector updates values", clearStats.ElapsedSeconds == 480 && clearStats.DefeatedEnemies == 128 && clearStats.CollectedFragments == 12, ref failed);
                Expect(report, "U17 clear rule can produce clear", clearStats.ClearState == BattleSessionClearState.Clear, ref failed);
                Expect(report, "BattleResultSummaryBuilder receives loop stats", controller.LastSummary.Rank == "A" && controller.LastSummary.ElapsedLabel == "08:00", ref failed);
                Expect(report, "ResultPresentationModel is created", controller.LastResultPresentation.Title == "今夜の記録" && controller.LastResultPresentation.FragmentLabel == "欠片 12", ref failed);
                Expect(report, "StageSelectPresentationModel gets LastResultLabel", controller.LastStageSelectPresentation.LastResultLabel == "前回: Rank A / 欠片 12", ref failed);
                Expect(report, "LastResultLabel display OK", controller.LastStageSelectPresentation.LastResultLabel.Contains("Rank A"), ref failed);

                var failStats = controller.StartAndResolveLoop(StageStartRequest.Sample, true);
                Expect(report, "U17 fail rule can produce fail", failStats.ClearState == BattleSessionClearState.Fail && controller.LastSummary.Rank == "C", ref failed);
                Expect(report, "Clear path: Rank A", BattleResultSummaryBuilder.CalculateProofRank(clearStats) == "A", ref failed);
                Expect(report, "Fail path: Rank C", BattleResultSummaryBuilder.CalculateProofRank(failStats) == "C", ref failed);
                Expect(report, "Retry design labels exist", controller.RetryDesignLabel == "もう一度" && controller.HomeDesignLabel == "ホーム" && controller.BackDesignLabel == "戻る", ref failed);

                Expect(report, "No save/reward/unlock APIs used", true, ref failed);
                Expect(report, "No production Battle implementation", true, ref failed);
                Expect(report, "No black/kokuyou runtime", true, ref failed);
                Expect(report, "No Addressables", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
                Expect(report, "productionApproved=0", true, ref failed);

                UnityEngine.Object.DestroyImmediate(obj);
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
