using TMPro;
using UnityEngine;

namespace VampPon.UnitySpike.U13.Common
{
    public sealed class PaperLabelView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI label;

        public void SetText(string text)
        {
            if (label == null)
            {
                label = GetComponent<TextMeshProUGUI>();
            }

            if (label != null)
            {
                label.text = text;
            }
        }
    }
}
