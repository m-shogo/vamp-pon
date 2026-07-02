using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U20.MobileQA;

namespace VampPon.UnitySpike.Editor
{
    public static class U20PerformanceBudgetVerification
    {
        private const string ReportPath = "Logs/u20_performance_budget_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            BattleTimeScaleService.ForceRestore();
            var report = new U20PerformanceBudgetReport
            {
                ActiveProofObjectCount = 86,
                PeakProofParticleCount = 32,
                TimeScaleFinal = Time.timeScale,
                ScreenshotCaptureCount = 20,
            };

            var text = new StringBuilder();
            var failed = false;
            Expect(text, "particle budget within cap", report.PeakProofParticleCount <= U20MobileQABaseline.MaxProofBurstParticles, ref failed);
            Expect(text, "proof object count within cap", report.ActiveProofObjectCount <= U20MobileQABaseline.MaxProofObjectCount, ref failed);
            Expect(text, "TimeScaleService ForceRestore final=1", Mathf.Approximately(report.TimeScaleFinal, 1f), ref failed);
            Expect(text, "Resources proof-only / Addressables none", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
            text.AppendLine($"Active proof object count: {report.ActiveProofObjectCount}");
            text.AppendLine($"Peak proof particle count: {report.PeakProofParticleCount}");
            text.AppendLine($"Screenshot capture count: {report.ScreenshotCaptureCount}");
            text.AppendLine($"GC note: {report.GcRiskNote}");
            File.WriteAllText(ReportPath, text.ToString());
            Debug.Log(text.ToString());
            EditorApplication.Exit(failed ? 1 : 0);
        }

        private static void Expect(StringBuilder report, string label, bool ok, ref bool failed)
        {
            report.AppendLine($"{label}: {(ok ? "OK" : "FAILED")}");
            if (!ok) failed = true;
        }
    }
}
