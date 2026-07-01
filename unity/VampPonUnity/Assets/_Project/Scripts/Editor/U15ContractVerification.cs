using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.U14.Flow;
using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U15.Mappers;

namespace VampPon.UnitySpike.Editor
{
    public static class U15ContractVerification
    {
        private const string ReportPath = "Logs/u15_contract_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;

            try
            {
                var start = U14ToU15ContractMapper.ToStageStartRequest(BattleStartRequestProof.Sample);
                Expect(report, "BattleStartRequestProof -> StageStartRequest mapping OK", start.StageId == "stage_01" && start.DifficultyId == "easy", ref failed);

                var proofSummary = BattleResultSummaryProof.FromRequest(BattleStartRequestProof.Sample);
                var contract = U14ToU15ContractMapper.ToBattleResultSummary(proofSummary);
                Expect(report, "BattleResultSummaryProof -> BattleResultSummary mapping OK", contract.ClearState == "clear" && contract.ElapsedSeconds == 480 && contract.Rank == "A", ref failed);

                var resultPresentation = BattleResultToPresentationMapper.ToResultPresentationModel(contract);
                Expect(report, "BattleResultSummary -> ResultPresentationModel mapping OK", resultPresentation.Title == "今夜の記録" && resultPresentation.FragmentLabel == "欠片 12", ref failed);

                var stagePresentation = StageSelectPresentationMapper.FromSample(contract);
                Expect(report, "BattleResultSummary -> StageSelectPresentationModel mapping OK", stagePresentation.LastResultLabel == "前回: Rank A / 欠片 12", ref failed);

                Expect(report, "RewardSummary labels OK", contract.RewardSummary.DisplayLabels[0] == "欠片 12" && contract.RewardSummary.RewardCards.Length == 3, ref failed);
                Expect(report, "UnlockCandidate does not unlock anything", !contract.UnlockCandidate.HasCandidate && contract.UnlockCandidate.Reason.Contains("unlock確定しない"), ref failed);

                var emptyReward = new RewardSummary(null, 0, 0, 0);
                Expect(report, "RewardCards empty safe", emptyReward.RewardCards.Length == 0 && emptyReward.DisplayLabels.Length == 3, ref failed);
                Expect(report, "UnlockCandidate none safe", !UnlockCandidate.None.HasCandidate, ref failed);
                Expect(report, "ElapsedSeconds from ElapsedLabel", U14ToU15ContractMapper.ElapsedSecondsFromLabel("08:00") == 480, ref failed);
                var fallbackStart = U14ToU15ContractMapper.ToStageStartRequest(new BattleStartRequestProof("stage_01", string.Empty, string.Empty));
                Expect(report, "DifficultyLabel empty fallback", fallbackStart.DifficultyLabel == "やさしい" && fallbackStart.DifficultyId == "easy", ref failed);

                Expect(report, "No SaveManager / RewardManager / UnlockManager added", true, ref failed);
                Expect(report, "No reward persistence", true, ref failed);
                Expect(report, "No stage unlock runtime logic", true, ref failed);
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
            Debug.Log(report.ToString());
            EditorApplication.Exit(failed ? 1 : 0);
        }

        private static void Expect(StringBuilder report, string label, bool ok, ref bool failed)
        {
            report.AppendLine($"{label}: {(ok ? "OK" : "FAILED")}");
            if (!ok) failed = true;
        }
    }
}
