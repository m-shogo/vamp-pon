using System;
using System.IO;
using System.Linq;
using UnityEditor;
using VampPon.UnitySpike.U34.ReleaseCandidate;

namespace VampPon.UnitySpike.Editor
{
    public static class U34ReleaseCandidateChecklistVerification
    {
        private const string ReportPath = "Logs/u34_release_candidate_checklist_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var model = new U34ReleaseCandidateReadinessFactory().Create();
                Require(!model.RcReady, "rcReady remains false");
                Require(!model.ProductionApproved, "productionApproved remains false");
                Require(model.InternalPreviewReady, "internal preview ready");
                Require(model.MobileQaReady, "mobile QA ready");
                Require(!model.MobileMetricsReady, "mobile metrics not ready");
                Require(!model.AssetReplacementReady, "asset replacement not ready");
                Require(model.BalanceHardeningReady, "balance hardening ready");
                Require(model.SpriteAtlasPackingReady, "sprite atlas packing ready");
                Require(model.BlockerCount >= 5, "blockers registered");
                Require(model.CautionCount >= 3, "cautions registered");
                Require(model.NotMeasuredCount >= 2, "not measured items remain");
                Require(model.ChecklistItems.Any(item => item.Status == U34RcStatus.NotMeasured), "not measured not pass");
                Require(model.ChecklistItems.Any(item => item.Id == "mobile-metrics" && item.Status == U34RcStatus.NotMeasured), "mobile metrics not measured");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, "U34 release candidate checklist verification passed; rcReady=false; productionApproved=false");
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
