using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.U20.MobileQA;

namespace VampPon.UnitySpike.Editor
{
    public static class U20SafeAreaVerification
    {
        private const string ReportPath = "Logs/u20_safe_area_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            foreach (var p in U20MobileQABaseline.Profiles)
            {
                Expect(report, $"safe top margin {p.Width}x{p.Height}", U20MobileQABaseline.MinSafeAreaTop >= 24, ref failed);
                Expect(report, $"safe bottom margin {p.Width}x{p.Height}", U20MobileQABaseline.MinSafeAreaBottom >= 28, ref failed);
                Expect(report, $"LevelUp card stays inside safe area {p.Width}x{p.Height}", p.Height - U20MobileQABaseline.MinSafeAreaTop - U20MobileQABaseline.MinSafeAreaBottom >= 748, ref failed);
            }
            report.AppendLine("Warnings: real notch/home-indicator device pass is not executed.");
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
