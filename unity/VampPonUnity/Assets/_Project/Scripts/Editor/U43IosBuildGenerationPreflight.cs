using System;
using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public static class U43IosBuildGenerationPreflight
    {
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string Stage1ScenePath = "Assets/_Project/Scenes/Stage1/Stage1.unity";
        private const string OutputPath = "/Users/m-shogo/Developer/personal/vamp-pon-builds/ios-u43-predevice-smoke";
        private const string EvidencePath = "../../docs/design-targets/generated/unity-u43/ios-build-generation-preflight.json";
        private const string LogPath = "Logs/u43_ios_build_generation_preflight_report.txt";

        [MenuItem("VampPon/U43/Run iOS Build Generation Preflight")]
        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            Directory.CreateDirectory(OutputPath);

            var ready = false;
            string error = null;
            var totalErrors = 0;
            var totalWarnings = 0;
            var buildResult = "NotStarted";

            try
            {
                var options = new BuildPlayerOptions
                {
                    scenes = new[] { BootScenePath, Stage1ScenePath },
                    locationPathName = OutputPath,
                    target = BuildTarget.iOS,
                    options = BuildOptions.None,
                };

                var report = BuildPipeline.BuildPlayer(options);
                buildResult = report.summary.result.ToString();
                totalErrors = report.summary.totalErrors;
                totalWarnings = report.summary.totalWarnings;
                ready = report.summary.result == BuildResult.Succeeded;

                if (!ready)
                {
                    error = $"{buildResult}: {totalErrors} errors, {totalWarnings} warnings";
                }
            }
            catch (Exception ex)
            {
                buildResult = "Exception";
                error = ex.GetType().Name + ": " + ex.Message;
                Debug.LogError(ex);
            }

            WriteEvidence(ready, error, buildResult, totalErrors, totalWarnings);
            File.WriteAllText(LogPath,
                "U43 iOS build generation preflight\n" +
                $"ready={ready}\n" +
                $"result={buildResult}\n" +
                $"errors={totalErrors}\n" +
                $"warnings={totalWarnings}\n" +
                $"outputPath={OutputPath}\n" +
                $"error={error ?? "null"}\n");

            EditorApplication.Exit(ready ? 0 : 1);
        }

        private static void WriteEvidence(bool ready, string error, string buildResult, int totalErrors, int totalWarnings)
        {
            var text =
                "{\n" +
                "  \"generatedAt\": \"2026-07-06\",\n" +
                "  \"evidenceKind\": \"iOS build generation preflight\",\n" +
                "  \"iosBuildGenerationAttempted\": true,\n" +
                $"  \"iosBuildGenerationReady\": {JsonBool(ready)},\n" +
                $"  \"iosBuildResult\": \"{JsonEscape(buildResult)}\",\n" +
                $"  \"iosBuildTotalErrors\": {totalErrors},\n" +
                $"  \"iosBuildTotalWarnings\": {totalWarnings},\n" +
                $"  \"iosBuildOutputPath\": \"{JsonEscape(OutputPath)}\",\n" +
                $"  \"iosBuildGenerationError\": {JsonNullable(error)},\n" +
                "  \"deviceInstallAttempted\": false,\n" +
                "  \"deviceRunConfirmed\": false,\n" +
                "  \"actualDeviceSmokeResultProvided\": false,\n" +
                "  \"actualDeviceSmokeResult\": \"NOT_PROVIDED\",\n" +
                "  \"humanCheckNeeded\": true,\n" +
                "  \"deviceScreenshot\": \"DEVICE_SCREENSHOT_NOT_PROVIDED\",\n" +
                "  \"devicePlayableReady\": false,\n" +
                "  \"mobileMetricsReady\": false,\n" +
                "  \"audioMixerReady\": false,\n" +
                "  \"audioLatencyMeasured\": false,\n" +
                "  \"hapticMeasured\": false,\n" +
                "  \"rcReady\": false,\n" +
                "  \"productionApproved\": false\n" +
                "}\n";
            File.WriteAllText(AbsoluteRepoPath(EvidencePath), text);
        }

        private static string AbsoluteRepoPath(string relativeFromProject)
        {
            var projectRoot = Directory.GetParent("Assets")?.FullName ?? Directory.GetCurrentDirectory();
            return Path.GetFullPath(Path.Combine(projectRoot, relativeFromProject));
        }

        private static string JsonBool(bool value) => value ? "true" : "false";

        private static string JsonNullable(string value) => value == null ? "null" : $"\"{JsonEscape(value)}\"";

        private static string JsonEscape(string value) =>
            value.Replace("\\", "\\\\", StringComparison.Ordinal)
                .Replace("\"", "\\\"", StringComparison.Ordinal)
                .Replace("\n", "\\n", StringComparison.Ordinal)
                .Replace("\r", "\\r", StringComparison.Ordinal);
    }
}
