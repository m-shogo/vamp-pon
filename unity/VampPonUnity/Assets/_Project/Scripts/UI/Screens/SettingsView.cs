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

        public void Build(Transform parent, TMP_FontAsset fontAsset, AppPreferenceService owner, Action close)
        {
            preferences = owner ?? throw new ArgumentNullException(nameof(owner));
            font = fontAsset;
            transform.SetParent(parent, false);
            var rect = gameObject.AddComponent<RectTransform>();
            rect.anchorMin = Vector2.zero; rect.anchorMax = Vector2.one; rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;
            U46ScreenFactory.Panel(transform, "SettingsBlocker", Vector2.zero, Vector2.one, null, AppQualityStyleTokens.QuietNight);
            page = U46ScreenFactory.Panel(transform, "SettingsPaper", new Vector2(.055f, .08f), new Vector2(.945f, .94f), AppQualityAssetProvider.StageSelectMapPanel, AppQualityStyleTokens.PaperBase).transform;
            U46ScreenFactory.Label(page, "SettingsTitle", "設定", 29f, Ink(), new Vector2(.08f, .89f), new Vector2(.92f, .97f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Label(page, "SettingsPurpose", "今の体験を、端末に合わせる", 13f, Ink(), new Vector2(.08f, .83f), new Vector2(.92f, .89f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Label(page, "AudioHeading", "音", 17f, Ink(), new Vector2(.08f, .74f), new Vector2(.92f, .81f), TextAlignmentOptions.Left, font);
            CreateSlider("BGM", .65f, preferences.Current.bgmVolume, preferences.SetBgmVolume);
            CreateSlider("SE", .53f, preferences.Current.seVolume, preferences.SetSeVolume);
            U46ScreenFactory.Label(page, "MotionHeading", "操作・演出", 17f, Ink(), new Vector2(.08f, .41f), new Vector2(.92f, .48f), TextAlignmentOptions.Left, font);
            CreateToggle("振動", .33f, () => preferences.Current.hapticsEnabled, preferences.SetHapticsEnabled);
            CreateToggle("演出を控えめに", .22f, () => preferences.Current.reducedMotion, preferences.SetReducedMotion);
            U46ScreenFactory.Button(page, "CloseSettingsButton", "戻る", AppQualityAssetProvider.PaperButtonFrame, new Vector2(.22f, .035f), new Vector2(.78f, .105f), font, close);
            gameObject.SetActive(false);
        }

        public void Show() => gameObject.SetActive(true);
        public void Hide() => gameObject.SetActive(false);

        private void CreateSlider(string label, float centerY, float value, Action<float> changed)
        {
            U46ScreenFactory.Label(page, label + "Label", label, 16f, Ink(), new Vector2(.09f, centerY + .02f), new Vector2(.32f, centerY + .09f), TextAlignmentOptions.Left, font);
            var sliderObject = new GameObject(label + "Slider", typeof(RectTransform), typeof(Slider));
            sliderObject.transform.SetParent(page, false);
            var rect = sliderObject.GetComponent<RectTransform>(); rect.anchorMin = new Vector2(.34f, centerY + .02f); rect.anchorMax = new Vector2(.9f, centerY + .09f); rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;
            var background = U46ScreenFactory.Panel(sliderObject.transform, "Track", new Vector2(0f, .38f), new Vector2(1f, .62f), null, new Color(.18f, .12f, .08f, .28f));
            var fill = U46ScreenFactory.Panel(sliderObject.transform, "Fill", new Vector2(0f, .38f), new Vector2(1f, .62f), null, AppQualityStyleTokens.WarmLantern);
            var fillArea = fill.GetComponent<RectTransform>();
            var handle = U46ScreenFactory.Panel(sliderObject.transform, "Handle", new Vector2(0f, .18f), new Vector2(.13f, .82f), null, AppQualityStyleTokens.WarmLantern);
            var slider = sliderObject.GetComponent<Slider>(); slider.minValue = 0f; slider.maxValue = 1f; slider.value = value; slider.fillRect = fillArea; slider.handleRect = handle.GetComponent<RectTransform>(); slider.targetGraphic = handle.GetComponent<Image>();
            slider.onValueChanged.AddListener(next => changed(Mathf.Round(next * 20f) / 20f));
            background.GetComponent<Image>().raycastTarget = false;
        }

        private void CreateToggle(string label, float centerY, Func<bool> read, Action<bool> changed)
        {
            U46ScreenFactory.Label(page, label + "Label", label, 16f, Ink(), new Vector2(.09f, centerY), new Vector2(.62f, centerY + .08f), TextAlignmentOptions.Left, font);
            var button = U46ScreenFactory.Button(page, label + "Toggle", read() ? "ON" : "OFF", AppQualityAssetProvider.PaperButtonFrame, new Vector2(.66f, centerY), new Vector2(.9f, centerY + .08f), font, null);
            button.onClick.AddListener(() =>
            {
                changed(!read());
                button.GetComponentInChildren<TextMeshProUGUI>().text = read() ? "ON" : "OFF";
            });
        }

        private static Color Ink() => AppQualityStyleTokens.InkText;
    }
}
