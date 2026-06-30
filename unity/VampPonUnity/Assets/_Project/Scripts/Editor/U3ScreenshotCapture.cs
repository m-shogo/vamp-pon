using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.Editor
{
    public static class U3ScreenshotCapture
    {
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u3";
        private const string StatePath = "Logs/u3_screenshot_state.txt";
        private const string ReportPath = "Logs/u3_screenshot_capture_report.txt";
        private static readonly Profile[] Profiles = { new(390, 844), new(360, 800), new(430, 932) };
        private static readonly List<string> captureLog = new();
        private static double stepStartedAt;
        private static int profileIndex;
        private static CaptureStep step;

        private enum CaptureStep { WaitForJuice, SetResolution, Capture, Done }

        private readonly struct Profile
        {
            public Profile(int width, int height)
            {
                Width = width;
                Height = height;
            }

            public int Width { get; }
            public int Height { get; }
            public string FileName => $"unity-u3-stage1-{Width}x{Height}.png";
        }

        [InitializeOnLoadMethod]
        private static void ResumeIfNeeded()
        {
            if (File.Exists(StatePath))
            {
                EditorApplication.update -= Update;
                EditorApplication.update += Update;
            }
        }

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);
                File.WriteAllText(StatePath, "capturing");
                captureLog.Clear();
                profileIndex = 0;
                step = CaptureStep.WaitForJuice;
                stepStartedAt = EditorApplication.timeSinceStartup;
                EditorSceneManager.OpenScene(BootScenePath, OpenSceneMode.Single);
                EditorApplication.update -= Update;
                EditorApplication.update += Update;
                EditorApplication.EnterPlaymode();
            }
            catch (Exception ex)
            {
                Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static void Update()
        {
            if (EditorApplication.timeSinceStartup - stepStartedAt > 24.0)
            {
                Fail($"Timed out at step {step}.");
                return;
            }

            if (!EditorApplication.isPlaying)
            {
                return;
            }

            switch (step)
            {
                case CaptureStep.WaitForJuice:
                    var controller = UnityEngine.Object.FindAnyObjectByType<U2BattleController>();
                    if (SceneManager.GetActiveScene().name == "Stage1" &&
                        controller != null &&
                        controller.PlayedVfxCount >= 4 &&
                        controller.ActiveVfxCount > 0 &&
                        EditorApplication.timeSinceStartup - stepStartedAt > 5.4)
                    {
                        Next(CaptureStep.SetResolution);
                    }
                    break;
                case CaptureStep.SetResolution:
                    var profile = Profiles[profileIndex];
                    Screen.SetResolution(profile.Width, profile.Height, FullScreenMode.Windowed);
                    Next(CaptureStep.Capture);
                    break;
                case CaptureStep.Capture:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.12)
                    {
                        return;
                    }

                    var captureProfile = Profiles[profileIndex];
                    var path = AbsolutePath(captureProfile);
                    if (File.Exists(path))
                    {
                        File.Delete(path);
                    }

                    CaptureProfileToPng(captureProfile, path);
                    var info = new FileInfo(path);
                    captureLog.Add($"{captureProfile.Width}x{captureProfile.Height}: {captureProfile.FileName}, bytes={info.Length}");
                    profileIndex++;
                    Next(profileIndex >= Profiles.Length ? CaptureStep.Done : CaptureStep.SetResolution);
                    break;
                case CaptureStep.Done:
                    Finish();
                    break;
            }
        }

        private static string AbsolutePath(Profile profile)
        {
            var projectRoot = Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
            return Path.GetFullPath(Path.Combine(projectRoot, OutputDirectory, profile.FileName));
        }

        private static void CaptureProfileToPng(Profile profile, string path)
        {
            var camera = Camera.main != null ? Camera.main : UnityEngine.Object.FindAnyObjectByType<Camera>();
            if (camera == null)
            {
                throw new InvalidOperationException("Main Camera was not found.");
            }

            var renderTexture = new RenderTexture(profile.Width, profile.Height, 24, RenderTextureFormat.ARGB32);
            var texture = new Texture2D(profile.Width, profile.Height, TextureFormat.RGBA32, false);
            var previousTarget = camera.targetTexture;
            var previousActive = RenderTexture.active;
            var previousRect = camera.rect;
            var previousAspect = camera.aspect;
            var canvas = GameObject.Find("SafeAreaCanvas")?.GetComponent<Canvas>();
            var previousRenderMode = canvas != null ? canvas.renderMode : RenderMode.ScreenSpaceOverlay;
            var previousCamera = canvas != null ? canvas.worldCamera : null;
            var previousPlaneDistance = canvas != null ? canvas.planeDistance : 0f;

            try
            {
                if (canvas != null)
                {
                    canvas.renderMode = RenderMode.ScreenSpaceCamera;
                    canvas.worldCamera = camera;
                    canvas.planeDistance = 1f;
                    Canvas.ForceUpdateCanvases();
                }

                camera.targetTexture = renderTexture;
                camera.rect = new Rect(0f, 0f, 1f, 1f);
                camera.aspect = profile.Width / (float)profile.Height;
                camera.Render();
                RenderTexture.active = renderTexture;
                texture.ReadPixels(new Rect(0, 0, profile.Width, profile.Height), 0, 0);
                texture.Apply();
                File.WriteAllBytes(path, texture.EncodeToPNG());
            }
            finally
            {
                if (canvas != null)
                {
                    canvas.renderMode = previousRenderMode;
                    canvas.worldCamera = previousCamera;
                    canvas.planeDistance = previousPlaneDistance;
                }

                camera.targetTexture = previousTarget;
                camera.rect = previousRect;
                camera.aspect = previousAspect;
                RenderTexture.active = previousActive;
                UnityEngine.Object.DestroyImmediate(texture);
                UnityEngine.Object.DestroyImmediate(renderTexture);
            }
        }

        private static void Next(CaptureStep nextStep)
        {
            step = nextStep;
            stepStartedAt = EditorApplication.timeSinceStartup;
        }

        private static void Finish()
        {
            EditorApplication.update -= Update;
            File.WriteAllText(ReportPath, string.Join(Environment.NewLine, captureLog));
            File.Delete(StatePath);
            EditorApplication.ExitPlaymode();
            EditorApplication.Exit(0);
        }

        private static void Fail(string message)
        {
            EditorApplication.update -= Update;
            File.Delete(StatePath);
            File.WriteAllText(ReportPath, message + Environment.NewLine + string.Join(Environment.NewLine, captureLog));
            Debug.LogError(message);
            EditorApplication.Exit(1);
        }
    }
}
