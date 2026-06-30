using System;
using System.IO;
using System.Linq;
using TMPro;
using UnityEditor;
using UnityEditor.PackageManager;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Editor
{
    public static class U1EditorVerification
    {
        private const string UrpAssetPath = "Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset";
        private const string Renderer2DPath = "Assets/_Project/Settings/U1Renderer2DData.asset";
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string Stage1ScenePath = "Assets/_Project/Scenes/Stage1/Stage1.unity";
        private const string ReportPath = "Logs/u1_1_editor_verification_report.txt";
        private const string StatePath = "Logs/u1_1_editor_verification_state.txt";
        private const string PrePlayPath = "Logs/u1_1_editor_verification_preplay.txt";
        private static readonly Vector2Int[] Profiles =
        {
            new(390, 844),
            new(375, 812),
            new(393, 852),
            new(430, 932),
            new(360, 800),
            new(412, 915),
        };
        private static double playStartTime;
        private static string prePlayReport;

        [InitializeOnLoadMethod]
        private static void ResumeIfNeeded()
        {
            if (File.Exists(StatePath))
            {
                playStartTime = EditorApplication.timeSinceStartup;
                EditorApplication.update -= PlayUpdate;
                EditorApplication.update += PlayUpdate;
            }
        }

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var packageStatus = CheckPackages();
                var urpStatus = EnsureUrp2D();
                var sceneStatus = OpenAndSaveScenes();
                prePlayReport = string.Join(Environment.NewLine, packageStatus, urpStatus, sceneStatus);
                File.WriteAllText(PrePlayPath, prePlayReport);
                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh();
                StartPlayVerification();
            }
            catch (Exception ex)
            {
                Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static string CheckPackages()
        {
            var request = Client.List(true, true);
            while (!request.IsCompleted)
            {
                System.Threading.Thread.Sleep(100);
            }

            if (request.Status == StatusCode.Failure)
            {
                throw new InvalidOperationException($"Package Manager failed: {request.Error.message}");
            }

            var packages = request.Result
                .Where(package => package.name is "com.unity.render-pipelines.universal" or "com.unity.inputsystem" or "com.unity.ugui")
                .Select(package => $"{package.name}@{package.version}");
            return "Packages: " + string.Join(", ", packages);
        }

        private static string EnsureUrp2D()
        {
            Directory.CreateDirectory("Assets/_Project/Settings");

            var rendererData = AssetDatabase.LoadAssetAtPath<Renderer2DData>(Renderer2DPath);
            if (rendererData == null)
            {
                rendererData = ScriptableObject.CreateInstance<Renderer2DData>();
                AssetDatabase.CreateAsset(rendererData, Renderer2DPath);
                ResourceReloader.ReloadAllNullIn(rendererData, "Packages/com.unity.render-pipelines.universal");
            }

            var pipelineAsset = AssetDatabase.LoadAssetAtPath<UniversalRenderPipelineAsset>(UrpAssetPath);
            if (pipelineAsset == null)
            {
                pipelineAsset = UniversalRenderPipelineAsset.Create(rendererData);
                AssetDatabase.CreateAsset(pipelineAsset, UrpAssetPath);
            }

            var serializedPipeline = new SerializedObject(pipelineAsset);
            var rendererList = serializedPipeline.FindProperty("m_RendererDataList");
            rendererList.arraySize = 1;
            rendererList.GetArrayElementAtIndex(0).objectReferenceValue = rendererData;
            serializedPipeline.FindProperty("m_DefaultRendererIndex").intValue = 0;
            serializedPipeline.ApplyModifiedPropertiesWithoutUndo();

            GraphicsSettings.defaultRenderPipeline = pipelineAsset;
            QualitySettings.renderPipeline = pipelineAsset;
            EditorUtility.SetDirty(pipelineAsset);
            EditorUtility.SetDirty(rendererData);

            return $"URP: {pipelineAsset.name}, Renderer: {rendererData.GetType().Name}";
        }

        private static string OpenAndSaveScenes()
        {
            var boot = EditorSceneManager.OpenScene(BootScenePath, OpenSceneMode.Single);
            EditorSceneManager.MarkSceneDirty(boot);
            EditorSceneManager.SaveScene(boot);

            var stage = EditorSceneManager.OpenScene(Stage1ScenePath, OpenSceneMode.Single);
            EditorSceneManager.MarkSceneDirty(stage);
            EditorSceneManager.SaveScene(stage);

            return $"Scenes: saved {BootScenePath}, {Stage1ScenePath}";
        }

        private static void StartPlayVerification()
        {
            EditorSceneManager.OpenScene(BootScenePath, OpenSceneMode.Single);
            playStartTime = EditorApplication.timeSinceStartup;
            File.WriteAllText(StatePath, "enter_play");
            EditorApplication.update += PlayUpdate;
            EditorApplication.EnterPlaymode();
        }

        private static void PlayUpdate()
        {
            if (EditorApplication.timeSinceStartup - playStartTime > 10.0)
            {
                EditorApplication.update -= PlayUpdate;
                File.WriteAllText(ReportPath, LoadPrePlayReport() + Environment.NewLine + "Play: timeout");
                File.Delete(StatePath);
                Debug.LogError("U1.1 play verification timed out.");
                EditorApplication.Exit(1);
                return;
            }

            if (!EditorApplication.isPlaying || EditorApplication.timeSinceStartup - playStartTime < 2.2)
            {
                return;
            }

            EditorApplication.update -= PlayUpdate;
            var activeScene = SceneManager.GetActiveScene().name;
            var safeAreaCanvas = GameObject.Find("SafeAreaCanvas");
            var yui = GameObject.Find("YuiPlaceholder");
            var ombu = GameObject.Find("OmbuPlaceholder");
            var lantern = GameObject.Find("WarmLanternGlowPlaceholder");
            var exp = GameObject.Find("ExpFragmentPickupCurvePlaceholder");
            var background = GameObject.Find("DarkPaperNightBackground");

            var resolutionReport = string.Join(Environment.NewLine, Profiles.Select(profile => CheckProfile(profile, safeAreaCanvas, background)));
            var bootToStage1 = activeScene == "Stage1";
            var result =
                $"Play: activeScene={activeScene}, bootToStage1={bootToStage1}" + Environment.NewLine +
                $"Objects: SafeAreaCanvas={safeAreaCanvas != null}, Yui={yui != null}, Ombu={ombu != null}, Lantern={lantern != null}, Exp={exp != null}, Background={background != null}" + Environment.NewLine +
                resolutionReport;

            File.WriteAllText(ReportPath, LoadPrePlayReport() + Environment.NewLine + result);
            File.Delete(StatePath);
            File.Delete(PrePlayPath);
            Debug.Log($"U1.1 verification complete. Report: {ReportPath}");
            EditorApplication.ExitPlaymode();
            EditorApplication.Exit(0);
        }

        private static string LoadPrePlayReport()
        {
            if (!string.IsNullOrEmpty(prePlayReport))
            {
                return prePlayReport;
            }

            return File.Exists(PrePlayPath) ? File.ReadAllText(PrePlayPath) : "PrePlay: missing";
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

            var canvasOk = canvasScaler != null &&
                           canvasScaler.uiScaleMode == CanvasScaler.ScaleMode.ScaleWithScreenSize &&
                           canvasScaler.referenceResolution == new Vector2(390f, 844f);
            var topOk = topHud != null && topHud.sizeDelta.x <= profile.x && topHud.sizeDelta.y > 0f;
            var bottomOk = bottomHud != null && bottomHud.sizeDelta.x <= profile.x && bottomHud.sizeDelta.y > 0f;
            var aspect = profile.x / (float)profile.y;
            var cameraHeight = 10.8f;
            var cameraWidth = cameraHeight * aspect;
            var backgroundOk = backgroundRenderer != null &&
                               backgroundRenderer.size.x >= cameraWidth &&
                               backgroundRenderer.size.y >= cameraHeight;

            return $"{profile.x}x{profile.y}: canvas={canvasOk}, safeHud={topOk && bottomOk}, backgroundCover={backgroundOk}";
        }
    }
}
