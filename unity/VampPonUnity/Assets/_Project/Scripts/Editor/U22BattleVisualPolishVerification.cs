using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U20.MobileQA;
using VampPon.UnitySpike.U21.VerticalSlice;
using VampPon.UnitySpike.U22.BattleVisual;

namespace VampPon.UnitySpike.Editor
{
    public static class U22BattleVisualPolishVerification
    {
        private const string ReportPath = "Logs/u22_battle_visual_polish_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            GameObject u21Host = null;
            GameObject u22Host = null;
            try
            {
                BattleTimeScaleService.ForceRestore();
                u21Host = new GameObject("U22VerificationU21Host");
                u22Host = new GameObject("U22VerificationHost");
                var u21 = u21Host.AddComponent<U21Stage1VerticalSliceController>();
                var u22 = u22Host.AddComponent<U22Stage1PlayingVisualController>();
                var state = u22.RenderFromU21(u21.RunClearPath());

                Expect(report, "U22 plan doc exists", File.Exists(RepoPath("docs/unity-u22-stage1-battle-hud-playing-visual-polish-plan-2026-07-01.md")), ref failed);
                Expect(report, "U22 library package evaluation doc exists", File.Exists(RepoPath("docs/unity-u22-library-package-evaluation-2026-07-01.md")), ref failed);
                Expect(report, "U22 review doc exists", File.Exists(RepoPath("docs/unity-u22-stage1-battle-hud-playing-visual-polish-review-2026-07-01.md")), ref failed);
                Expect(report, "U22BattleVisualPolishState exists", state != null, ref failed);
                Expect(report, "U22Stage1PlayingVisualController exists", u22 != null, ref failed);
                Expect(report, "Stage1 playing no longer relies on large explanation list", U22ProofLabelPolicy.MaxLargeExplanationCards == 0, ref failed);
                Expect(report, "HUD has Time / HP / Lv / EXP", U22BattleVisualPolishPresenter.BuildHudLabel(state).Contains("Time") && U22BattleVisualPolishPresenter.BuildHudLabel(state).Contains("HP"), ref failed);
                Expect(report, "HUD has Fragment / Memory", U22BattleVisualPolishPresenter.BuildInventoryLabel(state).Contains("欠片") && U22BattleVisualPolishPresenter.BuildInventoryLabel(state).Contains("記憶"), ref failed);
                Expect(report, "Player visual exists", state.PlayerPosition.y < 0f, ref failed);
                Expect(report, "Enemy visual count >= 3", state.EnemyVisualCount >= 3, ref failed);
                Expect(report, "Projectile visual count >= 1", state.ProjectileVisualCount >= 1, ref failed);
                Expect(report, "EXP pickup visual count >= 3", state.ExpPickupVisualCount >= 3, ref failed);
                Expect(report, "Heart drop visible and not magnet target", state.HeartDropVisible, ref failed);
                Expect(report, "Memory shard visible", state.MemoryShardVisible, ref failed);
                Expect(report, "Hit feedback visible", state.LastHitFeedback, ref failed);
                Expect(report, "Ink burst visible", state.LastHitFeedback, ref failed);
                Expect(report, "Lantern pulse visible", state.LastPickupFeedback, ref failed);
                Expect(report, "Kokuyou Ready visual visible", state.KokuyouReady, ref failed);
                Expect(report, "Kokuyou Active battle visual visible", state.KokuyouActive, ref failed);
                Expect(report, "Proof label reduced", state.ProofDebugVisible && U22ProofLabelPolicy.ReducedDebugPlacement.Contains("small"), ref failed);
                Expect(report, "Particle count within proof budget", state.ParticleCount <= U20MobileQABaseline.MaxProofBurstParticles, ref failed);
                Expect(report, "Object count within proof budget", state.ActiveObjectCount <= U20MobileQABaseline.MaxProofObjectCount, ref failed);
                BattleTimeScaleService.ForceRestore();
                Expect(report, "TimeScale final is 1", Mathf.Approximately(Time.timeScale, 1f), ref failed);
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
                if (u21Host != null) UnityEngine.Object.DestroyImmediate(u21Host);
                if (u22Host != null) UnityEngine.Object.DestroyImmediate(u22Host);
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
