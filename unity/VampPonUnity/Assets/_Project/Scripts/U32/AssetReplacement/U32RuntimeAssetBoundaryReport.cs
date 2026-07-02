using System.Collections.Generic;

namespace VampPon.UnitySpike.U32.AssetReplacement
{
    public sealed class U32RuntimeAssetBoundaryReport
    {
        public bool ProductionApproved { get; set; }
        public bool AssetReplacementReady { get; set; }
        public U32AssetBoundaryStatus BoundaryStatus { get; set; } = U32AssetBoundaryStatus.Caution;
        public bool RuntimeReferencesDocsGenerated { get; set; }
        public bool RuntimeUsesGeneratedFinalPng { get; set; }
        public bool DraftSeFinalApproved { get; set; }
        public bool AddressablesIntroduced { get; set; }
        public bool CloudSaveIntroduced { get; set; }
        public bool SpriteAtlasProductionPackingComplete { get; set; }
        public string MobileMetrics { get; set; } = "NOT_MEASURED";
        public IReadOnlyList<U32AssetInventoryEntry> Inventory { get; set; } = new List<U32AssetInventoryEntry>();
        public IReadOnlyList<U32RuntimeAssetReplacementEntry> ReplacementEntries { get; set; } = new List<U32RuntimeAssetReplacementEntry>();
    }
}
