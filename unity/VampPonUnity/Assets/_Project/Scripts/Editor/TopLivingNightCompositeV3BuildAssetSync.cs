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
        private const string BridgeSourceRelativePath =
            "docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png";
        private const string BridgeExpectedSha256 =
            "aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d";
        private const string FinalStatusRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final-art-status.json";
        private const string FinalSourceRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png";
        private const string DestinationRelativePath =
            "Assets/Resources/TopLivingNightV3Generated";
        private const string DestinationFileName = "base-composite-v3.png";
        private const string MaterialAssetPath =
            "Assets/Resources/TopLivingNightV3Generated/LuminanceAdditive.mat";
        private const string ShaderName = "VampPon/UI/LuminanceAdditiveMask";

        public int callbackOrder => -135;

        public void OnPreprocessBuild(BuildReport report)
        {
            var selection = StageAndImport();
            Debug.Log(
                $"TOP Runtime V3: staged {selection.Kind} composite and additive material for {report.summary.platform}.");
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            CleanupGeneratedBuildAssets();
        }

        [MenuItem("Vamp Pon/TOP Living Night/Stage Runtime V3 Composite")]
        private static void StageFromMenu()
        {
            var selection = StageAndImport();
            Debug.Log(
                $"TOP Runtime V3: staged {selection.Kind} composite and additive material.");
        }

        [MenuItem("Vamp Pon/TOP Living Night/Cleanup Runtime V3 Composite")]
        private static void CleanupFromMenu()
        {
            CleanupGeneratedBuildAssets();
        }

        private static CompositeSourceSelection StageAndImport()
        {
            CleanupGeneratedBuildAssets(refresh: false);

            try
            {
                var selection = ResolveCompositeSource();
                var sourcePath = ResolveSourcePath(selection.RelativePath);
                if (!File.Exists(sourcePath))
                    throw new BuildFailedException(
                        $"TOP Runtime V3 composite source is missing: {sourcePath}");

                var dimensions = ReadPngDimensions(sourcePath);
                if (dimensions.x != 430 || dimensions.y != 932)
                    throw new BuildFailedException(
                        $"TOP Runtime V3 composite dimensions mismatch: expected 430x932, actual {dimensions.x}x{dimensions.y}.");

                var actualSha = ComputeSha256(sourcePath);
                if (!string.Equals(
                        actualSha,
                        selection.ExpectedSha256,
                        StringComparison.OrdinalIgnoreCase))
                    throw new BuildFailedException(
                        $"TOP Runtime V3 {selection.Kind} composite SHA-256 mismatch: expected {selection.ExpectedSha256}, actual {actualSha}.");

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
                return selection;
            }
            catch
            {
                CleanupGeneratedBuildAssets();
                throw;
            }
        }

        internal static CompositeSourceSelection ResolveCompositeSource()
        {
            var repositoryRoot = ResolveRepositoryRoot();
            var statusPath = Path.Combine(
                repositoryRoot,
                FinalStatusRelativePath.Replace('/', Path.DirectorySeparatorChar));
            if (!File.Exists(statusPath))
                throw new BuildFailedException(
                    $"TOP Runtime V3 final-art status is missing: {statusPath}");

            FinalArtStatus status;
            try
            {
                status = JsonUtility.FromJson<FinalArtStatus>(File.ReadAllText(statusPath));
            }
            catch (Exception exception)
            {
                throw new BuildFailedException(
                    $"TOP Runtime V3 final-art status could not be parsed: {exception.Message}");
            }

            if (status == null)
                throw new BuildFailedException(
                    "TOP Runtime V3 final-art status parsed as null.");

            var finalSourcePath = Path.Combine(
                repositoryRoot,
                FinalSourceRelativePath.Replace('/', Path.DirectorySeparatorChar));

            if (!status.candidateGenerated)
            {
                if (File.Exists(finalSourcePath))
                    throw new BuildFailedException(
                        "TOP Runtime V3 final Core5 PNG exists while candidateGenerated=false. " +
                        "Update the final-art manifest explicitly instead of silently building the bridge.");
                if (!string.IsNullOrEmpty(status.candidateSha256))
                    throw new BuildFailedException(
                        "TOP Runtime V3 ungenerated final candidate must not retain candidateSha256.");

                return new CompositeSourceSelection(
                    "bridge",
                    BridgeSourceRelativePath,
                    BridgeExpectedSha256,
                    false);
            }

            if (!string.Equals(
                    status.candidatePath,
                    FinalSourceRelativePath,
                    StringComparison.Ordinal))
                throw new BuildFailedException(
                    $"TOP Runtime V3 final candidate path is not canonical: {status.candidatePath}");
            if (!IsLowerHexSha256(status.candidateSha256))
                throw new BuildFailedException(
                    "TOP Runtime V3 generated final candidate requires a lowercase 64-character SHA-256.");
            if (!File.Exists(finalSourcePath))
                throw new BuildFailedException(
                    $"TOP Runtime V3 candidateGenerated=true but final Core5 PNG is missing: {finalSourcePath}");

            var actualFinalSha = ComputeSha256(finalSourcePath);
            if (!string.Equals(
                    actualFinalSha,
                    status.candidateSha256,
                    StringComparison.Ordinal))
                throw new BuildFailedException(
                    $"TOP Runtime V3 final-art manifest SHA-256 mismatch: expected {status.candidateSha256}, actual {actualFinalSha}.");

            return new CompositeSourceSelection(
                "final-core5",
                FinalSourceRelativePath,
                status.candidateSha256,
                true);
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

        private static string ResolveSourcePath(string relativePath)
        {
            return Path.Combine(
                ResolveRepositoryRoot(),
                relativePath.Replace('/', Path.DirectorySeparatorChar));
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

        private static bool IsLowerHexSha256(string value)
        {
            if (string.IsNullOrEmpty(value) || value.Length != 64)
                return false;

            foreach (var character in value)
                if (!((character >= '0' && character <= '9') ||
                      (character >= 'a' && character <= 'f')))
                    return false;

            return true;
        }

        [Serializable]
        private sealed class FinalArtStatus
        {
            public bool candidateGenerated;
            public string candidatePath;
            public string candidateSha256;
        }

        internal sealed class CompositeSourceSelection
        {
            internal CompositeSourceSelection(
                string kind,
                string relativePath,
                string expectedSha256,
                bool isFinal)
            {
                Kind = kind;
                RelativePath = relativePath;
                ExpectedSha256 = expectedSha256;
                IsFinal = isFinal;
            }

            internal string Kind { get; }
            internal string RelativePath { get; }
            internal string ExpectedSha256 { get; }
            internal bool IsFinal { get; }
        }
    }
}
