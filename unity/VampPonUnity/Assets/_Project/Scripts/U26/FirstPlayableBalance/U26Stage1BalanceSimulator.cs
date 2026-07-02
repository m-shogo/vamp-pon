namespace VampPon.UnitySpike.U26.FirstPlayableBalance
{
    public sealed class U26Stage1BalanceSimulator
    {
        public readonly struct Snapshot
        {
            public Snapshot(int elapsedSecond, string waveBucket, int level, int xp, int koCount, bool kokuyouReady, bool evolutionReachable, bool clearReady)
            {
                ElapsedSecond = elapsedSecond;
                WaveBucket = waveBucket;
                Level = level;
                Xp = xp;
                KoCount = koCount;
                KokuyouReady = kokuyouReady;
                EvolutionReachable = evolutionReachable;
                ClearReady = clearReady;
            }

            public int ElapsedSecond { get; }
            public string WaveBucket { get; }
            public int Level { get; }
            public int Xp { get; }
            public int KoCount { get; }
            public bool KokuyouReady { get; }
            public bool EvolutionReachable { get; }
            public bool ClearReady { get; }
        }

        private readonly U26Stage1WaveDraft waveDraft = new();
        private readonly U26Stage1XpDraft xpDraft = new();
        private readonly U26Stage1WeaponPassiveDraft weaponPassiveDraft = new();

        public Snapshot Simulate(int elapsedSecond)
        {
            var wave = waveDraft.At(elapsedSecond);
            var koCount = EstimatedKo(elapsedSecond);
            var xp = EstimatedXp(elapsedSecond, koCount);
            var level = xpDraft.LevelForXp(xp);
            var kokuyouReady = elapsedSecond >= U26Stage1BalanceConstants.KokuyouReadySeconds;
            var evolutionReachable = weaponPassiveDraft.CanDraftEvolution(elapsedSecond, level, level >= 4, elapsedSecond >= 240);
            var clearReady = elapsedSecond >= U26Stage1BalanceConstants.StageClearSeconds;
            return new Snapshot(elapsedSecond, wave.Bucket, level, xp, koCount, kokuyouReady, evolutionReachable, clearReady);
        }

        private static int EstimatedKo(int elapsedSecond)
        {
            if (elapsedSecond <= 0) return 0;
            return elapsedSecond switch
            {
                < 30 => elapsedSecond / 6,
                < 120 => 5 + ((elapsedSecond - 30) / 5),
                < 240 => 23 + ((elapsedSecond - 120) / 4),
                < 360 => 53 + ((elapsedSecond - 240) / 3),
                < 450 => 93 + ((elapsedSecond - 360) / 2),
                _ => 138 + ((elapsedSecond - 450) / 2),
            };
        }

        private int EstimatedXp(int elapsedSecond, int koCount)
        {
            var pickupXp = elapsedSecond < U26Stage1BalanceConstants.OpeningSafetySeconds ? 2 : 3;
            return koCount * pickupXp;
        }
    }
}
