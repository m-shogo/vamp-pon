using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.UI;

namespace VampPon.UnitySpike.Editor
{
    public sealed class U46UiComponentCatalogWindow : EditorWindow
    {
        private Vector2 scroll;

        [MenuItem("VampPon/UI/Open Component Catalog")]
        public static void Open()
        {
            var window = GetWindow<U46UiComponentCatalogWindow>("Yoruno UI Catalog");
            window.minSize = new Vector2(520f, 560f);
            window.Show();
        }

        private void OnGUI()
        {
            DrawToolbar();
            scroll = EditorGUILayout.BeginScrollView(scroll);

            EditorGUILayout.Space(8f);
            EditorGUILayout.LabelField("ヨルノシルベ UI Component Catalog", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox(
                "Runtime UI remains uGUI. This editor-only catalog is the visual source of truth for theme tokens, states, responsive tiers, sliced sprites, and prefab variant coverage.",
                MessageType.Info);

            DrawThemeSection();
            DrawStateSection();
            DrawResponsiveSection();
            DrawComponentCoverage();
            DrawAssetStatus();

            EditorGUILayout.EndScrollView();
        }

        private static void DrawToolbar()
        {
            EditorGUILayout.BeginHorizontal(EditorStyles.toolbar);
            if (GUILayout.Button("Create / Refresh Assets", EditorStyles.toolbarButton))
            {
                U46UiDesignSystemBootstrap.CreateOrRefresh();
            }

            if (GUILayout.Button("Validate", EditorStyles.toolbarButton))
            {
                U46UiDesignSystemBootstrap.ValidateAssets();
            }

            GUILayout.FlexibleSpace();
            EditorGUILayout.LabelField("Editor-only / no production runtime dependency", EditorStyles.miniLabel, GUILayout.Width(235f));
            EditorGUILayout.EndHorizontal();
        }

        private static void DrawThemeSection()
        {
            EditorGUILayout.Space(10f);
            EditorGUILayout.LabelField("Theme Tokens", EditorStyles.boldLabel);
            var theme = UiThemeRuntime.Current;
            DrawColorRow("Paper", theme.PaperBase, theme.PaperRaised, theme.PaperEdge);
            DrawColorRow("Ink / Lantern", theme.InkText, theme.SecondaryText, theme.WarmLantern);
            DrawColorRow("Rare / Evolution / Kokuyou", theme.Rare, theme.Evolution, theme.Kokuyou);
            EditorGUILayout.LabelField(
                $"Spacing: {theme.SpacingXs} / {theme.SpacingS} / {theme.SpacingM} / {theme.SpacingL} / {theme.SpacingXl}    Tap: {theme.MinimumTapTarget} / {theme.ComfortableTapTarget}",
                EditorStyles.miniLabel);
        }

        private static void DrawStateSection()
        {
            EditorGUILayout.Space(10f);
            EditorGUILayout.LabelField("Visual States", EditorStyles.boldLabel);
            DrawState(UiVisualState.Normal);
            DrawState(UiVisualState.Pressed);
            DrawState(UiVisualState.Selected);
            DrawState(UiVisualState.Disabled);
            DrawState(UiVisualState.Locked);
            DrawState(UiVisualState.New);
            DrawState(UiVisualState.Rare);
            DrawState(UiVisualState.Completed);
            DrawState(UiVisualState.Kokuyou);
        }

        private static void DrawResponsiveSection()
        {
            EditorGUILayout.Space(10f);
            EditorGUILayout.LabelField("Responsive Layout Profiles", EditorStyles.boldLabel);
            var profile = UiResponsiveRuntime.Current;
            DrawMetrics("Compact 360x800", profile.Resolve(360f, 800f));
            DrawMetrics("Standard 390x844", profile.Resolve(390f, 844f));
            DrawMetrics("Large 430x932", profile.Resolve(430f, 932f));
        }

        private static void DrawComponentCoverage()
        {
            EditorGUILayout.Space(10f);
            EditorGUILayout.LabelField("Required Component Coverage", EditorStyles.boldLabel);
            EditorGUILayout.LabelField("• BasePaperButton → Primary / Secondary / Danger variants");
            EditorGUILayout.LabelField("• BasePaperCard → Common / Rare / Evolution variants");
            EditorGUILayout.LabelField("• BaseSlot → Weapon / Passive / Rare variants");
            EditorGUILayout.LabelField("• StageCard / ResultLedger / CollectionEntry / BossWarning");
            EditorGUILayout.HelpBox(
                "Prefab inheritance must remain Base → Variant only. Do not build deep multi-level prefab inheritance.",
                MessageType.None);
        }

        private static void DrawAssetStatus()
        {
            EditorGUILayout.Space(10f);
            EditorGUILayout.LabelField("Asset Status", EditorStyles.boldLabel);
            DrawPathStatus(U46UiDesignSystemBootstrap.ThemeAssetPath);
            DrawPathStatus(U46UiDesignSystemBootstrap.ResponsiveAssetPath);
            DrawPathStatus(U46UiDesignSystemBootstrap.PrefabRoot + "/Base");
            DrawPathStatus(U46UiDesignSystemBootstrap.PrefabRoot + "/Variants");
        }

        private static void DrawColorRow(string label, Color a, Color b, Color c)
        {
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField(label, GUILayout.Width(170f));
            DrawColorBox(a);
            DrawColorBox(b);
            DrawColorBox(c);
            GUILayout.FlexibleSpace();
            EditorGUILayout.EndHorizontal();
        }

        private static void DrawColorBox(Color color)
        {
            var rect = GUILayoutUtility.GetRect(58f, 18f, GUILayout.Width(58f));
            EditorGUI.DrawRect(rect, color);
        }

        private static void DrawState(UiVisualState state)
        {
            var style = UiThemeRuntime.Resolve(state);
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField(state.ToString(), GUILayout.Width(120f));
            var rect = GUILayoutUtility.GetRect(230f, 24f, GUILayout.Width(230f));
            EditorGUI.DrawRect(rect, style.Background);
            var borderRect = new Rect(rect.x, rect.y, rect.width, 3f);
            EditorGUI.DrawRect(borderRect, style.Border);
            var labelStyle = new GUIStyle(EditorStyles.label);
            labelStyle.normal.textColor = style.Text;
            GUI.Label(rect, $"  alpha {style.Alpha:0.00} / scale {style.Scale:0.00}", labelStyle);
            GUILayout.FlexibleSpace();
            EditorGUILayout.EndHorizontal();
        }

        private static void DrawMetrics(string label, UiLayoutMetrics metrics)
        {
            EditorGUILayout.LabelField(
                $"{label}: {metrics.Tier} / card {metrics.CardWidth} / gap {metrics.CardGap} / padding {metrics.HorizontalPadding} / HUD {metrics.HudHeight}");
        }

        private static void DrawPathStatus(string path)
        {
            var exists = AssetDatabase.LoadAssetAtPath<Object>(path) != null || AssetDatabase.IsValidFolder(path);
            EditorGUILayout.LabelField(exists ? "✓" : "○", path);
        }
    }
}
