using UnityEngine;

namespace VampPon.UnitySpike.U18.Kokuyou
{
    public sealed class KokuyouGaugeProof
    {
        public KokuyouGaugeProof(int max = 100)
        {
            Max = max <= 0 ? 100 : max;
        }

        public int Current { get; private set; }
        public int Max { get; }
        public float Normalized => Max <= 0 ? 0f : Mathf.Clamp01(Current / (float)Max);
        public bool IsReady => Current >= Max;

        public void Add(int amount)
        {
            if (amount <= 0) return;
            Current = Mathf.Clamp(Current + amount, 0, Max);
        }

        public void Fill()
        {
            Current = Max;
        }

        public void Reset()
        {
            Current = 0;
        }
    }
}
