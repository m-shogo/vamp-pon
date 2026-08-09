using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class SettingsView : MonoBehaviour
    {
        private AppPreferenceService preferences;
        private TMP_FontAsset font;
        private Transform page;
        private Color ink;
        private Color mutedInk;
        private Color paper;
        private Color paperRaised;
        private Color paperEdge;
        private Color lantern;

        public void Build(Transform parent, TMP_FontAsset fontAsset, AppPreferenceService owner, Action close)
        {
            preferences = owner ?? throw new ArgumentNullException(nameof(owner));
            font = fontAsset;
            var theme = UiThemeRuntime.Current;
            ink = theme.InkText;
            mutedInk = theme.SecondaryText;
            paper = theme.PaperBase;
            paperRaised = theme.PaperRaised;
            paperEdge = theme.PaperEdge;
            lantern = theme.WarmLantern;

            transform.SetParent(parent, false);
            var rect = gameObject.AddComponent<RectTransform>();
            rect.anchorMin = Vector2.zero; rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;

            U46ScreenFactory.Panel(transform, "SettingsBlocker", Vector2.zero, Vector2.one, null, new Color(theme.QuietNight.r, theme.QuietNight.g, theme.QuietNight.b, .98f));
            page = U46ScreenFactory.Panel(transform, "SettingsPaper", new Vector2(.07f, .075f), new Vector2(.93f, .945f), null, paper).transform;
            AddPaperBorder(page);

            U46ScreenFactory.Panel(page, "SettingsHeaderWash", new Vector2(.025f, .825f), new Vector2(.975f, .975f), null, new Color(paperRaised.r, paperRaised.g, paperRaised.b, .72f));
            U46ScreenFactory.Label(page, "SettingsTitle", "設定", 27f, ink, new Vector2(.13f, .895f), new Vector2(.87f, .965f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Label(page, "SettingsPurpose", "今の体験を、端末に合わせる", 13f, mutedInk, new Vector2(.13f, .835f), new Vector2(.87f, .9f), TextAlignmentOptions.Center, font);
            var accent = U46ScreenFactory.Decoration(page, "SettingsLanternAccent", AppQualityAssetProvider.SmallLanternAccent, new Vector2(.905f, .91f), new Vector2(34f, 34f), Vector2.zero);
            accent.color = new Color(1f, 1f, 1f, .78f);
            accent.raycastTarget = false;

            SectionHeading("AudioHeading", "音", .755f);
            CreateSliderRow("BGM", "夜の音楽", .625f, preferences.Current.bgmVolume, preferences.SetBgmVolume);
            CreateSliderRow("SE", "合図と手応え", .49f, preferences.Current.seVolume, preferences.SetSeVolume);

            SectionHeading("MotionHeading", "操作・演出", .39f);
            CreateToggleRow("振動", "触れた手応え", .255f, () => preferences.Current.hapticsEnabled, preferences.SetHapticsEnabled);
            CreateToggleRow("演出を控えめに", "光と動きを静かに", .12f, () => preferences.Current.reducedMotion, preferences.SetReducedMotion);

            var closeButton = U46ScreenFactory.Button(page, "CloseSettingsButton", "戻る", AppQualityAssetProvider.PaperButtonFrame, new Vector2(.24f, .018f), new Vector2(.76f, .088f), font, close);
            ApplyButtonColors(closeButton, paperRaised, ink);
            gameObject.SetActive(false);
        }

        public void Show() => gameObject.SetActive(true);
        public void Hide() => gameObject.SetActive(false);

        private void SectionHeading(string name, string text, float y)
        {
            U46ScreenFactory.Label(page, name, text, 17f, ink, new Vector2(.09f, y), new Vector2(.91f, y + .06f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Panel(page, name + "Rule", new Vector2(.09f, y - .012f), new Vector2(.91f, y - .008f), null, new Color(paperEdge.r, paperEdge.g, paperEdge.b, .52f));
        }

        private void CreateSliderRow(string label, string description, float y, float value, Action<float> changed)
        {
            var row = U46ScreenFactory.Panel(page, label + "Row", new Vector2(.075f, y), new Vector2(.925f, y + .105f), null, new Color(paperRaised.r, paperRaised.g, paperRaised.b, .58f));
            AddRowEdge(row.transform);
            U46ScreenFactory.Label(row.transform, label + "Label", label, 17f, ink, new Vector2(.035f, .43f), new Vector2(.25f, .92f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Label(row.transform, label + "Description", description, 11.5f, mutedInk, new Vector2(.035f, .08f), new Vector2(.34f, .5f), TextAlignmentOptions.Left, font);

            var sliderObject = new GameObject(label + "Slider", typeof(RectTransform), typeof(Slider));
            sliderObject.transform.SetParent(row.transform, false);
            var sliderRect = sliderObject.GetComponent<RectTransform>();
            sliderRect.anchorMin = new Vector2(.36f, .17f); sliderRect.anchorMax = new Vector2(.94f, .83f);
            sliderRect.offsetMin = Vector2.zero; sliderRect.offsetMax = Vector2.zero;

            var fillArea = new GameObject("FillArea", typeof(RectTransform));
            fillArea.transform.SetParent(sliderObject.transform, false);
            var fillAreaRect = fillArea.GetComponent<RectTransform>();
            fillAreaRect.anchorMin = new Vector2(.05f, .42f); fillAreaRect.anchorMax = new Vector2(.95f, .58f);
            fillAreaRect.offsetMin = Vector2.zero; fillAreaRect.offsetMax = Vector2.zero;
            U46ScreenFactory.Panel(fillArea.transform, "Track", Vector2.zero, Vector2.one, null, new Color(ink.r, ink.g, ink.b, .22f)).GetComponent<Image>().raycastTarget = false;
            var fill = U46ScreenFactory.Panel(fillArea.transform, "Fill", Vector2.zero, Vector2.one, null, lantern);
            fill.GetComponent<Image>().raycastTarget = false;

            var slider = sliderObject.GetComponent<Slider>();
            slider.minValue = 0f; slider.maxValue = 1f; slider.value = value;
            slider.direction = Slider.Direction.LeftToRight;
            slider.fillRect = fill.GetComponent<RectTransform>();
            slider.handleRect = null;
            slider.targetGraphic = fill.GetComponent<Image>();
            slider.onValueChanged.AddListener(next => changed(Mathf.Round(next * 20f) / 20f));
        }

        private void CreateToggleRow(string label, string description, float y, Func<bool> read, Action<bool> changed)
        {
            var row = U46ScreenFactory.Panel(page, label + "Row", new Vector2(.075f, y), new Vector2(.925f, y + .105f), null, new Color(paperRaised.r, paperRaised.g, paperRaised.b, .58f));
            AddRowEdge(row.transform);
            U46ScreenFactory.Label(row.transform, label + "Label", label, 16f, ink, new Vector2(.035f, .43f), new Vector2(.65f, .92f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Label(row.transform, label + "Description", description, 11.5f, mutedInk, new Vector2(.035f, .08f), new Vector2(.65f, .5f), TextAlignmentOptions.Left, font);
            var button = U46ScreenFactory.Button(row.transform, label + "Toggle", read() ? "ON" : "OFF", null, new Vector2(.69f, .18f), new Vector2(.94f, .82f), font, null);
            RenderToggle(button, read());
            button.onClick.AddListener(() =>
            {
                changed(!read());
                button.GetComponentInChildren<TextMeshProUGUI>().text = read() ? "ON" : "OFF";
                RenderToggle(button, read());
            });
        }

        private void RenderToggle(Button button, bool on)
        {
            var image = button.GetComponent<Image>();
            image.color = on ? new Color(lantern.r, lantern.g, lantern.b, .82f) : new Color(paperEdge.r, paperEdge.g, paperEdge.b, .44f);
            var label = button.GetComponentInChildren<TextMeshProUGUI>();
            if (label != null) label.color = ink;
        }

        private void AddPaperBorder(Transform owner)
        {
            Border(owner, "Top", new Vector2(.018f, .976f), new Vector2(.982f, .982f));
            Border(owner, "Bottom", new Vector2(.018f, .018f), new Vector2(.982f, .024f));
            Border(owner, "Left", new Vector2(.018f, .018f), new Vector2(.026f, .982f));
            Border(owner, "Right", new Vector2(.974f, .018f), new Vector2(.982f, .982f));
        }

        private void AddRowEdge(Transform owner) =>
            Border(owner, "RowEdge", new Vector2(.012f, .03f), new Vector2(.02f, .97f));

        private void Border(Transform owner, string name, Vector2 min, Vector2 max)
        {
            var border = U46ScreenFactory.Panel(owner, name, min, max, null, new Color(paperEdge.r, paperEdge.g, paperEdge.b, .76f));
            border.GetComponent<Image>().raycastTarget = false;
        }

        private static void ApplyButtonColors(Button button, Color background, Color text)
        {
            button.GetComponent<Image>().color = background;
            var label = button.GetComponentInChildren<TextMeshProUGUI>();
            if (label != null) label.color = text;
        }
    }
}
