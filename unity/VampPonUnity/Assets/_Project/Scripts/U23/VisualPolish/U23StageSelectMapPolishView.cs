using UnityEngine;

namespace VampPon.UnitySpike.U23.VisualPolish
{
    public sealed class U23StageSelectMapPolishView : MonoBehaviour
    {
        [SerializeField] private string summary = "route=True / active=True / locked=True / stamp=True";
        public string Summary => summary;

        public void Render(U23StageSelectMapPolishState state)
        {
            summary = U23StageRouteNodePolishPresenter.BuildSummary(state);
        }
    }
}
