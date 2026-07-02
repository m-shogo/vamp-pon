using System.Collections.Generic;

namespace VampPon.UnitySpike.U29.PerformanceMobile
{
    public sealed class U29SpriteAtlasPolicyModel
    {
        public IReadOnlyList<string> AtlasGroups { get; } = new[]
        {
            "U29Characters: player sprites; exclude generated screenshots",
            "U29Enemies: enemy sprites; exclude design targets",
            "U29ItemsIcons: weapon / passive icons and pickups",
            "U29UiPaper: paper UI, stamps, seals",
            "U29Effects: ink, lantern, climax effect sprites",
        };

        public string DraftAssetStatus { get; set; } = "policy and map only in U29; .spriteatlas packing deferred to U30 to avoid breaking candidate references";
        public bool AddressablesIntroduced { get; set; }
    }
}
