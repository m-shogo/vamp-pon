using System;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime.Collection;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class CollectionView : MonoBehaviour
    {
        private readonly Dictionary<CollectionCategory, Button> tabButtons = new();
        private TMP_FontAsset font;
        private U46UiAssetCatalog assets;
        private CollectionPresenter presenter;
        private Transform page;
        private Transform indexRoot;
        private ScrollRect entryScroll;
        private TextMeshProUGUI progressLabel;
        private GameObject detailOverlay;
        private CollectionCategory activeCategory = CollectionCategory.Characters;

        public void Build(Transform parent, TMP_FontAsset uiFont, U46UiAssetCatalog catalog, CollectionPresenter collectionPresenter)
        {
            font = uiFont;
            assets = catalog;
            presenter = collectionPresenter;
            transform.SetParent(parent, false);

            var rect = gameObject.AddComponent<RectTransform>();
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;

            U46ScreenFactory.Panel(transform, "CollectionBlocker", Vector2.zero, Vector2.one, null, new Color(0.025f, 0.02f, 0.025f, 1f));
            page = U46ScreenFactory.Panel(
                transform,
                "CollectionIndexPage",
                new Vector2(0.035f, 0.045f),
                new Vector2(0.965f, 0.955f),
                VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.CollectionPage, assets.Collection.Page),
                new Color(0.88f, 0.79f, 0.63f)).transform;

            U46ScreenFactory.Label(page, "Title", "灯録", 29f, Ink(), new Vector2(0.08f, 0.88f), new Vector2(0.45f, 0.96f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Button(page, "CloseCollectionButton", "戻る", assets.Result.SecondaryButton, new Vector2(0.73f, 0.89f), new Vector2(0.92f, 0.95f), font, () => presenter.Close());
            progressLabel = U46ScreenFactory.Label(page, "Progress", string.Empty, 14f, Ink(), new Vector2(0.08f, 0.83f), new Vector2(0.72f, 0.88f), TextAlignmentOptions.Left, font);

            BuildTabs();
            BuildScrollableIndex();
            gameObject.SetActive(false);
        }

        public void Show()
        {
            // Detail is a transient inspection state, not navigation state. Returning to the
            // Collection always restores the index instead of resurrecting an old overlay.
            CloseTransientDetail();
            gameObject.SetActive(true);
            UpdateTabVisuals();
            Refresh(resetScroll: true);
        }

        private void BuildTabs()
        {
            tabButtons.Clear();
            var categories = (CollectionCategory[])Enum.GetValues(typeof(CollectionCategory));
            var names = new[] { "人物", "影", "武具", "品", "場所", "記憶" };
            for (var i = 0; i < categories.Length; i++)
            {
                var category = categories[i];
                var x = 0.05f + i * 0.155f;
                var button = U46ScreenFactory.Button(
                    page,
                    $"Category{category}",
                    names[i],
                    VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.CollectionTabInactive, assets.Collection.TabInactive),
                    new Vector2(x, 0.75f),
                    new Vector2(x + 0.145f, 0.83f),
                    font,
                    () => SelectCategory(category));
                tabButtons[category] = button;
            }
            UpdateTabVisuals();
        }

        private void BuildScrollableIndex()
        {
            var viewport = new GameObject("CollectionEntryViewport", typeof(RectTransform), typeof(Image), typeof(RectMask2D), typeof(ScrollRect));
            viewport.transform.SetParent(page, false);
            var viewportRect = viewport.GetComponent<RectTransform>();
            viewportRect.anchorMin = new Vector2(0.065f, 0.115f);
            viewportRect.anchorMax = new Vector2(0.935f, 0.72f);
            viewportRect.offsetMin = Vector2.zero;
            viewportRect.offsetMax = Vector2.zero;
            var viewportImage = viewport.GetComponent<Image>();
            viewportImage.color = new Color(0.09f, 0.06f, 0.045f, 0.08f);
            viewportImage.raycastTarget = true;

            var content = new GameObject("CollectionEntryIndex", typeof(RectTransform), typeof(GridLayoutGroup), typeof(ContentSizeFitter));
            content.transform.SetParent(viewport.transform, false);
            var contentRect = content.GetComponent<RectTransform>();
            contentRect.anchorMin = new Vector2(0f, 1f);
            contentRect.anchorMax = new Vector2(1f, 1f);
            contentRect.pivot = new Vector2(0.5f, 1f);
            contentRect.anchoredPosition = Vector2.zero;
            contentRect.sizeDelta = Vector2.zero;

            var grid = content.GetComponent<GridLayoutGroup>();
            grid.padding = new RectOffset(5, 5, 5, 12);
            grid.spacing = new Vector2(8f, 10f);
            grid.cellSize = new Vector2(146f, 126f);
            grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
            grid.constraintCount = 2;
            grid.childAlignment = TextAnchor.UpperCenter;

            var fitter = content.GetComponent<ContentSizeFitter>();
            fitter.horizontalFit = ContentSizeFitter.FitMode.Unconstrained;
            fitter.verticalFit = ContentSizeFitter.FitMode.PreferredSize;

            entryScroll = viewport.GetComponent<ScrollRect>();
            entryScroll.viewport = viewportRect;
            entryScroll.content = contentRect;
            entryScroll.horizontal = false;
            entryScroll.vertical = true;
            entryScroll.movementType = ScrollRect.MovementType.Clamped;
            entryScroll.inertia = true;
            entryScroll.decelerationRate = 0.12f;
            entryScroll.scrollSensitivity = 24f;

            indexRoot = content.transform;
        }

        private void SelectCategory(CollectionCategory category)
        {
            if (activeCategory == category)
                return;
            activeCategory = category;
            UpdateTabVisuals();
            Refresh(resetScroll: true);
        }

        private void UpdateTabVisuals()
        {
            foreach (var pair in tabButtons)
            {
                var selected = pair.Key == activeCategory;
                var button = pair.Value;
                if (button == null)
                    continue;
                var image = button.GetComponent<Image>();
                if (image != null)
                {
                    image.sprite = selected
                        ? VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.CollectionTabActive, assets.Collection.TabActive)
                        : VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.CollectionTabInactive, assets.Collection.TabInactive);
                    image.type = image.sprite != null ? Image.Type.Sliced : Image.Type.Simple;
                    image.color = selected ? Color.white : new Color(1f, 1f, 1f, .78f);
                }
                var label = button.GetComponentInChildren<TextMeshProUGUI>(true);
                if (label != null)
                    label.color = selected ? new Color(.15f, .08f, .05f, 1f) : new Color(.28f, .2f, .15f, .88f);
            }
        }

        private void Refresh(bool resetScroll = false)
        {
            if (indexRoot == null)
                return;

            for (var i = indexRoot.childCount - 1; i >= 0; i--)
                Destroy(indexRoot.GetChild(i).gameObject);

            var progress = presenter.Progress();
            if (progressLabel != null)
                progressLabel.text = $"灯った記憶  {progress.Current} / {progress.Max}";

            var entries = presenter.Present(activeCategory);
            if (entries.Count == 0)
            {
                var empty = U46ScreenFactory.Label(indexRoot, "Empty", "この頁には、まだ記録がない。", 15f, Ink(), Vector2.zero, Vector2.one, TextAlignmentOptions.Center, font);
                var emptyRect = empty.GetComponent<RectTransform>();
                emptyRect.sizeDelta = new Vector2(300f, 120f);
            }
            else
            {
                for (var i = 0; i < entries.Count; i++)
                    Entry(entries[i]);
            }

            Canvas.ForceUpdateCanvases();
            if (resetScroll && entryScroll != null)
                entryScroll.verticalNormalizedPosition = 1f;
        }

        private void Entry(CollectionEntryViewModel entry)
        {
            var entrySprite = entry.Unlocked
                ? VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.CollectionEntryUnlocked, assets.Collection.EntryCard)
                : VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.CollectionEntryLocked, assets.Collection.EntryLocked);

            var card = U46ScreenFactory.Button(
                indexRoot,
                $"Entry_{entry.Id}",
                string.Empty,
                entrySprite,
                Vector2.zero,
                Vector2.one,
                font,
                () => OpenDetail(entry.Id));

            var cardImage = card.GetComponent<Image>();
            if (cardImage != null)
                cardImage.color = entry.Unlocked ? Color.white : new Color(.78f, .75f, .72f, .92f);

            var state = entry.Unlocked ? "記録済" : "未解放";
            var stateLabel = U46ScreenFactory.Label(card.transform, "State", state, 10f, Ink(), new Vector2(0.08f, 0.72f), new Vector2(0.92f, 0.93f), TextAlignmentOptions.Left, font);
            stateLabel.color = entry.Unlocked ? new Color(.28f, .18f, .12f, .82f) : new Color(.35f, .31f, .29f, .7f);
            stateLabel.raycastTarget = false;

            var name = U46ScreenFactory.Label(card.transform, "Name", entry.Title, 15f, Ink(), new Vector2(0.08f, 0.12f), new Vector2(0.92f, 0.42f), TextAlignmentOptions.Center, font);
            name.textWrappingMode = TextWrappingModes.NoWrap;
            name.overflowMode = TextOverflowModes.Ellipsis;
            name.raycastTarget = false;

            if (entry.NewIndicator)
                U46ScreenFactory.Decoration(card.transform, "NewIndicator", VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.CollectionNewSeal, assets.Collection.NewBadge), new Vector2(0.84f, 0.82f), new Vector2(32f, 32f), Vector2.zero);
        }

        private void OpenDetail(string id)
        {
            var entry = presenter.Detail(id);
            if (entry == null) return;
            CloseTransientDetail();

            detailOverlay = U46ScreenFactory.Panel(
                transform,
                "CollectionDetailOverlay",
                new Vector2(0.08f, 0.18f),
                new Vector2(0.92f, 0.82f),
                VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.CollectionDetailPage, assets.Result.MemoryPage),
                new Color(0.89f, 0.8f, 0.64f));
            detailOverlay.AddComponent<CollectionDetailReveal>();

            U46ScreenFactory.Label(detailOverlay.transform, "DetailTitle", entry.Title, 24f, Ink(), new Vector2(0.1f, 0.75f), new Vector2(0.9f, 0.9f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Label(detailOverlay.transform, "DetailDescription", entry.Description, 16f, Ink(), new Vector2(0.12f, 0.35f), new Vector2(0.88f, 0.72f), TextAlignmentOptions.TopLeft, font);
            U46ScreenFactory.Label(detailOverlay.transform, "DetailProgress", entry.Unlocked ? $"発見 {entry.ProgressCurrent} / {entry.ProgressMax}\n{entry.RelatedLabel}" : "手がかりを探している", 14f, Ink(), new Vector2(0.34f, 0.22f), new Vector2(0.88f, 0.35f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Button(detailOverlay.transform, "CloseDetailButton", "閉じる", assets.Result.SecondaryButton, new Vector2(0.25f, 0.08f), new Vector2(0.75f, 0.18f), font, () =>
            {
                CloseTransientDetail();
                Refresh(resetScroll: false);
            });

            if (entry.Unlocked && entry.NewIndicator)
                presenter.MarkSeen(entry.Id);
        }

        private void CloseTransientDetail()
        {
            if (detailOverlay == null)
                return;
            Destroy(detailOverlay);
            detailOverlay = null;
        }

        private void OnDisable()
        {
            CloseTransientDetail();
        }

        private static Color Ink() => new(0.11f, 0.075f, 0.06f, 1f);
    }
}
