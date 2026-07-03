using System;
using System.IO;
using System.Linq;
using UnityEditor;
using VampPon.UnitySpike.U40.FinalAssetReplacement;

namespace VampPon.UnitySpike.Editor
{
    public static class U40FinalProductionAssetReplacementVerification
    {
        private const string ReportPath = "Logs/u40_final_production_asset_replacement_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var report = new U40FinalAssetReplacementRegistry().BuildReport();
                var boundary = new U40FinalAssetBoundaryPolicy();
                Require(report.AssetReplacementReady, "assetReplacementReady is true for U40 asset boundary");
                Require(!report.ProductionApproved, "productionApproved remains false");
                Require(!report.RcReady, "rcReady remains false");
                Require(!report.MobileMetricsReady, "mobileMetricsReady remains false");
                Require(report.SpriteAtlasPackingReady, "U36 sprite atlas packing ready");
                Require(report.FinalSeReady, "U39 finalCandidate SE ready");
                Require(!report.AudioMixerReady, "AudioMixer remains not final");
                Require(report.Entries.Count >= 15, "U40 entries cover Stage1 asset groups");
                Require(report.Entries.Any(entry => entry.CurrentStatus == U40FinalAssetStatus.BlockedFromRuntime), "generated docs are blocked");
                Require(report.Entries.Any(entry => entry.AssetKey == "u39_final_candidate_se" && entry.CurrentStatus == U40FinalAssetStatus.FinalCandidate), "U39 SE remains finalCandidate");
                Require(report.Entries.Where(entry => entry.ReplacementReady).All(entry => !boundary.IsRuntimeForbiddenPath(entry.CurrentPath)), "ready entries do not use generated docs");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, "U40 final production asset replacement verification passed; assetReplacementReady=true; productionApproved=false; rcReady=false");
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
