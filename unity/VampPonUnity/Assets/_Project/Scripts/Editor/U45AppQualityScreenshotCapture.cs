using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using VampPon.UnitySpike.U4;

namespace VampPon.UnitySpike.Editor
{
    public static class U45AppQualityScreenshotCapture
    {
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string StatePath = "Logs/u45_app_quality_screenshot_state.txt";
        private const string ScreenshotDirectory = "../../docs/design-targets/generated/unity-u45/screenshots";
        private static readonly List<string> report = new();
        private static double stepStartedAt;
        private static CaptureStep step;

        private enum CaptureStep
        {
            WaitForStage1,
            CaptureStageSelect,
            StartBattle,
            CaptureBattleHud,
            ShowCommonLevelUp,
            CaptureCommonLevelUp,
            ShowRareLevelUp,
            CaptureRareLevelUp,
            ShowEvolutionLevelUp,
            CaptureEvolutionLevelUp,
            ShowTapTargets,
            CaptureTapTargets,
            Done,
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
            if (!File.Exists(StatePath))
            {
                return;
            }

            step = CaptureStep.WaitForStage1;
            stepStartedAt = EditorApplication.timeSinceStartup;
            EditorApplication.update -= Update;
            EditorApplication.update += Update;
        }

        [MenuItem("VampPon/U45/Capture App Quality Screenshots")]
        public static void Run()
        {
            try
            {
                Directory.CreateDirectory(AbsoluteRepoPath(ScreenshotDirectory));
                report.Clear();
                step = CaptureStep.WaitForStage1;
                stepStartedAt = EditorApplication.timeSinceStartup;
                Directory.CreateDirectory("Logs");
                File.WriteAllText(StatePath, "u45_app_quality_screenshot");
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
            if (EditorApplication.timeSinceStartup - stepStartedAt > 20.0)
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
                case CaptureStep.WaitForStage1:
                    if (SceneManager.GetActiveScene().name == "Stage1" && GameObject.Find("U43StageSelectRuntimeOverlay") != null)
                    {
                        Next(CaptureStep.CaptureStageSelect);
                    }
                    break;
                case CaptureStep.CaptureStageSelect:
                    Capture("01-stage-select-app-quality.png");
                    PressButton("Stage1へ");
                    Next(CaptureStep.StartBattle);
                    break;
                case CaptureStep.StartBattle:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.35)
                    {
                        return;
                    }

                    Capture("02-battle-hud-app-quality.png");
                    Next(CaptureStep.ShowCommonLevelUp);
                    break;
                case CaptureStep.ShowCommonLevelUp:
                    ShowLevelUp(CommonChoices());
                    Next(CaptureStep.CaptureCommonLevelUp);
                    break;
                case CaptureStep.CaptureCommonLevelUp:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.2)
                    {
                        return;
                    }

                    Capture("03-levelup-common-card.png");
                    HideLevelUp();
                    Next(CaptureStep.ShowRareLevelUp);
                    break;
                case CaptureStep.ShowRareLevelUp:
                    ShowLevelUp(RareChoices());
                    Next(CaptureStep.CaptureRareLevelUp);
                    break;
                case CaptureStep.CaptureRareLevelUp:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.2)
                    {
                        return;
                    }

                    Capture("04-levelup-rare-card.png");
                    HideLevelUp();
                    Next(CaptureStep.ShowEvolutionLevelUp);
                    break;
                case CaptureStep.ShowEvolutionLevelUp:
                    ShowLevelUp(EvolutionChoices());
                    Next(CaptureStep.CaptureEvolutionLevelUp);
                    break;
                case CaptureStep.CaptureEvolutionLevelUp:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.2)
                    {
                        return;
                    }

                    Capture("05-levelup-evolution-card.png");
                    HideLevelUp();
                    Next(CaptureStep.ShowTapTargets);
                    break;
                case CaptureStep.ShowTapTargets:
                    CreateTapTargetDebugOverlay();
                    Next(CaptureStep.CaptureTapTargets);
                    break;
                case CaptureStep.CaptureTapTargets:
                    if (EditorApplication.timeSinceStartup - stepStartedAt < 0.2)
                    {
                        return;
                    }

                    Capture("06-mobile-tap-targets.png");
                    Next(CaptureStep.Done);
                    break;
                case CaptureStep.Done:
                    Finish();
                    break;
            }
        }

        private static U4LevelUpChoice[] CommonChoices() => new[]
        {
            Choice("lantern_shot", "ランタンの灯", "近くの影へやわらかな光を飛ばす。", "武器", U4ItemRarity.Normal, U4ItemType.Weapon, 1, false),
            Choice("memory_magnet", "記憶の引力", "記憶のかけらを少し遠くから拾える。", "パッシブ", U4ItemRarity.Normal, U4ItemType.Passive, 1, false),
            Choice("paper_fan", "紙扇の風", "影を押し返す小さな風を起こす。", "武器", U4ItemRarity.Good, U4ItemType.Weapon, 1, false),
        };

        private static U4LevelUpChoice[] RareChoices() => new[]
        {
            Choice("warm_cloak", "あたたかい外套", "夜道で受ける傷を少しだけ和らげる。", "パッシブ", U4ItemRarity.Good, U4ItemType.Passive, 1, false),
            Choice("dawn_page", "夜明けの栞", "灯りが強まり、攻撃範囲がわずかに広がる。", "レア", U4ItemRarity.Rare, U4ItemType.Special, 1, false),
            Choice("forgotten_bell", "忘れられた鈴", "鈴の音で影が一瞬怯む。", "レア", U4ItemRarity.Rare, U4ItemType.Special, 1, false),
        };

        private static U4LevelUpChoice[] EvolutionChoices() => new[]
        {
            Choice("ink_shield", "墨のまもり", "周囲にインクの結界を張る。", "武器", U4ItemRarity.Normal, U4ItemType.Weapon, 1, false),
            Choice("dawn_page", "夜明けの栞", "灯りが強まり、攻撃範囲がわずかに広がる。", "レア", U4ItemRarity.Rare, U4ItemType.Special, 1, false),
            Choice("awakening_gate", "覚醒の扉", "条件を満たすと開く、未知の力。", "覚醒", U4ItemRarity.Rare, U4ItemType.Special, 0, true),
        };

        private static U4LevelUpChoice Choice(string id, string name, string description, string type, U4ItemRarity rarity, U4ItemType itemType, int level, bool awakening) => new()
        {
            Id = id,
            NameJa = name,
            DescriptionJa = description,
            TypeLabelJa = type,
            Rarity = rarity,
            ItemType = itemType,
            Level = level,
            IsAwakeningGate = awakening,
        };

        private static void ShowLevelUp(U4LevelUpChoice[] choices)
        {
            var overlay = UnityEngine.Object.FindAnyObjectByType<U4LevelUpOverlay>(FindObjectsInactive.Include);
            overlay?.Show(choices, _ => { });
        }

        private static void HideLevelUp()
        {
            var overlay = UnityEngine.Object.FindAnyObjectByType<U4LevelUpOverlay>(FindObjectsInactive.Include);
            if (overlay != null)
            {
                overlay.gameObject.SetActive(false);
            }
        }

        private static void CreateTapTargetDebugOverlay()
        {
            var canvasObj = new GameObject("U45TapTargetDebugOverlay", typeof(RectTransform), typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            var canvas = canvasObj.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 130;
            var scaler = canvasObj.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(390f, 844f);
            AddBox(canvasObj.transform, "Virtual stick zone", new Vector2(0f, 0f), new Vector2(164f, 120f), new Vector2(82f, 60f));
            AddBox(canvasObj.transform, "Result tap", new Vector2(1f, 1f), new Vector2(112f, 52f), new Vector2(-74f, -112f));
            AddBox(canvasObj.transform, "LevelUp card", new Vector2(0.5f, 0.5f), new Vector2(300f, 162f), new Vector2(0f, 0f));
        }

        private static void AddBox(Transform parent, string label, Vector2 anchor, Vector2 size, Vector2 pos)
        {
            var box = new GameObject(label, typeof(RectTransform), typeof(Image));
            box.transform.SetParent(parent, false);
            var rect = box.GetComponent<RectTransform>();
            rect.anchorMin = anchor;
            rect.anchorMax = anchor;
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.sizeDelta = size;
            rect.anchoredPosition = pos;
            box.GetComponent<Image>().color = new Color(1f, 0.65f, 0.2f, 0.2f);
        }

        private static void PressButton(string label)
        {
            foreach (var button in UnityEngine.Object.FindObjectsByType<PaperButton>(FindObjectsInactive.Include))
            {
                var text = button.GetComponentInChildren<TextMeshProUGUI>(true);
                if (text != null && text.text == label)
                {
                    button.Press();
                    return;
                }
            }
        }

        private static void Capture(string fileName)
        {
            var path = AbsoluteRepoPath(Path.Combine(ScreenshotDirectory, fileName));
            var camera = Camera.main != null ? Camera.main : UnityEngine.Object.FindAnyObjectByType<Camera>();
            if (camera == null)
            {
                report.Add("capture skipped: " + fileName);
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

        private static void Next(CaptureStep next)
        {
            step = next;
            stepStartedAt = EditorApplication.timeSinceStartup;
        }

        private static void Finish()
        {
            File.WriteAllText("Logs/u45_app_quality_screenshot_report.txt", string.Join(Environment.NewLine, report));
            Cleanup();
            EditorApplication.Exit(0);
        }

        private static void Fail(string message)
        {
            report.Add("FAIL: " + message);
            File.WriteAllText("Logs/u45_app_quality_screenshot_report.txt", string.Join(Environment.NewLine, report));
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

            if (EditorApplication.isPlaying)
            {
                EditorApplication.ExitPlaymode();
            }
        }

        private static string AbsoluteRepoPath(string relativeFromProject)
        {
            var projectRoot = Directory.GetParent("Assets")?.FullName ?? Directory.GetCurrentDirectory();
            return Path.GetFullPath(Path.Combine(projectRoot, relativeFromProject));
        }
    }
}
