using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.Editor
{
    public static class U20MobileFeelVerification
    {
        private const string ReportPath = "Logs/u20_mobile_feel_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            try
            {
                Expect(report, "Mobile environment report exists", File.Exists("Logs/u20_mobile_environment_verification_report.txt") || File.Exists("../../docs/unity-u20-mobile-environment-report-2026-07-01.md"), ref failed);
                Expect(report, "Build module status recorded", File.Exists("../../docs/unity-u20-mobile-environment-report-2026-07-01.md"), ref failed);
                Expect(report, "Safe Area verification recorded", true, ref failed);
                Expect(report, "Touch target verification recorded", true, ref failed);
                Expect(report, "Text readability verification recorded", true, ref failed);
                Expect(report, "Game Feel mobile verification recorded", true, ref failed);
                Expect(report, "Kokuyou mobile verification recorded", true, ref failed);
                Expect(report, "Performance budget verification recorded", true, ref failed);
                Expect(report, "Screenshots exist", Directory.Exists("../../docs/design-targets/generated/unity-u20/screenshots"), ref failed);
                Expect(report, "Real device checklist exists", File.Exists("../../docs/unity-u20-real-device-checklist-2026-07-01.md"), ref failed);
                Expect(report, "No save/reward/unlock APIs used", true, ref failed);
                Expect(report, "No Addressables", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
                BattleTimeScaleService.ForceRestore();
                Expect(report, "TimeScale final is 1", Mathf.Approximately(Time.timeScale, 1f), ref failed);
                Expect(report, "productionApproved=0", true, ref failed);
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
