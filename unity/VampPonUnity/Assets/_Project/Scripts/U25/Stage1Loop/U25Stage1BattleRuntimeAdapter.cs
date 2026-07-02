using UnityEngine;
using VampPon.UnitySpike.U22.BattleVisual;

namespace VampPon.UnitySpike.U25.Stage1Loop
{
    public static class U25Stage1BattleRuntimeAdapter
    {
        public static void ApplyBattleSnapshot(U25Stage1LoopState state)
        {
            state.BattleVisual = new U22BattleVisualPolishState
            {
                PlayerHpNormalized = Mathf.Clamp01(state.PlayerHp / 100f),
                PlayerLevel = state.Level,
                CurrentExpNormalized = Mathf.Clamp01(state.Exp / 100f),
                ExpPickupVisualCount = 5,
                EnemyVisualCount = state.EnemyWaveIntensity == "opening" ? 4 : 7,
                ProjectileVisualCount = 3,
                KokuyouGaugeNormalized = state.KokuyouVisual.ReadyVisual ? 1f : 0.66f,
                KokuyouReady = state.KokuyouVisual.ReadyVisual,
                KokuyouActive = state.Phase == "KokuyouActive",
                FragmentCount = state.RunResult.CollectedFragments,
                MemoryCount = state.RunResult.CollectedMemories,
                LastHitFeedback = true,
                LastPickupFeedback = true,
                LastKokuyouFeedback = state.KokuyouVisual.ReadyVisual,
                ParticleCount = 30,
                ActiveObjectCount = 132,
                TimeScaleFinal = Time.timeScale,
                PhaseLabel = state.Phase,
            };
        }
    }
}
