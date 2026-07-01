using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U18KokuyouRuntimeScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u18/screenshots";
        private const string ReportPath = "Logs/u18_kokuyou_runtime_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private const string OverlaySpritePath = "Assets/_Project/Resources/U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_b.png";
        private const string CutinSpritePath = "Assets/_Project/Resources/U10Candidates/Cutin/cutin_black_ink_band_final_candidate.png";
        private static readonly Color32 Night = new(24, 22, 21, 255);
        private static readonly Color32 InkPanel = new(38, 31, 26, 232);
        private static readonly Color32 Paper = new(238, 222, 190, 255);
        private static TMP_FontAsset font;
        private static Sprite overlaySprite;
        private static Sprite cutinSprite;

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
                overlaySprite = AssetDatabase.LoadAssetAtPath<Sprite>(OverlaySpritePath);
                cutinSprite = AssetDatabase.LoadAssetAtPath<Sprite>(CutinSpritePath);
                if (font == null) throw new InvalidOperationException($"SDF font not found: {FontPath}");

                var p390 = new Profile(390, 844);
                var log = new List<string>
                {
                    Capture(p390, "u18-kokuyou-gauge-empty-390x844.png", (t) => BuildState(t, "黒耀化 Gauge", "Idle", 0, false, false, false)),
                    Capture(p390, "u18-kokuyou-gauge-ready-390x844.png", (t) => BuildState(t, "黒耀化 Ready", "Ready", 100, false, false, false)),
                    Capture(p390, "u18-kokuyou-activating-overlay-390x844.png", (t) => BuildState(t, "黒耀化 発動", "Activating", 100, true, true, false)),
                    Capture(p390, "u18-kokuyou-active-proof-390x844.png", (t) => BuildState(t, "黒耀化 Active", "Active", 100, true, true, true)),
                    Capture(p390, "u18-kokuyou-ending-proof-390x844.png", (t) => BuildState(t, "黒耀化 Ending", "Cooldown", 0, true, false, true)),
                    Capture(p390, "u18-kokuyou-loop-return-390x844.png", (t) => BuildState(t, "Stage1 Loop Return", "Idle", 0, false, false, false)),
                    Capture(new Profile(360, 800), "u18-kokuyou-active-proof-360x800.png", (t) => BuildState(t, "黒耀化 Active", "Active", 100, true, true, true)),
                    Capture(new Profile(430, 932), "u18-kokuyou-active-proof-430x932.png", (t) => BuildState(t, "黒耀化 Active", "Active", 100, true, true, true)),
                    Capture(p390, "u18-kokuyou-all-contact-sheet.png", BuildContactSheet),
                };

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

        private static GameObject BuildState(Transform parent, string title, string state, int gauge, bool overlay, bool cutin, bool buff)
        {
            var root = Root(parent, "U18KokuyouState");
            if (overlay)
            {
                ImagePanel(root.transform, "OverlayCandidate", 0f, 0f, 390f, 844f, new Color32(47, 13, 35, 218), overlaySprite);
                Panel(root.transform, "RedWash", 0f, 0f, 390f, 844f, new Color32(56, 0, 18, 120));
            }
            else
            {
                Panel(root.transform, "CalmBattle", 0f, 0f, 390f, 844f, new Color32(20, 24, 28, 190));
            }

            Txt(root.transform, "Title", title, 0f, 322f, 330f, 34f, 20f, Paper);
            Panel(root.transform, "GaugeBack", -116f, -184f, 46f, 238f, new Color32(18, 11, 18, 230));
            var fillHeight = Mathf.Clamp01(gauge / 100f) * 220f;
            Panel(root.transform, "GaugeFill", -116f, -294f + fillHeight * 0.5f, 28f, fillHeight, new Color32(105, 15, 53, 235));
            Txt(root.transform, "GaugeLabel", $"Gauge {gauge}/100", -76f, -292f, 140f, 24f, 11f, Paper);
            Panel(root.transform, "StatePanel", 0f, 82f, 320f, 178f, InkPanel);
            Txt(root.transform, "State", $"State: {state}", 0f, 134f, 260f, 26f, 16f, new Color32(248, 202, 104, 255));
            Txt(root.transform, "Rule", "Damage +25 / Ready at 100", 0f, 94f, 260f, 22f, 12f, Paper);
            Txt(root.transform, "Buff", buff ? "buff proof: attack/speed feel up" : "buff proof standby", 0f, 54f, 260f, 22f, 12f, new Color32(205, 182, 143, 255));
            Txt(root.transform, "Recoil", state == "Cooldown" ? "short recoil proof / gauge reset" : "no save・reward・unlock", 0f, 18f, 260f, 22f, 12f, new Color32(205, 182, 143, 255));

            if (cutin)
            {
                ImagePanel(root.transform, "CutinBand", 0f, 0f, 390f, 128f, new Color32(10, 8, 10, 235), cutinSprite);
                Txt(root.transform, "CutinText", "黒耀化", 0f, 0f, 180f, 38f, 24f, Paper);
            }

            Txt(root.transform, "Note", "runtime prototype / productionApproved=0 / 実機確認not executed", 0f, -362f, 346f, 20f, 10f, new Color32(205, 182, 143, 255));
            return root;
        }

        private static GameObject BuildContactSheet(Transform parent)
        {
            var root = Root(parent, "U18KokuyouContactSheet");
            Txt(root.transform, "Title", "U18 黒耀化 Runtime Prototype", 0f, 322f, 340f, 34f, 20f, Paper);
            Card(root.transform, "Charge", 0f, 196f, "Gauge", "Damage +25 -> Ready", "本番balanceではない");
            Arrow(root.transform, 124f);
            Card(root.transform, "Activate", 0f, 64f, "Activate", "overlay / cut-in band", "TimeScaleService hit stop");
            Arrow(root.transform, -8f);
            Card(root.transform, "Active", 0f, -68f, "Active", "5秒 buff proof", "reward反映なし");
            Arrow(root.transform, -140f);
            Card(root.transform, "End", 0f, -200f, "Ending", "recoil -> Idle", "loopへ戻る");
            return root;
        }

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U18Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U18Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            created.Add(canvasObj);
            var canvas = canvasObj.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceCamera;
            canvas.worldCamera = cam;
            canvas.planeDistance = 1f;
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

        private static void Card(Transform parent, string name, float x, float y, string title, string main, string sub)
        {
            Panel(parent, name, x, y, 314f, 72f, InkPanel);
            Txt(parent, $"{name}Title", title, x, y + 17f, 280f, 22f, 13f, Paper);
            Txt(parent, $"{name}Main", main, x, y - 5f, 280f, 20f, 12f, new Color32(248, 202, 104, 255));
            Txt(parent, $"{name}Sub", sub, x, y - 24f, 280f, 18f, 10f, new Color32(205, 182, 143, 255));
        }

        private static void Arrow(Transform parent, float y)
        {
            Txt(parent, $"Arrow_{y}", "↓", 0f, y, 42f, 26f, 17f, new Color32(190, 166, 124, 235));
        }

        private static void ImagePanel(Transform parent, string name, float x, float y, float w, float h, Color color, Sprite sprite)
        {
            var obj = Panel(parent, name, x, y, w, h, color);
            var image = obj.GetComponent<Image>();
            image.sprite = sprite;
            image.preserveAspect = false;
        }

        private static GameObject Panel(Transform parent, string name, float x, float y, float w, float h, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            Rect(obj.GetComponent<RectTransform>(), x, y, w, h);
            var image = obj.GetComponent<Image>();
            image.color = color;
            image.raycastTarget = false;
            return obj;
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
