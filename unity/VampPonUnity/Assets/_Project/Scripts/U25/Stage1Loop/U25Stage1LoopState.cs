using VampPon.UnitySpike.U22.BattleVisual;
using VampPon.UnitySpike.U23.VisualPolish;
using VampPon.UnitySpike.U24.ClimaxPolish;

namespace VampPon.UnitySpike.U25.Stage1Loop
{
    public sealed class U25Stage1LoopState
    {
        public string Phase { get; set; } = "StageSelect";
        public int PlayerHp { get; set; } = 100;
        public int ElapsedSeconds { get; set; }
        public int Level { get; set; } = 1;
        public int Exp { get; set; }
        public int PickupCount { get; set; }
        public int WeaponSlots { get; set; } = 2;
        public int PassiveSlots { get; set; } = 1;
        public string EnemyWaveIntensity { get; set; } = "opening";
        public U22BattleVisualPolishState BattleVisual { get; set; } = new();
        public U23LevelUpCardPolishState LevelUpVisual { get; set; } = new();
        public U23ResultLedgerPolishState ResultVisual { get; set; } = new();
        public U23StageSelectMapPolishState StageSelectVisual { get; set; } = new();
        public U24KokuyouClimaxState KokuyouVisual { get; set; } = new();
        public U24RarePresentationPolishState RareVisual { get; set; } = new();
        public U24EvolutionClimaxState EvolutionVisual { get; set; } = new();
        public U25RunResultModel RunResult { get; set; } = new();
        public U25RewardDraftModel RewardDraft { get; set; } = new();
        public U25StageProgressDraftModel ProgressDraft { get; set; } = new();
        public bool ProductionApproved { get; set; }
    }
}
