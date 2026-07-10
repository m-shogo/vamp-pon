using System.IO;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U46UiDesignSystemBootstrap
    {
        public const string ThemeAssetPath = "Assets/_Project/Resources/UI/YorunoShirubeUiTheme.asset";
        public const string ResponsiveAssetPath = "Assets/_Project/Resources/UI/YorunoShirubeResponsiveLayout.asset";
        public const string PrefabRoot = "Assets/_Project/Prefabs/UI";

        [MenuItem("VampPon/UI/Create or Refresh Design System Assets")]
        public static void CreateOrRefresh()
        {
            EnsureFolder("Assets/_Project/Resources/UI");
            EnsureFolder(PrefabRoot);
            EnsureFolder(PrefabRoot + "/Base");
            EnsureFolder(PrefabRoot + "/Variants");

            var theme = AssetDatabase.LoadAssetAtPath<YorunoShirubeUiTheme>(ThemeAssetPath);
            if (theme == null)
            {
                theme = ScriptableObject.CreateInstance<YorunoShirubeUiTheme>();
                AssetDatabase.CreateAsset(theme, ThemeAssetPath);
            }

            var responsive = AssetDatabase.LoadAssetAtPath<ResponsiveLayoutProfile>(ResponsiveAssetPath);
            if (responsive == null)
            {
                responsive = ScriptableObject.CreateInstance<ResponsiveLayoutProfile>();
                AssetDatabase.CreateAsset(responsive, ResponsiveAssetPath);
            }

            EditorUtility.SetDirty(theme);
            EditorUtility.SetDirty(responsive);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            UiThemeRuntime.Reload();
            UiResponsiveRuntime.Reload();

            Selection.activeObject = theme;
            Debug.Log("Yoruno Shirube UI design system assets are ready. Prefab variants remain editor-authored under Assets/_Project/Prefabs/UI.");
        }

        [MenuItem("VampPon/UI/Validate Design System Assets")]
        public static void ValidateAssets()
        {
            var theme = AssetDatabase.LoadAssetAtPath<YorunoShirubeUiTheme>(ThemeAssetPath);
            var responsive = AssetDatabase.LoadAssetAtPath<ResponsiveLayoutProfile>(ResponsiveAssetPath);
            var importReady = UiSpriteImportPolicyValidator.Validate(logSuccess: false);

            if (theme == null || responsive == null || !importReady)
            {
                throw new System.InvalidOperationException(
                    $"UI design system validation failed: theme={theme != null}, responsive={responsive != null}, importPolicy={importReady}");
            }

            Debug.Log("UI design system validation passed.");
        }

        private static void EnsureFolder(string path)
        {
            if (AssetDatabase.IsValidFolder(path))
            {
                return;
            }

            var parent = Path.GetDirectoryName(path)?.Replace('\\', '/');
            var name = Path.GetFileName(path);
            if (string.IsNullOrEmpty(parent) || string.IsNullOrEmpty(name))
            {
                return;
            }

            EnsureFolder(parent);
            AssetDatabase.CreateFolder(parent, name);
        }
    }
}
