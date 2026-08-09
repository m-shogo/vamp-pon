using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;
using VampPon.UnitySpike.UI.Screens;

namespace VampPon.UnitySpike.Editor
{
    public static class TopLivingNightUnityVerification
    {
        private const string ManifestRelativePath =
            "docs/design-targets/generated/top-living-night-v2/manifest.json";
        private const string EvidenceRelativePath =
            "docs/design-targets/generated/top-living-night-v2/runtime-unity-verification.json";
        private static int assertions;
        private static int resourceTextureCount;
        private static bool buildImportPolicyPassed;

        [MenuItem("Vamp Pon/TOP Living Night/Verify Unity Compile Contract")]
        public static void RunBatchmode()
        {
            assertions = 0;
            resourceTextureCount = 0;
            buildImportPolicyPassed = false;
            try
            {
                VerifyCompileSurface();
                VerifyCommittedSources();
                VerifyBuildImportPolicy();
                WriteEvidence("PASSED", null);
                UnityEngine.Debug.Log(
                    $"TOP Living Night Unity verification passed: {assertions} assertions.");
            }
            catch (Exception exception)
            {
                WriteEvidence("FAILED", exception.ToString());
                throw;
            }
        }

        private static void VerifyCompileSurface()
        {
            Require(
                typeof(MonoBehaviour).IsAssignableFrom(typeof(TopLivingNightView)),
                "TopLivingNightView resolves as MonoBehaviour");

            var build = typeof(TopLivingNightView).GetMethod(
                "Build",
                BindingFlags.Instance | BindingFlags.Public);
            Require(build != null, "public Build method resolves");
            Require(build.GetParameters().Length == 4, "Build keeps four-argument shell contract");

            Require(
                typeof(IPreprocessBuildWithReport).IsAssignableFrom(
                    typeof(TopLivingNightBuildAssetSync)),
                "pre-build hook resolves");
            Require(
                typeof(IPostprocessBuildWithReport).IsAssignableFrom(
                    typeof(TopLivingNightBuildAssetSync)),
                "post-build cleanup hook resolves");

            Require(
                typeof(TopLivingNightView).GetMethod(
                    "LoadTexture",
                    BindingFlags.Instance | BindingFlags.NonPublic) != null,
                "texture loader resolves");
            Require(
                typeof(TopLivingNightView).GetMethod(
                    "ReleaseTextures",
                    BindingFlags.Instance | BindingFlags.NonPublic) != null,
                "texture release resolves");
        }

        private static void VerifyCommittedSources()
        {
            var repositoryRoot = ResolveRepositoryRoot();
            var manifestPath = Path.Combine(
                repositoryRoot,
                ManifestRelativePath.Replace('/', Path.DirectorySeparatorChar));
            Require(File.Exists(manifestPath), "manifest exists");

            var manifest = JsonUtility.FromJson<ManifestRoot>(
                File.ReadAllText(manifestPath));
            Require(manifest != null && manifest.assets != null, "manifest parses");
            Require(manifest.assets.Length == 17, "manifest contains 17 assets");

            var seen = new HashSet<string>(StringComparer.Ordinal);
            foreach (var asset in manifest.assets)
            {
                Require(asset != null && !string.IsNullOrWhiteSpace(asset.file), "asset entry is valid");
                Require(seen.Add(asset.file), "asset path is unique");

                var path = Path.Combine(
                    Path.GetDirectoryName(manifestPath),
                    asset.file.Replace('/', Path.DirectorySeparatorChar));
                Require(File.Exists(path), $"asset exists: {asset.file}");
                Require(new FileInfo(path).Length == asset.bytes, $"asset bytes match: {asset.file}");
                Require(
                    string.Equals(
                        ComputeSha256(path),
                        asset.sha256,
                        StringComparison.OrdinalIgnoreCase),
                    $"asset SHA-256 matches: {asset.file}");

                var dimensions = ReadPngDimensions(path);
                Require(dimensions.x == asset.width, $"asset width matches: {asset.file}");
                Require(dimensions.y == asset.height, $"asset height matches: {asset.file}");
            }
        }

        private static void VerifyBuildImportPolicy()
        {
            var syncType = typeof(TopLivingNightBuildAssetSync);
            var stage = syncType.GetMethod(
                "StageAndImport",
                BindingFlags.Static | BindingFlags.NonPublic);
            var cleanup = syncType.GetMethod(
                "CleanupGeneratedBuildAssets",
                BindingFlags.Static | BindingFlags.NonPublic);
            Require(stage != null, "build staging method resolves");
            Require(cleanup != null, "build cleanup method resolves");

            try
            {
                stage.Invoke(null, null);

                var guids = AssetDatabase.FindAssets(
                    "t:Texture2D",
                    new[] { "Assets/Resources/TopLivingNight" });
                Require(guids.Length == 17, "17 imported Resources textures resolve");

                foreach (var guid in guids)
                {
                    var assetPath = AssetDatabase.GUIDToAssetPath(guid);
                    Require(
                        AssetImporter.GetAtPath(assetPath) is TextureImporter,
                        $"TextureImporter resolves: {assetPath}");
                    var importer = (TextureImporter)AssetImporter.GetAtPath(assetPath);
                    Require(!importer.isReadable, $"Read/Write OFF: {assetPath}");
                    Require(!importer.mipmapEnabled, $"mipmap OFF: {assetPath}");
                    Require(importer.wrapMode == TextureWrapMode.Clamp, $"Clamp: {assetPath}");
                    Require(importer.filterMode == FilterMode.Bilinear, $"Bilinear: {assetPath}");

                    var ios = importer.GetPlatformTextureSettings("iPhone");
                    Require(ios.overridden, $"iOS override enabled: {assetPath}");
                    Require(
                        ios.format == TextureImporterFormat.ASTC_6x6,
                        $"iOS ASTC 6x6: {assetPath}");
                    Require(ios.maxTextureSize == 2048, $"iOS max size 2048: {assetPath}");
                }

                var loaded = Resources.LoadAll<Texture2D>("TopLivingNight");
                resourceTextureCount = loaded.Length;
                Require(resourceTextureCount == 17, "Resources.LoadAll resolves 17 textures");
                foreach (var texture in loaded)
                    Resources.UnloadAsset(texture);

                buildImportPolicyPassed = true;
            }
            finally
            {
                cleanup.Invoke(null, new object[] { true });
            }

            Require(
                !AssetDatabase.IsValidFolder("Assets/Resources/TopLivingNight"),
                "temporary Resources folder is cleaned");
        }

        private static Vector2Int ReadPngDimensions(string path)
        {
            using var stream = File.OpenRead(path);
            var header = new byte[24];
            if (stream.Read(header, 0, header.Length) != header.Length)
                throw new InvalidDataException($"PNG header is incomplete: {path}");

            var signature = new byte[] { 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a };
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

        private static void WriteEvidence(string result, string error)
        {
            var evidence = new VerificationEvidence
            {
                schemaVersion = 1,
                executed = true,
                result = result,
                verifiedCommit = ResolveCommit(),
                unityVersion = Application.unityVersion,
                assertionCount = assertions,
                failureCount = result == "PASSED" ? 0 : 1,
                sourceAssetCount = 17,
                resourceTextureCount = resourceTextureCount,
                viewTypeResolved = result == "PASSED",
                buildHookResolved = result == "PASSED",
                manifestProvenancePassed = result == "PASSED",
                buildImportPolicyPassed = result == "PASSED" && buildImportPolicyPassed,
                generatedAtUtc = DateTime.UtcNow.ToString("O"),
                error = error ?? string.Empty,
            };

            var path = Path.Combine(
                ResolveRepositoryRoot(),
                EvidenceRelativePath.Replace('/', Path.DirectorySeparatorChar));
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            File.WriteAllText(path, JsonUtility.ToJson(evidence, true) + "\n");
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
        }

        private static string ResolveCommit()
        {
            try
            {
                var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "git",
                        Arguments = "rev-parse HEAD",
                        WorkingDirectory = ResolveRepositoryRoot(),
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        CreateNoWindow = true,
                    },
                };
                process.Start();
                var output = process.StandardOutput.ReadToEnd().Trim();
                process.WaitForExit();
                return process.ExitCode == 0 ? output : string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }

        private static string ResolveRepositoryRoot()
        {
            return Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
        }

        private static void Require(bool value, string label)
        {
            assertions++;
            if (!value)
                throw new InvalidOperationException(
                    "TOP Living Night Unity verification failed: " + label);
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
            public int width;
            public int height;
            public long bytes;
            public string sha256;
        }

        [Serializable]
        private sealed class VerificationEvidence
        {
            public int schemaVersion;
            public bool executed;
            public string result;
            public string verifiedCommit;
            public string unityVersion;
            public int assertionCount;
            public int failureCount;
            public int sourceAssetCount;
            public int resourceTextureCount;
            public bool viewTypeResolved;
            public bool buildHookResolved;
            public bool manifestProvenancePassed;
            public bool buildImportPolicyPassed;
            public string generatedAtUtc;
            public string error;
        }
    }
}
