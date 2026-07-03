namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35HapticMeasurement
    {
        public U35MetricStatus HapticBehaviorStatus { get; set; } = U35MetricStatus.NotMeasured;
        public int HapticEventCount { get; set; }
        public string Note { get; set; } = "device haptic behavior requires mobile hardware";
    }
}
