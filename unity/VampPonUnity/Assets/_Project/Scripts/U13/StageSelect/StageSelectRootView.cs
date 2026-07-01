using UnityEngine;

namespace VampPon.UnitySpike.U13.StageSelect
{
    public sealed class StageSelectRootView : MonoBehaviour
    {
        [SerializeField] private string routePolicy = "Route A";
        public string RoutePolicy => routePolicy;
    }
}
