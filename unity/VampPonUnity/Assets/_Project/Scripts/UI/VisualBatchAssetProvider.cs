using UnityEngine;

namespace VampPon.UnitySpike.UI
{
    /// <summary>
    /// Optional landing zone for the next authored visual batch. Missing assets
    /// intentionally return null so current production/candidate assets remain
    /// the fallback until a generated family is actually staged into Resources.
    /// Native text and interaction never depend on these sprites existing.
    ///
    /// This provider intentionally exposes one Sprite per runtime surface. Sprite-sheet
    /// atlases require an explicit sliced-import/lookup contract and must not be smuggled
    /// through Resources.Load&lt;Sprite&gt; as if the whole sheet were one UI frame.
    /// </summary>
    public static class VisualBatchAssetProvider
    {
        private const string Root = "VisualBatchV1/UI/";

        public static Sprite StageMapPaperBase => Load("stage-map-paper-base");
        public static Sprite SelectedDestinationFrame => Load("selected-destination-frame");
        public static Sprite StationRouteIcon => Load("station-route-icon");

        public static Sprite ResultMemoryPage => Load("memory-page-base");
        public static Sprite ResultRankSeal => Load("result-rank-seal");
        public static Sprite ResultRewardCard => Load("result-reward-card");
        public static Sprite ResultStatChip => Load("result-stat-chip");

        public static Sprite CollectionPage => Load("collection-page-base");
        public static Sprite CollectionEntryUnlocked => Load("entry-card-unlocked");
        public static Sprite CollectionEntryLocked => Load("entry-card-locked");
        public static Sprite CollectionTabActive => Load("collection-tab-active");
        public static Sprite CollectionTabInactive => Load("collection-tab-inactive");
        public static Sprite CollectionNewSeal => Load("new-seal");
        public static Sprite CollectionDetailPage => Load("detail-memory-page");

        public static Sprite LevelUpCardNormal => Load("levelup-card-normal");
        public static Sprite LevelUpCardSelected => Load("levelup-card-selected");
        public static Sprite LevelUpCardRare => Load("levelup-card-rare");
        public static Sprite LevelUpCardEvolution => Load("levelup-card-evolution");

        // Battle remains native HUD/data first. These are material/chrome replacements only,
        // never full-screen HUD screenshots or baked gameplay text.
        public static Sprite BattleHudTopFrame => Load("battle-hud-top-frame");
        public static Sprite BattleHudInventoryPanel => Load("battle-hud-inventory-panel");
        public static Sprite BattleHudSlotFrame => Load("battle-hud-slot-frame");
        public static Sprite BattleVirtualStickRing => Load("battle-virtual-stick-ring");
        public static Sprite BattleVirtualStickKnob => Load("battle-virtual-stick-knob");

        public static Sprite Prefer(Sprite preferred, Sprite fallback) => preferred != null ? preferred : fallback;

        private static Sprite Load(string assetId) => Resources.Load<Sprite>(Root + assetId);
    }
}
