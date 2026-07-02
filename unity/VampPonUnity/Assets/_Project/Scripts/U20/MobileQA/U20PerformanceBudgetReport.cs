namespace VampPon.UnitySpike.U20.MobileQA
{
    public sealed class U20PerformanceBudgetReport
    {
        public int ActiveProofObjectCount { get; set; }
        public int PeakProofParticleCount { get; set; }
        public float TimeScaleFinal { get; set; } = 1f;
        public int ScreenshotCaptureCount { get; set; }
        public string GcRiskNote { get; set; } = "No combat Update allocation hotspot added in U20 proof.";

        public bool WithinBudget =>
            ActiveProofObjectCount <= U20MobileQABaseline.MaxProofObjectCount
            && PeakProofParticleCount <= U20MobileQABaseline.MaxProofBurstParticles
            && TimeScaleFinal > 0.999f
            && TimeScaleFinal < 1.001f;
    }
}
