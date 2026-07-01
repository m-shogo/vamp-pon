using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U15.Mappers;
using VampPon.UnitySpike.U16.Battle;
using VampPon.UnitySpike.U17.Loop;

namespace VampPon.UnitySpike.Editor
{
    public static class U17Stage1LoopScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u17/screenshots";
        private const string ReportPath = "Logs/u17_stage1_loop_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(24, 22, 21, 255);
        private static readonly Color32 InkPanel = new(38, 31, 26, 232);
        private static readonly Color32 Paper = new(238, 222, 190, 255);
        private static TMP_FontAsset font;

        private static readonly Profile[] MobileProfiles =
        {
            new(390, 844),
            new(360, 800),
            new(430, 932),
        };

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
                foreach (var p in MobileProfiles)
                {
                    log.Add(Capture(p, $"u17-stage-select-loop-entry-{p.Width}x{p.Height}.png", BuildStageSelectEntry));
                    log.Add(Capture(p, $"u17-stage1-loop-battle-proof-{p.Width}x{p.Height}.png", BuildBattleProof));
                    log.Add(Capture(p, $"u17-result-from-loop-proof-{p.Width}x{p.Height}.png", BuildResultProof));
                    log.Add(Capture(p, $"u17-stage-return-last-result-proof-{p.Width}x{p.Height}.png", BuildStageReturnProof));
                }

                log.Add(Capture(new Profile(390, 844), "u17-all-loop-contact-sheet.png", BuildContactSheet));
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
            var model = StageSelectPresentationMapper.FromSample();
            var root = Root(parent, "U17StageSelectLoopEntry");
            Txt(root.transform, "Title", model.Title, 0f, 314f, 320f, 36f, 22f, Paper);
            Panel(root.transform, "Map", 0f, 92f, 310f, 360f, new Color32(31, 29, 25, 222));
            Txt(root.transform, "Stage", "はじまりの路地", 0f, 156f, 240f, 28f, 16f, Paper);
            Txt(root.transform, "Difficulty", "やさしい", 0f, 112f, 160f, 22f, 13f, new Color32(205, 182, 143, 255));
            Txt(root.transform, "Last", "前回: なし", 0f, 64f, 220f, 22f, 12f, new Color32(205, 182, 143, 255));
            Txt(root.transform, "Start", "出発", 0f, -226f, 160f, 38f, 16f, Paper);
            return root;
        }

        private static GameObject BuildBattleProof(Transform parent)
        {
            var controllerObj = new GameObject("U17LoopController");
            var controller = controllerObj.AddComponent<U17Stage1LoopProofController>();
            controller.StartAndResolveLoop(StageStartRequest.Sample);
            var stats = controller.LastStats;
            var root = Root(parent, "U17Stage1LoopBattleProof");
            Txt(root.transform, "Title", "Stage1 Loop Proof", 0f, 314f, 330f, 34f, 20f, Paper);
            Panel(root.transform, "Ledger", 0f, 72f, 326f, 430f, InkPanel);
            Txt(root.transform, "Stage", stats.StageTitle, 0f, 224f, 286f, 24f, 16f, Paper);
            Txt(root.transform, "Difficulty", stats.DifficultyLabel, 0f, 190f, 220f, 22f, 13f, new Color32(205, 182, 143, 255));
            Txt(root.transform, "Time", $"Time: 00:00 -> {BattleSessionClock.FormatElapsed(stats.ElapsedSeconds)} proof", 0f, 132f, 282f, 24f, 14f, Paper);
            Txt(root.transform, "Defeated", $"Defeated: 0 -> {stats.DefeatedEnemies} proof", 0f, 92f, 282f, 24f, 14f, Paper);
            Txt(root.transform, "Fragments", $"Fragments: 0 -> {stats.CollectedFragments} proof", 0f, 52f, 282f, 24f, 14f, Paper);
            Txt(root.transform, "Memories", $"Memories: 0 -> {stats.CollectedMemories} proof", 0f, 12f, 282f, 24f, 14f, Paper);
            Txt(root.transform, "Level", $"Level: 1 -> {stats.ReachedLevel} proof", 0f, -28f, 282f, 24f, 14f, Paper);
            Txt(root.transform, "State", $"Clear proof / Rank {controller.LastSummary.Rank}", 0f, -92f, 220f, 30f, 18f, new Color32(248, 202, 104, 255));
            Txt(root.transform, "Button", "Resultへ", 0f, -238f, 178f, 38f, 15f, Paper);
            UnityEngine.Object.DestroyImmediate(controllerObj);
            return root;
        }

        private static GameObject BuildResultProof(Transform parent)
        {
            var summary = BattleResultSummaryBuilder.FromStats(BattleSessionStats.SampleClear);
            var model = BattleResultToPresentationMapper.ToResultPresentationModel(summary);
            var root = Root(parent, "U17ResultFromLoopProof");
            Txt(root.transform, "Title", model.Title, 0f, 302f, 300f, 38f, 22f, Paper);
            Txt(root.transform, "Rank", $"Rank {model.Rank}", 0f, 242f, 180f, 44f, 26f, new Color32(248, 202, 104, 255));
            Panel(root.transform, "Ledger", 0f, 48f, 320f, 292f, InkPanel);
            Txt(root.transform, "Elapsed", model.ElapsedLabel, 0f, 142f, 240f, 24f, 15f, Paper);
            Txt(root.transform, "Defeated", model.DefeatedEnemiesLabel, 0f, 100f, 240f, 24f, 15f, Paper);
            Txt(root.transform, "Fragments", model.FragmentLabel, -82f, 26f, 100f, 24f, 15f, Paper);
            Txt(root.transform, "Memories", model.MemoryLabel, 0f, 26f, 100f, 24f, 15f, Paper);
            Txt(root.transform, "Blessing", model.BlessingLabel, 82f, 26f, 100f, 24f, 15f, Paper);
            Txt(root.transform, "Continue", "次へ", 0f, -212f, 120f, 34f, 14f, Paper);
            Txt(root.transform, "Retry", "もう一度", -70f, -262f, 110f, 28f, 12f, new Color32(205, 182, 143, 255));
            Txt(root.transform, "Home", "ホーム", 70f, -262f, 110f, 28f, 12f, new Color32(205, 182, 143, 255));
            return root;
        }

        private static GameObject BuildStageReturnProof(Transform parent)
        {
            var summary = BattleResultSummaryBuilder.FromStats(BattleSessionStats.SampleClear);
            var model = StageSelectPresentationMapper.FromSample(summary);
            var root = Root(parent, "U17StageReturnLastResultProof");
            Txt(root.transform, "Title", model.Title, 0f, 314f, 320f, 36f, 22f, Paper);
            Panel(root.transform, "Map", 0f, 92f, 310f, 360f, new Color32(31, 29, 25, 222));
            Txt(root.transform, "Stage", "はじまりの路地", 0f, 156f, 240f, 28f, 16f, Paper);
            Txt(root.transform, "Last", model.LastResultLabel, 0f, 94f, 240f, 22f, 12f, new Color32(248, 202, 104, 255));
            Txt(root.transform, "Start", model.StartLabel, 0f, -226f, 160f, 38f, 16f, Paper);
            return root;
        }

        private static GameObject BuildContactSheet(Transform parent)
        {
            var root = Root(parent, "U17ContactSheet");
            Txt(root.transform, "Title", "U17 Stage1 Loop Proof", 0f, 322f, 330f, 34f, 20f, Paper);
            Card(root.transform, "Stage", 0f, 196f, "StageSelect", "StageStartRequest", "はじまりの路地 / やさしい");
            Arrow(root.transform, 124f);
            Card(root.transform, "Battle", 0f, 64f, "Battle", "Clear proof / Rank A", "collector更新");
            Arrow(root.transform, -8f);
            Card(root.transform, "Result", 0f, -68f, "Result", "BattleResultSummary", "次へ / もう一度 / ホームは設計");
            Arrow(root.transform, -140f);
            Card(root.transform, "Return", 0f, -200f, "StageSelect", "前回: Rank A / 欠片 12", "saveなし");
            return root;
        }

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U17Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U17Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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
            Panel(canvasObj.transform, "TopShade", 0f, 360f, profile.Width + 80f, 160f, new Color32(11, 10, 12, 150));
            Panel(canvasObj.transform, "BotShade", 0f, -360f, profile.Width + 80f, 190f, new Color32(22, 8, 10, 210));
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
