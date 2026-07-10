using UnityEngine;

namespace VampPon.UnitySpike.UI
{
    [CreateAssetMenu(menuName = "VampPon/UI/Yoruno Shirube UI Theme", fileName = "YorunoShirubeUiTheme")]
    public sealed class YorunoShirubeUiTheme : ScriptableObject
    {
        [Header("Colors")]
        public Color PaperBase = new(0.84f, 0.76f, 0.58f, 1f);
        public Color PaperRaised = new(0.94f, 0.89f, 0.8f, 1f);
        public Color PaperEdge = new(0.47f, 0.34f, 0.2f, 1f);
        public Color InkText = new(0.09f, 0.07f, 0.06f, 1f);
        public Color SecondaryText = new(0.3f, 0.23f, 0.18f, 1f);
        public Color WarmLantern = new(1f, 0.63f, 0.24f, 1f);
        public Color QuietNight = new(0.03f, 0.026f, 0.026f, 1f);
        public Color Rare = new(0.82f, 0.58f, 0.28f, 1f);
        public Color Evolution = new(0.65f, 0.45f, 0.78f, 1f);
        public Color Disabled = new(0.34f, 0.31f, 0.28f, 1f);
        public Color Completed = new(0.5f, 0.68f, 0.46f, 1f);
        public Color Kokuyou = new(0.11f, 0.07f, 0.14f, 1f);

        [Header("Spacing")]
        [Min(0f)] public float SpacingXs = 4f;
        [Min(0f)] public float SpacingS = 8f;
        [Min(0f)] public float SpacingM = 16f;
        [Min(0f)] public float SpacingL = 24f;
        [Min(0f)] public float SpacingXl = 32f;

        [Header("Typography")]
        [Min(8f)] public float CaptionSize = 12f;
        [Min(8f)] public float BodySize = 14f;
        [Min(8f)] public float ButtonSize = 16f;
        [Min(8f)] public float HeadingSize = 22f;
        [Min(8f)] public float TitleSize = 28f;

        [Header("Interaction")]
        [Min(44f)] public float MinimumTapTarget = 44f;
        [Min(44f)] public float ComfortableTapTarget = 56f;
        [Range(0.85f, 1f)] public float PressedScale = 0.96f;
        [Min(0f)] public float FastTransitionSeconds = 0.12f;
        [Min(0f)] public float StandardTransitionSeconds = 0.2f;

        public UiVisualStateStyle Resolve(UiVisualState state)
        {
            return state switch
            {
                UiVisualState.Pressed => new UiVisualStateStyle(PaperRaised, WarmLantern, InkText, 1f, PressedScale),
                UiVisualState.Selected => new UiVisualStateStyle(PaperRaised, WarmLantern, InkText, 1f, 1.02f),
                UiVisualState.Disabled => new UiVisualStateStyle(Disabled, PaperEdge, SecondaryText, 0.55f, 1f),
                UiVisualState.Locked => new UiVisualStateStyle(QuietNight, Disabled, SecondaryText, 0.65f, 1f),
                UiVisualState.New => new UiVisualStateStyle(PaperRaised, WarmLantern, InkText, 1f, 1f),
                UiVisualState.Rare => new UiVisualStateStyle(PaperRaised, Rare, InkText, 1f, 1f),
                UiVisualState.Completed => new UiVisualStateStyle(PaperRaised, Completed, InkText, 1f, 1f),
                UiVisualState.Kokuyou => new UiVisualStateStyle(Kokuyou, Evolution, Color.white, 1f, 1f),
                _ => new UiVisualStateStyle(PaperBase, PaperEdge, InkText, 1f, 1f),
            };
        }
    }
}
