using VampPon.UnitySpike.U15.Contracts;

namespace VampPon.UnitySpike.U16.Battle
{
    public sealed class BattleSessionStatsCollector
    {
        private readonly StageStartRequest request;
        private readonly BattleSessionClock clock;
        private int defeatedEnemies;
        private int collectedFragments;
        private int collectedMemories;
        private int blessing;
        private int reachedLevel = 1;
        private BattleSessionClearState clearState = BattleSessionClearState.Fail;

        public BattleSessionStatsCollector(StageStartRequest request)
        {
            this.request = request;
            clock = new BattleSessionClock();
        }

        public int DefeatedEnemies => defeatedEnemies;
        public int CollectedFragments => collectedFragments;
        public int CollectedMemories => collectedMemories;
        public int Blessing => blessing;
        public int ReachedLevel => reachedLevel;
        public int ElapsedSeconds => clock.ElapsedSeconds;
        public BattleSessionClearState ClearState => clearState;

        public void AddDefeatedEnemy(int count = 1)
        {
            if (count > 0) defeatedEnemies += count;
        }

        public void AddFragments(int count = 1)
        {
            if (count > 0) collectedFragments += count;
        }

        public void AddMemories(int count = 1)
        {
            if (count > 0) collectedMemories += count;
        }

        public void SetBlessing(int value)
        {
            blessing = value < 0 ? 0 : value;
        }

        public void SetReachedLevel(int value)
        {
            reachedLevel = value < 1 ? 1 : value;
        }

        public void SetElapsedSeconds(int elapsedSeconds)
        {
            clock.SetElapsedSeconds(elapsedSeconds);
        }

        public void SetClearState(BattleSessionClearState state)
        {
            clearState = state;
        }

        public BattleSessionStats BuildFinalStats()
        {
            return new BattleSessionStats(
                request.StageId,
                request.StageTitle,
                request.DifficultyId,
                request.DifficultyLabel,
                clock.ElapsedSeconds,
                defeatedEnemies,
                collectedFragments,
                collectedMemories,
                blessing,
                reachedLevel,
                clearState);
        }
    }
}
