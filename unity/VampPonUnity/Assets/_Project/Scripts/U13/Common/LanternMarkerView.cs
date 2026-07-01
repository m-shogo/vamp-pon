using UnityEngine;

namespace VampPon.UnitySpike.U13.Common
{
    public class LanternMarkerView : MonoBehaviour
    {
        [SerializeField] private bool glowAnimationCandidate = true;

        public bool GlowAnimationCandidate => glowAnimationCandidate;
    }
}
