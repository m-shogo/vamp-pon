using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using UnityEditor;
using UnityEditor.U2D.Sprites;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Visuals;

namespace VampPon.UnitySpike.Editor
{
    public static class U451RuntimeDotAssetBuilder
    {
        private const int Columns = 8;
        private const int Rows = 6;
        private const int CellSize = 180;
        private const string YuiSource = "public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png";
        private const string OnbuSource = "public/assets/prototypes/sprite-sheets/enemies-original/enemy-ombu-small-sheet-v2-1440x1080.png";
        private const string YuiAsset = "Assets/_Project/Resources/RuntimeVisuals/Stage1/Characters/Yui/yui-runtime-dot-sheet.png";
        private const string OnbuAsset = "Assets/_Project/Resources/RuntimeVisuals/Stage1/Enemies/Onbu/onbu-runtime-dot-sheet.png";
        private const string CommonRoot = "Assets/_Project/Resources/RuntimeVisuals/Stage1/Common";
        private const string ManifestAsset = "Assets/_Project/Resources/RuntimeVisuals/Stage1/runtime-dot-manifest.json";
        private const string RegistryAsset = "Assets/_Project/Resources/RuntimeVisuals/Stage1/Stage1RuntimeVisualAssetRegistry.asset";
        private const string ValidationReport = "Logs/u45_1_runtime_dot_asset_validation.json";

        private static readonly string[] YuiFrameNames =
        {
            "yui_idle_front_00", "yui_idle_front_01", "yui_idle_l_00", "yui_idle_r_00", "yui_idle_back_00", "yui_ready_front_00", "yui_idle_l_01", "yui_idle_r_01",
            "yui_walk_front_00", "yui_walk_front_01", "yui_walk_r_00", "yui_walk_r_01", "yui_walk_l_00", "yui_walk_l_01", "yui_walk_back_00", "yui_walk_back_01",
            "yui_cast_front_00", "yui_attack_l_00", "yui_attack_r_00", "yui_cast_back_00", "yui_attack_front_00", "yui_attack_l_01", "yui_attack_r_01", "yui_attack_back_00",
            "yui_hurt_front_00", "yui_hurt_l_00", "yui_hurt_r_00", "yui_hurt_back_00", "yui_recoil_front_00", "yui_recoil_l_00", "yui_recoil_r_00", "yui_recoil_back_00",
            "yui_special_normal_00", "yui_special_black_00", "yui_pickup_00", "yui_interact_00", "yui_downed_00", "yui_rest_00", "yui_emote_happy_00", "yui_emote_surprised_00",
            "yui_portrait_neutral", "yui_portrait_alt", "yui_vessel_icon", "yui_secondary_item_icon", "yui_crest_normal", "yui_crest_black", "yui_memory_item_icon", "yui_effect_icon",
        };

        private static readonly string[] OnbuFrameNames = Enumerable.Range(0, 48).Select(index =>
        {
            var row = index / Columns;
            var frame = index % Columns;
            var state = row switch
            {
                0 => "idle",
                1 => "move",
                2 => "hurt",
                3 => "impact",
                4 => "recover",
                _ => "death",
            };
            return $"onbu_{state}_{frame:00}";
        }).ToArray();

        [MenuItem("VampPon/U45.1/Build Runtime Dot Assets")]
        public static void BuildRuntimeDotAssets()
        {
            var repoRoot = RepoRoot();
            Copy(Path.Combine(repoRoot, YuiSource), YuiAsset);
            Pixelate(Path.Combine(repoRoot, OnbuSource), OnbuAsset, 3);
            CopyCommon("u5-lantern-spark.png", "runtime-lantern-spark.png");
            CopyCommon("u5-exp-fragment.png", "runtime-exp-fragment.png");
            CopyCommon("u5-ink-burst.png", "runtime-ink-burst.png");
            CopyCommon("u5-collect-trail.png", "runtime-collect-trail.png");
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);

            ConfigureSheet(YuiAsset, YuiFrameNames, 150f, new Vector2(0.5f, 0.02f));
            ConfigureSheet(OnbuAsset, OnbuFrameNames, 120f, new Vector2(0.5f, 0.08f));
            ConfigureSingle(CommonRoot + "/runtime-lantern-spark.png");
            ConfigureSingle(CommonRoot + "/runtime-exp-fragment.png");
            ConfigureSingle(CommonRoot + "/runtime-ink-burst.png");
            ConfigureSingle(CommonRoot + "/runtime-collect-trail.png");
            BuildRegistry();
            WriteManifest(repoRoot);
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            ValidateRuntimeDotAssets();
        }

        [MenuItem("VampPon/U45.1/Validate Runtime Dot Assets")]
        public static void ValidateRuntimeDotAssets()
        {
            var yui = AssetDatabase.LoadAllAssetsAtPath(YuiAsset).OfType<Sprite>().ToArray();
            var onbu = AssetDatabase.LoadAllAssetsAtPath(OnbuAsset).OfType<Sprite>().ToArray();
            var yuiImporter = AssetImporter.GetAtPath(YuiAsset) as TextureImporter;
            var onbuImporter = AssetImporter.GetAtPath(OnbuAsset) as TextureImporter;
            var registry = AssetDatabase.LoadAssetAtPath<Stage1RuntimeVisualAssetRegistry>(RegistryAsset);
            var passed = yui.Length == 48 && onbu.Length == 48 &&
                         YuiFrameNames.All(name => yui.Any(sprite => sprite.name == name)) &&
                         OnbuFrameNames.All(name => onbu.Any(sprite => sprite.name == name)) &&
                         ImportReady(yuiImporter, 150f) && ImportReady(onbuImporter, 120f) && registry != null;
            registry?.Validate();
            Directory.CreateDirectory("Logs");
            File.WriteAllText(ValidationReport,
                "{\n" +
                "  \"generatedAt\": \"2026-07-10\",\n" +
                "  \"phase\": \"U45.1\",\n" +
                $"  \"result\": \"{(passed ? "passed" : "failed")}\",\n" +
                $"  \"playerFrameCount\": {yui.Length},\n" +
                $"  \"enemyFrameCount\": {onbu.Length},\n" +
                "  \"playerSpriteMode\": \"Multiple\",\n" +
                "  \"enemySpriteMode\": \"Multiple\"\n" +
                "}\n");
            if (!passed) throw new InvalidOperationException("U45.1 runtime dot asset validation failed");
            Debug.Log("U45.1 runtime dot asset validation passed: player=48, enemy=48");
        }

        private static bool ImportReady(TextureImporter importer, float ppu) => importer != null &&
            importer.spriteImportMode == SpriteImportMode.Multiple &&
            importer.filterMode == FilterMode.Point &&
            !importer.mipmapEnabled &&
            importer.textureCompression == TextureImporterCompression.Uncompressed &&
            Mathf.Approximately(importer.spritePixelsPerUnit, ppu);

        private static void ConfigureSheet(string assetPath, string[] names, float ppu, Vector2 pivot)
        {
            var importer = AssetImporter.GetAtPath(assetPath) as TextureImporter
                ?? throw new InvalidOperationException("Texture importer missing: " + assetPath);
            importer.textureType = TextureImporterType.Sprite;
            importer.spriteImportMode = SpriteImportMode.Multiple;
            importer.spritePixelsPerUnit = ppu;
            importer.filterMode = FilterMode.Point;
            importer.mipmapEnabled = false;
            importer.wrapMode = TextureWrapMode.Clamp;
            importer.alphaIsTransparency = true;
            importer.textureCompression = TextureImporterCompression.Uncompressed;
            importer.isReadable = false;
            var settings = new TextureImporterSettings();
            importer.ReadTextureSettings(settings);
            settings.spriteMeshType = SpriteMeshType.FullRect;
            importer.SetTextureSettings(settings);
            importer.SaveAndReimport();

            var factory = new SpriteDataProviderFactories();
            factory.Init();
            var dataProvider = factory.GetSpriteEditorDataProviderFromObject(importer);
            dataProvider.InitSpriteEditorDataProvider();
            var spriteRects = names.Select((name, index) => new SpriteRect
            {
                name = name,
                rect = new Rect((index % Columns) * CellSize, (Rows - 1 - index / Columns) * CellSize, CellSize, CellSize),
                alignment = SpriteAlignment.Custom,
                pivot = pivot,
                spriteID = StableSpriteId(assetPath, name),
            }).ToArray();
            dataProvider.SetSpriteRects(spriteRects);
            var nameProvider = dataProvider.GetDataProvider<ISpriteNameFileIdDataProvider>();
            nameProvider.SetNameFileIdPairs(spriteRects.Select(rect => new SpriteNameFileIdPair(rect.name, rect.spriteID)));
            dataProvider.Apply();
            importer.SaveAndReimport();
        }

        private static GUID StableSpriteId(string assetPath, string frameName)
        {
            using var sha = SHA256.Create();
            var digest = sha.ComputeHash(Encoding.UTF8.GetBytes(assetPath + ":" + frameName));
            var hex = BitConverter.ToString(digest).Replace("-", string.Empty).ToLowerInvariant();
            return new GUID(hex.Substring(0, 32));
        }

        private static void ConfigureSingle(string assetPath)
        {
            var importer = AssetImporter.GetAtPath(assetPath) as TextureImporter
                ?? throw new InvalidOperationException("Texture importer missing: " + assetPath);
            importer.textureType = TextureImporterType.Sprite;
            importer.spriteImportMode = SpriteImportMode.Single;
            importer.spritePixelsPerUnit = 180f;
            importer.filterMode = FilterMode.Point;
            importer.mipmapEnabled = false;
            importer.wrapMode = TextureWrapMode.Clamp;
            importer.alphaIsTransparency = true;
            importer.textureCompression = TextureImporterCompression.Uncompressed;
            var settings = new TextureImporterSettings();
            importer.ReadTextureSettings(settings);
            settings.spriteMeshType = SpriteMeshType.FullRect;
            importer.SetTextureSettings(settings);
            importer.SaveAndReimport();
        }

        private static void BuildRegistry()
        {
            var yui = AssetDatabase.LoadAllAssetsAtPath(YuiAsset).OfType<Sprite>().ToArray();
            var onbu = AssetDatabase.LoadAllAssetsAtPath(OnbuAsset).OfType<Sprite>().ToArray();
            var registry = AssetDatabase.LoadAssetAtPath<Stage1RuntimeVisualAssetRegistry>(RegistryAsset);
            if (registry == null)
            {
                registry = ScriptableObject.CreateInstance<Stage1RuntimeVisualAssetRegistry>();
                AssetDatabase.CreateAsset(registry, RegistryAsset);
            }

            registry.ConfigureForEditor(
                "RuntimeVisuals/Stage1/Characters/Yui/yui-runtime-dot-sheet",
                "RuntimeVisuals/Stage1/Enemies/Onbu/onbu-runtime-dot-sheet",
                Frames(yui, "yui_idle_l_00", "yui_idle_l_01"),
                Frames(yui, "yui_idle_r_00", "yui_idle_r_01"),
                Frames(yui, "yui_walk_l_00", "yui_walk_l_01"),
                Frames(yui, "yui_walk_r_00", "yui_walk_r_01"),
                Frames(yui, "yui_hurt_l_00"),
                Frames(yui, "yui_hurt_r_00"),
                Frames(yui, "yui_attack_l_00", "yui_attack_l_01"),
                Frames(yui, "yui_attack_r_00", "yui_attack_r_01"),
                Frames(onbu, "onbu_idle_00", "onbu_idle_01", "onbu_idle_02", "onbu_idle_03"),
                Frames(onbu, "onbu_move_00", "onbu_move_01", "onbu_move_02", "onbu_move_03"),
                Frames(onbu, "onbu_hurt_00", "onbu_hurt_01"),
                Frames(onbu, "onbu_death_00", "onbu_death_01", "onbu_death_02", "onbu_death_03", "onbu_death_04", "onbu_death_05", "onbu_death_06", "onbu_death_07"));
            EditorUtility.SetDirty(registry);
            AssetDatabase.SaveAssets();
        }

        private static Sprite[] Frames(Sprite[] sprites, params string[] names) => names.Select(name =>
            sprites.FirstOrDefault(sprite => sprite.name == name)
            ?? throw new InvalidOperationException("Runtime visual frame missing: " + name)).ToArray();

        private static void Pixelate(string sourcePath, string assetPath, int blockSize)
        {
            var source = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!ImageConversion.LoadImage(source, File.ReadAllBytes(sourcePath), false))
                throw new InvalidOperationException("Could not decode source: " + sourcePath);
            if (source.width != Columns * CellSize || source.height != Rows * CellSize)
                throw new InvalidOperationException($"Unexpected source size: {source.width}x{source.height}");

            var pixels = source.GetPixels32();
            for (var y = 0; y < source.height; y += blockSize)
            {
                for (var x = 0; x < source.width; x += blockSize)
                {
                    var sampleX = Mathf.Min(source.width - 1, x + blockSize / 2);
                    var sampleY = Mathf.Min(source.height - 1, y + blockSize / 2);
                    var sample = pixels[sampleY * source.width + sampleX];
                    for (var by = 0; by < blockSize && y + by < source.height; by++)
                    for (var bx = 0; bx < blockSize && x + bx < source.width; bx++)
                        pixels[(y + by) * source.width + x + bx] = sample;
                }
            }
            source.SetPixels32(pixels);
            source.Apply(false, false);
            WriteAsset(assetPath, ImageConversion.EncodeToPNG(source));
            UnityEngine.Object.DestroyImmediate(source);
        }

        private static void Copy(string sourcePath, string assetPath)
        {
            WriteAsset(assetPath, File.ReadAllBytes(sourcePath));
        }

        private static void CopyCommon(string sourceName, string outputName)
        {
            var source = "Assets/_Project/Resources/U5Candidates/VFX/" + sourceName;
            Copy(Path.GetFullPath(source), CommonRoot + "/" + outputName);
        }

        private static void WriteAsset(string assetPath, byte[] bytes)
        {
            var absolute = Path.GetFullPath(assetPath);
            Directory.CreateDirectory(Path.GetDirectoryName(absolute) ?? throw new InvalidOperationException(assetPath));
            File.WriteAllBytes(absolute, bytes);
        }

        private static void WriteManifest(string repoRoot)
        {
            var text =
                "{\n" +
                "  \"generatedAt\": \"2026-07-10\",\n" +
                "  \"phase\": \"U45.1\",\n" +
                "  \"originKind\": \"deterministic_derivation\",\n" +
                $"  \"sourceCommit\": \"83f61c92ce6258c04bed77d50400db62d15f578e\",\n" +
                $"  \"playerSourcePath\": \"{YuiSource}\",\n" +
                $"  \"playerSourceHash\": \"{Sha256(Path.Combine(repoRoot, YuiSource))}\",\n" +
                $"  \"playerOutputPath\": \"{YuiAsset}\",\n" +
                $"  \"playerOutputHash\": \"{Sha256(Path.GetFullPath(YuiAsset))}\",\n" +
                $"  \"enemySourcePath\": \"{OnbuSource}\",\n" +
                $"  \"enemySourceHash\": \"{Sha256(Path.Combine(repoRoot, OnbuSource))}\",\n" +
                $"  \"enemyOutputPath\": \"{OnbuAsset}\",\n" +
                $"  \"enemyOutputHash\": \"{Sha256(Path.GetFullPath(OnbuAsset))}\",\n" +
                "  \"frameGrid\": \"8x6 / 180x180 / 48 frames\",\n" +
                "  \"playerPPU\": 150,\n" +
                "  \"enemyPPU\": 120,\n" +
                "  \"playerPivot\": [0.5, 0.02],\n" +
                "  \"enemyPivot\": [0.5, 0.08],\n" +
                "  \"importSettings\": \"Sprite Multiple; Point; mipmap off; clamp; alpha transparency; uncompressed; FullRect\",\n" +
                "  \"transformationSteps\": [\"copy Yui approved reference candidate without source overwrite\", \"quantize Onbu into deterministic 3x3 nearest-color blocks\", \"slice 8x6 with feet pivots\"],\n" +
                "  \"approvedAsFinal\": false,\n" +
                "  \"runtimeApproved\": false\n" +
                "}\n";
            WriteAsset(ManifestAsset, Encoding.UTF8.GetBytes(text));
        }

        private static string Sha256(string path)
        {
            using var sha = SHA256.Create();
            return BitConverter.ToString(sha.ComputeHash(File.ReadAllBytes(path))).Replace("-", string.Empty).ToLowerInvariant();
        }

        private static string RepoRoot() => Path.GetFullPath(Path.Combine(Application.dataPath, "../../.."));
    }
}
