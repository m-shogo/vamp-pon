using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U14SceneFlowScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u14/screenshots";
        private const string ReportPath = "Logs/u14_scene_flow_screenshot_report.txt";
        private static readonly Color32 Night = new(24, 22, 21, 255);
        private static readonly Color32 DeepInk = new(18, 15, 17, 235);

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
                U14ProofSceneBuilder.SaveAll();

                var log = new List<string>();
                foreach (var p in MobileProfiles)
                {
                    log.Add(Capture(p, $"u14-stage-select-flow-proof-{p.Width}x{p.Height}.png", U14ProofSceneBuilder.BuildStageSelectProof));
                    log.Add(Capture(p, $"u14-battle-flow-proof-{p.Width}x{p.Height}.png", U14ProofSceneBuilder.BuildBattleProof));
                    log.Add(Capture(p, $"u14-result-flow-proof-{p.Width}x{p.Height}.png", U14ProofSceneBuilder.BuildResultProof));
                }

                log.Add(Capture(new Profile(390, 844), "u14-flow-sequence-proof-390x844.png", U14ProofSceneBuilder.BuildSequenceProof));
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

        private static string Capture(Profile profile, string fileName, Func<Transform, GameObject> build)
        {
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U14Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = profile.Height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U14Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
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

            AddSolid(canvasRect, "Bg", new RectSpec(0.5f, 0.5f, 0f, 0f, 2000f, 2000f), Night);
            AddSolid(canvasRect, "TopShade", new RectSpec(0.5f, 1f, 0f, -64f, profile.Width + 80f, 150f), new Color32(11, 10, 12, 150));
            AddSolid(canvasRect, "BotShade", new RectSpec(0.5f, 0f, 0f, 62f, profile.Width + 80f, 170f), DeepInk);
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

        private static void AddSolid(RectTransform parent, string name, RectSpec spec, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            spec.Apply(obj.GetComponent<RectTransform>());
            var image = obj.GetComponent<Image>();
            image.color = color;
            image.raycastTarget = false;
        }

        private static string ProjectRoot() => Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();

        private readonly struct RectSpec
        {
            public RectSpec(float ax, float ay, float x, float y, float w, float h) { AX = ax; AY = ay; X = x; Y = y; W = w; H = h; }
            private float AX { get; } private float AY { get; } private float X { get; } private float Y { get; } private float W { get; } private float H { get; }
            public void Apply(RectTransform r) { r.anchorMin = new Vector2(AX, AY); r.anchorMax = new Vector2(AX, AY); r.pivot = new Vector2(0.5f, 0.5f); r.anchoredPosition = new Vector2(X, Y); r.sizeDelta = new Vector2(W, H); }
        }
    }
}
