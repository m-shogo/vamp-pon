using UnityEngine;
using VampPon.UnitySpike.U14.Flow;
using VampPon.UnitySpike.U15.Mappers;

namespace VampPon.UnitySpike.U14.Battle
{
    public sealed class U14BattleFlowProofController : MonoBehaviour
    {
        private U14ProofSceneRouter router;

        public BattleStartRequestProof Request { get; private set; } = BattleStartRequestProof.Sample;
        public BattleResultSummaryProof LastSummary { get; private set; }

        public void Configure(BattleStartRequestProof request, U14ProofSceneRouter proofRouter)
        {
            Request = request;
            router = proofRouter;
        }

        public BattleResultSummaryProof CreateSummaryProof()
        {
            LastSummary = BattleResultSummaryProof.FromRequest(Request);
            Debug.Log($"U14 Battle proof summary created: {LastSummary.StageId}");
            var contract = U14ToU15ContractMapper.ToBattleResultSummary(LastSummary);
            var presentation = BattleResultToPresentationMapper.ToResultPresentationModel(contract);
            Debug.Log($"U15 contract mapped BattleResultSummary: {contract.ClearState} / Rank {contract.Rank} / fragments {contract.Fragments}");
            Debug.Log($"U15 presentation mapped ResultPresentationModel: {presentation.Title} / Rank {presentation.Rank}");
            return LastSummary;
        }

        public void GoToResultProof()
        {
            router?.GoToResult(CreateSummaryProof());
        }
    }
}
