using System.Collections.Generic;

namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35MobileMetricsSession
    {
        public string Version { get; set; } = "U35";
        public string MeasuredAtPlaceholder { get; set; } = "NOT_MEASURED";
        public U35MetricStatus SessionStatus { get; set; } = U35MetricStatus.EditorOnly;
        public U35MobileMetricsVerdict Verdict { get; set; } = U35MobileMetricsVerdict.MobileMetricsNotReady;
        public bool ProductionApproved { get; set; }
        public bool MobileMetricsReady { get; set; }
        public U35MobileDeviceProfile DeviceProfile { get; set; } = new();
        public U35PerformanceMeasurement Performance { get; set; } = new();
        public U35AudioMeasurement Audio { get; set; } = new();
        public U35HapticMeasurement Haptic { get; set; } = new();
        public U35TouchMeasurement Touch { get; set; } = new();
        public U35PersistenceMeasurement Persistence { get; set; } = new();
        public U35RuntimeCountSample RuntimeCounts { get; set; } = new();
        public List<U35MetricSample> Samples { get; } = new();
    }
}
