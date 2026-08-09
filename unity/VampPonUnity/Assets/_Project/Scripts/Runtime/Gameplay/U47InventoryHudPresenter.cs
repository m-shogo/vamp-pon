using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;
using VampPon.UnitySpike.Runtime.Gameplay.State;
using VampPon.UnitySpike.UI;

namespace VampPon.UnitySpike.Runtime.Gameplay
{
    public sealed class InventoryHudViewModel
    {
        public readonly List<string> Weapons = new();
        public readonly List<string> Passives = new();
        public readonly List<string> Rares = new();
    }

    /// <summary>
    /// Compact battle HUD. Runtime values stay native text/UI so generated art can
    /// replace only the material surfaces later without baking gameplay data into images.
    /// </summary>
    public sealed class U47InventoryHudPresenter : MonoBehaviour
    {
        private static readonly Color TextWarm = new(.92f, .84f, .7f, 1f);
        private static readonly Color HpHealthy = new(.64f, .28f, .22f, .94f);
        private static readonly Color HpWarning = new(.78f, .38f, .18f, .96f);
        private static readonly Color HpDanger = new(.86f, .2f, .16f, 1f);
        private static readonly Color KokuyouIdle = new(.30f, .46f, .67f, .9f);
        private static readonly Color KokuyouReady = new(.78f, .54f, .18f, .98f);
        private static readonly Color KokuyouActive = new(.24f, .62f, .62f, 1f);

        private Stage1GameplayRuntimeCoordinator gameplay;
        private TextMeshProUGUI hpLabel;
        private TextMeshProUGUI kokuyouLabel;
        private TextMeshProUGUI weaponLabel;
        private TextMeshProUGUI passiveLabel;
        private TextMeshProUGUI rareLabel;
        private Image hpFill;
        private Image kokuyouFill;
        private float nextRefreshAt;
        private string lastSignature;
        public void Build(Transform parent, TMP_FontAsset font, Stage1GameplayRuntimeCoordinator runtime)
        {
            gameplay = runtime;
            RetireLegacyInventoryChrome(parent);
            PolishTopHud(parent, font);
            ConnectVirtualStickFeedback(parent);

            var root = new GameObject("U47ActualInventoryHud", typeof(RectTransform), typeof(Image));
            root.transform.SetParent(parent, false);
            var rect = root.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(1f, 0f);
            rect.anchorMax = new Vector2(1f, 0f);
            rect.pivot = new Vector2(1f, 0f);
            rect.anchoredPosition = new Vector2(-12f, 14f);
            rect.sizeDelta = new Vector2(210f, 96f);

            var rootImage = root.GetComponent<Image>();
            rootImage.sprite = VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.BattleHudInventoryPanel, AppQualityAssetProvider.BattleHudTopFrame);
            rootImage.type = rootImage.sprite != null ? Image.Type.Sliced : Image.Type.Simple;
            rootImage.color = rootImage.sprite != null
                ? new Color(1f, 1f, 1f, .9f)
                : new Color(.025f, .022f, .03f, .84f);
            rootImage.raycastTarget = false;

            CreateMetricRow(root.transform, font);
            CreateInventoryRow(root.transform, font);

            gameplay.RuntimeChanged += Refresh;
            Refresh();
        }

        public InventoryHudViewModel BuildViewModel()
        {
            var vm = new InventoryHudViewModel();
            foreach (var item in gameplay.Run.Inventory.Weapons)
            {
                var definition = gameplay.Registry.GetWeapon(item.Id);
                var evolution = definition.IsEvolved ? "進" : string.Empty;
                vm.Weapons.Add($"{Shorten(definition.DisplayName, 5)} {evolution}L{item.Level}");
            }
            while (vm.Weapons.Count < gameplay.Registry.WeaponSlots) vm.Weapons.Add("—");

            foreach (var item in gameplay.Run.Inventory.Passives)
            {
                var definition = gameplay.Registry.GetPassive(item.Id);
                vm.Passives.Add($"{Shorten(definition.DisplayName, 5)} L{item.Level}");
            }
            while (vm.Passives.Count < gameplay.Registry.PassiveSlots) vm.Passives.Add("—");

            foreach (var item in gameplay.Run.Inventory.RareItems)
                vm.Rares.Add(Shorten(gameplay.Registry.GetRareItem(item.Id).DisplayName, 6));
            while (vm.Rares.Count < gameplay.Registry.RareItemSlots) vm.Rares.Add("—");

            return vm;
        }

        private static void RetireLegacyInventoryChrome(Transform parent)
        {
            var obsoletePlaceholder = parent.Find("BottomInventoryPlaceholder");
            if (obsoletePlaceholder != null)
                obsoletePlaceholder.gameObject.SetActive(false);

            for (var i = 1; i <= 5; i++)
            {
                var oldSlot = parent.Find($"U45BattleInventorySlot_{i:00}");
                if (oldSlot != null)
                    oldSlot.gameObject.SetActive(false);
            }
        }

        private static void PolishTopHud(Transform parent, TMP_FontAsset font)
        {
            var top = parent.Find("TopHudPlaceholder");
            if (top == null)
                return;

            var rect = top.GetComponent<RectTransform>();
            if (rect != null)
            {
                rect.sizeDelta = new Vector2(326f, 40f);
                rect.anchoredPosition = new Vector2(0f, -28f);
            }

            var image = top.GetComponent<Image>();
            if (image != null)
            {
                image.sprite = VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.BattleHudTopFrame, AppQualityAssetProvider.BattleHudTopFrame);
                image.type = image.sprite != null ? Image.Type.Sliced : Image.Type.Simple;
                image.color = image.sprite != null
                    ? new Color(1f, 1f, 1f, .88f)
                    : new Color(.035f, .027f, .03f, .82f);
                image.raycastTarget = false;
            }

            var label = top.Find("Label")?.GetComponent<TextMeshProUGUI>();
            if (label != null)
            {
                if (font != null)
                    label.font = font;
                label.fontSize = 13f;
                label.color = TextWarm;
                label.characterSpacing = 1.2f;
                label.textWrappingMode = TextWrappingModes.NoWrap;
                label.overflowMode = TextOverflowModes.Ellipsis;
                label.raycastTarget = false;
            }
        }

        private static void ConnectVirtualStickFeedback(Transform parent)
        {
            var ring = parent.Find("U45VirtualStickLowerLeftRing")?.GetComponent<RectTransform>();
            var knob = parent.Find("U45VirtualStickLowerLeftKnob")?.GetComponent<RectTransform>();
            var player = FindAnyObjectByType<PlayerController>();
            if (ring == null || knob == null || player == null)
                return;

            var ringImage = ring.GetComponent<Image>();
            var knobImage = knob.GetComponent<Image>();
            if (ringImage != null && VisualBatchAssetProvider.BattleVirtualStickRing != null)
            {
                ringImage.sprite = VisualBatchAssetProvider.BattleVirtualStickRing;
                ringImage.color = Color.white;
            }
            if (knobImage != null && VisualBatchAssetProvider.BattleVirtualStickKnob != null)
            {
                knobImage.sprite = VisualBatchAssetProvider.BattleVirtualStickKnob;
                knobImage.color = Color.white;
            }

            var feedback = parent.GetComponent<BattleVirtualStickFeedback>();
            if (feedback == null)
                feedback = parent.gameObject.AddComponent<BattleVirtualStickFeedback>();
            feedback.Bind(player, ring, knob);
        }

        private void CreateMetricRow(Transform parent, TMP_FontAsset font)
        {
            hpLabel = CreateLabel(parent, "HpLabel", "HP", font, 10f, new Vector2(.045f, .65f), new Vector2(.49f, .94f), TextAlignmentOptions.Left);
            kokuyouLabel = CreateLabel(parent, "KokuyouLabel", "黒耀", font, 9.5f, new Vector2(.51f, .65f), new Vector2(.955f, .94f), TextAlignmentOptions.Right);

            hpFill = CreateBar(parent, "HpBar", new Vector2(.045f, .56f), new Vector2(.49f, .64f), HpHealthy);
            kokuyouFill = CreateBar(parent, "KokuyouBar", new Vector2(.51f, .56f), new Vector2(.955f, .64f), KokuyouIdle);
        }

        private void CreateInventoryRow(Transform parent, TMP_FontAsset font)
        {
            weaponLabel = CreateCategory(parent, "WeaponSummary", "武", font, new Vector2(.035f, .08f), new Vector2(.405f, .49f));
            passiveLabel = CreateCategory(parent, "PassiveSummary", "補", font, new Vector2(.415f, .08f), new Vector2(.735f, .49f));
            rareLabel = CreateCategory(parent, "RareSummary", "稀", font, new Vector2(.745f, .08f), new Vector2(.965f, .49f));
        }

        private TextMeshProUGUI CreateCategory(Transform parent, string name, string prefix, TMP_FontAsset font, Vector2 min, Vector2 max)
        {
            var panel = new GameObject(name + "Panel", typeof(RectTransform), typeof(Image));
            panel.transform.SetParent(parent, false);
            var rect = panel.GetComponent<RectTransform>();
            rect.anchorMin = min;
            rect.anchorMax = max;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
            var image = panel.GetComponent<Image>();
            image.sprite = VisualBatchAssetProvider.Prefer(VisualBatchAssetProvider.BattleHudSlotFrame, AppQualityAssetProvider.BattleInventorySlotFrame);
            image.type = image.sprite != null ? Image.Type.Sliced : Image.Type.Simple;
            image.color = image.sprite != null ? new Color(1f, 1f, 1f, .88f) : new Color(.09f, .07f, .075f, .8f);
            image.raycastTarget = false;

            return CreateLabel(panel.transform, name, prefix, font, 8.5f, new Vector2(.04f, .05f), new Vector2(.96f, .95f), TextAlignmentOptions.Center);
        }

        private static Image CreateBar(Transform parent, string name, Vector2 min, Vector2 max, Color fillColor)
        {
            var track = new GameObject(name + "Track", typeof(RectTransform), typeof(Image));
            track.transform.SetParent(parent, false);
            var trackRect = track.GetComponent<RectTransform>();
            trackRect.anchorMin = min;
            trackRect.anchorMax = max;
            trackRect.offsetMin = Vector2.zero;
            trackRect.offsetMax = Vector2.zero;
            var trackImage = track.GetComponent<Image>();
            trackImage.color = new Color(.06f, .05f, .06f, .82f);
            trackImage.raycastTarget = false;

            var fill = new GameObject(name + "Fill", typeof(RectTransform), typeof(Image));
            fill.transform.SetParent(track.transform, false);
            var fillRect = fill.GetComponent<RectTransform>();
            fillRect.anchorMin = Vector2.zero;
            fillRect.anchorMax = Vector2.one;
            fillRect.offsetMin = new Vector2(1f, 1f);
            fillRect.offsetMax = new Vector2(-1f, -1f);
            var image = fill.GetComponent<Image>();
            image.type = Image.Type.Filled;
            image.fillMethod = Image.FillMethod.Horizontal;
            image.fillOrigin = 0;
            image.color = fillColor;
            image.raycastTarget = false;
            return image;
        }

        private static TextMeshProUGUI CreateLabel(
            Transform parent,
            string name,
            string initial,
            TMP_FontAsset font,
            float fontSize,
            Vector2 min,
            Vector2 max,
            TextAlignmentOptions alignment)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI));
            obj.transform.SetParent(parent, false);
            var rect = obj.GetComponent<RectTransform>();
            rect.anchorMin = min;
            rect.anchorMax = max;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
            var label = obj.GetComponent<TextMeshProUGUI>();
            label.font = font;
            label.fontSize = fontSize;
            label.alignment = alignment;
            label.color = TextWarm;
            label.textWrappingMode = TextWrappingModes.NoWrap;
            label.overflowMode = TextOverflowModes.Ellipsis;
            label.raycastTarget = false;
            label.text = initial;
            return label;
        }

        private void Update()
        {
            if (Time.unscaledTime >= nextRefreshAt)
            {
                nextRefreshAt = Time.unscaledTime + .1f;
                Refresh();
            }
        }

        private void Refresh()
        {
            if (gameplay?.Run == null || hpLabel == null)
                return;

            var run = gameplay.Run;
            var phase = run.Kokuyou.Phase switch
            {
                KokuyouPhase.Idle => "待機",
                KokuyouPhase.Charging => "蓄積",
                KokuyouPhase.Ready => "発動可",
                KokuyouPhase.Activating => "発動",
                KokuyouPhase.Active => "黒耀中",
                KokuyouPhase.Ending => "終了",
                _ => "回復",
            };

            var hpRatio = run.Player.MaxHp > 0f ? Mathf.Clamp01(run.Player.CurrentHp / run.Player.MaxHp) : 0f;
            var kokuyouRatio = Mathf.Clamp01(run.Kokuyou.Gauge / 100f);
            hpFill.fillAmount = hpRatio;
            kokuyouFill.fillAmount = kokuyouRatio;

            // State is communicated through stable color/silhouette, not constant flashing.
            var hpColor = hpRatio <= .25f ? HpDanger : hpRatio <= .5f ? HpWarning : HpHealthy;
            hpFill.color = hpColor;
            hpLabel.color = hpRatio <= .25f ? new Color(1f, .66f, .48f, 1f) : TextWarm;

            var kokuyouColor = run.Kokuyou.Phase switch
            {
                KokuyouPhase.Ready => KokuyouReady,
                KokuyouPhase.Activating => KokuyouReady,
                KokuyouPhase.Active => KokuyouActive,
                _ => KokuyouIdle,
            };
            kokuyouFill.color = kokuyouColor;
            kokuyouLabel.color = run.Kokuyou.Phase is KokuyouPhase.Ready or KokuyouPhase.Activating or KokuyouPhase.Active
                ? new Color(.98f, .83f, .5f, 1f)
                : TextWarm;

            hpLabel.text = $"HP {run.Player.CurrentHp:0}/{run.Player.MaxHp:0}";
            kokuyouLabel.text = $"黒耀 {phase} {run.Kokuyou.Gauge:0}%";

            var vm = BuildViewModel();
            var signature = string.Join("|", vm.Weapons) + "#" + string.Join("|", vm.Passives) + "#" + string.Join("|", vm.Rares);
            if (signature == lastSignature)
                return;

            lastSignature = signature;
            weaponLabel.text = "武 " + Compact(vm.Weapons, 1);
            passiveLabel.text = "補 " + Compact(vm.Passives, 1);
            rareLabel.text = "稀 " + Compact(vm.Rares, 1);
        }

        private static string Compact(List<string> items, int maxVisible)
        {
            var visible = new List<string>();
            foreach (var item in items)
            {
                if (item == "—") continue;
                visible.Add(item);
                if (visible.Count >= maxVisible) break;
            }
            return visible.Count == 0 ? "—" : string.Join(" · ", visible);
        }

        private static string Shorten(string value, int maxChars)
        {
            if (string.IsNullOrEmpty(value) || value.Length <= maxChars)
                return value;
            return value.Substring(0, Mathf.Max(1, maxChars - 1)) + "…";
        }

        private void OnDestroy()
        {
            if (gameplay != null)
                gameplay.RuntimeChanged -= Refresh;
        }
    }
}
