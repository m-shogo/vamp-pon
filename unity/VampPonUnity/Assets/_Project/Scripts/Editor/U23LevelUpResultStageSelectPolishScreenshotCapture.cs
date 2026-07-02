using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U23LevelUpResultStageSelectPolishScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u23/screenshots";
        private const string ReportPath = "Logs/u23_ui_visual_polish_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(17, 17, 20, 255);
        private static readonly Color32 Paper = new(228, 204, 160, 255);
        private static readonly Color32 PaperDark = new(78, 55, 38, 245);
        private static readonly Color32 Ink = new(13, 9, 10, 245);
        private static readonly Color32 Amber = new(248, 202, 104, 255);
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
                    log.Add(Capture(p, $"u23-levelup-polish-{p.Width}x{p.Height}.png", BuildLevelUp));
                    log.Add(Capture(p, $"u23-result-clear-polish-{p.Width}x{p.Height}.png", BuildResultClear));
                    log.Add(Capture(p, $"u23-stageselect-polish-{p.Width}x{p.Height}.png", BuildStageSelect));
                }

                var main = new Profile(390, 844);
                log.Add(Capture(main, "u23-result-fail-polish-390x844.png", BuildResultFail));
                log.Add(Capture(main, "u23-stage-return-polish-390x844.png", BuildStageReturn));
                log.Add(Capture(main, "u23-before-after-u22-vs-u23-levelup-390x844.png", BuildBeforeAfterLevelUp));
                log.Add(Capture(main, "u23-before-after-u22-vs-u23-result-390x844.png", BuildBeforeAfterResult));
                log.Add(Capture(main, "u23-before-after-u22-vs-u23-stageselect-390x844.png", BuildBeforeAfterStageSelect));
                log.Add(Capture(main, "u23-visual-target-alignment-contact-sheet.png", BuildAlignmentContact));
                log.Add(Capture(main, "u23-contact-sheet-ui-polish.png", BuildUiContact));
                log.Add(Capture(main, "u23-contact-sheet-mobile-risk.png", BuildMobileRisk));
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

        private static GameObject BuildLevelUp(Transform parent)
        {
            var root = Root(parent, "U23LevelUp");
            Background(root.transform);
            Txt(root.transform, "Title", "記憶を選ぶ", 0f, 282f, 260f, 34f, 22f, Paper);
            Txt(root.transform, "Prompt", "ひとつだけ、灯りに重ねる", 0f, 248f, 270f, 22f, 12f, new Color32(205, 182, 143, 255));
            var titles = new[] { "夜の鉛筆", "紙飛行機", "街灯の輪" };
            var effects = new[] { "攻撃 +1", "速度 +1", "範囲 +1" };
            for (var i = 0; i < 3; i++)
            {
                var x = -104f + i * 104f;
                PaperCard(root.transform, $"Card{i}", x, 28f, 92f, 218f, i == 1);
                Txt(root.transform, $"Icon{i}", i == 0 ? "✦" : i == 1 ? "◇" : "○", x, 92f, 42f, 36f, 20f, Ink);
                Txt(root.transform, $"Title{i}", titles[i], x, 44f, 76f, 24f, 13f, Ink);
                Txt(root.transform, $"Effect{i}", effects[i], x, 12f, 76f, 22f, 11f, new Color32(48, 30, 20, 255));
                Txt(root.transform, $"Level{i}", "Lv +1", x, -54f, 62f, 20f, 11f, new Color32(92, 58, 34, 255));
            }
            Footer(root, "U23 Visual Polish Proof / TMP text / productionApproved=0");
            return root;
        }

        private static GameObject BuildResultClear(Transform parent)
        {
            var root = Root(parent, "U23ResultClear");
            Background(root.transform);
            Panel(root.transform, "Dawn", 0f, 248f, 390f, 160f, new Color32(166, 102, 55, 45));
            Ledger(root.transform, "今夜の記録", "Rank A", "clear / 08:00 / KO 128");
            RewardCards(root.transform);
            Button(root.transform, "次へ", 0f, -270f, 158f, 44f);
            Footer(root, "display-only RewardSummary / no persistence");
            return root;
        }

        private static GameObject BuildResultFail(Transform parent)
        {
            var root = Root(parent, "U23ResultFail");
            Background(root.transform);
            Ledger(root.transform, "夜の途中", "Rank C", "fail / 03:00 / KO 8");
            PaperStrip(root.transform, "Hint", "次は灯りを絶やさない", 0f, -138f, 240f, 34f);
            Button(root.transform, "もう一度", 0f, -270f, 158f, 44f);
            Footer(root, "retry direction proof / no save");
            return root;
        }

        private static GameObject BuildStageSelect(Transform parent)
        {
            var root = Root(parent, "U23StageSelect");
            Background(root.transform);
            Txt(root.transform, "Title", "今夜の地図", 0f, 314f, 220f, 32f, 21f, Paper);
            Panel(root.transform, "MapPaper", 0f, 52f, 318f, 494f, new Color32(47, 34, 27, 232));
            Route(root.transform, -95f, 150f, 0f, 74f);
            Route(root.transform, 0f, 74f, 96f, -16f);
            Node(root.transform, -96f, 154f, true, "1");
            Node(root.transform, 0f, 74f, false, "2");
            Node(root.transform, 96f, -16f, false, "3");
            PaperStrip(root.transform, "Info", "はじまりの路地 / やさしい", 0f, -170f, 248f, 34f);
            Button(root.transform, "出発", 0f, -260f, 152f, 44f);
            Footer(root, "route / active lantern / locked readable");
            return root;
        }

        private static GameObject BuildStageReturn(Transform parent)
        {
            var root = BuildStageSelect(parent);
            PaperStrip(root.transform, "Previous", "前回 Rank A / 欠片 12", 0f, -214f, 236f, 28f);
            return root;
        }

        private static GameObject BuildBeforeAfterLevelUp(Transform parent) => BuildBeforeAfter(parent, "LevelUp", BuildLevelUp);
        private static GameObject BuildBeforeAfterResult(Transform parent) => BuildBeforeAfter(parent, "Result", BuildResultClear);
        private static GameObject BuildBeforeAfterStageSelect(Transform parent) => BuildBeforeAfter(parent, "StageSelect", BuildStageSelect);

        private static GameObject BuildBeforeAfter(Transform parent, string label, Func<Transform, GameObject> after)
        {
            var root = Root(parent, $"U23BeforeAfter{label}");
            Panel(root.transform, "Before", -96f, 0f, 172f, 610f, new Color32(38, 31, 26, 235));
            Txt(root.transform, "BeforeText", $"U22\n{label}\nplain proof", -96f, 54f, 124f, 140f, 14f, Paper);
            var group = new GameObject("AfterGroup", typeof(RectTransform));
            group.transform.SetParent(root.transform, false);
            Rect(group.GetComponent<RectTransform>(), 96f, 0f, 174f, 610f);
            Panel(group.transform, "AfterPanel", 0f, 0f, 174f, 610f, new Color32(21, 19, 20, 245));
            if (label == "LevelUp") MiniCards(group.transform);
            if (label == "Result") MiniLedger(group.transform);
            if (label == "StageSelect") MiniMap(group.transform);
            Footer(root, "before-after review sheet / not runtime");
            return root;
        }

        private static GameObject BuildAlignmentContact(Transform parent)
        {
            var root = Root(parent, "U23Alignment");
            Title(root, "Target Alignment");
            Card(root.transform, -82f, 158f, "Paper", "edge / shadow");
            Card(root.transform, 82f, 158f, "Ink", "border / route");
            Card(root.transform, -82f, 42f, "Lantern", "focus glow");
            Card(root.transform, 82f, 42f, "Ledger", "rank / rewards");
            Card(root.transform, 0f, -82f, "Map", "route / stamp");
            Footer(root, "final image not pasted into runtime");
            return root;
        }

        private static GameObject BuildUiContact(Transform parent)
        {
            var root = Root(parent, "U23UiContact");
            Title(root, "UI Polish");
            Card(root.transform, 0f, 160f, "LevelUp", "memory cards");
            Card(root.transform, 0f, 54f, "Result", "ledger rewards");
            Card(root.transform, 0f, -52f, "StageSelect", "night map");
            Card(root.transform, 0f, -158f, "Stage return", "stamp paper");
            return root;
        }

        private static GameObject BuildMobileRisk(Transform parent)
        {
            var root = Root(parent, "U23MobileRisk");
            Title(root, "Mobile Risk");
            Card(root.transform, 0f, 154f, "360x800", "card spacing ok");
            Card(root.transform, 0f, 48f, "390x844", "baseline");
            Card(root.transform, 0f, -58f, "430x932", "safe area ok");
            Card(root.transform, 0f, -164f, "Real device", "not executed");
            return root;
        }

        private static void Background(Transform parent)
        {
            Panel(parent, "Night", 0f, 0f, 390f, 844f, Night);
            Panel(parent, "TextureA", -102f, 210f, 190f, 4f, new Color32(102, 78, 48, 105));
            Panel(parent, "TextureB", 82f, -112f, 220f, 4f, new Color32(102, 78, 48, 92));
            Panel(parent, "InkCorner", -166f, 342f, 82f, 82f, new Color32(5, 4, 5, 180));
            Panel(parent, "InkCorner2", 166f, -342f, 74f, 74f, new Color32(5, 4, 5, 150));
        }

        private static void Ledger(Transform parent, string title, string rank, string stats)
        {
            PaperCard(parent, "Ledger", 0f, 72f, 310f, 374f, false);
            Txt(parent, "LedgerTitle", title, 0f, 222f, 230f, 30f, 20f, Ink);
            Panel(parent, "Seal", 0f, 142f, 92f, 92f, new Color32(105, 30, 38, 245));
            Txt(parent, "Rank", rank, 0f, 144f, 82f, 32f, 20f, Paper);
            Txt(parent, "Stats", stats, 0f, 72f, 238f, 24f, 13f, Ink);
        }

        private static void RewardCards(Transform parent)
        {
            var labels = new[] { "欠片\n12", "記憶\n3", "加護\n+3" };
            for (var i = 0; i < 3; i++)
            {
                var x = -84f + i * 84f;
                PaperCard(parent, $"Reward{i}", x, -88f, 70f, 86f, i == 1);
                Txt(parent, $"RewardText{i}", labels[i], x, -88f, 56f, 48f, 12f, Ink);
            }
        }

        private static void MiniCards(Transform parent)
        {
            for (var i = 0; i < 3; i++) PaperCard(parent, $"MiniCard{i}", -54f + i * 54f, 0f, 44f, 126f, i == 1);
        }

        private static void MiniLedger(Transform parent)
        {
            PaperCard(parent, "MiniLedger", 0f, 0f, 128f, 190f, false);
            Panel(parent, "MiniSeal", 0f, 34f, 52f, 52f, new Color32(105, 30, 38, 245));
        }

        private static void MiniMap(Transform parent)
        {
            PaperCard(parent, "MiniMap", 0f, 0f, 128f, 190f, false);
            Route(parent, -42f, 42f, 38f, -34f);
            Node(parent, -42f, 42f, true, "1");
            Node(parent, 38f, -34f, false, "2");
        }

        private static void PaperCard(Transform parent, string name, float x, float y, float w, float h, bool selected)
        {
            if (selected) Panel(parent, $"{name}Glow", x, y, w + 20f, h + 20f, new Color32(248, 202, 104, 46));
            Panel(parent, $"{name}Shadow", x + 3f, y - 4f, w, h, new Color32(5, 4, 5, 120));
            Panel(parent, $"{name}Ink", x, y, w + 6f, h + 6f, Ink);
            Panel(parent, name, x, y, w, h, Paper);
        }

        private static void PaperStrip(Transform parent, string name, string text, float x, float y, float w, float h)
        {
            PaperCard(parent, name, x, y, w, h, false);
            Txt(parent, $"{name}Text", text, x, y, w - 22f, h - 8f, 12f, Ink);
        }

        private static void Route(Transform parent, float x1, float y1, float x2, float y2)
        {
            Panel(parent, $"Route{x1}{y1}", (x1 + x2) * 0.5f, (y1 + y2) * 0.5f, Mathf.Abs(x2 - x1) + 22f, 5f, new Color32(8, 6, 6, 210));
        }

        private static void Node(Transform parent, float x, float y, bool active, string label)
        {
            if (active) Panel(parent, $"NodeGlow{label}", x, y, 76f, 76f, new Color32(248, 202, 104, 56));
            Panel(parent, $"Node{label}", x, y, 46f, 46f, active ? Amber : new Color32(68, 60, 54, 255));
            Txt(parent, $"NodeText{label}", label, x, y, 24f, 24f, 13f, active ? Ink : Paper);
        }

        private static void Button(Transform parent, string text, float x, float y, float w, float h)
        {
            PaperCard(parent, $"Button{text}", x, y, w, h, true);
            Txt(parent, $"ButtonText{text}", text, x, y, w - 20f, h - 8f, 16f, Ink);
        }

        private static void Title(GameObject root, string text) => Txt(root.transform, "Title", text, 0f, 314f, 280f, 32f, 20f, Paper);
        private static void Footer(GameObject root, string text) => Txt(root.transform, "Footer", text, 0f, -364f, 340f, 18f, 10f, new Color32(205, 182, 143, 255));

        private static void Card(Transform parent, float x, float y, string title, string sub)
        {
            PaperCard(parent, $"Card{title}", x, y, 142f, 78f, false);
            Txt(parent, $"CardTitle{title}", title, x, y + 12f, 112f, 22f, 14f, Ink);
            Txt(parent, $"CardSub{title}", sub, x, y - 14f, 112f, 20f, 10f, new Color32(52, 32, 22, 255));
        }

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U23Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U23Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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
