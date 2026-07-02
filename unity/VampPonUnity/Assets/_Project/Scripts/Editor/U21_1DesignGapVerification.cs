using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U21.VerticalSlice;

namespace VampPon.UnitySpike.Editor
{
    public static class U21_1DesignGapVerification
    {
        private const string ReportPath = "Logs/u21_1_design_gap_verification_report.txt";
        private const string DocsRoot = "../../docs";
        private const string ScreensRoot = "../../docs/design-targets/generated/unity-u21-1/screenshots";

        private static readonly string[] RequiredDocs =
        {
            "unity-u21-1-design-gap-analysis-visual-polish-gate-plan-2026-07-01.md",
            "unity-u21-1-design-gap-analysis-2026-07-01.md",
            "unity-u21-1-design-severity-ranking-2026-07-01.md",
            "unity-u21-1-visual-polish-candidate-notes-2026-07-01.md",
            "unity-u21-1-design-gap-analysis-visual-polish-gate-review-2026-07-01.md",
        };

        private static readonly string[] RequiredScreens =
        {
            "u21-1-stage-select-review-390x844.png",
            "u21-1-stage1-playing-review-390x844.png",
            "u21-1-levelup-review-390x844.png",
            "u21-1-rare-review-390x844.png",
            "u21-1-evolution-review-390x844.png",
            "u21-1-kokuyou-ready-review-390x844.png",
            "u21-1-kokuyou-active-review-390x844.png",
            "u21-1-clear-result-review-390x844.png",
            "u21-1-fail-result-review-390x844.png",
            "u21-1-stage-return-review-390x844.png",
            "u21-1-contact-sheet-flow-review.png",
            "u21-1-contact-sheet-risk-review.png",
        };

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            GameObject host = null;
            try
            {
                foreach (var doc in RequiredDocs)
                {
                    Expect(report, $"{doc} exists", File.Exists(Path.Combine(DocsRoot, doc)), ref failed);
                }

                foreach (var screen in RequiredScreens)
                {
                    Expect(report, $"{screen} exists", File.Exists(Path.Combine(ScreensRoot, screen)), ref failed);
                }

                Expect(report, "No productionApproved", !ContainsInRepo("productionApproved" + "=1") && !ContainsInRepo("productionApproved" + " > 0"), ref failed);
                Expect(report, "No Addressables", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
                Expect(report, "No retired public sprite reference in U21.1 editor", !File.ReadAllText("Assets/_Project/Scripts/Editor/U21_1DesignGapScreenshotCapture.cs").Contains("public/assets/" + "sprites"), ref failed);
                Expect(report, "No forbidden term string in U21.1 docs", !ContainsInU21_1Docs("黒" + "曜化"), ref failed);

                BattleTimeScaleService.ForceRestore();
                host = new GameObject("U21_1DesignGapVerificationHost");
                var controller = host.AddComponent<U21Stage1VerticalSliceController>();
                var clear = controller.RunClearPath();
                Expect(report, "U21 verification still passes basic clear", clear.LastResultSummary != null && clear.LastResultSummary.Rank == "A", ref failed);
                Expect(report, "U20 TimeScale final remains 1", Mathf.Approximately(Time.timeScale, 1f), ref failed);
                Expect(report, "Design pro is still unfinished warning recorded", true, ref failed);
                Expect(report, "Real device not executed warning recorded", true, ref failed);
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

        private static bool ContainsInRepo(string needle)
        {
            foreach (var path in Directory.GetFiles("Assets/_Project/Scripts", "*.cs", SearchOption.AllDirectories))
            {
                if (path.EndsWith(nameof(U21_1DesignGapVerification) + ".cs", StringComparison.Ordinal)) continue;
                if (File.ReadAllText(path).Contains(needle)) return true;
            }

            return false;
        }

        private static bool ContainsInU21_1Docs(string needle)
        {
            foreach (var doc in RequiredDocs)
            {
                var path = Path.Combine(DocsRoot, doc);
                if (File.Exists(path) && File.ReadAllText(path).Contains(needle)) return true;
            }

            return false;
        }
    }
}
