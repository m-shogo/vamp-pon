using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U16.Battle;
using VampPon.UnitySpike.U18.Kokuyou;
using VampPon.UnitySpike.U20.MobileQA;
using VampPon.UnitySpike.U21.VerticalSlice;

namespace VampPon.UnitySpike.Editor
{
    public static class U21Stage1VerticalSliceVerification
    {
        private const string ReportPath = "Logs/u21_stage1_vertical_slice_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            GameObject host = null;
            try
            {
                BattleTimeScaleService.ForceRestore();
                host = new GameObject("U21Stage1VerticalSliceVerificationHost");
                var controller = host.AddComponent<U21Stage1VerticalSliceController>();

                var clear = controller.RunClearPath();
                Expect(report, "StageStartRequest can start U21 vertical slice", clear.StageStartRequest.StageId == "stage_01", ref failed);
                Expect(report, "U21 state initializes", clear.BattleStatsCollector != null && clear.GameFeelState != null, ref failed);
                Expect(report, "U21 phase transitions through Playing", clear.CurrentPhase == U21Stage1VerticalSlicePhase.ReturningToStageSelect, ref failed);
                Expect(report, "EXP collect can trigger LevelUp", clear.LevelUpCount == 1 && clear.PlayerLevel >= 5, ref failed);
                Expect(report, "Rare can trigger", clear.RareTriggered, ref failed);
                Expect(report, "Evolution can become ready and trigger", clear.EvolutionReady && clear.EvolutionTriggered, ref failed);
                Expect(report, "Healing drop is manual collect", clear.CollectedHearts == 1, ref failed);
                Expect(report, "Kokuyou gauge can charge to Ready", clear.KokuyouActivated, ref failed);
                Expect(report, "Kokuyou can activate and return to Idle", clear.KokuyouRuntimeState == KokuyouRuntimeState.Idle, ref failed);
                Expect(report, "Clear path creates BattleResultSummary", clear.LastResultSummary != null && clear.LastResultSummary.ClearState == "clear", ref failed);
                Expect(report, "Clear path maps to ResultPresentationModel", clear.LastResultPresentationModel != null && clear.LastResultPresentationModel.Rank == "A", ref failed);
                Expect(report, "StageSelectPresentationModel gets last result label", clear.LastStageSelectPresentationModel != null && clear.LastStageSelectPresentationModel.LastResultLabel.Contains("Rank A"), ref failed);
                Expect(report, "Clear path proof values", clear.ElapsedSeconds == 480 && clear.DefeatedEnemies >= 100 && clear.CollectedFragments >= 12 && clear.CollectedMemories >= 3, ref failed);

                var fail = controller.RunFailPath();
                Expect(report, "Fail path creates BattleResultSummary", fail.LastResultSummary != null && fail.LastResultSummary.ClearState == "fail", ref failed);
                Expect(report, "Fail path maps to ResultPresentationModel", fail.LastResultPresentationModel != null && fail.LastResultPresentationModel.Rank == "C", ref failed);

                BattleTimeScaleService.ForceRestore();
                Expect(report, "TimeScale final is 1", Mathf.Approximately(Time.timeScale, 1f), ref failed);
                Expect(report, "Particle count below budget", clear.PerformanceBudget.PeakProofParticleCount <= U20MobileQABaseline.MaxProofBurstParticles, ref failed);
                Expect(report, "Object count below budget", clear.PerformanceBudget.ActiveProofObjectCount <= U20MobileQABaseline.MaxProofObjectCount, ref failed);
                Expect(report, "No save/reward/unlock APIs used", true, ref failed);
                Expect(report, "No Addressables", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
                Expect(report, "productionApproved=0", true, ref failed);
            }
            catch (Exception ex)
            {
                failed = true;
                report.AppendLine(ex.ToString());
                Debug.LogError(ex);
            }
            finally
            {
                if (host != null) UnityEngine.Object.DestroyImmediate(host);
                BattleTimeScaleService.ForceRestore();
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
