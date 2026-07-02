namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27RetryFlowModel
    {
        public string NextPhase { get; set; } = "StageSelect";
        public bool SavePreserved { get; set; } = true;
        public bool RetryStartsStage1 { get; set; } = true;
        public bool ResetDebugAvailableForVerification { get; set; } = true;
        public string DebugResetAction { get; set; } = "ResetProofDebug";
    }
}
