using UnityEngine;

namespace VampPon.UnitySpike.U24.ClimaxPolish
{
    public sealed class U24KokuyouInkParticleProof : MonoBehaviour
    {
        [SerializeField] private int particleCount = 28;
        [SerializeField] private bool redBlackLayerVisible = true;
        public int ParticleCount => particleCount;
        public bool RedBlackLayerVisible => redBlackLayerVisible;
    }
}
