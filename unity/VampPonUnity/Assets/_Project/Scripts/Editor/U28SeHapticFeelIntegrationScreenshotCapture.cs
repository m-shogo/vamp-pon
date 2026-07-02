using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.Editor
{
    public static class U28SeHapticFeelIntegrationScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u28/screenshots";
        private const string GeneratedDirectory = "../../docs/design-targets/generated/unity-u28";
        private const string ReportPath = "Logs/u28_se_haptic_feel_integration_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(14, 14, 18, 255);
        private static readonly Color32 Paper = new(231, 211, 176, 255);
        private static readonly Color32 Ink = new(17, 11, 13, 245);
        private static readonly Color32 Lantern = new(246, 198, 92, 255);
        private static readonly Color32 Crimson = new(125, 29, 46, 245);
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
                WriteMaps();
                var log = new List<string>
                {
                    Capture("stage1-pickup-audio-haptic-proof.png", "Pickup Feel", "pickup_xp / pickup_heal", "small sound, very light haptic"),
                    Capture("stage1-levelup-audio-haptic-proof.png", "LevelUp Feel", "levelup_open / card_select", "paper + ink tap"),
                    Capture("stage1-rare-seal-audio-haptic-proof.png", "Rare Seal Feel", "rare_seal_pulse", "special but not loud"),
                    Capture("stage1-evolution-audio-haptic-proof.png", "Evolution Feel", "evolution_complete", "medium completion haptic"),
                    Capture("stage1-kokuyou-audio-haptic-proof.png", "Kokuyou Feel", "kokuyou_activation", "dark strong draft"),
                    Capture("stage1-result-stamp-audio-haptic-proof.png", "Result Stamp", "result_stamp / reward_card", "paper stamp"),
                    Capture("stageselect-lantern-audio-haptic-proof.png", "Stage Lantern", "stage_select_lantern", "small warm cue"),
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

        private static void WriteMaps()
        {
            var audio = new U28AudioEventRegistry();
            var haptic = new U28HapticRegistry();
            var audioJson = new StringBuilder();
            audioJson.AppendLine("{");
            audioJson.AppendLine("  \"productionStatus\": \"draft-placeholder-not-final\",");
            audioJson.AppendLine("  \"events\": [");
            var index = 0;
            foreach (var definition in audio.All)
            {
                if (index++ > 0) audioJson.AppendLine(",");
                audioJson.Append($"    {{ \"id\": \"{definition.Id}\", \"category\": \"{definition.Category}\", \"priority\": \"{definition.Priority}\", \"volumeDraft\": {definition.VolumeDraft:0.00}, \"cooldownSeconds\": {definition.CooldownSeconds:0.00}, \"polyphonyLimit\": {definition.PolyphonyLimit}, \"hapticPairing\": \"{definition.HapticPairing}\", \"clipFileName\": \"{definition.ClipFileName}\", \"futureProductionNote\": \"{definition.FutureProductionNote}\" }}");
            }
            audioJson.AppendLine();
            audioJson.AppendLine("  ]");
            audioJson.AppendLine("}");
            File.WriteAllText(Path.Combine(GeneratedDirectory, "audio-event-map.json"), audioJson.ToString());

            var hapticJson = new StringBuilder();
            hapticJson.AppendLine("{");
            hapticJson.AppendLine("  \"deviceVerification\": \"not executed; Editor safe no-op\",");
            hapticJson.AppendLine("  \"events\": [");
            index = 0;
            foreach (var definition in haptic.All)
            {
                if (index++ > 0) hapticJson.AppendLine(",");
                hapticJson.Append($"    {{ \"id\": \"{definition.Id}\", \"intensityDraft\": {definition.IntensityDraft:0.00}, \"durationSecondsDraft\": {definition.DurationSecondsDraft:0.000}, \"cooldownSeconds\": {definition.CooldownSeconds:0.00}, \"platformSupportNote\": \"{definition.PlatformSupportNote}\", \"futureNote\": \"{definition.FutureNote}\" }}");
            }
            hapticJson.AppendLine();
            hapticJson.AppendLine("  ]");
            hapticJson.AppendLine("}");
            File.WriteAllText(Path.Combine(GeneratedDirectory, "haptic-event-map.json"), hapticJson.ToString());
        }

        private static string Capture(string fileName, string title, string eventLine, string note)
        {
            return Render(fileName, parent =>
            {
                Bg(parent);
                Txt(parent, "Title", title, 0f, 286f, 300f, 32f, 21f, Paper);
                Panel(parent, "Phone", 0f, 32f, 312f, 460f, new Color32(42, 33, 30, 235));
                Panel(parent, "WaveA", -52f, 74f, 170f, 12f, Lantern);
                Panel(parent, "WaveB", 48f, 38f, 190f, 8f, Crimson);
                Panel(parent, "Pulse", 0f, -12f, 74f, 74f, new Color32(246, 198, 92, 120));
                Txt(parent, "Event", eventLine, 0f, -110f, 260f, 24f, 13f, Paper);
                Txt(parent, "Note", note, 0f, -148f, 260f, 22f, 11f, Paper);
                Txt(parent, "Status", "draft SE + Editor no-op haptic", 0f, -326f, 300f, 20f, 11f, Paper);
            });
        }

        private static string Render(string fileName, Action<Transform> build)
        {
            const int width = 390;
            const int height = 844;
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U28Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U28Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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

        private static void Bg(Transform parent) => Panel(parent, "Bg", 0f, 0f, 390f, 844f, Night);
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
        private static string ProjectRoot() => Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
    }
}
