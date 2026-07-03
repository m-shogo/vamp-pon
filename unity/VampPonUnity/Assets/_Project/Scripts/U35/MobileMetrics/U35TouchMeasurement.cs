namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35TouchMeasurement
    {
        public U35MetricStatus TouchResponsivenessStatus { get; set; } = U35MetricStatus.NotMeasured;
        public float? TouchLatencyMs { get; set; }
        public string Note { get; set; } = "touch responsiveness cannot be inferred from mouse input";
    }
}
