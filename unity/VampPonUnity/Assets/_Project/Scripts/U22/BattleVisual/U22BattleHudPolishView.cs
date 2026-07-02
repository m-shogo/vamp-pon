using UnityEngine;

namespace VampPon.UnitySpike.U22.BattleVisual
{
    public sealed class U22BattleHudPolishView : MonoBehaviour
    {
        [SerializeField] private string hudPolicy = "thin top HUD / short chips / readable Kokuyou gauge";
        public string HudPolicy => hudPolicy;
    }
}
