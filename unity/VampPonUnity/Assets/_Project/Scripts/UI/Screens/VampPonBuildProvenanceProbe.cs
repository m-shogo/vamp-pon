using System;
using System.IO;
using UnityEngine;

namespace VampPon.UnitySpike.UI.Screens
{
    /// <summary>
    /// Opt-in probe used by Simulator/physical-iPhone evidence runners to prove
    /// that the installed player contains the exact Git commit embedded at Unity
    /// build time. Normal gameplay never creates or writes this evidence.
    /// </summary>
    public static class VampPonBuildProvenanceProbe
    {
        private const string EnableFlag = "--vamp-pon-build-provenance-probe";
        private const string ResourcePath = "VampPonBuildProvenance/source-commit";
        private const string OutputFileName = "vamp-pon-build-provenance.json";

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Run()
        {
            if (!HasArgument(EnableFlag))
                return;

            var artifact = new BuildProvenanceArtifact
            {
                schemaVersion = 1,
                result = "FAILED",
                sourceCommit = string.Empty,
                bundleIdentifier = Application.identifier,
                applicationVersion = Application.version,
                unityVersion = Application.unityVersion,
                recordedAtUtc = DateTime.UtcNow.ToString("O"),
                error = string.Empty,
            };

            try
            {
                var embedded = Resources.Load<TextAsset>(ResourcePath);
                if (embedded == null)
                    throw new InvalidOperationException(
                        $"Embedded build provenance resource is missing: {ResourcePath}");

                var sourceCommit = embedded.text.Trim();
                if (!IsLowerHexCommit(sourceCommit))
                    throw new InvalidOperationException(
                        "Embedded build provenance is not a lowercase 40-character Git commit SHA.");

                artifact.sourceCommit = sourceCommit;
                artifact.result = "PASSED";
            }
            catch (Exception exception)
            {
                artifact.error = exception.Message;
                Debug.LogError($"VampPon build provenance probe failed: {exception}");
            }

            var path = Path.Combine(Application.persistentDataPath, OutputFileName);
            File.WriteAllText(path, JsonUtility.ToJson(artifact, true));
            Debug.Log(
                $"VAMPPON_BUILD_PROVENANCE_ARTIFACT={path} result={artifact.result} " +
                $"sourceCommit={artifact.sourceCommit}");
        }

        private static bool HasArgument(string expected)
        {
            foreach (var value in Environment.GetCommandLineArgs())
            {
                if (string.Equals(value, expected, StringComparison.Ordinal))
                    return true;
            }

            return false;
        }

        private static bool IsLowerHexCommit(string value)
        {
            if (value == null || value.Length != 40)
                return false;

            foreach (var character in value)
            {
                var digit = character >= '0' && character <= '9';
                var lowerHex = character >= 'a' && character <= 'f';
                if (!digit && !lowerHex)
                    return false;
            }

            return true;
        }

        [Serializable]
        private sealed class BuildProvenanceArtifact
        {
            public int schemaVersion;
            public string result;
            public string sourceCommit;
            public string bundleIdentifier;
            public string applicationVersion;
            public string unityVersion;
            public string recordedAtUtc;
            public string error;
        }
    }
}
