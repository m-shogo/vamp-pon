using TMPro;
using UnityEngine;

namespace VampPon.UnitySpike.U13.Common
{
    public sealed class MemoryCardView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI label;

        public void Bind(string text)
        {
            if (label == null)
            {
                label = GetComponentInChildren<TextMeshProUGUI>();
            }

            if (label != null)
            {
                label.text = text;
            }
        }
    }
}
