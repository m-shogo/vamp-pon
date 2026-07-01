using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U11.Result;
using VampPon.UnitySpike.U11.StageSelect;
using VampPon.UnitySpike.U12.Result;
using VampPon.UnitySpike.U12.StageSelect;

namespace VampPon.UnitySpike.Editor
{
    public static class U12FunctionalProofScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u12/screenshots";
        private const string ReportPath = "Logs/u12_functional_proof_screenshot_report.txt";
        private const string SDFFontAssetPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(24, 22, 21, 255);
        private static readonly Color32 DeepInk = new(18, 15, 17, 235);
        private static readonly Color32 PaleText = new(238, 222, 190, 255);
        private static readonly List<string> ProofHookLog = new();

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
                    log.Add(Capture(p, $"u12-result-functional-proof-{p.Width}x{p.Height}.png", BuildResultProof));
                    log.Add(Capture(p, $"u12-stageselect-functional-proof-{p.Width}x{p.Height}.png", BuildStageSelectProof));
                }

                log.Add(Capture(new Profile(390, 844), "u12-kokuyou-rare-cutin-review-390x844.png", BuildKokuyouRareCutinReview));
                log.AddRange(ProofHookLog);

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
            var camObj = new GameObject("U12Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U12Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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
            var assets = new ResultProofAssets(
                c.S("U8Candidates/UI/result_paper_ledger_panel"),
                c.S("U8Candidates/UI/result_rank_wax_seal"),
                c.S("U8Candidates/UI/result_reward_memory_card"),
                c.S("U8Refined/UI/result_new_badge_refined"),
                c.S("U10Candidates/UI/result_continue_paper_button"),
                c.S("U10Candidates/UI/result_stats_ink_strip"));
            ResultFunctionalProofController.Create(root, assets, sdfFont, ResultProofData.Sample, eventId => ProofHookLog.Add($"result hook invoked: {eventId}"));
            root.GetComponentInChildren<ResultContinueButtonProof>()?.OnClickProof();
        }

        private static void BuildStageSelectProof(RectTransform root, AssetCache c)
        {
            var assets = new StageSelectProofAssets(
                c.S("U8Candidates/UI/stageselect_paper_map_base"),
                c.S("U8Candidates/UI/stageselect_route_line_ink"),
                c.S("U8Candidates/UI/stageselect_start_marker_lantern"),
                c.S("U10Candidates/UI/stageselect_route_active_node"),
                c.S("U10Candidates/UI/stageselect_route_locked_node"),
                c.S("U10Candidates/UI/result_continue_paper_button"));
            StageSelectFunctionalProofController.Create(root, assets, sdfFont, StageProofData.SampleStages, eventId => ProofHookLog.Add($"stage hook invoked: {eventId}"));
            root.GetComponentInChildren<StageStartButtonProof>()?.OnClickProof();
        }

        private static void BuildKokuyouRareCutinReview(RectTransform root, AssetCache c)
        {
            Txt(root, "Title", "黒耀化 / rare / cut-in review", 0f, 364f, 330f, 36f, 17f, PaleText);
            Img(root, "KokuyouA", c.S("U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_a"), -76f, 174f, 132f, 260f, Color.white);
            Img(root, "KokuyouB", c.S("U10Candidates/FullscreenArt/kokuyou_fullscreen_final_candidate_b"), 84f, 174f, 132f, 260f, Color.white);
            Txt(root, "KA", "A: 保留候補", -76f, 30f, 120f, 18f, 10f, PaleText);
            Txt(root, "KB", "B: 主軸候補", 84f, 30f, 120f, 18f, 10f, PaleText);

            Img(root, "Rare", c.S("U10Candidates/VFX/levelup_rare_memory_tear_burst"), -86f, -110f, 150f, 150f, Color.white);
            Txt(root, "RareCap", "rare: 採用候補", -86f, -204f, 180f, 22f, 11f, PaleText);
            Img(root, "CutinNew", c.S("U10Candidates/Cutin/cutin_black_ink_band_final_candidate"), 86f, -116f, 190f, 48f, Color.white);
            Txt(root, "CutinText", "TMP文字余白", 86f, -116f, 150f, 22f, 12f, new Color32(248, 232, 200, 255));
            Txt(root, "CutinCap", "cut-in band: 採用候補", 86f, -160f, 150f, 20f, 10f, PaleText);
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

        private static void Img(RectTransform p, string n, Sprite s, float x, float y, float w, float h, Color col)
        {
            var obj = new GameObject(n, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(p, false);
            new RectSpec(0.5f, 0.5f, x, y, w, h).Apply(obj.GetComponent<RectTransform>());
            var image = obj.GetComponent<Image>();
            image.sprite = s;
            image.color = col;
            image.preserveAspect = true;
            image.raycastTarget = false;
        }

        private static void AddInkWash(RectTransform root, Profile p)
        {
            AddSolid(root, "TopShade", new RectSpec(0.5f, 1f, 0f, -64f, p.Width + 80f, 150f), new Color32(11, 10, 12, 150));
            AddSolid(root, "BotShade", new RectSpec(0.5f, 0f, 0f, 62f, p.Width + 80f, 170f), DeepInk);
        }

        private static void AddSolid(RectTransform parent, string name, RectSpec spec, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            spec.Apply(obj.GetComponent<RectTransform>());
            var image = obj.GetComponent<Image>();
            image.color = color;
            image.raycastTarget = false;
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
