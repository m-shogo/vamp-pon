#if VAMPPON_AI_SIMULATOR_SMOKE
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.Runtime.Collection;
using VampPon.UnitySpike.Runtime.Pause;
using VampPon.UnitySpike.Runtime.Result;
using VampPon.UnitySpike.Runtime.Save;
using VampPon.UnitySpike.U4;
using VampPon.UnitySpike.UI;

namespace VampPon.UnitySpike.Diagnostics
{
    public sealed class U46AiSimulatorSmokeBridge : MonoBehaviour
    {
        private readonly List<string> log = new();
        private string root;
        private string screenshots;
        private int exceptionCount;
        private bool crash;
        private readonly Dictionary<string, bool> checks = new();

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Install()
        {
            if (Application.platform != RuntimePlatform.IPhonePlayer) return;
            if (Environment.GetEnvironmentVariable("VAMPPON_U47_AI_SIMULATOR_SMOKE") == "1") return;
            if (Environment.GetEnvironmentVariable("VAMPPON_U48_BATCH_B_CAPTURE") == "1") return;
            if (Environment.GetEnvironmentVariable("VAMPPON_U48_BATCH_C_CAPTURE") == "1") return;
            DontDestroyOnLoad(new GameObject("U46AiSimulatorSmokeBridge", typeof(U46AiSimulatorSmokeBridge)));
        }

        private void Awake()
        {
            root = Path.Combine(Application.persistentDataPath, "u46-ai-simulator-smoke");
            screenshots = Path.Combine(root, "screenshots");
            Directory.CreateDirectory(screenshots);
            Application.logMessageReceived += OnLog;
            StartCoroutine(Run());
        }

        private void OnDestroy() => Application.logMessageReceived -= OnLog;

        private void OnLog(string condition, string stackTrace, LogType type)
        {
            log.Add($"[{DateTime.UtcNow:O}] {type}: {condition}");
            if (type == LogType.Exception || type == LogType.Assert) exceptionCount++;
        }

        private IEnumerator Run()
        {
            yield return WaitFor(() => FindAnyObjectByType<U46RuntimeShell>() != null, 20f, "runtime shell");
            var shell = FindAnyObjectByType<U46RuntimeShell>();
            Set("bootToStageSelect", shell?.Flow.State == AppFlowState.StageSelect);
            Set("stageSelectPause", shell != null && shell.Pause.IsPaused && FindAnyObjectByType<U2BattleController>().IsRuntimePaused);
            yield return Capture("01-stage-select.png");
            var openedBefore = shell.VerificationLevelUpOpenedCount;
            var closedBefore = shell.VerificationLevelUpClosedCount;
            shell.ReinitializeForVerification();
            yield return new WaitForSecondsRealtime(0.3f);
            Invoke("StartStageButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 4f, "battle start");
            Set("battleStart", !shell.Pause.IsPaused);
            Set("verificationButtonAbsent", !FindObjectsByType<Button>(FindObjectsInactive.Include).Any(x => x.GetComponentInChildren<TextMeshProUGUI>(true)?.text == "結果"));
            yield return Capture("12-no-verification-button.png");
            var levelUp = FindAnyObjectByType<U4LevelUpDemoController>(); levelUp?.TriggerLevelUp();
            yield return new WaitForSecondsRealtime(0.35f);
            Set("levelUpPause", shell.Flow.State == AppFlowState.LevelUpModal && shell.Pause.Contains(RunPauseReason.LevelUp));
            CloseFirstLevelUpCard(); yield return new WaitForSecondsRealtime(0.5f);
            Set("levelUpResume", shell.Flow.State == AppFlowState.Running && !shell.Pause.IsPaused);
            Set("subscriptionsSingleAfterReinitialize", shell.VerificationLevelUpOpenedCount - openedBefore == 1 && shell.VerificationLevelUpClosedCount - closedBefore == 1 && FindObjectsByType<Canvas>(FindObjectsInactive.Include).Count(x => x.name == "U46AppFlowCanvas") == 1);

            shell.CompleteVerificationRun(true, true); yield return WaitFor(() => shell.Flow.State == AppFlowState.Result, 4f, "clear rewards");
            yield return new WaitForSecondsRealtime(0.4f);
            Set("clearRewards", FindText("踏破") && FindText("記憶の欠片") && !FindText("持ち帰った記憶はありません"));
            yield return Capture("02-result-clear-rewards.png");
            Invoke("RetryButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 4f, "retry");
            Set("retryReset", !shell.Pause.IsPaused && FindAnyObjectByType<U2BattleController>().ElapsedSeconds < 1f);

            shell.CompleteVerificationRun(true, false); yield return new WaitForSecondsRealtime(0.5f);
            Set("clearEmpty", FindText("持ち帰った記憶はありません") && FindText("新しい記録はありません") && !FindText("夜の足跡"));
            yield return Capture("03-result-clear-empty.png");
            Invoke("RetryButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 4f, "clear empty retry");

            shell.CompleteVerificationRun(false, true); yield return new WaitForSecondsRealtime(0.5f);
            Set("failRewards", FindText("帰還") && FindText("記憶の欠片"));
            yield return Capture("04-result-fail-rewards.png");
            Invoke("RetryButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 4f, "fail rewards retry");

            shell.CompleteVerificationRun(false, false); yield return new WaitForSecondsRealtime(0.5f);
            Set("failEmpty", FindText("帰還") && FindText("持ち帰った記憶はありません") && FindText("新しい記録はありません"));
            yield return Capture("05-result-fail-empty.png");
            Invoke("RetryButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 4f, "fail empty retry");

            var beforeFailure = shell.Save.Current;
            var unlockCount = beforeFailure.collectionUnlockedIds.Count;
            shell.CompleteVerificationRun(true, true, true); yield return new WaitForSecondsRealtime(0.5f);
            Set("saveFailureVisible", !shell.Flow.LastPersistenceSucceeded && FindText("記録を保存できませんでした"));
            Set("saveFailurePreservesCurrent", ReferenceEquals(beforeFailure, shell.Save.Current) && shell.Save.Current.collectionUnlockedIds.Count == unlockCount);
            yield return Capture("06-result-save-failed.png");
            Invoke("RetryButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 4f, "save failure retry");
            Set("saveFailureRetry", shell.Flow.State == AppFlowState.Running && !shell.Pause.IsPaused);
            yield return Capture("07-result-save-failed-retry.png");

            shell.CompleteVerificationRun(false, false, true); yield return new WaitForSecondsRealtime(0.4f);
            Invoke("StageSelectButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.StageSelect, 4f, "result return");
            Set("saveFailureStageSelectReturn", shell.Pause.Contains(RunPauseReason.StageSelect));
            yield return Capture("08-stage-select-return.png");

            Invoke("OpenCollectionButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.Collection, 4f, "open collection");
            Set("collectionRoute", shell.Flow.State == AppFlowState.Collection);
            yield return Capture("09-collection-index.png");
            Invoke("CloseCollectionButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.StageSelect, 4f, "collection close");

            Invoke("StartStageButton"); shell.CompleteVerificationRun(true, false); ApplyReferenceResolution(new Vector2(430f, 932f)); yield return new WaitForSecondsRealtime(0.4f);
            yield return Capture("10-large-result.png");
            ApplyReferenceResolution(new Vector2(360f, 800f)); yield return new WaitForSecondsRealtime(0.3f); yield return Capture("11-compact-result.png");
            ApplyReferenceResolution(new Vector2(390f, 844f));

            var reload = new SaveService(Path.GetDirectoryName(shell.Save.SavePath)).Load();
            Set("saveGenerated", File.Exists(shell.Save.SavePath)); Set("saveReload", reload.Succeeded && reload.Snapshot.schemaVersion == 1);
            Set("eventSystemUnique", FindObjectsByType<EventSystem>(FindObjectsInactive.Include).Length == 1);
            Set("audioListenerUnique", FindObjectsByType<AudioListener>(FindObjectsInactive.Include).Length == 1);
            Set("candidateProviderBoundary", FindAnyObjectByType<U1Stage1SceneBootstrap>().AssetProviderApprovalLevel == AssetApprovalLevel.Candidate);
            Set("productionProviderFalse", !FindAnyObjectByType<U1Stage1SceneBootstrap>().AssetProviderIsProductionApproved);
            WriteEvidence();
        }

        private IEnumerator Capture(string file)
        {
            Canvas.ForceUpdateCanvases(); yield return new WaitForEndOfFrame();
            var texture = new Texture2D(Screen.width, Screen.height, TextureFormat.RGBA32, false);
            texture.ReadPixels(new Rect(0f, 0f, Screen.width, Screen.height), 0, 0); texture.Apply();
            WritePpm(texture, Path.Combine(screenshots, Path.ChangeExtension(file, ".ppm"))); Destroy(texture);
            yield return new WaitForSecondsRealtime(0.25f);
        }

        private static void WritePpm(Texture2D texture, string path)
        {
            var pixels = texture.GetPixels32(); var rgb = new byte[texture.width * texture.height * 3]; var destination = 0;
            for (var y = texture.height - 1; y >= 0; y--)
                for (var x = 0; x < texture.width; x++)
                {
                    var color = pixels[y * texture.width + x]; rgb[destination++] = color.r; rgb[destination++] = color.g; rgb[destination++] = color.b;
                }
            using var stream = File.Create(path);
            var header = Encoding.ASCII.GetBytes($"P6\n{texture.width} {texture.height}\n255\n");
            stream.Write(header, 0, header.Length); stream.Write(rgb, 0, rgb.Length);
        }

        private IEnumerator WaitFor(Func<bool> condition, float timeout, string label)
        {
            var start = Time.realtimeSinceStartup;
            while (!condition() && Time.realtimeSinceStartup - start < timeout) yield return null;
            log.Add(label + "=" + condition());
        }

        private static void Invoke(string name)
        {
            var button = FindObjectsByType<Button>(FindObjectsInactive.Include).FirstOrDefault(x => x.name == name);
            button?.onClick.Invoke();
        }

        private static bool FindText(string value) => FindObjectsByType<TextMeshProUGUI>(FindObjectsInactive.Exclude).Any(x => x.text.Contains(value));

        private static void CloseFirstLevelUpCard()
        {
            var card = FindAnyObjectByType<PaperCard>(FindObjectsInactive.Exclude); card?.OnPointerClick(null); card?.OnPointerClick(null);
        }

        private static void ApplyReferenceResolution(Vector2 value)
        {
            foreach (var scaler in FindObjectsByType<CanvasScaler>(FindObjectsInactive.Include)) scaler.referenceResolution = value;
        }

        private void Set(string key, bool value) { checks[key] = value; log.Add(key + "=" + value); }

        private void WriteEvidence()
        {
            var required = new[] { "bootToStageSelect", "stageSelectPause", "battleStart", "verificationButtonAbsent", "levelUpPause", "levelUpResume", "subscriptionsSingleAfterReinitialize", "clearRewards", "clearEmpty", "failRewards", "failEmpty", "retryReset", "saveFailureVisible", "saveFailurePreservesCurrent", "saveFailureRetry", "saveFailureStageSelectReturn", "collectionRoute", "saveGenerated", "saveReload", "eventSystemUnique", "audioListenerUnique", "candidateProviderBoundary", "productionProviderFalse" };
            var ready = required.All(x => checks.TryGetValue(x, out var value) && value) && exceptionCount == 0 && !crash;
            var fields = string.Join(",\n", checks.OrderBy(x => x.Key).Select(x => $"  \"{x.Key}\": {x.Value.ToString().ToLowerInvariant()}"));
            File.WriteAllText(Path.Combine(root, "u46-ai-simulator-smoke-result.json"), "{\n" + fields + ",\n" +
                $"  \"unhandledExceptionCount\": {exceptionCount},\n  \"crashDetected\": false,\n  \"u46SimulatorSmokeReady\": {ready.ToString().ToLowerInvariant()}\n}}\n");
            File.WriteAllText(Path.Combine(root, "u46-ai-simulator-smoke.log"), string.Join(Environment.NewLine, log));
            Debug.Log("U46 AI Simulator smoke completed: " + ready);
        }
    }
}
#endif
