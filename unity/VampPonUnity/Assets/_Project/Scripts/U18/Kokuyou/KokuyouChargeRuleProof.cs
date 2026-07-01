namespace VampPon.UnitySpike.U18.Kokuyou
{
    public static class KokuyouChargeRuleProof
    {
        public const int DamageTakenCharge = 25;

        public static void ProofDamageTaken(KokuyouGaugeProof gauge)
        {
            gauge?.Add(DamageTakenCharge);
        }

        public static void ProofFillGauge(KokuyouGaugeProof gauge)
        {
            gauge?.Fill();
        }
    }
}
