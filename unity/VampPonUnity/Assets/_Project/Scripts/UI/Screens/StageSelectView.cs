using System;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.Runtime.StageSelect;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class StageSelectView : MonoBehaviour
    {
        private readonly Dictionary<string, CardView> cards = new(StringComparer.Ordinal);
        private AppFlowCoordinator coordinator;
        private TMP_FontAsset font;
        private Button startButton;
        private TextMeshProUGUI startLabel;
        private TextMeshProUGUI detailTitle;
        private TextMeshProUGUI detailStatus;

        public void Build(Transform parent, TMP_FontAsset fontAsset, AppFlowCoordinator flow)
        {
            coordinator = flow ?? throw new ArgumentNullException(nameof(flow)); font = fontAsset;
            transform.SetParent(parent, false);
            var rect = gameObject.AddComponent<RectTransform>();
            rect.anchorMin = Vector2.zero; rect.anchorMax = Vector2.one; rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;
            U46ScreenFactory.Panel(transform, "StageSelectBlocker", Vector2.zero, Vector2.one, null, AppQualityStyleTokens.QuietNight);
            var panel = U46ScreenFactory.Panel(transform, "StageSelectPaperMap", new Vector2(.055f, .08f), new Vector2(.945f, .94f), AppQualityAssetProvider.StageSelectMapPanel, AppQualityStyleTokens.PaperBase);
            U46ScreenFactory.Label(panel.transform, "Title", "ヨルノシルベ", 27f, Ink(), new Vector2(.07f, .89f), new Vector2(.93f, .98f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Label(panel.transform, "Subtitle", "今夜の行き先", 15f, Ink(), new Vector2(.07f, .84f), new Vector2(.93f, .9f), TextAlignmentOptions.Center, font);
            BuildCatalog(panel.transform);
            var detail = U46ScreenFactory.Panel(panel.transform, "StageMetadataPanel", new Vector2(.075f, .19f), new Vector2(.925f, .32f), AppQualityAssetProvider.StageCardFrame, new Color(.88f, .79f, .61f, 1f));
            detailTitle = U46ScreenFactory.Label(detail.transform, "SelectedStageTitle", string.Empty, 17f, Ink(), new Vector2(.04f, .48f), new Vector2(.96f, .94f), TextAlignmentOptions.Center, font);
            detailStatus = U46ScreenFactory.Label(detail.transform, "SelectedStageStatus", string.Empty, 13f, Ink(), new Vector2(.04f, .06f), new Vector2(.96f, .52f), TextAlignmentOptions.Center, font);
            startButton = U46ScreenFactory.Button(panel.transform, "StartStageButton", "出発する", AppQualityAssetProvider.PaperButtonFrame, new Vector2(.14f, .105f), new Vector2(.86f, .18f), font, StartSelected);
            startLabel = startButton.GetComponentInChildren<TextMeshProUGUI>(true);
            U46ScreenFactory.Button(panel.transform, "OpenCollectionButton", "灯録を開く", AppQualityAssetProvider.PaperButtonFrame, new Vector2(.23f, .02f), new Vector2(.77f, .09f), font, () => coordinator.Execute(AppFlowCommand.OpenCollection()));
            U46ScreenFactory.Decoration(panel.transform, "LanternAccent", AppQualityAssetProvider.SmallLanternAccent, new Vector2(.88f, .87f), new Vector2(44f, 44f), Vector2.zero);
            coordinator.StageSelection.Changed += Render;
            Render();
        }

        private void BuildCatalog(Transform parent)
        {
            var viewport = new GameObject("StageCatalogViewport", typeof(RectTransform), typeof(Image), typeof(RectMask2D), typeof(ScrollRect));
            viewport.transform.SetParent(parent, false);
            var viewportRect = viewport.GetComponent<RectTransform>(); viewportRect.anchorMin = new Vector2(.07f, .34f); viewportRect.anchorMax = new Vector2(.93f, .83f); viewportRect.offsetMin = Vector2.zero; viewportRect.offsetMax = Vector2.zero;
            viewport.GetComponent<Image>().color = new Color(.08f, .055f, .04f, .12f);
            var content = new GameObject("StageCatalogContent", typeof(RectTransform), typeof(GridLayoutGroup), typeof(ContentSizeFitter)); content.transform.SetParent(viewport.transform, false);
            var contentRect = content.GetComponent<RectTransform>(); contentRect.anchorMin = new Vector2(0f, 1f); contentRect.anchorMax = new Vector2(1f, 1f); contentRect.pivot = new Vector2(.5f, 1f); contentRect.anchoredPosition = Vector2.zero;
            var grid = content.GetComponent<GridLayoutGroup>(); grid.padding = new RectOffset(6, 6, 6, 6); grid.spacing = new Vector2(8f, 8f); grid.cellSize = new Vector2(132f, 72f); grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount; grid.constraintCount = 2; grid.childAlignment = TextAnchor.UpperCenter;
            var fitter = content.GetComponent<ContentSizeFitter>(); fitter.verticalFit = ContentSizeFitter.FitMode.PreferredSize;
            var scroll = viewport.GetComponent<ScrollRect>(); scroll.viewport = viewportRect; scroll.content = contentRect; scroll.horizontal = false; scroll.vertical = true; scroll.movementType = ScrollRect.MovementType.Clamped; scroll.scrollSensitivity = 28f;
            foreach (var entry in StageCatalog.Entries)
            {
                var name = entry.DisplayOrder == 1 ? "Stage1Card" : "StageCard_" + entry.StageId;
                var card = U46ScreenFactory.Panel(content.transform, name, Vector2.zero, Vector2.one, AppQualityAssetProvider.StageCardFrame, AppQualityStyleTokens.PaperBase);
                var button = card.AddComponent<Button>(); button.transition = Selectable.Transition.ColorTint; var captured = entry.StageId; button.onClick.AddListener(() => coordinator.StageSelection.Select(captured));
                var title = U46ScreenFactory.Label(card.transform, "StageTitle", entry.DisplayName, 14f, Ink(), new Vector2(.05f, .38f), new Vector2(.95f, .94f), TextAlignmentOptions.Center, font); title.raycastTarget = false;
                var status = U46ScreenFactory.Label(card.transform, "StageStatus", string.Empty, 11f, Ink(), new Vector2(.05f, .04f), new Vector2(.95f, .4f), TextAlignmentOptions.Center, font); status.raycastTarget = false;
                cards.Add(entry.StageId, new CardView(card.GetComponent<Image>(), button, title, status));
            }
        }

        private void Render()
        {
            if (coordinator == null || startButton == null) return;
            foreach (var item in coordinator.StageSelection.Items)
            {
                if (!cards.TryGetValue(item.StageId, out var card)) continue;
                var state = item.VisualState switch
                {
                    StageSelectVisualState.SelectedUnlocked => UiVisualState.Selected,
                    StageSelectVisualState.SelectedLocked => UiVisualState.Selected,
                    StageSelectVisualState.Locked => UiVisualState.Locked,
                    StageSelectVisualState.Disabled => UiVisualState.Disabled,
                    _ => UiVisualState.Normal,
                };
                var style = UiThemeRuntime.Resolve(state); card.Background.color = style.Background; card.Title.color = style.Text;
                card.Button.interactable = true;
                card.Status.text = item.IsSelected
                    ? item.IsStartable ? "選択中・出発可能" : item.IsUnlocked ? "選択中・準備中" : "選択中・未解放"
                    : item.IsStartable ? "出発可能" : item.IsUnlocked ? "準備中" : "未解放";
                card.Status.color = style.Text;
            }
            var selected = coordinator.StageSelection.Selected;
            detailTitle.text = selected?.DisplayName ?? "行き先を選んでください";
            detailStatus.text = selected == null ? "カードを選ぶと詳細を確認できます" : selected.IsStartable ? "この行き先へ出発できます" : selected.IsUnlocked ? "この行き先は準備中です" : "この行き先はまだ解放されていません";
            startButton.interactable = coordinator.StageSelection.CanStartSelected;
            startLabel.text = selected == null ? "行き先を選ぶ" : selected.IsStartable ? "出発する" : selected.IsUnlocked ? "準備中" : "未解放";
            var buttonStyle = UiThemeRuntime.Resolve(startButton.interactable ? UiVisualState.Normal : UiVisualState.Disabled);
            startButton.GetComponent<Image>().color = buttonStyle.Background; startLabel.color = buttonStyle.Text;
        }

        private void StartSelected()
        {
            var selected = coordinator.StageSelection.Selected;
            if (selected != null) coordinator.Execute(AppFlowCommand.StartStage(selected.StageId));
        }

        private void OnDestroy()
        {
            if (coordinator != null) coordinator.StageSelection.Changed -= Render;
            foreach (var card in cards.Values) card.Button.onClick.RemoveAllListeners();
            startButton?.onClick.RemoveAllListeners(); cards.Clear(); coordinator = null;
        }

        private static Color Ink() => AppQualityStyleTokens.InkText;
        private readonly struct CardView
        {
            public CardView(Image background, Button button, TextMeshProUGUI title, TextMeshProUGUI status) { Background = background; Button = button; Title = title; Status = status; }
            public Image Background { get; } public Button Button { get; } public TextMeshProUGUI Title { get; } public TextMeshProUGUI Status { get; }
        }
    }
}
