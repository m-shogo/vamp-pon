namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public readonly struct U28HapticDefinition
    {
        public U28HapticDefinition(U28HapticEventId id, float intensityDraft, float durationSecondsDraft, float cooldownSeconds, string platformSupportNote, string futureNote)
        {
            Id = id;
            IntensityDraft = intensityDraft;
            DurationSecondsDraft = durationSecondsDraft;
            CooldownSeconds = cooldownSeconds;
            PlatformSupportNote = platformSupportNote;
            FutureNote = futureNote;
        }

        public U28HapticEventId Id { get; }
        public float IntensityDraft { get; }
        public float DurationSecondsDraft { get; }
        public float CooldownSeconds { get; }
        public string PlatformSupportNote { get; }
        public string FutureNote { get; }
    }
}
