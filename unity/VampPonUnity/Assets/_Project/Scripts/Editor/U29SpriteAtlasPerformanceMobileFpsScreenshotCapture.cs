using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U29.PerformanceMobile;

namespace VampPon.UnitySpike.Editor
{
    public static class U29SpriteAtlasPerformanceMobileFpsScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u29/screenshots";
        private const string GeneratedDirectory = "../../docs/design-targets/generated/unity-u29";
        private const string ReportPath = "Logs/u29_sprite_atlas_performance_mobile_fps_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(14, 14, 18, 255);
        private static readonly Color32 Paper = new(231, 211, 176, 255);
        private static readonly Color32 Ink = new(17, 11, 13, 245);
        private static readonly Color32 Lantern = new(246, 198, 92, 255);
        private static readonly Color32 Crimson = new(125, 29, 46, 245);
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
                WriteArtifacts();
                var log = new List<string>
                {
                    Capture("stage1-opening-performance-proof.png", "Opening", "enemies 6 / pickups 8 / draw calls draft 28"),
                    Capture("stage1-early-wave-performance-proof.png", "Early Wave", "enemies 11 / projectiles 8 / audio voices 4"),
                    Capture("stage1-mid-wave-performance-proof.png", "Mid Wave", "enemies 26 / hit effects cap 16"),
                    Capture("stage1-kokuyou-performance-proof.png", "Kokuyou", "reserve climax effect slots"),
                    Capture("stage1-evolution-performance-proof.png", "Evolution", "skip low priority hit puffs"),
                    Capture("stage1-result-performance-proof.png", "Result", "static ledger / one-shot reward text"),
                    Capture("stageselect-performance-proof.png", "StageSelect", "static map / lantern pulse only"),
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

        private static void WriteArtifacts()
        {
            File.WriteAllText(Path.Combine(GeneratedDirectory, "performance-budget.json"),
                "{\n" +
                "  \"targetResolution\": \"390x844\",\n" +
                "  \"targetFpsDraft\": 60,\n" +
                "  \"minimumFpsDraft\": 30,\n" +
                "  \"deviceMeasurement\": \"not measured on device\",\n" +
                $"  \"maxActiveEnemies\": {U29Stage1PerformanceConstants.MaxActiveEnemies},\n" +
                $"  \"textureMemoryBudgetMbDraft\": {U29Stage1PerformanceConstants.TextureMemoryBudgetMbDraft},\n" +
                $"  \"drawCallBudgetDraft\": {U29Stage1PerformanceConstants.DrawCallBudgetDraft}\n" +
                "}\n");
            File.WriteAllText(Path.Combine(GeneratedDirectory, "runtime-cap-map.json"),
                "{\n" +
                $"  \"enemies\": {U29Stage1PerformanceConstants.MaxActiveEnemies},\n" +
                $"  \"pickups\": {U29Stage1PerformanceConstants.MaxActivePickups},\n" +
                $"  \"projectiles\": {U29Stage1PerformanceConstants.MaxActiveProjectiles},\n" +
                $"  \"hitEffects\": {U29Stage1PerformanceConstants.MaxActiveHitEffects},\n" +
                $"  \"particles\": {U29Stage1PerformanceConstants.MaxActiveParticles},\n" +
                "  \"fallback\": \"offscreen cleanup / spawn throttle / effect skip\"\n" +
                "}\n");
            File.WriteAllText(Path.Combine(GeneratedDirectory, "sprite-atlas-map.json"),
                "{\n" +
                "  \"status\": \"policy only; spriteatlas packing deferred to U30\",\n" +
                "  \"groups\": [\"U29Characters\", \"U29Enemies\", \"U29ItemsIcons\", \"U29UiPaper\", \"U29Effects\"],\n" +
                "  \"excluded\": [\"generated screenshots\", \"design targets\", \"fullscreen review art\"],\n" +
                "  \"addressables\": \"not introduced\"\n" +
                "}\n");
            File.WriteAllText(Path.Combine(GeneratedDirectory, "texture-import-policy-map.json"),
                "{\n" +
                "  \"pixelArt\": \"Sprite / Point draft / mipmap off / readable off after processing\",\n" +
                "  \"paperUi\": \"Sprite / Bilinear allowed / mipmap off / alpha preserved\",\n" +
                "  \"itemIcons64\": \"Sprite / max 128 or 256 draft / mipmap off\",\n" +
                "  \"screenshots\": \"not runtime assets\"\n" +
                "}\n");
            File.WriteAllText(Path.Combine(GeneratedDirectory, "audio-haptic-budget-map.json"),
                "{\n" +
                $"  \"maxAudioVoices\": {U29Stage1PerformanceConstants.MaxActiveAudioVoices},\n" +
                $"  \"maxLowPriorityAudioVoices\": {U29Stage1PerformanceConstants.MaxLowPriorityAudioVoices},\n" +
                $"  \"lightHapticCooldownSeconds\": {U29Stage1PerformanceConstants.LightHapticCooldownSeconds:0.00},\n" +
                $"  \"damageHapticCooldownSeconds\": {U29Stage1PerformanceConstants.DamageHapticCooldownSeconds:0.00},\n" +
                $"  \"kokuyouHapticCooldownSeconds\": {U29Stage1PerformanceConstants.KokuyouHapticCooldownSeconds:0.00},\n" +
                "  \"deviceMeasurement\": \"not measured on device\"\n" +
                "}\n");
        }

        private static string Capture(string fileName, string title, string note)
        {
            return Render(fileName, parent =>
            {
                Bg(parent);
                Txt(parent, "Title", title, 0f, 286f, 300f, 32f, 21f, Paper);
                Panel(parent, "Phone", 0f, 36f, 312f, 462f, new Color32(42, 33, 30, 235));
                Gauge(parent, -72f, 104f, 180f, "FPS 60 / floor 30", Lantern);
                Gauge(parent, 72f, 50f, 136f, "draw call budget", Crimson);
                Gauge(parent, 0f, -14f, 210f, "pool + cap guard", Paper);
                Txt(parent, "Note", note, 0f, -128f, 280f, 36f, 12f, Paper);
                Txt(parent, "Status", "Editor proof / device not measured", 0f, -326f, 300f, 20f, 11f, Paper);
            });
        }

        private static void Gauge(Transform parent, float x, float y, float w, string label, Color color)
        {
            Panel(parent, $"Gauge{label}", x, y, w, 14f, Ink);
            Panel(parent, $"GaugeFill{label}", x - w * 0.15f, y, w * 0.70f, 14f, color);
            Txt(parent, $"GaugeText{label}", label, x, y + 22f, 220f, 20f, 11f, Paper);
        }

        private static string Render(string fileName, Action<Transform> build)
        {
            const int width = 390;
            const int height = 844;
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U29Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U29Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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

        private static void Bg(Transform parent) => Panel(parent, "Bg", 0f, 0f, 390f, 844f, Night);
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
        private static string ProjectRoot() => Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
    }
}
