namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35MetricSample
    {
        public string ScenarioMarker { get; set; } = "not_started";
        public U35MetricStatus Status { get; set; } = U35MetricStatus.NotMeasured;
        public float? AverageFps { get; set; }
        public float? MinFps { get; set; }
        public float? MaxFps { get; set; }
        public float? FrameTimeMs { get; set; }
        public float? MemoryMb { get; set; }
        public float? PeakMemoryMb { get; set; }
        public float? GcAllocPerMinute { get; set; }
        public int? DrawCalls { get; set; }
        public int? Batches { get; set; }
        public string ThermalState { get; set; } = "NOT_MEASURED";
        public string BatteryDrainNote { get; set; } = "NOT_MEASURED";
        public string Note { get; set; } = string.Empty;
    }
}
