using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.Profiling;

namespace VampPon.UnitySpike.UI.Screens
{
    /// <summary>
    /// Opt-in Simulator performance evidence sampler for TOP Living Night.
    /// This component is never created during normal gameplay. It activates only
    /// when the player is launched with --vamp-pon-top-perf and emits raw JSON
    /// samples that are later registered/validated by repository tooling.
    /// Physical-iPhone thermal evidence remains an Instruments/native concern.
    /// </summary>
    [DefaultExecutionOrder(950)]
    public sealed class TopLivingNightPerformanceSampler : MonoBehaviour
    {
        private const string EnableFlag = "--vamp-pon-top-perf";
        private const string SupportedTarget = "simulator";
        private const float SampleIntervalSeconds = 5f;
        private const float ObservationSeconds = 300f;
        private const float ReadyTimeoutSeconds = 120f;
        private const float RecoveryTimeoutSeconds = 15f;
        private const float FramePacingHitchSeconds = .10f;
        private const float MemoryRegressionAbsoluteMb = 32f;
        private const float MemoryRegressionFraction = .20f;
        private const string OutputFileName =
            "top-living-night-simulator-performance.json";

        private static TopLivingNightPerformanceSampler instance;

        private readonly List<PerformanceSample> samples = new();
        private string sourceCommit;
        private string topCompositeKind;
        private string topCompositePath;
        private string topCompositeSha256;
        private bool sampling;
        private bool applicationPaused;
        private bool ignoreNextFrameDelta;
        private bool pauseObserved;
        private bool recoveryPending;
        private bool recoveryPassed;
        private double pauseStartedAt;
        private double pausedDurationToApply;
        private double recoveryDeadline;
        private bool framePacingIssueObserved;
        private float worstFrameDelta;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (!HasArgument(EnableFlag) || instance != null)
                return;

            var target = GetArgumentValue("--vamp-pon-top-perf-target=");
            if (!string.Equals(target, SupportedTarget, StringComparison.Ordinal))
            {
                Debug.LogError(
                    "TOP performance sampler: unity-runtime-sampler currently supports simulator only. " +
                    "Use xcode-instruments for physical-iPhone thermal evidence.");
                return;
            }

            var samplerObject = new GameObject(
                "TopLivingNightPerformanceSampler",
                typeof(TopLivingNightPerformanceSampler));
            DontDestroyOnLoad(samplerObject);
            instance = samplerObject.GetComponent<TopLivingNightPerformanceSampler>();
        }

        private void Awake()
        {
            if (instance != null && instance != this)
            {
                Destroy(gameObject);
                return;
            }

            instance = this;
            DontDestroyOnLoad(gameObject);

            sourceCommit = GetArgumentValue("--vamp-pon-top-perf-source-commit=");
            topCompositeKind = GetArgumentValue("--vamp-pon-top-perf-composite-kind=");
            topCompositePath = GetArgumentValue("--vamp-pon-top-perf-composite-path=");
            topCompositeSha256 = GetArgumentValue("--vamp-pon-top-perf-composite-sha256=");

            if (!ValidateProvenance())
            {
                Debug.LogError(
                    "TOP performance sampler: required source/composite provenance launch arguments are invalid.");
                Destroy(gameObject);
                return;
            }

            StartCoroutine(RunSampling());
        }

        private void Update()
        {
            if (!sampling || applicationPaused)
                return;

            if (ignoreNextFrameDelta)
            {
                // iOS/Simulator may report a large delta on the first frame after
                // foregrounding. That is suspension time, not render-frame pacing.
                ignoreNextFrameDelta = false;
            }
            else
            {
                worstFrameDelta = Mathf.Max(worstFrameDelta, Time.unscaledDeltaTime);
                if (Time.unscaledDeltaTime >= FramePacingHitchSeconds)
                    framePacingIssueObserved = true;
            }

            if (!recoveryPending)
                return;

            var top = FindFirstObjectByType<TopLivingNightView>();
            if (top != null &&
                top.gameObject.activeInHierarchy &&
                TopLivingNightCompositeV3Controller.IsCompositeReady)
            {
                recoveryPassed = true;
                recoveryPending = false;
                Debug.Log("TOP performance sampler: background/foreground recovery observed as healthy.");
            }
            else if (Time.realtimeSinceStartupAsDouble >= recoveryDeadline)
            {
                recoveryPending = false;
                Debug.LogError(
                    "TOP performance sampler: TOP did not recover within the recovery evidence window.");
            }
        }

        private IEnumerator RunSampling()
        {
            var readyStartedAt = Time.realtimeSinceStartupAsDouble;
            while (!IsTopReadyForMeasurement())
            {
                if (Time.realtimeSinceStartupAsDouble - readyStartedAt > ReadyTimeoutSeconds)
                {
                    Debug.LogError(
                        "TOP performance sampler: timed out waiting for visible TOP Runtime V3 readiness.");
                    yield break;
                }

                yield return null;
            }

            // One-second warm-up supplies an actual measured FPS for the t=0 sample
            // instead of inventing a nominal frame rate.
            var warmupStartedAt = Time.realtimeSinceStartupAsDouble;
            var warmupStartFrame = Time.frameCount;
            while (Time.realtimeSinceStartupAsDouble - warmupStartedAt < 1d)
                yield return null;

            var warmupElapsed = Math.Max(
                .001d,
                Time.realtimeSinceStartupAsDouble - warmupStartedAt);
            var warmupFrames = Math.Max(1, Time.frameCount - warmupStartFrame);

            sampling = true;
            samples.Clear();
            applicationPaused = false;
            ignoreNextFrameDelta = false;
            pauseObserved = false;
            recoveryPending = false;
            recoveryPassed = false;
            pausedDurationToApply = 0d;
            framePacingIssueObserved = false;
            worstFrameDelta = 0f;
            AddSample(0f, (float)(warmupFrames / warmupElapsed));

            var observationStartedAt = Time.realtimeSinceStartupAsDouble;
            var intervalStartedAt = observationStartedAt;
            var intervalStartFrame = Time.frameCount;
            var nextSampleAt = observationStartedAt + SampleIntervalSeconds;

            while (true)
            {
                if (applicationPaused)
                {
                    yield return null;
                    continue;
                }

                if (pausedDurationToApply > 0d)
                {
                    // App suspension is not active render time. Shift all sampling
                    // clocks forward so background duration cannot create fake FPS
                    // drops or shorten the required 300 active seconds.
                    observationStartedAt += pausedDurationToApply;
                    intervalStartedAt += pausedDurationToApply;
                    nextSampleAt += pausedDurationToApply;
                    intervalStartFrame = Time.frameCount;
                    pausedDurationToApply = 0d;
                }

                var now = Time.realtimeSinceStartupAsDouble;
                var activeObservationElapsed = now - observationStartedAt;
                if (activeObservationElapsed >= ObservationSeconds)
                    break;

                if (now >= nextSampleAt)
                {
                    var elapsed = Math.Max(.001d, now - intervalStartedAt);
                    var frameCount = Math.Max(1, Time.frameCount - intervalStartFrame);
                    AddSample(
                        Mathf.Min(ObservationSeconds, (float)activeObservationElapsed),
                        (float)(frameCount / elapsed));
                    intervalStartedAt = now;
                    intervalStartFrame = Time.frameCount;
                    nextSampleAt += SampleIntervalSeconds;
                }

                yield return null;
            }

            // Ensure the declared 300 active seconds has a terminal sample even
            // when a frame lands just beyond the nominal cadence boundary.
            var terminalElapsed = Math.Max(
                .001d,
                Time.realtimeSinceStartupAsDouble - intervalStartedAt);
            if (samples.Count == 0 ||
                samples[samples.Count - 1].elapsedSeconds < ObservationSeconds - .01f)
            {
                var terminalFrames = Math.Max(1, Time.frameCount - intervalStartFrame);
                AddSample(
                    ObservationSeconds,
                    (float)(terminalFrames / terminalElapsed));
            }

            sampling = false;
            WriteArtifact();
        }

        private void OnApplicationPause(bool paused)
        {
            if (!sampling)
                return;

            var now = Time.realtimeSinceStartupAsDouble;
            if (paused)
            {
                pauseObserved = true;
                recoveryPending = false;
                applicationPaused = true;
                pauseStartedAt = now;
                return;
            }

            if (applicationPaused)
            {
                pausedDurationToApply += Math.Max(0d, now - pauseStartedAt);
                applicationPaused = false;
                ignoreNextFrameDelta = true;
            }

            if (!pauseObserved)
                return;

            recoveryPending = true;
            recoveryDeadline = now + RecoveryTimeoutSeconds;
        }

        private void AddSample(float elapsedSeconds, float fps)
        {
            samples.Add(new PerformanceSample
            {
                elapsedSeconds = elapsedSeconds,
                fps = Mathf.Clamp(fps, .001f, 240f),
                memoryMb = Mathf.Max(
                    .001f,
                    Profiler.GetTotalAllocatedMemoryLong() / (1024f * 1024f)),
            });
        }

        private void WriteArtifact()
        {
            if (samples.Count == 0)
            {
                Debug.LogError("TOP performance sampler: no samples were collected.");
                return;
            }

            var artifact = new PerformanceArtifact
            {
                schemaVersion = 1,
                target = SupportedTarget,
                sourceCommit = sourceCommit,
                topCompositeKind = topCompositeKind,
                topCompositePath = topCompositePath,
                topCompositeSha256 = topCompositeSha256,
                measurementMethod = "unity-runtime-sampler",
                sampleIntervalSeconds = SampleIntervalSeconds,
                durationSeconds = ObservationSeconds,
                framePacingIssueObserved = framePacingIssueObserved,
                memoryRegressionObserved = DetectMemoryRegression(),
                backgroundForegroundRecoveryPassed = recoveryPassed,
                samples = samples,
            };

            var path = Path.Combine(Application.persistentDataPath, OutputFileName);
            File.WriteAllText(path, JsonUtility.ToJson(artifact, true));
            Debug.Log(
                $"TOP_PERF_ARTIFACT={path} samples={samples.Count} " +
                $"worstFrameDelta={worstFrameDelta:F4}s recovery={recoveryPassed}");
        }

        private bool DetectMemoryRegression()
        {
            if (samples.Count < 12)
                return true;

            var window = Mathf.Max(3, samples.Count / 10);
            var earlySum = 0f;
            var lateSum = 0f;
            for (var index = 0; index < window; index++)
            {
                earlySum += samples[index].memoryMb;
                lateSum += samples[samples.Count - 1 - index].memoryMb;
            }

            var earlyAverage = earlySum / window;
            var lateAverage = lateSum / window;
            var threshold = Mathf.Max(
                MemoryRegressionAbsoluteMb,
                earlyAverage * MemoryRegressionFraction);
            return lateAverage - earlyAverage > threshold;
        }

        private bool ValidateProvenance()
        {
            if (sourceCommit == null || sourceCommit.Length != 40)
                return false;
            if (topCompositeKind != "bridge" && topCompositeKind != "final-core5")
                return false;
            if (string.IsNullOrWhiteSpace(topCompositePath))
                return false;
            return topCompositeSha256 != null && topCompositeSha256.Length == 64;
        }

        private static bool IsTopReadyForMeasurement()
        {
            var top = FindFirstObjectByType<TopLivingNightView>();
            return top != null &&
                top.gameObject.activeInHierarchy &&
                TopLivingNightCompositeV3Controller.IsCompositeReady &&
                LoadingTopVisualPolishCoordinator.IsCurrentTopReady;
        }

        private static bool HasArgument(string expected)
        {
            foreach (var value in Environment.GetCommandLineArgs())
            {
                if (string.Equals(value, expected, StringComparison.Ordinal))
                    return true;
            }

            return false;
        }

        private static string GetArgumentValue(string prefix)
        {
            foreach (var value in Environment.GetCommandLineArgs())
            {
                if (value.StartsWith(prefix, StringComparison.Ordinal))
                    return value.Substring(prefix.Length);
            }

            return string.Empty;
        }

        [Serializable]
        private sealed class PerformanceArtifact
        {
            public int schemaVersion;
            public string target;
            public string sourceCommit;
            public string topCompositeKind;
            public string topCompositePath;
            public string topCompositeSha256;
            public string measurementMethod;
            public float sampleIntervalSeconds;
            public float durationSeconds;
            public bool framePacingIssueObserved;
            public bool memoryRegressionObserved;
            public bool backgroundForegroundRecoveryPassed;
            public List<PerformanceSample> samples;
        }

        [Serializable]
        private sealed class PerformanceSample
        {
            public float elapsedSeconds;
            public float fps;
            public float memoryMb;
        }
    }
}
