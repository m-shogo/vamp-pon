using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U4
{
    public static class IconFrame
    {
        private static readonly Color WeaponColor = new(0.92f, 0.68f, 0.32f);
        private static readonly Color PassiveColor = new(0.42f, 0.82f, 0.78f);
        private static readonly Color SpecialColor = new(0.85f, 0.55f, 0.82f);

        public static RectTransform Create(Transform parent, U4ItemType itemType, float size)
        {
            var root = new GameObject("IconFrame", typeof(RectTransform), typeof(Image));
            root.transform.SetParent(parent, false);
            var rect = root.GetComponent<RectTransform>();
            rect.sizeDelta = new Vector2(size, size);

            var bg = root.GetComponent<Image>();
            bg.color = new Color(0.12f, 0.08f, 0.07f, 0.55f);

            var border = new GameObject("IconBorder", typeof(RectTransform), typeof(Image));
            border.transform.SetParent(root.transform, false);
            var borderRect = border.GetComponent<RectTransform>();
            borderRect.anchorMin = Vector2.zero;
            borderRect.anchorMax = Vector2.one;
            borderRect.offsetMin = new Vector2(1.5f, 1.5f);
            borderRect.offsetMax = new Vector2(-1.5f, -1.5f);
            var borderImage = border.GetComponent<Image>();
            borderImage.color = new Color(0.22f, 0.16f, 0.12f, 0.65f);

            var color = itemType switch
            {
                U4ItemType.Weapon => WeaponColor,
                U4ItemType.Passive => PassiveColor,
                _ => SpecialColor,
            };

            var symbol = new GameObject("Symbol", typeof(RectTransform), typeof(Image));
            symbol.transform.SetParent(root.transform, false);
            var symbolRect = symbol.GetComponent<RectTransform>();
            var innerSize = size * 0.45f;
            symbolRect.sizeDelta = new Vector2(innerSize, innerSize);
            var symbolImage = symbol.GetComponent<Image>();
            symbolImage.color = color;

            if (itemType == U4ItemType.Weapon)
            {
                symbolRect.localRotation = Quaternion.Euler(0f, 0f, 45f);
            }

            return rect;
        }
    }
}
