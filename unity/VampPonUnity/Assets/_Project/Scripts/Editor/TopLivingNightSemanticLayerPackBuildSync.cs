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
    // Build-only staging for the final semantic layer pack. Bridge builds keep
    // using the already-registered V2 layers. Once final Core5 is registered,
    // player builds fail closed until the six registered 430x932 production
    // layers exist and their manifest is bound to the exact final candidate.
    public sealed class TopLivingNightSemanticLayerPackBuildSync :
        IPreprocessBuildWithReport,
        IPostprocessBuildWithReport
    {
        private const string SourceRootRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/layers";
        private const string ManifestRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/semantic-layer-pack.json";
        private const string Core5ReferenceManifestRelativePath =
            "docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json";
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
                StageFinalSemanticPack(selection);
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
            var selection = TopLivingNightCompositeV3BuildAssetSync.ResolveCompositeSource();
            if (!selection.IsFinal)
                return;

            try
            {
                StageFinalSemanticPack(selection);
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

        private static void StageFinalSemanticPack(
            TopLivingNightCompositeV3BuildAssetSync.CompositeSourceSelection selection)
        {
            var repositoryRoot = RepositoryRoot();
            var sourceRoot = Path.Combine(
                repositoryRoot,
                SourceRootRelativePath.Replace('/', Path.DirectorySeparatorChar));
            if (!Directory.Exists(sourceRoot))
                throw new BuildFailedException(
                    $"TOP final Core5 semantic layer directory is missing: {sourceRoot}. " +
                    "Final runtime may not silently fall back to a flattened composite.");

            var manifest = LoadAndValidateManifest(repositoryRoot, selection, sourceRoot);
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

                var record = FindManifestLayer(manifest, spec.SourceFileName);
                if (record == null)
                    throw new BuildFailedException(
                        $"TOP semantic layer manifest is missing record: {spec.SourceFileName}");
                if (record.alphaRequired != spec.AlphaRequired)
                    throw new BuildFailedException(
                        $"TOP semantic layer alpha contract mismatch: {spec.SourceFileName}");

                var actualSha = ComputeSha256(source);
                if (!string.Equals(actualSha, record.sha256, StringComparison.Ordinal))
                    throw new BuildFailedException(
                        $"TOP semantic layer SHA-256 mismatch for {spec.SourceFileName}: " +
                        $"expected {record.sha256}, actual {actualSha}.");

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

        private static SemanticPackManifest LoadAndValidateManifest(
            string repositoryRoot,
            TopLivingNightCompositeV3BuildAssetSync.CompositeSourceSelection selection,
            string sourceRoot)
        {
            var manifestPath = Path.Combine(
                repositoryRoot,
                ManifestRelativePath.Replace('/', Path.DirectorySeparatorChar));
            if (!File.Exists(manifestPath))
                throw new BuildFailedException(
                    $"TOP final semantic layer manifest is missing: {manifestPath}");

            SemanticPackManifest manifest;
            try
            {
                manifest = JsonUtility.FromJson<SemanticPackManifest>(File.ReadAllText(manifestPath));
            }
            catch (Exception exception)
            {
                throw new BuildFailedException(
                    $"TOP final semantic layer manifest could not be parsed: {exception.Message}");
            }

            if (manifest == null || manifest.schemaVersion != 1)
                throw new BuildFailedException("TOP final semantic layer manifest schema must be 1.");
            if (manifest.layerCount != Layers.Length || manifest.layers == null || manifest.layers.Length != Layers.Length)
                throw new BuildFailedException(
                    $"TOP final semantic layer manifest must contain exactly {Layers.Length} layers.");
            if (!IsLowerHexSha256(manifest.candidateSha256) ||
                !string.Equals(manifest.candidateSha256, selection.ExpectedSha256, StringComparison.Ordinal))
                throw new BuildFailedException(
                    "TOP final semantic layer manifest is not bound to the exact selected final candidate SHA-256.");
            if (!IsLowerHexSha256(manifest.core5ReferenceSetSha256))
                throw new BuildFailedException(
                    "TOP final semantic layer manifest Core5 reference-set SHA-256 is invalid.");

            var referenceManifestPath = Path.Combine(
                repositoryRoot,
                Core5ReferenceManifestRelativePath.Replace('/', Path.DirectorySeparatorChar));
            if (!File.Exists(referenceManifestPath))
                throw new BuildFailedException(
                    $"TOP Core5 reference manifest is missing: {referenceManifestPath}");
            var referenceManifest = JsonUtility.FromJson<Core5ReferenceManifest>(
                File.ReadAllText(referenceManifestPath));
            if (referenceManifest == null || referenceManifest.schemaVersion != 1 ||
                !string.Equals(
                    referenceManifest.referenceSetSha256,
                    manifest.core5ReferenceSetSha256,
                    StringComparison.Ordinal))
                throw new BuildFailedException(
                    "TOP final semantic layer pack was registered against a stale Core5 reference set.");

            var fingerprint = new StringBuilder();
            fingerprint.Append("candidate=").Append(manifest.candidateSha256).Append('\n');
            fingerprint.Append("core5=").Append(manifest.core5ReferenceSetSha256);
            foreach (var spec in Layers)
            {
                var record = FindManifestLayer(manifest, spec.SourceFileName);
                if (record == null || !IsLowerHexSha256(record.sha256))
                    throw new BuildFailedException(
                        $"TOP semantic layer manifest SHA is invalid: {spec.SourceFileName}");
                var sourcePath = Path.Combine(sourceRoot, spec.SourceFileName);
                if (!File.Exists(sourcePath))
                    throw new BuildFailedException(
                        $"TOP semantic layer source is missing: {sourcePath}");
                var actualSha = ComputeSha256(sourcePath);
                if (!string.Equals(actualSha, record.sha256, StringComparison.Ordinal))
                    throw new BuildFailedException(
                        $"TOP semantic layer source changed after registration: {spec.SourceFileName}");
                fingerprint.Append('\n').Append(spec.SourceFileName).Append(':').Append(record.sha256);
            }

            var computedPackSha = ComputeSha256(Encoding.UTF8.GetBytes(fingerprint.ToString()));
            if (!IsLowerHexSha256(manifest.packSha256) ||
                !string.Equals(manifest.packSha256, computedPackSha, StringComparison.Ordinal))
                throw new BuildFailedException(
                    "TOP semantic layer pack fingerprint does not match candidate/reference/layer bytes.");

            if (manifest.runtimePolicy == null ||
                manifest.runtimePolicy.representation != "semantic-2.5d-layer-pack" ||
                manifest.runtimePolicy.flattenedFinalFallbackAllowed)
                throw new BuildFailedException(
                    "TOP semantic layer manifest runtime policy must forbid flattened final fallback.");

            return manifest;
        }

        private static SemanticPackLayer FindManifestLayer(
            SemanticPackManifest manifest,
            string fileName)
        {
            if (manifest?.layers == null)
                return null;
            foreach (var layer in manifest.layers)
                if (layer != null && string.Equals(layer.file, fileName, StringComparison.Ordinal))
                    return layer;
            return null;
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
            importer.npotScale = TextureImporterNPOTScale.None;
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

        private static string ComputeSha256(string path)
        {
            using var stream = File.OpenRead(path);
            using var sha = SHA256.Create();
            var hash = sha.ComputeHash(stream);
            return BytesToHex(hash);
        }

        private static string ComputeSha256(byte[] bytes)
        {
            using var sha = SHA256.Create();
            return BytesToHex(sha.ComputeHash(bytes));
        }

        private static string BytesToHex(byte[] hash)
        {
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

        [Serializable]
        private sealed class SemanticPackManifest
        {
            public int schemaVersion;
            public string candidateSha256;
            public string core5ReferenceSetSha256;
            public int layerCount;
            public string packSha256;
            public SemanticPackLayer[] layers;
            public RuntimePolicy runtimePolicy;
        }

        [Serializable]
        private sealed class SemanticPackLayer
        {
            public string file;
            public bool alphaRequired;
            public string sha256;
        }

        [Serializable]
        private sealed class RuntimePolicy
        {
            public string representation;
            public bool flattenedFinalFallbackAllowed;
        }

        [Serializable]
        private sealed class Core5ReferenceManifest
        {
            public int schemaVersion;
            public string referenceSetSha256;
        }
    }
}
