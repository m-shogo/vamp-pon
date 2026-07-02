using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U26.FirstPlayableBalance;

namespace VampPon.UnitySpike.Editor
{
    public static class U26Stage1FirstPlayableBalanceScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u26/screenshots";
        private const string ReportPath = "Logs/u26_stage1_first_playable_balance_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(15, 16, 19, 255);
        private static readonly Color32 Paper = new(230, 207, 166, 255);
        private static readonly Color32 Ink = new(18, 12, 12, 245);
        private static readonly Color32 Moss = new(70, 95, 74, 245);
        private static readonly Color32 Crimson = new(128, 27, 46, 238);
        private static TMP_FontAsset font;

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);
                font = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(FontPath);
                if (font == null) throw new InvalidOperationException($"SDF font not found: {FontPath}");
                var log = new List<string>
                {
                    Capture("stage1-0000-opening-balance.png", 0, "Opening", "low pressure / movement"),
                    Capture("stage1-0030-first-levelup-balance.png", 30, "First LevelUp", "choice x3"),
                    Capture("stage1-0200-multi-choice-balance.png", 120, "Multi Choice", "weapon + passive"),
                    Capture("stage1-0400-wave-intensity-balance.png", 240, "Wave Intensity", "enemy cap rises"),
                    Capture("stage1-0600-kokuyou-ready-balance.png", 360, "Kokuyou Ready", "gauge full"),
                    Capture("stage1-0730-clear-push-balance.png", 450, "Clear Push", "last pressure"),
                    CaptureResult("stage1-result-balance.png"),
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

        private static string Capture(string fileName, int elapsedSecond, string title, string note)
        {
            var simulator = new U26Stage1BalanceSimulator();
            var snapshot = simulator.Simulate(elapsedSecond);
            return Render(fileName, parent =>
            {
                Bg(parent);
                Hud(parent, snapshot.ElapsedSecond, snapshot.Level, snapshot.Xp);
                Txt(parent, "Title", title, 0f, 286f, 300f, 34f, 22f, Paper);
                Txt(parent, "Bucket", snapshot.WaveBucket, 0f, 254f, 260f, 22f, 13f, Paper);
                Player(parent, 0f, -120f);
                for (var i = 0; i < Math.Min(8, snapshot.KoCount / 8 + 2); i++)
                {
                    var x = -136f + (i % 4) * 88f;
                    var y = 98f - (i / 4) * 70f;
                    Enemy(parent, x, y, snapshot.KokuyouReady);
                }

                Gauge(parent, "XP", -88f, -284f, Mathf.Clamp01(snapshot.Xp / 130f), Moss);
                Gauge(parent, "KO", 88f, -284f, Mathf.Clamp01(snapshot.KoCount / 160f), Crimson);
                if (snapshot.KokuyouReady) Panel(parent, "KokuyouBadge", 0f, -224f, 170f, 32f, Crimson);
                Txt(parent, "Note", note, 0f, -346f, 300f, 20f, 11f, Paper);
            });
        }

        private static string CaptureResult(string fileName)
        {
            return Render(fileName, parent =>
            {
                Bg(parent);
                Panel(parent, "Ledger", 0f, 28f, 310f, 390f, Paper);
                Txt(parent, "Title", "Result Balance", 0f, 160f, 240f, 30f, 20f, Ink);
                Txt(parent, "Stats", "08:00 clear / Lv 8 / KO 153", 0f, 86f, 260f, 24f, 13f, Ink);
                Txt(parent, "Reward", "draft reward / progress proof", 0f, 36f, 260f, 24f, 13f, Ink);
                Txt(parent, "Approval", "productionApproved=0", 0f, -68f, 240f, 22f, 12f, Ink);
            });
        }

        private static string Render(string fileName, Action<Transform> build)
        {
            const int width = 390;
            const int height = 844;
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U26Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U26Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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
        private static void Hud(Transform parent, int second, int level, int xp)
        {
            Panel(parent, "Hud", 0f, 354f, 350f, 54f, new Color32(40, 34, 29, 232));
            Txt(parent, "Time", $"{second / 60:00}:{second % 60:00}", -112f, 356f, 72f, 20f, 13f, Paper);
            Txt(parent, "Level", $"Lv {level}", 0f, 356f, 72f, 20f, 13f, Paper);
            Txt(parent, "Xp", $"XP {xp}", 112f, 356f, 72f, 20f, 13f, Paper);
        }
        private static void Player(Transform parent, float x, float y) { Panel(parent, "Player", x, y, 48f, 66f, Paper); Panel(parent, "Weapon", x + 36f, y + 4f, 24f, 28f, Moss); }
        private static void Enemy(Transform parent, float x, float y, bool hot) => Panel(parent, $"Enemy{x}{y}", x, y, 46f, 46f, hot ? Crimson : Ink);
        private static void Gauge(Transform parent, string name, float x, float y, float fill, Color color) { Panel(parent, name, x, y, 120f, 12f, Ink); Panel(parent, $"{name}Fill", x - 60f + 60f * fill, y, 120f * fill, 12f, color); }
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
