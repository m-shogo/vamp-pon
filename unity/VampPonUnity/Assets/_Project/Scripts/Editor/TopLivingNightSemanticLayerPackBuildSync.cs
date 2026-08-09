using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    // Build-only staging for the final semantic layer pack. Bridge builds keep
    // using the already-registered V2 layers. Once final Core5 is registered,
    // player builds fail closed until the six registered 430x932 production
    // layers exist, preventing a silent regression back to a flattened final.
    public sealed class TopLivingNightSemanticLayerPackBuildSync :
        IPreprocessBuildWithReport,
        IPostprocessBuildWithReport
    {
        private const string SourceRootRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/layers";
        internal const string DestinationRoot =
            "Assets/Resources/TopLivingNightV3SemanticGenerated";
        internal const string ReadyMarkerPath = DestinationRoot + "/pack-ready.txt";

        private static readonly LayerSpec[] Layers =
        {
            new("00-environment-base.png", "environment-base.png", false),
            new("04-distant-town.png", "distant-town.png", true),
            new("06-core5.png", "core5.png", true),
            new("07-animal-robot.png", "animal-robot.png", true),
            new("09-fire-base.png", "fire-base.png", true),
            new("15-foreground-accents.png", "foreground-accents.png", true),
        };

        public int callbackOrder => -133;

        public void OnPreprocessBuild(BuildReport report)
        {
            Cleanup(refresh: false);

            var selection = TopLivingNightCompositeV3BuildAssetSync.ResolveCompositeSource();
            if (!selection.IsFinal)
                return;

            try
            {
                StageFinalSemanticPack();
                Debug.Log(
                    $"TOP semantic layer pack: staged final Core5 production layers for {report.summary.platform}.");
            }
            catch
            {
                Cleanup();
                throw;
            }
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            Cleanup();
        }

        internal static bool FinalSemanticPackRequired()
        {
            return TopLivingNightCompositeV3BuildAssetSync.ResolveCompositeSource().IsFinal;
        }

        internal static void StageForVerification()
        {
            Cleanup(refresh: false);
            if (!FinalSemanticPackRequired())
                return;

            try
            {
                StageFinalSemanticPack();
            }
            catch
            {
                Cleanup();
                throw;
            }
        }

        internal static void CleanupForVerification()
        {
            Cleanup();
        }

        internal static string[] DestinationAssetPaths()
        {
            var result = new string[Layers.Length];
            for (var index = 0; index < Layers.Length; index++)
                result[index] = $"{DestinationRoot}/{Layers[index].DestinationFileName}";
            return result;
        }

        private static void StageFinalSemanticPack()
        {
            var sourceRoot = Path.Combine(
                RepositoryRoot(),
                SourceRootRelativePath.Replace('/', Path.DirectorySeparatorChar));
            if (!Directory.Exists(sourceRoot))
                throw new BuildFailedException(
                    $"TOP final Core5 semantic layer directory is missing: {sourceRoot}. " +
                    "Final runtime may not silently fall back to a flattened composite.");

            Directory.CreateDirectory(DestinationRoot);
            var imported = new List<string>();

            foreach (var spec in Layers)
            {
                var source = Path.Combine(sourceRoot, spec.SourceFileName);
                if (!File.Exists(source))
                    throw new BuildFailedException(
                        $"TOP final Core5 semantic layer is missing: {source}");

                var dimensions = ReadPngDimensions(source);
                if (dimensions.x != 430 || dimensions.y != 932)
                    throw new BuildFailedException(
                        $"TOP semantic layer dimensions mismatch for {spec.SourceFileName}: " +
                        $"expected 430x932, actual {dimensions.x}x{dimensions.y}.");

                var destinationAssetPath = $"{DestinationRoot}/{spec.DestinationFileName}";
                File.Copy(source, destinationAssetPath, true);
                imported.Add(destinationAssetPath);
            }

            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            for (var index = 0; index < Layers.Length; index++)
                ConfigureTextureImporter(imported[index], Layers[index].AlphaRequired);

            File.WriteAllText(ReadyMarkerPath, "final-core5-layered\n");
            AssetDatabase.ImportAsset(
                ReadyMarkerPath,
                ImportAssetOptions.ForceSynchronousImport | ImportAssetOptions.ForceUpdate);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
        }

        private static void ConfigureTextureImporter(string assetPath, bool alphaRequired)
        {
            AssetDatabase.ImportAsset(
                assetPath,
                ImportAssetOptions.ForceSynchronousImport | ImportAssetOptions.ForceUpdate);

            if (AssetImporter.GetAtPath(assetPath) is not TextureImporter importer)
                throw new BuildFailedException(
                    $"TOP semantic layer texture importer unavailable: {assetPath}");

            importer.textureType = TextureImporterType.Default;
            importer.sRGBTexture = true;
            importer.alphaSource = alphaRequired
                ? TextureImporterAlphaSource.FromInput
                : TextureImporterAlphaSource.None;
            importer.alphaIsTransparency = alphaRequired;
            importer.mipmapEnabled = false;
            importer.wrapMode = TextureWrapMode.Clamp;
            importer.filterMode = FilterMode.Bilinear;
            importer.isReadable = false;
            importer.maxTextureSize = 2048;
            importer.textureCompression = TextureImporterCompression.Compressed;
            importer.crunchedCompression = false;

            var ios = importer.GetPlatformTextureSettings("iPhone");
            ios.name = "iPhone";
            ios.overridden = true;
            ios.maxTextureSize = 2048;
            ios.format = TextureImporterFormat.ASTC_6x6;
            ios.compressionQuality = 50;
            importer.SetPlatformTextureSettings(ios);
            importer.SaveAndReimport();
        }

        private static void Cleanup(bool refresh = true)
        {
            FileUtil.DeleteFileOrDirectory(DestinationRoot);
            FileUtil.DeleteFileOrDirectory(DestinationRoot + ".meta");
            if (refresh)
                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
        }

        private static Vector2Int ReadPngDimensions(string path)
        {
            using var stream = File.OpenRead(path);
            var header = new byte[24];
            if (stream.Read(header, 0, header.Length) != header.Length)
                throw new InvalidDataException($"PNG header is incomplete: {path}");

            var signature = new byte[]
                { 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a };
            for (var index = 0; index < signature.Length; index++)
                if (header[index] != signature[index])
                    throw new InvalidDataException($"PNG signature is invalid: {path}");

            return new Vector2Int(
                ReadBigEndianInt32(header, 16),
                ReadBigEndianInt32(header, 20));
        }

        private static int ReadBigEndianInt32(byte[] bytes, int offset)
        {
            return
                bytes[offset] << 24 |
                bytes[offset + 1] << 16 |
                bytes[offset + 2] << 8 |
                bytes[offset + 3];
        }

        private static string RepositoryRoot()
        {
            return Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
        }

        private readonly struct LayerSpec
        {
            public LayerSpec(string sourceFileName, string destinationFileName, bool alphaRequired)
            {
                SourceFileName = sourceFileName;
                DestinationFileName = destinationFileName;
                AlphaRequired = alphaRequired;
            }

            public string SourceFileName { get; }
            public string DestinationFileName { get; }
            public bool AlphaRequired { get; }
        }
    }
}
