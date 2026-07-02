using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U25Stage1ProductionBattleLoopScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u25/screenshots";
        private const string ReportPath = "Logs/u25_stage1_production_battle_loop_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(17, 16, 19, 255);
        private static readonly Color32 Paper = new(228, 204, 160, 255);
        private static readonly Color32 Ink = new(9, 6, 8, 245);
        private static readonly Color32 Amber = new(248, 202, 104, 255);
        private static TMP_FontAsset font;

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);
                font = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(FontPath);
                if (font == null) throw new InvalidOperationException($"SDF font not found: {FontPath}");
                var log = new List<string>();
                log.Add(Capture("stage1-battle-runtime-loop.png", BuildBattle));
                log.Add(Capture("stage1-levelup-runtime.png", BuildLevelUp));
                log.Add(Capture("stage1-kokuyou-ready-runtime.png", BuildKokuyouReady));
                log.Add(Capture("stage1-kokuyou-active-runtime.png", BuildKokuyouActive));
                log.Add(Capture("stage1-evolution-runtime.png", BuildEvolution));
                log.Add(Capture("stage1-result-runtime.png", BuildResult));
                log.Add(Capture("stage1-stageselect-progress-runtime.png", BuildStageSelect));
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

        private static GameObject BuildBattle(Transform parent)
        {
            var root = Root(parent, "U25Battle");
            Bg(root.transform);
            Hud(root.transform, "08:00", "HP 72", "Lv 5");
            Player(root.transform, 0f, -120f);
            Enemy(root.transform, -120f, 82f);
            Enemy(root.transform, 120f, 104f);
            Enemy(root.transform, 96f, -26f);
            Txt(root.transform, "Flow", "Stage1 runtime loop", 0f, -350f, 260f, 20f, 11f, Paper);
            return root;
        }

        private static GameObject BuildLevelUp(Transform parent)
        {
            var root = Root(parent, "U25LevelUp");
            Bg(root.transform);
            Txt(root.transform, "Title", "LevelUp", 0f, 270f, 200f, 32f, 22f, Paper);
            for (var i = 0; i < 3; i++) Card(root.transform, -104f + i * 104f, 28f, i == 1 ? "selected" : "candidate");
            return root;
        }

        private static GameObject BuildKokuyouReady(Transform parent) => BuildClimax(parent, "Kokuyou Ready", "kokuyou_ready_pulse");
        private static GameObject BuildKokuyouActive(Transform parent) => BuildClimax(parent, "Kokuyou Active", "kokuyou_activate_cutin");
        private static GameObject BuildEvolution(Transform parent) => BuildClimax(parent, "Evolution", "evolution_material_converge");

        private static GameObject BuildResult(Transform parent)
        {
            var root = Root(parent, "U25Result");
            Bg(root.transform);
            Panel(root.transform, "Ledger", 0f, 40f, 300f, 360f, Paper);
            Panel(root.transform, "Seal", 0f, 112f, 90f, 90f, new Color32(105, 30, 38, 245));
            Txt(root.transform, "Rank", "Rank A", 0f, 114f, 80f, 28f, 18f, Paper);
            Txt(root.transform, "Stats", "clear / KO 128 / Lv 5", 0f, 32f, 230f, 24f, 13f, Ink);
            Txt(root.transform, "Reward", "欠片12 / 記憶3", 0f, -58f, 220f, 24f, 13f, Ink);
            return root;
        }

        private static GameObject BuildStageSelect(Transform parent)
        {
            var root = Root(parent, "U25StageSelect");
            Bg(root.transform);
            Txt(root.transform, "Title", "StageSelect Progress", 0f, 300f, 270f, 32f, 20f, Paper);
            Panel(root.transform, "Map", 0f, 42f, 310f, 460f, new Color32(47, 34, 27, 232));
            Panel(root.transform, "Route", 0f, 84f, 210f, 5f, Ink);
            Panel(root.transform, "Active", -92f, 116f, 58f, 58f, Amber);
            Panel(root.transform, "Locked", 88f, 28f, 46f, 46f, new Color32(68, 60, 54, 255));
            Txt(root.transform, "Stamp", "前回 Rank A / 欠片 12", 0f, -168f, 240f, 24f, 12f, Paper);
            return root;
        }

        private static GameObject BuildClimax(Transform parent, string title, string sub)
        {
            var root = Root(parent, title);
            Bg(root.transform);
            Panel(root.transform, "Crimson", 0f, 20f, 390f, 200f, new Color32(104, 18, 48, 130));
            Panel(root.transform, "Band", 0f, 54f, 390f, 90f, Ink);
            Panel(root.transform, "Streak", 0f, -20f, 330f, 8f, Amber);
            Txt(root.transform, "Title", title, 0f, 62f, 240f, 34f, 24f, Paper);
            Txt(root.transform, "Sub", sub, 0f, -342f, 280f, 18f, 10f, Paper);
            return root;
        }

        private static void Bg(Transform parent) => Panel(parent, "Bg", 0f, 0f, 390f, 844f, Night);
        private static void Hud(Transform parent, string time, string hp, string lv)
        {
            Panel(parent, "Hud", 0f, 352f, 350f, 54f, new Color32(44, 34, 28, 226));
            Txt(parent, "Time", time, -118f, 356f, 70f, 20f, 13f, Paper);
            Txt(parent, "Hp", hp, -20f, 356f, 70f, 20f, 13f, Paper);
            Txt(parent, "Lv", lv, 82f, 356f, 70f, 20f, 13f, Paper);
        }
        private static void Player(Transform parent, float x, float y) { Panel(parent, "Player", x, y, 48f, 66f, Paper); Panel(parent, "Lantern", x + 34f, y, 22f, 30f, Amber); }
        private static void Enemy(Transform parent, float x, float y) => Panel(parent, $"Enemy{x}", x, y, 50f, 50f, Ink);
        private static void Card(Transform parent, float x, float y, string label) { Panel(parent, $"Card{x}", x, y, 90f, 210f, Paper); Txt(parent, $"CardText{x}", label, x, y, 70f, 40f, 12f, Ink); }

        private static string Capture(string fileName, Func<Transform, GameObject> build)
        {
            const int width = 390;
            const int height = 844;
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U25Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U25Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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
            obj.GetComponent<Image>().color = color;
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
            tmp.overflowMode = TextOverflowModes.Ellipsis;
        }
        private static void Rect(RectTransform rect, float x, float y, float w, float h)
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
