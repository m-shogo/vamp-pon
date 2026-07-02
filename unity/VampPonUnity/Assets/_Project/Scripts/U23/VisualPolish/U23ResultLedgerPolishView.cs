using UnityEngine;

namespace VampPon.UnitySpike.U23.VisualPolish
{
    public sealed class U23ResultLedgerPolishView : MonoBehaviour
    {
        [SerializeField] private string summary = "rank=A / seal=True / rewards=3";
        public string Summary => summary;

        public void Render(U23ResultLedgerPolishState state)
        {
            summary = U23ResultRewardPolishPresenter.BuildSummary(state);
        }
    }
}
