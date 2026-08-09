using UnityEngine;

namespace VampPon.UnitySpike.UI
{
    public static class AppQualityAssetProvider
    {
        private const string Root = "U45Candidates/UI/";

        public static Sprite StageSelectMapPanel =>
            VisualBatchAssetProvider.Prefer(
                VisualBatchAssetProvider.StageMapPaperBase,
                Load("u45-stage-select-map-panel"));

        public static Sprite StageCardFrame =>
            VisualBatchAssetProvider.Prefer(
                VisualBatchAssetProvider.SelectedDestinationFrame,
                Load("u45-stage-card-frame"));

        public static Sprite BattleHudTopFrame => Load("u45-battle-hud-top-frame");
        public static Sprite BattleInventorySlotFrame => Load("u45-battle-inventory-slot-frame");
        public static Sprite VirtualStickRing => Load("u45-virtual-stick-ring");
        public static Sprite VirtualStickKnob => Load("u45-virtual-stick-knob");

        public static Sprite LevelUpCardCommon =>
            VisualBatchAssetProvider.Prefer(
                VisualBatchAssetProvider.LevelUpCardNormal,
                Load("u45-levelup-card-common"));

        public static Sprite LevelUpCardRare =>
            VisualBatchAssetProvider.Prefer(
                VisualBatchAssetProvider.LevelUpCardRare,
                Load("u45-levelup-card-rare"));

        public static Sprite LevelUpCardEvolution =>
            VisualBatchAssetProvider.Prefer(
                VisualBatchAssetProvider.LevelUpCardEvolution,
                Load("u45-levelup-card-evolution"));

        public static Sprite SmallLanternAccent => Load("u45-small-lantern-accent");
        public static Sprite BlackInkDivider => Load("u45-black-ink-divider");
        public static Sprite PaperButtonFrame => Load("u45-paper-button-frame");

        public static Sprite LevelUpCardFor(bool isRare, bool isEvolution)
        {
            if (isEvolution)
                return LevelUpCardEvolution;
            return isRare ? LevelUpCardRare : LevelUpCardCommon;
        }

        private static Sprite Load(string assetId) => Resources.Load<Sprite>(Root + assetId);
    }
}
