using TMPro;
using UnityEngine;

namespace VampPon.UnitySpike.U11.Common
{
    public sealed class PaperLabelProof : MonoBehaviour
    {
        public TextMeshProUGUI Label { get; private set; }

        public static PaperLabelProof Create(
            Transform parent,
            string name,
            string text,
            TMP_FontAsset font,
            float fontSize,
            Color color,
            TextAlignmentOptions alignment = TextAlignmentOptions.Center,
            bool wrap = false)
        {
            var root = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI), typeof(PaperLabelProof));
            root.transform.SetParent(parent, false);
            var proof = root.GetComponent<PaperLabelProof>();
            proof.Label = root.GetComponent<TextMeshProUGUI>();
            proof.Label.font = font;
            proof.Label.text = text;
            proof.Label.fontSize = fontSize;
            proof.Label.color = color;
            proof.Label.alignment = alignment;
            proof.Label.textWrappingMode = wrap ? TextWrappingModes.Normal : TextWrappingModes.NoWrap;
            proof.Label.overflowMode = TextOverflowModes.Ellipsis;
            proof.Label.raycastTarget = false;
            return proof;
        }
    }
}
