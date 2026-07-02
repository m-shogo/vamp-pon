namespace VampPon.UnitySpike.U23.VisualPolish
{
    public static class U23LevelUpCardPolishPresenter
    {
        public static string BuildSummary(U23LevelUpCardPolishState state)
        {
            return state == null
                ? "LevelUp polish pending"
                : $"cards={state.CardCount} / ink={state.HasInkBorder} / icon={state.HasIconSlot} / glow={state.HasSelectedGlow}";
        }
    }
}
