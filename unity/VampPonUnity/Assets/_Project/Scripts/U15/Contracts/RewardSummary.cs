namespace VampPon.UnitySpike.U15.Contracts
{
    public sealed class RewardSummary
    {
        public RewardSummary(string[] rewardCards, int fragments, int memories, int blessing)
        {
            RewardCards = rewardCards ?? new string[0];
            Fragments = fragments;
            Memories = memories;
            Blessing = blessing;
        }

        public string[] RewardCards { get; }
        public int Fragments { get; }
        public int Memories { get; }
        public int Blessing { get; }

        public string[] DisplayLabels => new[]
        {
            $"欠片 {Fragments}",
            $"記憶 {Memories}",
            $"加護 +{Blessing}",
        };

        public static RewardSummary Empty => new(new string[0], 0, 0, 0);
        public static RewardSummary Sample => new(new[] { "記憶", "墨", "灯" }, 12, 3, 3);
    }
}
