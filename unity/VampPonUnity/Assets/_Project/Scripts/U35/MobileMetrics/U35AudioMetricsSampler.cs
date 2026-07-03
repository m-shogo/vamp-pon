using VampPon.UnitySpike.U29.PerformanceMobile;

namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35AudioMetricsSampler
    {
        public U35AudioMeasurement BuildEditorOnlyBudgetMeasurement()
        {
            return new U35AudioMeasurement
            {
                AudioLatencyStatus = U35MetricStatus.NotMeasured,
                AudioClippingStatus = U35MetricStatus.EditorOnly,
                ActiveVoicesCount = U29Stage1PerformanceConstants.MaxActiveAudioVoices,
                Note = "Editor can verify routing/count budget only; mobile audio latency is NOT_MEASURED",
            };
        }
    }
}
