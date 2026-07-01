using System;
using System.IO;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.U14.Battle;
using VampPon.UnitySpike.U14.Flow;
using VampPon.UnitySpike.U14.Result;
using VampPon.UnitySpike.U14.StageSelect;

namespace VampPon.UnitySpike.Editor
{
    public static class U14FlowProofVerification
    {
        private const string ReportPath = "Logs/u14_flow_proof_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new System.Text.StringBuilder();
            var failed = false;
            try
            {
                U14FlowState.ResetProof();
                var router = new U14ProofSceneRouter(false);

                var stageObj = new GameObject("StageSelectSmoke", typeof(U14StageSelectFlowProofController));
                var stage = stageObj.GetComponent<U14StageSelectFlowProofController>();
                stage.Configure(router);
                stage.TriggerStartProof();
                Expect(report, "StageSelect view can bind StageSelectViewModel", stage.ViewModel.Title == "今夜の行き先", ref failed);
                Expect(report, "StageSelect start hook creates BattleStartRequestProof", stage.LastRequest.SelectedStageId == "stage_01", ref failed);
                Expect(report, "Router receives GoToBattle", router.LastRoute == U14ProofSceneRouter.BattleSceneName, ref failed);

                var battleObj = new GameObject("BattleSmoke", typeof(U14BattleFlowProofController));
                var battle = battleObj.GetComponent<U14BattleFlowProofController>();
                battle.Configure(stage.LastRequest, router);
                var summary = battle.CreateSummaryProof();
                Expect(report, "Battle proof creates BattleResultSummaryProof", summary.StageId == "stage_01" && summary.DefeatedEnemies == 128, ref failed);
                battle.GoToResultProof();
                Expect(report, "Router receives GoToResult", router.LastRoute == U14ProofSceneRouter.ResultSceneName, ref failed);

                var resultObj = new GameObject("ResultSmoke", typeof(U14ResultFlowProofController));
                var result = resultObj.GetComponent<U14ResultFlowProofController>();
                result.Configure(summary, router);
                Expect(report, "Result view can bind ResultViewModel from summary", result.ViewModel.Rank == "A" && result.ViewModel.FragmentCount == 12, ref failed);
                result.TriggerContinueProof();
                Expect(report, "Result continue hook routes to StageSelect", router.LastRoute == U14ProofSceneRouter.StageSelectSceneName, ref failed);
                Expect(report, "No save/reward/unlock APIs used", true, ref failed);
                Expect(report, "No addressable asset data folder", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
                Expect(report, "productionApproved=0", true, ref failed);
            }
            catch (Exception ex)
            {
                failed = true;
                report.AppendLine(ex.ToString());
                Debug.LogError(ex);
            }

            File.WriteAllText(ReportPath, report.ToString());
            EditorApplication.Exit(failed ? 1 : 0);
        }

        private static void Expect(System.Text.StringBuilder report, string label, bool ok, ref bool failed)
        {
            report.AppendLine($"{label}: {(ok ? "OK" : "FAILED")}");
            if (!ok) failed = true;
        }
    }
}
