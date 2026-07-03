namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35PersistenceMeasurement
    {
        public U35MetricStatus SavePersistenceStatus { get; set; } = U35MetricStatus.NotMeasured;
        public U35MetricStatus RetryStabilityStatus { get; set; } = U35MetricStatus.NotMeasured;
        public string Note { get; set; } = "restart persistence and retry stability need device run evidence";
    }
}
