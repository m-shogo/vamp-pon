#if UNITY_EDITOR
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using UnityEditor;
using UnityEditor.Build.Reporting;

namespace VampPon.UnitySpike.Editor
{
    public static class U48AssetPreviewIosSimulatorBuild
    {
        private const string PreviewDefine = "VAMPPON_U48_ASSET_PREVIEW";
        private const string TempCatalogDirectory = "Assets/_Project/Resources/U48Preview";
        private const string TempCatalogPath = TempCatalogDirectory + "/preview-catalog.json";
        private static readonly string[] Scenes = { "Assets/_Project/Scenes/Boot/Boot.unity", "Assets/_Project/Scenes/Stage1/Stage1.unity" };

        [MenuItem("VampPon/U48/Build iOS Simulator Without Preview")]
        public static void BuildWithoutPreviewDefine() => Build(false);

        [MenuItem("VampPon/U48/Build iOS Simulator Preview Verification")]
        public static void BuildWithPreviewDefine() => Build(true);

        private static void Build(bool preview)
        {
            var projectRoot = Path.GetFullPath(Path.Combine(UnityEngine.Application.dataPath, ".."));
            var output = Path.Combine(projectRoot, "Builds", preview ? "iOS-U48-Preview" : "iOS-U48-Normal");
            var architectureProperty = typeof(PlayerSettings.iOS).GetProperty("simulatorSdkArchitecture", BindingFlags.Public | BindingFlags.Static);
            var originalSdk = PlayerSettings.iOS.sdkVersion;
            var originalArchitecture = architectureProperty?.GetValue(null);
            var result = BuildResult.Unknown;
            try
            {
                if (architectureProperty == null || !architectureProperty.CanWrite) throw new InvalidOperationException("iOS Simulator architecture setting is unavailable.");
                PlayerSettings.iOS.sdkVersion = iOSSdkVersion.SimulatorSDK;
                var arm64 = Enum.GetNames(architectureProperty.PropertyType).First(name => name.Contains("ARM64", StringComparison.OrdinalIgnoreCase));
                architectureProperty.SetValue(null, Enum.Parse(architectureProperty.PropertyType, arm64));
                if (preview) CreateTemporaryCatalog(projectRoot);
                Directory.CreateDirectory(output);
                var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
                {
                    scenes = Scenes,
                    locationPathName = output,
                    target = BuildTarget.iOS,
                    options = BuildOptions.None,
                    extraScriptingDefines = preview ? new[] { PreviewDefine } : Array.Empty<string>(),
                });
                result = report.summary.result;
                if (result != BuildResult.Succeeded) throw new InvalidOperationException($"U48 Simulator build failed: {result}, errors={report.summary.totalErrors}");
            }
            finally
            {
                if (AssetDatabase.IsValidFolder(TempCatalogDirectory)) AssetDatabase.DeleteAsset(TempCatalogDirectory);
                PlayerSettings.iOS.sdkVersion = originalSdk;
                if (architectureProperty != null && originalArchitecture != null) architectureProperty.SetValue(null, originalArchitecture);
                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh();
            }
            EditorApplication.Exit(result == BuildResult.Succeeded ? 0 : 1);
        }

        private static void CreateTemporaryCatalog(string projectRoot)
        {
            if (AssetDatabase.IsValidFolder(TempCatalogDirectory)) AssetDatabase.DeleteAsset(TempCatalogDirectory);
            Directory.CreateDirectory(Path.Combine(projectRoot, TempCatalogDirectory));
            var sourcePath = "unity/VampPonUnity/Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-lantern-spark.png";
            var source = Path.Combine(projectRoot, "Assets/_Project/Resources/RuntimeVisuals/Stage1/Common/runtime-lantern-spark.png");
            string hash;
            using (var algorithm = SHA256.Create())
            {
                hash = BitConverter.ToString(algorithm.ComputeHash(File.ReadAllBytes(source))).Replace("-", string.Empty, StringComparison.Ordinal).ToLowerInvariant();
            }
            File.WriteAllText(Path.Combine(projectRoot, TempCatalogPath),
                "{\n" +
                "  \"schemaVersion\": 1,\n" +
                "  \"entries\": [\n" +
                "    {\n" +
                "      \"assetGroup\": \"common-projectile\",\n" +
                "      \"candidateId\": \"common-projectile-candidate-a\",\n" +
                "      \"slot\": \"Projectile\",\n" +
                "      \"resourcePath\": \"RuntimeVisuals/Stage1/Common/runtime-lantern-spark\",\n" +
                $"      \"sourcePath\": \"{sourcePath}\",\n" +
                $"      \"sourceSha256\": \"{hash}\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"assetGroup\": \"common-projectile\",\n" +
                "      \"candidateId\": \"common-projectile-missing-resource-verification\",\n" +
                "      \"slot\": \"Projectile\",\n" +
                "      \"resourcePath\": \"U48Preview/intentionally-missing-resource\",\n" +
                "      \"sourcePath\": \"verification-only/intentionally-missing-resource.png\",\n" +
                $"      \"sourceSha256\": \"{hash}\"\n" +
                "    }\n" +
                "  ]\n" +
                "}\n");
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            if (AssetDatabase.LoadAssetAtPath<UnityEngine.TextAsset>(TempCatalogPath) == null) throw new InvalidOperationException("Temporary U48 preview catalog import failed.");
        }
    }
}
#endif
