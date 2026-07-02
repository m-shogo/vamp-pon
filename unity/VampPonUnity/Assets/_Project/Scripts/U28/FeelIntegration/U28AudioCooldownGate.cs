using System.Collections.Generic;

namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28AudioCooldownGate
    {
        private readonly Dictionary<U28AudioEventId, float> lastPlayedAt = new();
        private readonly Dictionary<U28AudioEventId, int> activePolyphony = new();

        public bool CanPlay(U28AudioEventDefinition definition, float nowSeconds)
        {
            if (lastPlayedAt.TryGetValue(definition.Id, out var last) && nowSeconds - last < definition.CooldownSeconds) return false;
            if (activePolyphony.TryGetValue(definition.Id, out var count) && count >= definition.PolyphonyLimit) return false;
            return true;
        }

        public void MarkPlayed(U28AudioEventDefinition definition, float nowSeconds)
        {
            lastPlayedAt[definition.Id] = nowSeconds;
            activePolyphony.TryGetValue(definition.Id, out var count);
            activePolyphony[definition.Id] = count + 1;
        }

        public void ClearFramePolyphony()
        {
            activePolyphony.Clear();
        }
    }
}
