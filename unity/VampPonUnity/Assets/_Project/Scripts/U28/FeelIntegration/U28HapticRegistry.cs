using System;
using System.Collections.Generic;

namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28HapticRegistry
    {
        private readonly Dictionary<U28HapticEventId, U28HapticDefinition> definitions = new();

        public U28HapticRegistry()
        {
            Add(U28HapticEventId.None, 0f, 0f, 0f, "no haptic", "no-op");
            Add(U28HapticEventId.LightTap, 0.18f, 0.025f, 0.08f, "Editor no-op; iOS / Android future adapter", "user setting can disable");
            Add(U28HapticEventId.SoftPickup, 0.22f, 0.035f, 0.10f, "Editor no-op; iOS / Android future adapter", "pickup feedback not constant");
            Add(U28HapticEventId.CardSelect, 0.24f, 0.030f, 0.12f, "Editor no-op; iOS / Android future adapter", "short card tap");
            Add(U28HapticEventId.Damage, 0.50f, 0.070f, 0.25f, "Editor no-op; iOS / Android future adapter", "avoid repeated damage spam");
            Add(U28HapticEventId.RarePulse, 0.34f, 0.060f, 0.35f, "Editor no-op; iOS / Android future adapter", "special but light");
            Add(U28HapticEventId.EvolutionComplete, 0.56f, 0.090f, 0.60f, "Editor no-op; iOS / Android future adapter", "medium completion");
            Add(U28HapticEventId.KokuyouReady, 0.30f, 0.050f, 0.45f, "Editor no-op; iOS / Android future adapter", "light warning");
            Add(U28HapticEventId.KokuyouActivation, 0.68f, 0.120f, 1.00f, "Editor no-op; iOS / Android future adapter", "stronger dark activation");
            Add(U28HapticEventId.ResultStamp, 0.42f, 0.060f, 0.35f, "Editor no-op; iOS / Android future adapter", "paper stamp");
            Add(U28HapticEventId.UnlockReveal, 0.30f, 0.050f, 0.30f, "Editor no-op; iOS / Android future adapter", "warm reveal");
        }

        public IReadOnlyCollection<U28HapticDefinition> All => definitions.Values;
        public U28HapticDefinition Get(U28HapticEventId id) => definitions.TryGetValue(id, out var definition) ? definition : throw new ArgumentOutOfRangeException(nameof(id), id, "Unknown U28 haptic event");

        private void Add(U28HapticEventId id, float intensity, float duration, float cooldown, string platformNote, string futureNote)
        {
            definitions[id] = new U28HapticDefinition(id, intensity, duration, cooldown, platformNote, futureNote);
        }
    }
}
