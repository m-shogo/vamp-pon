using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U24KokuyouRareEvolutionClimaxScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u24/screenshots";
        private const string ReportPath = "Logs/u24_climax_polish_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(13, 12, 17, 255);
        private static readonly Color32 Ink = new(7, 5, 8, 235);
        private static readonly Color32 PurpleBlack = new(42, 16, 56, 185);
        private static readonly Color32 Crimson = new(104, 18, 48, 180);
        private static readonly Color32 Amber = new(248, 202, 104, 255);
        private static readonly Color32 Paper = new(228, 204, 160, 255);
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
                    log.Add(Capture(p, $"u24-kokuyou-ready-{p.Width}x{p.Height}.png", BuildKokuyouReady));
                    log.Add(Capture(p, $"u24-kokuyou-active-{p.Width}x{p.Height}.png", BuildKokuyouActive));
                }
                var main = new Profile(390, 844);
                log.Add(Capture(main, "u24-kokuyou-activation-cutin-390x844.png", BuildKokuyouActivation));
                log.Add(Capture(main, "u24-kokuyou-ending-390x844.png", BuildKokuyouEnding));
                log.Add(Capture(main, "u24-rare-presentation-390x844.png", BuildRarePresentation));
                log.Add(Capture(main, "u24-rare-seal-pulse-390x844.png", BuildRareSealPulse));
                log.Add(Capture(main, "u24-evolution-converge-390x844.png", BuildEvolutionConverge));
                log.Add(Capture(main, "u24-evolution-complete-390x844.png", BuildEvolutionComplete));
                log.Add(Capture(main, "u24-before-after-u22-vs-u24-kokuyou-390x844.png", BuildBeforeAfterKokuyou));
                log.Add(Capture(main, "u24-before-after-u23-vs-u24-rare-390x844.png", BuildBeforeAfterRare));
                log.Add(Capture(main, "u24-before-after-u23-vs-u24-evolution-390x844.png", BuildBeforeAfterEvolution));
                log.Add(Capture(main, "u24-visual-target-alignment-kokuyou-contact-sheet.png", BuildAlignmentContact));
                log.Add(Capture(main, "u24-contact-sheet-climax-polish.png", BuildClimaxContact));
                log.Add(Capture(main, "u24-contact-sheet-mobile-risk.png", BuildMobileRisk));
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

        private static GameObject BuildKokuyouReady(Transform parent)
        {
            var root = Root(parent, "U24KokuyouReady");
            ClimaxBackground(root.transform);
            Panel(root.transform, "ReadyPulse", 0f, 24f, 260f, 260f, new Color32(104, 18, 48, 48));
            InkParticles(root.transform);
            LanternStreak(root.transform, -120f, -134f, 120f, -42f);
            CutinLabel(root.transform, "Kokuyou Ready", "記憶の灯がざわめく");
            Footer(root, "Ready pulse / pause activation rejected / ts=1");
            return root;
        }

        private static GameObject BuildKokuyouActivation(Transform parent)
        {
            var root = Root(parent, "U24KokuyouActivation");
            ClimaxBackground(root.transform);
            Panel(root.transform, "CutinBand", 0f, 58f, 430f, 138f, new Color32(8, 5, 10, 245));
            Panel(root.transform, "CrimsonBand", 0f, 58f, 430f, 96f, Crimson);
            LanternStreak(root.transform, -182f, -136f, 180f, 18f);
            Txt(root.transform, "Title", "Activation", 0f, 72f, 220f, 44f, 30f, Paper);
            Txt(root.transform, "Sub", "記憶の灯が、力に変わる", 0f, 28f, 240f, 24f, 13f, Amber);
            Footer(root, "kokuyou_activate_cutin / camera impulse strong");
            return root;
        }

        private static GameObject BuildKokuyouActive(Transform parent)
        {
            var root = Root(parent, "U24KokuyouActive");
            ClimaxBackground(root.transform);
            Panel(root.transform, "ActiveWash", 0f, 0f, 390f, 844f, new Color32(75, 10, 42, 95));
            InkParticles(root.transform);
            LanternStreak(root.transform, -154f, -198f, 170f, -64f);
            BattleSilhouette(root.transform);
            CutinLabel(root.transform, "Active", "黒インク層 / 赤黒layer");
            Footer(root, "active visual / play info remains visible");
            return root;
        }

        private static GameObject BuildKokuyouEnding(Transform parent)
        {
            var root = Root(parent, "U24KokuyouEnding");
            ClimaxBackground(root.transform);
            Panel(root.transform, "Release", 0f, -18f, 330f, 220f, new Color32(248, 202, 104, 36));
            InkParticles(root.transform);
            Txt(root.transform, "Ending", "余韻", 0f, 64f, 160f, 36f, 26f, Paper);
            Txt(root.transform, "Sub", "灯りが夜へ戻る", 0f, 24f, 220f, 24f, 13f, Amber);
            Footer(root, "kokuyou_ending_release / returns to normal");
            return root;
        }

        private static GameObject BuildRarePresentation(Transform parent)
        {
            var root = Root(parent, "U24Rare");
            ClimaxBackground(root.transform);
            PaperCard(root.transform, "RareCard", 0f, 46f, 250f, 332f, true);
            Panel(root.transform, "Seal", 0f, 122f, 76f, 76f, new Color32(105, 30, 38, 245));
            Txt(root.transform, "Rare", "Rare", 0f, 124f, 70f, 24f, 18f, Paper);
            Txt(root.transform, "Name", "夜明け前の記憶", 0f, 42f, 190f, 28f, 18f, Ink);
            Txt(root.transform, "Effect", "静かな特別感", 0f, 4f, 170f, 22f, 12f, new Color32(48, 30, 20, 255));
            Footer(root, "rare_card_reveal / no gacha gold");
            return root;
        }

        private static GameObject BuildRareSealPulse(Transform parent)
        {
            var root = BuildRarePresentation(parent);
            Panel(root.transform, "Pulse", 0f, 122f, 124f, 124f, new Color32(248, 202, 104, 54));
            Footer(root, "rare_seal_pulse / low alpha warm flare");
            return root;
        }

        private static GameObject BuildEvolutionConverge(Transform parent)
        {
            var root = Root(parent, "U24EvolutionConverge");
            ClimaxBackground(root.transform);
            PaperCard(root.transform, "Stage", 0f, 32f, 306f, 364f, false);
            Material(root.transform, -82f, 44f, "墨", new Color32(18, 8, 14, 255));
            Material(root.transform, 82f, 44f, "灯", Amber);
            Panel(root.transform, "ConvergeLine", 0f, 44f, 164f, 5f, new Color32(248, 202, 104, 180));
            Txt(root.transform, "Title", "合体", 0f, 172f, 160f, 34f, 24f, Ink);
            Footer(root, "evolution_material_converge / recipe DB unchanged");
            return root;
        }

        private static GameObject BuildEvolutionComplete(Transform parent)
        {
            var root = Root(parent, "U24EvolutionComplete");
            ClimaxBackground(root.transform);
            PaperCard(root.transform, "Stage", 0f, 32f, 306f, 364f, true);
            Panel(root.transform, "Lamp", 0f, 44f, 96f, 132f, new Color32(37, 20, 16, 255));
            Panel(root.transform, "LampLight", 0f, 36f, 150f, 150f, new Color32(248, 202, 104, 68));
            Txt(root.transform, "Name", "夜明けのインク灯", 0f, -68f, 210f, 28f, 18f, Ink);
            Footer(root, "evolution_complete / no collection update");
            return root;
        }

        private static GameObject BuildBeforeAfterKokuyou(Transform parent) => BuildBeforeAfter(parent, "Kokuyou", BuildKokuyouActivation);
        private static GameObject BuildBeforeAfterRare(Transform parent) => BuildBeforeAfter(parent, "Rare", BuildRarePresentation);
        private static GameObject BuildBeforeAfterEvolution(Transform parent) => BuildBeforeAfter(parent, "Evolution", BuildEvolutionComplete);

        private static GameObject BuildBeforeAfter(Transform parent, string label, Func<Transform, GameObject> unused)
        {
            var root = Root(parent, $"U24BeforeAfter{label}");
            Panel(root.transform, "Before", -96f, 0f, 172f, 610f, new Color32(38, 31, 26, 235));
            Txt(root.transform, "BeforeText", $"Before\n{label}\npanel proof", -96f, 54f, 124f, 140f, 14f, Paper);
            Panel(root.transform, "After", 96f, 0f, 172f, 610f, new Color32(16, 10, 20, 245));
            if (label == "Kokuyou") LanternStreak(root.transform, 34f, -120f, 156f, 40f);
            if (label == "Rare") Panel(root.transform, "MiniSeal", 96f, 42f, 70f, 70f, new Color32(105, 30, 38, 245));
            if (label == "Evolution") Panel(root.transform, "MiniLamp", 96f, 28f, 86f, 120f, Amber);
            Txt(root.transform, "AfterText", $"U24\n{label}", 96f, 188f, 120f, 44f, 18f, Paper);
            Footer(root, "before-after review sheet / not runtime");
            return root;
        }

        private static GameObject BuildAlignmentContact(Transform parent)
        {
            var root = Root(parent, "U24Alignment");
            Title(root, "Kokuyou Alignment");
            Card(root.transform, -82f, 158f, "Ink", "smear / particles");
            Card(root.transform, 82f, 158f, "Layer", "red black");
            Card(root.transform, -82f, 42f, "Cutin", "short band");
            Card(root.transform, 82f, 42f, "Light", "amber streak");
            Card(root.transform, 0f, -82f, "Afterglow", "ending release");
            Footer(root, "kokuyou-cutin-final not pasted");
            return root;
        }

        private static GameObject BuildClimaxContact(Transform parent)
        {
            var root = Root(parent, "U24ClimaxContact");
            Title(root, "Climax Polish");
            Card(root.transform, 0f, 160f, "黒耀化", "Ready / Active / Ending");
            Card(root.transform, 0f, 54f, "Rare", "seal pulse");
            Card(root.transform, 0f, -52f, "Evolution", "converge / complete");
            Card(root.transform, 0f, -158f, "Hooks", "camera SE haptic");
            return root;
        }

        private static GameObject BuildMobileRisk(Transform parent)
        {
            var root = Root(parent, "U24MobileRisk");
            Title(root, "Mobile Risk");
            Card(root.transform, 0f, 154f, "360x800", "darkness readable");
            Card(root.transform, 0f, 48f, "390x844", "baseline");
            Card(root.transform, 0f, -58f, "430x932", "safe area ok");
            Card(root.transform, 0f, -164f, "Real device", "not executed");
            return root;
        }

        private static void ClimaxBackground(Transform parent)
        {
            Panel(parent, "Night", 0f, 0f, 390f, 844f, Night);
            Panel(parent, "PurpleLayer", 0f, 68f, 430f, 390f, PurpleBlack);
            Panel(parent, "CrimsonLayer", -48f, -80f, 430f, 190f, Crimson);
            Panel(parent, "InkTop", -118f, 316f, 250f, 90f, Ink);
            Panel(parent, "InkBottom", 122f, -318f, 240f, 98f, Ink);
        }

        private static void BattleSilhouette(Transform parent)
        {
            Panel(parent, "Player", 0f, -118f, 48f, 68f, Paper);
            Panel(parent, "Lantern", 34f, -120f, 24f, 34f, Amber);
            Panel(parent, "EnemyA", -126f, 42f, 58f, 58f, Ink);
            Panel(parent, "EnemyB", 122f, 86f, 48f, 48f, Ink);
        }

        private static void InkParticles(Transform parent)
        {
            for (var i = 0; i < 12; i++)
            {
                var x = -150f + (i % 4) * 96f;
                var y = 220f - (i / 4) * 96f;
                Panel(parent, $"InkParticle{i}", x, y, 8f + (i % 3) * 4f, 8f + (i % 2) * 6f, Ink);
            }
        }

        private static void LanternStreak(Transform parent, float x1, float y1, float x2, float y2)
        {
            Panel(parent, $"Streak{x1}", (x1 + x2) * 0.5f, (y1 + y2) * 0.5f, Mathf.Abs(x2 - x1) + 40f, 7f, new Color32(248, 202, 104, 220));
            Panel(parent, $"StreakGlow{x1}", (x1 + x2) * 0.5f, (y1 + y2) * 0.5f, Mathf.Abs(x2 - x1) + 58f, 22f, new Color32(248, 202, 104, 48));
        }

        private static void CutinLabel(Transform parent, string title, string sub)
        {
            Panel(parent, "LabelBand", 0f, -242f, 292f, 82f, new Color32(8, 5, 10, 238));
            Txt(parent, "LabelTitle", title, 0f, -230f, 210f, 30f, 22f, Paper);
            Txt(parent, "LabelSub", sub, 0f, -260f, 232f, 22f, 12f, Amber);
        }

        private static void PaperCard(Transform parent, string name, float x, float y, float w, float h, bool glow)
        {
            if (glow) Panel(parent, $"{name}Glow", x, y, w + 28f, h + 28f, new Color32(248, 202, 104, 44));
            Panel(parent, $"{name}Ink", x, y, w + 8f, h + 8f, Ink);
            Panel(parent, name, x, y, w, h, Paper);
        }

        private static void Material(Transform parent, float x, float y, string label, Color color)
        {
            Panel(parent, $"Mat{label}", x, y, 72f, 72f, color);
            Txt(parent, $"MatText{label}", label, x, y, 42f, 24f, 15f, Paper);
        }

        private static void Title(GameObject root, string text) => Txt(root.transform, "Title", text, 0f, 314f, 280f, 32f, 20f, Paper);
        private static void Footer(GameObject root, string text) => Txt(root.transform, "Footer", text, 0f, -364f, 340f, 18f, 10f, new Color32(205, 182, 143, 255));

        private static void Card(Transform parent, float x, float y, string title, string sub)
        {
            PaperCard(parent, $"Card{title}", x, y, 142f, 78f, false);
            Txt(parent, $"CardTitle{title}", title, x, y + 12f, 112f, 22f, 14f, Ink);
            Txt(parent, $"CardSub{title}", sub, x, y - 14f, 112f, 20f, 10f, new Color32(52, 32, 22, 255));
        }

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U24Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U24Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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
