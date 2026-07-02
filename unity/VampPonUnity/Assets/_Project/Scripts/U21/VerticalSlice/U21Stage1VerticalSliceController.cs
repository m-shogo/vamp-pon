using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U15.Mappers;
using VampPon.UnitySpike.U16.Battle;
using VampPon.UnitySpike.U18.Kokuyou;
using VampPon.UnitySpike.U19.GameFeel;
using VampPon.UnitySpike.U20.MobileQA;

namespace VampPon.UnitySpike.U21.VerticalSlice
{
    public sealed class U21Stage1VerticalSliceController : MonoBehaviour
    {
        [SerializeField] private U21Stage1VerticalSliceView view;

        public U21Stage1VerticalSliceConfig Config { get; set; } = U21Stage1VerticalSliceConfig.Default;
        public U21Stage1VerticalSliceState State { get; private set; } = new();

        public U21Stage1VerticalSliceState RunClearPath()
        {
            return Run(StageStartRequest.Sample, false);
        }

        public U21Stage1VerticalSliceState RunFailPath()
        {
            return Run(StageStartRequest.Sample, true);
        }

        public U21Stage1VerticalSliceState Run(StageStartRequest request, bool forceFail = false)
        {
            BattleTimeScaleService.ForceRestore();
            Config ??= U21Stage1VerticalSliceConfig.Default;
            State = new U21Stage1VerticalSliceState
            {
                StageStartRequest = request,
                CurrentPhase = U21Stage1VerticalSlicePhase.Starting,
                BattleStatsCollector = new BattleSessionStatsCollector(request),
                GameFeelState = new U19GameFeelProofState { ExpToNext = Config.ExpToLevelUp },
                LastStageSelectPresentationModel = StageSelectPresentationMapper.FromSample(),
            };

            if (forceFail)
            {
                SimulateFailPath(State);
            }
            else
            {
                SimulateClearPath(State);
            }

            MapResult(State);
            view?.Render(State);
            BattleTimeScaleService.ForceRestore();
            return State;
        }

        private void SimulateClearPath(U21Stage1VerticalSliceState state)
        {
            state.CurrentPhase = U21Stage1VerticalSlicePhase.Playing;
            var feedback = new U19FeedbackHookProof();
            var drops = new U19DropProofController();
            var healing = new U19HealingDropProof();

            for (var i = 0; i < 4; i++)
            {
                state.GameFeelState.AddExp(25);
            }

            state.DroppedItems = new[] { drops.ExpFragment.Type.ToString(), drops.HealingHeart.Type.ToString(), drops.MemoryShard.Type.ToString(), drops.RareSpark.Type.ToString() };
            if (Config.EnableHealingDropProof && !drops.IsMagnetTarget(drops.HealingHeart))
            {
                healing.CollectManually(state.GameFeelState, feedback);
            }

            var levelUp = new U19LevelUpProofController();
            if (levelUp.TryOpen(state.GameFeelState, feedback))
            {
                state.CurrentPhase = U21Stage1VerticalSlicePhase.LevelUp;
                levelUp.SelectCard(0, state.GameFeelState, feedback);
                state.LevelUpCount += 1;
            }

            if (Config.EnableRareProof)
            {
                var rare = new U19RarePresentationProof();
                state.CurrentPhase = U21Stage1VerticalSlicePhase.Rare;
                rare.Show(state.GameFeelState, feedback);
                rare.Hide();
            }

            if (Config.EnableEvolutionProof)
            {
                var evolution = new U19EvolutionProofController();
                state.CurrentPhase = U21Stage1VerticalSlicePhase.Evolution;
                state.EvolutionReady = evolution.CheckReady(state.GameFeelState);
                state.EvolutionTriggered = evolution.Trigger(state.GameFeelState, feedback);
            }

            SimulateKokuyou(state);
            FillCollector(state, Config.ProofDurationSeconds, 128, 12, 3, 3, 5, false);
            state.CurrentPhase = U21Stage1VerticalSlicePhase.Clear;
        }

        private void SimulateFailPath(U21Stage1VerticalSliceState state)
        {
            state.CurrentPhase = U21Stage1VerticalSlicePhase.Playing;
            state.GameFeelState.AddExp(20);
            state.DroppedItems = new[] { "EXP", "Heart" };
            FillCollector(state, 180, 8, 1, 0, 0, 1, true);
            state.CurrentPhase = U21Stage1VerticalSlicePhase.Fail;
        }

        private void SimulateKokuyou(U21Stage1VerticalSliceState state)
        {
            var kokuyouObject = new GameObject("U21KokuyouRuntimeProof");
            try
            {
                var kokuyou = kokuyouObject.AddComponent<KokuyouRuntimePrototypeController>();
                for (var i = 0; i < Config.KokuyouGaugeMax / Config.KokuyouDamageCharge; i++)
                {
                    kokuyou.ProofDamageTaken();
                }

                state.KokuyouRuntimeState = kokuyou.State;
                state.CurrentPhase = U21Stage1VerticalSlicePhase.KokuyouReady;
                if (kokuyou.TryActivate())
                {
                    state.KokuyouActivated = true;
                    state.GameFeelState.KokuyouActive = true;
                    state.CurrentPhase = U21Stage1VerticalSlicePhase.KokuyouActive;
                    kokuyou.Tick(kokuyou.ActiveDuration + 0.1f);
                    kokuyou.Tick(kokuyou.CooldownDuration + 0.1f);
                    state.GameFeelState.KokuyouActive = false;
                }

                state.KokuyouRuntimeState = kokuyou.State;
            }
            finally
            {
                DestroyImmediate(kokuyouObject);
                BattleTimeScaleService.ForceRestore();
            }
        }

        private void FillCollector(U21Stage1VerticalSliceState state, int elapsedSeconds, int defeated, int fragments, int memories, int blessing, int reachedLevel, bool forceFail)
        {
            state.ElapsedSeconds = elapsedSeconds;
            state.DefeatedEnemies = defeated;
            state.CollectedFragments = fragments;
            state.CollectedMemories = memories;
            state.CollectedHearts = state.GameFeelState.CollectedHearts;
            state.CurrentExp = state.GameFeelState.CurrentExp;
            state.PlayerLevel = reachedLevel;
            state.RareTriggered = state.GameFeelState.RareTriggered;
            state.EvolutionReady = state.GameFeelState.EvolutionReady;
            state.EvolutionTriggered = state.GameFeelState.EvolutionTriggered;
            state.ClearState = U21Stage1VerticalSliceRule.ResolveClearState(Config, elapsedSeconds, defeated, forceFail);

            var collector = state.BattleStatsCollector;
            collector.SetElapsedSeconds(elapsedSeconds);
            collector.AddDefeatedEnemy(defeated);
            collector.AddFragments(fragments);
            collector.AddMemories(memories);
            collector.SetBlessing(blessing);
            collector.SetReachedLevel(reachedLevel);
            collector.SetClearState(state.ClearState);
        }

        private void MapResult(U21Stage1VerticalSliceState state)
        {
            state.LastResultSummary = BattleResultSummaryBuilder.FromStats(state.BattleStatsCollector.BuildFinalStats());
            state.CurrentPhase = U21Stage1VerticalSlicePhase.Result;
            state.LastResultPresentationModel = BattleResultToPresentationMapper.ToResultPresentationModel(state.LastResultSummary);
            state.LastStageSelectPresentationModel = StageSelectPresentationMapper.FromSample(state.LastResultSummary);
            state.PerformanceBudget = new U20PerformanceBudgetReport
            {
                ActiveProofObjectCount = Config.ActiveProofObjectCount,
                PeakProofParticleCount = Config.PeakProofParticleCount,
                ScreenshotCaptureCount = 22,
                TimeScaleFinal = Time.timeScale,
            };
            state.CurrentPhase = U21Stage1VerticalSlicePhase.ReturningToStageSelect;
        }
    }
}
