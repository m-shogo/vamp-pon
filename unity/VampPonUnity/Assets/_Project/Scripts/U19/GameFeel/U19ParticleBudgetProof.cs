namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19ParticleBudgetProof
    {
        public int MaxBurstParticles { get; } = 32;
        public int NormalExpTrailParticles { get; } = 6;
        public int KokuyouExpTrailParticles { get; } = 10;

        public bool IsWithinBudget(int requestedParticles)
        {
            return requestedParticles >= 0 && requestedParticles <= MaxBurstParticles;
        }
    }
}
