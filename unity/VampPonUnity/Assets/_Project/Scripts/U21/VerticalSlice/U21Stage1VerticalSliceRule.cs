using VampPon.UnitySpike.U16.Battle;
using VampPon.UnitySpike.U17.Loop;

namespace VampPon.UnitySpike.U21.VerticalSlice
{
    public static class U21Stage1VerticalSliceRule
    {
        public static BattleSessionClearState ResolveClearState(U21Stage1VerticalSliceConfig config, int elapsedSeconds, int defeatedEnemies, bool forceFail = false)
        {
            config ??= U21Stage1VerticalSliceConfig.Default;
            if (forceFail) return BattleSessionClearState.Fail;
            if (elapsedSeconds >= config.ProofDurationSeconds || defeatedEnemies >= config.ClearDefeatThreshold)
            {
                return BattleSessionClearState.Clear;
            }

            return U17Stage1LoopRuleProof.ResolveClearState(elapsedSeconds, defeatedEnemies, forceFail);
        }

        public static string ExplainRule()
        {
            return "U21 proof: clear when elapsed >= 480 or defeated >= 100; fail when forced or below proof threshold.";
        }
    }
}
