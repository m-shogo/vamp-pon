using UnityEngine;

namespace VampPon.UnitySpike.U21.VerticalSlice
{
    public sealed class U21Stage1VerticalSliceView : MonoBehaviour
    {
        [SerializeField] private string flowLabel = "U21: not started";
        [SerializeField] private string statsLabel = "stats pending";
        [SerializeField] private string proofNote = "Vertical Slice Integration / productionApproved=0";

        public string FlowLabel => flowLabel;
        public string StatsLabel => statsLabel;
        public string ProofNote => proofNote;

        public void Render(U21Stage1VerticalSliceState state)
        {
            flowLabel = U21Stage1VerticalSlicePresenter.BuildFlowLabel(state);
            statsLabel = U21Stage1VerticalSlicePresenter.BuildStatsLabel(state);
            proofNote = state?.LastProofNote ?? proofNote;
        }
    }
}
