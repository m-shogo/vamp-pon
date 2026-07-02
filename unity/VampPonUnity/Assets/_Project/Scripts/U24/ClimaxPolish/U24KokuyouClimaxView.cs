using UnityEngine;

namespace VampPon.UnitySpike.U24.ClimaxPolish
{
    public sealed class U24KokuyouClimaxView : MonoBehaviour
    {
        [SerializeField] private string summary = "ready=True / cutin=True / active=True / ending=True";
        public string Summary => summary;
        public void Render(U24KokuyouClimaxState state) => summary = U24KokuyouClimaxPresenter.BuildSummary(state);
    }
}
