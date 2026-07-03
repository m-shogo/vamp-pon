namespace VampPon.UnitySpike.U40.FinalAssetReplacement
{
    public sealed class U40MissingFinalAssetFallbackPolicy
    {
        public bool KeepRuntimeSafe { get; set; } = true;
        public bool DoNotLoadGeneratedDocs { get; set; } = true;
        public bool DoNotLoadPublicPrototypeAsFinal { get; set; } = true;
        public string Behavior { get; set; } = "Use current runtime candidate or procedural readable fallback; never crash because final art is absent.";
    }
}
