using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19GameFeelImpulseProof
    {
        public float LevelUpPulse { get; } = 1.04f;
        public float RarePulse { get; } = 1.08f;
        public float EvolutionPulse { get; } = 1.16f;
        public float KokuyouPulse { get; } = 1.18f;

        public void TriggerShortSlow(string owner, float seconds, float scale)
        {
            BattleTimeScaleService.TriggerHitStop(owner, seconds, scale);
        }
    }
}
