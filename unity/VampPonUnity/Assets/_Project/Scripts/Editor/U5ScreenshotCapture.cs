using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U4;

namespace VampPon.UnitySpike.Editor
{
    public static class U5ScreenshotCapture
    {
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u5";
        private const string StatePath = "Logs/u5_screenshot_state.txt";
        private const string ReportPath = "Logs/u5_screenshot_capture_report.txt";
        private static readonly Profile[] BattleProfiles =
        {
            new(390, 844, "u5-battle-390x844.png"),
            new(360, 800, "u5-battle-360x800.png"),
            new(430, 932, "u5-battle-430x932.png"),
        };
        private static readonly Profile LevelUpProfile = new(390, 844, "u5-levelup-390x844.png");
        private static readonly Profile VfxProfile = new(390, 844, "u5-vfx-proof-390x844.png");
        private static readonly List<string> captureLog = new();
        private static double stepStartedAt;
        private static int profileIndex;
        private static CaptureStep step;
        private static bool seededBattleEnemies;

        private enum CaptureStep { WaitForBattle, CaptureBattle, WaitForMoreVfx, CaptureVfxProof, TriggerLevelUp, CaptureLevelUp, Done }

        private readonly struct Profile
        {
            public Profile(int width, int height, string fileName)
            {
                Width = width;
                Height = height;
                FileName = fileName;
            }

            public int Width { get; }
            public int Height { get; }
            public string FileName { get; }
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
                U5VisualCandidateImportSetup.Run();
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);
                File.WriteAllText(StatePath, "capturing");
                captureLog.Clear();
                profileIndex = 0;
                seededBattleEnemies = false;
                step = CaptureStep.WaitForBattle;
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
            if (EditorApplication.timeSinceStartup - stepStartedAt > 26.0)
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
                case CaptureStep.WaitForBattle:
                    var controller = UnityEngine.Object.FindAnyObjectByType<U2BattleController>();
                    var player = GameObject.Find("YuiPlaceholder");
                    if (!seededBattleEnemies && controller != null && player != null && SceneManager.GetActiveScene().name == "Stage1")
                    {
                        controller.SpawnEnemyForVerification(player.transform.position + new Vector3(-0.95f, -0.55f, 0f));
                        controller.SpawnEnemyForVerification(player.transform.position + new Vector3(1.05f, 0.4f, 0f));
                        seededBattleEnemies = true;
                    }

                    if (SceneManager.GetActiveScene().name == "Stage1" &&
                        controller != null &&
                        controller.ActiveEnemyCount > 0 &&
                        EditorApplication.timeSinceStartup - stepStartedAt > 0.8)
                    {
                        Next(CaptureStep.CaptureBattle);
                    }
                    break;
                case CaptureStep.CaptureBattle:
                    CaptureProfile(BattleProfiles[profileIndex]);
                    profileIndex++;
                    Next(profileIndex >= BattleProfiles.Length ? CaptureStep.WaitForMoreVfx : CaptureStep.CaptureBattle);
                    break;
                case CaptureStep.WaitForMoreVfx:
                    var vfxController = UnityEngine.Object.FindAnyObjectByType<U2BattleController>();
                    if (vfxController != null &&
                        (vfxController.PlayedVfxCount >= 4 || EditorApplication.timeSinceStartup - stepStartedAt > 3.8))
                    {
                        Next(CaptureStep.CaptureVfxProof);
                    }
                    break;
                case CaptureStep.CaptureVfxProof:
                    CaptureProfile(VfxProfile);
                    Next(CaptureStep.TriggerLevelUp);
                    break;
                case CaptureStep.TriggerLevelUp:
                    var demo = UnityEngine.Object.FindAnyObjectByType<U4LevelUpDemoController>();
                    demo?.TriggerLevelUp();
                    Next(CaptureStep.CaptureLevelUp);
                    break;
                case CaptureStep.CaptureLevelUp:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.45)
                    {
                        return;
                    }

                    CaptureProfile(LevelUpProfile);
                    Next(CaptureStep.Done);
                    break;
                case CaptureStep.Done:
                    Finish();
                    break;
            }
        }

        private static void CaptureProfile(Profile profile)
        {
            Screen.SetResolution(profile.Width, profile.Height, FullScreenMode.Windowed);
            var path = AbsolutePath(profile);
            if (File.Exists(path))
            {
                File.Delete(path);
            }

            CaptureProfileToPng(profile, path);
            var info = new FileInfo(path);
            captureLog.Add($"{profile.Width}x{profile.Height}: {profile.FileName}, bytes={info.Length}");
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
            var canvasSnapshots = PrepareCanvases(camera);

            try
            {
                Canvas.ForceUpdateCanvases();
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
                RestoreCanvases(canvasSnapshots);
                camera.targetTexture = previousTarget;
                camera.rect = previousRect;
                camera.aspect = previousAspect;
                RenderTexture.active = previousActive;
                UnityEngine.Object.DestroyImmediate(texture);
                UnityEngine.Object.DestroyImmediate(renderTexture);
            }
        }

        private static List<CanvasSnapshot> PrepareCanvases(Camera camera)
        {
            var snapshots = new List<CanvasSnapshot>();
            foreach (var canvas in UnityEngine.Object.FindObjectsByType<Canvas>(FindObjectsInactive.Exclude))
            {
                snapshots.Add(new CanvasSnapshot(canvas));
                canvas.renderMode = RenderMode.ScreenSpaceCamera;
                canvas.worldCamera = camera;
                canvas.planeDistance = 1f;
            }

            return snapshots;
        }

        private static void RestoreCanvases(List<CanvasSnapshot> snapshots)
        {
            foreach (var snapshot in snapshots)
            {
                if (snapshot.Canvas == null)
                {
                    continue;
                }

                snapshot.Canvas.renderMode = snapshot.RenderMode;
                snapshot.Canvas.worldCamera = snapshot.WorldCamera;
                snapshot.Canvas.planeDistance = snapshot.PlaneDistance;
            }
        }

        private readonly struct CanvasSnapshot
        {
            public CanvasSnapshot(Canvas canvas)
            {
                Canvas = canvas;
                RenderMode = canvas.renderMode;
                WorldCamera = canvas.worldCamera;
                PlaneDistance = canvas.planeDistance;
            }

            public Canvas Canvas { get; }
            public RenderMode RenderMode { get; }
            public Camera WorldCamera { get; }
            public float PlaneDistance { get; }
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
            U4TimeScaleGuard.ForceRestore();
            EditorApplication.ExitPlaymode();
            EditorApplication.Exit(0);
        }

        private static void Fail(string message)
        {
            EditorApplication.update -= Update;
            if (File.Exists(StatePath))
            {
                File.Delete(StatePath);
            }

            File.WriteAllText(ReportPath, message + Environment.NewLine + string.Join(Environment.NewLine, captureLog));
            U4TimeScaleGuard.ForceRestore();
            Debug.LogError(message);
            EditorApplication.Exit(1);
        }
    }
}
