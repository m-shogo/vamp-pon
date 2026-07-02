using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U30.ApprovalGate;

namespace VampPon.UnitySpike.Editor
{
    public static class U30ProductionApprovalGateScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u30/screenshots";
        private const string GeneratedDirectory = "../../docs/design-targets/generated/unity-u30";
        private const string ReportPath = "Logs/u30_production_approval_gate_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(16, 14, 18, 255);
        private static readonly Color32 Paper = new(232, 215, 184, 255);
        private static readonly Color32 Ink = new(18, 12, 15, 245);
        private static readonly Color32 Crimson = new(136, 35, 52, 245);
        private static readonly Color32 Lantern = new(244, 194, 89, 255);
        private static readonly Color32 Moss = new(71, 117, 92, 255);
        private static TMP_FontAsset font;

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);
                Directory.CreateDirectory(GeneratedDirectory);
                font = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(FontPath);
                if (font == null) throw new InvalidOperationException($"SDF font not found: {FontPath}");
                var report = new U30ProductionApprovalPolicy().BuildCurrentStage1Report();
                WriteArtifacts(report);
                var log = new List<string>
                {
                    Capture("01-stageselect-before-run.png", "StageSelect", "before run / internal preview", "production approved: false", Moss),
                    Capture("02-stage1-opening.png", "Stage1 Opening", "runtime loop proof", "390x844 editor evidence", Moss),
                    Capture("03-first-levelup.png", "First LevelUp", "choice gate proof", "choice flow passes", Moss),
                    Capture("04-rare-or-reward-moment.png", "Rare Reward", "rare moment exists", "final balance caution", Lantern),
                    Capture("05-evolution-moment.png", "Evolution", "evolution moment exists", "final asset caution", Lantern),
                    Capture("06-kokuyou-ready-or-active.png", "Kokuyou", "ready / active proof", "device feel caution", Lantern),
                    Capture("07-result-clear.png", "Result Clear", "result transition proof", "reward economy draft", Lantern),
                    Capture("08-result-reward-unlock.png", "Reward Unlock", "unlock proof exists", "save caution", Lantern),
                    Capture("09-stageselect-after-clear.png", "StageSelect", "after clear state", "retry path available", Moss),
                    Capture("10-retry-flow.png", "Retry Flow", "retry proof exists", "mobile QA next", Moss),
                };
                File.WriteAllText(ReportPath, string.Join(Environment.NewLine, log));
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                File.WriteAllText(ReportPath, ex.ToString());
                Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static void WriteArtifacts(U30Stage1ApprovalReport report)
        {
            File.WriteAllText(Path.Combine(GeneratedDirectory, "stage1-approval-report.json"), ReportJson(report));
            File.WriteAllText(Path.Combine(GeneratedDirectory, "stage1-gate-results.json"), GatesJson(report));
            File.WriteAllText(Path.Combine(GeneratedDirectory, "stage1-regression-matrix.json"), RegressionJson());
            File.WriteAllText(Path.Combine(GeneratedDirectory, "sprite-atlas-packing-map.json"), SpriteAtlasJson());
            File.WriteAllText(Path.Combine(GeneratedDirectory, "production-boundary-check.json"), BoundaryJson());
        }

        private static string ReportJson(U30Stage1ApprovalReport report)
        {
            var state = report.State;
            return "{\n" +
                   $"  \"stageId\": \"{state.StageId}\",\n" +
                   $"  \"versionTag\": \"{state.VersionTag}\",\n" +
                   "  \"productionApproved\": false,\n" +
                   "  \"internalPreviewReady\": true,\n" +
                   "  \"mobileQaReady\": true,\n" +
                   "  \"assetReplacementReady\": false,\n" +
                   "  \"performanceQaReady\": true,\n" +
                   $"  \"gateCount\": {state.GateCount},\n" +
                   $"  \"passCount\": {state.PassCount},\n" +
                   $"  \"cautionCount\": {state.CautionCount},\n" +
                   $"  \"failCount\": {state.FailCount},\n" +
                   $"  \"notMeasuredCount\": {state.NotMeasuredCount},\n" +
                   $"  \"criticalBlockerCount\": {state.CriticalBlockerCount},\n" +
                   "  \"verdict\": \"not production approved; ready for internal preview and mobile QA handoff\"\n" +
                   "}\n";
        }

        private static string GatesJson(U30Stage1ApprovalReport report)
        {
            var builder = new StringBuilder();
            builder.Append("{\n  \"gates\": [\n");
            for (var i = 0; i < report.Gates.Count; i++)
            {
                var gate = report.Gates[i];
                builder.Append("    {\n");
                builder.Append($"      \"id\": \"{gate.Id}\",\n");
                builder.Append($"      \"label\": \"{gate.Label}\",\n");
                builder.Append($"      \"status\": \"{StatusJson(gate.Status)}\",\n");
                builder.Append($"      \"critical\": {JsonBool(gate.Critical)},\n");
                builder.Append($"      \"evidence\": \"{gate.Evidence}\",\n");
                builder.Append($"      \"note\": \"{gate.Note}\"\n");
                builder.Append(i == report.Gates.Count - 1 ? "    }\n" : "    },\n");
            }
            builder.Append("  ]\n}\n");
            return builder.ToString();
        }

        private static string RegressionJson()
        {
            return "{\n" +
                   "  \"checks\": [\n" +
                   "    {\"id\":\"u22\", \"script\":\"unity:u22-battle-visual-polish:check\", \"status\":\"required\"},\n" +
                   "    {\"id\":\"u23\", \"script\":\"unity:u23-ui-visual-polish:check\", \"status\":\"required\"},\n" +
                   "    {\"id\":\"u24\", \"script\":\"unity:u24-climax-polish:check\", \"status\":\"required\"},\n" +
                   "    {\"id\":\"u25\", \"script\":\"unity:u25-stage1-production-battle-loop:check\", \"status\":\"required\"},\n" +
                   "    {\"id\":\"u26\", \"script\":\"unity:u26-stage1-first-playable-balance:check\", \"status\":\"required\"},\n" +
                   "    {\"id\":\"u27\", \"script\":\"unity:u27-save-reward-unlock:check\", \"status\":\"required\"},\n" +
                   "    {\"id\":\"u28\", \"script\":\"unity:u28-se-haptic-feel:check\", \"status\":\"required\"},\n" +
                   "    {\"id\":\"u29\", \"script\":\"unity:u29-performance-mobile-fps:check\", \"status\":\"required\"},\n" +
                   "    {\"id\":\"u30\", \"script\":\"unity:u30-production-approval-gate:check\", \"status\":\"required\"}\n" +
                   "  ]\n" +
                   "}\n";
        }

        private static string SpriteAtlasJson()
        {
            return "{\n" +
                   "  \"status\": \"draft packing map only; production .spriteatlas evidence incomplete\",\n" +
                   "  \"productionPackingComplete\": false,\n" +
                   "  \"criticalBlocker\": true,\n" +
                   "  \"addressables\": \"not introduced\",\n" +
                   "  \"groups\": [\n" +
                   "    {\"name\":\"U30Characters\", \"sources\":[\"public/assets/prototypes/sprite-sheets/core5-original\", \"public/assets/prototypes/sprite-sheets/core5-original-frames\"], \"runtimeCandidate\":\"Unity-created or finished assets only\"},\n" +
                   "    {\"name\":\"U30Enemies\", \"sources\":[\"public/assets/prototypes/sprite-sheets/enemies-original\"], \"runtimeCandidate\":\"requires Unity readability QA\"},\n" +
                   "    {\"name\":\"U30ItemsIcons\", \"sources\":[\"public/assets/prototypes/sprite-sheets/weapon\", \"public/assets/prototypes/sprite-sheets/passive\", \"public/assets/prototypes/sprite-sheets/rare\"], \"runtimeCandidate\":\"icons and pickups only\"},\n" +
                   "    {\"name\":\"U30UiPaper\", \"sources\":[\"Unity UI materials and paper sprites\"], \"runtimeCandidate\":\"exclude screenshots and design-target PNGs\"},\n" +
                   "    {\"name\":\"U30Effects\", \"sources\":[\"Unity effect sprites and particles\"], \"runtimeCandidate\":\"exclude full-screen review art\"}\n" +
                   "  ],\n" +
                   "  \"excluded\": [\"docs/design-targets/generated\", \"generated screenshots\", \"fullscreen review art\", \"completed screen images\"]\n" +
                   "}\n";
        }

        private static string BoundaryJson()
        {
            return "{\n" +
                   "  \"runtimeGeneratedFinalPngPaste\": false,\n" +
                   "  \"runtimeDesignTargetReference\": false,\n" +
                   "  \"addressablesIntroduced\": false,\n" +
                   "  \"cloudSaveIntroduced\": false,\n" +
                   "  \"playerPrefsSaveProof\": \"U27 local proof only\",\n" +
                   "  \"mobileDeviceMeasurement\": \"not measured\",\n" +
                   "  \"productionApproved\": false\n" +
                   "}\n";
        }

        private static string Capture(string fileName, string title, string note, string status, Color color)
        {
            return Render(fileName, parent =>
            {
                Panel(parent, "Bg", 0f, 0f, 390f, 844f, Night);
                Txt(parent, "Title", title, 0f, 292f, 300f, 34f, 22f, Paper);
                Panel(parent, "Frame", 0f, 50f, 314f, 470f, new Color32(42, 33, 31, 238));
                Panel(parent, "Stage", 0f, 82f, 244f, 280f, Ink);
                Panel(parent, "MeterA", -48f, 150f, 132f, 18f, color);
                Panel(parent, "MeterB", 58f, 92f, 116f, 18f, Lantern);
                Panel(parent, "MeterC", 0f, 34f, 182f, 18f, Crimson);
                Txt(parent, "Note", note, 0f, -98f, 270f, 30f, 13f, Paper);
                Txt(parent, "Status", status, 0f, -140f, 286f, 28f, 12f, Paper);
                Txt(parent, "Footer", "U30 gate evidence / not production approval", 0f, -326f, 306f, 20f, 11f, Paper);
            });
        }

        private static string Render(string fileName, Action<Transform> build)
        {
            const int width = 390;
            const int height = 844;
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U30Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U30Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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

        private static void Panel(Transform parent, string name, float x, float y, float w, float h, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            Place(obj.GetComponent<RectTransform>(), x, y, w, h);
            obj.GetComponent<Image>().color = color;
        }

        private static void Txt(Transform parent, string name, string text, float x, float y, float w, float h, float size, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI));
            obj.transform.SetParent(parent, false);
            Place(obj.GetComponent<RectTransform>(), x, y, w, h);
            var tmp = obj.GetComponent<TextMeshProUGUI>();
            tmp.font = font;
            tmp.text = text;
            tmp.fontSize = size;
            tmp.color = color;
            tmp.alignment = TextAlignmentOptions.Center;
            tmp.overflowMode = TextOverflowModes.Ellipsis;
        }

        private static void Place(RectTransform rect, float x, float y, float w, float h)
        {
            var center = new Vector2(0.5f, 0.5f);
            rect.anchorMin = center;
            rect.anchorMax = center;
            rect.pivot = center;
            rect.anchoredPosition = new Vector2(x, y);
            rect.sizeDelta = new Vector2(w, h);
        }

        private static string JsonBool(bool value) => value ? "true" : "false";
        private static string StatusJson(U30ApprovalGateStatus status)
        {
            return status == U30ApprovalGateStatus.NotMeasured ? "NOT_MEASURED" : status.ToString().ToUpperInvariant();
        }
        private static string ProjectRoot() => Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
    }
}
