using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U13.StageSelect
{
    public sealed class StageRouteNodeView : MonoBehaviour
    {
        [SerializeField] private Image image;
        [SerializeField] private StageNodeVisualState visualState;

        public void Bind(StageNodeViewModel viewModel)
        {
            visualState = viewModel.VisualState;
            if (image == null)
            {
                image = GetComponent<Image>();
            }

            if (image != null)
            {
                image.color = visualState == StageNodeVisualState.Active
                    ? Color.white
                    : new Color(0.58f, 0.53f, 0.48f, 0.92f);
            }
        }
    }
}
