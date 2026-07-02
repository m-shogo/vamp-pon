namespace VampPon.UnitySpike.U31.MobileQa
{
    public sealed class U31QaMeasurementRecord
    {
        public string ActualFps { get; set; } = "NOT_MEASURED";
        public string Memory { get; set; } = "NOT_MEASURED";
        public string Thermal { get; set; } = "NOT_MEASURED";
        public string GcAllocation { get; set; } = "NOT_MEASURED";
        public string DrawCall { get; set; } = "NOT_MEASURED";
        public string AudioLatency { get; set; } = "NOT_MEASURED";
        public string HapticStatus { get; set; } = "NOT_MEASURED";
        public string MeasurementNote { get; set; } = "Editor QA only; mobile device metrics are not measured.";
    }
}
