using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U22BattleVisualPolishScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u22/screenshots";
        private const string ReportPath = "Logs/u22_battle_visual_polish_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(18, 17, 18, 255);
        private static readonly Color32 Ink = new(18, 10, 15, 236);
        private static readonly Color32 Paper = new(238, 222, 190, 255);
        private static readonly Color32 Amber = new(248, 202, 104, 255);
        private static readonly Color32 Teal = new(93, 202, 185, 255);
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
                    log.Add(Capture(p, $"u22-stage1-playing-visual-{p.Width}x{p.Height}.png", BuildStage1Playing));
                    log.Add(Capture(p, $"u22-battle-hud-polish-{p.Width}x{p.Height}.png", BuildHudPolish));
                }

                var main = new Profile(390, 844);
                log.Add(Capture(main, "u22-player-enemy-attack-visual-390x844.png", BuildPlayerEnemyAttack));
                log.Add(Capture(main, "u22-pickup-readability-390x844.png", BuildPickupReadability));
                log.Add(Capture(main, "u22-hit-feedback-390x844.png", BuildHitFeedback));
                log.Add(Capture(main, "u22-ink-burst-lantern-pulse-390x844.png", BuildInkLantern));
                log.Add(Capture(main, "u22-kokuyou-ready-hud-390x844.png", BuildKokuyouReady));
                log.Add(Capture(main, "u22-kokuyou-active-battle-390x844.png", BuildKokuyouActive));
                log.Add(Capture(main, "u22-before-after-u21-vs-u22-390x844.png", BuildBeforeAfter));
                log.Add(Capture(main, "u22-contact-sheet-battle-polish.png", BuildBattleContact));
                log.Add(Capture(main, "u22-contact-sheet-mobile-risk.png", BuildMobileRisk));
                log.Add(Capture(new Profile(375, 812), "u22-stage1-playing-visual-375x812.png", BuildStage1Playing));
                log.Add(Capture(new Profile(393, 852), "u22-stage1-playing-visual-393x852.png", BuildStage1Playing));
                log.Add(Capture(new Profile(412, 915), "u22-stage1-playing-visual-412x915.png", BuildStage1Playing));
                log.Add(Capture(main, "u22-particle-budget-debug-390x844.png", BuildParticleBudget));
                log.Add(Capture(main, "u22-proof-label-reduction-390x844.png", BuildProofLabelReduction));

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

        private static GameObject BuildStage1Playing(Transform parent)
        {
            var root = Root(parent, "U22Stage1Playing");
            BattleField(root.transform);
            Hud(root.transform);
            Player(root.transform, 0f, -116f);
            Enemy(root.transform, -128f, 96f, 58f);
            Enemy(root.transform, 118f, 142f, 48f);
            Enemy(root.transform, 136f, -24f, 44f);
            Enemy(root.transform, -108f, -12f, 42f);
            Projectile(root.transform, -50f, -70f, 82f, -12f);
            Projectile(root.transform, 50f, -52f, 114f, 20f);
            PickupCluster(root.transform);
            InkBurst(root.transform, 92f, 64f);
            LanternPulse(root.transform, 0f, -116f, 168f);
            Gauge(root.transform, 154f, 92f, true, false);
            Footer(root, "U22 Battle Visual Proof / p=30 obj=112 ts=1.0");
            return root;
        }

        private static GameObject BuildHudPolish(Transform parent)
        {
            var root = Root(parent, "U22HudPolish");
            BattleField(root.transform);
            Hud(root.transform);
            Gauge(root.transform, 154f, 92f, true, false);
            Txt(root.transform, "Debug", "small proof status only", 0f, -354f, 260f, 20f, 10f, new Color32(205, 182, 143, 255));
            return root;
        }

        private static GameObject BuildPlayerEnemyAttack(Transform parent) => BuildStage1Playing(parent);
        private static GameObject BuildPickupReadability(Transform parent) => BuildStage1Playing(parent);
        private static GameObject BuildHitFeedback(Transform parent) => BuildStage1Playing(parent);
        private static GameObject BuildInkLantern(Transform parent) => BuildStage1Playing(parent);

        private static GameObject BuildKokuyouReady(Transform parent)
        {
            var root = BuildStage1Playing(parent);
            Txt(root.transform, "Ready", "Ready", 128f, 240f, 86f, 24f, 16f, Amber);
            Panel(root.transform, "ReadyPulse", 0f, -116f, 196f, 196f, new Color32(96, 14, 49, 42));
            return root;
        }

        private static GameObject BuildKokuyouActive(Transform parent)
        {
            var root = BuildStage1Playing(parent);
            Panel(root.transform, "ActiveWash", 0f, 0f, 390f, 844f, new Color32(64, 8, 38, 82));
            Gauge(root.transform, 154f, 92f, true, true);
            Txt(root.transform, "Active", "Active", 0f, 220f, 140f, 30f, 20f, Amber);
            return root;
        }

        private static GameObject BuildBeforeAfter(Transform parent)
        {
            var root = Root(parent, "U22BeforeAfter");
            Panel(root.transform, "Left", -96f, 0f, 174f, 650f, new Color32(38, 31, 26, 235));
            Txt(root.transform, "Before", "U21\ncards\nmove\nhit\ndrop\ngauge", -96f, 58f, 128f, 230f, 14f, Paper);
            Panel(root.transform, "Right", 96f, 0f, 174f, 650f, new Color32(20, 18, 19, 245));
            Player(root.transform, 96f, -90f);
            Enemy(root.transform, 42f, 70f, 38f);
            Enemy(root.transform, 144f, 92f, 34f);
            Projectile(root.transform, 70f, -52f, 130f, 30f);
            Txt(root.transform, "After", "U22", 96f, 234f, 80f, 28f, 18f, Amber);
            Footer(root, "before-after review sheet / not runtime");
            return root;
        }

        private static GameObject BuildBattleContact(Transform parent)
        {
            var root = Root(parent, "U22BattleContact");
            Title(root, "Battle Polish");
            Card(root.transform, -82f, 166f, "HUD", "Time HP Lv EXP");
            Card(root.transform, 82f, 166f, "Field", "player enemy attack");
            Card(root.transform, -82f, 42f, "Pickup", "EXP Heart Memory");
            Card(root.transform, 82f, 42f, "Feedback", "hit ink pulse");
            Card(root.transform, 0f, -96f, "黒耀化", "Ready / Active proof");
            Footer(root, "productionApproved=0");
            return root;
        }

        private static GameObject BuildMobileRisk(Transform parent)
        {
            var root = Root(parent, "U22MobileRisk");
            Title(root, "Mobile Risk");
            Card(root.transform, 0f, 168f, "360x800", "top HUD readable");
            Card(root.transform, 0f, 72f, "390x844", "primary target");
            Card(root.transform, 0f, -24f, "430x932", "safe area maintained");
            Card(root.transform, 0f, -120f, "Real Device", "not executed");
            Footer(root, "iOS / Android Build Support missing");
            return root;
        }

        private static GameObject BuildParticleBudget(Transform parent)
        {
            var root = BuildStage1Playing(parent);
            Txt(root.transform, "Budget", "particle 30/32 / objects 112/220", 0f, -330f, 290f, 20f, 11f, Amber);
            return root;
        }

        private static GameObject BuildProofLabelReduction(Transform parent)
        {
            var root = BuildStage1Playing(parent);
            Txt(root.transform, "Policy", "large explanation list removed", 0f, -330f, 290f, 20f, 11f, Amber);
            return root;
        }

        private static void BattleField(Transform parent)
        {
            Panel(parent, "PaperNight", 0f, 0f, 390f, 844f, Night);
            Panel(parent, "Lane", 0f, -18f, 328f, 568f, new Color32(25, 22, 21, 225));
            Panel(parent, "MapLineA", -72f, 10f, 180f, 4f, new Color32(76, 58, 42, 120));
            Panel(parent, "MapLineB", 82f, -72f, 160f, 4f, new Color32(76, 58, 42, 110));
        }

        private static void Hud(Transform parent)
        {
            Panel(parent, "HudBand", 0f, 354f, 354f, 58f, new Color32(44, 34, 28, 226));
            Txt(parent, "Time", "08:00", -128f, 362f, 66f, 22f, 14f, Paper);
            Bar(parent, "HP", -40f, 366f, 96f, 8f, new Color32(164, 45, 64, 255), 0.72f);
            Txt(parent, "Lv", "Lv 5", 40f, 362f, 52f, 22f, 13f, Paper);
            Bar(parent, "EXP", 112f, 366f, 96f, 7f, Teal, 0.64f);
            Txt(parent, "Items", "欠片12  記憶3", 0f, 336f, 160f, 18f, 11f, Amber);
        }

        private static void Gauge(Transform parent, float x, float y, bool ready, bool active)
        {
            Panel(parent, "KokuyouGaugeBack", x, y, 28f, 188f, new Color32(16, 10, 18, 236));
            Panel(parent, "KokuyouGaugeFill", x, y - (active ? 0f : 8f), 16f, active ? 174f : 156f, new Color32(110, 15, 58, 238));
            Txt(parent, "KokuyouGaugeLabel", active ? "Active" : ready ? "Ready" : "黒耀", x, y + 112f, 58f, 20f, 11f, Amber);
        }

        private static void Player(Transform parent, float x, float y)
        {
            Panel(parent, "PlayerGlow", x, y, 98f, 98f, new Color32(240, 174, 78, 54));
            Panel(parent, "PlayerBody", x, y + 4f, 42f, 58f, new Color32(216, 196, 176, 255));
            Panel(parent, "Lantern", x + 28f, y - 4f, 20f, 28f, Amber);
        }

        private static void Enemy(Transform parent, float x, float y, float size)
        {
            Panel(parent, $"Enemy{x}{y}", x, y, size, size, Ink);
            Panel(parent, $"EnemyEye{x}{y}", x + size * 0.16f, y + size * 0.08f, size * 0.18f, size * 0.08f, Amber);
        }

        private static void Projectile(Transform parent, float x1, float y1, float x2, float y2)
        {
            Panel(parent, $"Projectile{x1}", (x1 + x2) * 0.5f, (y1 + y2) * 0.5f, Mathf.Abs(x2 - x1), 5f, new Color32(230, 190, 112, 230));
            Panel(parent, $"Hit{x2}", x2, y2, 26f, 26f, new Color32(250, 228, 156, 150));
        }

        private static void PickupCluster(Transform parent)
        {
            Panel(parent, "Exp1", -54f, 44f, 10f, 10f, Teal);
            Panel(parent, "Exp2", -28f, 72f, 9f, 9f, Teal);
            Panel(parent, "Exp3", 16f, 48f, 10f, 10f, Teal);
            Panel(parent, "Exp4", 38f, 84f, 8f, 8f, Teal);
            Panel(parent, "ExpTrail", -18f, 36f, 96f, 4f, new Color32(93, 202, 185, 118));
            Panel(parent, "Heart", -126f, -126f, 20f, 20f, new Color32(210, 72, 86, 255));
            Panel(parent, "Memory", 104f, -152f, 18f, 26f, new Color32(164, 128, 238, 255));
        }

        private static void InkBurst(Transform parent, float x, float y) => Panel(parent, "InkBurst", x, y, 72f, 44f, new Color32(8, 6, 8, 210));
        private static void LanternPulse(Transform parent, float x, float y, float size) => Panel(parent, "LanternPulse", x, y, size, size, new Color32(248, 202, 104, 28));
        private static void Title(GameObject root, string text) => Txt(root.transform, "Title", text, 0f, 322f, 300f, 30f, 20f, Paper);
        private static void Footer(GameObject root, string text) => Txt(root.transform, "Footer", text, 0f, -364f, 340f, 18f, 10f, new Color32(205, 182, 143, 255));

        private static void Card(Transform parent, float x, float y, string title, string sub)
        {
            Panel(parent, $"Card{title}", x, y, 142f, 82f, new Color32(44, 34, 28, 230));
            Txt(parent, $"CardTitle{title}", title, x, y + 14f, 118f, 22f, 14f, Amber);
            Txt(parent, $"CardSub{title}", sub, x, y - 14f, 118f, 20f, 10f, Paper);
        }

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U22Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U22Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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

        private static void Bar(Transform parent, string name, float x, float y, float w, float h, Color fill, float value)
        {
            Panel(parent, $"{name}Back", x, y, w, h, new Color32(12, 10, 10, 235));
            Panel(parent, $"{name}Fill", x - (w * (1f - value) * 0.5f), y, w * value, h, fill);
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
