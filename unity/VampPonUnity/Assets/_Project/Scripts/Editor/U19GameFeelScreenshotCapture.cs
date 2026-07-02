using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U19GameFeelScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u19/screenshots";
        private const string ReportPath = "Logs/u19_game_feel_screenshot_report.txt";
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

                var p390 = new Profile(390, 844);
                var log = new List<string>
                {
                    Capture(p390, "u19-exp-magnet-proof-390x844.png", (t) => BuildExp(t)),
                    Capture(p390, "u19-drop-healing-proof-390x844.png", (t) => BuildDrop(t)),
                    Capture(p390, "u19-levelup-proof-390x844.png", (t) => BuildLevelUp(t)),
                    Capture(p390, "u19-rare-proof-390x844.png", (t) => BuildRare(t)),
                    Capture(p390, "u19-evolution-proof-390x844.png", (t) => BuildEvolution(t)),
                    Capture(p390, "u19-kokuyou-feel-proof-390x844.png", (t) => BuildKokuyou(t)),
                    Capture(p390, "u19-stage1-loop-feel-proof-390x844.png", (t) => BuildLoop(t)),
                    Capture(new Profile(360, 800), "u19-levelup-proof-360x800.png", (t) => BuildLevelUp(t)),
                    Capture(new Profile(430, 932), "u19-levelup-proof-430x932.png", (t) => BuildLevelUp(t)),
                    Capture(new Profile(360, 800), "u19-stage1-loop-feel-proof-360x800.png", (t) => BuildLoop(t)),
                    Capture(new Profile(430, 932), "u19-stage1-loop-feel-proof-430x932.png", (t) => BuildLoop(t)),
                    Capture(p390, "u19-all-game-feel-contact-sheet.png", (t) => BuildContact(t)),
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

        private static GameObject BuildExp(Transform parent)
        {
            var root = Root(parent, "U19ExpMagnet");
            Title(root, "EXP Magnet Proof");
            Panel(root.transform, "Area", 0f, 50f, 330f, 430f, InkPanel);
            Dot(root.transform, "Player", 0f, -78f, 34f, new Color32(246, 191, 92, 255));
            for (var i = 0; i < 5; i++)
            {
                var x = -118f + i * 58f;
                Dot(root.transform, $"Exp{i}", x, 150f - i * 20f, 15f, new Color32(126, 202, 188, 255));
                Txt(root.transform, $"Trail{i}", "• •", x * 0.45f, 42f + i * 10f, 54f, 18f, 12f, new Color32(245, 194, 101, 210));
            }
            Txt(root.transform, "Text", "near = stronger magnet / combo +1", 0f, -210f, 310f, 26f, 13f, Paper);
            return root;
        }

        private static GameObject BuildDrop(Transform parent)
        {
            var root = Root(parent, "U19DropHealing");
            Title(root, "Drop / 回復drop Proof");
            Panel(root.transform, "Area", 0f, 66f, 330f, 392f, InkPanel);
            Dot(root.transform, "Exp", -90f, 110f, 18f, new Color32(126, 202, 188, 255));
            Txt(root.transform, "ExpText", "EXP: magnet", -90f, 76f, 120f, 22f, 12f, Paper);
            Dot(root.transform, "Heart", 92f, 106f, 24f, new Color32(210, 77, 96, 255));
            Txt(root.transform, "HeartText", "Heart: manual", 92f, 68f, 130f, 22f, 12f, Paper);
            Txt(root.transform, "Note", "回復drop proof / 自分で取りに行く", 0f, -204f, 310f, 24f, 13f, Paper);
            return root;
        }

        private static GameObject BuildLevelUp(Transform parent)
        {
            var root = Root(parent, "U19LevelUp");
            Title(root, "LevelUp Proof");
            Panel(root.transform, "Dim", 0f, 40f, 342f, 456f, new Color32(20, 15, 17, 225));
            var names = new[] { "夜の鉛筆\nLv+1", "紙飛行機\nLv+1", "街灯の輪\nLv+1" };
            for (var i = 0; i < 3; i++)
            {
                var x = -104f + i * 104f;
                Panel(root.transform, $"Card{i}", x, 42f, 88f, 176f, new Color32(232, 205, 157, 238));
                Txt(root.transform, $"CardText{i}", names[i], x, 54f, 76f, 76f, 13f, new Color32(42, 27, 18, 255));
                Txt(root.transform, $"Button{i}", "選ぶ", x, -52f, 64f, 24f, 11f, new Color32(42, 27, 18, 255));
            }
            Txt(root.transform, "Prompt", "静かに嬉しい / 360x800 readable", 0f, -202f, 310f, 24f, 12f, Paper);
            return root;
        }

        private static GameObject BuildRare(Transform parent)
        {
            var root = Root(parent, "U19Rare");
            Title(root, "Rare Proof");
            Panel(root.transform, "Glow", 0f, 40f, 310f, 430f, new Color32(68, 24, 46, 230));
            Dot(root.transform, "Pulse", 0f, 94f, 158f, new Color32(245, 182, 92, 70));
            Panel(root.transform, "Card", 0f, 42f, 150f, 210f, new Color32(232, 205, 157, 245));
            Txt(root.transform, "RareLabel", "Rare", 0f, 122f, 120f, 28f, 18f, new Color32(90, 35, 36, 255));
            Txt(root.transform, "RareName", "夜明け前の記憶", 0f, 42f, 120f, 42f, 13f, new Color32(42, 27, 18, 255));
            Txt(root.transform, "Note", "short slow / no gacha sparkle", 0f, -204f, 310f, 24f, 12f, Paper);
            return root;
        }

        private static GameObject BuildEvolution(Transform parent)
        {
            var root = Root(parent, "U19Evolution");
            Title(root, "Evolution / 合体 Proof");
            Panel(root.transform, "Area", 0f, 48f, 330f, 420f, InkPanel);
            Panel(root.transform, "Left", -92f, 96f, 94f, 92f, new Color32(64, 45, 58, 245));
            Panel(root.transform, "Right", 92f, 96f, 94f, 92f, new Color32(90, 72, 40, 245));
            Txt(root.transform, "Plus", "+", 0f, 98f, 32f, 32f, 20f, Paper);
            Txt(root.transform, "LeftText", "黒インク小瓶\nLv5", -92f, 96f, 82f, 48f, 11f, Paper);
            Txt(root.transform, "RightText", "街灯の輪\nLv5", 92f, 96f, 82f, 48f, 11f, Paper);
            Txt(root.transform, "Eq", "=", 0f, 12f, 32f, 32f, 20f, Paper);
            Txt(root.transform, "Result", "夜明けのインク灯", 0f, -58f, 220f, 34f, 17f, new Color32(248, 202, 104, 255));
            Txt(root.transform, "Note", "ready -> trigger proof / saveなし", 0f, -202f, 310f, 24f, 12f, Paper);
            return root;
        }

        private static GameObject BuildKokuyou(Transform parent)
        {
            var root = Root(parent, "U19KokuyouFeel");
            Panel(root.transform, "RedBlack", 0f, 0f, 390f, 844f, new Color32(54, 12, 36, 230));
            Title(root, "黒耀化 Feel Proof");
            Panel(root.transform, "Area", 0f, 52f, 330f, 420f, new Color32(20, 12, 18, 218));
            Txt(root.transform, "Active", "黒耀化 Active", 0f, 148f, 240f, 34f, 22f, new Color32(248, 202, 104, 255));
            Txt(root.transform, "Magnet", "EXP magnet x1.35 proof", 0f, 84f, 250f, 24f, 14f, Paper);
            Txt(root.transform, "Flash", "hit flash / ink burst stronger", 0f, 42f, 260f, 24f, 14f, Paper);
            Txt(root.transform, "End", "end -> short recoil -> normal", 0f, 0f, 260f, 24f, 14f, Paper);
            Dot(root.transform, "Lantern", 0f, -86f, 42f, new Color32(248, 202, 104, 230));
            return root;
        }

        private static GameObject BuildLoop(Transform parent)
        {
            var root = Root(parent, "U19StageLoopFeel");
            Title(root, "Stage1 Loop Feel Proof");
            Card(root.transform, "Exp", 0f, 194f, "EXP吸引", "combo / trail / pop");
            Card(root.transform, "Level", 0f, 104f, "LevelUp", "3 cards / choose");
            Card(root.transform, "Rare", 0f, 14f, "Rare", "short slow / warm flare");
            Card(root.transform, "Evolution", 0f, -76f, "Evolution", "夜明けのインク灯");
            Card(root.transform, "Kokuyou", 0f, -166f, "黒耀化", "stronger feel / recoil");
            Txt(root.transform, "Result", "Resultへ: Feel label only / 永続反映なし", 0f, -296f, 330f, 24f, 12f, Paper);
            return root;
        }

        private static GameObject BuildContact(Transform parent)
        {
            var root = Root(parent, "U19Contact");
            Title(root, "U19 Game Feel Proof");
            Card(root.transform, "A", 0f, 180f, "Collect", "EXP / Heart / Memory");
            Card(root.transform, "B", 0f, 84f, "Reward Moment", "LevelUp / Rare");
            Card(root.transform, "C", 0f, -12f, "Build Moment", "Evolution / 合体");
            Card(root.transform, "D", 0f, -108f, "Power Moment", "黒耀化 Active");
            Card(root.transform, "E", 0f, -204f, "Loop", "Result -> StageSelect");
            return root;
        }

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U19Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U19Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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

        private static void Title(GameObject root, string text)
        {
            Txt(root.transform, "Title", text, 0f, 322f, 340f, 34f, 20f, Paper);
        }

        private static void Card(Transform parent, string name, float x, float y, string title, string sub)
        {
            Panel(parent, name, x, y, 310f, 70f, InkPanel);
            Txt(parent, $"{name}Title", title, x, y + 12f, 260f, 22f, 14f, new Color32(248, 202, 104, 255));
            Txt(parent, $"{name}Sub", sub, x, y - 16f, 260f, 20f, 11f, Paper);
        }

        private static void Dot(Transform parent, string name, float x, float y, float size, Color color)
        {
            Panel(parent, name, x, y, size, size, color);
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
