using System;
using UnityEngine;

namespace VampPon.UnitySpike.UI.Screens
{
    /// <summary>
    /// Runtime-side verifier for the build provenance embedded by
    /// VampPonBuildProvenanceSync. Final evidence accepts only an exact clean
    /// 40-character Git SHA; DIRTY development markers are intentionally rejected.
    /// </summary>
    internal static class VampPonBuildProvenanceRuntime
    {
        private const string ResourcePath = "VampPonBuildProvenance/source-commit";

        public static bool MatchesCleanSourceCommit(string expectedCommit, out string error)
        {
            if (!IsLowerHexCommit(expectedCommit))
            {
                error = "requested evidence source commit is not a lowercase 40-character Git SHA";
                return false;
            }

            if (!TryReadCleanSourceCommit(out var embeddedCommit, out error))
                return false;

            if (!string.Equals(embeddedCommit, expectedCommit, StringComparison.Ordinal))
            {
                error =
                    $"installed player source commit mismatch: embedded={embeddedCommit}, expected={expectedCommit}";
                return false;
            }

            error = string.Empty;
            return true;
        }

        public static bool TryReadCleanSourceCommit(out string sourceCommit, out string error)
        {
            sourceCommit = string.Empty;
            var embedded = Resources.Load<TextAsset>(ResourcePath);
            if (embedded == null)
            {
                error = $"embedded build provenance resource is missing: {ResourcePath}";
                return false;
            }

            var value = embedded.text.Trim();
            if (!IsLowerHexCommit(value))
            {
                error =
                    "embedded build provenance is not a clean lowercase 40-character Git SHA; " +
                    "dirty/development builds are ineligible for final device evidence";
                return false;
            }

            sourceCommit = value;
            error = string.Empty;
            return true;
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
    }
}
