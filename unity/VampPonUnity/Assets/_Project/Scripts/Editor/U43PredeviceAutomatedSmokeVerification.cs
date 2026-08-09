using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using TMPro;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem.UI;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U4;

namespace VampPon.UnitySpike.Editor
{
    public static class U43PredeviceAutomatedSmokeVerification
    {
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string Stage1ScenePath = "Assets/_Project/Scenes/Stage1/Stage1.unity";
        private const string StatePath = "Logs/u43_predevice_smoke_state.txt";
        private const string PreflightPath = "Logs/u43_predevice_smoke_preflight.txt";
        private const string ReportPath = "Logs/u43_predevice_smoke_report.txt";
        private const string EvidencePath = "../../docs/design-targets/generated/unity-u43/predevice-automated-smoke-readiness.json";
        private const string ScreenshotDirectory = "../../docs/design-targets/generated/unity-u43/predevice-smoke";

        private static readonly List<string> report = new();
        private static double stepStartedAt;
        private static SmokeStep step;
        private static Snapshot pausedSnapshot;
        private static bool unityBatchmodeCompileReady = true;
        private static bool bootSceneOpenReady;
        private static bool stage1SceneOpenReady;
        private static bool buildSceneReady;
        private static bool proofSceneExcluded;
        private static bool stage1RuntimeBootstrapReady;
        private static bool stageSelectPauseGateReady;
        private static bool battleStartResumeReady;
        private static bool resultPauseGateReady;
        private static bool stageSelectReturnPauseReady;
        private static bool retryRouteReady;
        private static bool uiMovementCollisionGuardReady;
        private static bool virtualStickLowerLeftOnly;
        private static bool audioHookEditorReady;
        private static bool hapticHookEditorReady;
        private static bool editorScreenshotsReady;
        private static bool iosBuildGenerationReady;

        private enum SmokeStep
        {
            WaitForStage1,
            CheckStageSelectPauseStart,
            CheckStageSelectPauseStable,
            PressStageStart,
            CheckBattleStarted,
            TriggerLevelUp,
            CloseLevelUp,
            OpenResult,
            CheckResultPauseStart,
            CheckResultPauseStable,
            ReturnStageSelect,
            CheckStageSelectReturn,
            Done,
        }

        private readonly struct Snapshot
        {
            public Snapshot(U2BattleController controller)
            {
                ElapsedSeconds = ReadPrivateFloat(controller, "elapsedSeconds");
                SpawnedEnemyCount = controller != null ? controller.SpawnedEnemyCount : -1;
                FiredProjectileCount = controller != null ? controller.FiredProjectileCount : -1;
                DroppedExpCount = controller != null ? controller.DroppedExpCount : -1;
                CollectedExpCount = controller != null ? controller.CollectedExpCount : -1;
                ActiveEnemyCount = controller != null ? controller.ActiveEnemyCount : -1;
                ActiveProjectileCount = controller != null ? controller.ActiveProjectileCount : -1;
                ActiveExpCount = controller != null ? controller.ActiveExpCount : -1;
            }

            public float ElapsedSeconds { get; }
            public int SpawnedEnemyCount { get; }
            public int FiredProjectileCount { get; }
            public int DroppedExpCount { get; }
            public int CollectedExpCount { get; }
            public int ActiveEnemyCount { get; }
            public int ActiveProjectileCount { get; }
            public int ActiveExpCount { get; }
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

        [InitializeOnLoadMethod]
        private static void ResumeIfNeeded()
        {
            if (File.Exists(StatePath))
            {
                RestorePreflight();
                EditorApplication.update -= Update;
                EditorApplication.update += Update;
            }
        }

        [MenuItem("VampPon/U43/Run Predevice Automated Smoke")]
        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(AbsoluteRepoPath(ScreenshotDirectory));
                report.Clear();
                ResetFlags();
                RunEditorPreflight();
                File.WriteAllText(StatePath, "u43_predevice_smoke");
                step = SmokeStep.WaitForStage1;
                stepStartedAt = EditorApplication.timeSinceStartup;
                EditorSceneManager.OpenScene(BootScenePath, OpenSceneMode.Single);
                EditorApplication.update -= Update;
                EditorApplication.update += Update;
                EditorApplication.EnterPlaymode();
            }
            catch (Exception ex)
            {
                unityBatchmodeCompileReady = false;
                report.Add("preflight exception: " + ex.Message);
                WriteEvidence();
                Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static void ResetFlags()
        {
            unityBatchmodeCompileReady = true;
            bootSceneOpenReady = false;
            stage1SceneOpenReady = false;
            buildSceneReady = false;
            proofSceneExcluded = false;
            stage1RuntimeBootstrapReady = false;
            stageSelectPauseGateReady = false;
            battleStartResumeReady = false;
            resultPauseGateReady = false;
            stageSelectReturnPauseReady = false;
            retryRouteReady = false;
            uiMovementCollisionGuardReady = false;
            virtualStickLowerLeftOnly = false;
            audioHookEditorReady = false;
            hapticHookEditorReady = false;
            editorScreenshotsReady = false;
            iosBuildGenerationReady = false;
        }

        private static void RunEditorPreflight()
        {
            var boot = EditorSceneManager.OpenScene(BootScenePath, OpenSceneMode.Single);
            bootSceneOpenReady = boot.IsValid();
            var stage1 = EditorSceneManager.OpenScene(Stage1ScenePath, OpenSceneMode.Single);
            stage1SceneOpenReady = stage1.IsValid();

            var enabledScenes = EditorBuildSettings.scenes;
            buildSceneReady = Array.Exists(enabledScenes, scene => scene.enabled && scene.path == BootScenePath) &&
                              Array.Exists(enabledScenes, scene => scene.enabled && scene.path == Stage1ScenePath);
            proofSceneExcluded = !Array.Exists(enabledScenes, scene => scene.enabled && scene.path.Contains("/Proof/", StringComparison.Ordinal));

            uiMovementCollisionGuardReady = SourceContains("EventSystem.current.IsPointerOverGameObject") &&
                                            SourceContains("IsPointerOverUi") &&
                                            SourceContains("dragging = false");
            virtualStickLowerLeftOnly = SourceContains("Screen.width * 0.52f") &&
                                        SourceContains("Screen.height * 0.46f") &&
                                        SourceContains("activeTouchId") &&
                                        SourceContains("touch.press.wasPressedThisFrame");
            SavePreflight();
            report.Add($"preflight: bootSceneOpen={bootSceneOpenReady}, stage1SceneOpen={stage1SceneOpenReady}, buildSceneReady={buildSceneReady}, proofSceneExcluded={proofSceneExcluded}");
        }

        private static void Update()
        {
            if (EditorApplication.timeSinceStartup - stepStartedAt > 18.0)
            {
                Fail("Timed out at " + step);
                return;
            }

            if (!EditorApplication.isPlaying)
            {
                return;
            }

            switch (step)
            {
                case SmokeStep.WaitForStage1:
                    if (SceneManager.GetActiveScene().name == "Stage1" &&
                        FindController() != null &&
                        FindPlayer() != null &&
                        GameObject.Find("U43StageSelectRuntimeOverlay") != null)
                    {
                        Next(SmokeStep.CheckStageSelectPauseStart);
                    }
                    break;
                case SmokeStep.CheckStageSelectPauseStart:
                    CheckRequiredRuntimeObjects();
                    pausedSnapshot = new Snapshot(FindController());
                    Next(SmokeStep.CheckStageSelectPauseStable);
                    break;
                case SmokeStep.CheckStageSelectPauseStable:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.55)
                    {
                        return;
                    }

                    stageSelectPauseGateReady = CheckPausedState("StageSelect initial", pausedSnapshot, requireStageSelect: true, requireResult: false);
                    Capture("01-stage-select-paused.png");
                    PressButton("Stage1へ");
                    Next(SmokeStep.PressStageStart);
                    break;
                case SmokeStep.PressStageStart:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.35)
                    {
                        return;
                    }

                    CheckBattleStarted();
                    Capture("02-battle-started.png");
                    Next(SmokeStep.CheckBattleStarted);
                    break;
                case SmokeStep.CheckBattleStarted:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.45)
                    {
                        return;
                    }

                    TriggerLevelUp();
                    Next(SmokeStep.TriggerLevelUp);
                    break;
                case SmokeStep.TriggerLevelUp:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.35)
                    {
                        return;
                    }

                    Capture("05-levelup-overlay-if-possible.png");
                    ConfirmFirstLevelUpChoice();
                    Next(SmokeStep.CloseLevelUp);
                    break;
                case SmokeStep.CloseLevelUp:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.3)
                    {
                        return;
                    }

                    PressButton("結果");
                    Next(SmokeStep.OpenResult);
                    break;
                case SmokeStep.OpenResult:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.25)
                    {
                        return;
                    }

                    pausedSnapshot = new Snapshot(FindController());
                    Next(SmokeStep.CheckResultPauseStart);
                    break;
                case SmokeStep.CheckResultPauseStart:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.55)
                    {
                        return;
                    }

                    resultPauseGateReady = CheckPausedState("Result", pausedSnapshot, requireStageSelect: false, requireResult: true);
                    retryRouteReady = FindButton("Retry") != null;
                    Capture("03-result-paused.png");
                    PressButton("StageSelect");
                    Next(SmokeStep.ReturnStageSelect);
                    break;
                case SmokeStep.ReturnStageSelect:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.3)
                    {
                        return;
                    }

                    stageSelectReturnPauseReady = CheckPausedState("StageSelect return", new Snapshot(FindController()), requireStageSelect: true, requireResult: false);
                    Capture("04-stage-select-return.png");
                    Next(SmokeStep.Done);
                    break;
                case SmokeStep.Done:
                    Finish();
                    break;
            }
        }

        private static void CheckRequiredRuntimeObjects()
        {
            stage1RuntimeBootstrapReady =
                GameObject.Find("MainCamera")?.GetComponent<AudioListener>() != null &&
                UnityEngine.Object.FindAnyObjectByType<EventSystem>() != null &&
                UnityEngine.Object.FindAnyObjectByType<InputSystemUIInputModule>() != null &&
                GameObject.Find("U43StageSelectRuntimeOverlay") != null &&
                FindController() != null &&
                FindPlayer() != null &&
                UnityEngine.Object.FindAnyObjectByType<U43RuntimeFeedbackBridge>() != null;
            report.Add("runtime objects: " + stage1RuntimeBootstrapReady);
        }

        private static bool CheckPausedState(string label, Snapshot before, bool requireStageSelect, bool requireResult)
        {
            var controller = FindController();
            var player = FindPlayer();
            var after = new Snapshot(controller);
            var stageSelect = GameObject.Find("U43StageSelectRuntimeOverlay");
            var result = GameObject.Find("U43ResultRuntimeOverlay");
            var overlayOk = (!requireStageSelect || (stageSelect != null && stageSelect.activeInHierarchy)) &&
                            (!requireResult || (result != null && result.activeInHierarchy)) &&
                            (requireResult || result == null || !result.activeInHierarchy);
            var frozen = Mathf.Approximately(before.ElapsedSeconds, after.ElapsedSeconds) &&
                         before.SpawnedEnemyCount == after.SpawnedEnemyCount &&
                         before.FiredProjectileCount == after.FiredProjectileCount &&
                         before.DroppedExpCount == after.DroppedExpCount &&
                         before.CollectedExpCount == after.CollectedExpCount &&
                         before.ActiveEnemyCount == after.ActiveEnemyCount &&
                         before.ActiveProjectileCount == after.ActiveProjectileCount &&
                         before.ActiveExpCount == after.ActiveExpCount;
            var movementBlocked = player != null && player.RuntimeInputBlocked && player.CurrentVelocity.sqrMagnitude <= 0.0001f;
            var ok = controller != null && controller.IsRuntimePaused && movementBlocked && frozen && overlayOk;
            report.Add($"{label}: paused={controller?.IsRuntimePaused}, movementBlocked={movementBlocked}, frozen={frozen}, overlayOk={overlayOk}");
            return ok;
        }

        private static void CheckBattleStarted()
        {
            var controller = FindController();
            var player = FindPlayer();
            var stageSelect = GameObject.Find("U43StageSelectRuntimeOverlay");
            var bridge = UnityEngine.Object.FindAnyObjectByType<U43RuntimeFeedbackBridge>();
            var audioBefore = bridge != null ? bridge.AudioPlayCount : 0;
            var hapticBefore = bridge != null ? bridge.HapticRequestCount : 0;
            bridge?.PlayPickup();
            bridge?.PlayEnemyHit();
            bridge?.PlayLevelUp();
            bridge?.PlayResult();

            battleStartResumeReady = controller != null &&
                                     !controller.IsRuntimePaused &&
                                     player != null &&
                                     !player.RuntimeInputBlocked &&
                                     (stageSelect == null || !stageSelect.activeInHierarchy);
            audioHookEditorReady = bridge != null &&
                                   bridge.AudioRuntimeHookReady &&
                                   !bridge.UsesRuntimeHookToneOnly &&
                                   bridge.AudioMixerAssetConnected &&
                                   !bridge.AudioMixerReady &&
                                   !bridge.AudioLatencyMeasured &&
                                   bridge.AudioPlayCount > audioBefore;
            hapticHookEditorReady = bridge != null &&
                                    bridge.HapticRuntimeHookReady &&
                                    !bridge.HapticMeasured &&
                                    bridge.HapticRequestCount > hapticBefore;
            report.Add($"battle started: resume={battleStartResumeReady}, audioHook={audioHookEditorReady}, hapticHook={hapticHookEditorReady}");
        }

        private static void TriggerLevelUp()
        {
            UnityEngine.Object.FindAnyObjectByType<U4LevelUpDemoController>()?.TriggerLevelUp();
        }

        private static void ConfirmFirstLevelUpChoice()
        {
            var firstCard = UnityEngine.Object.FindAnyObjectByType<PaperCard>(FindObjectsInactive.Exclude);
            if (firstCard == null)
            {
                report.Add("levelup card missing");
                return;
            }

            firstCard.OnPointerClick(null);
            firstCard.OnPointerClick(null);
        }

        private static void PressButton(string label)
        {
            var button = FindButton(label);
            if (button == null)
            {
                report.Add("button missing: " + label);
                return;
            }

            button.Press();
        }

        private static PaperButton FindButton(string label)
        {
            foreach (var button in UnityEngine.Object.FindObjectsByType<PaperButton>(FindObjectsInactive.Include))
            {
                var text = button.GetComponentInChildren<TextMeshProUGUI>(true);
                if (text != null && text.text == label)
                {
                    return button;
                }
            }

            return null;
        }

        private static U2BattleController FindController() => UnityEngine.Object.FindAnyObjectByType<U2BattleController>();

        private static PlayerController FindPlayer()
        {
            var player = GameObject.Find("YuiRuntimeDotCharacter");
            return player != null ? player.GetComponent<PlayerController>() : UnityEngine.Object.FindAnyObjectByType<PlayerController>();
        }

        private static void Capture(string fileName)
        {
            var path = AbsoluteRepoPath(Path.Combine(ScreenshotDirectory, fileName));
            var camera = Camera.main != null ? Camera.main : UnityEngine.Object.FindAnyObjectByType<Camera>();
            if (camera == null)
            {
                report.Add("capture skipped, no camera: " + fileName);
                return;
            }

            var renderTexture = new RenderTexture(390, 844, 24, RenderTextureFormat.ARGB32);
            var texture = new Texture2D(390, 844, TextureFormat.RGBA32, false);
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
                camera.aspect = 390f / 844f;
                camera.Render();
                RenderTexture.active = renderTexture;
                texture.ReadPixels(new Rect(0, 0, 390, 844), 0, 0);
                texture.Apply();
                File.WriteAllBytes(path, texture.EncodeToPNG());
                report.Add("captured: " + fileName);
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

        private static void Next(SmokeStep nextStep)
        {
            step = nextStep;
            stepStartedAt = EditorApplication.timeSinceStartup;
        }

        private static void Finish()
        {
            editorScreenshotsReady =
                File.Exists(AbsoluteRepoPath(Path.Combine(ScreenshotDirectory, "01-stage-select-paused.png"))) &&
                File.Exists(AbsoluteRepoPath(Path.Combine(ScreenshotDirectory, "02-battle-started.png"))) &&
                File.Exists(AbsoluteRepoPath(Path.Combine(ScreenshotDirectory, "03-result-paused.png"))) &&
                File.Exists(AbsoluteRepoPath(Path.Combine(ScreenshotDirectory, "04-stage-select-return.png"))) &&
                File.Exists(AbsoluteRepoPath(Path.Combine(ScreenshotDirectory, "05-levelup-overlay-if-possible.png")));
            WriteEvidence();
            File.WriteAllText(ReportPath, string.Join(Environment.NewLine, report));
            Cleanup();
            EditorApplication.Exit(0);
        }

        private static void Fail(string message)
        {
            report.Add("FAIL: " + message);
            WriteEvidence();
            File.WriteAllText(ReportPath, string.Join(Environment.NewLine, report));
            Cleanup();
            Debug.LogError(message);
            EditorApplication.Exit(1);
        }

        private static void Cleanup()
        {
            EditorApplication.update -= Update;
            if (File.Exists(StatePath))
            {
                File.Delete(StatePath);
            }

            if (File.Exists(PreflightPath))
            {
                File.Delete(PreflightPath);
            }

            if (EditorApplication.isPlaying)
            {
                EditorApplication.ExitPlaymode();
            }
        }

        private static void WriteEvidence()
        {
            RestorePreflight();
            var text =
                "{\n" +
                "  \"generatedAt\": \"2026-07-06\",\n" +
                "  \"evidenceKind\": \"Editor automated pre-device smoke\",\n" +
                "  \"actualDeviceSmokeResultProvided\": false,\n" +
                "  \"actualDeviceSmokeResult\": \"NOT_PROVIDED\",\n" +
                "  \"humanCheckNeeded\": true,\n" +
                $"  \"unityBatchmodeCompileReady\": {JsonBool(unityBatchmodeCompileReady)},\n" +
                $"  \"bootSceneOpenReady\": {JsonBool(bootSceneOpenReady)},\n" +
                $"  \"stage1SceneOpenReady\": {JsonBool(stage1SceneOpenReady)},\n" +
                $"  \"buildSceneReady\": {JsonBool(buildSceneReady)},\n" +
                $"  \"proofSceneExcluded\": {JsonBool(proofSceneExcluded)},\n" +
                $"  \"stage1RuntimeBootstrapReady\": {JsonBool(stage1RuntimeBootstrapReady)},\n" +
                $"  \"stageSelectPauseGateReady\": {JsonBool(stageSelectPauseGateReady)},\n" +
                $"  \"battleStartResumeReady\": {JsonBool(battleStartResumeReady)},\n" +
                $"  \"resultPauseGateReady\": {JsonBool(resultPauseGateReady)},\n" +
                $"  \"stageSelectReturnPauseReady\": {JsonBool(stageSelectReturnPauseReady)},\n" +
                $"  \"retryRouteReady\": {JsonBool(retryRouteReady)},\n" +
                $"  \"uiMovementCollisionGuardReady\": {JsonBool(uiMovementCollisionGuardReady)},\n" +
                $"  \"virtualStickLowerLeftOnly\": {JsonBool(virtualStickLowerLeftOnly)},\n" +
                $"  \"audioHookEditorReady\": {JsonBool(audioHookEditorReady)},\n" +
                $"  \"hapticHookEditorReady\": {JsonBool(hapticHookEditorReady)},\n" +
                $"  \"editorScreenshotsReady\": {JsonBool(editorScreenshotsReady)},\n" +
                $"  \"iosBuildGenerationReady\": {JsonBool(iosBuildGenerationReady)},\n" +
                "  \"iosBuildGenerationNote\": \"NOT_RUN: external output folder is outside the allowed touch scope for this request\",\n" +
                "  \"deviceScreenshot\": \"DEVICE_SCREENSHOT_NOT_PROVIDED\",\n" +
                "  \"devicePlayableReady\": false,\n" +
                "  \"mobileMetricsReady\": false,\n" +
                "  \"audioMixerReady\": false,\n" +
                "  \"audioLatencyMeasured\": false,\n" +
                "  \"hapticMeasured\": false,\n" +
                "  \"rcReady\": false,\n" +
                "  \"productionApproved\": false\n" +
                "}\n";
            File.WriteAllText(AbsoluteRepoPath(EvidencePath), text);
        }

        private static bool SourceContains(string value)
        {
            var projectRoot = Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
            var playerPath = Path.Combine(projectRoot, "Assets/_Project/Scripts/Player/PlayerController.cs");
            return File.Exists(playerPath) && File.ReadAllText(playerPath).Contains(value, StringComparison.Ordinal);
        }

        private static string JsonBool(bool value) => value ? "true" : "false";

        private static void SavePreflight()
        {
            File.WriteAllText(PreflightPath,
                $"unityBatchmodeCompileReady={unityBatchmodeCompileReady}\n" +
                $"bootSceneOpenReady={bootSceneOpenReady}\n" +
                $"stage1SceneOpenReady={stage1SceneOpenReady}\n" +
                $"buildSceneReady={buildSceneReady}\n" +
                $"proofSceneExcluded={proofSceneExcluded}\n" +
                $"uiMovementCollisionGuardReady={uiMovementCollisionGuardReady}\n" +
                $"virtualStickLowerLeftOnly={virtualStickLowerLeftOnly}\n");
        }

        private static void RestorePreflight()
        {
            if (!File.Exists(PreflightPath))
            {
                return;
            }

            foreach (var line in File.ReadAllLines(PreflightPath))
            {
                var parts = line.Split('=');
                if (parts.Length != 2)
                {
                    continue;
                }

                var value = parts[1] == "True" || parts[1] == "true";
                switch (parts[0])
                {
                    case nameof(unityBatchmodeCompileReady):
                        unityBatchmodeCompileReady = value;
                        break;
                    case nameof(bootSceneOpenReady):
                        bootSceneOpenReady = value;
                        break;
                    case nameof(stage1SceneOpenReady):
                        stage1SceneOpenReady = value;
                        break;
                    case nameof(buildSceneReady):
                        buildSceneReady = value;
                        break;
                    case nameof(proofSceneExcluded):
                        proofSceneExcluded = value;
                        break;
                    case nameof(uiMovementCollisionGuardReady):
                        uiMovementCollisionGuardReady = value;
                        break;
                    case nameof(virtualStickLowerLeftOnly):
                        virtualStickLowerLeftOnly = value;
                        break;
                }
            }
        }

        private static float ReadPrivateFloat(object target, string fieldName)
        {
            if (target == null)
            {
                return -1f;
            }

            var field = target.GetType().GetField(fieldName, BindingFlags.Instance | BindingFlags.NonPublic);
            return field != null ? (float)field.GetValue(target) : -1f;
        }

        private static string AbsoluteRepoPath(string relativeToUnityProject)
        {
            var projectRoot = Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
            return Path.GetFullPath(Path.Combine(projectRoot, relativeToUnityProject));
        }
    }
}
