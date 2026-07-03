using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U39.AudioReadiness
{
    public sealed class U39SeInventoryItem
    {
        public U28AudioEventId EventId { get; set; }
        public string Path { get; set; } = string.Empty;
        public string CurrentUsage { get; set; } = string.Empty;
        public float DurationSeconds { get; set; }
        public float PeakEstimate { get; set; }
        public U28AudioCategory Category { get; set; }
        public U28AudioPriority Priority { get; set; }
        public bool Loop { get; set; }
        public U39SeReadinessStatus Status { get; set; }
        public string Risk { get; set; } = string.Empty;
        public string NextAction { get; set; } = string.Empty;
    }
}
