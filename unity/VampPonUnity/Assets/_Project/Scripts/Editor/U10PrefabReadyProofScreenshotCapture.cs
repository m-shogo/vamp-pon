using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U10PrefabReadyProofScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u10/screenshots";
        private const string ReportPath = "Logs/u10_prefab_ready_visual_proof_screenshot_report.txt";
        private const string SDFFontAssetPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(24, 22, 21, 255);
        private static readonly Color32 DeepInk = new(18, 15, 17, 235);
        private static readonly Color32 InkText = new(44, 31, 26, 255);
        private static readonly Color32 PaleText = new(238, 222, 190, 255);
        private static readonly Color32 WarmPale = new(248, 232, 200, 255);

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

        private static TMP_FontAsset sdfFont;

        public static void Run()
        {
            try
            {
                U8VisualCandidateImportSetup.Run();
                U8RefinedVisualCandidateImportSetup.Run();
                U10VisualCandidateImportSetup.Run();
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);

                sdfFont = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(SDFFontAssetPath);
                if (sdfFont == null)
                {
                    throw new InvalidOperationException($"SDF font not found: {SDFFontAssetPath}");
                }

                var log = new List<string> { $"SDF font loaded: {sdfFont.name}, glyphs={sdfFont.glyphTable.Count}" };
                foreach (var p in MobileProfiles)
                {
                    log.Add(Capture(p, $"u10-result-prefab-ready-proof-{p.Width}x{p.Height}.png", BuildResultProof));
                    log.Add(Capture(p, $"u10-stageselect-prefab-ready-proof-{p.Width}x{p.Height}.png", BuildStageSelectProof));
                }

                log.Add(Capture(new Profile(390, 844), "u10-kokuyou-rare-cutin-comparison-390x844.png", BuildKokuyouRareCutinComparison));

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

        private static string Capture(Profile profile, string fileName, Action<RectTransform, AssetCache> build)
        {
            var created = new List<UnityEngine.Object>();
            var cache = new AssetCache(created);
            var camObj = new GameObject("U10Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U10Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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

            AddSolid(canvasRect, "Bg", Stretch(), Night);
            AddInkWash(canvasRect, profile);
            build(canvasRect, cache);

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

        private static void BuildResultProof(RectTransform root, AssetCache c)
        {
            Txt(root, "Title", "今夜の記録", 0f, 362f, 270f, 40f, 24f, PaleText);
            Img(root, "Ledger", c.S("U8Candidates/UI/result_paper_ledger_panel"), 0f, 54f, 320f, 530f, new Color(1f, 0.95f, 0.84f, 0.96f));
            Img(root, "Seal", c.S("U8Candidates/UI/result_rank_wax_seal"), 104f, 218f, 90f, 90f, Color.white);
            Txt(root, "Rank", "RANK", 104f, 218f, 60f, 22f, 13f, new Color32(245, 205, 154, 255));
            Txt(root, "Sub", "拾った記憶", 0f, 172f, 250f, 30f, 16f, InkText);

            for (int i = 0; i < 3; i++)
            {
                float x = -90f + i * 90f;
                Img(root, $"Card{i}", c.S("U8Candidates/UI/result_reward_memory_card"), x, 48f, 80f, 110f, new Color(1f, 0.96f, 0.85f, 0.96f));
                var label = i == 0 ? "記憶" : i == 1 ? "墨" : "灯";
                Txt(root, $"CLabel{i}", label, x, 4f, 64f, 22f, 13f, InkText);
            }

            Img(root, "Badge", c.S("U8Refined/UI/result_new_badge_refined"), -110f, 124f, 54f, 54f, Color.white);
            Img(root, "StatsStrip", c.S("U10Candidates/UI/result_stats_ink_strip"), 0f, -172f, 306f, 48f, new Color(1f, 1f, 1f, 0.94f));
            Txt(root, "Stats", "拾った欠片  12    朝の加護  +3", 0f, -172f, 290f, 30f, 13f, WarmPale);

            Img(root, "ContinueButton", c.S("U10Candidates/UI/result_continue_paper_button"), 0f, -230f, 210f, 66f, Color.white);
            Txt(root, "BtnTxt", "次へ", 0f, -230f, 160f, 30f, 18f, new Color32(38, 25, 18, 255));
        }

        private static void BuildStageSelectProof(RectTransform root, AssetCache c)
        {
            Txt(root, "Title", "今夜の行き先", 0f, 362f, 300f, 40f, 22f, PaleText);
            Img(root, "Map", c.S("U8Candidates/UI/stageselect_paper_map_base"), 0f, 62f, 322f, 548f, new Color(1f, 0.95f, 0.82f, 0.96f));

            Img(root, "LineA", c.S("U8Candidates/UI/stageselect_route_line_ink"), -46f, 118f, 162f, 32f, new Color(0.16f, 0.10f, 0.06f, 0.95f), -16f);
            Img(root, "LineB", c.S("U8Candidates/UI/stageselect_route_line_ink"), 56f, 36f, 160f, 30f, new Color(0.16f, 0.10f, 0.06f, 0.95f), 18f);
            Img(root, "LineC", c.S("U8Candidates/UI/stageselect_route_line_ink"), -30f, -44f, 154f, 28f, new Color(0.16f, 0.10f, 0.06f, 0.95f), -10f);

            var pos = new[] { new Vector2(-112f, 158f), new Vector2(-28f, 96f), new Vector2(72f, 22f), new Vector2(-44f, -92f), new Vector2(104f, -150f) };
            for (int i = 0; i < pos.Length; i++)
            {
                var sprite = i < 3 ? c.S("U10Candidates/UI/stageselect_route_active_node") : c.S("U10Candidates/UI/stageselect_route_locked_node");
                var size = i < 3 ? 62f : 58f;
                Img(root, $"Node{i}", sprite, pos[i].x, pos[i].y, size, size, Color.white);
            }

            Img(root, "Lantern", c.S("U8Candidates/UI/stageselect_start_marker_lantern"), -112f, 158f, 84f, 102f, new Color(1f, 0.97f, 0.88f, 1f));

            AddSolid(root, "Panel", new RectSpec(0.5f, 0.5f, 0f, -286f, 318f, 104f), new Color32(38, 31, 26, 225));
            Txt(root, "Stage", "夜の路地", -56f, -264f, 180f, 30f, 19f, PaleText, TextAlignmentOptions.Left);
            Txt(root, "Diff", "静かな道  /  灯が見える", -56f, -294f, 200f, 22f, 12f, new Color32(205, 182, 143, 255), TextAlignmentOptions.Left);
            Txt(root, "Route", "Route A: active / locked node proof", -56f, -314f, 210f, 18f, 9f, new Color32(160, 140, 110, 180), TextAlignmentOptions.Left);

            Img(root, "GoBtn", c.S("U10Candidates/UI/result_continue_paper_button"), 108f, -286f, 112f, 50f, Color.white);
            Txt(root, "GoTxt", "出発", 108f, -286f, 82f, 28f, 17f, new Color32(32, 22, 16, 255));
        }

        private static void BuildKokuyouRareCutinComparison(RectTransform root, AssetCache c)
        {
            Txt(root, "Title", "黒耀化 / rare / cut-in 比較", 0f, 364f, 330f, 36f, 17f, PaleText);
            Img(root, "KokuyouOld", c.S("U8Refined/FullscreenArt/kokuyou_fullscreen_ink_shadow_source_refined"), -116f, 178f, 116f, 236f, Color.white);
            Img(root, "KokuyouA", c.S("U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_a"), 0f, 178f, 116f, 236f, Color.white);
            Img(root, "KokuyouB", c.S("U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_b"), 116f, 178f, 116f, 236f, Color.white);
            Txt(root, "KOld", "U8.1", -116f, 44f, 94f, 18f, 10f, PaleText);
            Txt(root, "KA", "U10 A", 0f, 44f, 94f, 18f, 10f, PaleText);
            Txt(root, "KB", "U10 B", 116f, 44f, 94f, 18f, 10f, PaleText);

            Img(root, "RareOld", c.S("U8Refined/VFX/levelup_rare_ink_flare_refined"), -104f, -100f, 116f, 150f, Color.white);
            Img(root, "RareRing", c.S("U8Candidates/VFX/levelup_rare_lantern_pulse_ring"), 0f, -100f, 110f, 110f, Color.white);
            Img(root, "RareNew", c.S("U10Candidates/VFX/levelup_rare_memory_tear_burst"), 104f, -100f, 126f, 126f, Color.white);
            Txt(root, "RareCap", "rareは黒耀化より弱く、通常VFXより特別", 0f, -194f, 320f, 22f, 11f, PaleText);

            Img(root, "CutinOld", c.S("U8Candidates/FullscreenArt/cutin_black_ink_band"), 0f, -272f, 300f, 46f, new Color(1f, 1f, 1f, 0.72f));
            Img(root, "CutinNew", c.S("U10Candidates/Cutin/cutin_black_ink_band_final_candidate"), 0f, -322f, 316f, 56f, Color.white);
            Txt(root, "CutinText", "TMP overlay space", 0f, -322f, 220f, 24f, 12f, WarmPale);
        }

        private static void Txt(RectTransform p, string n, string t, float x, float y, float w, float h, float sz, Color col, TextAlignmentOptions align = TextAlignmentOptions.Center)
        {
            var o = new GameObject(n, typeof(RectTransform), typeof(TextMeshProUGUI));
            o.transform.SetParent(p, false);
            new RectSpec(0.5f, 0.5f, x, y, w, h).Apply(o.GetComponent<RectTransform>());
            var tmp = o.GetComponent<TextMeshProUGUI>();
            tmp.font = sdfFont;
            tmp.text = t;
            tmp.fontSize = sz;
            tmp.color = col;
            tmp.alignment = align;
            tmp.textWrappingMode = TextWrappingModes.NoWrap;
            tmp.raycastTarget = false;
        }

        private static void Img(RectTransform p, string n, Sprite s, float x, float y, float w, float h, Color col, float rot = 0f)
        {
            AddImage(p, n, s, new RectSpec(0.5f, 0.5f, x, y, w, h), col, rot);
        }

        private static void AddInkWash(RectTransform root, Profile p)
        {
            AddSolid(root, "TopShade", new RectSpec(0.5f, 1f, 0f, -64f, p.Width + 80f, 150f), new Color32(11, 10, 12, 150));
            AddSolid(root, "BotShade", new RectSpec(0.5f, 0f, 0f, 62f, p.Width + 80f, 170f), DeepInk);
        }

        private static Image AddSolid(RectTransform parent, string name, RectSpec spec, Color color)
        {
            var img = AddImage(parent, name, null, spec, color);
            img.raycastTarget = false;
            return img;
        }

        private static Image AddImage(RectTransform parent, string name, Sprite sprite, RectSpec spec, Color color, float rotation = 0f)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            var rect = obj.GetComponent<RectTransform>();
            spec.Apply(rect);
            rect.localRotation = Quaternion.Euler(0f, 0f, rotation);
            var image = obj.GetComponent<Image>();
            image.sprite = sprite;
            image.color = color;
            image.preserveAspect = sprite != null;
            image.raycastTarget = false;
            return image;
        }

        private static RectSpec Stretch() => new(0.5f, 0.5f, 0f, 0f, 2000f, 2000f);
        private static string ProjectRoot() => Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();

        private readonly struct RectSpec
        {
            public RectSpec(float ax, float ay, float x, float y, float w, float h) { AX = ax; AY = ay; X = x; Y = y; W = w; H = h; }
            private float AX { get; } private float AY { get; } private float X { get; } private float Y { get; } private float W { get; } private float H { get; }
            public void Apply(RectTransform r) { r.anchorMin = new Vector2(AX, AY); r.anchorMax = new Vector2(AX, AY); r.pivot = new Vector2(0.5f, 0.5f); r.anchoredPosition = new Vector2(X, Y); r.sizeDelta = new Vector2(W, H); }
        }

        private sealed class AssetCache
        {
            private readonly List<UnityEngine.Object> created;
            private readonly Dictionary<string, Sprite> sprites = new();
            public AssetCache(List<UnityEngine.Object> c) { created = c; }

            public Sprite S(string sub)
            {
                var key = $"Assets/_Project/Resources/{sub}.png";
                if (sprites.TryGetValue(key, out var cached)) return cached;
                var texture = new Texture2D(2, 2, TextureFormat.RGBA32, false);
                var abs = Path.GetFullPath(Path.Combine(ProjectRoot(), key));
                if (!texture.LoadImage(File.ReadAllBytes(abs)))
                {
                    throw new InvalidOperationException($"Failed: {key}");
                }
                texture.name = Path.GetFileNameWithoutExtension(key);
                texture.filterMode = FilterMode.Bilinear;
                texture.wrapMode = TextureWrapMode.Clamp;
                created.Add(texture);
                var sprite = UnityEngine.Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5f, 0.5f), 100f, 0, SpriteMeshType.FullRect);
                sprite.name = texture.name;
                created.Add(sprite);
                sprites[key] = sprite;
                return sprite;
            }
        }
    }
}
