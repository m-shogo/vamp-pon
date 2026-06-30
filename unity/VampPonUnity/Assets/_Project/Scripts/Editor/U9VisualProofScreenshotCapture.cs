using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U9VisualProofScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u9/screenshots";
        private const string ReportPath = "Logs/u9_visual_proof_screenshot_report.txt";
        private static readonly Color32 Night = new(24, 22, 21, 255);
        private static readonly Color32 DeepInk = new(18, 15, 17, 235);
        private static readonly Color32 Paper = new(235, 214, 165, 245);
        private static readonly Color32 Amber = new(246, 177, 76, 255);
        private static readonly Color32 InkText = new(44, 31, 26, 255);
        private static readonly Color32 PaleText = new(238, 222, 190, 255);

        private static readonly Profile[] MobileProfiles =
        {
            new(390, 844),
            new(360, 800),
            new(430, 932),
        };

        private readonly struct Profile
        {
            public Profile(int width, int height)
            {
                Width = width;
                Height = height;
            }

            public int Width { get; }
            public int Height { get; }
        }

        public static void Run()
        {
            try
            {
                U8VisualCandidateImportSetup.Run();
                U8RefinedVisualCandidateImportSetup.Run();
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);

                var log = new List<string>();
                foreach (var profile in MobileProfiles)
                {
                    log.Add(Capture(profile, $"u9-result-proof-{profile.Width}x{profile.Height}.png", BuildResultProof));
                    log.Add(Capture(profile, $"u9-stageselect-proof-{profile.Width}x{profile.Height}.png", BuildStageSelectProof));
                }

                log.Add(Capture(new Profile(390, 844), "u9-kokuyou-rare-proof-390x844.png", BuildKokuyouRareProof));
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
            var cameraObject = new GameObject("U9ProofCamera", typeof(Camera));
            created.Add(cameraObject);
            var camera = cameraObject.GetComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = Night;
            camera.orthographic = true;
            camera.orthographicSize = profile.Height * 0.5f;
            camera.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObject = new GameObject("U9ProofCanvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            created.Add(canvasObject);
            var canvas = canvasObject.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceCamera;
            canvas.worldCamera = camera;
            canvas.planeDistance = 1f;
            var scaler = canvasObject.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(390f, 844f);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;
            var canvasRect = canvasObject.GetComponent<RectTransform>();
            canvasRect.sizeDelta = new Vector2(profile.Width, profile.Height);

            AddSolid(canvasRect, "Background", Stretch(), Night);
            AddInkWash(canvasRect, profile);
            build(canvasRect, cache);

            Canvas.ForceUpdateCanvases();
            var path = Path.GetFullPath(Path.Combine(ProjectRoot(), OutputDirectory, fileName));
            if (File.Exists(path))
            {
                File.Delete(path);
            }

            var renderTexture = new RenderTexture(profile.Width, profile.Height, 24, RenderTextureFormat.ARGB32);
            var texture = new Texture2D(profile.Width, profile.Height, TextureFormat.RGBA32, false);
            var previousTarget = camera.targetTexture;
            var previousActive = RenderTexture.active;
            var previousAspect = camera.aspect;
            try
            {
                camera.targetTexture = renderTexture;
                camera.aspect = profile.Width / (float)profile.Height;
                camera.Render();
                RenderTexture.active = renderTexture;
                texture.ReadPixels(new Rect(0, 0, profile.Width, profile.Height), 0, 0);
                texture.Apply();
                File.WriteAllBytes(path, texture.EncodeToPNG());
            }
            finally
            {
                camera.targetTexture = previousTarget;
                camera.aspect = previousAspect;
                RenderTexture.active = previousActive;
                UnityEngine.Object.DestroyImmediate(texture);
                UnityEngine.Object.DestroyImmediate(renderTexture);
                foreach (var item in created)
                {
                    UnityEngine.Object.DestroyImmediate(item);
                }
            }

            var info = new FileInfo(path);
            return $"{profile.Width}x{profile.Height}: {fileName}, bytes={info.Length}";
        }

        private static void BuildResultProof(RectTransform root, AssetCache cache)
        {
            AddText(root, "ProofLabel", "RESULT PROOF", new RectSpec(0.5f, 0.5f, 0f, 354f, 270f, 34f), 20f, PaleText, TextAlignmentOptions.Center);
            AddImage(root, "LedgerPanel", cache.Sprite("Assets/_Project/Resources/U8Candidates/UI/result_paper_ledger_panel.png"), new RectSpec(0.5f, 0.5f, 0f, 44f, 320f, 560f), new Color(1f, 0.95f, 0.84f, 0.96f));
            AddImage(root, "WaxSeal", cache.Sprite("Assets/_Project/Resources/U8Candidates/UI/result_rank_wax_seal.png"), new RectSpec(0.5f, 0.5f, 96f, 226f, 104f, 104f), Color.white);
            AddText(root, "RankTmp", "RANK", new RectSpec(0.5f, 0.5f, 96f, 226f, 70f, 24f), 14f, new Color32(245, 205, 154, 255), TextAlignmentOptions.Center);
            AddText(root, "NightLog", "TONIGHT'S MEMORY", new RectSpec(0.5f, 0.5f, 0f, 164f, 250f, 26f), 14f, InkText, TextAlignmentOptions.Center);

            for (var i = 0; i < 3; i++)
            {
                var x = -86f + i * 86f;
                AddImage(root, $"RewardCard{i}", cache.Sprite("Assets/_Project/Resources/U8Candidates/UI/result_reward_memory_card.png"), new RectSpec(0.5f, 0.5f, x, 44f, 76f, 104f), new Color(1f, 0.96f, 0.85f, 0.96f));
                AddText(root, $"RewardText{i}", i == 0 ? "MEMORY" : i == 1 ? "INK" : "LIGHT", new RectSpec(0.5f, 0.5f, x, 12f, 60f, 18f), 10f, InkText, TextAlignmentOptions.Center);
            }

            AddImage(root, "NewBadgeRefined", cache.Sprite("Assets/_Project/Resources/U8Refined/UI/result_new_badge_refined.png"), new RectSpec(0.5f, 0.5f, -102f, 118f, 68f, 68f), Color.white);
            AddText(root, "StatsTmp", "Recovered fragments  12    Dawn bonus  +3", new RectSpec(0.5f, 0.5f, 0f, -188f, 286f, 28f), 12f, PaleText, TextAlignmentOptions.Center);
            AddSolid(root, "ContinueButton", new RectSpec(0.5f, 0.5f, 0f, -238f, 220f, 52f), new Color32(226, 176, 96, 230));
            AddText(root, "ContinueTmp", "CONTINUE", new RectSpec(0.5f, 0.5f, 0f, -238f, 190f, 28f), 16f, new Color32(38, 25, 18, 255), TextAlignmentOptions.Center);
        }

        private static void BuildStageSelectProof(RectTransform root, AssetCache cache)
        {
            AddText(root, "ProofLabel", "STAGE SELECT PROOF", new RectSpec(0.5f, 0.5f, 0f, 354f, 300f, 34f), 18f, PaleText, TextAlignmentOptions.Center);
            AddImage(root, "MapBase", cache.Sprite("Assets/_Project/Resources/U8Candidates/UI/stageselect_paper_map_base.png"), new RectSpec(0.5f, 0.5f, 0f, 62f, 322f, 548f), new Color(1f, 0.95f, 0.82f, 0.96f));
            AddImage(root, "RouteLineA", cache.Sprite("Assets/_Project/Resources/U8Candidates/UI/stageselect_route_line_ink.png"), new RectSpec(0.5f, 0.5f, -46f, 118f, 150f, 22f), Color.white, -16f);
            AddImage(root, "RouteLineB", cache.Sprite("Assets/_Project/Resources/U8Candidates/UI/stageselect_route_line_ink.png"), new RectSpec(0.5f, 0.5f, 56f, 36f, 148f, 22f), Color.white, 18f);
            AddImage(root, "RouteLineC", cache.Sprite("Assets/_Project/Resources/U8Candidates/UI/stageselect_route_line_ink.png"), new RectSpec(0.5f, 0.5f, -30f, -44f, 142f, 20f), Color.white, -10f);
            var positions = new[] { new Vector2(-112f, 158f), new Vector2(-28f, 96f), new Vector2(72f, 22f), new Vector2(-44f, -92f), new Vector2(104f, -150f) };
            for (var i = 0; i < positions.Length; i++)
            {
                AddImage(root, $"RouteNode{i}", cache.Sprite("Assets/_Project/Resources/U8Candidates/UI/stageselect_route_node.png"), new RectSpec(0.5f, 0.5f, positions[i].x, positions[i].y, 48f, 48f), Color.white);
            }

            AddImage(root, "StartLantern", cache.Sprite("Assets/_Project/Resources/U8Candidates/UI/stageselect_start_marker_lantern.png"), new RectSpec(0.5f, 0.5f, -112f, 158f, 70f, 86f), Color.white);
            AddSolid(root, "BottomPanel", new RectSpec(0.5f, 0.5f, 0f, -304f, 318f, 104f), new Color32(38, 31, 26, 220));
            AddText(root, "StageTitle", "NIGHT ROAD", new RectSpec(0.5f, 0.5f, -60f, -282f, 180f, 26f), 17f, PaleText, TextAlignmentOptions.Left);
            AddText(root, "Difficulty", "quiet route  /  lantern ready", new RectSpec(0.5f, 0.5f, -60f, -312f, 200f, 22f), 11f, new Color32(205, 182, 143, 255), TextAlignmentOptions.Left);
            AddSolid(root, "StartButton", new RectSpec(0.5f, 0.5f, 104f, -302f, 96f, 46f), new Color32(225, 166, 74, 230));
            AddText(root, "StartTmp", "START", new RectSpec(0.5f, 0.5f, 104f, -302f, 82f, 24f), 14f, new Color32(32, 22, 16, 255), TextAlignmentOptions.Center);
        }

        private static void BuildKokuyouRareProof(RectTransform root, AssetCache cache)
        {
            AddText(root, "ProofLabel", "KOKUYOU / RARE PROOF", new RectSpec(0.5f, 0.5f, 0f, 354f, 310f, 34f), 18f, PaleText, TextAlignmentOptions.Center);
            AddImage(root, "Kokuyou", cache.Sprite("Assets/_Project/Resources/U8Refined/FullscreenArt/kokuyou_fullscreen_ink_shadow_source_refined.png"), new RectSpec(0.5f, 0.5f, 0f, 120f, 320f, 440f), Color.white);
            AddImage(root, "Flare", cache.Sprite("Assets/_Project/Resources/U8Refined/VFX/levelup_rare_ink_flare_refined.png"), new RectSpec(0.5f, 0.5f, -82f, -184f, 150f, 192f), Color.white);
            AddImage(root, "PulseRing", cache.Sprite("Assets/_Project/Resources/U8Candidates/VFX/levelup_rare_lantern_pulse_ring.png"), new RectSpec(0.5f, 0.5f, 92f, -184f, 136f, 136f), Color.white);
            AddText(root, "CaptionA", "refined flare", new RectSpec(0.5f, 0.5f, -82f, -300f, 140f, 22f), 12f, PaleText, TextAlignmentOptions.Center);
            AddText(root, "CaptionB", "U8 pulse ring", new RectSpec(0.5f, 0.5f, 92f, -300f, 140f, 22f), 12f, PaleText, TextAlignmentOptions.Center);
        }

        private static void AddInkWash(RectTransform root, Profile profile)
        {
            AddSolid(root, "TopShade", new RectSpec(0.5f, 1f, 0f, -64f, profile.Width + 80f, 150f), new Color32(11, 10, 12, 150));
            AddSolid(root, "BottomShade", new RectSpec(0.5f, 0f, 0f, 62f, profile.Width + 80f, 170f), DeepInk);
        }

        private static Image AddSolid(RectTransform parent, string name, RectSpec spec, Color color)
        {
            var image = AddImage(parent, name, null, spec, color);
            image.raycastTarget = false;
            return image;
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

        private static TextMeshProUGUI AddText(RectTransform parent, string name, string text, RectSpec spec, float size, Color color, TextAlignmentOptions alignment)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI));
            obj.transform.SetParent(parent, false);
            var rect = obj.GetComponent<RectTransform>();
            spec.Apply(rect);
            var tmp = obj.GetComponent<TextMeshProUGUI>();
            tmp.text = text;
            tmp.fontSize = size;
            tmp.color = color;
            tmp.alignment = alignment;
            tmp.textWrappingMode = TextWrappingModes.NoWrap;
            tmp.raycastTarget = false;
            return tmp;
        }

        private static RectSpec Stretch() => new(0.5f, 0.5f, 0f, 0f, 2000f, 2000f);

        private static string ProjectRoot() => Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();

        private readonly struct RectSpec
        {
            public RectSpec(float anchorX, float anchorY, float x, float y, float width, float height)
            {
                AnchorX = anchorX;
                AnchorY = anchorY;
                X = x;
                Y = y;
                Width = width;
                Height = height;
            }

            private float AnchorX { get; }
            private float AnchorY { get; }
            private float X { get; }
            private float Y { get; }
            private float Width { get; }
            private float Height { get; }

            public void Apply(RectTransform rect)
            {
                rect.anchorMin = new Vector2(AnchorX, AnchorY);
                rect.anchorMax = new Vector2(AnchorX, AnchorY);
                rect.pivot = new Vector2(0.5f, 0.5f);
                rect.anchoredPosition = new Vector2(X, Y);
                rect.sizeDelta = new Vector2(Width, Height);
            }
        }

        private sealed class AssetCache
        {
            private readonly List<UnityEngine.Object> created;
            private readonly Dictionary<string, Sprite> sprites = new();

            public AssetCache(List<UnityEngine.Object> created)
            {
                this.created = created;
            }

            public Sprite Sprite(string assetPath)
            {
                if (sprites.TryGetValue(assetPath, out var cached))
                {
                    return cached;
                }

                var texture = new Texture2D(2, 2, TextureFormat.RGBA32, false);
                var absolute = Path.GetFullPath(Path.Combine(ProjectRoot(), assetPath));
                if (!texture.LoadImage(File.ReadAllBytes(absolute)))
                {
                    throw new InvalidOperationException($"Failed to load texture: {assetPath}");
                }

                texture.name = Path.GetFileNameWithoutExtension(assetPath);
                texture.filterMode = FilterMode.Bilinear;
                texture.wrapMode = TextureWrapMode.Clamp;
                created.Add(texture);
                var sprite = UnityEngine.Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5f, 0.5f), 100f, 0, SpriteMeshType.FullRect);
                sprite.name = texture.name;
                created.Add(sprite);
                sprites[assetPath] = sprite;
                return sprite;
            }
        }
    }
}
