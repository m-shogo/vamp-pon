using TMPro;
using UnityEngine;

namespace VampPon.UnitySpike.U13.Result
{
    public sealed class ResultRewardCardView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI label;

        public void Bind(ResultRewardCardViewModel viewModel)
        {
            if (label == null)
            {
                label = GetComponentInChildren<TextMeshProUGUI>();
            }

            if (label != null)
            {
                label.text = viewModel.Label;
            }
        }
    }
}
