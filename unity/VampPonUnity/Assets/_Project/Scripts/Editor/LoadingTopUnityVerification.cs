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
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.UI.Screens;

namespace VampPon.UnitySpike.Editor
{
    public static class LoadingTopUnityVerification
    {
        private const string ManifestRelativePath =
            "docs/design-targets/generated/loading-seasonal-v1/manifest.json";
        private const string EvidenceRelativePath =
            "docs/design-targets/generated/loading-seasonal-v1/runtime-unity-verification.json";

        private static int assertions;
        private static int resourceTextureCount;
        private static bool loadingViewResolved;
        private static bool flowContractResolved;
        private static bool randomRotationPassed;
        private static bool buildHookResolved;
        private static bool manifestProvenancePassed;
        private static bool buildImportPolicyPassed;

        [MenuItem("Vamp Pon/Loading Seasonal/Verify Loading -> TOP Unity Contract")]
        public static void RunBatchmode()
        {
            ResetState();
            try
            {
                VerifyCompileSurface();
                VerifyRandomRotation();
                VerifyCommittedSources();
                VerifyBuildImportPolicy();
                WriteEvidence("PASSED", null);
                UnityEngine.Debug.Log(
                    $"Loading -> TOP Unity verification passed: {assertions} assertions.");
            }
            catch (Exception exception)
            {
                WriteEvidence("FAILED", exception.ToString());
                throw;
            }
        }

        private static void ResetState()
        {
            assertions = 0;
            resourceTextureCount = 0;
            loadingViewResolved = false;
            flowContractResolved = false;
            randomRotationPassed = false;
            buildHookResolved = false;
            manifestProvenancePassed = false;
            buildImportPolicyPassed = false;
        }

        private static void VerifyCompileSurface()
        {
            Require(
                typeof(MonoBehaviour).IsAssignableFrom(typeof(LoadingSeasonalView)),
                "LoadingSeasonalView resolves as MonoBehaviour");

            var build = typeof(LoadingSeasonalView).GetMethod(
                "Build",
                BindingFlags.Instance | BindingFlags.Public);
            Require(build != null, "Loading Build method resolves");
            Require(
                build.GetParameters().Length == 3,
                "Loading Build keeps parent/font/completed contract");

            Require(
                typeof(LoadingSeasonalView).GetProperty(
                    "SelectedArtIndex",
                    BindingFlags.Instance | BindingFlags.Public) != null,
                "SelectedArtIndex capture hook resolves");
            Require(
                typeof(LoadingSeasonalView).GetProperty(
                    "SelectedArtId",
                    BindingFlags.Instance | BindingFlags.Public) != null,
                "SelectedArtId capture hook resolves");
            Require(
                typeof(LoadingSeasonalView).GetMethod(
                    "SelectNonRepeatingIndex",
                    BindingFlags.Static | BindingFlags.Public) != null,
                "non-repeating selector resolves");
            Require(
                typeof(LoadingSeasonalView).GetMethod(
                    "SetCaptureOverride",
                    BindingFlags.Static | BindingFlags.Public) != null,
                "capture override resolves");
            Require(
                typeof(LoadingSeasonalView).GetMethod(
                    "ReleaseCaptureHold",
                    BindingFlags.Static | BindingFlags.Public) != null,
                "capture hold release resolves");

            Require(
                typeof(IPreprocessBuildWithReport).IsAssignableFrom(
                    typeof(LoadingSeasonalBuildAssetSync)),
                "loading pre-build hook resolves");
            Require(
                typeof(IPostprocessBuildWithReport).IsAssignableFrom(
                    typeof(LoadingSeasonalBuildAssetSync)),
                "loading post-build hook resolves");

            var shellType = typeof(U46RuntimeShell);
            Require(
                shellType.GetField(
                    "loading",
                    BindingFlags.Instance | BindingFlags.NonPublic) != null,
                "runtime shell owns Loading view");
            Require(
                shellType.GetMethod(
                    "CompleteLoading",
                    BindingFlags.Instance | BindingFlags.NonPublic) != null,
                "runtime shell loading completion resolves");
            Require(
                shellType.GetMethod(
                    "BuildTopIfNeeded",
                    BindingFlags.Instance | BindingFlags.NonPublic) != null,
                "runtime shell deferred TOP construction resolves");

            loadingViewResolved = true;
            flowContractResolved = true;
            buildHookResolved = true;
        }

        private static void VerifyRandomRotation()
        {
            Require(
                LoadingSeasonalView.SelectNonRepeatingIndex(4, 0, 0) == 1,
                "same spring candidate advances to summer");
            Require(
                LoadingSeasonalView.SelectNonRepeatingIndex(4, 0, 1) == 1,
                "different candidate remains selected");
            Require(
                LoadingSeasonalView.SelectNonRepeatingIndex(4, 3, 3) == 0,
                "winter repeat wraps to spring");
            Require(
                LoadingSeasonalView.SelectNonRepeatingIndex(4, -1, 7) == 3,
                "candidate normalizes into four-slot range");
            Require(
                LoadingSeasonalView.SelectNonRepeatingIndex(1, 0, 0) == 0,
                "single-slot selector remains valid");

            var threw = false;
            try
            {
                LoadingSeasonalView.SelectNonRepeatingIndex(0, -1, 0);
            }
            catch (ArgumentOutOfRangeException)
            {
                threw = true;
            }
            Require(threw, "zero-slot selector fails explicitly");
            randomRotationPassed = true;
        }

        private static void VerifyCommittedSources()
        {
            var repositoryRoot = ResolveRepositoryRoot();
            var manifestPath = Path.Combine(
                repositoryRoot,
                ManifestRelativePath.Replace('/', Path.DirectorySeparatorChar));
            Require(File.Exists(manifestPath), "loading manifest exists");

            var manifest = JsonUtility.FromJson<ManifestRoot>(
                File.ReadAllText(manifestPath));
            Require(manifest != null && manifest.assets != null, "loading manifest parses");
            Require(manifest.assets.Length == 4, "loading manifest contains four assets");
            Require(manifest.runtimeConnected, "loading runtimeConnected remains true");
            Require(manifest.randomRotation, "loading randomRotation remains true");
            Require(
                manifest.consecutiveRepeatPrevented,
                "loading consecutiveRepeatPrevented remains true");

            var ids = new HashSet<string>(StringComparer.Ordinal);
            var resourceFiles = new HashSet<string>(StringComparer.Ordinal);
            foreach (var asset in manifest.assets)
            {
                Require(asset != null, "loading asset entry is non-null");
                Require(!string.IsNullOrWhiteSpace(asset.id), "loading asset id exists");
                Require(ids.Add(asset.id), "loading asset id is unique");
                Require(
                    !string.IsNullOrWhiteSpace(asset.sourcePath),
                    "loading source path exists");
                Require(
                    !string.IsNullOrWhiteSpace(asset.resourceFile),
                    "loading resource file exists");
                Require(
                    resourceFiles.Add(asset.resourceFile),
                    "loading resource file is unique");
                Require(
                    !string.IsNullOrWhiteSpace(asset.desiredSourceTitle),
                    "desired seasonal source title is recorded");

                var sourcePath = Path.Combine(
                    repositoryRoot,
                    asset.sourcePath.Replace('/', Path.DirectorySeparatorChar));
                Require(File.Exists(sourcePath), $"loading source exists: {asset.id}");
                Require(
                    string.Equals(
                        ComputeSha256(sourcePath),
                        asset.sha256,
                        StringComparison.OrdinalIgnoreCase),
                    $"loading source SHA-256 matches: {asset.id}");

                var dimensions = ReadPngDimensions(sourcePath);
                Require(
                    dimensions.x == asset.width,
                    $"loading source width matches: {asset.id}");
                Require(
                    dimensions.y == asset.height,
                    $"loading source height matches: {asset.id}");
            }

            manifestProvenancePassed = true;
        }

        private static void VerifyBuildImportPolicy()
        {
            var syncType = typeof(LoadingSeasonalBuildAssetSync);
            var stage = syncType.GetMethod(
                "StageAndImport",
                BindingFlags.Static | BindingFlags.NonPublic);
            var cleanup = syncType.GetMethod(
                "CleanupGeneratedBuildAssets",
                BindingFlags.Static | BindingFlags.NonPublic);
            Require(stage != null, "loading staging method resolves");
            Require(cleanup != null, "loading cleanup method resolves");

            try
            {
                stage.Invoke(null, null);

                var guids = AssetDatabase.FindAssets(
                    "t:Texture2D",
                    new[] { "Assets/Resources/LoadingSeasonal" });
                Require(guids.Length == 4, "four imported loading textures resolve");

                foreach (var guid in guids)
                {
                    var assetPath = AssetDatabase.GUIDToAssetPath(guid);
                    Require(
                        AssetImporter.GetAtPath(assetPath) is TextureImporter,
                        $"Loading TextureImporter resolves: {assetPath}");
                    var importer = (TextureImporter)AssetImporter.GetAtPath(assetPath);
                    Require(!importer.isReadable, $"Loading Read/Write OFF: {assetPath}");
                    Require(!importer.mipmapEnabled, $"Loading mipmap OFF: {assetPath}");
                    Require(
                        importer.wrapMode == TextureWrapMode.Clamp,
                        $"Loading Clamp: {assetPath}");
                    Require(
                        importer.filterMode == FilterMode.Bilinear,
                        $"Loading Bilinear: {assetPath}");

                    var ios = importer.GetPlatformTextureSettings("iPhone");
                    Require(ios.overridden, $"Loading iOS override enabled: {assetPath}");
                    Require(
                        ios.format == TextureImporterFormat.ASTC_6x6,
                        $"Loading iOS ASTC 6x6: {assetPath}");
                    Require(
                        ios.maxTextureSize == 2048,
                        $"Loading iOS max size 2048: {assetPath}");
                }

                var loaded = Resources.LoadAll<Texture2D>("LoadingSeasonal");
                resourceTextureCount = loaded.Length;
                Require(
                    resourceTextureCount == 4,
                    "Resources.LoadAll resolves four loading textures");
                foreach (var texture in loaded)
                    Resources.UnloadAsset(texture);

                buildImportPolicyPassed = true;
            }
            finally
            {
                cleanup.Invoke(null, new object[] { true });
            }

            Require(
                !AssetDatabase.IsValidFolder("Assets/Resources/LoadingSeasonal"),
                "temporary Loading Resources folder is cleaned");
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
                sourceAssetCount = 4,
                resourceTextureCount = resourceTextureCount,
                loadingViewResolved = loadingViewResolved,
                flowContractResolved = flowContractResolved,
                randomRotationPassed = randomRotationPassed,
                buildHookResolved = buildHookResolved,
                manifestProvenancePassed = manifestProvenancePassed,
                buildImportPolicyPassed = buildImportPolicyPassed,
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
                    "Loading -> TOP Unity verification failed: " + label);
        }

        [Serializable]
        private sealed class ManifestRoot
        {
            public bool runtimeConnected;
            public bool randomRotation;
            public bool consecutiveRepeatPrevented;
            public ManifestAsset[] assets;
        }

        [Serializable]
        private sealed class ManifestAsset
        {
            public string id;
            public string desiredSourceTitle;
            public string sourcePath;
            public string resourceFile;
            public int width;
            public int height;
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
            public bool loadingViewResolved;
            public bool flowContractResolved;
            public bool randomRotationPassed;
            public bool buildHookResolved;
            public bool manifestProvenancePassed;
            public bool buildImportPolicyPassed;
            public string generatedAtUtc;
            public string error;
        }
    }
}
