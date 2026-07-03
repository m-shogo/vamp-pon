using System;

namespace VampPon.UnitySpike.U40.FinalAssetReplacement
{
    public sealed class U40FinalAssetBoundaryPolicy
    {
        public bool IsRuntimeForbiddenPath(string path)
        {
            if (string.IsNullOrWhiteSpace(path)) return false;
            return path.Contains("docs", StringComparison.OrdinalIgnoreCase)
                && path.Contains("design-targets", StringComparison.OrdinalIgnoreCase)
                && path.Contains("generated", StringComparison.OrdinalIgnoreCase)
                || path.Contains("/screenshots/", StringComparison.OrdinalIgnoreCase)
                || path.Contains("generated final", StringComparison.OrdinalIgnoreCase);
        }

        public bool IsPublicPrototypeFinalBlocked(string path)
        {
            return !string.IsNullOrWhiteSpace(path) && path.Contains("public/assets/prototypes", StringComparison.OrdinalIgnoreCase);
        }
    }
}
