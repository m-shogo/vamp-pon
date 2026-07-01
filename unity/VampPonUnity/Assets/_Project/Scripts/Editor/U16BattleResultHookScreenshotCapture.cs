using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U15.Mappers;
using VampPon.UnitySpike.U16.Battle;

namespace VampPon.UnitySpike.Editor
{
    public static class U16BattleResultHookScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u16/screenshots";
        private const string ReportPath = "Logs/u16_battle_result_hook_screenshot_report.txt";
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
                    log.Add(Capture(p, $"u16-battle-result-hook-proof-{p.Width}x{p.Height}.png", BuildBattleHookProof));
                    log.Add(Capture(p, $"u16-result-from-battle-summary-proof-{p.Width}x{p.Height}.png", BuildResultProof));
                    log.Add(Capture(p, $"u16-stage-return-with-last-result-proof-{p.Width}x{p.Height}.png", BuildStageReturnProof));
                }

                log.Add(Capture(new Profile(390, 844), "u16-all-battle-result-hook-contact-sheet.png", BuildContactSheet));
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

        private static GameObject BuildBattleHookProof(Transform parent)
        {
            var stats = BattleSessionStats.SampleClear;
            var summary = BattleResultSummaryBuilder.FromStats(stats);
            var root = Root(parent, "U16BattleResultHookProof");
            Txt(root.transform, "Title", "Battle Result Hook Proof", 0f, 314f, 330f, 34f, 20f, Paper);
            Panel(root.transform, "Ledger", 0f, 72f, 326f, 430f, InkPanel);
            Txt(root.transform, "Stage", $"Stage: {stats.StageTitle}", 0f, 224f, 286f, 24f, 15f, Paper);
            Txt(root.transform, "Difficulty", $"Difficulty: {stats.DifficultyLabel}", 0f, 190f, 286f, 22f, 13f, new Color32(205, 182, 143, 255));
            Txt(root.transform, "Elapsed", $"Elapsed: {summary.ElapsedLabel}", 0f, 138f, 250f, 24f, 15f, Paper);
            Txt(root.transform, "Defeated", $"Defeated: {stats.DefeatedEnemies}", 0f, 96f, 250f, 24f, 15f, Paper);
            Txt(root.transform, "Fragments", $"Fragments: {stats.CollectedFragments}", -72f, 34f, 110f, 24f, 14f, Paper);
            Txt(root.transform, "Memories", $"Memories: {stats.CollectedMemories}", 72f, 34f, 110f, 24f, 14f, Paper);
            Txt(root.transform, "Blessing", $"Blessing: {stats.Blessing}", 0f, -12f, 150f, 24f, 14f, Paper);
            Txt(root.transform, "Rank", $"Rank: {summary.Rank}", 0f, -82f, 170f, 42f, 25f, new Color32(248, 202, 104, 255));
            Txt(root.transform, "Button", "Resultへ渡す", 0f, -238f, 178f, 38f, 15f, Paper);
            Txt(root.transform, "Note", "proof-only / save・reward・unlock未接続", 0f, -318f, 330f, 22f, 11f, new Color32(205, 182, 143, 255));
            return root;
        }

        private static GameObject BuildResultProof(Transform parent)
        {
            var summary = BattleResultSummaryBuilder.FromStats(BattleSessionStats.SampleClear);
            var model = BattleResultToPresentationMapper.ToResultPresentationModel(summary);
            var root = Root(parent, "U16ResultFromBattleSummaryProof");
            Txt(root.transform, "Title", model.Title, 0f, 302f, 300f, 38f, 22f, Paper);
            Txt(root.transform, "Rank", $"Rank {model.Rank}", 0f, 242f, 180f, 44f, 26f, new Color32(248, 202, 104, 255));
            Panel(root.transform, "Ledger", 0f, 48f, 320f, 292f, InkPanel);
            Txt(root.transform, "Elapsed", model.ElapsedLabel, 0f, 142f, 240f, 24f, 15f, Paper);
            Txt(root.transform, "Defeated", model.DefeatedEnemiesLabel, 0f, 100f, 240f, 24f, 15f, Paper);
            Txt(root.transform, "Fragments", model.FragmentLabel, -82f, 26f, 100f, 24f, 15f, Paper);
            Txt(root.transform, "Memories", model.MemoryLabel, 0f, 26f, 100f, 24f, 15f, Paper);
            Txt(root.transform, "Blessing", model.BlessingLabel, 82f, 26f, 100f, 24f, 15f, Paper);
            for (var i = 0; i < model.RewardCardLabels.Length; i++)
            {
                var x = -86f + i * 86f;
                Panel(root.transform, $"Reward_{i}", x, -82f, 64f, 82f, new Color32(224, 190, 129, 230));
                Txt(root.transform, $"RewardLabel_{i}", model.RewardCardLabels[i], x, -82f, 58f, 28f, 14f, new Color32(38, 25, 18, 255));
            }
            Txt(root.transform, "Continue", model.ContinueLabel, 0f, -244f, 176f, 38f, 15f, Paper);
            return root;
        }

        private static GameObject BuildStageReturnProof(Transform parent)
        {
            var summary = BattleResultSummaryBuilder.FromStats(BattleSessionStats.SampleClear);
            var model = StageSelectPresentationMapper.FromSample(summary);
            var root = Root(parent, "U16StageReturnWithLastResultProof");
            Txt(root.transform, "Title", model.Title, 0f, 314f, 320f, 36f, 22f, Paper);
            Panel(root.transform, "Map", 0f, 92f, 310f, 360f, new Color32(31, 29, 25, 222));
            for (var i = 0; i < model.Nodes.Length; i++)
            {
                var node = model.Nodes[i];
                var y = 202f - i * 92f;
                var color = node.VisualState == "active" ? new Color32(238, 202, 122, 255) : new Color32(94, 82, 66, 255);
                Panel(root.transform, $"Node_{i}", -88f + i * 88f, y, 54f, 54f, color);
                Txt(root.transform, $"NodeTitle_{i}", node.StageTitle, 0f, y - 42f, 250f, 18f, 10f, Paper);
            }
            Panel(root.transform, "Info", 0f, -238f, 330f, 104f, InkPanel);
            Txt(root.transform, "InfoTitle", model.Info.StageTitle, -88f, -216f, 130f, 24f, 14f, Paper);
            Txt(root.transform, "InfoDifficulty", model.Info.DifficultyLabel, -98f, -246f, 110f, 20f, 11f, new Color32(205, 182, 143, 255));
            Txt(root.transform, "LastResult", model.LastResultLabel, 34f, -246f, 170f, 20f, 11f, new Color32(205, 182, 143, 255));
            Txt(root.transform, "Start", model.StartLabel, 112f, -216f, 90f, 32f, 15f, Paper);
            return root;
        }

        private static GameObject BuildContactSheet(Transform parent)
        {
            var root = Root(parent, "U16ContactSheet");
            Txt(root.transform, "Title", "U16 Battle Result Hook", 0f, 322f, 330f, 34f, 20f, Paper);
            Txt(root.transform, "Flow", "BattleSessionStats -> BattleResultSummary -> Result -> StageSelect", 0f, 274f, 340f, 42f, 13f, Paper);
            Card(root.transform, "Stats", 0f, 176f, "Stats", "08:00 / 討伐128", "fallback proof値あり");
            Arrow(root.transform, 104f);
            Card(root.transform, "Summary", 0f, 44f, "BattleResultSummary", "Rank A / 欠片12", "Reward表示のみ");
            Arrow(root.transform, -28f);
            Card(root.transform, "Return", 0f, -88f, "StageSelect", "前回: Rank A / 欠片 12", "unlock確定なし");
            Txt(root.transform, "Note", "Editor batchmode screenshot / 実機確認not executed", 0f, -318f, 340f, 22f, 11f, new Color32(205, 182, 143, 255));
            return root;
        }

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U16Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U16Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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
