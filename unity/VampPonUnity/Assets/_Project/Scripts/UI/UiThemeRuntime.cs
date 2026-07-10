using UnityEngine;

namespace VampPon.UnitySpike.UI
{
    public static class UiThemeRuntime
    {
        public const string ResourcePath = "UI/YorunoShirubeUiTheme";

        private static YorunoShirubeUiTheme cached;
        private static YorunoShirubeUiTheme fallback;

        public static YorunoShirubeUiTheme Current
        {
            get
            {
                if (cached != null)
                {
                    return cached;
                }

                cached = Resources.Load<YorunoShirubeUiTheme>(ResourcePath);
                if (cached != null)
                {
                    return cached;
                }

                fallback ??= ScriptableObject.CreateInstance<YorunoShirubeUiTheme>();
                fallback.hideFlags = HideFlags.HideAndDontSave;
                return fallback;
            }
        }

        public static UiVisualStateStyle Resolve(UiVisualState state) => Current.Resolve(state);

        public static void Reload()
        {
            cached = null;
        }
    }
}
