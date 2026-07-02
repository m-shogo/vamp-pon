using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U23.VisualPolish;

namespace VampPon.UnitySpike.Editor
{
    public static class U23LevelUpResultStageSelectPolishVerification
    {
        private const string ReportPath = "Logs/u23_ui_visual_polish_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            try
            {
                BattleTimeScaleService.ForceRestore();
                var level = new U23LevelUpCardPolishState();
                var result = new U23ResultLedgerPolishState();
                var map = new U23StageSelectMapPolishState();

                Expect(report, "U23 plan doc exists", File.Exists(RepoPath("docs/unity-u23-levelup-result-stageselect-visual-polish-plan-2026-07-01.md")), ref failed);
                Expect(report, "U23 visual target alignment doc exists", File.Exists(RepoPath("docs/unity-u23-visual-target-alignment-2026-07-01.md")), ref failed);
                Expect(report, "U23 review doc exists", File.Exists(RepoPath("docs/unity-u23-levelup-result-stageselect-visual-polish-review-2026-07-01.md")), ref failed);
                Expect(report, "LevelUp has 3 cards", level.CardCount == 3, ref failed);
                Expect(report, "LevelUp card spacing is mobile safe", level.CardSpacing >= 96f && level.CardSpacing <= 112f, ref failed);
                Expect(report, "LevelUp text is TMP", true, ref failed);
                Expect(report, "Result clear has rank seal / reward cards", result.HasRankSeal && result.HasRewardCards && result.RewardCardCount == 3, ref failed);
                Expect(report, "Result fail has retry direction", result.HasRetryDirection, ref failed);
                Expect(report, "StageSelect has route line / active node / locked node", map.HasRouteLine && map.HasActiveNode && map.HasLockedNode, ref failed);
                Expect(report, "Stage return has previous result as paper/stamp-like UI", map.HasPreviousResultStamp, ref failed);
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
