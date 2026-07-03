using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.U2D;
using UnityEngine;
using UnityEngine.U2D;

namespace VampPon.UnitySpike.Editor
{
    public static class U36SpriteAtlasProductionPackingVerification
    {
        private const string ReportPath = "Logs/u36_sprite_atlas_production_packing_verification.txt";
        private const string AtlasRoot = "Assets/_Project/SpriteAtlases/U36";

        private static readonly AtlasPlan[] Plans =
        {
            new("U36Characters", "U36Characters.spriteatlas", new[] { "Assets/_Project/Resources/U5Candidates/Battle/u5-yui-battle-candidate.png" }),
            new("U36Enemies", "U36Enemies.spriteatlas", new[] { "Assets/_Project/Resources/U5Candidates/Battle/u5-ombu-battle-candidate.png" }),
            new("U36ItemsIcons", "U36ItemsIcons.spriteatlas", new[]
            {
                "Assets/_Project/Resources/U5Candidates/UI/u5-icon-frame.png",
                "Assets/_Project/Resources/U5Candidates/VFX/u5-exp-fragment.png",
            }),
            new("U36UiPaper", "U36UiPaper.spriteatlas", new[]
            {
                "Assets/_Project/Resources/U5Candidates/UI/u5-paper-panel.png",
                "Assets/_Project/Resources/U8Candidates/UI/result_new_badge.png",
                "Assets/_Project/Resources/U8Candidates/UI/result_paper_ledger_panel.png",
                "Assets/_Project/Resources/U8Candidates/UI/result_rank_wax_seal.png",
                "Assets/_Project/Resources/U8Candidates/UI/result_reward_memory_card.png",
                "Assets/_Project/Resources/U8Candidates/UI/stageselect_paper_map_base.png",
                "Assets/_Project/Resources/U8Candidates/UI/stageselect_route_line_ink.png",
                "Assets/_Project/Resources/U8Candidates/UI/stageselect_route_node.png",
                "Assets/_Project/Resources/U8Candidates/UI/stageselect_start_marker_lantern.png",
                "Assets/_Project/Resources/U8Refined/UI/result_new_badge_refined.png",
                "Assets/_Project/Resources/U10Candidates/UI/result_continue_paper_button.png",
                "Assets/_Project/Resources/U10Candidates/UI/result_stats_ink_strip.png",
                "Assets/_Project/Resources/U10Candidates/UI/stageselect_route_active_node.png",
                "Assets/_Project/Resources/U10Candidates/UI/stageselect_route_locked_node.png",
            }),
            new("U36Effects", "U36Effects.spriteatlas", new[]
            {
                "Assets/_Project/Resources/U5Candidates/VFX/u5-collect-trail.png",
                "Assets/_Project/Resources/U5Candidates/VFX/u5-ink-burst.png",
                "Assets/_Project/Resources/U5Candidates/VFX/u5-lantern-spark.png",
                "Assets/_Project/Resources/U8Candidates/VFX/levelup_rare_ink_flare.png",
                "Assets/_Project/Resources/U8Candidates/VFX/levelup_rare_lantern_pulse_ring.png",
                "Assets/_Project/Resources/U8Refined/VFX/levelup_rare_ink_flare_refined.png",
                "Assets/_Project/Resources/U10Candidates/VFX/levelup_rare_memory_tear_burst.png",
            }),
        };

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                EnsureAtlases();
                var report = VerifyAtlases();
                File.WriteAllText(ReportPath, report);
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                File.WriteAllText(ReportPath, ex.ToString());
                Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static void EnsureAtlases()
        {
            Directory.CreateDirectory(AtlasRoot);
            foreach (var plan in Plans)
            {
                var atlasPath = $"{AtlasRoot}/{plan.FileName}";
                var atlas = AssetDatabase.LoadAssetAtPath<SpriteAtlas>(atlasPath);
                if (atlas == null)
                {
                    atlas = new SpriteAtlas();
                    AssetDatabase.CreateAsset(atlas, atlasPath);
                }

                atlas.Remove(atlas.GetPackables());
                var packables = new List<UnityEngine.Object>();
                foreach (var path in plan.AssetPaths)
                {
                    var texture = AssetDatabase.LoadAssetAtPath<Texture2D>(path);
                    if (texture == null) throw new InvalidOperationException($"Atlas target missing: {path}");
                    packables.Add(texture);
                }

                atlas.Add(packables.ToArray());
                atlas.SetPackingSettings(new SpriteAtlasPackingSettings
                {
                    enableRotation = false,
                    enableTightPacking = false,
                    padding = 4,
                });
                atlas.SetTextureSettings(new SpriteAtlasTextureSettings
                {
                    readable = false,
                    generateMipMaps = false,
                    sRGB = true,
                    filterMode = FilterMode.Bilinear,
                });
                atlas.SetPlatformSettings(new TextureImporterPlatformSettings
                {
                    name = "DefaultTexturePlatform",
                    maxTextureSize = 2048,
                    format = TextureImporterFormat.Automatic,
                    textureCompression = TextureImporterCompression.Compressed,
                    overridden = false,
                });
                EditorUtility.SetDirty(atlas);
            }

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
        }

        private static string VerifyAtlases()
        {
            var lines = new List<string>();
            foreach (var plan in Plans)
            {
                var atlasPath = $"{AtlasRoot}/{plan.FileName}";
                var atlas = AssetDatabase.LoadAssetAtPath<SpriteAtlas>(atlasPath);
                Require(atlas != null, $"{plan.Name} exists");
                var packables = atlas.GetPackables();
                Require(packables.Length == plan.AssetPaths.Length, $"{plan.Name} packable count");
                Require(packables.All(packable => AssetDatabase.GetAssetPath(packable).StartsWith("Assets/_Project/Resources/", StringComparison.Ordinal)), $"{plan.Name} only project resources");
                Require(packables.All(packable => !AssetDatabase.GetAssetPath(packable).Contains("docs/design-targets/generated")), $"{plan.Name} excludes docs generated");
                Require(packables.All(packable => !AssetDatabase.GetAssetPath(packable).Contains("FullscreenArt")), $"{plan.Name} excludes fullscreen art");
                lines.Add($"{plan.Name}: {packables.Length} packables");
            }

            Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
            lines.Add("U36 Sprite Atlas production packing verification passed; productionApproved=false; Addressables not introduced");
            return string.Join(Environment.NewLine, lines);
        }

        private static void Require(bool condition, string label)
        {
            if (!condition) throw new InvalidOperationException(label);
        }

        private readonly struct AtlasPlan
        {
            public AtlasPlan(string name, string fileName, string[] assetPaths)
            {
                Name = name;
                FileName = fileName;
                AssetPaths = assetPaths;
            }

            public string Name { get; }
            public string FileName { get; }
            public string[] AssetPaths { get; }
        }
    }
}
