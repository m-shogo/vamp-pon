using UnityEngine;
using VampPon.UnitySpike.U14.Flow;
using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U15.Mappers;

namespace VampPon.UnitySpike.U16.Battle
{
    public sealed class U16BattleResultHookProofController : MonoBehaviour
    {
        public BattleSessionStats LastStats { get; private set; }
        public BattleResultSummary LastSummary { get; private set; }
        public ResultPresentationModel LastPresentation { get; private set; }
        public StageSelectPresentationModel LastStageSelectPresentation { get; private set; }

        public BattleResultSummary BuildSummaryFromU14Proof(BattleStartRequestProof request)
        {
            LastStats = U16BattleStatsProofAdapter.FromU14Proof(request);
            LastSummary = BattleResultSummaryBuilder.FromStats(LastStats);
            LastPresentation = BattleResultToPresentationMapper.ToResultPresentationModel(LastSummary);
            LastStageSelectPresentation = StageSelectPresentationMapper.FromSample(LastSummary);
            Debug.Log($"U16 Battle Result Hook: {LastSummary.StageId} / Rank {LastSummary.Rank} / {LastPresentation.FragmentLabel}");
            Debug.Log($"U16 StageSelect return label: {LastStageSelectPresentation.LastResultLabel}");
            return LastSummary;
        }
    }
}
