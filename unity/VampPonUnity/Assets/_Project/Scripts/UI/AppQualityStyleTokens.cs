using UnityEngine;

namespace VampPon.UnitySpike.UI
{
    public static class AppQualityStyleTokens
    {
        public const float ReferenceWidth = 390f;
        public const float ReferenceHeight = 844f;
        public const float MinimumTapTarget = 44f;
        public const float ComfortableTapTarget = 56f;
        public const float PaperPanelRadius = 8f;
        public const float HudTopReservedHeight = 72f;
        public const float VirtualStickMaxWidthRatio = 0.42f;
        public const float VirtualStickMaxHeightRatio = 0.34f;

        public static readonly Color PaperBase = new(0.84f, 0.76f, 0.58f, 1f);
        public static readonly Color PaperEdge = new(0.47f, 0.34f, 0.2f, 1f);
        public static readonly Color InkText = new(0.09f, 0.07f, 0.06f, 1f);
        public static readonly Color WarmLantern = new(1f, 0.63f, 0.24f, 1f);
        public static readonly Color QuietNight = new(0.03f, 0.026f, 0.026f, 1f);
        public static readonly Color BlackInk = new(0.02f, 0.015f, 0.02f, 1f);
        public static readonly Color MorningAfter = new(0.9f, 0.77f, 0.55f, 1f);

        public static readonly Vector2 ReferenceResolution = new(ReferenceWidth, ReferenceHeight);
        public static readonly Vector2 LevelUpCardMinimumSize = new(104f, 176f);
        public static readonly Vector2 PrimaryButtonMinimumSize = new(144f, 52f);

        public const string GeneratedImageRuntimeBoundary =
            "Generated screen images are references only until approved as sliced runtime assets.";
    }
}
