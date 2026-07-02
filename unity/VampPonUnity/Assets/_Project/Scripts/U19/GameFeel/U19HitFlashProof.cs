namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19HitFlashProof
    {
        public float NormalFlashAlpha { get; } = 0.32f;
        public float KokuyouFlashAlpha { get; } = 0.48f;

        public float GetFlashAlpha(bool kokuyouActive)
        {
            return kokuyouActive ? KokuyouFlashAlpha : NormalFlashAlpha;
        }
    }
}
