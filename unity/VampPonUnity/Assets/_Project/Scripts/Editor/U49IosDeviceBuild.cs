using System;
using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public static class U49IosDeviceBuild
    {
        private const string VerificationDefine = "VAMPPON_U49_DEVICE_VERIFICATION";

        [MenuItem("VampPon/U49/Build iOS Device Verification")]
        public static void Build()
        {
            var output = Environment.GetEnvironmentVariable("VAMPPON_U49_IOS_BUILD_PATH");
            if (string.IsNullOrWhiteSpace(output)) output = Path.Combine(Path.GetTempPath(), "vamp-pon-u49-ios-device");
            var originalSdk = PlayerSettings.iOS.sdkVersion;
            try
            {
                Directory.CreateDirectory(output);
                PlayerSettings.iOS.sdkVersion = iOSSdkVersion.DeviceSDK;
                var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
                {
                    scenes = new[] { "Assets/_Project/Scenes/Boot/Boot.unity", "Assets/_Project/Scenes/Stage1/Stage1.unity" },
                    locationPathName = output,
                    target = BuildTarget.iOS,
                    options = BuildOptions.Development,
                    extraScriptingDefines = new[] { VerificationDefine },
                });
                if (report.summary.result != BuildResult.Succeeded)
                    throw new InvalidOperationException($"U49 iOS device export failed: {report.summary.result}, errors={report.summary.totalErrors}.");
                Debug.Log($"U49 iOS device export passed: warnings={report.summary.totalWarnings}.");
                if (Application.isBatchMode) EditorApplication.Exit(0);
            }
            catch (Exception exception)
            {
                Debug.LogException(exception);
                if (Application.isBatchMode) EditorApplication.Exit(1);
                else throw;
            }
            finally
            {
                PlayerSettings.iOS.sdkVersion = originalSdk;
                AssetDatabase.SaveAssets();
            }
        }
    }
}
