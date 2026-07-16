#if VAMPPON_U48_ASSET_PREVIEW
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.Runtime.Visuals;

namespace VampPon.UnitySpike.Diagnostics
{
    public sealed class U48AssetPreviewVerificationBridge : MonoBehaviour
    {
        private const string VerificationEnvironmentVariable = "VAMPPON_U48_PREVIEW_VERIFY";
        private const string ExpectActiveEnvironmentVariable = "VAMPPON_U48_PREVIEW_EXPECT_ACTIVE";
        private const string CaptureEnvironmentVariable = "VAMPPON_U48_PREVIEW_CAPTURE";
        private int exceptionCount;
        private int assertionCount;
        private string lastFailure;
        private GameObject captureRig;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Install()
        {
            if (Environment.GetEnvironmentVariable("VAMPPON_U48_BATCH_C_CAPTURE") == "1") return;
            if (Environment.GetEnvironmentVariable(VerificationEnvironmentVariable) != "1") return;
            DontDestroyOnLoad(new GameObject("U48AssetPreviewVerificationBridge", typeof(U48AssetPreviewVerificationBridge)));
        }

        private void Awake()
        {
            Application.logMessageReceived += OnLog;
            StartCoroutine(Environment.GetEnvironmentVariable(CaptureEnvironmentVariable) == "1" ? CaptureCandidate() : Verify());
        }

        private void OnLog(string condition, string stackTrace, LogType type)
        {
            if (type == LogType.Exception) { exceptionCount++; lastFailure = condition; }
            if (type == LogType.Assert) { assertionCount++; lastFailure = condition; }
        }

        private IEnumerator Verify()
        {
            var deadline = Time.realtimeSinceStartup + 20f;
            U1Stage1SceneBootstrap bootstrap = null;
            while (bootstrap == null && Time.realtimeSinceStartup < deadline)
            {
                bootstrap = FindAnyObjectByType<U1Stage1SceneBootstrap>();
                yield return null;
            }
            if (bootstrap == null)
            {
                Write(false, Environment.GetEnvironmentVariable(ExpectActiveEnvironmentVariable) == "1", false, false, "Stage1 bootstrap timeout");
                Destroy(gameObject);
                yield break;
            }
            yield return null;
            var expectedActive = Environment.GetEnvironmentVariable(ExpectActiveEnvironmentVariable) == "1";
            var activated = bootstrap.AssetProviderName.StartsWith("U48AssetPreviewProvider(", StringComparison.Ordinal) &&
                            bootstrap.AssetProviderApprovalLevel == AssetApprovalLevel.Candidate &&
                            !bootstrap.AssetProviderIsProductionApproved && U48AssetPreviewProvider.IsSessionActive;
            Destroy(bootstrap.gameObject);
            yield return null;
            var cleanupPassed = !U48AssetPreviewProvider.IsSessionActive && FindAnyObjectByType<U48AssetPreviewSceneBinder>() == null;
            Write(activated == expectedActive && cleanupPassed && exceptionCount == 0 && assertionCount == 0, expectedActive, activated, cleanupPassed, lastFailure);
            Destroy(gameObject);
        }

        private IEnumerator CaptureCandidate()
        {
            var deadline = Time.realtimeSinceStartup + 20f;
            U1Stage1SceneBootstrap bootstrap = null;
            while (bootstrap == null && Time.realtimeSinceStartup < deadline)
            {
                bootstrap = FindAnyObjectByType<U1Stage1SceneBootstrap>();
                yield return null;
            }
            if (bootstrap == null) throw new TimeoutException("Stage1 bootstrap timeout during U48 candidate capture.");
            var shell = FindAnyObjectByType<U46RuntimeShell>() ?? throw new InvalidOperationException("U48 capture runtime shell is missing.");
            if (shell.Flow.State != AppFlowState.Running)
            {
                var start = FindObjectsByType<Button>(FindObjectsInactive.Include).FirstOrDefault(value => value.name == "StartStageButton")
                    ?? throw new InvalidOperationException("U48 capture could not find the Stage1 start command.");
                start.onClick.Invoke();
                var runningDeadline = Time.realtimeSinceStartup + 5f;
                while (shell.Flow.State != AppFlowState.Running && Time.realtimeSinceStartup < runningDeadline) yield return null;
                if (shell.Flow.State != AppFlowState.Running) throw new TimeoutException("U48 capture did not reach the running Stage1 state.");
            }
            yield return new WaitForSecondsRealtime(1.5f);
            var entry = U48AssetPreviewProvider.ActiveEntry ?? throw new InvalidOperationException("U48 preview entry is inactive during capture.");
            var root = Path.Combine(Application.persistentDataPath, "u48-batch-a-captures", entry.assetGroup, entry.candidateId);
            var screenshots = Path.Combine(root, "screenshots");
            var results = Path.Combine(root, "results");
            Directory.CreateDirectory(screenshots); Directory.CreateDirectory(results);
            foreach (var file in Directory.GetFiles(screenshots)) File.Delete(file);
            foreach (var file in Directory.GetFiles(results)) File.Delete(file);

            var completed = new List<string>();
            foreach (var spec in Specs(entry.assetGroup))
            {
                PrepareRig(entry, spec.kind);
                ApplyViewport(spec.width, spec.height);
                yield return null; yield return new WaitForEndOfFrame();
                var captureId = $"{entry.candidateId}--{spec.viewport}--{spec.kind}";
                yield return Capture(Path.Combine(screenshots, captureId + ".ppm"), spec.width, spec.height);
                DestroyCaptureRig();
                yield return null;
                File.WriteAllText(Path.Combine(results, captureId + ".json"),
                    "{\n" +
                    $"  \"assetGroup\": {Q(entry.assetGroup)},\n  \"candidateId\": {Q(entry.candidateId)},\n" +
                    $"  \"viewport\": {Q(spec.viewport)},\n  \"width\": {spec.width},\n  \"height\": {spec.height},\n" +
                    $"  \"captureKind\": {Q(spec.kind)},\n  \"sourcePath\": {Q(entry.sourcePath)},\n  \"sourceSha256\": {Q(entry.sourceSha256)},\n" +
                    "  \"liveRender\": true,\n  \"standardFileResizeReuse\": false,\n  \"verificationPresentationOnly\": true,\n" +
                    $"  \"previewCleanupPassed\": {B(captureRig == null)},\n  \"unhandledExceptionCount\": {exceptionCount},\n  \"assertionFailureCount\": {assertionCount}\n}}\n");
                completed.Add(captureId);
                if (exceptionCount > 0 || assertionCount > 0) throw new InvalidOperationException("Runtime log failure during U48 candidate capture: " + lastFailure);
            }

            Destroy(bootstrap.gameObject);
            yield return null;
            var cleanupPassed = !U48AssetPreviewProvider.IsSessionActive && FindAnyObjectByType<U48AssetPreviewSceneBinder>() == null && captureRig == null;
            File.WriteAllText(Path.Combine(root, "summary.json"),
                $"{{\n  \"schemaVersion\": 1,\n  \"assetGroup\": {Q(entry.assetGroup)},\n  \"candidateId\": {Q(entry.candidateId)},\n  \"completedCaptureCount\": {completed.Count},\n  \"previewCleanupPassed\": {B(cleanupPassed)},\n  \"unhandledExceptionCount\": {exceptionCount},\n  \"assertionFailureCount\": {assertionCount},\n  \"passed\": {B(cleanupPassed && exceptionCount == 0 && assertionCount == 0)}\n}}\n");
            Destroy(gameObject);
        }

        private static IEnumerable<(string viewport, int width, int height, string kind)> Specs(string group)
        {
            string[] standardKinds;
            if (group is "player-yui" or "enemy-onbu") standardKinds = new[] { "idle-representative", "movement-representative", "live-battle", "player-enemy-together", "background-contrast", "projectile-pickup-overlap" };
            else if (group == "stage1-background") standardKinds = new[] { "normal-density", "high-density" };
            else if (group is "exp-pickup" or "healing-pickup") standardKinds = new[] { "single", "normal-density", "high-density", "magnet-motion", "near-player", "candidate-crystal-together", "exp-healing-together" };
            else standardKinds = new[] { "single", "normal-density", "high-density", "ground-area-together", "hud-visible", "player-enemy-unobscured" };
            foreach (var kind in standardKinds) yield return ("standard", 390, 844, kind);
            yield return ("compact", 360, 800, group == "stage1-background" ? "normal-density" : "live-battle");
            yield return ("large", 430, 932, group == "stage1-background" ? "normal-density" : "live-battle");
        }

        private void PrepareRig(U48AssetPreviewEntry entry, string kind)
        {
            DestroyCaptureRig();
            if (entry.slot == nameof(U48AssetPreviewSlot.Background)) return;
            if (entry.slot is nameof(U48AssetPreviewSlot.Player) or nameof(U48AssetPreviewSlot.Enemy)) return;
            captureRig = new GameObject("U48CandidateCaptureRig");
            var sprite = U48AssetPreviewProvider.LoadPrimarySprite(entry.resourcePath);
            var count = kind == "high-density" ? 18 : kind == "normal-density" ? 6 : kind is "candidate-crystal-together" or "exp-healing-together" ? 2 : 1;
            var camera = Camera.main;
            var center = camera == null ? Vector3.zero : new Vector3(camera.transform.position.x, camera.transform.position.y, 0f);
            var worldSize = Mathf.Max(sprite.bounds.size.x, sprite.bounds.size.y);
            var targetSize = entry.slot == nameof(U48AssetPreviewSlot.HealingPickup) || entry.slot == nameof(U48AssetPreviewSlot.ExpPickup) ? .28f : .42f;
            var scale = worldSize > .0001f ? targetSize / worldSize : 1f;
            for (var index = 0; index < count; index++)
            {
                var child = new GameObject($"CandidateVisual_{index}"); child.transform.SetParent(captureRig.transform, false);
                var angle = index * Mathf.PI * 2f / Mathf.Max(1, count);
                var radius = count == 1 ? .45f : count == 2 ? .7f : .55f + .13f * (index % 3);
                child.transform.position = center + new Vector3(Mathf.Cos(angle) * radius, Mathf.Sin(angle) * radius, 0f);
                child.transform.localScale = Vector3.one * scale;
                var renderer = child.AddComponent<SpriteRenderer>(); renderer.sprite = sprite; renderer.sortingOrder = 85;
            }
        }

        private void DestroyCaptureRig()
        {
            if (captureRig == null) return;
            Destroy(captureRig); captureRig = null;
        }

        private static void ApplyViewport(int width, int height)
        {
            Screen.SetResolution(width, height, false);
            foreach (var scaler in FindObjectsByType<CanvasScaler>(FindObjectsInactive.Include)) scaler.referenceResolution = new Vector2(width, height);
        }

        private static IEnumerator Capture(string path, int width, int height)
        {
            var source = new Texture2D(Screen.width, Screen.height, TextureFormat.RGBA32, false);
            source.ReadPixels(new Rect(0, 0, Screen.width, Screen.height), 0, 0); source.Apply();
            var target = RenderTexture.GetTemporary(width, height, 0, RenderTextureFormat.ARGB32); Graphics.Blit(source, target);
            var previous = RenderTexture.active; RenderTexture.active = target;
            var output = new Texture2D(width, height, TextureFormat.RGBA32, false); output.ReadPixels(new Rect(0, 0, width, height), 0, 0); output.Apply();
            RenderTexture.active = previous; RenderTexture.ReleaseTemporary(target); Destroy(source);
            WritePpm(output, path); Destroy(output); yield return new WaitForSecondsRealtime(.05f);
        }

        private static void WritePpm(Texture2D texture, string path)
        {
            var pixels = texture.GetPixels32(); var rgb = new byte[texture.width * texture.height * 3]; var output = 0;
            for (var y = texture.height - 1; y >= 0; y--) for (var x = 0; x < texture.width; x++)
            {
                var color = pixels[y * texture.width + x]; rgb[output++] = color.r; rgb[output++] = color.g; rgb[output++] = color.b;
            }
            using var stream = File.Create(path); var header = Encoding.ASCII.GetBytes($"P6\n{texture.width} {texture.height}\n255\n"); stream.Write(header); stream.Write(rgb);
        }

        private void Write(bool passed, bool expectedActive, bool activated, bool cleanupPassed, string failure)
        {
            var directory = Path.Combine(Application.persistentDataPath, "u48-preview-verification");
            Directory.CreateDirectory(directory);
            File.WriteAllText(Path.Combine(directory, "result.json"),
                "{\n" +
                "  \"schemaVersion\": 1,\n" +
                $"  \"previewExpectedActive\": {Bool(expectedActive)},\n" +
                $"  \"previewActivated\": {Bool(activated)},\n" +
                $"  \"cleanupPassed\": {Bool(cleanupPassed)},\n" +
                $"  \"unhandledExceptionCount\": {exceptionCount},\n" +
                $"  \"assertionFailureCount\": {assertionCount},\n" +
                $"  \"failure\": {Nullable(failure)},\n" +
                $"  \"passed\": {Bool(passed)}\n" +
                "}\n");
        }

        private void OnDestroy()
        {
            StopAllCoroutines();
            DestroyCaptureRig();
            Application.logMessageReceived -= OnLog;
        }

        private static string Bool(bool value) => value ? "true" : "false";
        private static string B(bool value) => value ? "true" : "false";
        private static string Q(string value) => "\"" + (value ?? string.Empty).Replace("\\", "\\\\", StringComparison.Ordinal).Replace("\"", "\\\"", StringComparison.Ordinal).Replace("\n", "\\n", StringComparison.Ordinal) + "\"";
        private static string Nullable(string value) => value == null ? "null" : "\"" + value.Replace("\\", "\\\\", StringComparison.Ordinal).Replace("\"", "\\\"", StringComparison.Ordinal).Replace("\n", "\\n", StringComparison.Ordinal) + "\"";
    }
}
#endif
