using TMPro;
using UnityEngine;

namespace VampPon.UnitySpike.U13.Result
{
    public sealed class ResultStatsLineView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI[] labels;

        public void Bind(ResultViewModel viewModel)
        {
            if (labels == null || labels.Length == 0)
            {
                labels = GetComponentsInChildren<TextMeshProUGUI>();
            }

            var stats = viewModel.StatLabels;
            for (var i = 0; i < labels.Length && i < stats.Length; i++)
            {
                labels[i].text = stats[i];
            }
        }
    }
}
