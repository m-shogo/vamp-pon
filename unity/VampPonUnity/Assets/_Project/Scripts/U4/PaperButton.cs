using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U4
{
    public sealed class PaperButton : MonoBehaviour, IPointerClickHandler, IPointerEnterHandler, IPointerExitHandler
    {
        private RectTransform rect;
        private Image bgImage;
        private Image borderImage;
        private TextMeshProUGUI label;
        private Vector3 baseScale;
        private float pulseTimer;
        private bool isHovered;
        private System.Action onClick;

        private static readonly Color NormalBg = new(0.94f, 0.89f, 0.82f, 0.92f);
        private static readonly Color HoverBg = new(1f, 0.94f, 0.85f, 0.96f);
        private static readonly Color NormalBorder = new(0.52f, 0.38f, 0.26f, 0.6f);
        private static readonly Color HoverBorder = new(0.72f, 0.52f, 0.28f, 0.85f);
        private static readonly Color TextColor = new(0.16f, 0.1f, 0.08f);

        public static PaperButton Create(Transform parent, string text, float width, float height, System.Action callback)
        {
            var root = new GameObject("PaperButton", typeof(RectTransform), typeof(Image), typeof(PaperButton));
            root.transform.SetParent(parent, false);
            var button = root.GetComponent<PaperButton>();
            button.rect = root.GetComponent<RectTransform>();
            button.rect.sizeDelta = new Vector2(width, height);
            button.bgImage = root.GetComponent<Image>();
            button.bgImage.color = NormalBg;
            button.onClick = callback;
            button.baseScale = Vector3.one;

            var border = new GameObject("Border", typeof(RectTransform), typeof(Image));
            border.transform.SetParent(root.transform, false);
            var borderRect = border.GetComponent<RectTransform>();
            borderRect.anchorMin = Vector2.zero;
            borderRect.anchorMax = Vector2.one;
            borderRect.offsetMin = new Vector2(2f, 2f);
            borderRect.offsetMax = new Vector2(-2f, -2f);
            button.borderImage = border.GetComponent<Image>();
            button.borderImage.color = NormalBorder;

            var labelObj = new GameObject("Label", typeof(RectTransform), typeof(TextMeshProUGUI));
            labelObj.transform.SetParent(border.transform, false);
            var labelRect = labelObj.GetComponent<RectTransform>();
            labelRect.anchorMin = Vector2.zero;
            labelRect.anchorMax = Vector2.one;
            labelRect.offsetMin = new Vector2(8f, 4f);
            labelRect.offsetMax = new Vector2(-8f, -4f);
            button.label = labelObj.GetComponent<TextMeshProUGUI>();
            button.label.text = text;
            button.label.fontSize = 16f;
            button.label.alignment = TextAlignmentOptions.Center;
            button.label.color = TextColor;
            button.label.textWrappingMode = TextWrappingModes.NoWrap;

            return button;
        }

        public void SetFont(TMP_FontAsset font)
        {
            if (label != null && font != null)
            {
                label.font = font;
            }
        }

        public void SetHovered(bool hovered)
        {
            isHovered = hovered;
            bgImage.color = hovered ? HoverBg : NormalBg;
            borderImage.color = hovered ? HoverBorder : NormalBorder;
        }

        public void Press()
        {
            pulseTimer = 0.12f;
            onClick?.Invoke();
        }

        public void OnPointerClick(PointerEventData eventData) => Press();

        public void OnPointerEnter(PointerEventData eventData) => SetHovered(true);

        public void OnPointerExit(PointerEventData eventData) => SetHovered(false);

        private void Update()
        {
            if (pulseTimer > 0f)
            {
                pulseTimer -= Time.unscaledDeltaTime;
                var t = Mathf.Clamp01(pulseTimer / 0.12f);
                var scale = 1f + Mathf.Sin(t * Mathf.PI) * 0.04f;
                rect.localScale = baseScale * scale;
            }
            else
            {
                rect.localScale = baseScale;
            }
        }
    }
}
