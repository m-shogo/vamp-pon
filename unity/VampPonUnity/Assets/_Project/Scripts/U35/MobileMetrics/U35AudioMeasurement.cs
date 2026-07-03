namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35AudioMeasurement
    {
        public U35MetricStatus AudioLatencyStatus { get; set; } = U35MetricStatus.NotMeasured;
        public U35MetricStatus AudioClippingStatus { get; set; } = U35MetricStatus.NotMeasured;
        public int ActiveVoicesCount { get; set; }
        public string Note { get; set; } = "draft SE only; final SE not approved";
    }
}
