using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime.PlayerFacing;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class FirstRunView : MonoBehaviour
    {
        private TMP_FontAsset font;
        private Transform page;
        private TextMeshProUGUI errorLabel;
        private Action continueAction;
        private Color ink;
        private Color mutedInk;
        private Color paperEdge;
        private Color lantern;

        public void Build(Transform parent, TMP_FontAsset fontAsset)
        {
            font = fontAsset;
            var theme = UiThemeRuntime.Current;
            ink = theme.InkText; mutedInk = theme.SecondaryText; paperEdge = theme.PaperEdge; lantern = theme.WarmLantern;
            transform.SetParent(parent, false);
            var rect = gameObject.AddComponent<RectTransform>();
            rect.anchorMin = Vector2.zero; rect.anchorMax = Vector2.one; rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;

            U46ScreenFactory.Panel(transform, "FirstRunBlocker", Vector2.zero, Vector2.one, null, new Color(theme.QuietNight.r, theme.QuietNight.g, theme.QuietNight.b, .985f));
            page = U46ScreenFactory.Panel(transform, "FirstRunPaper", new Vector2(.075f, .12f), new Vector2(.925f, .9f), null, theme.PaperBase).transform;
            AddBorder();
            U46ScreenFactory.Panel(page, "FirstRunHeaderWash", new Vector2(.025f, .79f), new Vector2(.975f, .975f), null, new Color(theme.PaperRaised.r, theme.PaperRaised.g, theme.PaperRaised.b, .72f));
            U46ScreenFactory.Label(page, "FirstRunKicker", "最初の夜", 12f, mutedInk, new Vector2(.12f, .9f), new Vector2(.88f, .955f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Label(page, "FirstRunTitle", "旅立ちの前に", 27f, ink, new Vector2(.12f, .825f), new Vector2(.88f, .91f), TextAlignmentOptions.Center, font);
            var accent = U46ScreenFactory.Decoration(page, "FirstRunLanternAccent", AppQualityAssetProvider.SmallLanternAccent, new Vector2(.86f, .87f), new Vector2(38f, 38f), Vector2.zero);
            accent.color = new Color(1f, 1f, 1f, .82f); accent.raycastTarget = false;

            GuidanceRow("01", PlayerFacingCopy.FirstRunMove, .655f, true);
            GuidanceRow("02", PlayerFacingCopy.FirstRunAutoAttack, .53f, false);
            GuidanceRow("03", PlayerFacingCopy.FirstRunFragmentLevelUp, .405f, false);
            GuidanceRow("04", PlayerFacingCopy.FirstRunCarryHome(), .255f, false);

            errorLabel = U46ScreenFactory.Label(page, "FirstRunError", string.Empty, 11.5f, new Color(.45f, .13f, .08f, 1f), new Vector2(.1f, .19f), new Vector2(.9f, .245f), TextAlignmentOptions.Center, font);
            var continueButton = U46ScreenFactory.Button(page, "FirstRunContinueButton", "夜へ進む", AppQualityAssetProvider.PaperButtonFrame, new Vector2(.18f, .065f), new Vector2(.82f, .16f), font, () => continueAction?.Invoke());
            continueButton.GetComponent<Image>().color = theme.PaperRaised;
            continueButton.GetComponentInChildren<TextMeshProUGUI>().color = ink;
            gameObject.SetActive(false);
        }

        public void Show(Action onContinue, bool reducedMotion)
        {
            continueAction = onContinue;
            errorLabel.text = string.Empty;
            gameObject.SetActive(true);
            transform.SetAsLastSibling();
            // The production presentation is intentionally static. Reduced motion therefore
            // preserves identical meaning and never delays the moment gameplay becomes available.
        }

        public void Hide()
        {
            continueAction = null;
            gameObject.SetActive(false);
        }

        public void ShowError(string message)
        {
            errorLabel.text = message ?? string.Empty;
        }

        private void GuidanceRow(string number, string text, float y, bool primary)
        {
            var theme = UiThemeRuntime.Current;
            var row = U46ScreenFactory.Panel(page, "FirstRunGuidance" + number, new Vector2(.08f, y), new Vector2(.92f, y + .095f), null, new Color(theme.PaperRaised.r, theme.PaperRaised.g, theme.PaperRaised.b, primary ? .72f : .5f));
            var marker = U46ScreenFactory.Panel(row.transform, "Marker", new Vector2(.035f, .24f), new Vector2(.14f, .76f), null, primary ? lantern : new Color(paperEdge.r, paperEdge.g, paperEdge.b, .58f));
            marker.GetComponent<Image>().raycastTarget = false;
            U46ScreenFactory.Label(marker.transform, "Number", number, 11f, ink, Vector2.zero, Vector2.one, TextAlignmentOptions.Center, font).raycastTarget = false;
            U46ScreenFactory.Label(row.transform, "Copy", text, primary ? 16f : 14f, ink, new Vector2(.17f, .08f), new Vector2(.96f, .92f), TextAlignmentOptions.Left, font).raycastTarget = false;
        }

        private void AddBorder()
        {
            Border("Top", new Vector2(.018f, .974f), new Vector2(.982f, .982f));
            Border("Bottom", new Vector2(.018f, .018f), new Vector2(.982f, .026f));
            Border("Left", new Vector2(.018f, .018f), new Vector2(.026f, .982f));
            Border("Right", new Vector2(.974f, .018f), new Vector2(.982f, .982f));
        }

        private void Border(string name, Vector2 min, Vector2 max)
        {
            var border = U46ScreenFactory.Panel(page, name, min, max, null, new Color(paperEdge.r, paperEdge.g, paperEdge.b, .78f));
            border.GetComponent<Image>().raycastTarget = false;
        }
    }
}
