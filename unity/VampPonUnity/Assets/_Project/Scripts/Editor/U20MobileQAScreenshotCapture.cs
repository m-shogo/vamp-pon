using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U20MobileQAScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u20/screenshots";
        private const string ReportPath = "Logs/u20_mobile_qa_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(24, 22, 21, 255);
        private static readonly Color32 InkPanel = new(38, 31, 26, 232);
        private static readonly Color32 Paper = new(238, 222, 190, 255);
        private static TMP_FontAsset font;

        private readonly struct Profile
        {
            public Profile(int width, int height) { Width = width; Height = height; }
            public int Width { get; }
            public int Height { get; }
        }

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);
                font = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(FontPath);
                if (font == null) throw new InvalidOperationException($"SDF font not found: {FontPath}");

                var profiles = new[] { new Profile(360, 800), new Profile(390, 844), new Profile(430, 932) };
                var log = new List<string>();
                foreach (var p in profiles)
                {
                    log.Add(Capture(p, $"u20-stage-select-mobile-{p.Width}x{p.Height}.png", BuildStageSelect));
                    log.Add(Capture(p, $"u20-stage1-loop-mobile-{p.Width}x{p.Height}.png", BuildStage1Loop));
                    log.Add(Capture(p, $"u20-levelup-mobile-{p.Width}x{p.Height}.png", BuildLevelUp));
                    log.Add(Capture(p, $"u20-result-mobile-{p.Width}x{p.Height}.png", BuildResult));
                    log.Add(Capture(p, $"u20-kokuyou-mobile-{p.Width}x{p.Height}.png", BuildKokuyou));
                }

                log.Add(Capture(new Profile(390, 844), "u20-game-feel-mobile-390x844.png", BuildGameFeel));
                log.Add(Capture(new Profile(390, 844), "u20-contact-sheet-mobile-core.png", BuildCoreContact));
                log.Add(Capture(new Profile(390, 844), "u20-contact-sheet-mobile-risk.png", BuildRiskContact));
                log.Add(Capture(new Profile(390, 844), "u20-safe-area-debug-390x844.png", BuildSafeAreaDebug));
                log.Add(Capture(new Profile(390, 844), "u20-touch-target-debug-390x844.png", BuildTouchDebug));
                log.Add(Capture(new Profile(360, 800), "u20-text-readability-debug-360x800.png", BuildTextDebug));
                log.Add(Capture(new Profile(390, 844), "u20-kokuyou-overlay-comparison-390x844.png", BuildKokuyouComparison));

                File.WriteAllText(ReportPath, string.Join(Environment.NewLine, log));
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                Debug.LogError(ex);
                File.WriteAllText(ReportPath, ex.ToString());
                EditorApplication.Exit(1);
            }
        }

        private static GameObject BuildStageSelect(Transform parent)
        {
            var root = Root(parent, "U20StageSelect");
            Title(root, "StageSelect Mobile QA");
            Panel(root.transform, "Map", 0f, 92f, 310f, 360f, new Color32(31, 29, 25, 222));
            Dot(root.transform, "Active", -88f, 196f, 54f, new Color32(238, 202, 122, 255));
            Dot(root.transform, "Locked1", 0f, 104f, 54f, new Color32(78, 70, 60, 255));
            Dot(root.transform, "Locked2", 88f, 12f, 54f, new Color32(78, 70, 60, 255));
            Txt(root.transform, "Info", "はじまりの路地 / やさしい", 0f, -180f, 280f, 24f, 14f, Paper);
            Button(root.transform, "出発", 0f, -252f, 150f, 46f);
            Footer(root, "locked node contrast: warning candidate / real device not executed");
            return root;
        }

        private static GameObject BuildStage1Loop(Transform parent)
        {
            var root = Root(parent, "U20Stage1Loop");
            Title(root, "Stage1 Loop Mobile QA");
            Card(root.transform, "EXP", 0f, 184f, "EXP吸引", "visible / not too noisy");
            Card(root.transform, "Drop", 0f, 94f, "Drop / Heart", "Heart is manual");
            Card(root.transform, "Level", 0f, 4f, "LevelUp / Rare", "tap area OK");
            Card(root.transform, "Evo", 0f, -86f, "Evolution", "recipe readable");
            Card(root.transform, "Kokuyou", 0f, -176f, "黒耀化", "overlay alpha review");
            Footer(root, "Stage1 is proof / save・reward・unlockなし");
            return root;
        }

        private static GameObject BuildLevelUp(Transform parent)
        {
            var root = Root(parent, "U20LevelUp");
            Title(root, "LevelUp Mobile QA");
            Panel(root.transform, "Dim", 0f, 36f, 342f, 464f, new Color32(20, 15, 17, 225));
            var names = new[] { "夜の鉛筆\nLv+1", "紙飛行機\nLv+1", "街灯の輪\nLv+1" };
            for (var i = 0; i < 3; i++)
            {
                var x = -104f + i * 104f;
                Panel(root.transform, $"Card{i}", x, 42f, 92f, 180f, new Color32(232, 205, 157, 238));
                Txt(root.transform, $"CardText{i}", names[i], x, 54f, 78f, 76f, 13f, new Color32(42, 27, 18, 255));
                Button(root.transform, "選ぶ", x, -54f, 64f, 28f, new Color32(92, 58, 34, 255));
            }
            Footer(root, "360x800 card tap/readability QA");
            return root;
        }

        private static GameObject BuildResult(Transform parent)
        {
            var root = Root(parent, "U20Result");
            Title(root, "Result Mobile QA");
            Txt(root.transform, "Rank", "Rank A", 0f, 242f, 180f, 44f, 26f, new Color32(248, 202, 104, 255));
            Panel(root.transform, "Ledger", 0f, 52f, 320f, 294f, InkPanel);
            Txt(root.transform, "Stats", "時間 08:00   討伐 128", 0f, 132f, 250f, 24f, 15f, Paper);
            Txt(root.transform, "Reward", "欠片 12 / 記憶 3 / 加護 +3", 0f, 72f, 270f, 24f, 15f, Paper);
            Txt(root.transform, "Cards", "記憶 / 墨 / 灯", 0f, -18f, 240f, 24f, 15f, new Color32(248, 202, 104, 255));
            Button(root.transform, "次へ", 0f, -236f, 150f, 46f);
            Footer(root, "Result stats contrast: continue device review");
            return root;
        }

        private static GameObject BuildKokuyou(Transform parent)
        {
            var root = Root(parent, "U20Kokuyou");
            Panel(root.transform, "Overlay", 0f, 0f, 390f, 844f, new Color32(54, 12, 36, 220));
            Title(root, "黒耀化 Mobile QA");
            Panel(root.transform, "Gauge", -120f, -184f, 46f, 238f, new Color32(18, 11, 18, 230));
            Panel(root.transform, "GaugeFill", -120f, -184f, 28f, 190f, new Color32(105, 15, 53, 235));
            Txt(root.transform, "Active", "黒耀化 Active", 0f, 126f, 240f, 34f, 22f, new Color32(248, 202, 104, 255));
            Txt(root.transform, "Note", "overlay / cut-in / gauge / timeScale final=1", 0f, 54f, 310f, 24f, 13f, Paper);
            Button(root.transform, "発動", 0f, -236f, 150f, 46f);
            Footer(root, "green/yellow particle human review continues");
            return root;
        }

        private static GameObject BuildGameFeel(Transform parent)
        {
            var root = Root(parent, "U20GameFeel");
            Title(root, "Game Feel Mobile QA");
            Card(root.transform, "A", 0f, 166f, "EXP", "scale/trail visible");
            Card(root.transform, "B", 0f, 76f, "Heart", "manual collect");
            Card(root.transform, "C", 0f, -14f, "Rare/Evolution", "readable / not gacha");
            Card(root.transform, "D", 0f, -104f, "Particles", "peak <= 32");
            Card(root.transform, "E", 0f, -194f, "TimeScale", "ForceRestore final=1");
            return root;
        }

        private static GameObject BuildCoreContact(Transform parent)
        {
            var root = Root(parent, "U20CoreContact");
            Title(root, "U20 Mobile Core");
            Card(root.transform, "Safe", 0f, 172f, "Safe Area", "top/bottom margins");
            Card(root.transform, "Touch", 0f, 82f, "Touch Target", ">=44px proof");
            Card(root.transform, "Text", 0f, -8f, "Text", "360x800 readable");
            Card(root.transform, "Perf", 0f, -98f, "Performance", "object/particle budget");
            Card(root.transform, "Device", 0f, -188f, "Device", "not executed");
            return root;
        }

        private static GameObject BuildRiskContact(Transform parent)
        {
            var root = Root(parent, "U20RiskContact");
            Title(root, "U20 Mobile Risks");
            Card(root.transform, "Modules", 0f, 164f, "Build Modules", "iOS/Android missing");
            Card(root.transform, "Stats", 0f, 74f, "Result Stats", "real brightness review");
            Card(root.transform, "Nodes", 0f, -16f, "Locked Nodes", "contrast review");
            Card(root.transform, "Kokuyou", 0f, -106f, "黒耀化B", "particle human review");
            Card(root.transform, "Device", 0f, -196f, "Real Device", "not executed");
            return root;
        }

        private static GameObject BuildSafeAreaDebug(Transform parent)
        {
            var root = BuildStageSelect(parent);
            Panel(root.transform, "SafeTop", 0f, 384f, 390f, 48f, new Color32(40, 160, 120, 60));
            Panel(root.transform, "SafeBottom", 0f, -392f, 390f, 56f, new Color32(40, 160, 120, 60));
            return root;
        }

        private static GameObject BuildTouchDebug(Transform parent)
        {
            var root = BuildLevelUp(parent);
            Panel(root.transform, "TouchL", -104f, 42f, 96f, 184f, new Color32(80, 180, 220, 50));
            Panel(root.transform, "TouchM", 0f, 42f, 96f, 184f, new Color32(80, 180, 220, 50));
            Panel(root.transform, "TouchR", 104f, 42f, 96f, 184f, new Color32(80, 180, 220, 50));
            return root;
        }

        private static GameObject BuildTextDebug(Transform parent)
        {
            var root = BuildResult(parent);
            Txt(root.transform, "Debug", "Text QA: title/stats/card/button readable", 0f, -306f, 330f, 20f, 11f, new Color32(205, 182, 143, 255));
            return root;
        }

        private static GameObject BuildKokuyouComparison(Transform parent)
        {
            var root = Root(parent, "U20KokuyouComparison");
            Title(root, "黒耀化 Overlay Compare");
            Panel(root.transform, "Left", -88f, 42f, 144f, 330f, new Color32(54, 12, 36, 190));
            Panel(root.transform, "Right", 88f, 42f, 144f, 330f, new Color32(54, 12, 36, 230));
            Txt(root.transform, "L", "lighter", -88f, 42f, 100f, 24f, 13f, Paper);
            Txt(root.transform, "R", "current proof", 88f, 42f, 116f, 24f, 13f, Paper);
            Footer(root, "final alpha requires real device brightness review");
            return root;
        }

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U20Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U20Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            created.Add(canvasObj);
            var canvas = canvasObj.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceCamera;
            canvas.worldCamera = cam;
            var scaler = canvasObj.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(390f, 844f);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;
            canvasObj.GetComponent<RectTransform>().sizeDelta = new Vector2(profile.Width, profile.Height);
            Panel(canvasObj.transform, "Bg", 0f, 0f, 2000f, 2000f, Night);
            build(canvasObj.transform);
            Canvas.ForceUpdateCanvases();
            var path = Path.GetFullPath(Path.Combine(ProjectRoot(), OutputDirectory, fileName));
            if (File.Exists(path)) File.Delete(path);
            var rt = new RenderTexture(profile.Width, profile.Height, 24, RenderTextureFormat.ARGB32);
            var tex = new Texture2D(profile.Width, profile.Height, TextureFormat.RGBA32, false);
            var prevTarget = cam.targetTexture;
            var prevActive = RenderTexture.active;
            var prevAspect = cam.aspect;
            try
            {
                cam.targetTexture = rt;
                cam.aspect = profile.Width / (float)profile.Height;
                cam.Render();
                RenderTexture.active = rt;
                tex.ReadPixels(new Rect(0, 0, profile.Width, profile.Height), 0, 0);
                tex.Apply();
                File.WriteAllBytes(path, tex.EncodeToPNG());
            }
            finally
            {
                cam.targetTexture = prevTarget;
                cam.aspect = prevAspect;
                RenderTexture.active = prevActive;
                UnityEngine.Object.DestroyImmediate(tex);
                UnityEngine.Object.DestroyImmediate(rt);
                foreach (var o in created) UnityEngine.Object.DestroyImmediate(o);
            }
            return $"{profile.Width}x{profile.Height}: {fileName}, bytes={new FileInfo(path).Length}";
        }

        private static GameObject Root(Transform parent, string name)
        {
            var root = new GameObject(name, typeof(RectTransform));
            root.transform.SetParent(parent, false);
            Rect(root.GetComponent<RectTransform>(), 0f, 0f, 390f, 844f);
            return root;
        }

        private static void Title(GameObject root, string text) => Txt(root.transform, "Title", text, 0f, 322f, 340f, 34f, 20f, Paper);
        private static void Footer(GameObject root, string text) => Txt(root.transform, "Footer", text, 0f, -362f, 346f, 20f, 10f, new Color32(205, 182, 143, 255));

        private static void Card(Transform parent, string name, float x, float y, string title, string sub)
        {
            Panel(parent, name, x, y, 310f, 70f, InkPanel);
            Txt(parent, $"{name}Title", title, x, y + 12f, 260f, 22f, 14f, new Color32(248, 202, 104, 255));
            Txt(parent, $"{name}Sub", sub, x, y - 16f, 260f, 20f, 11f, Paper);
        }

        private static void Button(Transform parent, string text, float x, float y, float w, float h, Color? color = null)
        {
            Panel(parent, $"Button_{text}_{x}_{y}", x, y, w, h, color ?? new Color32(92, 58, 34, 255));
            Txt(parent, $"ButtonText_{text}_{x}_{y}", text, x, y, w - 12f, h - 8f, 14f, Paper);
        }

        private static void Dot(Transform parent, string name, float x, float y, float size, Color color) => Panel(parent, name, x, y, size, size, color);

        private static void Panel(Transform parent, string name, float x, float y, float w, float h, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            Rect(obj.GetComponent<RectTransform>(), x, y, w, h);
            var image = obj.GetComponent<Image>();
            image.color = color;
            image.raycastTarget = false;
        }

        private static void Txt(Transform parent, string name, string text, float x, float y, float w, float h, float size, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI));
            obj.transform.SetParent(parent, false);
            Rect(obj.GetComponent<RectTransform>(), x, y, w, h);
            var tmp = obj.GetComponent<TextMeshProUGUI>();
            tmp.font = font;
            tmp.text = text;
            tmp.fontSize = size;
            tmp.color = color;
            tmp.alignment = TextAlignmentOptions.Center;
            tmp.textWrappingMode = TextWrappingModes.NoWrap;
            tmp.overflowMode = TextOverflowModes.Ellipsis;
            tmp.raycastTarget = false;
        }

        private static void Rect(RectTransform rect, float x, float y, float w, float h)
        {
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = new Vector2(x, y);
            rect.sizeDelta = new Vector2(w, h);
        }

        private static string ProjectRoot() => Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
    }
}
