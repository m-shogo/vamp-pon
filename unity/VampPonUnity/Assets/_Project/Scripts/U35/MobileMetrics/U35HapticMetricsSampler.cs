namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35HapticMetricsSampler
    {
        private int hapticEventCount;

        public void RecordHapticEvent()
        {
            hapticEventCount++;
        }

        public U35HapticMeasurement BuildNotMeasuredMeasurement()
        {
            return new U35HapticMeasurement
            {
                HapticBehaviorStatus = U35MetricStatus.NotMeasured,
                HapticEventCount = hapticEventCount,
                Note = "Editor haptic adapter is no-op; mobile hardware behavior is NOT_MEASURED",
            };
        }
    }
}
