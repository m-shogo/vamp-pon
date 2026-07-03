using UnityEngine;

namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35FrameMetricsSampler
    {
        private float totalFrameTimeMs;
        private float minFps = float.MaxValue;
        private float maxFps;
        private int samples;

        public void Sample(float deltaTime)
        {
            if (deltaTime <= 0f) return;
            var fps = 1f / deltaTime;
            minFps = Mathf.Min(minFps, fps);
            maxFps = Mathf.Max(maxFps, fps);
            totalFrameTimeMs += deltaTime * 1000f;
            samples++;
        }

        public U35PerformanceMeasurement BuildEditorOnlyMeasurement()
        {
            var averageFrameTime = samples > 0 ? totalFrameTimeMs / samples : (float?)null;
            var averageFps = averageFrameTime.HasValue && averageFrameTime.Value > 0f ? 1000f / averageFrameTime.Value : (float?)null;
            return new U35PerformanceMeasurement
            {
                Status = U35MetricStatus.EditorOnly,
                AverageFps = averageFps,
                MinFps = samples > 0 ? minFps : null,
                MaxFps = samples > 0 ? maxFps : null,
                FrameTimeMs = averageFrameTime,
                MemoryMb = UnityEngine.Profiling.Profiler.GetTotalAllocatedMemoryLong() / 1024f / 1024f,
                PeakMemoryMb = null,
                GcAllocPerMinute = null,
                DrawCalls = null,
                Batches = null,
                ThermalState = "EDITOR_ONLY",
                BatteryDrainNote = "EDITOR_ONLY",
            };
        }
    }
}
