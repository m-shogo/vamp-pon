using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime.Gameplay;
using VampPon.UnitySpike.Runtime.Gameplay.State;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    public sealed class U48ProductionVisualBinder : MonoBehaviour
    {
        private U48ProductionVisualCatalog catalog;
        private Stage1GameplayRuntimeCoordinator gameplay;
        private PlayerController player;
        private readonly Dictionary<string, Image> decorations = new(StringComparer.Ordinal);
        private readonly Dictionary<KokuyouPhase, SpriteRenderer> kokuyou = new();

        public static void Attach(GameObject owner)
        {
            if (owner == null) throw new ArgumentNullException(nameof(owner));
            if (owner.GetComponent<U48ProductionVisualBinder>() == null) owner.AddComponent<U48ProductionVisualBinder>();
        }

        private void Awake()
        {
#if VAMPPON_U48_ASSET_PREVIEW
            if (U48AssetPreviewProvider.IsSessionActive) { enabled = false; return; }
#endif
            catalog = U48ProductionVisualCatalog.LoadRequired(); StartCoroutine(BindAfterConstruction());
        }
        private IEnumerator BindAfterConstruction()
        {
            yield return null;
            gameplay = FindAnyObjectByType<Stage1GameplayRuntimeCoordinator>() ?? throw new InvalidOperationException("U48 production gameplay owner is missing.");
            player = FindAnyObjectByType<PlayerController>() ?? throw new InvalidOperationException("U48 production player is missing.");
            BindBackground(); BuildKokuyou(); BindUi();
        }

        private void BindBackground()
        {
            var renderer = FindObjectsByType<SpriteRenderer>(FindObjectsInactive.Include).FirstOrDefault(value => value.name == "DarkPaperNightBackground") ?? throw new InvalidOperationException("U48 production background owner is missing.");
            renderer.sprite = catalog.SpriteFor("stage1-background"); renderer.drawMode = SpriteDrawMode.Sliced;
        }

        private void BuildKokuyou()
        {
            AddAura(KokuyouPhase.Charging, "kokuyou-charging", 1.02f); AddAura(KokuyouPhase.Ready, "kokuyou-ready", 1.18f);
            AddAura(KokuyouPhase.Active, "kokuyou-active", 1.45f); AddAura(KokuyouPhase.Recovery, "kokuyou-recovery", 1.02f);
        }
        private void AddAura(KokuyouPhase phase, string group, float targetSize)
        {
            var sprite = catalog.SpriteFor(group); var value = new GameObject("U48Production_" + group, typeof(SpriteRenderer)).GetComponent<SpriteRenderer>();
            value.transform.SetParent(transform, false); value.sprite = sprite; value.sortingOrder = 9; value.transform.localScale = Vector3.one * targetSize / Mathf.Max(.001f, Mathf.Max(sprite.bounds.size.x, sprite.bounds.size.y)); value.enabled = false; kokuyou.Add(phase, value);
        }

        private void BindUi()
        {
            Direct("hud-top-status-frame", Named("TopHudPlaceholder"));
            Decorate("hud-hp-frame", Named("TopHudPlaceholder"), new Vector2(0f, 0f), new Vector2(.68f, 1f));
            Decorate("hud-timer-frame", Named("TopHudPlaceholder"), new Vector2(.68f, 0f), Vector2.one);
            Direct("hud-inventory-weapon-slot", Prefix("U45BattleInventorySlot_"));
            Decorate("hud-inventory-passive-slot", Named("U47ActualInventoryHud"), new Vector2(0f, .28f), new Vector2(1f, .58f));
            Decorate("hud-rare-slot", Named("U47ActualInventoryHud"), Vector2.zero, new Vector2(1f, .29f));
            Decorate("hud-kokuyou-gauge-frame", Named("U47ActualInventoryHud"), new Vector2(0f, .7f), Vector2.one);
            Direct("levelup-card-background", Prefix("PaperCard_"));
            Decorate("levelup-selection-feedback", Prefix("PaperCard_"), Vector2.zero, Vector2.one);
            Direct("levelup-icon-frame", Named("IconFrame"));
            Decorate("levelup-title-area", Named("Content"), new Vector2(0f, .42f), Vector2.one);
            Decorate("levelup-description-area", Named("Content"), Vector2.zero, new Vector2(1f, .55f));
            Direct("levelup-decline-button", ButtonText("受け取らない"));
            Direct("replacement-modal-background", Named("Panel")); Direct("replacement-incoming-candidate-panel", Named("InnerPanel"));
            Direct("replacement-owned-slot-row", Prefix("ReplacementSlotButton_")); Decorate("replacement-selected-slot-state", Prefix("ReplacementSlotButton_"), Vector2.zero, Vector2.one);
            Direct("replacement-confirm-button", Named("ReplacementConfirmButton")); Direct("replacement-cancel-button", ButtonText("受け取らない"));
            Direct("result-main-panel", Named("ResultMemoryPage")); Decorate("result-summary-header", Named("ResultMemoryPage"), new Vector2(0f, .72f), Vector2.one);
            Direct("result-inventory-row", Named("RewardCard")); Decorate("result-evolution-awakening-row", Named("RewardCard"), Vector2.zero, Vector2.one);
            Direct("result-retry-button", Named("RetryButton")); Direct("result-return-button", Named("StageSelectButton"));
            Direct("stage-select-title-frame", Named("StageSelectPaperMap")); Direct("stage-select-stage-card", Named("Stage1Card").Concat(Prefix("StageCard_")));
            Decorate("stage-select-locked-unlocked-state", Named("Stage1Card").Concat(Prefix("StageCard_")), Vector2.zero, Vector2.one);
            Direct("stage-select-metadata-row", Named("StageMetadataPanel")); Direct("stage-select-primary-button", Named("StartStageButton"));
        }

        private static IEnumerable<Image> Images() => FindObjectsByType<Image>(FindObjectsInactive.Include);
        private static IEnumerable<Image> Named(params string[] names) => Images().Where(value => names.Contains(value.name, StringComparer.Ordinal));
        private static IEnumerable<Image> Prefix(params string[] prefixes) => Images().Where(value => prefixes.Any(prefix => value.name.StartsWith(prefix, StringComparison.Ordinal)));
        private static IEnumerable<Image> ButtonText(string text) => Images().Where(value => value.GetComponentInChildren<TextMeshProUGUI>(true)?.text == text);
        private void Direct(string group, IEnumerable<Image> targets)
        {
            var sprite = catalog.SpriteFor(group); foreach (var image in targets.Distinct()) { image.sprite = sprite; image.type = sprite.border.sqrMagnitude > .01f ? Image.Type.Sliced : Image.Type.Simple; }
        }
        private void Decorate(string group, IEnumerable<Image> owners, Vector2 min, Vector2 max)
        {
            var sprite = catalog.SpriteFor(group); var index = 0;
            foreach (var owner in owners.Distinct())
            {
                var key = group + ":" + owner.GetHashCode(); if (decorations.ContainsKey(key)) continue;
                var image = new GameObject("U48Production_" + group + "_" + index++, typeof(RectTransform), typeof(Image)).GetComponent<Image>(); image.transform.SetParent(owner.transform, false); image.transform.SetAsFirstSibling();
                var rect = image.rectTransform; rect.anchorMin = min; rect.anchorMax = max; rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;
                image.sprite = sprite; image.type = sprite.border.sqrMagnitude > .01f ? Image.Type.Sliced : Image.Type.Simple; image.raycastTarget = false; decorations.Add(key, image);
            }
        }

        private void LateUpdate()
        {
            if (gameplay?.Run == null || player == null) return;
            BindUi();
            foreach (var value in kokuyou) { value.Value.enabled = gameplay.Run.Kokuyou.Phase == value.Key; value.Value.transform.position = player.transform.position; }
        }
        private void OnDestroy() { StopAllCoroutines(); foreach (var value in kokuyou.Values) if (value != null) Destroy(value.gameObject); kokuyou.Clear(); decorations.Clear(); }
    }
}
