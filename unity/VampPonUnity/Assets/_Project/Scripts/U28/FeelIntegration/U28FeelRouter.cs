namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28FeelRouter
    {
        private readonly U28AudioEventRegistry audioRegistry;
        private readonly U28AudioRouter audioRouter;
        private readonly U28HapticRouter hapticRouter;

        public U28FeelRouter(U28AudioEventRegistry audioRegistry, U28AudioRouter audioRouter, U28HapticRouter hapticRouter)
        {
            this.audioRegistry = audioRegistry;
            this.audioRouter = audioRouter;
            this.hapticRouter = hapticRouter;
        }

        public U28AudioRouter Audio => audioRouter;
        public U28HapticRouter Haptic => hapticRouter;

        public bool Play(U28AudioEventId id, float intensity = 1f)
        {
            var definition = audioRegistry.Get(id);
            var played = audioRouter.Play(id, intensity);
            hapticRouter.Play(definition.HapticPairing);
            return played;
        }
    }
}
