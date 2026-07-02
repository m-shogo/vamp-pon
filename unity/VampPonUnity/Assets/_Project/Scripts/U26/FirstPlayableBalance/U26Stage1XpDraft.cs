namespace VampPon.UnitySpike.U26.FirstPlayableBalance
{
    public sealed class U26Stage1XpDraft
    {
        private static readonly int[] LevelThresholds = { 0, 8, 20, 38, 62, 92, 130, 176 };

        public int XpPerPickup(int elapsedSecond) => elapsedSecond < U26Stage1BalanceConstants.OpeningSafetySeconds ? 2 : 3;
        public int ChoiceCount => U26Stage1BalanceConstants.ChoiceCount;

        public int LevelForXp(int xp)
        {
            var level = 1;
            for (var i = 1; i < LevelThresholds.Length; i++)
            {
                if (xp >= LevelThresholds[i]) level = i + 1;
            }

            return level;
        }

        public int NextThreshold(int level)
        {
            var index = level - 1;
            return index >= 0 && index < LevelThresholds.Length ? LevelThresholds[index] : LevelThresholds[LevelThresholds.Length - 1];
        }
    }
}
