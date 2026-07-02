using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U16.Battle;
using VampPon.UnitySpike.U18.Kokuyou;
using VampPon.UnitySpike.U19.GameFeel;
using VampPon.UnitySpike.U20.MobileQA;

namespace VampPon.UnitySpike.U21.VerticalSlice
{
    public sealed class U21Stage1VerticalSliceState
    {
        public StageStartRequest StageStartRequest { get; set; } = StageStartRequest.Sample;
        public BattleSessionStatsCollector BattleStatsCollector { get; set; }
        public U19GameFeelProofState GameFeelState { get; set; } = new();
        public KokuyouRuntimeState KokuyouRuntimeState { get; set; } = KokuyouRuntimeState.Idle;
        public U20PerformanceBudgetReport PerformanceBudget { get; set; } = new();
        public U21Stage1VerticalSlicePhase CurrentPhase { get; set; } = U21Stage1VerticalSlicePhase.NotStarted;
        public int ElapsedSeconds { get; set; }
        public int PlayerLevel { get; set; } = 1;
        public int CurrentExp { get; set; }
        public int DefeatedEnemies { get; set; }
        public int CollectedFragments { get; set; }
        public int CollectedMemories { get; set; }
        public int CollectedHearts { get; set; }
        public string[] DroppedItems { get; set; } = new[] { "EXP", "Heart", "Memory" };
        public int LevelUpCount { get; set; }
        public bool RareTriggered { get; set; }
        public bool EvolutionReady { get; set; }
        public bool EvolutionTriggered { get; set; }
        public bool KokuyouActivated { get; set; }
        public BattleSessionClearState ClearState { get; set; } = BattleSessionClearState.Fail;
        public BattleResultSummary LastResultSummary { get; set; }
        public ResultPresentationModel LastResultPresentationModel { get; set; }
        public StageSelectPresentationModel LastStageSelectPresentationModel { get; set; }
        public string LastProofNote { get; set; } = "U21 vertical slice proof only / productionApproved=0";
    }
}
