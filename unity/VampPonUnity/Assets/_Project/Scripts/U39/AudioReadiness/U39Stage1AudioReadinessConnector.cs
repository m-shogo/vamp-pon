using System.Collections.Generic;
using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U39.AudioReadiness
{
    public sealed class U39Stage1AudioReadinessConnector
    {
        private readonly U28AudioEventRegistry registry = new();
        private readonly U39FinalCandidateClipLibrary finalCandidateLibrary;
        private readonly U39AudioMixerRoutingMap routingMap = new();
        private readonly U39AudioClippingGuard clippingGuard = new();

        public U39Stage1AudioReadinessConnector(string projectRoot)
        {
            finalCandidateLibrary = new U39FinalCandidateClipLibrary(projectRoot);
        }

        public List<string> ConnectedEvents { get; } = new();
        public List<string> MissingFinalCandidateClips { get; } = new();
        public List<string> GuardedEvents { get; } = new();

        public bool Connect(U28AudioEventId id, int activeVoices = 0, int lowPriorityVoices = 0)
        {
            var definition = registry.Get(id);
            if (!finalCandidateLibrary.Exists(definition))
            {
                MissingFinalCandidateClips.Add($"{id}:{definition.ClipFileName}");
                return false;
            }

            var canPlay = clippingGuard.CanPlay(definition.Priority, activeVoices, lowPriorityVoices);
            var group = routingMap.GroupFor(definition.Category);
            ConnectedEvents.Add($"{id}->{group}");
            if (!canPlay) GuardedEvents.Add($"{id}:voice-limit");
            return canPlay;
        }
    }
}
