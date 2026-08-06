using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public sealed class LoadingSeasonalBuildAssetSync :
        IPreprocessBuildWithReport,
        IPostprocessBuildWithReport
    {
        private const string ManifestRelativePath =
            "docs/design-targets/generated/loading-seasonal-v1/manifest.json";
        private const string DestinationRelativePath =
            "Assets/Resources/LoadingSeasonal";

        public int callbackOrder => -150;

        public void OnPreprocessBuild(BuildReport report)
        {
            StageAndImport();
            Debug.Log(
                $"LoadingSeasonalBuildAssetSync: staged 4 verified loading textures for {report.summary.platform}.");
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            CleanupGeneratedBuildAssets();
        }

        [MenuItem("Vamp Pon/Loading Seasonal/Stage Compressed Build Assets")]
        private static void StageFromMenu()
        {
            StageAndImport();
            Debug.Log(
                "LoadingSeasonalBuildAssetSync: staged 4 verified loading textures.");
        }

        [MenuItem("Vamp Pon/Loading Seasonal/Cleanup Generated Build Assets")]
        private static void CleanupFromMenu()
        {
            CleanupGeneratedBuildAssets();
        }

        private static void StageAndImport()
        {
            var repositoryRoot = ResolveRepositoryRoot();
            var manifestPath = Path.Combine(
                repositoryRoot,
                ManifestRelativePath.Replace('/', Path.DirectorySeparatorChar));
            var destination = ResolveDestinationDirectory();

            if (!File.Exists(manifestPath))
                throw new BuildFailedException(
                    $"Loading Seasonal manifest is missing: {manifestPath}");

            var manifest = JsonUtility.FromJson<ManifestRoot>(
                File.ReadAllText(manifestPath));
            ValidateManifest(manifest, repositoryRoot);

            CleanupGeneratedBuildAssets(refresh: false);
            Directory.CreateDirectory(destination);

            foreach (var asset in manifest.assets)
            {
                var sourcePath = Path.Combine(
                    repositoryRoot,
                    asset.sourcePath.Replace('/', Path.DirectorySeparatorChar));
                var destinationPath = Path.Combine(destination, asset.resourceFile);
                File.Copy(sourcePath, destinationPath, true);
            }

            File.WriteAllText(
                Path.Combine(destination, "README.generated.txt"),
                "Generated for Unity build from the loading-seasonal-v1 manifest.\n" +
                "The current four files are an explicit temporary fallback until the approved seasonal binaries are committed.\n" +
                "Do not edit or commit this Resources copy.\n");

            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            foreach (var asset in manifest.assets)
                ConfigureTextureImporter(asset.resourceFile);
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
        }

        private static void ValidateManifest(
            ManifestRoot manifest,
            string repositoryRoot)
        {
            if (manifest == null || manifest.assets == null)
                throw new BuildFailedException(
                    "Loading Seasonal manifest could not be parsed.");
            if (manifest.assets.Length != 4)
                throw new BuildFailedException(
                    $"Loading Seasonal manifest must contain exactly 4 assets, got {manifest.assets.Length}.");

            var ids = new HashSet<string>(StringComparer.Ordinal);
            var resources = new HashSet<string>(StringComparer.Ordinal);
            foreach (var asset in manifest.assets)
            {
                if (asset == null ||
                    string.IsNullOrWhiteSpace(asset.id) ||
                    string.IsNullOrWhiteSpace(asset.sourcePath) ||
                    string.IsNullOrWhiteSpace(asset.resourceFile) ||
                    string.IsNullOrWhiteSpace(asset.sha256))
                {
                    throw new BuildFailedException(
                        "Loading Seasonal manifest contains an invalid asset entry.");
                }

                if (!ids.Add(asset.id))
                    throw new BuildFailedException(
                        $"Loading Seasonal manifest contains a duplicate id: {asset.id}");
                if (!resources.Add(asset.resourceFile))
                    throw new BuildFailedException(
                        $"Loading Seasonal manifest contains a duplicate resource file: {asset.resourceFile}");

                var sourcePath = Path.Combine(
                    repositoryRoot,
                    asset.sourcePath.Replace('/', Path.DirectorySeparatorChar));
                if (!File.Exists(sourcePath))
                    throw new BuildFailedException(
                        $"Loading Seasonal source asset is missing: {sourcePath}");

                var dimensions = ReadPngDimensions(sourcePath);
                if (dimensions.x != asset.width || dimensions.y != asset.height)
                    throw new BuildFailedException(
                        $"Loading Seasonal dimensions mismatch for {asset.id}: expected {asset.width}x{asset.height}, actual {dimensions.x}x{dimensions.y}.");

                var actualSha = ComputeSha256(sourcePath);
                if (!string.Equals(
                    actualSha,
                    asset.sha256,
                    StringComparison.OrdinalIgnoreCase))
                {
                    throw new BuildFailedException(
                        $"Loading Seasonal SHA-256 mismatch for {asset.id}: expected {asset.sha256}, actual {actualSha}.");
                }
            }
        }

        private static void ConfigureTextureImporter(string fileName)
        {
            var assetPath = $"{DestinationRelativePath}/{fileName}";
            AssetDatabase.ImportAsset(
                assetPath,
                ImportAssetOptions.ForceSynchronousImport |
                ImportAssetOptions.ForceUpdate);

            if (AssetImporter.GetAtPath(assetPath) is not TextureImporter importer)
                throw new BuildFailedException(
                    $"Loading Seasonal texture importer is unavailable: {assetPath}");

            importer.textureType = TextureImporterType.Default;
            importer.sRGBTexture = true;
            importer.alphaSource = TextureImporterAlphaSource.FromInput;
            importer.alphaIsTransparency = false;
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

        private static void CleanupGeneratedBuildAssets(bool refresh = true)
        {
            var destination =
                DestinationRelativePath.Replace('/', Path.DirectorySeparatorChar);
            FileUtil.DeleteFileOrDirectory(destination);
            FileUtil.DeleteFileOrDirectory(destination + ".meta");

            const string resources = "Assets/Resources";
            if (Directory.Exists(resources) &&
                Directory.GetFileSystemEntries(resources).Length == 0)
            {
                FileUtil.DeleteFileOrDirectory(resources);
                FileUtil.DeleteFileOrDirectory(resources + ".meta");
            }

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
                    throw new InvalidDataException(
                        $"PNG signature is invalid: {path}");

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

        private static string ComputeSha256(string path)
        {
            using var stream = File.OpenRead(path);
            using var sha = SHA256.Create();
            var hash = sha.ComputeHash(stream);
            var builder = new StringBuilder(hash.Length * 2);
            foreach (var value in hash)
                builder.Append(value.ToString("x2"));
            return builder.ToString();
        }

        private static string ResolveDestinationDirectory()
        {
            var projectRoot = Path.GetFullPath(
                Path.Combine(Application.dataPath, ".."));
            return Path.Combine(
                projectRoot,
                DestinationRelativePath.Replace('/', Path.DirectorySeparatorChar));
        }

        private static string ResolveRepositoryRoot()
        {
            return Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
        }

        [Serializable]
        private sealed class ManifestRoot
        {
            public ManifestAsset[] assets;
        }

        [Serializable]
        private sealed class ManifestAsset
        {
            public string id;
            public string sourcePath;
            public string resourceFile;
            public int width;
            public int height;
            public string sha256;
        }
    }
}
