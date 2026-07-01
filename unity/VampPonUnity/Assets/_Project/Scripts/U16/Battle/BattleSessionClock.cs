namespace VampPon.UnitySpike.U16.Battle
{
    public sealed class BattleSessionClock
    {
        public BattleSessionClock(int initialElapsedSeconds = 0)
        {
            ElapsedSeconds = initialElapsedSeconds < 0 ? 0 : initialElapsedSeconds;
        }

        public int ElapsedSeconds { get; private set; }

        public void SetElapsedSeconds(int elapsedSeconds)
        {
            ElapsedSeconds = elapsedSeconds < 0 ? 0 : elapsedSeconds;
        }

        public void AddSeconds(int seconds)
        {
            if (seconds <= 0) return;
            ElapsedSeconds += seconds;
        }

        public static string FormatElapsed(int elapsedSeconds)
        {
            var safe = elapsedSeconds < 0 ? 0 : elapsedSeconds;
            var minutes = safe / 60;
            var seconds = safe % 60;
            return $"{minutes:00}:{seconds:00}";
        }
    }
}
