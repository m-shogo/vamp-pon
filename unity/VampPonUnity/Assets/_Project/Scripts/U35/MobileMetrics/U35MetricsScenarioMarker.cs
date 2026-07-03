namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35MetricsScenarioMarker
    {
        public string CurrentScenario { get; private set; } = "app_launch_stage_select_idle";

        public void Mark(string scenario)
        {
            CurrentScenario = string.IsNullOrWhiteSpace(scenario) ? "unknown" : scenario;
        }
    }
}
