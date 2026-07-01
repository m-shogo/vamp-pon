using UnityEngine;
using VampPon.UnitySpike.U13.Flow;
using VampPon.UnitySpike.U13.StageSelect;
using VampPon.UnitySpike.U14.Flow;

namespace VampPon.UnitySpike.U14.StageSelect
{
    public sealed class U14StageSelectFlowProofController : MonoBehaviour, IStageSelectActionHandler
    {
        private U14ProofSceneRouter router;

        public StageSelectViewModel ViewModel { get; private set; } = StageSelectViewModel.Sample;
        public BattleStartRequestProof LastRequest { get; private set; }

        public void Configure(U14ProofSceneRouter proofRouter)
        {
            router = proofRouter;
        }

        public void OnStartBattleRequested(string stageId)
        {
            LastRequest = new BattleStartRequestProof(stageId, ViewModel.Info.DifficultyLabel, "proof-start");
            Debug.Log($"U14 StageSelect start requested: {LastRequest.SelectedStageId} / {LastRequest.SelectedDifficulty}");
            router?.GoToBattle(LastRequest);
        }

        public void TriggerStartProof()
        {
            OnStartBattleRequested("stage_01");
        }
    }
}
