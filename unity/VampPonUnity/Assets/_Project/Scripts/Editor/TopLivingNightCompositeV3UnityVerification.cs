using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.UI.Screens;

namespace VampPon.UnitySpike.Editor
{
    public static class TopLivingNightCompositeV3UnityVerification
    {
        private const string EvidenceRelativePath =
            "docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json";
        private const string TextureAssetPath =
            "Assets/Resources/TopLivingNightV3Generated/base-composite-v3.png";
        private const string MaterialAssetPath =
            "Assets/Resources/TopLivingNightV3Generated/LuminanceAdditive.mat";
        private const string TextureResourcePath =
            "TopLivingNightV3Generated/base-composite-v3";
        private const string MaterialResourcePath =
            "TopLivingNightV3Generated/LuminanceAdditive";
        private const string ShaderName = "VampPon/UI/LuminanceAdditiveMask";

        private static int assertions;
        private static int resourceTextureCount;
        private static int resourceMaterialCount;
        private static bool controllerResolved;
        private static bool ambientMotionDirectorResolved;
        private static bool fireCadenceDirectorResolved;
        private static bool shaderResolved;
        private static bool buildHookResolved;
        private static bool buildImportPolicyPassed;
        private static string sourceCompositeKind;
        private static string sourceCompositePath;
        private static string sourceCompositeSha256;

        [MenuItem("Vamp Pon/TOP Living Night/Verify Runtime V3 Unity Contract")]
        public static void RunBatchmode()
        {
            ResetState();
            try
            {
                VerifyCompileSurface();
                VerifyCommittedComposite();
                VerifyBuildImportPolicy();
                WriteEvidence("PASSED", null);
                UnityEngine.Debug.Log(
                    $"TOP Runtime V3 Unity verification passed: {assertions} assertions, source={sourceCompositeKind}.");
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
            resourceMaterialCount = 0;
            controllerResolved = false;
            ambientMotionDirectorResolved = false;
            fireCadenceDirectorResolved = false;
            shaderResolved = false;
            buildHookResolved = false;
            buildImportPolicyPassed = false;
            sourceCompositeKind = string.Empty;
            sourceCompositePath = string.Empty;
            sourceCompositeSha256 = string.Empty;
        }

        private static void VerifyCompileSurface()
        {
            Require(
                typeof(MonoBehaviour).IsAssignableFrom(
                    typeof(TopLivingNightCompositeV3Controller)),
                "Runtime V3 controller resolves as MonoBehaviour");
            controllerResolved = true;

            Require(
                typeof(MonoBehaviour).IsAssignableFrom(
                    typeof(TopLivingNightAmbientMotionDirector)),
                "Runtime V3 ambient-motion director resolves as MonoBehaviour");
            ambientMotionDirectorResolved = true;

            Require(
                typeof(MonoBehaviour).IsAssignableFrom(
                    typeof(TopLivingNightFireCadenceDirector)),
                "Runtime V3 fire-cadence director resolves as MonoBehaviour");
            fireCadenceDirectorResolved = true;

            var syncType = typeof(TopLivingNightCompositeV3BuildAssetSync);
            Require(syncType != null, "Runtime V3 build sync type resolves");
            Require(
                syncType.GetMethod(
                    "StageAndImport",
                    BindingFlags.Static | BindingFlags.NonPublic) != null,
                "Runtime V3 StageAndImport resolves");
            Require(
                syncType.GetMethod(
                    "ResolveCompositeSource",
                    BindingFlags.Static | BindingFlags.NonPublic) != null,
                "Runtime V3 source selector resolves");
            Require(
                syncType.GetMethod(
                    "CleanupGeneratedBuildAssets",
                    BindingFlags.Static | BindingFlags.NonPublic) != null,
                "Runtime V3 cleanup resolves");
            buildHookResolved = true;

            var shader = Shader.Find(ShaderName);
            Require(shader != null, "Runtime V3 additive shader resolves");
            Require(shader.name == ShaderName, "Runtime V3 additive shader name matches");
            shaderResolved = true;
        }

        private static void VerifyCommittedComposite()
        {
            var selection = TopLivingNightCompositeV3BuildAssetSync.ResolveCompositeSource();
            Require(selection != null, "Runtime V3 composite source selection resolves");
            Require(
                selection.Kind == "bridge" || selection.Kind == "final-core5",
                "Runtime V3 composite source kind is recognized");
            Require(
                selection.IsFinal == (selection.Kind == "final-core5"),
                "Runtime V3 final-source marker matches source kind");

            var path = Path.Combine(
                ResolveRepositoryRoot(),
                selection.RelativePath.Replace('/', Path.DirectorySeparatorChar));
            Require(File.Exists(path), "Runtime V3 selected composite source exists");

            var actualSha = ComputeSha256(path);
            Require(
                string.Equals(
                    actualSha,
                    selection.ExpectedSha256,
                    StringComparison.OrdinalIgnoreCase),
                "Runtime V3 selected composite SHA-256 matches source authority");

            var dimensions = ReadPngDimensions(path);
            Require(dimensions.x == 430, "Runtime V3 composite width is 430");
            Require(dimensions.y == 932, "Runtime V3 composite height is 932");

            sourceCompositeKind = selection.Kind;
            sourceCompositePath = selection.RelativePath;
            sourceCompositeSha256 = actualSha;
        }

        private static void VerifyBuildImportPolicy()
        {
            var syncType = typeof(TopLivingNightCompositeV3BuildAssetSync);
            var stage = syncType.GetMethod(
                "StageAndImport",
                BindingFlags.Static | BindingFlags.NonPublic);
            var cleanup = syncType.GetMethod(
                "CleanupGeneratedBuildAssets",
                BindingFlags.Static | BindingFlags.NonPublic);
            Require(stage != null, "Runtime V3 stage method remains available");
            Require(cleanup != null, "Runtime V3 cleanup method remains available");

            try
            {
                var stagedSelection = stage.Invoke(null, null) as
                    TopLivingNightCompositeV3BuildAssetSync.CompositeSourceSelection;
                Require(stagedSelection != null, "Runtime V3 stage returns source provenance");
                Require(
                    stagedSelection.Kind == sourceCompositeKind,
                    "Runtime V3 staged source kind matches verified source");
                Require(
                    stagedSelection.RelativePath == sourceCompositePath,
                    "Runtime V3 staged source path matches verified source");
                Require(
                    string.Equals(
                        stagedSelection.ExpectedSha256,
                        sourceCompositeSha256,
                        StringComparison.OrdinalIgnoreCase),
                    "Runtime V3 staged source SHA matches verified source");

                var texture = AssetDatabase.LoadAssetAtPath<Texture2D>(TextureAssetPath);
                Require(texture != null, "Runtime V3 imported texture resolves");
                Require(texture.width == 430, "Runtime V3 imported texture width matches");
                Require(texture.height == 932, "Runtime V3 imported texture height matches");

                Require(
                    AssetImporter.GetAtPath(TextureAssetPath) is TextureImporter,
                    "Runtime V3 TextureImporter resolves");
                var importer = (TextureImporter)AssetImporter.GetAtPath(TextureAssetPath);
                Require(!importer.isReadable, "Runtime V3 Read/Write is OFF");
                Require(!importer.mipmapEnabled, "Runtime V3 mipmap is OFF");
                Require(importer.wrapMode == TextureWrapMode.Clamp, "Runtime V3 wrap is Clamp");
                Require(importer.filterMode == FilterMode.Bilinear, "Runtime V3 filter is Bilinear");

                var ios = importer.GetPlatformTextureSettings("iPhone");
                Require(ios.overridden, "Runtime V3 iOS override is enabled");
                Require(
                    ios.format == TextureImporterFormat.ASTC_6x6,
                    "Runtime V3 iOS format is ASTC 6x6");
                Require(ios.maxTextureSize == 2048, "Runtime V3 iOS max size is 2048");

                var material = AssetDatabase.LoadAssetAtPath<Material>(MaterialAssetPath);
                Require(material != null, "Runtime V3 generated Material resolves");
                Require(material.shader != null, "Runtime V3 generated Material shader resolves");
                Require(material.shader.name == ShaderName, "Runtime V3 generated Material uses additive shader");

                var resourceTexture = Resources.Load<Texture2D>(TextureResourcePath);
                resourceTextureCount = resourceTexture == null ? 0 : 1;
                Require(resourceTextureCount == 1, "Runtime V3 Resources texture resolves");

                var resourceMaterial = Resources.Load<Material>(MaterialResourcePath);
                resourceMaterialCount = resourceMaterial == null ? 0 : 1;
                Require(resourceMaterialCount == 1, "Runtime V3 Resources Material resolves");
                Require(
                    resourceMaterial.shader != null &&
                    resourceMaterial.shader.name == ShaderName,
                    "Runtime V3 Resources Material retains additive shader");

                if (resourceTexture != null)
                    Resources.UnloadAsset(resourceTexture);
                if (resourceMaterial != null)
                    Resources.UnloadAsset(resourceMaterial);

                buildImportPolicyPassed = true;
            }
            finally
            {
                cleanup.Invoke(null, new object[] { true });
            }

            Require(
                !AssetDatabase.IsValidFolder("Assets/Resources/TopLivingNightV3Generated"),
                "Runtime V3 generated Resources folder is cleaned");
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
                sourceCompositeCount = 1,
                sourceCompositeKind = sourceCompositeKind,
                sourceCompositePath = sourceCompositePath,
                sourceCompositeSha256 = sourceCompositeSha256,
                resourceTextureCount = resourceTextureCount,
                resourceMaterialCount = resourceMaterialCount,
                controllerResolved = result == "PASSED" && controllerResolved,
                ambientMotionDirectorResolved = result == "PASSED" && ambientMotionDirectorResolved,
                fireCadenceDirectorResolved = result == "PASSED" && fireCadenceDirectorResolved,
                shaderResolved = result == "PASSED" && shaderResolved,
                buildHookResolved = result == "PASSED" && buildHookResolved,
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

        private static void Require(bool value, string label)
        {
            assertions++;
            if (!value)
                throw new InvalidOperationException(
                    "TOP Runtime V3 Unity verification failed: " + label);
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
            public int sourceCompositeCount;
            public string sourceCompositeKind;
            public string sourceCompositePath;
            public string sourceCompositeSha256;
            public int resourceTextureCount;
            public int resourceMaterialCount;
            public bool controllerResolved;
            public bool ambientMotionDirectorResolved;
            public bool fireCadenceDirectorResolved;
            public bool shaderResolved;
            public bool buildHookResolved;
            public bool buildImportPolicyPassed;
            public string generatedAtUtc;
            public string error;
        }
    }
}
