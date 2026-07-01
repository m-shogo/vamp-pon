using TMPro;
using UnityEngine;

namespace VampPon.UnitySpike.U13.StageSelect
{
    public sealed class StageInfoPanelView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI stageNameLabel;
        [SerializeField] private TextMeshProUGUI difficultyLabel;
        [SerializeField] private TextMeshProUGUI stateLabel;

        public void Bind(StageInfoViewModel viewModel)
        {
            var labels = GetComponentsInChildren<TextMeshProUGUI>();
            if (stageNameLabel == null && labels.Length > 0) stageNameLabel = labels[0];
            if (difficultyLabel == null && labels.Length > 1) difficultyLabel = labels[1];
            if (stateLabel == null && labels.Length > 2) stateLabel = labels[2];

            if (stageNameLabel != null) stageNameLabel.text = viewModel.SelectedStageTitle;
            if (difficultyLabel != null) difficultyLabel.text = viewModel.DifficultyLabel;
            if (stateLabel != null) stateLabel.text = viewModel.StateLabel;
        }
    }
}
