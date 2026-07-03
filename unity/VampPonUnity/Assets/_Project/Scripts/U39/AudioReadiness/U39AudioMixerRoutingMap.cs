using System.Collections.Generic;
using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U39.AudioReadiness
{
    public sealed class U39AudioMixerRoutingMap
    {
        private readonly Dictionary<U28AudioCategory, string> groups = new()
        {
            { U28AudioCategory.Battle, "Battle" },
            { U28AudioCategory.Pickup, "Pickup" },
            { U28AudioCategory.Ui, "UI" },
            { U28AudioCategory.Climax, "Climax" },
            { U28AudioCategory.Result, "Result" },
            { U28AudioCategory.StageSelect, "StageSelect" },
        };

        public float MasterVolumeDraft { get; set; } = 0.82f;
        public float SeVolumeDraft { get; set; } = 0.78f;
        public bool AudioMixerReady { get; set; } = false;
        public bool RoutingDraftReady { get; set; } = true;
        public bool MissingMixerFallback { get; set; } = true;
        public string MixerStatus { get; set; } = "routing-draft-not-production-final";

        public string GroupFor(U28AudioCategory category) => groups.TryGetValue(category, out var group) ? group : "Master";
    }
}
