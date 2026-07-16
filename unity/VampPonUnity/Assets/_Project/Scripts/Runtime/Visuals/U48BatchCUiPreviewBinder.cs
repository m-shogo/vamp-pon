#if VAMPPON_U48_ASSET_PREVIEW
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    public sealed class U48BatchCUiPreviewBinder : MonoBehaviour
    {
        private readonly List<Original> originals = new();
        private U48AssetPreviewEntry entry;
        private Sprite candidate;
        private Coroutine binding;
        private bool restored;

        internal void Initialize(U48AssetPreviewEntry previewEntry, Sprite candidateSprite)
        {
            entry = previewEntry ?? throw new ArgumentNullException(nameof(previewEntry));
            candidate = candidateSprite ?? throw new ArgumentNullException(nameof(candidateSprite));
            binding = StartCoroutine(BindDynamicTargets());
        }

        public bool HasBoundTarget => originals.Any(value => value.Image != null);
        public int BoundTargetCount => originals.Count(value => value.Image != null);

        public void BindNow()
        {
            if (restored || entry == null || candidate == null) return;
            foreach (var image in ResolveTargets(entry.assetGroup).Where(value => value != null).Distinct())
            {
                if (originals.Any(value => value.Image == image)) continue;
                originals.Add(new Original(image, image.sprite, image.type, image.preserveAspect, image.raycastTarget));
                image.sprite = candidate;
                image.type = candidate.border.sqrMagnitude > .01f ? Image.Type.Sliced : Image.Type.Simple;
                image.preserveAspect = false;
            }
        }

        private IEnumerator BindDynamicTargets()
        {
            while (!restored)
            {
                BindNow();
                yield return null;
            }
            binding = null;
        }

        private static IEnumerable<Image> ResolveTargets(string group)
        {
            var images = FindObjectsByType<Image>(FindObjectsInactive.Include);
            IEnumerable<Image> Named(params string[] names) => images.Where(value => names.Contains(value.name, StringComparer.Ordinal));
            IEnumerable<Image> Prefix(params string[] prefixes) => images.Where(value => prefixes.Any(prefix => value.name.StartsWith(prefix, StringComparison.Ordinal)));
            IEnumerable<Image> ButtonText(string text) => images.Where(value => value.GetComponentInChildren<TextMeshProUGUI>(true)?.text == text);

            return group switch
            {
                "hud-top-status-frame" or "hud-hp-frame" or "hud-timer-frame" => Named("TopHudPlaceholder"),
                "hud-inventory-weapon-slot" => Prefix("U45BattleInventorySlot_"),
                "hud-inventory-passive-slot" or "hud-rare-slot" or "hud-kokuyou-gauge-frame" => Named("U47ActualInventoryHud"),
                "levelup-card-background" or "levelup-selection-feedback" => Prefix("PaperCard_"),
                "levelup-icon-frame" => Named("IconFrame"),
                "levelup-title-area" or "levelup-description-area" => Named("Content"),
                "levelup-decline-button" or "replacement-cancel-button" => ButtonText("受け取らない"),
                "replacement-modal-background" => Named("Panel"),
                "replacement-incoming-candidate-panel" => Named("InnerPanel"),
                "replacement-owned-slot-row" or "replacement-selected-slot-state" => Prefix("ReplacementSlotButton_"),
                "replacement-confirm-button" => Named("ReplacementConfirmButton"),
                "result-main-panel" or "result-summary-header" => Named("ResultMemoryPage"),
                "result-inventory-row" or "result-evolution-awakening-row" => Named("RewardCard"),
                "result-retry-button" => Named("RetryButton"),
                "result-return-button" => Named("StageSelectButton"),
                "stage-select-stage-card" or "stage-select-locked-unlocked-state" => Named("Stage1Card").Concat(Prefix("StageCard_")),
                "stage-select-metadata-row" => Named("StageMetadataPanel"),
                "stage-select-primary-button" => Named("StartStageButton"),
                "stage-select-title-frame" => Named("StageSelectPaperMap"),
                _ => throw new InvalidOperationException("Unknown U48 Batch C UI group: " + group),
            };
        }

        public void Restore()
        {
            if (restored) return;
            restored = true;
            if (binding != null) { StopCoroutine(binding); binding = null; }
            foreach (var original in originals)
            {
                if (original.Image == null) continue;
                original.Image.sprite = original.Sprite;
                original.Image.type = original.Type;
                original.Image.preserveAspect = original.PreserveAspect;
                original.Image.raycastTarget = original.RaycastTarget;
            }
            originals.Clear();
            entry = null;
            candidate = null;
        }

        private void OnDisable() => Restore();
        private void OnDestroy()
        {
            StopAllCoroutines();
            Restore();
        }

        private readonly struct Original
        {
            public Original(Image image, Sprite sprite, Image.Type type, bool preserveAspect, bool raycastTarget)
            {
                Image = image; Sprite = sprite; Type = type; PreserveAspect = preserveAspect; RaycastTarget = raycastTarget;
            }
            public Image Image { get; }
            public Sprite Sprite { get; }
            public Image.Type Type { get; }
            public bool PreserveAspect { get; }
            public bool RaycastTarget { get; }
        }
    }
}
#endif
