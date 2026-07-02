using VampPon.UnitySpike.U25.Stage1Loop;

namespace VampPon.UnitySpike.U26.FirstPlayableBalance
{
    public sealed class U26Stage1FirstPlayableBalanceState
    {
        public U25Stage1LoopState U25Loop { get; } = new();
        public U26Stage1BalanceConstants Constants { get; } = new();
        public U26Stage1WaveDraft WaveDraft { get; } = new();
        public U26Stage1XpDraft XpDraft { get; } = new();
        public U26Stage1DropDraft DropDraft { get; } = new();
        public U26Stage1WeaponPassiveDraft WeaponPassiveDraft { get; } = new();
        public bool ProductionApproved => U26Stage1BalanceConstants.ProductionApproved;
        public bool FirstThirtySecondsReadable => WaveDraft.At(0).Bucket == "opening" && XpDraft.LevelForXp(8) == 2;
    }
}
