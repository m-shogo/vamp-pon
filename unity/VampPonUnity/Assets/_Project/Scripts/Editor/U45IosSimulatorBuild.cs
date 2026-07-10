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
    public static class U45IosSimulatorBuild
    {
        private const string SmokeDefine = "VAMPPON_AI_SIMULATOR_SMOKE";
        private const string OutputPath = "/Users/m-shogo/Developer/personal/vamp-pon-builds/ios-u45-ai-simulator-smoke";
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string Stage1ScenePath = "Assets/_Project/Scenes/Stage1/Stage1.unity";
        private const string ReportPath = "Logs/u45_ios_simulator_build_report.json";

        [MenuItem("VampPon/U45/Build AI iOS Simulator Smoke")]
        public static void Build()
        {
            Directory.CreateDirectory("Logs");
            Directory.CreateDirectory(OutputPath);

            var namedTarget = NamedBuildTarget.iOS;
            var originalSdk = PlayerSettings.iOS.sdkVersion;
            var architectureProperty = typeof(PlayerSettings.iOS).GetProperty(
                "simulatorSdkArchitecture",
                BindingFlags.Public | BindingFlags.Static);
            var originalArchitecture = architectureProperty?.GetValue(null);
            var originalDefines = PlayerSettings.GetScriptingDefineSymbols(namedTarget);
            var buildResult = "NotStarted";
            var errors = 0;
            var warnings = 0;
            string error = null;
            string selectedArchitecture = null;
            var restored = false;

            try
            {
                if (architectureProperty == null || !architectureProperty.CanWrite)
                {
                    throw new InvalidOperationException("PlayerSettings.iOS.simulatorSdkArchitecture is unavailable");
                }

                PlayerSettings.iOS.sdkVersion = iOSSdkVersion.SimulatorSDK;
                EnsureRuntimeUiShader();
                var architecture = SelectAppleSiliconArchitecture(architectureProperty.PropertyType);
                architectureProperty.SetValue(null, architecture);
                selectedArchitecture = architecture.ToString();

                var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
                {
                    scenes = new[] { BootScenePath, Stage1ScenePath },
                    locationPathName = OutputPath,
                    target = BuildTarget.iOS,
                    options = BuildOptions.None,
                    extraScriptingDefines = new[] { SmokeDefine },
                });
                buildResult = report.summary.result.ToString();
                errors = report.summary.totalErrors;
                warnings = report.summary.totalWarnings;
                if (report.summary.result != BuildResult.Succeeded)
                {
                    error = $"{buildResult}: {errors} errors, {warnings} warnings";
                }
            }
            catch (Exception ex)
            {
                buildResult = "Exception";
                error = ex.GetType().Name + ": " + ex.Message;
                Debug.LogException(ex);
            }
            finally
            {
                try
                {
                    PlayerSettings.iOS.sdkVersion = originalSdk;
                    if (architectureProperty != null && originalArchitecture != null)
                    {
                        architectureProperty.SetValue(null, originalArchitecture);
                    }
                    AssetDatabase.SaveAssets();
                    restored = PlayerSettings.iOS.sdkVersion == originalSdk &&
                               PlayerSettings.GetScriptingDefineSymbols(namedTarget) == originalDefines;
                }
                catch (Exception restoreException)
                {
                    error = (error == null ? string.Empty : error + " | ") +
                            "Restore failed: " + restoreException.GetType().Name + ": " + restoreException.Message;
                    Debug.LogException(restoreException);
                }

                WriteReport(buildResult, errors, warnings, error, selectedArchitecture, restored, originalDefines);
            }

            EditorApplication.Exit(buildResult == BuildResult.Succeeded.ToString() && restored ? 0 : 1);
        }

        private static object SelectAppleSiliconArchitecture(Type propertyType)
        {
            if (!propertyType.IsEnum)
            {
                throw new InvalidOperationException("Simulator architecture property is not an enum: " + propertyType.FullName);
            }

            var names = Enum.GetNames(propertyType);
            var arm64 = names.FirstOrDefault(name => name.Contains("ARM64", StringComparison.OrdinalIgnoreCase));
            if (arm64 == null)
            {
                throw new InvalidOperationException("ARM64 simulator architecture is unavailable. Values: " + string.Join(",", names));
            }

            return Enum.Parse(propertyType, arm64);
        }

        private static void EnsureRuntimeUiShader()
        {
            var graphicsSettings = AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/GraphicsSettings.asset").FirstOrDefault();
            var shader = Shader.Find("UI/Default");
            if (graphicsSettings == null || shader == null)
            {
                throw new InvalidOperationException("GraphicsSettings or UI/Default shader could not be loaded");
            }

            var serialized = new SerializedObject(graphicsSettings);
            var included = serialized.FindProperty("m_AlwaysIncludedShaders");
            for (var i = 0; i < included.arraySize; i++)
            {
                if (included.GetArrayElementAtIndex(i).objectReferenceValue == shader)
                {
                    return;
                }
            }

            included.InsertArrayElementAtIndex(included.arraySize);
            included.GetArrayElementAtIndex(included.arraySize - 1).objectReferenceValue = shader;
            serialized.ApplyModifiedPropertiesWithoutUndo();
            AssetDatabase.SaveAssets();
        }

        private static void WriteReport(
            string result,
            int errors,
            int warnings,
            string error,
            string architecture,
            bool restored,
            string originalDefines)
        {
            var text =
                "{\n" +
                "  \"generatedAt\": \"2026-07-10\",\n" +
                "  \"phase\": \"U45\",\n" +
                "  \"evidenceKind\": \"Unity iOS Simulator build generation\",\n" +
                $"  \"result\": \"{Escape(result)}\",\n" +
                $"  \"errors\": {errors},\n" +
                $"  \"warnings\": {warnings},\n" +
                $"  \"outputPath\": \"{Escape(OutputPath)}\",\n" +
                $"  \"simulatorArchitecture\": {Nullable(architecture)},\n" +
                $"  \"settingsRestored\": {(restored ? "true" : "false")},\n" +
                $"  \"smokeDefineWasPreviouslyPresent\": {(originalDefines.Split(';').Contains(SmokeDefine) ? "true" : "false")},\n" +
                $"  \"error\": {Nullable(error)}\n" +
                "}\n";
            File.WriteAllText(ReportPath, text);
        }

        private static string Nullable(string value) => value == null ? "null" : $"\"{Escape(value)}\"";

        private static string Escape(string value) => value
            .Replace("\\", "\\\\", StringComparison.Ordinal)
            .Replace("\"", "\\\"", StringComparison.Ordinal)
            .Replace("\n", "\\n", StringComparison.Ordinal)
            .Replace("\r", "\\r", StringComparison.Ordinal);
    }
}
