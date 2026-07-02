using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public static class U20MobileEnvironmentVerification
    {
        private const string ReportPath = "Logs/u20_mobile_environment_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            try
            {
                var unityRoot = Directory.GetParent(EditorApplication.applicationPath)?.Parent?.Parent?.FullName ?? string.Empty;
                var playback = Path.Combine(unityRoot, "PlaybackEngines");
                var ios = Directory.Exists(Path.Combine(playback, "iOSSupport"));
                var android = Directory.Exists(Path.Combine(playback, "AndroidPlayer"));
                Expect(report, "Unity Editor 6000.5.1f1 exists", Application.unityVersion.StartsWith("6000.5.1f1", StringComparison.Ordinal), ref failed);
                Expect(report, "ProjectVersion is 6000.5.1f1", Application.unityVersion.StartsWith("6000.5.1f1", StringComparison.Ordinal), ref failed);
                report.AppendLine($"iOS Build Support: {(ios ? "installed" : "missing")}");
                report.AppendLine($"Android Build Support: {(android ? "installed" : "missing")}");
                report.AppendLine($"Android SDK/NDK/OpenJDK: {(android ? "unknown" : "missing")}");
                report.AppendLine($"Xcode command line tools: {(Directory.Exists("/Applications/Xcode.app/Contents/Developer") ? "installed" : "unknown")}");
                report.AppendLine("iPhone実機確認: not executed");
                report.AppendLine("Android実機確認: not executed");
                report.AppendLine("実機FPS確認: not executed");
                report.AppendLine("実機touch確認: not executed");
                report.AppendLine("実機Safe Area確認: not executed");
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
