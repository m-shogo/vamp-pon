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

namespace VampPon.UnitySpike.Editor
{
    public static class U2BattleFeelVerification
    {
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string ReportPath = "Logs/u2_battle_feel_verification_report.txt";
        private const string StatePath = "Logs/u2_battle_feel_verification_state.txt";
        private static readonly Vector2Int[] Profiles =
        {
            new(390, 844),
            new(360, 800),
            new(430, 932),
        };

        private static double startedAt;
        private static double movementStartedAt;
        private static bool movementStarted;
        private static bool movementCleared;
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
                Directory.CreateDirectory("Logs");
                File.WriteAllText(StatePath, "u2_verifying");
                startedAt = EditorApplication.timeSinceStartup;
                movementStartedAt = 0.0;
                movementStarted = false;
                movementCleared = false;
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
            if (EditorApplication.timeSinceStartup - startedAt > 16.0)
            {
                Fail("Timed out.");
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

            var player = playerObject.GetComponent<PlayerController>();
            if (!movementStarted)
            {
                movementStarted = true;
                movementStartedAt = EditorApplication.timeSinceStartup;
                movementStartPosition = playerObject.transform.position;
                player.SetVerificationMoveInput(new Vector2(1f, 0.25f));
                controller.SpawnEnemyForVerification(playerObject.transform.position + new Vector3(1.45f, 0.25f, 0f));
                return;
            }

            if (!movementCleared && EditorApplication.timeSinceStartup - movementStartedAt > 0.75)
            {
                movementCleared = true;
                player.ClearVerificationMoveInput();
            }

            if (EditorApplication.timeSinceStartup - startedAt < 7.5)
            {
                return;
            }

            Finish(playerObject, controller, movementStartPosition);
        }

        private static void Finish(GameObject playerObject, U2BattleController controller, Vector3 startPosition)
        {
            var movementDistance = Vector2.Distance(startPosition, playerObject.transform.position);
            var safeAreaCanvas = GameObject.Find("SafeAreaCanvas");
            var background = GameObject.Find("DarkPaperNightBackground");
            var profileReport = string.Join(Environment.NewLine, Profiles.Select(profile => CheckProfile(profile, safeAreaCanvas, background)));
            var poolReport =
                $"Pools: enemies={controller.ActiveEnemyCount}, projectiles={controller.ActiveProjectileCount}, exp={controller.ActiveExpCount}, vfx={controller.ActiveVfxCount}";
            var battleReport =
                $"Battle: spawned={controller.SpawnedEnemyCount}, fired={controller.FiredProjectileCount}, defeated={controller.DefeatedEnemyCount}, droppedExp={controller.DroppedExpCount}, collectedExp={controller.CollectedExpCount}";
            var movementReport = $"Movement: distance={movementDistance:0.000}, moved={movementDistance > 0.25f}";
            var result = string.Join(Environment.NewLine, movementReport, battleReport, poolReport, profileReport);

            File.WriteAllText(ReportPath, result);
            CleanupAndExit(0);
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

        private static void Fail(string message)
        {
            File.WriteAllText(ReportPath, message);
            CleanupAndExit(1);
        }

        private static void CleanupAndExit(int exitCode)
        {
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
