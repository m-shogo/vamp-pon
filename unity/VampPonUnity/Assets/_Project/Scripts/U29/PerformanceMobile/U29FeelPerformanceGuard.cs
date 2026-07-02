using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U29.PerformanceMobile
{
    public sealed class U29FeelPerformanceGuard
    {
        private readonly U29AudioPerformanceBudget audioBudget = new();
        private readonly U29HapticPerformanceBudget hapticBudget = new();

        public bool CanPlayAudio(U28AudioPriority priority, int activeVoices, int lowPriorityVoices)
        {
            return audioBudget.CanPlay(priority, activeVoices, lowPriorityVoices);
        }

        public float HapticCooldownFor(U28HapticEventId id)
        {
            return hapticBudget.CooldownFor(id);
        }

        public bool ShouldSuppressUnlockRepeat(bool unlockRevealAlreadyPlayed)
        {
            return unlockRevealAlreadyPlayed;
        }
    }
}
