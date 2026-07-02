using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U21.VerticalSlice;

namespace VampPon.UnitySpike.U22.BattleVisual
{
    public sealed class U22Stage1PlayingVisualController : MonoBehaviour
    {
        [SerializeField] private U22Stage1PlayingVisualView view;

        public U22BattleVisualPolishConfig Config { get; set; } = U22BattleVisualPolishConfig.Default;
        public U22BattleVisualPolishState State { get; private set; } = new();

        public U22BattleVisualPolishState RenderFromU21(U21Stage1VerticalSliceState u21)
        {
            BattleTimeScaleService.ForceRestore();
            Config ??= U22BattleVisualPolishConfig.Default;
            State = U22BattleVisualPolishPresenter.FromU21(u21, Config);
            State.TimeScaleFinal = Time.timeScale;
            view?.Render(State);
            return State;
        }

        public U22BattleVisualPolishState RenderSample()
        {
            var host = new GameObject("U22U21VerticalSliceSource");
            try
            {
                var u21 = host.AddComponent<U21Stage1VerticalSliceController>();
                return RenderFromU21(u21.RunClearPath());
            }
            finally
            {
                DestroyImmediate(host);
                BattleTimeScaleService.ForceRestore();
            }
        }
    }
}
