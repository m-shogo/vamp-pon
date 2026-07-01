using UnityEngine;
using VampPon.UnitySpike.U14.Flow;

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
            return LastSummary;
        }

        public void GoToResultProof()
        {
            router?.GoToResult(CreateSummaryProof());
        }
    }
}
