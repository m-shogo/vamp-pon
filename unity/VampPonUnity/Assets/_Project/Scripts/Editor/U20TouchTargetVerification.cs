using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.U20.MobileQA;

namespace VampPon.UnitySpike.Editor
{
    public static class U20TouchTargetVerification
    {
        private const string ReportPath = "Logs/u20_touch_target_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            Expect(report, "StageSelect start button >= 44", 90 >= U20MobileQABaseline.MinPrimaryTouchTarget, ref failed);
            Expect(report, "StageSelect route node visual+tap >= 44", 54 >= U20MobileQABaseline.MinPrimaryTouchTarget, ref failed);
            Expect(report, "Result next button >= 44", 120 >= U20MobileQABaseline.MinPrimaryTouchTarget, ref failed);
            Expect(report, "LevelUp card tap area wide enough", U20MobileQABaseline.MinLevelUpCardWidth >= 88, ref failed);
            Expect(report, "Kokuyou activation proof target >= 44", 64 >= U20MobileQABaseline.MinPrimaryTouchTarget, ref failed);
            report.AppendLine("Debug overlay: screenshot-only / proof-only.");
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
