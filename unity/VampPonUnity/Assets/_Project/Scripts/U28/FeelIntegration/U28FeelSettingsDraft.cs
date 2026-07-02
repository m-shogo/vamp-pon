namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28FeelSettingsDraft
    {
        public const float DefaultMasterVolume = 0.85f;
        public const float DefaultSeVolume = 0.78f;
        public const bool DefaultHapticEnabled = true;
        public const bool DefaultReduceIntenseEffects = false;

        public float MasterVolume { get; set; } = DefaultMasterVolume;
        public float SeVolume { get; set; } = DefaultSeVolume;
        public bool HapticEnabled { get; set; } = DefaultHapticEnabled;
        public bool ReduceIntenseEffects { get; set; } = DefaultReduceIntenseEffects;
        public string AccessibilityFutureNote { get; set; } = "future settings UI can reduce intense effects and disable haptic";
    }
}
