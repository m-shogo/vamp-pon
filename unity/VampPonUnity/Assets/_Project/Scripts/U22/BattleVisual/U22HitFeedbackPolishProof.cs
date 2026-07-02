using UnityEngine;

namespace VampPon.UnitySpike.U22.BattleVisual
{
    public sealed class U22HitFeedbackPolishProof : MonoBehaviour
    {
        [SerializeField] private bool hitFlashVisible = true;
        [SerializeField] private bool inkBurstVisible = true;
        [SerializeField] private bool lanternPulseVisible = true;
        [SerializeField] private bool cameraImpulseLightweight = true;

        public bool HitFlashVisible => hitFlashVisible;
        public bool InkBurstVisible => inkBurstVisible;
        public bool LanternPulseVisible => lanternPulseVisible;
        public bool CameraImpulseLightweight => cameraImpulseLightweight;
    }
}
