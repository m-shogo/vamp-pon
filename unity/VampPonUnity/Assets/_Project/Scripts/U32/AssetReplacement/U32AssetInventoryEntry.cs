namespace VampPon.UnitySpike.U32.AssetReplacement
{
    public sealed class U32AssetInventoryEntry
    {
        public U32AssetInventoryEntry(
            U32RuntimeAssetKey key,
            string path,
            string currentUsage,
            bool runtimeReferenced,
            U32RuntimeAssetStatus productionStatus,
            string risk,
            string nextAction)
        {
            Key = key;
            Path = path;
            CurrentUsage = currentUsage;
            RuntimeReferenced = runtimeReferenced;
            ProductionStatus = productionStatus;
            Risk = risk;
            NextAction = nextAction;
        }

        public U32RuntimeAssetKey Key { get; }
        public string Path { get; }
        public string CurrentUsage { get; }
        public bool RuntimeReferenced { get; }
        public U32RuntimeAssetStatus ProductionStatus { get; }
        public string Risk { get; }
        public string NextAction { get; }
    }
}
