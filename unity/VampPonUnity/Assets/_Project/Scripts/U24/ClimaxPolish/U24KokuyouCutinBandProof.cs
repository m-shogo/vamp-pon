using UnityEngine;

namespace VampPon.UnitySpike.U24.ClimaxPolish
{
    public sealed class U24KokuyouCutinBandProof : MonoBehaviour
    {
        [SerializeField] private bool cutinBandVisible = true;
        [SerializeField] private bool amberStreakVisible = true;
        public bool CutinBandVisible => cutinBandVisible;
        public bool AmberStreakVisible => amberStreakVisible;
    }
}
