using UnityEngine;

namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35MobileMetricsCapture
    {
        private readonly U35FrameMetricsSampler frameSampler = new();
        private readonly U35RuntimeCountSampler runtimeCountSampler = new();
        private readonly U35AudioMetricsSampler audioSampler = new();
        private readonly U35HapticMetricsSampler hapticSampler = new();
        private readonly U35MetricsScenarioMarker scenarioMarker = new();

        public U35MetricsScenarioMarker ScenarioMarker => scenarioMarker;

        public void SampleFrame(float deltaTime)
        {
            frameSampler.Sample(deltaTime);
        }

        public void RecordHapticEvent()
        {
            hapticSampler.RecordHapticEvent();
        }

        public U35MobileMetricsSession BuildEditorSession()
        {
            var session = new U35MobileMetricsSession
            {
                SessionStatus = U35MetricStatus.EditorOnly,
                Verdict = U35MobileMetricsVerdict.MobileMetricsNotReady,
                ProductionApproved = false,
                MobileMetricsReady = false,
                DeviceProfile = new U35MobileDeviceProfile
                {
                    DeviceName = "Unity Editor",
                    Platform = Application.platform.ToString(),
                    OsVersion = SystemInfo.operatingSystem,
                    BuildType = "Editor verification",
                    Resolution = "390x844",
                    GraphicsApi = SystemInfo.graphicsDeviceType.ToString(),
                    TargetFps = 60,
                },
                Performance = frameSampler.BuildEditorOnlyMeasurement(),
                Audio = audioSampler.BuildEditorOnlyBudgetMeasurement(),
                Haptic = hapticSampler.BuildNotMeasuredMeasurement(),
                Touch = new U35TouchMeasurement { TouchResponsivenessStatus = U35MetricStatus.NotMeasured },
                Persistence = new U35PersistenceMeasurement { SavePersistenceStatus = U35MetricStatus.NotMeasured, RetryStabilityStatus = U35MetricStatus.EditorOnly },
                RuntimeCounts = runtimeCountSampler.BuildBudgetSample(),
            };
            session.Samples.Add(new U35MetricSample
            {
                ScenarioMarker = scenarioMarker.CurrentScenario,
                Status = U35MetricStatus.EditorOnly,
                AverageFps = session.Performance.AverageFps,
                MinFps = session.Performance.MinFps,
                MaxFps = session.Performance.MaxFps,
                FrameTimeMs = session.Performance.FrameTimeMs,
                MemoryMb = session.Performance.MemoryMb,
                ThermalState = "EDITOR_ONLY",
                BatteryDrainNote = "EDITOR_ONLY",
                Note = "Editor sample validates export shape only",
            });
            return session;
        }
    }
}
