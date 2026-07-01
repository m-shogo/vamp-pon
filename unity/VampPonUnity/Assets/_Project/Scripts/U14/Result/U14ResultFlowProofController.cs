using UnityEngine;
using VampPon.UnitySpike.U13.Flow;
using VampPon.UnitySpike.U13.Result;
using VampPon.UnitySpike.U14.Flow;
using VampPon.UnitySpike.U15.Mappers;

namespace VampPon.UnitySpike.U14.Result
{
    public sealed class U14ResultFlowProofController : MonoBehaviour, IResultActionHandler
    {
        private U14ProofSceneRouter router;

        public BattleResultSummaryProof Summary { get; private set; }
        public ResultViewModel ViewModel { get; private set; } = ResultViewModel.Sample;

        public void Configure(BattleResultSummaryProof summary, U14ProofSceneRouter proofRouter)
        {
            Summary = summary;
            ViewModel = summary.ToResultViewModel();
            router = proofRouter;
        }

        public void OnContinueToStageSelectRequested()
        {
            Debug.Log("U14 Result continue requested");
            U14FlowState.SetResult(Summary ?? new BattleResultSummaryProof());
            var contract = U14ToU15ContractMapper.ToBattleResultSummary(Summary);
            var stageSelect = StageSelectPresentationMapper.FromSample(contract);
            Debug.Log($"U15 presentation mapped StageSelectPresentationModel: {stageSelect.LastResultLabel}");
            router?.GoToStageSelect();
        }

        public void TriggerContinueProof()
        {
            OnContinueToStageSelectRequested();
        }
    }
}
