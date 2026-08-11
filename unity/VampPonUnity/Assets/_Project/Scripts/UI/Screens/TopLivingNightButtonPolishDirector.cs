using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    // TOP-only visual refinement for the existing navigation buttons. This does
    // not rebuild layout, replace callbacks, or shrink tap targets: it restyles
    // the already-created Button/Image/TMP hierarchy after TopLivingNightView has
    // built it, keeping gameplay and app-flow ownership untouched.
    [DefaultExecutionOrder(940)]
    public sealed class TopLivingNightButtonPolishDirector : MonoBehaviour
    {
        private const float UnboundSearchInterval = .15f;
        private const float BoundSearchInterval = 1f;
        private const string PolishRootName = "TopButtonPolish";

        private static TopLivingNightButtonPolishDirector instance;

        private TopLivingNightView top;
        private float nextSearchAt;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<TopLivingNightButtonPolishDirector>();
            if (instance != null)
                return;

            var directorObject = new GameObject(
                "TopLivingNightButtonPolishDirector",
                typeof(TopLivingNightButtonPolishDirector));
            DontDestroyOnLoad(directorObject);
            instance = directorObject.GetComponent<TopLivingNightButtonPolishDirector>();
        }

        private void Awake()
        {
            if (instance != null && instance != this)
            {
                Destroy(gameObject);
                return;
            }

            instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Update()
        {
            var time = Time.unscaledTime;
            if (time < nextSearchAt)
                return;

            var current = FindFirstObjectByType<TopLivingNightView>();
            if (current != top)
                top = current;

            nextSearchAt = time + (top == null ? UnboundSearchInterval : BoundSearchInterval);
            if (top == null || !top.isActiveAndEnabled)
                return;

            StyleButton("OpenStageSelectButton", true, "DEPART");
            StyleButton("OpenCollectionFromTopButton", false, "ARCHIVE");
            StyleAmbientCopy();
        }

        private void StyleButton(string name, bool primary, string microCopy)
        {
            var transform = FindTransform(top.transform, name);
            if (transform == null)
                return;

            var button = transform.GetComponent<Button>();
            var image = transform.GetComponent<Image>();
            if (button == null || image == null || transform.Find(PolishRootName) != null)
                return;

            // The old shared paper sprite reads as a generic UI card at TOP scale.
            // Keep the exact RectTransform/tap target but turn the visual surface into
            // a quiet station-sign/ticket rail: dark ink field + thin warm rules.
            image.sprite = null;
            image.type = Image.Type.Simple;
            image.color = primary
                ? new Color(.030f, .035f, .064f, .82f)
                : new Color(.025f, .030f, .055f, .62f);

            button.transition = Selectable.Transition.ColorTint;
            var colors = button.colors;
            colors.normalColor = Color.white;
            colors.highlightedColor = new Color(.96f, .92f, .82f, 1f);
            colors.pressedColor = new Color(.78f, .72f, .61f, 1f);
            colors.selectedColor = new Color(.96f, .92f, .82f, 1f);
            colors.disabledColor = new Color(.54f, .54f, .58f, .58f);
            colors.colorMultiplier = 1f;
            colors.fadeDuration = .11f;
            button.colors = colors;

            var labelTransform = transform.Find("Label");
            var label = labelTransform != null
                ? labelTransform.GetComponent<TextMeshProUGUI>()
                : null;
            if (label != null)
            {
                label.color = primary
                    ? new Color(.96f, .90f, .76f, 1f)
                    : new Color(.90f, .87f, .79f, .94f);
                label.fontStyle = FontStyles.Normal;
                label.fontSize = primary ? 17f : 15f;
                label.fontSizeMax = label.fontSize;
                label.fontSizeMin = primary ? 13f : 12f;
                label.characterSpacing = primary ? 2.0f : 1.2f;
                label.overflowMode = TextOverflowModes.Ellipsis;

                var labelRect = label.rectTransform;
                labelRect.anchorMin = primary
                    ? new Vector2(.12f, .15f)
                    : new Vector2(.12f, .10f);
                labelRect.anchorMax = primary
                    ? new Vector2(.88f, .67f)
                    : new Vector2(.88f, .72f);
                labelRect.offsetMin = Vector2.zero;
                labelRect.offsetMax = Vector2.zero;
            }

            var polish = new GameObject(PolishRootName, typeof(RectTransform));
            polish.transform.SetParent(transform, false);
            var polishRect = polish.GetComponent<RectTransform>();
            Stretch(polishRect, Vector2.zero, Vector2.one);
            polish.transform.SetAsLastSibling();

            var ruleColor = primary
                ? new Color(.78f, .61f, .35f, .58f)
                : new Color(.72f, .64f, .48f, .34f);
            CreateRule(polish.transform, "TopRule", .075f, .925f, .84f, primary ? 1.2f : .8f, ruleColor);
            CreateRule(polish.transform, "BottomRule", .075f, .925f, .13f, primary ? 1.0f : .7f, ruleColor);
            CreateEndMark(polish.transform, "LeftMark", .075f, primary, ruleColor);
            CreateEndMark(polish.transform, "RightMark", .925f, primary, ruleColor);

            if (label != null)
            {
                var micro = CreateMicroLabel(
                    polish.transform,
                    microCopy,
                    label.font,
                    primary
                        ? new Color(.78f, .70f, .57f, .82f)
                        : new Color(.71f, .68f, .61f, .64f));
                var microRect = micro.rectTransform;
                microRect.anchorMin = primary
                    ? new Vector2(.15f, .65f)
                    : new Vector2(.15f, .67f);
                microRect.anchorMax = primary
                    ? new Vector2(.85f, .83f)
                    : new Vector2(.85f, .88f);
                microRect.offsetMin = Vector2.zero;
                microRect.offsetMax = Vector2.zero;
            }
        }

        private void StyleAmbientCopy()
        {
            var transform = FindTransform(top.transform, "AmbientCopy");
            var label = transform != null
                ? transform.GetComponent<TextMeshProUGUI>()
                : null;
            if (label == null)
                return;

            label.color = new Color(.88f, .85f, .78f, .76f);
            label.fontStyle = FontStyles.Normal;
            label.fontSize = 11.5f;
            label.fontSizeMax = 11.5f;
            label.fontSizeMin = 10f;
            label.characterSpacing = .55f;
        }

        private static TextMeshProUGUI CreateMicroLabel(
            Transform parent,
            string text,
            TMP_FontAsset font,
            Color color)
        {
            var gameObject = new GameObject(
                "MicroCopy",
                typeof(RectTransform),
                typeof(TextMeshProUGUI));
            gameObject.transform.SetParent(parent, false);
            var label = gameObject.GetComponent<TextMeshProUGUI>();
            label.text = text;
            label.alignment = TextAlignmentOptions.Center;
            label.fontSize = 8.5f;
            label.fontSizeMin = 7.5f;
            label.fontSizeMax = 8.5f;
            label.enableAutoSizing = true;
            label.characterSpacing = 5f;
            label.color = color;
            label.raycastTarget = false;
            label.textWrappingMode = TextWrappingModes.NoWrap;
            label.overflowMode = TextOverflowModes.Overflow;
            if (font != null)
                label.font = font;
            return label;
        }

        private static void CreateRule(
            Transform parent,
            string name,
            float minX,
            float maxX,
            float anchorY,
            float height,
            Color color)
        {
            var gameObject = new GameObject(name, typeof(RectTransform), typeof(Image));
            gameObject.transform.SetParent(parent, false);
            var rect = gameObject.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(minX, anchorY);
            rect.anchorMax = new Vector2(maxX, anchorY);
            rect.pivot = new Vector2(.5f, .5f);
            rect.offsetMin = new Vector2(0f, -height * .5f);
            rect.offsetMax = new Vector2(0f, height * .5f);
            var image = gameObject.GetComponent<Image>();
            image.color = color;
            image.raycastTarget = false;
        }

        private static void CreateEndMark(
            Transform parent,
            string name,
            float anchorX,
            bool primary,
            Color color)
        {
            var gameObject = new GameObject(name, typeof(RectTransform), typeof(Image));
            gameObject.transform.SetParent(parent, false);
            var rect = gameObject.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(anchorX, .5f);
            rect.anchorMax = new Vector2(anchorX, .5f);
            rect.pivot = new Vector2(.5f, .5f);
            rect.sizeDelta = new Vector2(primary ? 2f : 1.5f, primary ? 14f : 10f);
            rect.anchoredPosition = Vector2.zero;
            var image = gameObject.GetComponent<Image>();
            image.color = color;
            image.raycastTarget = false;
        }

        private static void Stretch(RectTransform rect, Vector2 min, Vector2 max)
        {
            rect.anchorMin = min;
            rect.anchorMax = max;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }

        private static Transform FindTransform(Transform root, string name)
        {
            if (root == null)
                return null;
            if (string.Equals(root.name, name, StringComparison.Ordinal))
                return root;

            for (var index = 0; index < root.childCount; index++)
            {
                var found = FindTransform(root.GetChild(index), name);
                if (found != null)
                    return found;
            }

            return null;
        }

        private void OnDestroy()
        {
            top = null;
            if (instance == this)
                instance = null;
        }
    }
}
