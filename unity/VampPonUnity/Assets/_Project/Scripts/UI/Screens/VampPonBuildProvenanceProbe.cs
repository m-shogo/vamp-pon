using System;
using System.IO;
using UnityEngine;

namespace VampPon.UnitySpike.UI.Screens
{
    /// <summary>
    /// Opt-in/same-launch probe used by Simulator/physical-iPhone evidence runners
    /// to prove the installed player contains the exact clean Git commit embedded
    /// at Unity build time. Normal gameplay never creates or writes this evidence.
    /// </summary>
    public static class VampPonBuildProvenanceProbe
    {
        private const string EnableFlag = "--vamp-pon-build-provenance-probe";
        private const string SimulatorPerformanceFlag = "--vamp-pon-top-perf";
        private const string PhysicalPerformanceFlag = "--vamp-pon-top-physical-perf";
        private const string OutputFileName = "vamp-pon-build-provenance.json";

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Run()
        {
            // Device-performance launches produce provenance from the very same
            // process that performs the 300s measurement. This avoids a separate
            // probe launch whose process might still be alive when measurement
            // arguments are applied.
            if (!HasArgument(EnableFlag) &&
                !HasArgument(SimulatorPerformanceFlag) &&
                !HasArgument(PhysicalPerformanceFlag))
            {
                return;
            }

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
                if (!VampPonBuildProvenanceRuntime.TryReadCleanSourceCommit(
                        out var sourceCommit,
                        out var error))
                {
                    throw new InvalidOperationException(error);
                }

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
