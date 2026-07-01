namespace VampPon.UnitySpike.U13.Result
{
    public sealed class ResultViewModel
    {
        public ResultViewModel(
            string title,
            string rank,
            int fragmentCount,
            int memoryCount,
            int blessingCount,
            string elapsedTime,
            int defeatedEnemies,
            ResultRewardCardViewModel[] rewards,
            string continueLabel)
        {
            Title = title;
            Rank = rank;
            FragmentCount = fragmentCount;
            MemoryCount = memoryCount;
            BlessingCount = blessingCount;
            ElapsedTime = elapsedTime;
            DefeatedEnemies = defeatedEnemies;
            Rewards = rewards;
            ContinueLabel = continueLabel;
        }

        public string Title { get; }
        public string Rank { get; }
        public int FragmentCount { get; }
        public int MemoryCount { get; }
        public int BlessingCount { get; }
        public string ElapsedTime { get; }
        public int DefeatedEnemies { get; }
        public ResultRewardCardViewModel[] Rewards { get; }
        public string ContinueLabel { get; }

        public string[] StatLabels => new[]
        {
            $"欠片 {FragmentCount}",
            $"記憶 {MemoryCount}",
            $"加護 +{BlessingCount}",
            $"時間 {ElapsedTime}",
            $"討伐 {DefeatedEnemies}",
        };

        public static ResultViewModel Sample => new(
            "今夜の記録",
            "A",
            12,
            3,
            3,
            "08:00",
            128,
            new[]
            {
                new ResultRewardCardViewModel("記憶"),
                new ResultRewardCardViewModel("墨"),
                new ResultRewardCardViewModel("灯"),
            },
            "次へ");
    }
}
