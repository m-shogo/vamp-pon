using UnityEngine;
using VampPon.UnitySpike.U21.VerticalSlice;

namespace VampPon.UnitySpike.U22.BattleVisual
{
    public static class U22BattleVisualPolishPresenter
    {
        public static U22BattleVisualPolishState FromU21(U21Stage1VerticalSliceState u21, U22BattleVisualPolishConfig config = null)
        {
            config ??= U22BattleVisualPolishConfig.Default;
            var expNormalized = u21 == null ? 0.64f : Mathf.Clamp01(u21.CurrentExp / 100f);
            return new U22BattleVisualPolishState
            {
                PlayerHpNormalized = 0.72f,
                PlayerLevel = Mathf.Max(1, u21?.PlayerLevel ?? 5),
                CurrentExpNormalized = expNormalized,
                DefeatedEnemies = Mathf.Max(0, u21?.DefeatedEnemies ?? 128),
                FragmentCount = Mathf.Max(0, u21?.CollectedFragments ?? 12),
                MemoryCount = Mathf.Max(0, u21?.CollectedMemories ?? 3),
                KokuyouGaugeNormalized = 1f,
                KokuyouReady = true,
                KokuyouActive = u21?.KokuyouActivated ?? false,
                EnemyVisualCount = config.EnemyVisualCount,
                ProjectileVisualCount = config.ProjectileVisualCount,
                ExpPickupVisualCount = config.ExpPickupVisualCount,
                HeartDropVisible = true,
                MemoryShardVisible = true,
                LastHitFeedback = true,
                LastPickupFeedback = true,
                LastKokuyouFeedback = true,
                ParticleCount = config.PeakProofParticleCount,
                ActiveObjectCount = config.ActiveProofObjectCount,
                ProofDebugVisible = config.ProofDebugVisible,
                TimeScaleFinal = Time.timeScale,
                PhaseLabel = u21 == null ? "Stage1 Playing" : u21.CurrentPhase.ToString(),
            };
        }

        public static string BuildHudLabel(U22BattleVisualPolishState state)
        {
            if (state == null) return "Time 08:00 / HP -- / Lv -- / EXP --";
            return $"Time 08:00 / HP {Mathf.RoundToInt(state.PlayerHpNormalized * 100f)} / Lv {state.PlayerLevel} / EXP {Mathf.RoundToInt(state.CurrentExpNormalized * 100f)}";
        }

        public static string BuildInventoryLabel(U22BattleVisualPolishState state)
        {
            if (state == null) return "欠片 0 / 記憶 0";
            return $"欠片 {state.FragmentCount} / 記憶 {state.MemoryCount}";
        }

        public static string BuildDebugLabel(U22BattleVisualPolishState state)
        {
            if (state == null) return "U22 debug pending";
            return $"phase={state.PhaseLabel} / p={state.ParticleCount} / obj={state.ActiveObjectCount} / ts={state.TimeScaleFinal:0.0}";
        }
    }
}
