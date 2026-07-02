namespace VampPon.UnitySpike.U32.AssetReplacement
{
    public sealed class U32RuntimeAssetReplacementEntry
    {
        public U32RuntimeAssetReplacementEntry(
            U32RuntimeAssetKey key,
            string currentDraftPath,
            string futureProductionPath,
            U32RuntimeAssetStatus replacementStatus,
            string fallbackBehavior,
            bool generatedAssetBlocked,
            string productionApprovalNote)
        {
            Key = key;
            CurrentDraftPath = currentDraftPath;
            FutureProductionPath = futureProductionPath;
            ReplacementStatus = replacementStatus;
            FallbackBehavior = fallbackBehavior;
            GeneratedAssetBlocked = generatedAssetBlocked;
            ProductionApprovalNote = productionApprovalNote;
        }

        public U32RuntimeAssetKey Key { get; }
        public string CurrentDraftPath { get; }
        public string FutureProductionPath { get; }
        public U32RuntimeAssetStatus ReplacementStatus { get; }
        public string FallbackBehavior { get; }
        public bool GeneratedAssetBlocked { get; }
        public string ProductionApprovalNote { get; }
    }
}
