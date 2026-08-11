using System;
using System.IO;
using System.Linq;
using System.Reflection;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    /// <summary>
    /// Final-approval-only Unity iOS export. The host shell checks out the exact
    /// V3/capture source commit in an isolated worktree; VampPonBuildProvenanceSync
    /// then embeds that clean HEAD into the player for later installed-build proof.
    /// This method exports Xcode only. Signing/install/performance evidence remain
    /// explicit host/device steps.
    /// </summary>
    public static class TopV3FinalApprovalIosBuild
    {
        private const string TargetEnvironment = "VAMPPON_TOP_FINAL_IOS_BUILD_TARGET";
        private const string OutputEnvironment = "VAMPPON_TOP_FINAL_IOS_BUILD_PATH";
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string Stage1ScenePath = "Assets/_Project/Scenes/Stage1/Stage1.unity";

        public static void Build()
        {
            var targetName = Environment.GetEnvironmentVariable(TargetEnvironment)?.Trim();
            var output = Environment.GetEnvironmentVariable(OutputEnvironment)?.Trim();
            var exitCode = 1;

            if (targetName != "simulator" && targetName != "device")
            {
                Debug.LogError($"{TargetEnvironment} must be simulator or device.");
                if (Application.isBatchMode) EditorApplication.Exit(1);
                return;
            }

            if (string.IsNullOrWhiteSpace(output) || !Path.IsPathRooted(output))
            {
                Debug.LogError($"{OutputEnvironment} must be an absolute output directory.");
                if (Application.isBatchMode) EditorApplication.Exit(1);
                return;
            }

            var architectureProperty = typeof(PlayerSettings.iOS).GetProperty(
                "simulatorSdkArchitecture",
                BindingFlags.Public | BindingFlags.Static);
            var originalSdk = PlayerSettings.iOS.sdkVersion;
            var originalArchitecture = architectureProperty?.GetValue(null);

            try
            {
                if (AssetDatabase.LoadAssetAtPath<SceneAsset>(BootScenePath) == null ||
                    AssetDatabase.LoadAssetAtPath<SceneAsset>(Stage1ScenePath) == null)
                {
                    throw new InvalidOperationException(
                        "TOP final iOS export requires Boot and Stage1 scenes in the Unity project.");
                }

                if (Directory.Exists(output) && Directory.EnumerateFileSystemEntries(output).Any())
                    throw new InvalidOperationException(
                        $"TOP final iOS export path must be empty to prevent stale Xcode products: {output}");
                Directory.CreateDirectory(output);

                if (targetName == "simulator")
                {
                    if (architectureProperty == null || !architectureProperty.CanWrite)
                        throw new InvalidOperationException(
                            "PlayerSettings.iOS.simulatorSdkArchitecture is unavailable.");

                    PlayerSettings.iOS.sdkVersion = iOSSdkVersion.SimulatorSDK;
                    var arm64Name = Enum.GetNames(architectureProperty.PropertyType)
                        .FirstOrDefault(name => name.Contains("ARM64", StringComparison.OrdinalIgnoreCase));
                    if (arm64Name == null)
                        throw new InvalidOperationException("ARM64 iOS Simulator architecture is unavailable.");
                    architectureProperty.SetValue(
                        null,
                        Enum.Parse(architectureProperty.PropertyType, arm64Name));
                }
                else
                {
                    PlayerSettings.iOS.sdkVersion = iOSSdkVersion.DeviceSDK;
                }

                var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
                {
                    scenes = new[] { BootScenePath, Stage1ScenePath },
                    locationPathName = output,
                    target = BuildTarget.iOS,
                    options = BuildOptions.None,
                });

                if (report.summary.result != BuildResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        $"TOP final {targetName} Unity export failed: {report.summary.result}, " +
                        $"errors={report.summary.totalErrors}, warnings={report.summary.totalWarnings}.");
                }

                Debug.Log(
                    $"TOP final {targetName} Unity export passed: path={output}, " +
                    $"warnings={report.summary.totalWarnings}.");
                exitCode = 0;
            }
            catch (Exception exception)
            {
                Debug.LogException(exception);
            }
            finally
            {
                PlayerSettings.iOS.sdkVersion = originalSdk;
                if (architectureProperty != null && originalArchitecture != null)
                    architectureProperty.SetValue(null, originalArchitecture);
                AssetDatabase.SaveAssets();

                if (Application.isBatchMode)
                    EditorApplication.Exit(exitCode);
            }
        }
    }
}
