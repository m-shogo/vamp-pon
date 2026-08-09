using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.UI;
using VampPon.UnitySpike.U5;

namespace VampPon.UnitySpike.U4
{
    public sealed class PaperCard : MonoBehaviour, IPointerClickHandler, IPointerEnterHandler, IPointerExitHandler
    {
        private RectTransform rect;
        private Image bgImage;
        private Image innerBorderImage;
        private Image glowImage;
        private Sprite baseSprite;
        private TextMeshProUGUI nameLabel;
        private TextMeshProUGUI descLabel;
        private TextMeshProUGUI typeLabel;
        private TextMeshProUGUI levelLabel;
        private U4LevelUpChoice choiceData;
        private Vector3 baseScale;
        private float selectPulseTimer;
        private bool isSelected;
        private bool isHovered;
        private int cardIndex;

        private static readonly Color NormalCardBg = new(0.96f, 0.92f, 0.86f, 0.94f);
        private static readonly Color SelectedCardBg = new(1f, 0.96f, 0.88f, 0.98f);
        private static readonly Color HoveredCardBg = new(0.98f, 0.94f, 0.88f, 0.96f);
        private static readonly Color NormalBorder = new(0.48f, 0.36f, 0.24f, 0.45f);
        private static readonly Color GoodBorder = new(0.52f, 0.68f, 0.42f, 0.55f);
        private static readonly Color RareBorder = new(0.82f, 0.58f, 0.28f, 0.7f);
        private static readonly Color RareGlow = new(1f, 0.72f, 0.28f, 0.18f);
        private static readonly Color AwakeningBorder = new(0.65f, 0.45f, 0.78f, 0.7f);
        private static readonly Color AwakeningGlow = new(0.72f, 0.48f, 0.88f, 0.15f);
        private static readonly Color NameColor = new(0.14f, 0.09f, 0.07f);
        private static readonly Color DescColor = new(0.32f, 0.24f, 0.2f);
        private static readonly Color TypeColor = new(0.52f, 0.4f, 0.32f);

        private System.Action<int> onClicked;

        public U4LevelUpChoice ChoiceData => choiceData;
        public int CardIndex => cardIndex;

        public void SetClickCallback(System.Action<int> callback) => onClicked = callback;

        public static PaperCard Create(Transform parent, U4LevelUpChoice choice, int index, float width, float height, TMP_FontAsset font)
        {
            var root = new GameObject($"PaperCard_{index}", typeof(RectTransform), typeof(Image), typeof(PaperCard));
            root.transform.SetParent(parent, false);

            var card = root.GetComponent<PaperCard>();
            card.rect = root.GetComponent<RectTransform>();
            card.rect.sizeDelta = new Vector2(Mathf.Max(width, AppQualityTapTargets.Minimum), Mathf.Max(height, AppQualityTapTargets.Minimum));
            card.choiceData = choice;
            card.cardIndex = index;
            card.baseScale = Vector3.one;

            card.bgImage = root.GetComponent<Image>();
            card.baseSprite = AppQualityAssetProvider.LevelUpCardFor(choice.Rarity == U4ItemRarity.Rare, choice.IsAwakeningGate)
                              ?? U5VisualAssetLibrary.LoadUiSprite("u5-paper-panel");
            card.bgImage.sprite = card.baseSprite;
            card.bgImage.type = card.bgImage.sprite != null ? Image.Type.Sliced : Image.Type.Simple;
            card.bgImage.color = card.bgImage.sprite != null ? Color.white : NormalCardBg;

            var borderColor = choice.Rarity switch
            {
                U4ItemRarity.Good => GoodBorder,
                U4ItemRarity.Rare => choice.IsAwakeningGate ? AwakeningBorder : RareBorder,
                _ => NormalBorder,
            };

            var innerBorder = new GameObject("InnerBorder", typeof(RectTransform), typeof(Image));
            innerBorder.transform.SetParent(root.transform, false);
            var ibRect = innerBorder.GetComponent<RectTransform>();
            ibRect.anchorMin = Vector2.zero;
            ibRect.anchorMax = Vector2.one;
            ibRect.offsetMin = new Vector2(6f, 6f);
            ibRect.offsetMax = new Vector2(-6f, -6f);
            card.innerBorderImage = innerBorder.GetComponent<Image>();
            card.innerBorderImage.color = borderColor;

            var contentArea = new GameObject("Content", typeof(RectTransform));
            contentArea.transform.SetParent(innerBorder.transform, false);
            var contentRect = contentArea.GetComponent<RectTransform>();
            contentRect.anchorMin = Vector2.zero;
            contentRect.anchorMax = Vector2.one;
            contentRect.offsetMin = new Vector2(10f, 8f);
            contentRect.offsetMax = new Vector2(-10f, -8f);
            var contentBg = contentArea.AddComponent<Image>();
            contentBg.color = new Color(0.96f, 0.9f, 0.78f, card.bgImage.sprite != null ? 0.12f : 0.92f);

            if (choice.Rarity == U4ItemRarity.Rare || choice.IsAwakeningGate)
            {
                var glow = new GameObject("Glow", typeof(RectTransform), typeof(Image));
                glow.transform.SetParent(root.transform, false);
                glow.transform.SetAsFirstSibling();
                var glowRect = glow.GetComponent<RectTransform>();
                glowRect.anchorMin = Vector2.zero;
                glowRect.anchorMax = Vector2.one;
                glowRect.offsetMin = new Vector2(-6f, -6f);
                glowRect.offsetMax = new Vector2(6f, 6f);
                card.glowImage = glow.GetComponent<Image>();
                card.glowImage.color = choice.IsAwakeningGate ? AwakeningGlow : RareGlow;
                card.glowImage.raycastTarget = false;
            }

            var iconFrame = IconFrame.Create(contentArea.transform, choice.ItemType, 40f);
            iconFrame.anchorMin = new Vector2(0.5f, 1f);
            iconFrame.anchorMax = new Vector2(0.5f, 1f);
            iconFrame.pivot = new Vector2(0.5f, 1f);
            iconFrame.anchoredPosition = new Vector2(0f, -8f);

            card.typeLabel = CreateLabel(contentArea.transform, choice.TypeLabelJa, 11f, TypeColor,
                new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -50f), new Vector2(width - 34f, 14f), font);

            card.nameLabel = CreateLabel(contentArea.transform, choice.NameJa, 17f, NameColor,
                new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -66f), new Vector2(width - 34f, 22f), font);

            card.descLabel = CreateLabel(contentArea.transform, choice.DescriptionJa, 11f, DescColor,
                new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -92f), new Vector2(width - 34f, 62f), font);
            if (card.descLabel != null)
            {
                card.descLabel.textWrappingMode = TextWrappingModes.Normal;
                card.descLabel.overflowMode = TextOverflowModes.Ellipsis;
            }

            var rarityText = choice.Rarity switch
            {
                U4ItemRarity.Good => "Good",
                U4ItemRarity.Rare => choice.IsAwakeningGate ? "覚醒" : "Rare",
                _ => "",
            };

            if (!string.IsNullOrEmpty(rarityText))
            {
                var rarityColor = choice.Rarity switch
                {
                    U4ItemRarity.Good => new Color(0.38f, 0.62f, 0.35f),
                    _ => choice.IsAwakeningGate ? new Color(0.6f, 0.38f, 0.72f) : new Color(0.78f, 0.52f, 0.22f),
                };
                CreateLabel(contentArea.transform, rarityText, 10f, rarityColor,
                    new Vector2(1f, 0f), new Vector2(1f, 0f), new Vector2(-8f, 8f), new Vector2(48f, 14f), font);
            }

            if (choice.Level > 0 && !choice.IsAwakeningGate)
            {
                card.levelLabel = CreateLabel(contentArea.transform, $"Lv.{choice.Level}", 10f, TypeColor,
                    new Vector2(0f, 0f), new Vector2(0f, 0f), new Vector2(8f, 8f), new Vector2(36f, 14f), font);
            }

            return card;
        }

        public void SetSelected(bool selected)
        {
            isSelected = selected;
            var reducedMotion = IsReducedMotion();
            if (selected && !reducedMotion)
                selectPulseTimer = 0.15f;
            else
                selectPulseTimer = 0f;

            if (choiceData.Rarity != U4ItemRarity.Rare && !choiceData.IsAwakeningGate)
            {
                var selectedSprite = VisualBatchAssetProvider.LevelUpCardSelected;
                bgImage.sprite = selected && selectedSprite != null ? selectedSprite : baseSprite;
                bgImage.type = bgImage.sprite != null ? Image.Type.Sliced : Image.Type.Simple;
            }

            bgImage.color = bgImage.sprite != null
                ? (selected ? new Color(1f, 0.97f, 0.9f, 1f) : Color.white)
                : (selected ? SelectedCardBg : (isHovered ? HoveredCardBg : NormalCardBg));

            if (reducedMotion)
                rect.localScale = Vector3.one;
        }

        public void SetHovered(bool hovered)
        {
            isHovered = hovered;
            if (!isSelected)
            {
                bgImage.color = bgImage.sprite != null
                    ? (hovered ? new Color(1f, 0.96f, 0.88f, 1f) : Color.white)
                    : (hovered ? HoveredCardBg : NormalCardBg);
                rect.localScale = hovered && !IsReducedMotion() ? baseScale * 1.02f : baseScale;
            }
        }

        public void SetDimmed(bool dimmed)
        {
            var group = gameObject.GetComponent<CanvasGroup>();
            if (group == null)
                group = gameObject.AddComponent<CanvasGroup>();
            group.alpha = dimmed ? 0.45f : 1f;
        }

        private void Update()
        {
            var reducedMotion = IsReducedMotion();
            if (selectPulseTimer > 0f && !reducedMotion)
            {
                selectPulseTimer -= Time.unscaledDeltaTime;
                var t = Mathf.Clamp01(selectPulseTimer / 0.15f);
                var scale = 1f + Mathf.Sin(t * Mathf.PI) * 0.035f;
                rect.localScale = baseScale * scale;
            }
            else if (isSelected)
            {
                rect.localScale = reducedMotion ? baseScale : baseScale * 1.025f;
            }

            if (glowImage != null && (choiceData.Rarity == U4ItemRarity.Rare || choiceData.IsAwakeningGate))
            {
                var baseColor = choiceData.IsAwakeningGate ? AwakeningGlow : RareGlow;
                var alpha = reducedMotion
                    ? baseColor.a * 0.72f
                    : Mathf.Lerp(baseColor.a * 0.62f, baseColor.a, Mathf.PerlinNoise(cardIndex * 2.17f + 1.3f, Time.unscaledTime * 0.24f));
                glowImage.color = new Color(baseColor.r, baseColor.g, baseColor.b, alpha);
            }
        }

        public void OnPointerClick(PointerEventData eventData)
        {
            U43RuntimeFeedbackBridge.PlayButtonTapIfAvailable();
            onClicked?.Invoke(cardIndex);
        }

        public void OnPointerEnter(PointerEventData eventData)
        {
            if (!isSelected) SetHovered(true);
        }

        public void OnPointerExit(PointerEventData eventData)
        {
            if (!isSelected) SetHovered(false);
        }

        private static bool IsReducedMotion() =>
            PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
            PlayerPrefs.GetInt("reduce_motion", 0) == 1;

        private static TextMeshProUGUI CreateLabel(Transform parent, string text, float fontSize, Color color,
            Vector2 anchorMin, Vector2 anchorMax, Vector2 anchoredPos, Vector2 size, TMP_FontAsset font)
        {
            var obj = new GameObject("Label", typeof(RectTransform), typeof(TextMeshProUGUI));
            obj.transform.SetParent(parent, false);
            var r = obj.GetComponent<RectTransform>();
            r.anchorMin = anchorMin;
            r.anchorMax = anchorMax;
            r.pivot = new Vector2(0.5f, 1f);
            r.anchoredPosition = anchoredPos;
            r.sizeDelta = size;
            var tmp = obj.GetComponent<TextMeshProUGUI>();
            tmp.text = text;
            tmp.fontSize = fontSize;
            tmp.color = color;
            tmp.alignment = TextAlignmentOptions.Center;
            tmp.textWrappingMode = TextWrappingModes.NoWrap;
            tmp.overflowMode = TextOverflowModes.Ellipsis;
            AppQualityUiFactory.FitText(tmp, Mathf.Max(8f, fontSize - 4f));
            if (font != null)
                tmp.font = font;
            return tmp;
        }
    }
}
