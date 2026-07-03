namespace VampPon.UnitySpike.U40.FinalAssetReplacement
{
    public sealed class U40FinalAssetReplacementEntry
    {
        public string AssetKey { get; set; } = string.Empty;
        public U40FinalAssetCategory Category { get; set; }
        public string CurrentPath { get; set; } = string.Empty;
        public string FutureFinalPath { get; set; } = string.Empty;
        public U40FinalAssetStatus CurrentStatus { get; set; }
        public bool ReplacementReady { get; set; }
        public string FallbackPath { get; set; } = string.Empty;
        public string MissingAssetFallback { get; set; } = string.Empty;
        public bool BlockedFromRuntime { get; set; }
        public bool GeneratedAssetForbidden { get; set; }
        public bool DocsGeneratedForbidden { get; set; }
        public bool FinalApprovalRequired { get; set; } = true;
        public string Notes { get; set; } = string.Empty;
    }
}
