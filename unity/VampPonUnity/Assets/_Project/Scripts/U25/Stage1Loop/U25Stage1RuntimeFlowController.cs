using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U24.ClimaxPolish;

namespace VampPon.UnitySpike.U25.Stage1Loop
{
    public sealed class U25Stage1RuntimeFlowController : MonoBehaviour
    {
        public U25Stage1LoopState State { get; private set; } = new();
        public U25Stage1FeedbackHooks FeedbackHooks { get; } = new();
        public U25StageProgressProofRepository ProgressRepository { get; } = new();

        public U25Stage1LoopState RunClearPath()
        {
            BattleTimeScaleService.ForceRestore();
            State = new U25Stage1LoopState();
            StartStage();
            StartBattle();
            CollectExpAndOpenLevelUp();
            SelectUpgrade();
            TriggerRare();
            TriggerEvolution();
            TriggerKokuyou();
            FinishRun(true);
            BattleTimeScaleService.ForceRestore();
            return State;
        }

        public U25Stage1LoopState RunFailPath()
        {
            BattleTimeScaleService.ForceRestore();
            State = new U25Stage1LoopState();
            StartStage();
            StartBattle();
            State.PlayerHp = 0;
            FinishRun(false);
            BattleTimeScaleService.ForceRestore();
            return State;
        }

        private void StartStage()
        {
            State.Phase = "StageSelect";
            FeedbackHooks.StageSelectLantern();
        }

        private void StartBattle()
        {
            State.Phase = "Battle";
            State.ElapsedSeconds = 12;
            State.EnemyWaveIntensity = "opening";
            U25Stage1BattleRuntimeAdapter.ApplyBattleSnapshot(State);
        }

        private void CollectExpAndOpenLevelUp()
        {
            State.Phase = "LevelUp";
            State.Exp = 100;
            State.PickupCount = 8;
            FeedbackHooks.LevelUpOpen();
        }

        private void SelectUpgrade()
        {
            State.Level = 2;
            State.WeaponSlots = 3;
            State.PassiveSlots = 2;
            FeedbackHooks.CardSelect();
        }

        private void TriggerRare()
        {
            State.Phase = "Rare";
            State.RareVisual.RareSealVisible = true;
            State.RunResult.RareAcquired = true;
            FeedbackHooks.RareSeal();
        }

        private void TriggerEvolution()
        {
            State.Phase = "Evolution";
            State.EvolutionVisual.MaterialConvergence = true;
            State.EvolutionVisual.CompleteVisual = true;
            State.RunResult.EvolutionAchieved = true;
            FeedbackHooks.EvolutionConvergence();
            FeedbackHooks.EvolutionComplete();
        }

        private void TriggerKokuyou()
        {
            State.Phase = "KokuyouReady";
            State.KokuyouVisual.ReadyVisual = true;
            FeedbackHooks.KokuyouReady();
            State.Phase = "KokuyouActive";
            State.KokuyouVisual.ActivationCutin = true;
            State.KokuyouVisual.ActiveVisual = true;
            State.RunResult.KokuyouUsed = true;
            FeedbackHooks.KokuyouActivation();
            State.Phase = "KokuyouEnding";
            State.KokuyouVisual.EndingVisual = true;
            FeedbackHooks.KokuyouEnding();
        }

        private void FinishRun(bool clear)
        {
            State.Phase = clear ? "ResultClear" : "ResultFail";
            State.RunResult.ClearState = clear ? "clear" : "fail";
            State.RunResult.Rank = clear ? "A" : "C";
            State.RunResult.ElapsedSeconds = clear ? 480 : 180;
            State.RunResult.KillCount = clear ? 128 : 18;
            State.RunResult.LevelReached = clear ? 5 : State.Level;
            State.RewardDraft.IsPersistenceFinal = false;
            State.ProgressDraft.IsClearDraft = clear;
            State.ProgressDraft.PreviousResultStamp = $"Rank {State.RunResult.Rank} / 欠片 {State.RewardDraft.FragmentReward}";
            ProgressRepository.SaveDraft(State.ProgressDraft);
            FeedbackHooks.ResultStamp();
            U25Stage1BattleRuntimeAdapter.ApplyBattleSnapshot(State);
        }
    }
}
