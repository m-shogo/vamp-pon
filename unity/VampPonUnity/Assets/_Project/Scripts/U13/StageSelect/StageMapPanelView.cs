using UnityEngine;

namespace VampPon.UnitySpike.U13.StageSelect
{
    public sealed class StageMapPanelView : MonoBehaviour
    {
        [SerializeField] private bool safeAreaReviewRequired = true;
        public bool SafeAreaReviewRequired => safeAreaReviewRequired;
    }
}
