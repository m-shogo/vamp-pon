using UnityEngine;

namespace VampPon.UnitySpike.U22.BattleVisual
{
    public sealed class U22PickupReadabilityProof : MonoBehaviour
    {
        [SerializeField] private int expFragmentCount = 5;
        [SerializeField] private bool heartDropVisible = true;
        [SerializeField] private bool heartIsMagnetTarget;
        [SerializeField] private bool memoryShardVisible = true;

        public int ExpFragmentCount => expFragmentCount;
        public bool HeartDropVisible => heartDropVisible;
        public bool HeartIsMagnetTarget => heartIsMagnetTarget;
        public bool MemoryShardVisible => memoryShardVisible;
    }
}
