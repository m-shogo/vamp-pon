using UnityEngine;

namespace VampPon.UnitySpike.U13.Common
{
    public class InkRouteLineView : MonoBehaviour
    {
        [SerializeField] private bool routeBAnimationCandidate;

        public bool RouteBAnimationCandidate => routeBAnimationCandidate;

        public void MarkRouteBAnimationCandidate(bool value)
        {
            routeBAnimationCandidate = value;
        }
    }
}
