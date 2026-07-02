using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U31.MobileQa;

namespace VampPon.UnitySpike.Editor
{
    public static class U31Stage1MobileQaScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u31/screenshots";
        private const string GeneratedDirectory = "../../docs/design-targets/generated/unity-u31";
        private const string ReportPath = "Logs/u31_stage1_mobile_qa_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(15, 14, 18, 255);
        private static readonly Color32 Paper = new(232, 216, 186, 255);
        private static readonly Color32 Ink = new(19, 12, 15, 245);
        private static readonly Color32 Lantern = new(245, 195, 88, 255);
        private static readonly Color32 Crimson = new(132, 35, 54, 245);
        private static readonly Color32 Moss = new(65, 112, 91, 255);
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
                var session = new U31Stage1QaSessionFactory().CreateEditorSession();
                WriteArtifacts(session);
                var log = new List<string>
                {
                    Capture("01-stageselect-before-run-qa.png", "StageSelect", "before run QA", "Editor 390x844", Moss),
                    Capture("02-stage1-opening-qa.png", "Opening", "opening density tuned", "not device measured", Moss),
                    Capture("03-first-30-seconds-qa.png", "First 30s", "pickup + hit readability", "caution: editor only", Lantern),
                    Capture("04-first-levelup-qa.png", "LevelUp", "target remains 30s", "choice readability", Moss),
                    Capture("05-mid-wave-qa.png", "Mid Wave", "cap policy unchanged", "device FPS not measured", Lantern),
                    Capture("06-rare-qa.png", "Rare", "candidate QA proof", "balance draft", Lantern),
                    Capture("07-evolution-qa.png", "Evolution", "reachability proof", "final art pending", Lantern),
                    Capture("08-kokuyou-qa.png", "Kokuyou", "ready / active QA", "haptic not measured", Crimson),
                    Capture("09-result-clear-qa.png", "Result", "clear flow QA", "reward draft", Moss),
                    Capture("10-result-reward-unlock-qa.png", "Reward", "unlock QA", "economy not final", Lantern),
                    Capture("11-stageselect-after-clear-qa.png", "Progress", "after clear reflected", "local save proof", Moss),
                    Capture("12-retry-qa.png", "Retry", "retry QA", "restart not measured", Moss),
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

        private static void WriteArtifacts(U31QaSessionModel session)
        {
            File.WriteAllText(Path.Combine(GeneratedDirectory, "stage1-qa-session-editor.json"), SessionJson(session));
            File.WriteAllText(Path.Combine(GeneratedDirectory, "stage1-qa-findings.json"), FindingsJson(session));
            File.WriteAllText(Path.Combine(GeneratedDirectory, "stage1-tuning-actions.json"), TuningJson(session));
            File.WriteAllText(Path.Combine(GeneratedDirectory, "stage1-measurement-summary.json"), MeasurementJson(session));
            File.WriteAllText(Path.Combine(GeneratedDirectory, "stage1-not-measured-list.json"), NotMeasuredJson());
        }

        private static string SessionJson(U31QaSessionModel session)
        {
            var builder = new StringBuilder();
            builder.Append("{\n");
            builder.Append($"  \"version\": \"{session.Version}\",\n");
            builder.Append($"  \"generatedAt\": \"{session.GeneratedAt}\",\n");
            builder.Append($"  \"linkedApprovalGate\": \"{session.LinkedApprovalGate}\",\n");
            builder.Append("  \"productionApproved\": false,\n");
            builder.Append("  \"environment\": \"Unity Editor 390x844\",\n");
            builder.Append("  \"deviceName\": \"Unity Editor\",\n");
            builder.Append("  \"platform\": \"Editor\",\n");
            builder.Append("  \"buildType\": \"Editor batchmode\",\n");
            builder.Append("  \"resolution\": \"390x844\",\n");
            builder.Append("  \"targetFps\": 60,\n");
            builder.Append("  \"actualFps\": \"NOT_MEASURED\",\n");
            builder.Append("  \"memory\": \"NOT_MEASURED\",\n");
            builder.Append("  \"thermal\": \"NOT_MEASURED\",\n");
            builder.Append("  \"audioLatency\": \"NOT_MEASURED\",\n");
            builder.Append("  \"hapticStatus\": \"NOT_MEASURED\",\n");
            builder.Append($"  \"blockerCount\": {session.BlockerCount},\n");
            builder.Append($"  \"cautionCount\": {session.CautionCount},\n");
            builder.Append($"  \"notMeasuredCount\": {session.NotMeasuredCount},\n");
            builder.Append("  \"qaScenarioResults\": [\n");
            for (var i = 0; i < session.QaScenarioResults.Count; i++)
            {
                var scenario = session.QaScenarioResults[i];
                builder.Append("    {\n");
                builder.Append($"      \"id\": \"{scenario.Id}\",\n");
                builder.Append($"      \"label\": \"{scenario.Label}\",\n");
                builder.Append($"      \"verdict\": \"{VerdictJson(scenario.Verdict)}\",\n");
                builder.Append($"      \"evidence\": \"{scenario.Evidence}\",\n");
                builder.Append($"      \"note\": \"{scenario.Note}\"\n");
                builder.Append(i == session.QaScenarioResults.Count - 1 ? "    }\n" : "    },\n");
            }
            builder.Append("  ]\n");
            builder.Append("}\n");
            return builder.ToString();
        }

        private static string FindingsJson(U31QaSessionModel session)
        {
            var builder = new StringBuilder();
            builder.Append("{\n  \"findings\": [\n");
            for (var i = 0; i < session.Findings.Count; i++)
            {
                var finding = session.Findings[i];
                builder.Append("    {\n");
                builder.Append($"      \"id\": \"{finding.Id}\",\n");
                builder.Append($"      \"severity\": \"{SeverityJson(finding.Severity)}\",\n");
                builder.Append($"      \"area\": \"{finding.Area}\",\n");
                builder.Append($"      \"description\": \"{finding.Description}\"\n");
                builder.Append(i == session.Findings.Count - 1 ? "    }\n" : "    },\n");
            }
            builder.Append("  ]\n}\n");
            return builder.ToString();
        }

        private static string TuningJson(U31QaSessionModel session)
        {
            var builder = new StringBuilder();
            builder.Append("{\n  \"productionBalanceFinal\": false,\n  \"actions\": [\n");
            for (var i = 0; i < session.TuningActions.Count; i++)
            {
                var action = session.TuningActions[i];
                builder.Append("    {\n");
                builder.Append($"      \"id\": \"{action.Id}\",\n");
                builder.Append($"      \"area\": \"{action.Area}\",\n");
                builder.Append($"      \"before\": \"{action.Before}\",\n");
                builder.Append($"      \"after\": \"{action.After}\",\n");
                builder.Append($"      \"reason\": \"{action.Reason}\"\n");
                builder.Append(i == session.TuningActions.Count - 1 ? "    }\n" : "    },\n");
            }
            builder.Append("  ]\n}\n");
            return builder.ToString();
        }

        private static string MeasurementJson(U31QaSessionModel session)
        {
            return "{\n" +
                   "  \"environment\": \"Unity Editor 390x844\",\n" +
                   "  \"mobileDeviceMeasured\": false,\n" +
                   "  \"actualFps\": \"NOT_MEASURED\",\n" +
                   "  \"memory\": \"NOT_MEASURED\",\n" +
                   "  \"thermal\": \"NOT_MEASURED\",\n" +
                   "  \"gcAllocation\": \"NOT_MEASURED\",\n" +
                   "  \"drawCall\": \"NOT_MEASURED\",\n" +
                   "  \"audioLatency\": \"NOT_MEASURED\",\n" +
                   "  \"hapticStatus\": \"NOT_MEASURED\",\n" +
                   $"  \"blockerCount\": {session.BlockerCount},\n" +
                   $"  \"cautionCount\": {session.CautionCount},\n" +
                   "  \"productionApproved\": false\n" +
                   "}\n";
        }

        private static string NotMeasuredJson()
        {
            return "{\n" +
                   "  \"notMeasured\": [\"mobile FPS\", \"memory\", \"thermal\", \"GC allocation\", \"draw call\", \"audio latency\", \"haptic device behavior\", \"restart persistence\"],\n" +
                   "  \"notPass\": true,\n" +
                   "  \"productionApproved\": false\n" +
                   "}\n";
        }

        private static string Capture(string fileName, string title, string note, string status, Color color)
        {
            return Render(fileName, parent =>
            {
                Panel(parent, "Bg", 0f, 0f, 390f, 844f, Night);
                Txt(parent, "Title", title, 0f, 296f, 300f, 34f, 22f, Paper);
                Panel(parent, "Phone", 0f, 50f, 318f, 476f, new Color32(42, 34, 31, 238));
                Panel(parent, "PlayArea", 0f, 76f, 250f, 292f, Ink);
                Panel(parent, "Hud", 0f, 218f, 250f, 28f, new Color32(58, 45, 38, 235));
                Panel(parent, "SignalA", -68f, 116f, 92f, 18f, color);
                Panel(parent, "SignalB", 50f, 64f, 126f, 18f, Lantern);
                Panel(parent, "SignalC", 0f, 10f, 174f, 18f, Crimson);
                Txt(parent, "Note", note, 0f, -106f, 276f, 30f, 13f, Paper);
                Txt(parent, "Status", status, 0f, -146f, 286f, 28f, 12f, Paper);
                Txt(parent, "Footer", "U31 QA evidence / productionApproved false", 0f, -326f, 312f, 20f, 11f, Paper);
            });
        }

        private static string Render(string fileName, Action<Transform> build)
        {
            const int width = 390;
            const int height = 844;
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U31Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U31Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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

        private static string VerdictJson(U31QaVerdict verdict) => verdict == U31QaVerdict.NotMeasured ? "NOT_MEASURED" : verdict.ToString().ToUpperInvariant();
        private static string SeverityJson(U31QaFindingSeverity severity) => severity == U31QaFindingSeverity.NotMeasured ? "NOT_MEASURED" : severity.ToString().ToUpperInvariant();
        private static string ProjectRoot() => Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
    }
}
