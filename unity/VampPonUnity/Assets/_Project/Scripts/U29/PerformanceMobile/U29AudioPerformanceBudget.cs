using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U29.PerformanceMobile
{
    public sealed class U29AudioPerformanceBudget
    {
        public int MaxActiveVoices { get; set; } = U29Stage1PerformanceConstants.MaxActiveAudioVoices;
        public int MaxLowPriorityVoices { get; set; } = U29Stage1PerformanceConstants.MaxLowPriorityAudioVoices;
        public bool KokuyouActiveLoopOptional { get; set; } = true;
        public string MissingClipFallbackPolicy { get; set; } = "keep U28 safe missing clip fallback";

        public bool CanPlay(U28AudioPriority priority, int activeVoices, int lowPriorityVoices)
        {
            if (activeVoices >= MaxActiveVoices && priority != U28AudioPriority.Critical) return false;
            if (priority == U28AudioPriority.Low && lowPriorityVoices >= MaxLowPriorityVoices) return false;
            return true;
        }
    }
}
