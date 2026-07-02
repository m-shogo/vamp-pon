using System;
using System.IO;
using System.Linq;
using UnityEditor;
using VampPon.UnitySpike.U30.ApprovalGate;

namespace VampPon.UnitySpike.Editor
{
    public static class U30ProductionApprovalGateVerification
    {
        private const string ReportPath = "Logs/u30_production_approval_gate_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var report = new U30ProductionApprovalPolicy().BuildCurrentStage1Report();
                Require(report.State.GateCount == 15, "gate count");
                Require(!report.State.ProductionApproved, "production approval remains false");
                Require(report.State.InternalPreviewReady, "internal preview ready");
                Require(report.State.MobileQaReady, "mobile QA ready");
                Require(!report.State.AssetReplacementReady, "asset replacement not ready");
                Require(report.State.PerformanceQaReady, "performance QA ready");
                Require(report.State.CriticalBlockerCount == 2, "critical blockers");
                Require(report.State.NotMeasuredCount >= 1, "not measured gate");
                Require(report.Gates.Any(gate => gate.Id == "mobile-performance" && gate.Status == U30ApprovalGateStatus.NotMeasured && gate.Critical), "mobile performance blocker");
                Require(report.Gates.Any(gate => gate.Id == "sprite-atlas" && gate.Status == U30ApprovalGateStatus.Fail && gate.Critical), "sprite atlas blocker");
                Require(report.Gates.Any(gate => gate.Id == "asset-boundary" && gate.Status == U30ApprovalGateStatus.Pass), "asset boundary pass");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, "U30 production approval gate verification passed; ProductionApproved=false");
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
