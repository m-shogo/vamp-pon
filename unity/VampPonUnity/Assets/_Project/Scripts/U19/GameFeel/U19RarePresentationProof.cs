using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19RarePresentationProof
    {
        private const string Owner = "u19-rare-proof";

        public bool Visible { get; private set; }
        public U19LevelUpCardProof RareCard { get; } = new("夜明け前の記憶", "rare proof / ランタン光が強くなる", true);

        public void Show(U19GameFeelProofState state, U19FeedbackHookProof feedback)
        {
            Visible = true;
            if (state != null)
            {
                state.RareTriggered = true;
                state.LastFeelEvent = "Rare";
            }
            feedback?.OnRareAppear();
            BattleTimeScaleService.TriggerHitStop(Owner, 0.05f, 0.35f);
        }

        public void Hide()
        {
            Visible = false;
            BattleTimeScaleService.ReleaseHitStop(Owner);
        }
    }
}
