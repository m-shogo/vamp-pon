using TMPro;
using UnityEngine;

namespace VampPon.UnitySpike.U14.Battle
{
    public sealed class U14BattleFlowProofView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI[] labels;

        public void SetLines(params string[] lines)
        {
            if (labels == null || labels.Length == 0)
            {
                labels = GetComponentsInChildren<TextMeshProUGUI>();
            }

            for (var i = 0; i < labels.Length && i < lines.Length; i++)
            {
                labels[i].text = lines[i];
            }
        }
    }
}
