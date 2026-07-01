using VampPon.UnitySpike.U16.Battle;

namespace VampPon.UnitySpike.U17.Loop
{
    public static class U17Stage1LoopRuleProof
    {
        public static BattleSessionClearState ResolveClearState(int elapsedSeconds, int defeatedEnemies, bool forceFail = false)
        {
            if (forceFail) return BattleSessionClearState.Fail;
            return elapsedSeconds >= 480 || defeatedEnemies >= 100
                ? BattleSessionClearState.Clear
                : BattleSessionClearState.Fail;
        }

        public static string ExplainRule()
        {
            return "Clear proof: elapsed >= 480 or defeated >= 100. Fail proof: forced fail or below threshold.";
        }
    }
}
