using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    internal static class U46ScreenFactory
    {
        internal static GameObject Panel(Transform parent, string name, Vector2 min, Vector2 max, Sprite sprite, Color fallback)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            var rect = obj.GetComponent<RectTransform>();
            rect.anchorMin = min; rect.anchorMax = max; rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;
            AppQualityUiFactory.ApplyCandidate(obj.GetComponent<Image>(), sprite, fallback);
            return obj;
        }

        internal static TextMeshProUGUI Label(Transform parent, string name, string text, float size, Color color, Vector2 min, Vector2 max, TextAlignmentOptions alignment, TMP_FontAsset font)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI));
            obj.transform.SetParent(parent, false);
            var rect = obj.GetComponent<RectTransform>();
            rect.anchorMin = min; rect.anchorMax = max; rect.offsetMin = new Vector2(8f, 4f); rect.offsetMax = new Vector2(-8f, -4f);
            var label = obj.GetComponent<TextMeshProUGUI>();
            label.text = text; label.fontSize = size; label.color = color; label.alignment = alignment;
            label.textWrappingMode = TextWrappingModes.Normal; label.overflowMode = TextOverflowModes.Ellipsis;
            if (font != null) label.font = font;
            AppQualityUiFactory.FitText(label, Mathf.Max(11f, size - 6f));
            return label;
        }

        internal static Button Button(Transform parent, string name, string text, Sprite sprite, Vector2 min, Vector2 max, TMP_FontAsset font, Action onClick)
        {
            var obj = Panel(parent, name, min, max, sprite, new Color(0.78f, 0.65f, 0.43f, 1f));
            var button = obj.AddComponent<Button>();
            button.transition = Selectable.Transition.ColorTint;
            button.onClick.AddListener(() => onClick?.Invoke());
            Label(obj.transform, "Label", text, 17f, new Color(0.08f, 0.06f, 0.06f), Vector2.zero, Vector2.one, TextAlignmentOptions.Center, font).raycastTarget = false;
            return button;
        }

        internal static Image Decoration(Transform parent, string name, Sprite sprite, Vector2 anchor, Vector2 size, Vector2 position)
        {
            var image = AppQualityUiFactory.CreateDecorativeImage(parent, name, sprite, anchor, size, position, Color.clear);
            image.preserveAspect = true;
            return image;
        }
    }
}
