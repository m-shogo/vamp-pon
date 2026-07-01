namespace VampPon.UnitySpike.U15.Contracts
{
    public sealed class ResultPresentationModel
    {
        public ResultPresentationModel(
            string title,
            string rank,
            string fragmentLabel,
            string memoryLabel,
            string blessingLabel,
            string elapsedLabel,
            string defeatedEnemiesLabel,
            string[] rewardCardLabels,
            string continueLabel)
        {
            Title = title;
            Rank = rank;
            FragmentLabel = fragmentLabel;
            MemoryLabel = memoryLabel;
            BlessingLabel = blessingLabel;
            ElapsedLabel = elapsedLabel;
            DefeatedEnemiesLabel = defeatedEnemiesLabel;
            RewardCardLabels = rewardCardLabels ?? new string[0];
            ContinueLabel = continueLabel;
        }

        public string Title { get; }
        public string Rank { get; }
        public string FragmentLabel { get; }
        public string MemoryLabel { get; }
        public string BlessingLabel { get; }
        public string ElapsedLabel { get; }
        public string DefeatedEnemiesLabel { get; }
        public string[] RewardCardLabels { get; }
        public string ContinueLabel { get; }
    }
}
