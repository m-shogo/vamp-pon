namespace VampPon.UnitySpike.U23.VisualPolish
{
    public static class U23StageRouteNodePolishPresenter
    {
        public static string BuildSummary(U23StageSelectMapPolishState state)
        {
            return state == null
                ? "StageSelect polish pending"
                : $"route={state.HasRouteLine} / active={state.HasActiveNode} / locked={state.HasLockedNode} / stamp={state.HasPreviousResultStamp}";
        }
    }
}
