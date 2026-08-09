using System;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Collection;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class CollectionView : MonoBehaviour
    {
        private TMP_FontAsset font;
        private U46UiAssetCatalog assets;
        private CollectionPresenter presenter;
        private Transform page;
        private Transform indexRoot;
        private GameObject detailOverlay;
        private CollectionCategory activeCategory = CollectionCategory.Characters;

        public void Build(Transform parent, TMP_FontAsset uiFont, U46UiAssetCatalog catalog, CollectionPresenter collectionPresenter)
        {
            font = uiFont; assets = catalog; presenter = collectionPresenter;
            transform.SetParent(parent, false);
            var rect = gameObject.AddComponent<RectTransform>(); rect.anchorMin = Vector2.zero; rect.anchorMax = Vector2.one; rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;
            U46ScreenFactory.Panel(transform, "CollectionBlocker", Vector2.zero, Vector2.one, null, new Color(0.025f, 0.02f, 0.025f, 1f));
            page = U46ScreenFactory.Panel(transform, "CollectionIndexPage", new Vector2(0.035f, 0.045f), new Vector2(0.965f, 0.955f), assets.Collection.Page, new Color(0.88f, 0.79f, 0.63f)).transform;
            U46ScreenFactory.Label(page, "Title", "灯録", 29f, Ink(), new Vector2(0.08f, 0.88f), new Vector2(0.45f, 0.96f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Button(page, "CloseCollectionButton", "戻る", assets.Result.SecondaryButton, new Vector2(0.73f, 0.89f), new Vector2(0.92f, 0.95f), font, () => presenter.Close());
            BuildTabs();
            indexRoot = new GameObject("CollectionEntryIndex", typeof(RectTransform)).transform;
            indexRoot.SetParent(page, false);
            var indexRect = indexRoot.GetComponent<RectTransform>(); indexRect.anchorMin = new Vector2(0.07f, 0.13f); indexRect.anchorMax = new Vector2(0.93f, 0.72f); indexRect.offsetMin = Vector2.zero; indexRect.offsetMax = Vector2.zero;
            gameObject.SetActive(false);
        }

        public void Show()
        {
            gameObject.SetActive(true);
            Refresh();
        }

        private void BuildTabs()
        {
            var categories = (CollectionCategory[])Enum.GetValues(typeof(CollectionCategory));
            var names = new[] { "人物", "影", "武具", "品", "場所", "記憶" };
            for (var i = 0; i < categories.Length; i++)
            {
                var index = i; var x = 0.05f + i * 0.155f;
                U46ScreenFactory.Button(page, $"Category{categories[i]}", names[i], assets.Collection.TabInactive, new Vector2(x, 0.75f), new Vector2(x + 0.145f, 0.83f), font, () => { activeCategory = categories[index]; Refresh(); });
            }
        }

        private void Refresh()
        {
            for (var i = indexRoot.childCount - 1; i >= 0; i--) Destroy(indexRoot.GetChild(i).gameObject);
            var progress = presenter.Progress();
            U46ScreenFactory.Label(page, "Progress", $"灯った記憶  {progress.Current} / {progress.Max}", 14f, Ink(), new Vector2(0.08f, 0.83f), new Vector2(0.72f, 0.88f), TextAlignmentOptions.Left, font);
            var entries = presenter.Present(activeCategory);
            if (entries.Count == 0)
            {
                U46ScreenFactory.Label(indexRoot, "Empty", "この頁には、まだ記録がない。", 15f, Ink(), new Vector2(0.05f, 0.4f), new Vector2(0.95f, 0.6f), TextAlignmentOptions.Center, font);
                return;
            }
            for (var i = 0; i < entries.Count; i++) Entry(entries[i], i);
        }

        private void Entry(CollectionEntryViewModel entry, int index)
        {
            var column = index % 2; var row = index / 2;
            var x = column == 0 ? 0.02f : 0.52f; var top = 0.98f - row * 0.35f;
            var card = U46ScreenFactory.Button(indexRoot, $"Entry_{entry.Id}", string.Empty, entry.Unlocked ? assets.Collection.EntryCard : assets.Collection.EntryLocked,
                new Vector2(x, top - 0.31f), new Vector2(x + 0.46f, top), font, () => OpenDetail(entry.Id));
            U46ScreenFactory.Label(card.transform, "Name", entry.Title, 16f, Ink(), new Vector2(0.08f, 0.08f), new Vector2(0.92f, 0.32f), TextAlignmentOptions.Center, font).raycastTarget = false;
            if (entry.NewIndicator) U46ScreenFactory.Decoration(card.transform, "NewIndicator", assets.Collection.NewBadge, new Vector2(0.86f, 0.84f), new Vector2(34f, 34f), Vector2.zero);
        }

        private void OpenDetail(string id)
        {
            var entry = presenter.Detail(id);
            if (entry == null) return;
            if (detailOverlay != null) Destroy(detailOverlay);
            detailOverlay = U46ScreenFactory.Panel(transform, "CollectionDetailOverlay", new Vector2(0.08f, 0.18f), new Vector2(0.92f, 0.82f), assets.Result.MemoryPage, new Color(0.89f, 0.8f, 0.64f));
            detailOverlay.AddComponent<CollectionDetailReveal>();
            U46ScreenFactory.Label(detailOverlay.transform, "DetailTitle", entry.Title, 24f, Ink(), new Vector2(0.1f, 0.75f), new Vector2(0.9f, 0.9f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Label(detailOverlay.transform, "DetailDescription", entry.Description, 16f, Ink(), new Vector2(0.12f, 0.35f), new Vector2(0.88f, 0.72f), TextAlignmentOptions.TopLeft, font);
            U46ScreenFactory.Label(detailOverlay.transform, "DetailProgress", entry.Unlocked ? $"発見 {entry.ProgressCurrent} / {entry.ProgressMax}\n{entry.RelatedLabel}" : "手がかりを探している", 14f, Ink(), new Vector2(0.34f, 0.22f), new Vector2(0.88f, 0.35f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Button(detailOverlay.transform, "CloseDetailButton", "閉じる", assets.Result.SecondaryButton, new Vector2(0.25f, 0.08f), new Vector2(0.75f, 0.18f), font, () => { Destroy(detailOverlay); detailOverlay = null; Refresh(); });
            if (entry.Unlocked && entry.NewIndicator) presenter.MarkSeen(entry.Id);
        }

        private static Color Ink() => new(0.11f, 0.075f, 0.06f, 1f);
    }
}
