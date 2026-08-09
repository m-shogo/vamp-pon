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
        private Func<string, AppFlowCommandResult> startStage;

        public void Build(
            Transform parent,
            TMP_FontAsset fontAsset,
            AppFlowCoordinator flow,
            Action openSettings = null,
            Func<string, AppFlowCommandResult> startStageCommand = null)
        {
            coordinator = flow ?? throw new ArgumentNullException(nameof(flow)); font = fontAsset;
            startStage = startStageCommand ?? (stageId => coordinator.Execute(AppFlowCommand.StartStage(stageId)));
            transform.SetParent(parent, false);
            var rect = gameObject.AddComponent<RectTransform>();
            rect.anchorMin = Vector2.zero; rect.anchorMax = Vector2.one; rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;
            U46ScreenFactory.Panel(transform, "StageSelectBlocker", Vector2.zero, Vector2.one, null, AppQualityStyleTokens.QuietNight);
            var panel = U46ScreenFactory.Panel(transform, "StageSelectPaperMap", new Vector2(.055f, .08f), new Vector2(.945f, .94f), AppQualityAssetProvider.StageSelectMapPanel, AppQualityStyleTokens.PaperBase);
            U46ScreenFactory.Label(panel.transform, "Title", "ヨルノシルベ", 29f, Ink(), new Vector2(.07f, .91f), new Vector2(.93f, .98f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Label(panel.transform, "Subtitle", "夜路を選ぶ", 15f, Ink(), new Vector2(.07f, .855f), new Vector2(.93f, .915f), TextAlignmentOptions.Center, font);
            BuildCatalog(panel.transform);
            var detail = U46ScreenFactory.Panel(panel.transform, "StageMetadataPanel", new Vector2(.075f, .175f), new Vector2(.925f, .295f), AppQualityAssetProvider.StageCardFrame, new Color(.88f, .79f, .61f, 1f));
            detailTitle = U46ScreenFactory.Label(detail.transform, "SelectedStageTitle", string.Empty, 17f, Ink(), new Vector2(.04f, .48f), new Vector2(.96f, .94f), TextAlignmentOptions.Center, font);
            detailStatus = U46ScreenFactory.Label(detail.transform, "SelectedStageStatus", string.Empty, 13f, Ink(), new Vector2(.04f, .06f), new Vector2(.96f, .52f), TextAlignmentOptions.Center, font);
            startButton = U46ScreenFactory.Button(panel.transform, "StartStageButton", "出発する", AppQualityAssetProvider.PaperButtonFrame, new Vector2(.14f, .095f), new Vector2(.86f, .165f), font, StartSelected);
            startLabel = startButton.GetComponentInChildren<TextMeshProUGUI>(true);
            U46ScreenFactory.Button(panel.transform, "OpenCollectionButton", "灯録を開く", AppQualityAssetProvider.PaperButtonFrame, new Vector2(.23f, .018f), new Vector2(.77f, .082f), font, () => coordinator.Execute(AppFlowCommand.OpenCollection()));
            U46ScreenFactory.Button(panel.transform, "OpenSettingsButton", "設定", AppQualityAssetProvider.PaperButtonFrame, new Vector2(.79f, .88f), new Vector2(.94f, .94f), font, openSettings);
            var lanternAccent = U46ScreenFactory.Decoration(panel.transform, "LanternAccent", AppQualityAssetProvider.SmallLanternAccent, new Vector2(.88f, .87f), new Vector2(44f, 44f), Vector2.zero);
            lanternAccent.raycastTarget = false;
            coordinator.StageSelection.Changed += Render;
            Render();
        }

        private void BuildCatalog(Transform parent)
        {
            var viewport = new GameObject("StageCatalogViewport", typeof(RectTransform), typeof(Image), typeof(RectMask2D), typeof(ScrollRect));
            viewport.transform.SetParent(parent, false);
            var viewportRect = viewport.GetComponent<RectTransform>(); viewportRect.anchorMin = new Vector2(.07f, .31f); viewportRect.anchorMax = new Vector2(.93f, .845f); viewportRect.offsetMin = Vector2.zero; viewportRect.offsetMax = Vector2.zero;
            viewport.GetComponent<Image>().color = new Color(.055f, .04f, .03f, .2f);
            var content = new GameObject("StageCatalogContent", typeof(RectTransform)); content.transform.SetParent(viewport.transform, false);
            var contentRect = content.GetComponent<RectTransform>(); contentRect.anchorMin = new Vector2(0f, 1f); contentRect.anchorMax = new Vector2(1f, 1f); contentRect.pivot = new Vector2(.5f, 1f); contentRect.anchoredPosition = Vector2.zero;
            const float nodeHeight = 66f;
            const float routeStep = 82f;
            var layout = UiResponsiveRuntime.ResolveCurrentScreen();
            var nodeWidth = Mathf.Clamp(layout.CardWidth * 2.05f, 216f, 238f);
            contentRect.sizeDelta = new Vector2(0f, StageCatalog.Entries.Count * routeStep + 20f);
            var scroll = viewport.GetComponent<ScrollRect>(); scroll.viewport = viewportRect; scroll.content = contentRect; scroll.horizontal = false; scroll.vertical = true; scroll.movementType = ScrollRect.MovementType.Clamped; scroll.scrollSensitivity = 28f;
            foreach (var entry in StageCatalog.Entries)
            {
                var routeIndex = entry.DisplayOrder - 1;
                var x = routeIndex % 2 == 0 ? -16f : 16f;
                var y = -12f - routeIndex * routeStep;
                if (routeIndex > 0)
                {
                    var previousX = routeIndex % 2 == 0 ? 16f : -16f;
                    CreateRouteLine(content.transform, routeIndex, new Vector2((previousX + x) * .5f, y + routeStep * .5f), x - previousX, -routeStep);
                }
                var name = entry.DisplayOrder == 1 ? "Stage1Card" : "StageCard_" + entry.StageId;
                var card = U46ScreenFactory.Panel(content.transform, name, Vector2.zero, Vector2.one, AppQualityAssetProvider.StageCardFrame, AppQualityStyleTokens.PaperBase);
                var cardRect = card.GetComponent<RectTransform>(); cardRect.anchorMin = new Vector2(.5f, 1f); cardRect.anchorMax = new Vector2(.5f, 1f); cardRect.pivot = new Vector2(.5f, 1f); cardRect.sizeDelta = new Vector2(nodeWidth, nodeHeight); cardRect.anchoredPosition = new Vector2(x, y);
                var button = card.AddComponent<Button>(); button.transition = Selectable.Transition.ColorTint; var captured = entry.StageId; button.onClick.AddListener(() => coordinator.StageSelection.Select(captured));
                var marker = U46ScreenFactory.Label(card.transform, "StageOrder", $"第{entry.DisplayOrder:00}夜", 10f, Ink(), new Vector2(.05f, .58f), new Vector2(.3f, .91f), TextAlignmentOptions.Left, font); marker.raycastTarget = false;
                var title = U46ScreenFactory.Label(card.transform, "StageTitle", entry.DisplayName, 14f, Ink(), new Vector2(.25f, .42f), new Vector2(.95f, .94f), TextAlignmentOptions.Center, font); title.raycastTarget = false;
                var status = U46ScreenFactory.Label(card.transform, "StageStatus", string.Empty, 11f, Ink(), new Vector2(.08f, .04f), new Vector2(.92f, .4f), TextAlignmentOptions.Center, font); status.raycastTarget = false;
                cards.Add(entry.StageId, new CardView(card.GetComponent<Image>(), button, title, status));
            }
        }

        private static void CreateRouteLine(Transform parent, int index, Vector2 position, float deltaX, float deltaY)
        {
            var line = new GameObject($"StageRouteLine_{index:00}", typeof(RectTransform), typeof(Image));
            line.transform.SetParent(parent, false);
            line.transform.SetAsFirstSibling();
            var rect = line.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(.5f, 1f); rect.anchorMax = new Vector2(.5f, 1f); rect.pivot = new Vector2(.5f, .5f);
            rect.anchoredPosition = position;
            rect.sizeDelta = new Vector2(3f, Mathf.Sqrt(deltaX * deltaX + deltaY * deltaY));
            rect.localRotation = Quaternion.Euler(0f, 0f, -Mathf.Atan2(deltaX, -deltaY) * Mathf.Rad2Deg);
            var image = line.GetComponent<Image>(); image.color = new Color(.16f, .105f, .07f, .5f); image.raycastTarget = false;
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
            if (selected != null) startStage?.Invoke(selected.StageId);
        }

        private void OnDestroy()
        {
            if (coordinator != null) coordinator.StageSelection.Changed -= Render;
            foreach (var card in cards.Values) card.Button.onClick.RemoveAllListeners();
            startButton?.onClick.RemoveAllListeners(); cards.Clear(); coordinator = null; startStage = null;
        }

        private static Color Ink() => AppQualityStyleTokens.InkText;
        private readonly struct CardView
        {
            public CardView(Image background, Button button, TextMeshProUGUI title, TextMeshProUGUI status) { Background = background; Button = button; Title = title; Status = status; }
            public Image Background { get; } public Button Button { get; } public TextMeshProUGUI Title { get; } public TextMeshProUGUI Status { get; }
        }
    }
}
