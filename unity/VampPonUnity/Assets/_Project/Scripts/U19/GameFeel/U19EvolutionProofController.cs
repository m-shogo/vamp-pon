namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19EvolutionProofController
    {
        public U19EvolutionRecipeProof Recipe { get; } = new();
        public U19EvolutionPresentationProof Presentation { get; } = new();

        public bool CheckReady(U19GameFeelProofState state, int inkBottleLevel = 5, int lampRingLevel = 5)
        {
            var ready = Recipe.IsReady(inkBottleLevel, lampRingLevel);
            if (state != null)
            {
                state.EvolutionReady = ready;
                if (ready) state.LastFeelEvent = "EvolutionReady";
            }

            return ready;
        }

        public bool Trigger(U19GameFeelProofState state, U19FeedbackHookProof feedback)
        {
            if (state == null || !state.EvolutionReady) return false;
            state.EvolutionTriggered = true;
            state.LastFeelEvent = "Evolution";
            feedback?.OnEvolutionTrigger();
            return true;
        }
    }
}
