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
    // The legacy filename is retained to preserve the existing Unity .meta GUID.
    public sealed class TopLivingNightBuildAssetSync :
        IPreprocessBuildWithReport,
        IPostprocessBuildWithReport
    {
        private const string SourceRelativePath =
            "docs/design-targets/generated/top-living-night-v2/layers";
        private const string ManifestRelativePath =
            "docs/design-targets/generated/top-living-night-v2/manifest.json";
        private const string DestinationRelativePath =
            "Assets/Resources/TopLivingNight";

        private static readonly string[] RequiredFiles =
        {
            "00-environment-starless.png",
            "01-stars.png",
            "01-moon.png",
            "02-clouds-far.png",
            "03-clouds-near.png",
            "04-distant-lights-mask.png",
            "05-distant-companion.png",
            "06-characters.png",
            "08-animal-robot.png",
            "08-robot-eye-mask.png",
            "09-fire-base.png",
            "10-fire-flipbook-atlas.png",
            "11-fire-glow-mask.png",
            "12-smoke-atlas.png",
            "13-embers-atlas.png",
            "14-foreground-accents.png",
            "14-lantern-glow-mask.png",
        };

        public int callbackOrder => -140;

        public void OnPreprocessBuild(BuildReport report)
        {
            StageAndImport();
            Debug.Log(
                $"TopLivingNightBuildAssetSync: staged and imported {RequiredFiles.Length} verified textures for {report.summary.platform}.");
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            CleanupGeneratedBuildAssets();
        }

        [MenuItem("Vamp Pon/TOP Living Night/Stage Compressed Build Assets")]
        private static void StageFromMenu()
        {
            StageAndImport();
            Debug.Log(
                $"TopLivingNightBuildAssetSync: staged and imported {RequiredFiles.Length} verified textures.");
        }

        [MenuItem("Vamp Pon/TOP Living Night/Cleanup Generated Build Assets")]
        private static void CleanupFromMenu()
        {
            CleanupGeneratedBuildAssets();
        }

        private static void StageAndImport()
        {
            CleanupGeneratedBuildAssets(refresh: false);

            try
            {
                var source = ResolveSourceDirectory();
                var manifestPath = ResolveManifestPath();
                var destination = ResolveDestinationDirectory();

                if (!Directory.Exists(source))
                    throw new BuildFailedException(
                        $"TOP Living Night source directory is missing: {source}");
                if (!File.Exists(manifestPath))
                    throw new BuildFailedException(
                        $"TOP Living Night manifest is missing: {manifestPath}");

                var manifest = JsonUtility.FromJson<ManifestRoot>(File.ReadAllText(manifestPath));
                ValidateManifest(manifest, source);

                Directory.CreateDirectory(destination);

                foreach (var fileName in RequiredFiles)
                {
                    var sourcePath = Path.Combine(source, fileName);
                    var destinationPath = Path.Combine(destination, fileName);
                    File.Copy(sourcePath, destinationPath, true);
                }

                File.WriteAllText(
                    Path.Combine(destination, "README.generated.txt"),
                    "Generated for Unity build from docs/design-targets/generated/top-living-night-v2/layers.\n" +
                    "Source bytes and SHA-256 were validated against manifest.json.\n" +
                    "Do not edit or commit this Resources copy.\n");

                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
                foreach (var fileName in RequiredFiles)
                    ConfigureTextureImporter(fileName);
                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            }
            catch
            {
                CleanupGeneratedBuildAssets();
                throw;
            }
        }

        private static void ValidateManifest(ManifestRoot manifest, string source)
        {
            if (manifest == null || manifest.assets == null)
                throw new BuildFailedException("TOP Living Night manifest could not be parsed.");
            if (manifest.assets.Length != RequiredFiles.Length)
                throw new BuildFailedException(
                    $"TOP Living Night manifest asset count mismatch: {manifest.assets.Length}.");

            var byFileName = new Dictionary<string, ManifestAsset>(StringComparer.Ordinal);
            foreach (var asset in manifest.assets)
            {
                if (asset == null || string.IsNullOrWhiteSpace(asset.file))
                    throw new BuildFailedException("TOP Living Night manifest contains an invalid asset entry.");
                var fileName = Path.GetFileName(asset.file);
                if (!byFileName.TryAdd(fileName, asset))
                    throw new BuildFailedException(
                        $"TOP Living Night manifest contains a duplicate asset: {fileName}");
            }

            foreach (var fileName in RequiredFiles)
            {
                if (!byFileName.TryGetValue(fileName, out var asset))
                    throw new BuildFailedException(
                        $"TOP Living Night manifest is missing: {fileName}");

                var sourcePath = Path.Combine(source, fileName);
                if (!File.Exists(sourcePath))
                    throw new BuildFailedException(
                        $"TOP Living Night source asset is missing: {sourcePath}");

                var fileInfo = new FileInfo(sourcePath);
                if (fileInfo.Length != asset.bytes)
                    throw new BuildFailedException(
                        $"TOP Living Night byte-size mismatch for {fileName}: expected {asset.bytes}, actual {fileInfo.Length}.");

                var actualSha = ComputeSha256(sourcePath);
                if (!string.Equals(actualSha, asset.sha256, StringComparison.OrdinalIgnoreCase))
                    throw new BuildFailedException(
                        $"TOP Living Night SHA-256 mismatch for {fileName}: expected {asset.sha256}, actual {actualSha}.");
            }
        }

        private static void ConfigureTextureImporter(string fileName)
        {
            var assetPath = $"{DestinationRelativePath}/{fileName}";
            AssetDatabase.ImportAsset(
                assetPath,
                ImportAssetOptions.ForceSynchronousImport | ImportAssetOptions.ForceUpdate);

            if (AssetImporter.GetAtPath(assetPath) is not TextureImporter importer)
                throw new BuildFailedException(
                    $"TOP Living Night texture importer is unavailable: {assetPath}");

            importer.textureType = TextureImporterType.Default;
            importer.sRGBTexture = true;
            importer.alphaSource = TextureImporterAlphaSource.FromInput;
            importer.alphaIsTransparency = true;
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
            var destination = DestinationRelativePath.Replace('/', Path.DirectorySeparatorChar);
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

        private static string ResolveSourceDirectory()
        {
            return Path.Combine(
                ResolveRepositoryRoot(),
                SourceRelativePath.Replace('/', Path.DirectorySeparatorChar));
        }

        private static string ResolveManifestPath()
        {
            return Path.Combine(
                ResolveRepositoryRoot(),
                ManifestRelativePath.Replace('/', Path.DirectorySeparatorChar));
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

        [Serializable]
        private sealed class ManifestRoot
        {
            public ManifestAsset[] assets;
        }

        [Serializable]
        private sealed class ManifestAsset
        {
            public string file;
            public long bytes;
            public string sha256;
        }
    }
}
