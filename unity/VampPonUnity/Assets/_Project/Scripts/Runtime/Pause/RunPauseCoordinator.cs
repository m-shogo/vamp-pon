using System;
using System.Collections.Generic;

namespace VampPon.UnitySpike.Runtime.Pause
{
    public sealed class RunPauseCoordinator
    {
        private readonly HashSet<RunPauseReason> reasons = new();

        public bool IsPaused => reasons.Count > 0;
        public int ReasonCount => reasons.Count;
        public event Action<bool> PauseChanged;

        public bool Acquire(RunPauseReason reason)
        {
            var wasPaused = IsPaused;
            var added = reasons.Add(reason);
            if (added && wasPaused != IsPaused) PauseChanged?.Invoke(IsPaused);
            return added;
        }

        public bool Release(RunPauseReason reason)
        {
            var wasPaused = IsPaused;
            var removed = reasons.Remove(reason);
            if (removed && wasPaused != IsPaused) PauseChanged?.Invoke(IsPaused);
            return removed;
        }

        public bool Contains(RunPauseReason reason) => reasons.Contains(reason);

        public void ResetForRetry()
        {
            var wasPaused = IsPaused;
            reasons.Clear();
            if (wasPaused) PauseChanged?.Invoke(false);
        }

        public void ResetToStageSelect()
        {
            var wasPaused = IsPaused;
            reasons.Clear();
            reasons.Add(RunPauseReason.StageSelect);
            if (!wasPaused) PauseChanged?.Invoke(true);
        }
    }
}
