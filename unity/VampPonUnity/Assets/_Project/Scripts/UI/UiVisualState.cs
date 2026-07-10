using System;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI
{
    public enum UiVisualState
    {
        Normal,
        Pressed,
        Selected,
        Disabled,
        Locked,
        New,
        Rare,
        Completed,
        Kokuyou,
    }

    [Serializable]
    public struct UiVisualStateStyle
    {
        public Color Background;
        public Color Border;
        public Color Text;
        [Range(0f, 1f)] public float Alpha;
        [Min(0.8f)] public float Scale;

        public UiVisualStateStyle(Color background, Color border, Color text, float alpha = 1f, float scale = 1f)
        {
            Background = background;
            Border = border;
            Text = text;
            Alpha = alpha;
            Scale = scale;
        }
    }

    /// <summary>
    /// Shared state renderer for prefab-based UI. Existing runtime-created UI can adopt this incrementally.
    /// </summary>
    public sealed class UiVisualStateView : MonoBehaviour
    {
        [SerializeField] private Image background;
        [SerializeField] private Image border;
        [SerializeField] private CanvasGroup canvasGroup;
        [SerializeField] private UiVisualState currentState = UiVisualState.Normal;

        public UiVisualState CurrentState => currentState;

        public void Bind(Image backgroundImage, Image borderImage = null, CanvasGroup group = null)
        {
            background = backgroundImage;
            border = borderImage;
            canvasGroup = group;
            Apply(currentState);
        }

        public void Apply(UiVisualState state)
        {
            currentState = state;
            var style = UiThemeRuntime.Resolve(state);

            if (background != null)
            {
                background.color = style.Background;
            }

            if (border != null)
            {
                border.color = style.Border;
            }

            if (canvasGroup == null)
            {
                canvasGroup = GetComponent<CanvasGroup>();
            }

            if (canvasGroup != null)
            {
                canvasGroup.alpha = style.Alpha;
                canvasGroup.interactable = state != UiVisualState.Disabled && state != UiVisualState.Locked;
                canvasGroup.blocksRaycasts = canvasGroup.interactable;
            }

            transform.localScale = Vector3.one * style.Scale;
        }
    }
}
