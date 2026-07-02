namespace VampPon.UnitySpike.U32.AssetReplacement
{
    public sealed class U32MissingAssetFallbackPolicy
    {
        public string MissingSpriteFallback { get; set; } = "Use registered draft-safe placeholder and log QA finding.";
        public string MissingAudioFallback { get; set; } = "Skip draft SE and keep gameplay running.";
        public string GeneratedDocsAssetFallback { get; set; } = "Block runtime reference and require production replacement.";
        public bool AddressablesIntroduced { get; set; }
        public bool CloudSaveIntroduced { get; set; }
    }
}
