namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public readonly struct U28AudioEventDefinition
    {
        public U28AudioEventDefinition(U28AudioEventId id, U28AudioCategory category, U28AudioPriority priority, float volumeDraft, float cooldownSeconds, int polyphonyLimit, U28HapticEventId hapticPairing, string clipFileName, string futureProductionNote)
        {
            Id = id;
            Category = category;
            Priority = priority;
            VolumeDraft = volumeDraft;
            CooldownSeconds = cooldownSeconds;
            PolyphonyLimit = polyphonyLimit;
            HapticPairing = hapticPairing;
            ClipFileName = clipFileName;
            FutureProductionNote = futureProductionNote;
        }

        public U28AudioEventId Id { get; }
        public U28AudioCategory Category { get; }
        public U28AudioPriority Priority { get; }
        public float VolumeDraft { get; }
        public float CooldownSeconds { get; }
        public int PolyphonyLimit { get; }
        public U28HapticEventId HapticPairing { get; }
        public string ClipFileName { get; }
        public string FutureProductionNote { get; }
    }
}
