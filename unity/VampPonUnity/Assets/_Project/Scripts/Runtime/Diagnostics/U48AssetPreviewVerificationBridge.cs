#if VAMPPON_U48_ASSET_PREVIEW
using System;
using System.Collections;
using System.IO;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.Runtime.Visuals;

namespace VampPon.UnitySpike.Diagnostics
{
    public sealed class U48AssetPreviewVerificationBridge : MonoBehaviour
    {
        private const string VerificationEnvironmentVariable = "VAMPPON_U48_PREVIEW_VERIFY";
        private const string ExpectActiveEnvironmentVariable = "VAMPPON_U48_PREVIEW_EXPECT_ACTIVE";
        private int exceptionCount;
        private int assertionCount;
        private string lastFailure;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Install()
        {
            if (Environment.GetEnvironmentVariable(VerificationEnvironmentVariable) != "1") return;
            DontDestroyOnLoad(new GameObject("U48AssetPreviewVerificationBridge", typeof(U48AssetPreviewVerificationBridge)));
        }

        private void Awake()
        {
            Application.logMessageReceived += OnLog;
            StartCoroutine(Verify());
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
            Application.logMessageReceived -= OnLog;
        }

        private static string Bool(bool value) => value ? "true" : "false";
        private static string Nullable(string value) => value == null ? "null" : "\"" + value.Replace("\\", "\\\\", StringComparison.Ordinal).Replace("\"", "\\\"", StringComparison.Ordinal).Replace("\n", "\\n", StringComparison.Ordinal) + "\"";
    }
}
#endif
