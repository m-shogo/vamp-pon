using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U11.Common
{
    public sealed class PaperButtonProof : MonoBehaviour
    {
        public Image Background { get; private set; }
        public TextMeshProUGUI Label { get; private set; }

        public static PaperButtonProof Create(
            Transform parent,
            string name,
            Sprite sprite,
            string text,
            TMP_FontAsset font,
            Color textColor,
            float fontSize)
        {
            var root = new GameObject(name, typeof(RectTransform), typeof(Image), typeof(PaperButtonProof));
            root.transform.SetParent(parent, false);
            var proof = root.GetComponent<PaperButtonProof>();
            proof.Background = root.GetComponent<Image>();
            proof.Background.sprite = sprite;
            proof.Background.color = Color.white;
            proof.Background.preserveAspect = true;
            proof.Background.raycastTarget = false;

            var label = PaperLabelProof.Create(root.transform, "PaperButtonLabel", text, font, fontSize, textColor);
            var labelRect = label.GetComponent<RectTransform>();
            labelRect.anchorMin = Vector2.zero;
            labelRect.anchorMax = Vector2.one;
            labelRect.offsetMin = new Vector2(10f, 6f);
            labelRect.offsetMax = new Vector2(-10f, -6f);
            proof.Label = label.Label;
            return proof;
        }
    }
}
