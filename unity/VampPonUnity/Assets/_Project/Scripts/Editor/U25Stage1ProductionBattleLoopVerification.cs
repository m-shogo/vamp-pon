using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U25.Stage1Loop;

namespace VampPon.UnitySpike.Editor
{
    public static class U25Stage1ProductionBattleLoopVerification
    {
        private const string ReportPath = "Logs/u25_stage1_production_battle_loop_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            GameObject host = null;
            try
            {
                BattleTimeScaleService.ForceRestore();
                host = new GameObject("U25Stage1RuntimeFlowHost");
                var controller = host.AddComponent<U25Stage1RuntimeFlowController>();
                var clear = controller.RunClearPath();
                Expect(report, "U25 plan doc exists", File.Exists(RepoPath("docs/unity-u25-stage1-production-battle-loop-plan-2026-07-02.md")), ref failed);
                Expect(report, "U25 review doc exists", File.Exists(RepoPath("docs/unity-u25-stage1-production-battle-loop-review-2026-07-02.md")), ref failed);
                Expect(report, "StageSelect to Result clear path runs", clear.Phase == "ResultClear", ref failed);
                Expect(report, "U22 battle visual connected", clear.BattleVisual != null && clear.BattleVisual.EnemyVisualCount >= 4, ref failed);
                Expect(report, "U23 LevelUp / Result / StageSelect connected", clear.LevelUpVisual.CardCount == 3 && clear.ResultVisual.HasRankSeal && clear.StageSelectVisual.HasRouteLine, ref failed);
                Expect(report, "U24 Kokuyou / Rare / Evolution connected", clear.KokuyouVisual.ActiveVisual && clear.RareVisual.RareSealVisible && clear.EvolutionVisual.CompleteVisual, ref failed);
                Expect(report, "Reward draft exists but is not final persistence", clear.RewardDraft != null && !clear.RewardDraft.IsPersistenceFinal, ref failed);
                Expect(report, "Stage progress draft exists but save is not final", clear.ProgressDraft != null && !clear.ProgressDraft.IsSaveFinal, ref failed);
                Expect(report, "SE / haptic hook facade exists", controller.FeedbackHooks.LastEvent == "result_stamp" && !controller.FeedbackHooks.HapticExecutedOnDevice, ref failed);
                var fail = controller.RunFailPath();
                Expect(report, "Retry/fail path can reach ResultFail", fail.Phase == "ResultFail" && fail.RunResult.ClearState == "fail", ref failed);
                Expect(report, "No Addressables", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
                Expect(report, "productionApproved=0", !clear.ProductionApproved, ref failed);
                BattleTimeScaleService.ForceRestore();
                Expect(report, "TimeScale final is 1", Mathf.Approximately(Time.timeScale, 1f), ref failed);
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

        private static string RepoPath(string relativePath)
        {
            var projectRoot = Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
            return Path.GetFullPath(Path.Combine(projectRoot, "../../", relativePath));
        }
    }
}
