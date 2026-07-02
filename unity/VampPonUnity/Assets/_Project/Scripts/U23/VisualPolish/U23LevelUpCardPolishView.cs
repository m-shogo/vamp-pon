using UnityEngine;

namespace VampPon.UnitySpike.U23.VisualPolish
{
    public sealed class U23LevelUpCardPolishView : MonoBehaviour
    {
        [SerializeField] private string summary = "cards=3 / ink=True / icon=True / glow=True";
        public string Summary => summary;

        public void Render(U23LevelUpCardPolishState state)
        {
            summary = U23LevelUpCardPolishPresenter.BuildSummary(state);
        }
    }
}
