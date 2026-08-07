using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public sealed class TopLivingNightCompositeV3BuildAssetSync :
        IPreprocessBuildWithReport,
        IPostprocessBuildWithReport
    {
        private const string SourceRelativePath =
            "docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png";
        private const string DestinationRelativePath =
            "Assets/Resources/TopLivingNightV3Generated";
        private const string DestinationFileName = "base-composite-v3.png";
        private const string MaterialAssetPath =
            "Assets/Resources/TopLivingNightV3Generated/LuminanceAdditive.mat";
        private const string ExpectedSha256 =
            "aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d";
        private const string ShaderName = "VampPon/UI/LuminanceAdditiveMask";

        public int callbackOrder => -135;

        public void OnPreprocessBuild(BuildReport report)
        {
            StageAndImport();
            Debug.Log(
                $"TOP Runtime V3: staged composite background and additive material for {report.summary.platform}.");
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            CleanupGeneratedBuildAssets();
        }

        [MenuItem("Vamp Pon/TOP Living Night/Stage Runtime V3 Composite")]
        private static void StageFromMenu()
        {
            StageAndImport();
            Debug.Log("TOP Runtime V3: staged composite background and additive material.");
        }

        [MenuItem("Vamp Pon/TOP Living Night/Cleanup Runtime V3 Composite")]
        private static void CleanupFromMenu()
        {
            CleanupGeneratedBuildAssets();
        }

        private static void StageAndImport()
        {
            CleanupGeneratedBuildAssets(refresh: false);

            try
            {
                var sourcePath = ResolveSourcePath();
                if (!File.Exists(sourcePath))
                    throw new BuildFailedException(
                        $"TOP Runtime V3 composite source is missing: {sourcePath}");

                var dimensions = ReadPngDimensions(sourcePath);
                if (dimensions.x != 430 || dimensions.y != 932)
                    throw new BuildFailedException(
                        $"TOP Runtime V3 composite dimensions mismatch: expected 430x932, actual {dimensions.x}x{dimensions.y}.");

                var actualSha = ComputeSha256(sourcePath);
                if (!string.Equals(actualSha, ExpectedSha256, StringComparison.OrdinalIgnoreCase))
                    throw new BuildFailedException(
                        $"TOP Runtime V3 composite SHA-256 mismatch: expected {ExpectedSha256}, actual {actualSha}.");

                var destination = ResolveDestinationDirectory();
                Directory.CreateDirectory(destination);
                File.Copy(
                    sourcePath,
                    Path.Combine(destination, DestinationFileName),
                    true);

                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
                ConfigureTextureImporter();
                CreateAdditiveMaterial();
                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            }
            catch
            {
                CleanupGeneratedBuildAssets();
                throw;
            }
        }

        private static void ConfigureTextureImporter()
        {
            var assetPath = $"{DestinationRelativePath}/{DestinationFileName}";
            AssetDatabase.ImportAsset(
                assetPath,
                ImportAssetOptions.ForceSynchronousImport | ImportAssetOptions.ForceUpdate);

            if (AssetImporter.GetAtPath(assetPath) is not TextureImporter importer)
                throw new BuildFailedException(
                    $"TOP Runtime V3 texture importer is unavailable: {assetPath}");

            importer.textureType = TextureImporterType.Default;
            importer.sRGBTexture = true;
            importer.alphaSource = TextureImporterAlphaSource.None;
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

        private static void CreateAdditiveMaterial()
        {
            var shader = Shader.Find(ShaderName);
            if (shader == null)
                throw new BuildFailedException(
                    $"TOP Runtime V3 additive shader is unavailable: {ShaderName}");

            if (AssetDatabase.LoadAssetAtPath<Material>(MaterialAssetPath) != null)
                AssetDatabase.DeleteAsset(MaterialAssetPath);

            var material = new Material(shader)
            {
                name = "LuminanceAdditive",
            };
            AssetDatabase.CreateAsset(material, MaterialAssetPath);
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

        private static string ResolveSourcePath()
        {
            return Path.Combine(
                ResolveRepositoryRoot(),
                SourceRelativePath.Replace('/', Path.DirectorySeparatorChar));
        }

        private static string ResolveDestinationDirectory()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
            return Path.Combine(
                projectRoot,
                DestinationRelativePath.Replace('/', Path.DirectorySeparatorChar));
        }

        private static string ResolveRepositoryRoot()
        {
            return Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
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
    }
}
