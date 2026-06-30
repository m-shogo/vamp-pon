using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using VampPon.UnitySpike.U4;

namespace VampPon.UnitySpike.Editor
{
    public static class U4LevelUpVerification
    {
        [MenuItem("VampPon/U4/Run LevelUp Verification")]
        public static void RunVerification()
        {
            var report = new System.Text.StringBuilder();
            report.AppendLine("=== U4 LevelUp UI Verification ===");

            report.AppendLine($"Unity: {Application.unityVersion}");
            report.AppendLine($"Platform: {Application.platform}");

            var projectVersion = File.ReadAllText("ProjectSettings/ProjectVersion.txt");
            report.AppendLine($"ProjectVersion: {(projectVersion.Contains("6000.5.1f1") ? "OK" : "MISMATCH")}");

            var fontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium.ttf";
            var fontExists = File.Exists(fontPath);
            report.AppendLine($"ZenMaruGothic font: {(fontExists ? "found" : "NOT FOUND")}");

            var licensePath = "Assets/_Project/Fonts/ZenMaruGothic/LICENSE.txt";
            var licenseExists = File.Exists(licensePath);
            report.AppendLine($"Font license: {(licenseExists ? "found" : "NOT FOUND")}");

            var scriptFiles = new[]
            {
                "Assets/_Project/Scripts/U4/U4LevelUpDemoController.cs",
                "Assets/_Project/Scripts/U4/U4LevelUpOverlay.cs",
                "Assets/_Project/Scripts/U4/U4LevelUpData.cs",
                "Assets/_Project/Scripts/U4/U4TimeScaleGuard.cs",
                "Assets/_Project/Scripts/U4/PaperCard.cs",
                "Assets/_Project/Scripts/U4/PaperButton.cs",
                "Assets/_Project/Scripts/U4/IconFrame.cs",
            };

            report.AppendLine("--- U4 Scripts ---");
            foreach (var script in scriptFiles)
            {
                report.AppendLine($"  {Path.GetFileName(script)}: {(File.Exists(script) ? "OK" : "MISSING")}");
            }

            report.AppendLine("--- U2BattleController check ---");
            var battleControllerPath = "Assets/_Project/Scripts/Runtime/U2BattleController.cs";
            if (File.Exists(battleControllerPath))
            {
                var content = File.ReadAllText(battleControllerPath);
                var hasCardUI = content.Contains("PaperCard.Create") || content.Contains("IconFrame.Create") || content.Contains("PaperButton.Create");
                var hasLevelUpData = content.Contains("U4LevelUpCandidatePool") || content.Contains("U4LevelUpChoice[]");
                var hasNotifier = content.Contains("SetLevelUpNotifier");

                report.AppendLine($"  Card UI in BattleController: {(hasCardUI ? "VIOLATION" : "clean")}");
                report.AppendLine($"  LevelUp data in BattleController: {(hasLevelUpData ? "VIOLATION" : "clean")}");
                report.AppendLine($"  Minimal notifier hook: {(hasNotifier ? "OK" : "missing")}");
            }

            report.AppendLine("--- TimeScale guard ---");
            var guardPath = "Assets/_Project/Scripts/U4/U4TimeScaleGuard.cs";
            if (File.Exists(guardPath))
            {
                var guardContent = File.ReadAllText(guardPath);
                var hasForceRestore = guardContent.Contains("ForceRestore");
                report.AppendLine($"  ForceRestore method: {(hasForceRestore ? "OK" : "MISSING")}");
            }

            var overlayPath = "Assets/_Project/Scripts/U4/U4LevelUpOverlay.cs";
            if (File.Exists(overlayPath))
            {
                var overlayContent = File.ReadAllText(overlayPath);
                var hasOnDisable = overlayContent.Contains("OnDisable");
                var hasOnDestroy = overlayContent.Contains("OnDestroy");
                report.AppendLine($"  OnDisable restore: {(hasOnDisable ? "OK" : "MISSING")}");
                report.AppendLine($"  OnDestroy restore: {(hasOnDestroy ? "OK" : "MISSING")}");
            }

            report.AppendLine("--- dawn_ticket check ---");
            var dataPath = "Assets/_Project/Scripts/U4/U4LevelUpData.cs";
            if (File.Exists(dataPath))
            {
                var dataContent = File.ReadAllText(dataPath);
                var hasDawnTicket = dataContent.Contains("dawn_ticket");
                report.AppendLine($"  dawn_ticket in candidates: {(hasDawnTicket ? "VIOLATION" : "clean")}");
            }

            var repoRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "../../.."));
            var reportPath = Path.Combine(repoRoot, "docs/design-targets/generated/unity-u4/u4-verification-report.txt");
            var dir = Path.GetDirectoryName(reportPath);
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
            File.WriteAllText(reportPath, report.ToString());

            Debug.Log(report.ToString());
            Debug.Log($"Report saved to: {reportPath}");
        }
    }
}
