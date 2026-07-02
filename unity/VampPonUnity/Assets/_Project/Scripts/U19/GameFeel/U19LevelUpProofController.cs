namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19LevelUpProofController
    {
        public U19LevelUpCardProof[] Cards { get; } =
        {
            new("夜の鉛筆 Lv+1", "小さく黒インクを濃くする"),
            new("紙飛行機 Lv+1", "拾った記憶が少し遠くへ届く"),
            new("街灯の輪 Lv+1", "足元の灯りを少し広げる"),
        };

        public bool IsOpen { get; private set; }

        public bool TryOpen(U19GameFeelProofState state, U19FeedbackHookProof feedback)
        {
            if (state == null || !state.IsLevelUpReady) return false;
            IsOpen = true;
            state.LastFeelEvent = "LevelUpOpen";
            feedback?.OnLevelUpOpen();
            return true;
        }

        public void SelectCard(int index, U19GameFeelProofState state, U19FeedbackHookProof feedback)
        {
            if (!IsOpen || state == null || index < 0 || index >= Cards.Length) return;
            state.ApplyLevelUpSelection();
            IsOpen = false;
            feedback?.OnLevelUpSelect();
        }
    }
}
