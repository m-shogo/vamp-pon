using UnityEngine;

namespace VampPon.UnitySpike.U22.BattleVisual
{
    public sealed class U22Stage1PlayingVisualView : MonoBehaviour
    {
        [SerializeField] private string hudLabel = "Time 08:00 / HP 72 / Lv 5 / EXP 64";
        [SerializeField] private string inventoryLabel = "欠片 12 / 記憶 3";
        [SerializeField] private string debugLabel = "phase=Stage1 Playing / p=30 / obj=112 / ts=1.0";
        [SerializeField] private string proofLabel = "U22 Battle Visual Proof / productionApproved=0";

        public string HudLabel => hudLabel;
        public string InventoryLabel => inventoryLabel;
        public string DebugLabel => debugLabel;
        public string ProofLabel => proofLabel;

        public void Render(U22BattleVisualPolishState state)
        {
            hudLabel = U22BattleVisualPolishPresenter.BuildHudLabel(state);
            inventoryLabel = U22BattleVisualPolishPresenter.BuildInventoryLabel(state);
            debugLabel = U22BattleVisualPolishPresenter.BuildDebugLabel(state);
            proofLabel = state?.ProofLabel ?? proofLabel;
        }
    }
}
