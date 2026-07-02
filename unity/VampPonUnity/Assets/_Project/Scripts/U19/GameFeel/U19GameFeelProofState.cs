namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19GameFeelProofState
    {
        public int CurrentLevel { get; set; } = 1;
        public int CurrentExp { get; set; }
        public int ExpToNext { get; set; } = 100;
        public int CollectedFragments { get; set; }
        public int CollectedHearts { get; set; }
        public string[] DroppedItems { get; set; } = new[] { "EXP", "Heart", "Memory" };
        public bool RareTriggered { get; set; }
        public bool EvolutionReady { get; set; }
        public bool EvolutionTriggered { get; set; }
        public bool KokuyouActive { get; set; }
        public int ComboCount { get; set; }
        public string LastFeelEvent { get; set; } = "None";
        public float FeelIntensity => KokuyouActive ? 1.35f : 1f;

        public void AddExp(int amount)
        {
            if (amount <= 0) return;
            CurrentExp += amount;
            CollectedFragments += 1;
            ComboCount += 1;
            LastFeelEvent = "ExpCollect";
        }

        public bool IsLevelUpReady => CurrentExp >= ExpToNext;

        public void ApplyLevelUpSelection()
        {
            if (!IsLevelUpReady) return;
            CurrentExp -= ExpToNext;
            CurrentLevel += 1;
            LastFeelEvent = "LevelUp";
        }

        public void CollectHeart()
        {
            CollectedHearts += 1;
            LastFeelEvent = "HealingDrop";
        }
    }
}
