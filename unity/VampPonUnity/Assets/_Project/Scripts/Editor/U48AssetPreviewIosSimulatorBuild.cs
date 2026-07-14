#if UNITY_EDITOR
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Collections.Generic;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public static class U48AssetPreviewIosSimulatorBuild
    {
        private const string PreviewDefine = "VAMPPON_U48_ASSET_PREVIEW";
        private const string TempCatalogDirectory = "Assets/_Project/Resources/U48Preview";
        private const string TempCatalogPath = TempCatalogDirectory + "/preview-catalog.json";
        private const string CandidateRoot = "Assets/_Project/Art/Candidates/U48/BatchA";
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
            var entries = new List<PreviewEntry>();
            foreach (var sourceAssetPath in AssetDatabase.FindAssets("t:Texture2D", new[] { CandidateRoot }).Select(AssetDatabase.GUIDToAssetPath).OrderBy(value => value, StringComparer.Ordinal))
            {
                var group = Path.GetFileName(Path.GetDirectoryName(sourceAssetPath));
                var candidateId = Path.GetFileNameWithoutExtension(sourceAssetPath);
                var destinationDirectory = $"{TempCatalogDirectory}/Assets/{group}";
                Directory.CreateDirectory(Path.Combine(projectRoot, destinationDirectory));
                var destinationAssetPath = $"{destinationDirectory}/{candidateId}.png";
                if (!AssetDatabase.CopyAsset(sourceAssetPath, destinationAssetPath)) throw new InvalidOperationException("U48 preview candidate copy failed: " + sourceAssetPath);
                entries.Add(CreateEntry(projectRoot, sourceAssetPath, group, candidateId));
            }
            if (entries.Count != 36) throw new InvalidOperationException($"U48 Batch A preview catalog expected 36 candidates, found {entries.Count}.");
            entries.Add(new PreviewEntry
            {
                assetGroup = "common-projectile", candidateId = "common-projectile-missing-resource-verification", slot = "Projectile",
                resourcePath = "U48Preview/intentionally-missing-resource", sourcePath = "verification-only/intentionally-missing-resource.png",
                sourceSha256 = entries[0].sourceSha256,
            });
            File.WriteAllText(Path.Combine(projectRoot, TempCatalogPath), JsonUtility.ToJson(new PreviewCatalog { schemaVersion = 1, entries = entries.ToArray() }, true) + "\n");
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            if (AssetDatabase.LoadAssetAtPath<UnityEngine.TextAsset>(TempCatalogPath) == null) throw new InvalidOperationException("Temporary U48 preview catalog import failed.");
        }

        private static PreviewEntry CreateEntry(string projectRoot, string sourceAssetPath, string group, string candidateId)
        {
            var resourcePath = $"U48Preview/Assets/{group}/{candidateId}";
            var slot = group switch
            {
                "player-yui" => "Player", "enemy-onbu" => "Enemy", "stage1-background" => "Background",
                "exp-pickup" => "ExpPickup", "healing-pickup" => "HealingPickup", "common-projectile" => "Projectile",
                "hit-effect" => "Hit", "enemy-death-effect" => "EnemyDeath", "movement-trail" => "Trail",
                _ => throw new InvalidOperationException("Unexpected U48 Batch A group: " + group),
            };
            var entry = new PreviewEntry
            {
                assetGroup = group, candidateId = candidateId, slot = slot, resourcePath = resourcePath,
                sourcePath = "unity/VampPonUnity/" + sourceAssetPath, sourceSha256 = Hash(Path.Combine(projectRoot, sourceAssetPath)),
                targetObjectNames = group == "stage1-background" ? new[] { "DarkPaperNightBackground" } : Array.Empty<string>(),
            };
            if (group == "player-yui")
            {
                entry.idleLeft = new[] { "yui_idle_l_00", "yui_idle_l_01" }; entry.idleRight = new[] { "yui_idle_r_00", "yui_idle_r_01" };
                entry.walkLeft = new[] { "yui_walk_l_00", "yui_walk_l_01" }; entry.walkRight = new[] { "yui_walk_r_00", "yui_walk_r_01" };
                entry.hurtLeft = new[] { "yui_hurt_l_00", "yui_recoil_l_00" }; entry.hurtRight = new[] { "yui_hurt_r_00", "yui_recoil_r_00" };
                entry.attackLeft = new[] { "yui_attack_l_00", "yui_attack_l_01" }; entry.attackRight = new[] { "yui_attack_r_00", "yui_attack_r_01" };
            }
            if (group == "enemy-onbu")
            {
                entry.enemyIdle = Names("onbu_idle", 8); entry.enemyMove = Names("onbu_move", 8);
                entry.enemyHurt = Names("onbu_hurt", 8); entry.enemyDeath = Names("onbu_death", 8);
            }
            return entry;
        }

        private static string[] Names(string prefix, int count) => Enumerable.Range(0, count).Select(value => $"{prefix}_{value:00}").ToArray();
        private static string Hash(string path)
        {
            using var algorithm = SHA256.Create();
            return BitConverter.ToString(algorithm.ComputeHash(File.ReadAllBytes(path))).Replace("-", string.Empty, StringComparison.Ordinal).ToLowerInvariant();
        }

        [Serializable] private sealed class PreviewCatalog { public int schemaVersion; public PreviewEntry[] entries; }
        [Serializable] private sealed class PreviewEntry
        {
            public string assetGroup, candidateId, slot, resourcePath, sourcePath, sourceSha256;
            public string[] targetObjectNames, idleLeft, idleRight, walkLeft, walkRight, hurtLeft, hurtRight, attackLeft, attackRight;
            public string[] enemyIdle, enemyMove, enemyHurt, enemyDeath;
        }
    }
}
#endif
