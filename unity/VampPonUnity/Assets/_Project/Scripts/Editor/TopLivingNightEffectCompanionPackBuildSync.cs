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
    // Build-only staging for final Core5 motion/effect companions. V2 effects
    // remain the bridge source. Once a final Core5 candidate is selected, player
    // builds fail closed until the exact candidate-bound effect pack is registered.
    public sealed class TopLivingNightEffectCompanionPackBuildSync :
        IPreprocessBuildWithReport,
        IPostprocessBuildWithReport
    {
        private const string SourceRootRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/effects";
        private const string ManifestRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/effect-companion-pack.json";
        private const string Core5ReferenceManifestRelativePath =
            "docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json";
        internal const string DestinationRoot =
            "Assets/Resources/TopLivingNightV3EffectsGenerated";
        internal const string ReadyMarkerPath = DestinationRoot + "/pack-ready.txt";

        private static readonly EffectSpec[] Effects =
        {
            new("01-stars.png", 430, 932),
            new("02-clouds-far.png", 430, 932),
            new("03-clouds-near.png", 430, 932),
            new("05-distant-lights-mask.png", 430, 932),
            new("08-robot-eye-mask.png", 430, 932),
            new("10-fire-flipbook-atlas.png", 1448, 1086),
            new("11-fire-glow-mask.png", 430, 932),
            new("12-smoke-atlas.png", 1536, 1024),
            new("13-embers-atlas.png", 256, 128),
            new("14-lantern-glow-mask.png", 430, 932),
        };

        public int callbackOrder => -132;

        public void OnPreprocessBuild(BuildReport report)
        {
            Cleanup(refresh: false);

            var selection = TopLivingNightCompositeV3BuildAssetSync.ResolveCompositeSource();
            if (!selection.IsFinal)
                return;

            try
            {
                StageFinalEffectPack(selection);
                Debug.Log(
                    $"TOP effect companion pack: staged {Effects.Length} final Core5 effect textures for {report.summary.platform}.");
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

        internal static bool FinalEffectPackRequired()
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
                StageFinalEffectPack(selection);
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
            var result = new string[Effects.Length];
            for (var index = 0; index < Effects.Length; index++)
                result[index] = $"{DestinationRoot}/{Effects[index].FileName}";
            return result;
        }

        private static void StageFinalEffectPack(
            TopLivingNightCompositeV3BuildAssetSync.CompositeSourceSelection selection)
        {
            var repositoryRoot = RepositoryRoot();
            var sourceRoot = Path.Combine(
                repositoryRoot,
                SourceRootRelativePath.Replace('/', Path.DirectorySeparatorChar));
            if (!Directory.Exists(sourceRoot))
                throw new BuildFailedException(
                    $"TOP final effect companion directory is missing: {sourceRoot}. " +
                    "Final runtime may not silently reuse the V2 effect family.");

            var manifest = LoadAndValidateManifest(repositoryRoot, selection, sourceRoot);
            Directory.CreateDirectory(DestinationRoot);
            var imported = new List<string>();

            foreach (var spec in Effects)
            {
                var source = Path.Combine(sourceRoot, spec.FileName);
                if (!File.Exists(source))
                    throw new BuildFailedException(
                        $"TOP final effect companion is missing: {source}");

                var dimensions = ReadPngDimensions(source);
                if (dimensions.x != spec.Width || dimensions.y != spec.Height)
                    throw new BuildFailedException(
                        $"TOP effect companion dimensions mismatch for {spec.FileName}: " +
                        $"expected {spec.Width}x{spec.Height}, actual {dimensions.x}x{dimensions.y}.");

                var record = FindManifestEffect(manifest, spec.FileName);
                if (record == null || !record.alphaRequired)
                    throw new BuildFailedException(
                        $"TOP effect companion manifest alpha contract mismatch: {spec.FileName}");

                var actualSha = ComputeSha256(source);
                if (!string.Equals(actualSha, record.sha256, StringComparison.Ordinal))
                    throw new BuildFailedException(
                        $"TOP effect companion SHA-256 mismatch for {spec.FileName}: " +
                        $"expected {record.sha256}, actual {actualSha}.");

                var destinationAssetPath = $"{DestinationRoot}/{spec.FileName}";
                File.Copy(source, destinationAssetPath, true);
                imported.Add(destinationAssetPath);
            }

            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            foreach (var assetPath in imported)
                ConfigureTextureImporter(assetPath);

            File.WriteAllText(ReadyMarkerPath, "final-core5-effects\n");
            AssetDatabase.ImportAsset(
                ReadyMarkerPath,
                ImportAssetOptions.ForceSynchronousImport | ImportAssetOptions.ForceUpdate);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
        }

        private static EffectPackManifest LoadAndValidateManifest(
            string repositoryRoot,
            TopLivingNightCompositeV3BuildAssetSync.CompositeSourceSelection selection,
            string sourceRoot)
        {
            var manifestPath = Path.Combine(
                repositoryRoot,
                ManifestRelativePath.Replace('/', Path.DirectorySeparatorChar));
            if (!File.Exists(manifestPath))
                throw new BuildFailedException(
                    $"TOP final effect companion manifest is missing: {manifestPath}");

            EffectPackManifest manifest;
            try
            {
                manifest = JsonUtility.FromJson<EffectPackManifest>(File.ReadAllText(manifestPath));
            }
            catch (Exception exception)
            {
                throw new BuildFailedException(
                    $"TOP final effect companion manifest could not be parsed: {exception.Message}");
            }

            if (manifest == null || manifest.schemaVersion != 1)
                throw new BuildFailedException("TOP final effect companion manifest schema must be 1.");
            if (manifest.effectCount != Effects.Length || manifest.effects == null || manifest.effects.Length != Effects.Length)
                throw new BuildFailedException(
                    $"TOP final effect companion manifest must contain exactly {Effects.Length} effects.");
            if (!IsLowerHexSha256(manifest.candidateSha256) ||
                !string.Equals(manifest.candidateSha256, selection.ExpectedSha256, StringComparison.Ordinal))
                throw new BuildFailedException(
                    "TOP final effect companion pack is not bound to the exact selected final candidate SHA-256.");
            if (!IsLowerHexSha256(manifest.core5ReferenceSetSha256))
                throw new BuildFailedException(
                    "TOP final effect companion Core5 reference-set SHA-256 is invalid.");

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
                    "TOP final effect companion pack was registered against a stale Core5 reference set.");

            var fingerprint = new StringBuilder();
            fingerprint.Append("candidate=").Append(manifest.candidateSha256).Append('\n');
            fingerprint.Append("core5=").Append(manifest.core5ReferenceSetSha256);
            foreach (var spec in Effects)
            {
                var record = FindManifestEffect(manifest, spec.FileName);
                if (record == null || !IsLowerHexSha256(record.sha256))
                    throw new BuildFailedException(
                        $"TOP effect companion manifest SHA is invalid: {spec.FileName}");
                var sourcePath = Path.Combine(sourceRoot, spec.FileName);
                if (!File.Exists(sourcePath))
                    throw new BuildFailedException(
                        $"TOP effect companion source is missing: {sourcePath}");
                var actualSha = ComputeSha256(sourcePath);
                if (!string.Equals(actualSha, record.sha256, StringComparison.Ordinal))
                    throw new BuildFailedException(
                        $"TOP effect companion source changed after registration: {spec.FileName}");
                fingerprint.Append('\n').Append(spec.FileName).Append(':').Append(record.sha256);
            }

            var computedPackSha = ComputeSha256(Encoding.UTF8.GetBytes(fingerprint.ToString()));
            if (!IsLowerHexSha256(manifest.packSha256) ||
                !string.Equals(manifest.packSha256, computedPackSha, StringComparison.Ordinal))
                throw new BuildFailedException(
                    "TOP effect companion pack fingerprint does not match candidate/reference/effect bytes.");

            if (manifest.runtimePolicy == null ||
                manifest.runtimePolicy.representation != "candidate-bound-effect-companion-pack" ||
                manifest.runtimePolicy.legacyV2FallbackAllowedForFinal)
                throw new BuildFailedException(
                    "TOP final effect companion runtime policy must forbid V2 effect fallback.");

            return manifest;
        }

        private static EffectPackEffect FindManifestEffect(
            EffectPackManifest manifest,
            string fileName)
        {
            if (manifest?.effects == null)
                return null;
            foreach (var effect in manifest.effects)
                if (effect != null && string.Equals(effect.file, fileName, StringComparison.Ordinal))
                    return effect;
            return null;
        }

        private static void ConfigureTextureImporter(string assetPath)
        {
            AssetDatabase.ImportAsset(
                assetPath,
                ImportAssetOptions.ForceSynchronousImport | ImportAssetOptions.ForceUpdate);

            if (AssetImporter.GetAtPath(assetPath) is not TextureImporter importer)
                throw new BuildFailedException(
                    $"TOP effect companion texture importer unavailable: {assetPath}");

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
            return BytesToHex(sha.ComputeHash(stream));
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

        private readonly struct EffectSpec
        {
            public EffectSpec(string fileName, int width, int height)
            {
                FileName = fileName;
                Width = width;
                Height = height;
            }

            public string FileName { get; }
            public int Width { get; }
            public int Height { get; }
        }

        [Serializable]
        private sealed class EffectPackManifest
        {
            public int schemaVersion;
            public string candidateSha256;
            public string core5ReferenceSetSha256;
            public int effectCount;
            public string packSha256;
            public EffectPackEffect[] effects;
            public RuntimePolicy runtimePolicy;
        }

        [Serializable]
        private sealed class EffectPackEffect
        {
            public string file;
            public bool alphaRequired;
            public string sha256;
        }

        [Serializable]
        private sealed class RuntimePolicy
        {
            public string representation;
            public bool legacyV2FallbackAllowedForFinal;
        }

        [Serializable]
        private sealed class Core5ReferenceManifest
        {
            public int schemaVersion;
            public string referenceSetSha256;
        }
    }
}
