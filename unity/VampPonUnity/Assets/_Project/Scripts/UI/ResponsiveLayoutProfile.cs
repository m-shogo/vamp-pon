using System;
using UnityEngine;

namespace VampPon.UnitySpike.UI
{
    public enum UiLayoutTier
    {
        Compact,
        Standard,
        Large,
    }

    [Serializable]
    public struct UiLayoutMetrics
    {
        public UiLayoutTier Tier;
        public float SpacingMultiplier;
        public float CardWidth;
        public float CardGap;
        public float HorizontalPadding;
        public float HudHeight;

        public UiLayoutMetrics(
            UiLayoutTier tier,
            float spacingMultiplier,
            float cardWidth,
            float cardGap,
            float horizontalPadding,
            float hudHeight)
        {
            Tier = tier;
            SpacingMultiplier = spacingMultiplier;
            CardWidth = cardWidth;
            CardGap = cardGap;
            HorizontalPadding = horizontalPadding;
            HudHeight = hudHeight;
        }
    }

    [CreateAssetMenu(menuName = "VampPon/UI/Responsive Layout Profile", fileName = "YorunoShirubeResponsiveLayout")]
    public sealed class ResponsiveLayoutProfile : ScriptableObject
    {
        [Header("Breakpoints")]
        [Min(320f)] public float CompactMaxWidth = 379f;
        [Min(360f)] public float LargeMinWidth = 410f;

        [Header("Compact")]
        public float CompactSpacingMultiplier = 0.82f;
        public float CompactCardWidth = 96f;
        public float CompactCardGap = 6f;
        public float CompactHorizontalPadding = 12f;
        public float CompactHudHeight = 68f;

        [Header("Standard")]
        public float StandardSpacingMultiplier = 1f;
        public float StandardCardWidth = 108f;
        public float StandardCardGap = 10f;
        public float StandardHorizontalPadding = 16f;
        public float StandardHudHeight = 72f;

        [Header("Large")]
        public float LargeSpacingMultiplier = 1.12f;
        public float LargeCardWidth = 118f;
        public float LargeCardGap = 12f;
        public float LargeHorizontalPadding = 20f;
        public float LargeHudHeight = 76f;

        public UiLayoutTier ResolveTier(float width)
        {
            if (width <= CompactMaxWidth)
            {
                return UiLayoutTier.Compact;
            }

            return width >= LargeMinWidth ? UiLayoutTier.Large : UiLayoutTier.Standard;
        }

        public UiLayoutMetrics Resolve(float width, float height)
        {
            return ResolveTier(width) switch
            {
                UiLayoutTier.Compact => new UiLayoutMetrics(
                    UiLayoutTier.Compact,
                    CompactSpacingMultiplier,
                    CompactCardWidth,
                    CompactCardGap,
                    CompactHorizontalPadding,
                    CompactHudHeight),
                UiLayoutTier.Large => new UiLayoutMetrics(
                    UiLayoutTier.Large,
                    LargeSpacingMultiplier,
                    LargeCardWidth,
                    LargeCardGap,
                    LargeHorizontalPadding,
                    LargeHudHeight),
                _ => new UiLayoutMetrics(
                    UiLayoutTier.Standard,
                    StandardSpacingMultiplier,
                    StandardCardWidth,
                    StandardCardGap,
                    StandardHorizontalPadding,
                    StandardHudHeight),
            };
        }
    }

    public static class UiResponsiveRuntime
    {
        public const string ResourcePath = "UI/YorunoShirubeResponsiveLayout";

        private static ResponsiveLayoutProfile cached;
        private static ResponsiveLayoutProfile fallback;

        public static ResponsiveLayoutProfile Current
        {
            get
            {
                if (cached != null)
                {
                    return cached;
                }

                cached = Resources.Load<ResponsiveLayoutProfile>(ResourcePath);
                if (cached != null)
                {
                    return cached;
                }

                fallback ??= ScriptableObject.CreateInstance<ResponsiveLayoutProfile>();
                fallback.hideFlags = HideFlags.HideAndDontSave;
                return fallback;
            }
        }

        public static UiLayoutMetrics ResolveCurrentScreen()
        {
            return Current.Resolve(Screen.width, Screen.height);
        }

        public static void Reload()
        {
            cached = null;
        }
    }
}
