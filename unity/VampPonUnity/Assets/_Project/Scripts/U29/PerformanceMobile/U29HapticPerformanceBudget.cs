using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U29.PerformanceMobile
{
    public sealed class U29HapticPerformanceBudget
    {
        public float CooldownFor(U28HapticEventId id)
        {
            return id switch
            {
                U28HapticEventId.Damage => U29Stage1PerformanceConstants.DamageHapticCooldownSeconds,
                U28HapticEventId.KokuyouActivation => U29Stage1PerformanceConstants.KokuyouHapticCooldownSeconds,
                _ => U29Stage1PerformanceConstants.LightHapticCooldownSeconds,
            };
        }
    }
}
