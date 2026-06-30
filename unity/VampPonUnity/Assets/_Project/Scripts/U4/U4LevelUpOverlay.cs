using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.U4
{
    public sealed class U4LevelUpOverlay : MonoBehaviour
    {
        private Canvas canvas;
        private CanvasGroup overlayGroup;
        private RectTransform cardContainer;
        private PaperCard[] cards;
        private PaperButton confirmButton;
        private TextMeshProUGUI titleLabel;
        private TMP_FontAsset japaneseFont;
        private int hoveredIndex = -1;
        private int selectedIndex = -1;
        private float fadeTimer;
        private float fadeOutTimer;
        private bool isClosing;
        private System.Action<U4LevelUpChoice> onChoiceConfirmed;

        public bool IsActive => gameObject.activeSelf && !isClosing;

        public static U4LevelUpOverlay Create(Transform parent, TMP_FontAsset font)
        {
            var root = new GameObject("U4LevelUpOverlay", typeof(RectTransform), typeof(Canvas),
                typeof(CanvasScaler), typeof(GraphicRaycaster), typeof(CanvasGroup), typeof(U4LevelUpOverlay));
            root.transform.SetParent(parent, false);

            var overlay = root.GetComponent<U4LevelUpOverlay>();
            overlay.japaneseFont = font;

            overlay.canvas = root.GetComponent<Canvas>();
            overlay.canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            overlay.canvas.sortingOrder = 100;

            var scaler = root.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(390f, 844f);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;

            overlay.overlayGroup = root.GetComponent<CanvasGroup>();
            overlay.overlayGroup.alpha = 0f;

            var dimBg = new GameObject("DimBackground", typeof(RectTransform), typeof(Image));
            dimBg.transform.SetParent(root.transform, false);
            var dimRect = dimBg.GetComponent<RectTransform>();
            dimRect.anchorMin = Vector2.zero;
            dimRect.anchorMax = Vector2.one;
            dimRect.offsetMin = Vector2.zero;
            dimRect.offsetMax = Vector2.zero;
            dimBg.GetComponent<Image>().color = new Color(0.02f, 0.015f, 0.015f, 0.72f);

            var panel = new GameObject("Panel", typeof(RectTransform), typeof(Image));
            panel.transform.SetParent(root.transform, false);
            var panelRect = panel.GetComponent<RectTransform>();
            panelRect.anchorMin = new Vector2(0.05f, 0.12f);
            panelRect.anchorMax = new Vector2(0.95f, 0.88f);
            panelRect.offsetMin = Vector2.zero;
            panelRect.offsetMax = Vector2.zero;
            panel.GetComponent<Image>().color = new Color(0.08f, 0.055f, 0.05f, 0.88f);

            var innerPanel = new GameObject("InnerPanel", typeof(RectTransform), typeof(Image));
            innerPanel.transform.SetParent(panel.transform, false);
            var innerRect = innerPanel.GetComponent<RectTransform>();
            innerRect.anchorMin = Vector2.zero;
            innerRect.anchorMax = Vector2.one;
            innerRect.offsetMin = new Vector2(4f, 4f);
            innerRect.offsetMax = new Vector2(-4f, -4f);
            innerPanel.GetComponent<Image>().color = new Color(0.12f, 0.085f, 0.07f, 0.75f);

            var titleObj = new GameObject("Title", typeof(RectTransform), typeof(TextMeshProUGUI));
            titleObj.transform.SetParent(innerPanel.transform, false);
            var titleRect = titleObj.GetComponent<RectTransform>();
            titleRect.anchorMin = new Vector2(0.5f, 1f);
            titleRect.anchorMax = new Vector2(0.5f, 1f);
            titleRect.pivot = new Vector2(0.5f, 1f);
            titleRect.anchoredPosition = new Vector2(0f, -16f);
            titleRect.sizeDelta = new Vector2(300f, 36f);
            overlay.titleLabel = titleObj.GetComponent<TextMeshProUGUI>();
            overlay.titleLabel.text = "記憶がよみがえる";
            overlay.titleLabel.fontSize = 22f;
            overlay.titleLabel.alignment = TextAlignmentOptions.Center;
            overlay.titleLabel.color = new Color(0.96f, 0.86f, 0.62f);
            if (font != null) overlay.titleLabel.font = font;

            var subtitle = new GameObject("Subtitle", typeof(RectTransform), typeof(TextMeshProUGUI));
            subtitle.transform.SetParent(innerPanel.transform, false);
            var subRect = subtitle.GetComponent<RectTransform>();
            subRect.anchorMin = new Vector2(0.5f, 1f);
            subRect.anchorMax = new Vector2(0.5f, 1f);
            subRect.pivot = new Vector2(0.5f, 1f);
            subRect.anchoredPosition = new Vector2(0f, -50f);
            subRect.sizeDelta = new Vector2(280f, 20f);
            var subTmp = subtitle.GetComponent<TextMeshProUGUI>();
            subTmp.text = "ひとつ選んでください";
            subTmp.fontSize = 14f;
            subTmp.alignment = TextAlignmentOptions.Center;
            subTmp.color = new Color(0.72f, 0.62f, 0.5f);
            if (font != null) subTmp.font = font;

            overlay.cardContainer = new GameObject("CardContainer", typeof(RectTransform)).GetComponent<RectTransform>();
            overlay.cardContainer.SetParent(innerPanel.transform, false);
            overlay.cardContainer.anchorMin = new Vector2(0.5f, 0.5f);
            overlay.cardContainer.anchorMax = new Vector2(0.5f, 0.5f);
            overlay.cardContainer.pivot = new Vector2(0.5f, 0.5f);
            overlay.cardContainer.anchoredPosition = new Vector2(0f, 10f);
            overlay.cardContainer.sizeDelta = new Vector2(340f, 400f);

            root.SetActive(false);
            return overlay;
        }

        public void Show(U4LevelUpChoice[] choices, System.Action<U4LevelUpChoice> callback)
        {
            onChoiceConfirmed = callback;
            selectedIndex = -1;
            hoveredIndex = 0;
            isClosing = false;
            fadeTimer = 0f;
            fadeOutTimer = 0f;

            ClearCards();

            var cardWidth = 290f;
            var cardHeight = 148f;
            var spacing = 12f;
            var totalHeight = choices.Length * cardHeight + (choices.Length - 1) * spacing;
            var startY = totalHeight * 0.5f;

            cards = new PaperCard[choices.Length];
            for (var i = 0; i < choices.Length; i++)
            {
                var card = PaperCard.Create(cardContainer, choices[i], i, cardWidth, cardHeight, japaneseFont);
                var r = card.GetComponent<RectTransform>();
                r.anchorMin = new Vector2(0.5f, 0.5f);
                r.anchorMax = new Vector2(0.5f, 0.5f);
                r.pivot = new Vector2(0.5f, 0.5f);
                r.anchoredPosition = new Vector2(0f, startY - i * (cardHeight + spacing) - cardHeight * 0.5f);
                cards[i] = card;
            }

            confirmButton = PaperButton.Create(cardContainer, "決定", 140f, 40f, OnConfirmPressed);
            confirmButton.SetFont(japaneseFont);
            var btnRect = confirmButton.GetComponent<RectTransform>();
            btnRect.anchorMin = new Vector2(0.5f, 0.5f);
            btnRect.anchorMax = new Vector2(0.5f, 0.5f);
            btnRect.pivot = new Vector2(0.5f, 0.5f);
            btnRect.anchoredPosition = new Vector2(0f, -startY - 30f);
            confirmButton.gameObject.SetActive(false);

            UpdateHoverVisuals();
            gameObject.SetActive(true);
            U4TimeScaleGuard.PauseForOverlay();
        }

        public void Hide()
        {
            if (isClosing) return;
            isClosing = true;
            fadeOutTimer = 0.15f;
        }

        private void Update()
        {
            if (isClosing)
            {
                fadeOutTimer -= Time.unscaledDeltaTime;
                overlayGroup.alpha = Mathf.Clamp01(fadeOutTimer / 0.15f);
                if (fadeOutTimer <= 0f)
                {
                    U4TimeScaleGuard.ResumeFromOverlay();
                    ClearCards();
                    gameObject.SetActive(false);
                }
                return;
            }

            fadeTimer += Time.unscaledDeltaTime;
            overlayGroup.alpha = Mathf.Clamp01(fadeTimer / 0.22f);

            HandleInput();
        }

        private void HandleInput()
        {
            if (cards == null || cards.Length == 0) return;

            var moved = false;
            if (Input.GetKeyDown(KeyCode.UpArrow) || Input.GetKeyDown(KeyCode.W))
            {
                hoveredIndex = (hoveredIndex - 1 + cards.Length) % cards.Length;
                moved = true;
            }
            else if (Input.GetKeyDown(KeyCode.DownArrow) || Input.GetKeyDown(KeyCode.S))
            {
                hoveredIndex = (hoveredIndex + 1) % cards.Length;
                moved = true;
            }

            if (moved)
            {
                UpdateHoverVisuals();
            }

            if (Input.GetKeyDown(KeyCode.Return) || Input.GetKeyDown(KeyCode.Space))
            {
                if (selectedIndex >= 0)
                {
                    OnConfirmPressed();
                }
                else
                {
                    SelectCard(hoveredIndex);
                }
            }

            if (Input.GetKeyDown(KeyCode.Alpha1) && cards.Length > 0) SelectCard(0);
            if (Input.GetKeyDown(KeyCode.Alpha2) && cards.Length > 1) SelectCard(1);
            if (Input.GetKeyDown(KeyCode.Alpha3) && cards.Length > 2) SelectCard(2);

            if (selectedIndex >= 0 && Input.GetKeyDown(KeyCode.Escape))
            {
                DeselectAll();
            }
        }

        private void SelectCard(int index)
        {
            if (index < 0 || index >= cards.Length) return;

            selectedIndex = index;
            hoveredIndex = index;

            for (var i = 0; i < cards.Length; i++)
            {
                cards[i].SetSelected(i == index);
                cards[i].SetDimmed(i != index);
                cards[i].SetHovered(false);
            }

            confirmButton.gameObject.SetActive(true);
            confirmButton.SetHovered(true);
        }

        private void DeselectAll()
        {
            selectedIndex = -1;
            for (var i = 0; i < cards.Length; i++)
            {
                cards[i].SetSelected(false);
                cards[i].SetDimmed(false);
            }

            confirmButton.gameObject.SetActive(false);
            UpdateHoverVisuals();
        }

        private void UpdateHoverVisuals()
        {
            if (cards == null) return;
            for (var i = 0; i < cards.Length; i++)
            {
                cards[i].SetHovered(i == hoveredIndex && selectedIndex < 0);
            }
        }

        private void OnConfirmPressed()
        {
            if (selectedIndex < 0 || selectedIndex >= cards.Length) return;
            var choice = cards[selectedIndex].ChoiceData;
            Hide();
            onChoiceConfirmed?.Invoke(choice);
        }

        private void ClearCards()
        {
            if (cardContainer == null) return;
            for (var i = cardContainer.childCount - 1; i >= 0; i--)
            {
                Destroy(cardContainer.GetChild(i).gameObject);
            }
            cards = null;
            confirmButton = null;
        }

        private void OnDisable()
        {
            if (U4TimeScaleGuard.IsOverlayPaused)
            {
                U4TimeScaleGuard.ForceRestore();
            }
        }

        private void OnDestroy()
        {
            if (U4TimeScaleGuard.IsOverlayPaused)
            {
                U4TimeScaleGuard.ForceRestore();
            }
        }
    }
}
