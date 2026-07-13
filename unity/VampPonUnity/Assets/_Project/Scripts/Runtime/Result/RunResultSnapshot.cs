using System;
using System.Collections.Generic;

namespace VampPon.UnitySpike.Runtime.Result
{
    public enum RunOutcome { Clear, Fail }

    [Serializable]
    public sealed class RunResultSnapshot
    {
        public string runId;
        public RunOutcome outcome;
        public string stageId;
        public string characterId;
        public double elapsedTime;
        public int defeatedEnemyCount;
        public int collectedFragments;
        public int reachedLevel;
        public List<string> acquiredItemIds = new();
        public List<string> rewardIds = new();
        public List<string> newlyUnlockedIds = new();
        public List<string> evolutionIds = new();
        public int revivalUsedCount;
        public int kokuyouActivationCount;
        public string completedAt;
    }
}
