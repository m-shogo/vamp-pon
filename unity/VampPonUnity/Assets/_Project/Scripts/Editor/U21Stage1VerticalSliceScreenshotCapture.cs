using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U21Stage1VerticalSliceScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u21/screenshots";
        private const string ReportPath = "Logs/u21_stage1_vertical_slice_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(24, 22, 21, 255);
        private static readonly Color32 PanelColor = new(38, 31, 26, 232);
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

                var log = new List<string>();
                var profiles = new[] { new Profile(360, 800), new Profile(390, 844), new Profile(430, 932) };
                foreach (var p in profiles)
                {
                    log.Add(Capture(p, $"u21-stage-select-entry-{p.Width}x{p.Height}.png", BuildStageSelectEntry));
                    log.Add(Capture(p, $"u21-stage1-playing-{p.Width}x{p.Height}.png", BuildStage1Playing));
                    log.Add(Capture(p, $"u21-levelup-integrated-{p.Width}x{p.Height}.png", BuildLevelUpIntegrated));
                    log.Add(Capture(p, $"u21-kokuyou-active-{p.Width}x{p.Height}.png", BuildKokuyouActive));
                    log.Add(Capture(p, $"u21-clear-result-{p.Width}x{p.Height}.png", BuildClearResult));
                }

                log.Add(Capture(new Profile(390, 844), "u21-rare-integrated-390x844.png", BuildRareIntegrated));
                log.Add(Capture(new Profile(390, 844), "u21-evolution-integrated-390x844.png", BuildEvolutionIntegrated));
                log.Add(Capture(new Profile(390, 844), "u21-kokuyou-ready-390x844.png", BuildKokuyouReady));
                log.Add(Capture(new Profile(390, 844), "u21-fail-result-390x844.png", BuildFailResult));
                log.Add(Capture(new Profile(390, 844), "u21-stage-return-last-result-390x844.png", BuildStageReturn));
                log.Add(Capture(new Profile(390, 844), "u21-contact-sheet-flow.png", BuildFlowContact));
                log.Add(Capture(new Profile(390, 844), "u21-contact-sheet-risk.png", BuildRiskContact));

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

        private static GameObject BuildStageSelectEntry(Transform parent)
        {
            var root = Root(parent, "U21StageSelectEntry");
            Title(root, "StageSelect");
            Panel(root.transform, "Map", 0f, 82f, 312f, 360f, PanelColor);
            Dot(root.transform, "Stage1", -96f, 190f, 56f, new Color32(238, 202, 122, 255));
            Dot(root.transform, "Locked2", 0f, 104f, 54f, new Color32(78, 70, 60, 255));
            Dot(root.transform, "Locked3", 94f, 18f, 54f, new Color32(78, 70, 60, 255));
            Txt(root.transform, "Info", "はじまりの路地 / やさしい", 0f, -174f, 286f, 24f, 14f, Paper);
            Button(root.transform, "出発", 0f, -246f, 150f, 46f);
            Footer(root, "entry from U15 StageSelectPresentationModel");
            return root;
        }

        private static GameObject BuildStage1Playing(Transform parent)
        {
            var root = Root(parent, "U21Stage1Playing");
            Title(root, "Stage1 Vertical Slice");
            Card(root.transform, "Move", 0f, 172f, "movement / enemy chase", "proof loop");
            Card(root.transform, "Hit", 0f, 82f, "attack / hit / defeat", "KO 128");
            Card(root.transform, "Drop", 0f, -8f, "EXP / Drop / Heart", "Heart manual");
            Card(root.transform, "Gauge", 0f, -98f, "Kokuyou gauge", "damage charge");
            Card(root.transform, "Clear", 0f, -188f, "clear / fail", "proof rule only");
            return root;
        }

        private static GameObject BuildLevelUpIntegrated(Transform parent)
        {
            var root = Root(parent, "U21LevelUpIntegrated");
            Title(root, "LevelUp Integrated");
            Panel(root.transform, "Dim", 0f, 36f, 342f, 464f, new Color32(20, 15, 17, 225));
            var names = new[] { "夜の鉛筆\nLv+1", "紙飛行機\nLv+1", "街灯の輪\nLv+1" };
            for (var i = 0; i < 3; i++)
            {
                var x = -104f + i * 104f;
                Panel(root.transform, $"Card{i}", x, 42f, 92f, 180f, new Color32(232, 205, 157, 238));
                Txt(root.transform, $"CardText{i}", names[i], x, 54f, 78f, 76f, 13f, new Color32(42, 27, 18, 255));
                Button(root.transform, "選ぶ", x, -54f, 64f, 28f, new Color32(92, 58, 34, 255));
            }
            Footer(root, "EXP collect -> LevelUp -> selected card");
            return root;
        }

        private static GameObject BuildRareIntegrated(Transform parent)
        {
            var root = Root(parent, "U21RareIntegrated");
            Title(root, "Rare Integrated");
            Panel(root.transform, "Burst", 0f, 60f, 274f, 274f, new Color32(92, 58, 34, 235));
            Txt(root.transform, "Rare", "夜明け前の記憶", 0f, 92f, 230f, 32f, 20f, new Color32(248, 202, 104, 255));
            Txt(root.transform, "Sub", "rare proof / hitstop hook", 0f, 44f, 240f, 22f, 12f, Paper);
            Footer(root, "not gacha production / presentation proof");
            return root;
        }

        private static GameObject BuildEvolutionIntegrated(Transform parent)
        {
            var root = Root(parent, "U21EvolutionIntegrated");
            Title(root, "Evolution Integrated");
            Card(root.transform, "Recipe", 0f, 138f, "recipe ready", "ink bottle + lamp ring");
            Card(root.transform, "Trigger", 0f, 48f, "合体 trigger", "presentation proof");
            Card(root.transform, "Return", 0f, -42f, "battle resumes", "TimeScale final=1");
            Footer(root, "recipe values are not production balance");
            return root;
        }

        private static GameObject BuildKokuyouReady(Transform parent)
        {
            var root = Root(parent, "U21KokuyouReady");
            Title(root, "黒耀化 Ready");
            Panel(root.transform, "Gauge", -118f, -156f, 46f, 238f, new Color32(18, 11, 18, 230));
            Panel(root.transform, "GaugeFill", -118f, -156f, 28f, 218f, new Color32(105, 15, 53, 235));
            Txt(root.transform, "Ready", "Ready", 30f, 58f, 190f, 38f, 24f, new Color32(248, 202, 104, 255));
            Button(root.transform, "発動", 32f, -64f, 150f, 46f);
            Footer(root, "damage charge proof / pause blocks activation");
            return root;
        }

        private static GameObject BuildKokuyouActive(Transform parent)
        {
            var root = Root(parent, "U21KokuyouActive");
            Panel(root.transform, "Overlay", 0f, 0f, 390f, 844f, new Color32(54, 12, 36, 220));
            Title(root, "黒耀化 Active");
            Panel(root.transform, "Cutin", 0f, 108f, 350f, 98f, new Color32(28, 13, 28, 238));
            Txt(root.transform, "Active", "Active / buff proof", 0f, 110f, 260f, 28f, 20f, new Color32(248, 202, 104, 255));
            Txt(root.transform, "Note", "EXP boost / hit flash / trail hook", 0f, 38f, 300f, 22f, 12f, Paper);
            Footer(root, "green/yellow particles require human review");
            return root;
        }

        private static GameObject BuildClearResult(Transform parent)
        {
            return BuildResult(parent, "Clear Result", "Rank A", "clear / 08:00 / KO 128", "欠片 12 / 記憶 3 / 加護 +3");
        }

        private static GameObject BuildFailResult(Transform parent)
        {
            return BuildResult(parent, "Fail Result", "Rank C", "fail / 03:00 / KO 8", "欠片 1 / 記憶 0 / 加護 +0");
        }

        private static GameObject BuildStageReturn(Transform parent)
        {
            var root = BuildStageSelectEntry(parent);
            Txt(root.transform, "LastResult", "前回: Rank A / 欠片 12", 0f, -304f, 290f, 22f, 13f, new Color32(248, 202, 104, 255));
            return root;
        }

        private static GameObject BuildFlowContact(Transform parent)
        {
            var root = Root(parent, "U21FlowContact");
            Title(root, "U21 Flow");
            Card(root.transform, "A", 0f, 172f, "StageSelect", "StageStartRequest");
            Card(root.transform, "B", 0f, 82f, "Stage1", "EXP / Drop / LevelUp / Rare");
            Card(root.transform, "C", 0f, -8f, "Evolution / 黒耀化", "proof runtime");
            Card(root.transform, "D", 0f, -98f, "Clear / Fail", "BattleResultSummary");
            Card(root.transform, "E", 0f, -188f, "Result -> StageSelect", "last result label");
            return root;
        }

        private static GameObject BuildRiskContact(Transform parent)
        {
            var root = Root(parent, "U21RiskContact");
            Title(root, "U21 Risks");
            Card(root.transform, "A", 0f, 172f, "Real Device", "not executed");
            Card(root.transform, "B", 0f, 82f, "Build Modules", "iOS/Android missing");
            Card(root.transform, "C", 0f, -8f, "Balance", "EXP/drop/evolution TBD");
            Card(root.transform, "D", 0f, -98f, "黒耀化B", "particle human review");
            Card(root.transform, "E", 0f, -188f, "No persistence", "save/reward/stage locked");
            return root;
        }

        private static GameObject BuildResult(Transform parent, string title, string rank, string stats, string rewards)
        {
            var root = Root(parent, title.Replace(" ", string.Empty));
            Title(root, title);
            Txt(root.transform, "Rank", rank, 0f, 232f, 180f, 44f, 26f, new Color32(248, 202, 104, 255));
            Panel(root.transform, "Ledger", 0f, 44f, 320f, 300f, PanelColor);
            Txt(root.transform, "Stats", stats, 0f, 126f, 260f, 24f, 15f, Paper);
            Txt(root.transform, "Reward", rewards, 0f, 66f, 280f, 24f, 15f, Paper);
            Txt(root.transform, "Cards", "記憶 / 墨 / 灯", 0f, -16f, 240f, 24f, 15f, new Color32(248, 202, 104, 255));
            Button(root.transform, "次へ", 0f, -236f, 150f, 46f);
            Footer(root, "display-only RewardSummary / no persistence");
            return root;
        }

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U21Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U21Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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
            Panel(parent, name, x, y, 310f, 70f, PanelColor);
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
