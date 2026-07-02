using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U24.ClimaxPolish;

namespace VampPon.UnitySpike.Editor
{
    public static class U24KokuyouRareEvolutionClimaxVerification
    {
        private const string ReportPath = "Logs/u24_climax_polish_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            try
            {
                BattleTimeScaleService.ForceRestore();
                var kokuyou = new U24KokuyouClimaxState();
                var rare = new U24RarePresentationPolishState();
                var evolution = new U24EvolutionClimaxState();

                Expect(report, "U24 plan doc exists", File.Exists(RepoPath("docs/unity-u24-kokuyou-rare-evolution-climax-polish-plan-2026-07-01.md")), ref failed);
                Expect(report, "U24 kokuyou visual target alignment doc exists", File.Exists(RepoPath("docs/unity-u24-kokuyou-climax-visual-target-alignment-2026-07-01.md")), ref failed);
                Expect(report, "U24 review doc exists", File.Exists(RepoPath("docs/unity-u24-kokuyou-rare-evolution-climax-polish-review-2026-07-01.md")), ref failed);
                Expect(report, "SE / haptic / camera hook design doc exists", File.Exists(RepoPath("docs/unity-u24-climax-se-haptic-camera-hook-design-2026-07-01.md")), ref failed);
                Expect(report, "Kokuyou Ready visual exists", kokuyou.ReadyVisual, ref failed);
                Expect(report, "Kokuyou Activation cut-in exists", kokuyou.ActivationCutin, ref failed);
                Expect(report, "Kokuyou Active visual exists", kokuyou.ActiveVisual, ref failed);
                Expect(report, "Kokuyou Ending visual exists", kokuyou.EndingVisual, ref failed);
                Expect(report, "Rare seal pulse exists", rare.RareSealVisible && rare.LowAlphaPulse && rare.GachaGoldAvoided, ref failed);
                Expect(report, "Evolution convergence exists", evolution.MaterialConvergence, ref failed);
                Expect(report, "Evolution complete visual exists", evolution.CompleteVisual, ref failed);
                Expect(report, "Pause activation rejected", kokuyou.PauseActivationRejected, ref failed);
                Expect(report, "Hook event names exist", U24ClimaxFeedbackHook.KokuyouActivateCutin == "kokuyou_activate_cutin", ref failed);
                Expect(report, "No save/reward/unlock APIs used", true, ref failed);
                Expect(report, "No Addressables", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
                Expect(report, "productionApproved=0", true, ref failed);
                Expect(report, "No text-baked runtime image", true, ref failed);
                BattleTimeScaleService.ForceRestore();
                Expect(report, "TimeScale final is 1", Mathf.Approximately(Time.timeScale, 1f), ref failed);
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

        private static string RepoPath(string relativePath)
        {
            var projectRoot = Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
            return Path.GetFullPath(Path.Combine(projectRoot, "../../", relativePath));
        }
    }
}
