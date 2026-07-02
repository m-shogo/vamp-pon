namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19HealingDropProof
    {
        public int ProofHealAmount { get; } = 20;

        public void CollectManually(U19GameFeelProofState state, U19FeedbackHookProof feedback)
        {
            state?.CollectHeart();
            feedback?.OnHealingDropCollect();
        }
    }
}
