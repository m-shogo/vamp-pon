using VampPon.UnitySpike.U28.FeelIntegration;
using VampPon.UnitySpike.U29.PerformanceMobile;

namespace VampPon.UnitySpike.U39.AudioReadiness
{
    public sealed class U39AudioClippingGuard
    {
        private readonly U29AudioPerformanceBudget budget = new();

        public int MaxActiveVoices => budget.MaxActiveVoices;
        public int MaxLowPriorityVoices => budget.MaxLowPriorityVoices;
        public bool DuplicateSuppressionEnabled { get; set; } = true;
        public bool MissingClipFallbackEnabled { get; set; } = true;
        public bool MissingMixerFallbackEnabled { get; set; } = true;

        public bool CanPlay(U28AudioPriority priority, int activeVoices, int lowPriorityVoices)
        {
            return budget.CanPlay(priority, activeVoices, lowPriorityVoices);
        }

        public float CooldownFor(U28AudioEventDefinition definition)
        {
            if (definition.Priority == U28AudioPriority.Low) return 0.06f;
            return definition.Category == U28AudioCategory.Climax ? 0.60f : 0.18f;
        }

        public string PeakRiskFor(float peakEstimate, U28AudioPriority priority)
        {
            if (peakEstimate >= 0.20f || priority == U28AudioPriority.Critical) return "medium";
            return "low";
        }
    }
}
