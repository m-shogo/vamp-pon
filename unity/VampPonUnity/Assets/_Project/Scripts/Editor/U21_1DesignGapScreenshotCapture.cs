using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U21_1DesignGapScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u21-1/screenshots";
        private const string ReportPath = "Logs/u21_1_design_gap_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(22, 20, 19, 255);
        private static readonly Color32 Panel = new(45, 34, 29, 244);
        private static readonly Color32 Paper = new(242, 226, 194, 255);
        private static readonly Color32 Amber = new(250, 203, 91, 255);
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

                var log = new List<string>();
                var p390 = new Profile(390, 844);
                log.Add(Capture(p390, "u21-1-stage-select-review-390x844.png", BuildStageSelect));
                log.Add(Capture(p390, "u21-1-stage1-playing-review-390x844.png", BuildStage1));
                log.Add(Capture(p390, "u21-1-levelup-review-390x844.png", BuildLevelUp));
                log.Add(Capture(p390, "u21-1-rare-review-390x844.png", BuildRare));
                log.Add(Capture(p390, "u21-1-evolution-review-390x844.png", BuildEvolution));
                log.Add(Capture(p390, "u21-1-kokuyou-ready-review-390x844.png", BuildKokuyouReady));
                log.Add(Capture(p390, "u21-1-kokuyou-active-review-390x844.png", BuildKokuyouActive));
                log.Add(Capture(p390, "u21-1-clear-result-review-390x844.png", BuildClearResult));
                log.Add(Capture(p390, "u21-1-fail-result-review-390x844.png", BuildFailResult));
                log.Add(Capture(p390, "u21-1-stage-return-review-390x844.png", BuildStageReturn));
                log.Add(Capture(p390, "u21-1-contact-sheet-flow-review.png", BuildFlowSheet));
                log.Add(Capture(p390, "u21-1-contact-sheet-risk-review.png", BuildRiskSheet));

                var p360 = new Profile(360, 800);
                var p430 = new Profile(430, 932);
                log.Add(Capture(p360, "u21-1-stage1-playing-review-360x800.png", BuildStage1));
                log.Add(Capture(p430, "u21-1-stage1-playing-review-430x932.png", BuildStage1));
                log.Add(Capture(p360, "u21-1-levelup-review-360x800.png", BuildLevelUp));
                log.Add(Capture(p430, "u21-1-levelup-review-430x932.png", BuildLevelUp));
                log.Add(Capture(p360, "u21-1-kokuyou-active-review-360x800.png", BuildKokuyouActive));
                log.Add(Capture(p430, "u21-1-kokuyou-active-review-430x932.png", BuildKokuyouActive));
                log.Add(Capture(p360, "u21-1-result-review-360x800.png", BuildClearResult));
                log.Add(Capture(p430, "u21-1-result-review-430x932.png", BuildClearResult));

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
            var root = Root(parent, "U21_1StageSelect");
            Title(root, "StageSelect Review");
            PanelBox(root.transform, "Map", 0f, 86f, 316f, 360f, Panel);
            Dot(root.transform, "Stage1", -98f, 190f, 58f, Amber);
            Dot(root.transform, "Locked1", 0f, 104f, 54f, new Color32(100, 88, 72, 255));
            Dot(root.transform, "Locked2", 96f, 20f, 54f, new Color32(88, 76, 64, 255));
            Text(root.transform, "Info", "はじまりの路地 / やさしい", 0f, -166f, 292f, 26f, 15f, Paper);
            Button(root.transform, "出発", 0f, -242f, 156f, 48f);
            Footer(root, "review polish: locked node contrast +1 / no unlock logic");
            return root;
        }

        private static GameObject BuildStage1(Transform parent)
        {
            var root = Root(parent, "U21_1Stage1");
            Title(root, "Stage1 Playing Review");
            Card(root.transform, "HUD", 0f, 176f, "Battle HUD", "S: still looks like a spec list");
            Card(root.transform, "EXP", 0f, 88f, "EXP / Drop", "needs pickups, routes, lantern pulse");
            Card(root.transform, "Hit", 0f, 0f, "Hit / Defeat", "needs ink burst and enemy presence");
            Card(root.transform, "Kokuyou", 0f, -88f, "黒耀化 Gauge", "keep dark, make it iconic later");
            Card(root.transform, "Result", 0f, -176f, "Clear / Fail", "proof rule only");
            return root;
        }

        private static GameObject BuildLevelUp(Transform parent)
        {
            var root = Root(parent, "U21_1LevelUp");
            Title(root, "LevelUp Review");
            PanelBox(root.transform, "Dim", 0f, 36f, 342f, 464f, new Color32(20, 14, 15, 232));
            var names = new[] { "夜の鉛筆\nLv+1", "紙飛行機\nLv+1", "街灯の輪\nLv+1" };
            for (var i = 0; i < 3; i++)
            {
                var x = -108f + i * 108f;
                PanelBox(root.transform, $"Card{i}", x, 44f, 88f, 186f, new Color32(236, 209, 160, 250));
                Text(root.transform, $"CardText{i}", names[i], x, 58f, 76f, 76f, 14f, new Color32(42, 27, 18, 255));
                Button(root.transform, "選ぶ", x, -58f, 66f, 30f, new Color32(108, 69, 38, 255));
            }
            Footer(root, "small polish: spacing + contrast / card art remains U23");
            return root;
        }

        private static GameObject BuildRare(Transform parent)
        {
            var root = Root(parent, "U21_1Rare");
            Title(root, "Rare Review");
            PanelBox(root.transform, "Flare", 0f, 58f, 280f, 250f, new Color32(116, 70, 36, 238));
            Text(root.transform, "Name", "夜明け前の記憶", 0f, 86f, 240f, 32f, 21f, Amber);
            Text(root.transform, "Need", "flareは控えめ。嬉しさはmotionで足す", 0f, 36f, 270f, 22f, 12f, Paper);
            Footer(root, "rare should glow, not become glossy gacha");
            return root;
        }

        private static GameObject BuildEvolution(Transform parent)
        {
            var root = Root(parent, "U21_1Evolution");
            Title(root, "Evolution Review");
            Card(root.transform, "Recipe", 0f, 136f, "Recipe Ready", "needs symbolic item silhouettes");
            Card(root.transform, "Trigger", 0f, 48f, "合体 Trigger", "moment is still too plain");
            Card(root.transform, "After", 0f, -40f, "Return to Battle", "resume timing later");
            Footer(root, "recipe DB and balance are not decided");
            return root;
        }

        private static GameObject BuildKokuyouReady(Transform parent)
        {
            var root = Root(parent, "U21_1KokuyouReady");
            Title(root, "黒耀化 Ready");
            PanelBox(root.transform, "Gauge", -118f, -156f, 48f, 238f, new Color32(18, 10, 17, 236));
            PanelBox(root.transform, "Fill", -118f, -154f, 28f, 218f, new Color32(120, 18, 58, 246));
            Text(root.transform, "Ready", "READY", 34f, 58f, 190f, 38f, 24f, Amber);
            Button(root.transform, "発動", 34f, -64f, 154f, 48f);
            Footer(root, "ready readability OK / climax feeling remains U24");
            return root;
        }

        private static GameObject BuildKokuyouActive(Transform parent)
        {
            var root = Root(parent, "U21_1KokuyouActive");
            PanelBox(root.transform, "Overlay", 0f, 0f, 390f, 844f, new Color32(58, 10, 36, 214));
            Title(root, "黒耀化 Active");
            PanelBox(root.transform, "Band", 0f, 108f, 350f, 98f, new Color32(22, 10, 22, 244));
            Text(root.transform, "State", "Active / 5 sec proof", 0f, 112f, 260f, 28f, 20f, Amber);
            Text(root.transform, "Hooks", "EXP boost / hit flash / trail hook", 0f, 42f, 306f, 22f, 13f, Paper);
            Footer(root, "overlay alpha slightly calmer / particles need human review");
            return root;
        }

        private static GameObject BuildClearResult(Transform parent) => BuildResult(parent, "Clear Result Review", "Rank A", "08:00 / KO 128", "欠片 12 / 記憶 3 / 加護 +3");
        private static GameObject BuildFailResult(Transform parent) => BuildResult(parent, "Fail Result Review", "Rank C", "03:00 / KO 8", "欠片 1 / 記憶 0 / 加護 +0");

        private static GameObject BuildStageReturn(Transform parent)
        {
            var root = BuildStageSelect(parent);
            Text(root.transform, "Last", "前回: Rank A / 欠片 12", 0f, -304f, 296f, 22f, 14f, Amber);
            return root;
        }

        private static GameObject BuildFlowSheet(Transform parent)
        {
            var root = Root(parent, "U21_1FlowSheet");
            Title(root, "U21.1 Flow Review");
            Card(root.transform, "A", 0f, 172f, "StageSelect", "Fix: stronger desire to depart");
            Card(root.transform, "B", 0f, 82f, "Stage1", "S: first polish target");
            Card(root.transform, "C", 0f, -8f, "LevelUp / Result", "A: repeated UI polish");
            Card(root.transform, "D", 0f, -98f, "黒耀化 / Rare / 合体", "A: climax pass later");
            Card(root.transform, "E", 0f, -188f, "No Production Hook", "save / reward / unlock still off");
            return root;
        }

        private static GameObject BuildRiskSheet(Transform parent)
        {
            var root = Root(parent, "U21_1RiskSheet");
            Title(root, "U21.1 Risk Review");
            Card(root.transform, "A", 0f, 172f, "Proof UI Look", "highest visual risk");
            Card(root.transform, "B", 0f, 82f, "Real Device", "not executed");
            Card(root.transform, "C", 0f, -8f, "Balance TBD", "EXP / drop / recipe");
            Card(root.transform, "D", 0f, -98f, "黒耀化B", "particle human review");
            Card(root.transform, "E", 0f, -188f, "Production Boundary", "productionApproved=0");
            return root;
        }

        private static GameObject BuildResult(Transform parent, string title, string rank, string stats, string rewards)
        {
            var root = Root(parent, title.Replace(" ", string.Empty));
            Title(root, title);
            Text(root.transform, "Rank", rank, 0f, 232f, 180f, 44f, 27f, Amber);
            PanelBox(root.transform, "Ledger", 0f, 44f, 322f, 300f, new Color32(45, 34, 29, 248));
            Text(root.transform, "Stats", stats, 0f, 126f, 260f, 24f, 16f, Paper);
            Text(root.transform, "Reward", rewards, 0f, 66f, 280f, 24f, 16f, Paper);
            Text(root.transform, "Cards", "記憶 / 墨 / 灯", 0f, -16f, 240f, 24f, 16f, Amber);
            Button(root.transform, "次へ", 0f, -236f, 154f, 48f);
            Footer(root, "alpha + font +1 / reward remains display-only");
            return root;
        }

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U21_1Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U21_1Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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
            PanelBox(canvasObj.transform, "Bg", 0f, 0f, 2000f, 2000f, Night);
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

        private static void Title(GameObject root, string text) => Text(root.transform, "Title", text, 0f, 322f, 340f, 34f, 20f, Paper);
        private static void Footer(GameObject root, string text) => Text(root.transform, "Footer", text, 0f, -362f, 346f, 20f, 10f, new Color32(208, 184, 144, 255));
        private static void Dot(Transform parent, string name, float x, float y, float size, Color color) => PanelBox(parent, name, x, y, size, size, color);

        private static void Card(Transform parent, string name, float x, float y, string title, string sub)
        {
            PanelBox(parent, name, x, y, 314f, 70f, Panel);
            Text(parent, $"{name}Title", title, x, y + 12f, 270f, 22f, 15f, Amber);
            Text(parent, $"{name}Sub", sub, x, y - 16f, 278f, 20f, 12f, Paper);
        }

        private static void Button(Transform parent, string text, float x, float y, float w, float h, Color? color = null)
        {
            PanelBox(parent, $"Button_{text}_{x}_{y}", x, y, w, h, color ?? new Color32(106, 67, 38, 255));
            Text(parent, $"ButtonText_{text}_{x}_{y}", text, x, y, w - 12f, h - 8f, 15f, Paper);
        }

        private static void PanelBox(Transform parent, string name, float x, float y, float w, float h, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            Rect(obj.GetComponent<RectTransform>(), x, y, w, h);
            var image = obj.GetComponent<Image>();
            image.color = color;
            image.raycastTarget = false;
        }

        private static void Text(Transform parent, string name, string text, float x, float y, float w, float h, float size, Color color)
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
