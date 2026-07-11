using System;
using System.IO;
using System.Linq;
using System.Reflection;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public static class U46IosSimulatorBuild
    {
        private const string OutputPath = "/Users/m-shogo/Developer/personal/vamp-pon/unity/VampPonUnity/Builds/iOS-U46-Simulator";

        public static void Build()
        {
            Directory.CreateDirectory(OutputPath);
            var property = typeof(PlayerSettings.iOS).GetProperty("simulatorSdkArchitecture", BindingFlags.Public | BindingFlags.Static);
            var originalSdk = PlayerSettings.iOS.sdkVersion;
            var originalArch = property?.GetValue(null);
            var audioSettings = AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/AudioManager.asset").FirstOrDefault();
            var serializedAudio = audioSettings != null ? new SerializedObject(audioSettings) : null;
            var disableAudio = serializedAudio?.FindProperty("m_DisableAudio");
            var originalDisableAudio = disableAudio != null && disableAudio.boolValue;
            try
            {
                PlayerSettings.iOS.sdkVersion = iOSSdkVersion.SimulatorSDK;
                if (disableAudio != null)
                {
                    disableAudio.boolValue = true;
                    serializedAudio.ApplyModifiedPropertiesWithoutUndo();
                }
                var arm64 = Enum.GetNames(property.PropertyType).First(x => x.Contains("ARM64", StringComparison.OrdinalIgnoreCase));
                property.SetValue(null, Enum.Parse(property.PropertyType, arm64));
                var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
                {
                    scenes = new[] { "Assets/_Project/Scenes/Boot/Boot.unity", "Assets/_Project/Scenes/Stage1/Stage1.unity" },
                    locationPathName = OutputPath, target = BuildTarget.iOS, options = BuildOptions.None,
                    extraScriptingDefines = new[] { "VAMPPON_AI_SIMULATOR_SMOKE" },
                });
                if (report.summary.result != BuildResult.Succeeded) throw new InvalidOperationException(report.summary.result.ToString());
            }
            finally
            {
                PlayerSettings.iOS.sdkVersion = originalSdk;
                if (property != null && originalArch != null) property.SetValue(null, originalArch);
                if (disableAudio != null)
                {
                    disableAudio.boolValue = originalDisableAudio;
                    serializedAudio.ApplyModifiedPropertiesWithoutUndo();
                }
                AssetDatabase.SaveAssets();
            }
        }
    }
}
