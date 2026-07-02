using System;
using System.IO;
using System.Linq;
using UnityEditor;
using VampPon.UnitySpike.U32.AssetReplacement;

namespace VampPon.UnitySpike.Editor
{
    public static class U32ProductionAssetReplacementVerification
    {
        private const string ReportPath = "Logs/u32_production_asset_replacement_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var report = new U32RuntimeAssetReplacementRegistry().BuildReport();
                Require(!report.ProductionApproved, "production approval remains false");
                Require(!report.AssetReplacementReady, "asset replacement ready remains false");
                Require(!report.SpriteAtlasProductionPackingComplete, "sprite atlas packing incomplete");
                Require(report.Inventory.Count >= 14, "runtime asset inventory count");
                Require(report.ReplacementEntries.Count >= 6, "replacement entries");
                Require(report.Inventory.Any(entry => entry.ProductionStatus == U32RuntimeAssetStatus.BlockedFromRuntime), "blocked runtime entry");
                Require(report.Inventory.Any(entry => entry.Key == U32RuntimeAssetKey.DraftSe && entry.ProductionStatus == U32RuntimeAssetStatus.NeedsReview), "draft SE not final");
                Require(report.Inventory.Any(entry => entry.Key == U32RuntimeAssetKey.KokuyouRareEvolutionEffects && entry.ProductionStatus == U32RuntimeAssetStatus.NeedsReplacement), "climax effects need replacement");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, "U32 production asset replacement verification passed; productionApproved=false; assetReplacementReady=false");
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                File.WriteAllText(ReportPath, ex.ToString());
                UnityEngine.Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static void Require(bool condition, string label)
        {
            if (!condition) throw new InvalidOperationException(label);
        }
    }
}
