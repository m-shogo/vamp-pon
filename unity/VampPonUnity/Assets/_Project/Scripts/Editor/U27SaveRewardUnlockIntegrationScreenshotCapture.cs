using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U25.Stage1Loop;
using VampPon.UnitySpike.U27.SaveRewardUnlock;

namespace VampPon.UnitySpike.Editor
{
    public static class U27SaveRewardUnlockIntegrationScreenshotCapture
    {
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u27/screenshots";
        private const string ReportPath = "Logs/u27_save_reward_unlock_integration_screenshot_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static readonly Color32 Night = new(15, 15, 19, 255);
        private static readonly Color32 Paper = new(231, 210, 174, 255);
        private static readonly Color32 Ink = new(15, 10, 12, 245);
        private static readonly Color32 Lantern = new(246, 197, 96, 255);
        private static readonly Color32 Crimson = new(126, 30, 45, 245);
        private static TMP_FontAsset font;

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);
                font = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(FontPath);
                if (font == null) throw new InvalidOperationException($"SDF font not found: {FontPath}");
                var repository = new U27InMemorySaveRepositoryForEditor();
                var integrator = new U27SaveRewardUnlockIntegrator(repository);
                var clear = integrator.CompleteRun(ClearRun());
                var stageSelect = integrator.BuildStageSelect();
                var retry = integrator.BuildRetryFlow(true);
                var defeatRepository = new U27InMemorySaveRepositoryForEditor();
                var defeat = new U27SaveRewardUnlockIntegrator(defeatRepository).CompleteRun(DefeatRun());
                var log = new List<string>
                {
                    CaptureResult("result-clear-reward-unlock.png", clear, "Clear Reward", "new unlocks + first clear"),
                    CaptureResult("result-defeat-participation-reward.png", defeat, "Defeat Reward", "participation reward"),
                    CaptureResult("result-best-updated-stamp.png", clear, "Best Updated", clear.BestUpdatedStamp),
                    CaptureStageSelect("stageselect-stage1-cleared-progress.png", stageSelect, "Stage1 cleared"),
                    CaptureStageSelect("stageselect-stage2-placeholder-unlock.png", stageSelect, stageSelect.Stage2PlaceholderLabel),
                    CaptureRetry("retry-flow-after-result.png", retry),
                    CaptureReset("save-reset-debug-proof.png"),
                };
                File.WriteAllText(ReportPath, string.Join(Environment.NewLine, log));
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                File.WriteAllText(ReportPath, ex.ToString());
                Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static U25RunResultModel ClearRun() => new()
        {
            ClearState = "clear",
            ElapsedSeconds = 480,
            KillCount = 128,
            LevelReached = 5,
            CollectedFragments = 12,
            CollectedMemories = 3,
            KokuyouUsed = true,
            EvolutionAchieved = true,
            RareAcquired = true,
        };

        private static U25RunResultModel DefeatRun() => new()
        {
            ClearState = "fail",
            ElapsedSeconds = 180,
            KillCount = 18,
            LevelReached = 2,
            CollectedFragments = 4,
            CollectedMemories = 0,
        };

        private static string CaptureResult(string fileName, U27ResultIntegrationModel result, string title, string note)
        {
            return Render(fileName, parent =>
            {
                Bg(parent);
                Panel(parent, "Ledger", 0f, 36f, 318f, 420f, Paper);
                Txt(parent, "Title", title, 0f, 198f, 250f, 30f, 20f, Ink);
                Panel(parent, "RankSeal", 0f, 132f, 92f, 52f, result.IsClear ? Crimson : Ink);
                Txt(parent, "Rank", result.RankSeal, 0f, 132f, 82f, 24f, 16f, Paper);
                Txt(parent, "Stats", $"{(result.IsClear ? "clear" : "defeat")} / {result.ElapsedSeconds / 60:00}:{result.ElapsedSeconds % 60:00} / KO {result.KillCount}", 0f, 72f, 270f, 22f, 12f, Ink);
                Txt(parent, "Level", $"Lv {result.LevelReached} / pick {result.CollectedCount}", 0f, 42f, 240f, 22f, 12f, Ink);
                Txt(parent, "Reward", $"fragments {result.RewardDraft.FragmentAmount} / memories {result.RewardDraft.MemoryAmount}", 0f, -6f, 260f, 22f, 12f, Ink);
                Txt(parent, "Unlock", $"unlock {result.Unlocks.Count} / {note}", 0f, -48f, 260f, 22f, 11f, Ink);
                Button(parent, "Retry", -72f, -134f);
                Button(parent, "Stage", 72f, -134f);
            });
        }

        private static string CaptureStageSelect(string fileName, U27StageSelectIntegrationModel model, string note)
        {
            return Render(fileName, parent =>
            {
                Bg(parent);
                Txt(parent, "Title", "StageSelect Progress", 0f, 304f, 300f, 30f, 20f, Paper);
                Panel(parent, "Map", 0f, 48f, 318f, 470f, new Color32(45, 34, 29, 236));
                Panel(parent, "Route", 0f, 98f, 218f, 6f, Ink);
                Panel(parent, "Stage1", -92f, 122f, 62f, 62f, Lantern);
                Panel(parent, "Stage2", 96f, 46f, 52f, 52f, model.Stage2PlaceholderUnlocked ? Crimson : new Color32(62, 58, 56, 255));
                Txt(parent, "State", model.Stage1StateLabel, 0f, -86f, 240f, 22f, 12f, Paper);
                Txt(parent, "Best", $"best {model.BestRank} / {model.BestClearTime / 60:00}:{model.BestClearTime % 60:00}", 0f, -126f, 240f, 22f, 12f, Paper);
                Txt(parent, "Previous", model.PreviousResultStamp, 0f, -166f, 250f, 22f, 12f, Paper);
                Txt(parent, "Note", note, 0f, -322f, 280f, 22f, 11f, Paper);
            });
        }

        private static string CaptureRetry(string fileName, U27RetryFlowModel model)
        {
            return Render(fileName, parent =>
            {
                Bg(parent);
                Panel(parent, "Panel", 0f, 36f, 318f, 330f, Paper);
                Txt(parent, "Title", "Retry Flow", 0f, 138f, 220f, 30f, 20f, Ink);
                Txt(parent, "Next", $"next {model.NextPhase}", 0f, 74f, 240f, 22f, 13f, Ink);
                Txt(parent, "Save", model.SavePreserved ? "save preserved" : "save reset", 0f, 32f, 240f, 22f, 13f, Ink);
                Button(parent, "Retry", -72f, -72f);
                Button(parent, "Map", 72f, -72f);
            });
        }

        private static string CaptureReset(string fileName)
        {
            return Render(fileName, parent =>
            {
                Bg(parent);
                Panel(parent, "Panel", 0f, 36f, 318f, 330f, Paper);
                Txt(parent, "Title", "Save Reset Debug", 0f, 128f, 260f, 30f, 19f, Ink);
                Txt(parent, "Proof", "corrupted data fallback / reset proof", 0f, 60f, 260f, 24f, 12f, Ink);
                Txt(parent, "Scope", "Editor verification only", 0f, 14f, 240f, 22f, 12f, Ink);
                Txt(parent, "Approval", "productionApproved=0", 0f, -50f, 240f, 22f, 12f, Ink);
            });
        }

        private static string Render(string fileName, Action<Transform> build)
        {
            const int width = 390;
            const int height = 844;
            var created = new List<UnityEngine.Object>();
            var camObj = new GameObject("U27Cam", typeof(Camera));
            created.Add(camObj);
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = Night;
            cam.orthographic = true;
            cam.orthographicSize = height * 0.5f;
            cam.transform.position = new Vector3(0f, 0f, -10f);
            var canvasObj = new GameObject("U27Canvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            created.Add(canvasObj);
            var canvas = canvasObj.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceCamera;
            canvas.worldCamera = cam;
            var scaler = canvasObj.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(390f, 844f);
            scaler.matchWidthOrHeight = 0.5f;
            build(canvasObj.transform);
            Canvas.ForceUpdateCanvases();
            var path = Path.GetFullPath(Path.Combine(ProjectRoot(), OutputDirectory, fileName));
            var rt = new RenderTexture(width, height, 24, RenderTextureFormat.ARGB32);
            var tex = new Texture2D(width, height, TextureFormat.RGBA32, false);
            try
            {
                cam.targetTexture = rt;
                cam.Render();
                RenderTexture.active = rt;
                tex.ReadPixels(new Rect(0, 0, width, height), 0, 0);
                tex.Apply();
                File.WriteAllBytes(path, tex.EncodeToPNG());
            }
            finally
            {
                RenderTexture.active = null;
                UnityEngine.Object.DestroyImmediate(tex);
                UnityEngine.Object.DestroyImmediate(rt);
                foreach (var o in created) UnityEngine.Object.DestroyImmediate(o);
            }

            return $"{fileName}, bytes={new FileInfo(path).Length}";
        }

        private static void Bg(Transform parent) => Panel(parent, "Bg", 0f, 0f, 390f, 844f, Night);
        private static void Button(Transform parent, string label, float x, float y) { Panel(parent, label, x, y, 112f, 36f, Ink); Txt(parent, $"{label}Text", label, x, y, 82f, 20f, 12f, Paper); }
        private static void Panel(Transform parent, string name, float x, float y, float w, float h, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            Place(obj.GetComponent<RectTransform>(), x, y, w, h);
            obj.GetComponent<Image>().color = color;
        }
        private static void Txt(Transform parent, string name, string text, float x, float y, float w, float h, float size, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI));
            obj.transform.SetParent(parent, false);
            Place(obj.GetComponent<RectTransform>(), x, y, w, h);
            var tmp = obj.GetComponent<TextMeshProUGUI>();
            tmp.font = font;
            tmp.text = text;
            tmp.fontSize = size;
            tmp.color = color;
            tmp.alignment = TextAlignmentOptions.Center;
            tmp.overflowMode = TextOverflowModes.Ellipsis;
        }
        private static void Place(RectTransform rect, float x, float y, float w, float h)
        {
            var center = new Vector2(0.5f, 0.5f);
            rect.anchorMin = center;
            rect.anchorMax = center;
            rect.pivot = center;
            rect.anchoredPosition = new Vector2(x, y);
            rect.sizeDelta = new Vector2(w, h);
        }
        private static string ProjectRoot() => Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
    }
}
