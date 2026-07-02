namespace VampPon.UnitySpike.U24.ClimaxPolish
{
    public static class U24KokuyouClimaxPresenter
    {
        public static string BuildSummary(U24KokuyouClimaxState state)
        {
            return state == null
                ? "Kokuyou climax pending"
                : $"ready={state.ReadyVisual} / cutin={state.ActivationCutin} / active={state.ActiveVisual} / ending={state.EndingVisual}";
        }
    }
}
