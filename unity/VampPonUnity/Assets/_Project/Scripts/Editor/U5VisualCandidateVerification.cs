using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U4;
using VampPon.UnitySpike.U5;

namespace VampPon.UnitySpike.Editor
{
    public static class U5VisualCandidateVerification
    {
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string ReportPath = "Logs/u5_visual_candidate_verification_report.txt";
        private const string StatePath = "Logs/u5_visual_candidate_verification_state.txt";
        private static readonly Vector2Int[] Profiles = { new(390, 844), new(360, 800), new(430, 932) };
        private static double startedAt;
        private static bool movementStarted;
        private static bool levelUpTriggered;
        private static Vector3 movementStartPosition;

        [InitializeOnLoadMethod]
        private static void ResumeIfNeeded()
        {
            if (File.Exists(StatePath))
            {
                startedAt = EditorApplication.timeSinceStartup;
                EditorApplication.update -= PlayUpdate;
                EditorApplication.update += PlayUpdate;
            }
        }

        public static void Run()
        {
            try
            {
                U5VisualCandidateImportSetup.Run();
                Directory.CreateDirectory("Logs");
                File.WriteAllText(StatePath, "u5_verifying");
                startedAt = EditorApplication.timeSinceStartup;
                movementStarted = false;
                levelUpTriggered = false;
                EditorSceneManager.OpenScene(BootScenePath, OpenSceneMode.Single);
                EditorApplication.update -= PlayUpdate;
                EditorApplication.update += PlayUpdate;
                EditorApplication.EnterPlaymode();
            }
            catch (Exception ex)
            {
                Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static void PlayUpdate()
        {
            if (EditorApplication.timeSinceStartup - startedAt > 22.0)
            {
                Finish("Timed out.", 1);
                return;
            }

            if (!EditorApplication.isPlaying || SceneManager.GetActiveScene().name != "Stage1")
            {
                return;
            }

            var playerObject = GameObject.Find("YuiPlaceholder");
            var controller = UnityEngine.Object.FindAnyObjectByType<U2BattleController>();
            if (playerObject == null || controller == null)
            {
                return;
            }

            var elapsed = EditorApplication.timeSinceStartup - startedAt;
            var player = playerObject.GetComponent<PlayerController>();
            if (!movementStarted)
            {
                movementStarted = true;
                movementStartPosition = playerObject.transform.position;
                player.SetVerificationMoveInput(new Vector2(0.85f, 0.15f));
                controller.SpawnEnemyForVerification(playerObject.transform.position + new Vector3(1.1f, 0.2f, 0f));
                controller.SpawnEnemyForVerification(playerObject.transform.position + new Vector3(-1.15f, 0.45f, 0f));
                return;
            }

            if (elapsed > 3.2)
            {
                player.ClearVerificationMoveInput();
            }

            if (!levelUpTriggered && elapsed > 7.2)
            {
                var demo = UnityEngine.Object.FindAnyObjectByType<U4LevelUpDemoController>();
                demo?.TriggerLevelUp();
                levelUpTriggered = true;
            }

            if (elapsed < 9.2)
            {
                return;
            }

            var report = BuildReport(playerObject, controller, movementStartPosition);
            U4TimeScaleGuard.ForceRestore();
            Finish(report, 0);
        }

        private static string BuildReport(GameObject playerObject, U2BattleController controller, Vector3 startPosition)
        {
            var yuiRenderer = playerObject.GetComponent<SpriteRenderer>();
            var activeEnemySprite = UnityEngine.Object.FindObjectsByType<SpriteRenderer>(FindObjectsInactive.Exclude)
                .FirstOrDefault(renderer => renderer.gameObject.name.StartsWith("OmbuPooled_", StringComparison.Ordinal));
            var movementDistance = Vector2.Distance(startPosition, playerObject.transform.position);
            var safeAreaCanvas = GameObject.Find("SafeAreaCanvas");
            var background = GameObject.Find("DarkPaperNightBackground");
            var levelUp = UnityEngine.Object.FindAnyObjectByType<U4LevelUpDemoController>();
            var profileReport = string.Join(Environment.NewLine, Profiles.Select(profile => CheckProfile(profile, safeAreaCanvas, background)));
            return string.Join(
                Environment.NewLine,
                "=== U5 Visual Candidate Verification ===",
                $"Unity: {Application.unityVersion}",
                $"RenderPipelineAsset: {(UnityEngine.Rendering.GraphicsSettings.defaultRenderPipeline != null ? UnityEngine.Rendering.GraphicsSettings.defaultRenderPipeline.name : "MISSING")}",
                $"ProjectVersion: {(File.ReadAllText("ProjectSettings/ProjectVersion.txt").Contains("6000.5.1f1") ? "OK" : "MISMATCH")}",
                $"AssetsLoaded: yui={U5VisualAssetLibrary.LoadBattleSprite("u5-yui-battle-candidate") != null}, ombu={U5VisualAssetLibrary.LoadBattleSprite("u5-ombu-battle-candidate") != null}, exp={U5VisualAssetLibrary.LoadVfxSprite("u5-exp-fragment") != null}, spark={U5VisualAssetLibrary.LoadVfxSprite("u5-lantern-spark") != null}, ink={U5VisualAssetLibrary.LoadVfxSprite("u5-ink-burst") != null}, trail={U5VisualAssetLibrary.LoadVfxSprite("u5-collect-trail") != null}, paper={U5VisualAssetLibrary.LoadUiSprite("u5-paper-panel") != null}, iconFrame={U5VisualAssetLibrary.LoadUiSprite("u5-icon-frame") != null}",
                $"RuntimeSprites: yui={yuiRenderer?.sprite?.name}, firstOmbu={activeEnemySprite?.sprite?.name}",
                $"Movement: distance={movementDistance:0.000}, moved={movementDistance > 0.25f}",
                $"Battle: spawned={controller.SpawnedEnemyCount}, fired={controller.FiredProjectileCount}, defeated={controller.DefeatedEnemyCount}, droppedExp={controller.DroppedExpCount}, collectedExp={controller.CollectedExpCount}",
                $"Feel: hitStop={controller.HitStopCount}, cameraImpulse={controller.CameraImpulseCount}, lanternPulse={controller.LanternPulseCount}, deathBurst={controller.DeathBurstCount}, collectTrail={controller.CollectTrailCount}",
                $"VFX: active={controller.ActiveVfxCount}, peak={controller.PeakActiveVfxCount}, played={controller.PlayedVfxCount}, dropped={controller.DroppedVfxCount}, maxActiveCap={controller.MaxActiveVfxCap}",
                $"LevelUpOverlay: activeBeforeRestore={levelUp != null && levelUp.IsOverlayActive}",
                $"TimeScale: beforeRestore={Time.timeScale:0.###}, paused={U4TimeScaleGuard.IsOverlayPaused}",
                profileReport);
        }

        private static string CheckProfile(Vector2Int profile, GameObject safeAreaCanvas, GameObject background)
        {
            if (safeAreaCanvas == null || background == null)
            {
                return $"{profile.x}x{profile.y}: missing roots";
            }

            var canvasScaler = safeAreaCanvas.GetComponent<CanvasScaler>();
            var hudRoot = safeAreaCanvas.transform.Find("HudRoot") as RectTransform;
            var topHud = hudRoot?.Find("TopHudPlaceholder") as RectTransform;
            var bottomHud = hudRoot?.Find("BottomInventoryPlaceholder") as RectTransform;
            var backgroundRenderer = background.GetComponent<SpriteRenderer>();
            var aspect = profile.x / (float)profile.y;
            var cameraHeight = 10.8f;
            var cameraWidth = cameraHeight * aspect;
            var canvasOk = canvasScaler != null &&
                           canvasScaler.uiScaleMode == CanvasScaler.ScaleMode.ScaleWithScreenSize &&
                           canvasScaler.referenceResolution == new Vector2(390f, 844f);
            var topOk = topHud != null && topHud.sizeDelta.x <= profile.x && topHud.sizeDelta.y > 0f;
            var bottomOk = bottomHud != null && bottomHud.sizeDelta.x <= profile.x && bottomHud.sizeDelta.y > 0f;
            var backgroundOk = backgroundRenderer != null &&
                               backgroundRenderer.size.x >= cameraWidth &&
                               backgroundRenderer.size.y >= cameraHeight;
            return $"{profile.x}x{profile.y}: canvas={canvasOk}, safeHud={topOk && bottomOk}, backgroundCover={backgroundOk}";
        }

        private static void Finish(string report, int exitCode)
        {
            File.WriteAllText(ReportPath, report);
            EditorApplication.update -= PlayUpdate;
            if (File.Exists(StatePath))
            {
                File.Delete(StatePath);
            }

            EditorApplication.ExitPlaymode();
            EditorApplication.Exit(exitCode);
        }
    }
}
