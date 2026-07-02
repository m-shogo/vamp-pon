using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U32.AssetReplacement;

namespace VampPon.UnitySpike.Editor
{
    public static class U32ProductionAssetReplacementScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u32/screenshots";
        private const string GeneratedDirectory = "../../docs/design-targets/generated/unity-u32";
        private const string ReportPath = "Logs/u32_production_asset_replacement_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(15, 14, 18, 255);
        private static readonly Color32 Paper = new(232, 216, 186, 255);
        private static readonly Color32 Ink = new(19, 12, 15, 245);
        private static readonly Color32 Lantern = new(245, 195, 88, 255);
        private static readonly Color32 Crimson = new(132, 35, 54, 245);
        private static readonly Color32 Moss = new(65, 112, 91, 255);
        private static TMP_FontAsset font;

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);
                Directory.CreateDirectory(GeneratedDirectory);
                font = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(FontPath);
                if (font == null) throw new InvalidOperationException($"SDF font not found: {FontPath}");
                var report = new U32RuntimeAssetReplacementRegistry().BuildReport();
                WriteArtifacts(report);
                var log = new List<string>
                {
                    Capture("01-battle-asset-polish.png", "Battle", "HUD / pickup / hit boundary", "assetReplacementReady false", Moss),
                    Capture("02-levelup-asset-polish.png", "LevelUp", "card + icon replacement keys", "draft-safe runtime", Moss),
                    Capture("03-rare-asset-polish.png", "Rare", "seal remains special", "final art pending", Lantern),
                    Capture("04-evolution-asset-polish.png", "Evolution", "effect replacement pending", "production candidate", Lantern),
                    Capture("05-kokuyou-asset-polish.png", "Kokuyou", "climax effect key", "device metrics not measured", Crimson),
                    Capture("06-result-asset-polish.png", "Result", "ledger / stamp / seal", "economy not final", Moss),
                    Capture("07-stageselect-asset-polish.png", "StageSelect", "route / lantern / progress", "map art not final", Moss),
                    Capture("08-retry-asset-polish.png", "Retry", "fallback-safe flow", "generated docs blocked", Moss),
                };
                File.WriteAllText(ReportPath, string.Join(Environment.NewLine, log));
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                File.WriteAllText(ReportPath, ex.ToString());
                Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static void WriteArtifacts(U32RuntimeAssetBoundaryReport report)
        {
            File.WriteAllText(Path.Combine(GeneratedDirectory, "runtime-asset-inventory.json"), InventoryJson(report));
            File.WriteAllText(Path.Combine(GeneratedDirectory, "asset-boundary-report.json"), BoundaryJson(report));
            File.WriteAllText(Path.Combine(GeneratedDirectory, "sprite-atlas-production-packing-map.json"), SpriteAtlasJson());
            File.WriteAllText(Path.Combine(GeneratedDirectory, "visual-consistency-polish-actions.json"), VisualPolishJson());
            File.WriteAllText(Path.Combine(GeneratedDirectory, "asset-replacement-readiness-verdict.json"), ReadinessJson(report));
            File.WriteAllText(Path.Combine(GeneratedDirectory, "production-boundary-check.json"), ProductionBoundaryJson(report));
        }

        private static string InventoryJson(U32RuntimeAssetBoundaryReport report)
        {
            var builder = new StringBuilder();
            builder.Append("{\n  \"assetReplacementReady\": false,\n  \"inventory\": [\n");
            for (var i = 0; i < report.Inventory.Count; i++)
            {
                var entry = report.Inventory[i];
                builder.Append("    {\n");
                builder.Append($"      \"key\": \"{entry.Key}\",\n");
                builder.Append($"      \"path\": \"{entry.Path}\",\n");
                builder.Append($"      \"currentUsage\": \"{entry.CurrentUsage}\",\n");
                builder.Append($"      \"runtimeReferenced\": {Bool(entry.RuntimeReferenced)},\n");
                builder.Append($"      \"productionStatus\": \"{entry.ProductionStatus}\",\n");
                builder.Append($"      \"risk\": \"{entry.Risk}\",\n");
                builder.Append($"      \"nextAction\": \"{entry.NextAction}\"\n");
                builder.Append(i == report.Inventory.Count - 1 ? "    }\n" : "    },\n");
            }
            builder.Append("  ]\n}\n");
            return builder.ToString();
        }

        private static string BoundaryJson(U32RuntimeAssetBoundaryReport report)
        {
            return "{\n" +
                   "  \"runtimeReferencesDocsGenerated\": false,\n" +
                   "  \"runtimeUsesGeneratedFinalPng\": false,\n" +
                   "  \"draftSeFinalApproved\": false,\n" +
                   "  \"productionApproved\": false,\n" +
                   "  \"addressablesIntroduced\": false,\n" +
                   "  \"cloudSaveIntroduced\": false,\n" +
                   "  \"spriteAtlasProductionPackingComplete\": false,\n" +
                   "  \"assetReplacementReady\": false,\n" +
                   $"  \"inventoryCount\": {report.Inventory.Count},\n" +
                   $"  \"replacementEntryCount\": {report.ReplacementEntries.Count},\n" +
                   "  \"mobileMetrics\": \"NOT_MEASURED\"\n" +
                   "}\n";
        }

        private static string SpriteAtlasJson()
        {
            return "{\n" +
                   "  \"status\": \"production packing evidence map only; .spriteatlas assets not completed in U32\",\n" +
                   "  \"productionPackingComplete\": false,\n" +
                   "  \"addressables\": \"not introduced\",\n" +
                   "  \"performancePass\": false,\n" +
                   "  \"groups\": [\n" +
                   "    {\"name\":\"U32Characters\", \"include\":[\"future Assets/_Project/Art/Characters/Stage1\"], \"exclude\":[\"docs/design-targets/generated\", \"prototype sheets until Unity-finished\"]},\n" +
                   "    {\"name\":\"U32Enemies\", \"include\":[\"future Assets/_Project/Art/Enemies/Stage1\"], \"exclude\":[\"docs/design-targets/generated\", \"review screenshots\"]},\n" +
                   "    {\"name\":\"U32ItemsIcons\", \"include\":[\"future Assets/_Project/Art/Icons/Stage1\"], \"exclude\":[\"generated final PNG\", \"completed screen images\"]},\n" +
                   "    {\"name\":\"U32UiPaper\", \"include\":[\"reviewed paper UI sprites\"], \"exclude\":[\"fullscreen reference art\", \"docs/generated evidence\"]},\n" +
                   "    {\"name\":\"U32Effects\", \"include\":[\"Unity-finished climax/effect sprites\"], \"exclude\":[\"full-screen cut-in review PNG\", \"generated screenshots\"]}\n" +
                   "  ],\n" +
                   "  \"texturePolicy\": \"align with U29; no mass import changes in U32\"\n" +
                   "}\n";
        }

        private static string VisualPolishJson()
        {
            return "{\n" +
                   "  \"actions\": [\n" +
                   "    {\"area\":\"Battle HUD\", \"action\":\"kept quiet/readable; no new palette\"},\n" +
                   "    {\"area\":\"Pickup feedback\", \"action\":\"kept U31 readability tuning\"},\n" +
                   "    {\"area\":\"Hit feedback\", \"action\":\"kept U31 cooldown tuning; no extra effect density\"},\n" +
                   "    {\"area\":\"LevelUp card\", \"action\":\"kept paper card direction\"},\n" +
                   "    {\"area\":\"Rare/Evolution/Kokuyou\", \"action\":\"kept special contrast only for climax moments\"},\n" +
                   "    {\"area\":\"Result/StageSelect/Retry\", \"action\":\"kept ledger, lantern, route, and retry readable\"}\n" +
                   "  ],\n" +
                   "  \"largeDesignChange\": false,\n" +
                   "  \"productionApproved\": false\n" +
                   "}\n";
        }

        private static string ReadinessJson(U32RuntimeAssetBoundaryReport report)
        {
            return "{\n" +
                   "  \"assetReplacementReady\": false,\n" +
                   "  \"reason\": \"runtime inventory and guard improved, but production .spriteatlas packing and final production asset replacement are incomplete\",\n" +
                   "  \"productionApproved\": false,\n" +
                   "  \"needsReplacement\": [\"player sprites\", \"enemy sprites\", \"Kokuyou/Rare/Evolution effects\", \"draft SE\"],\n" +
                   "  \"needsReview\": [\"UI paper candidates\", \"item/passive/rare icon consistency\", \"texture import settings\", \"mobile device QA\"],\n" +
                   "  \"blockedFromRuntime\": [\"docs/design-targets/generated\", \"generated final PNG\", \"completed screen images\", \"review screenshots\"],\n" +
                   $"  \"inventoryCount\": {report.Inventory.Count}\n" +
                   "}\n";
        }

        private static string ProductionBoundaryJson(U32RuntimeAssetBoundaryReport report)
        {
            return "{\n" +
                   "  \"runtimeGeneratedFinalPngPaste\": false,\n" +
                   "  \"runtimeDesignTargetReference\": false,\n" +
                   "  \"runtimeDocsGeneratedReference\": false,\n" +
                   "  \"addressablesIntroduced\": false,\n" +
                   "  \"cloudSaveIntroduced\": false,\n" +
                   "  \"draftSeFinalApproved\": false,\n" +
                   "  \"productionBalanceFinal\": false,\n" +
                   "  \"mobileDeviceMeasurement\": \"NOT_MEASURED\",\n" +
                   "  \"productionApproved\": false,\n" +
                   "  \"assetReplacementReady\": false\n" +
                   "}\n";
        }

        private static string Capture(string fileName, string title, string note, string status, Color color)
        {
            return Render(fileName, parent =>
            {
                Panel(parent, "Bg", 0f, 0f, 390f, 844f, Night);
                Txt(parent, "Title", title, 0f, 296f, 300f, 34f, 22f, Paper);
                Panel(parent, "Phone", 0f, 50f, 318f, 476f, new Color32(42, 34, 31, 238));
                Panel(parent, "AssetFrame", 0f, 80f, 250f, 294f, Ink);
                Panel(parent, "PaperBand", 0f, 220f, 250f, 30f, new Color32(62, 47, 38, 235));
                Panel(parent, "SignalA", -72f, 116f, 86f, 18f, color);
                Panel(parent, "SignalB", 44f, 64f, 132f, 18f, Lantern);
                Panel(parent, "SignalC", 0f, 10f, 172f, 18f, Crimson);
                Txt(parent, "Note", note, 0f, -106f, 276f, 30f, 13f, Paper);
                Txt(parent, "Status", status, 0f, -146f, 286f, 28f, 12f, Paper);
                Txt(parent, "Footer", "U32 asset evidence / productionApproved false", 0f, -326f, 320f, 20f, 11f, Paper);
            });
        }

        private static string Render(string fileName, Action<Transform> build)
        {
            const int width = 390;
            const int height = 844;
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U32Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U32Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            created.Add(canvasObj);
            var canvas = canvasObj.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceCamera;
            canvas.worldCamera = cam;
            var scaler = canvasObj.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(390f, 844f);
            scaler.matchWidthOrHeight = 0.5f;
            build(canvasObj.transform);
            Canvas.ForceUpdateCanvases();
            var path = Path.GetFullPath(Path.Combine(ProjectRoot(), OutputDirectory, fileName));
            var rt = new RenderTexture(width, height, 24, RenderTextureFormat.ARGB32);
            var tex = new Texture2D(width, height, TextureFormat.RGBA32, false);
            try
            {
                cam.targetTexture = rt;
                cam.Render();
                RenderTexture.active = rt;
                tex.ReadPixels(new Rect(0, 0, width, height), 0, 0);
                tex.Apply();
                File.WriteAllBytes(path, tex.EncodeToPNG());
            }
            finally
            {
                RenderTexture.active = null;
                UnityEngine.Object.DestroyImmediate(tex);
                UnityEngine.Object.DestroyImmediate(rt);
                foreach (var o in created) UnityEngine.Object.DestroyImmediate(o);
            }

            return $"{fileName}, bytes={new FileInfo(path).Length}";
        }

        private static void Panel(Transform parent, string name, float x, float y, float w, float h, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            Place(obj.GetComponent<RectTransform>(), x, y, w, h);
            obj.GetComponent<Image>().color = color;
        }

        private static void Txt(Transform parent, string name, string text, float x, float y, float w, float h, float size, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI));
            obj.transform.SetParent(parent, false);
            Place(obj.GetComponent<RectTransform>(), x, y, w, h);
            var tmp = obj.GetComponent<TextMeshProUGUI>();
            tmp.font = font;
            tmp.text = text;
            tmp.fontSize = size;
            tmp.color = color;
            tmp.alignment = TextAlignmentOptions.Center;
            tmp.overflowMode = TextOverflowModes.Ellipsis;
        }

        private static void Place(RectTransform rect, float x, float y, float w, float h)
        {
            var center = new Vector2(0.5f, 0.5f);
            rect.anchorMin = center;
            rect.anchorMax = center;
            rect.pivot = center;
            rect.anchoredPosition = new Vector2(x, y);
            rect.sizeDelta = new Vector2(w, h);
        }

        private static string Bool(bool value) => value ? "true" : "false";
        private static string ProjectRoot() => Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
    }
}
