using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI
{
    public static class AppQualityUiFactory
    {
        public static Image ApplyCandidate(Image image, Sprite sprite, Color fallbackColor, Image.Type imageType = Image.Type.Sliced)
        {
            image.sprite = sprite;
            image.type = sprite != null ? ResolveImageType(sprite, imageType) : Image.Type.Simple;
            image.color = sprite != null ? Color.white : fallbackColor;
            return image;
        }

        public static bool SupportsSlicing(Sprite sprite)
        {
            return sprite != null && sprite.border.sqrMagnitude > 0.01f;
        }

        public static Image.Type ResolveImageType(Sprite sprite, Image.Type requested)
        {
            if (requested == Image.Type.Sliced && !SupportsSlicing(sprite))
            {
                return Image.Type.Simple;
            }

            return requested;
        }

        public static UiVisualStateView AttachVisualState(
            GameObject root,
            Image background,
            Image border = null,
            CanvasGroup group = null,
            UiVisualState initialState = UiVisualState.Normal)
        {
            var view = root.GetComponent<UiVisualStateView>() ?? root.AddComponent<UiVisualStateView>();
            view.Bind(background, border, group);
            view.Apply(initialState);
            return view;
        }

        public static Image CreateDecorativeImage(
            Transform parent,
            string name,
            Sprite sprite,
            Vector2 anchor,
            Vector2 size,
            Vector2 anchoredPosition,
            Color fallbackColor)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            var rect = obj.GetComponent<RectTransform>();
            rect.anchorMin = anchor;
            rect.anchorMax = anchor;
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.sizeDelta = size;
            rect.anchoredPosition = anchoredPosition;
            var image = obj.GetComponent<Image>();
            image.raycastTarget = false;
            return ApplyCandidate(image, sprite, fallbackColor);
        }

        public static TextMeshProUGUI FitText(TextMeshProUGUI label, float minSize)
        {
            label.enableAutoSizing = true;
            label.fontSizeMin = minSize;
            label.fontSizeMax = label.fontSize;
            return label;
        }
    }
}
