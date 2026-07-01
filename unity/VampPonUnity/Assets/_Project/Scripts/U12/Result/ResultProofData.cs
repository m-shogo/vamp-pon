namespace VampPon.UnitySpike.U12.Result
{
    public sealed class ResultProofData
    {
        public ResultProofData(
            string rank,
            int memoryCount,
            int fragmentCount,
            int blessingCount,
            string elapsedTime,
            int defeatedEnemies,
            string[] rewardCards)
        {
            Rank = rank;
            MemoryCount = memoryCount;
            FragmentCount = fragmentCount;
            BlessingCount = blessingCount;
            ElapsedTime = elapsedTime;
            DefeatedEnemies = defeatedEnemies;
            RewardCards = rewardCards;
        }

        public string Rank { get; }
        public int MemoryCount { get; }
        public int FragmentCount { get; }
        public int BlessingCount { get; }
        public string ElapsedTime { get; }
        public int DefeatedEnemies { get; }
        public string[] RewardCards { get; }

        public string MemoryCountLabel => $"拾った記憶 {MemoryCount}";
        public string[] StatsLabels => new[]
        {
            $"欠片 {FragmentCount}",
            $"記憶 {MemoryCount}",
            $"加護 +{BlessingCount}",
        };

        public static ResultProofData Sample => new(
            "A",
            3,
            12,
            3,
            "08:00",
            128,
            new[] { "記憶", "墨", "灯" });
    }
}
