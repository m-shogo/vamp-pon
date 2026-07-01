using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U14.Flow;
using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U15.Mappers;

namespace VampPon.UnitySpike.Editor
{
    public static class U15ContractProofScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u15/screenshots";
        private const string ReportPath = "Logs/u15_contract_screenshot_report.txt";
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
                    log.Add(Capture(p, $"u15-contract-flow-proof-{p.Width}x{p.Height}.png", BuildContractFlowProof));
                    log.Add(Capture(p, $"u15-result-presentation-proof-{p.Width}x{p.Height}.png", BuildResultPresentationProof));
                    log.Add(Capture(p, $"u15-stageselect-presentation-proof-{p.Width}x{p.Height}.png", BuildStageSelectPresentationProof));
                }

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

        private static GameObject BuildContractFlowProof(Transform parent)
        {
            var start = U14ToU15ContractMapper.ToStageStartRequest(BattleStartRequestProof.Sample);
            var result = U14ToU15ContractMapper.ToBattleResultSummary(BattleResultSummaryProof.FromRequest(BattleStartRequestProof.Sample));
            var presentation = BattleResultToPresentationMapper.ToResultPresentationModel(result);
            var stageSelect = StageSelectPresentationMapper.FromSample(result);

            var root = Root(parent, "U15ContractFlowProof");
            Txt(root.transform, "Title", "U15 Contract Proof", 0f, 334f, 330f, 34f, 20f, Paper);
            Card(root.transform, "StageStart", 0f, 204f, "StageStartRequest", $"{start.StageId} / {start.DifficultyId}", start.StageTitle);
            Arrow(root.transform, 132f);
            Card(root.transform, "BattleResult", 0f, 72f, "BattleResultSummary", $"{result.ClearState} / Rank {result.Rank}", $"欠片 {result.Fragments} / 討伐 {result.DefeatedEnemies}");
            Arrow(root.transform, 0f);
            Card(root.transform, "ResultPresentation", 0f, -60f, "ResultPresentationModel", $"{presentation.Title} / Rank {presentation.Rank}", presentation.FragmentLabel);
            Arrow(root.transform, -132f);
            Card(root.transform, "StageSelectPresentation", 0f, -192f, "StageSelectPresentationModel", stageSelect.LastResultLabel, "unlock確定なし");
            Txt(root.transform, "Note", "contract proof-only / save・reward・unlock未接続", 0f, -338f, 340f, 24f, 11f, new Color32(205, 182, 143, 255));
            return root;
        }

        private static GameObject BuildResultPresentationProof(Transform parent)
        {
            var summary = BattleResultSummary.Sample;
            var model = BattleResultToPresentationMapper.ToResultPresentationModel(summary);
            var root = Root(parent, "U15ResultPresentationProof");
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

        private static GameObject BuildStageSelectPresentationProof(Transform parent)
        {
            var model = StageSelectPresentationMapper.FromSample(BattleResultSummary.Sample);
            var root = Root(parent, "U15StageSelectPresentationProof");
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

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U15Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U15Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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
            var canvasRect = canvasObj.GetComponent<RectTransform>();
            canvasRect.sizeDelta = new Vector2(profile.Width, profile.Height);

            Panel(canvasRect, "Bg", 0f, 0f, 2000f, 2000f, Night);
            Panel(canvasRect, "TopShade", 0f, 360f, profile.Width + 80f, 160f, new Color32(11, 10, 12, 150));
            Panel(canvasRect, "BotShade", 0f, -360f, profile.Width + 80f, 190f, new Color32(22, 8, 10, 210));
            build(canvasRect);

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
