using UnityEngine;

namespace VampPon.UnitySpike.U22.BattleVisual
{
    public sealed class U22KokuyouGaugeHudProof : MonoBehaviour
    {
        [SerializeField, Range(0f, 1f)] private float gaugeNormalized = 1f;
        [SerializeField] private bool ready = true;
        [SerializeField] private bool active;

        public float GaugeNormalized => gaugeNormalized;
        public bool Ready => ready;
        public bool Active => active;
    }
}
