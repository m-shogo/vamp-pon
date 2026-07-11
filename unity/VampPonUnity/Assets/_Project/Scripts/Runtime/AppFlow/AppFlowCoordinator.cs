using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Pause;
using VampPon.UnitySpike.Runtime.Result;
using VampPon.UnitySpike.Runtime.Save;

namespace VampPon.UnitySpike.Runtime.AppFlow
{
    public sealed class AppFlowCoordinator
    {
        private static readonly HashSet<(AppFlowState From, AppFlowState To)> ValidTransitions = new()
        {
            (AppFlowState.Boot, AppFlowState.StageSelect),
            (AppFlowState.StageSelect, AppFlowState.Running),
            (AppFlowState.Running, AppFlowState.LevelUpModal),
            (AppFlowState.LevelUpModal, AppFlowState.Running),
            (AppFlowState.Running, AppFlowState.Result),
            (AppFlowState.Result, AppFlowState.Running),
            (AppFlowState.Result, AppFlowState.StageSelect),
            (AppFlowState.StageSelect, AppFlowState.Collection),
            (AppFlowState.Collection, AppFlowState.StageSelect),
        };

        private readonly RunPauseCoordinator pause;
        private readonly SaveService save;
        private readonly Action resetRun;

        public AppFlowState State { get; private set; } = AppFlowState.Boot;
        public string ActiveStageId { get; private set; }
        public RunResultSnapshot LastResult { get; private set; }
        public event Action<AppFlowState> StateChanged;
        public event Action<string> CollectionSeen;

        public AppFlowCoordinator(RunPauseCoordinator pauseCoordinator, SaveService saveService, Action resetRun = null)
        {
            pause = pauseCoordinator ?? throw new ArgumentNullException(nameof(pauseCoordinator));
            save = saveService ?? throw new ArgumentNullException(nameof(saveService));
            this.resetRun = resetRun;
        }

        public AppFlowCommandResult Initialize()
        {
            save.Load();
            pause.ResetToStageSelect();
            return Transition(AppFlowState.StageSelect);
        }

        public AppFlowCommandResult Execute(AppFlowCommand command)
        {
            return command.Type switch
            {
                AppFlowCommandType.StartStage => StartStage(command.Id),
                AppFlowCommandType.OpenLevelUp => OpenLevelUp(),
                AppFlowCommandType.CloseLevelUp => CloseLevelUp(),
                AppFlowCommandType.CompleteRun => CompleteRun(command.Result),
                AppFlowCommandType.RetryRun => RetryRun(),
                AppFlowCommandType.ReturnToStageSelect => ReturnToStageSelect(),
                AppFlowCommandType.OpenCollection => OpenCollection(),
                AppFlowCommandType.CloseCollection => CloseCollection(),
                AppFlowCommandType.MarkCollectionSeen => MarkSeen(command.Id),
                _ => AppFlowCommandResult.Failure("Unknown app-flow command."),
            };
        }

        private AppFlowCommandResult StartStage(string stageId)
        {
            if (string.IsNullOrWhiteSpace(stageId)) return AppFlowCommandResult.Failure("A stable stage ID is required.");
            var result = Transition(AppFlowState.Running);
            if (!result.Succeeded) return result;
            ActiveStageId = stageId;
            LastResult = null;
            pause.Release(RunPauseReason.StageSelect);
            resetRun?.Invoke();
            return result;
        }

        private AppFlowCommandResult OpenLevelUp()
        {
            var result = Transition(AppFlowState.LevelUpModal);
            if (result.Succeeded) pause.Acquire(RunPauseReason.LevelUp);
            return result;
        }

        private AppFlowCommandResult CloseLevelUp()
        {
            var result = Transition(AppFlowState.Running);
            if (result.Succeeded) pause.Release(RunPauseReason.LevelUp);
            return result;
        }

        private AppFlowCommandResult CompleteRun(RunResultSnapshot snapshot)
        {
            if (snapshot == null) return AppFlowCommandResult.Failure("Run result snapshot is required.");
            var previous = LastResult;
            LastResult = snapshot;
            var result = Transition(AppFlowState.Result);
            if (!result.Succeeded)
            {
                LastResult = previous;
                return result;
            }
            pause.Acquire(RunPauseReason.Result);
            ApplyResultToSave(snapshot);
            return result;
        }

        private AppFlowCommandResult RetryRun()
        {
            var result = Transition(AppFlowState.Running);
            if (!result.Succeeded) return result;
            pause.ResetForRetry();
            LastResult = null;
            resetRun?.Invoke();
            return result;
        }

        private AppFlowCommandResult ReturnToStageSelect()
        {
            var result = Transition(AppFlowState.StageSelect);
            if (!result.Succeeded) return result;
            LastResult = null;
            pause.ResetToStageSelect();
            return result;
        }

        private AppFlowCommandResult OpenCollection()
        {
            var result = Transition(AppFlowState.Collection);
            if (result.Succeeded)
            {
                pause.Release(RunPauseReason.StageSelect);
                pause.Acquire(RunPauseReason.Collection);
            }
            return result;
        }

        private AppFlowCommandResult CloseCollection()
        {
            var result = Transition(AppFlowState.StageSelect);
            if (result.Succeeded) pause.ResetToStageSelect();
            return result;
        }

        private AppFlowCommandResult MarkSeen(string entryId)
        {
            if (State != AppFlowState.Collection) return AppFlowCommandResult.Failure("Collection entry can only be marked seen while 灯録 is open.");
            if (!save.MarkCollectionSeen(entryId, out var error)) return AppFlowCommandResult.Failure(error);
            CollectionSeen?.Invoke(entryId);
            return AppFlowCommandResult.Success();
        }

        private void ApplyResultToSave(RunResultSnapshot snapshot)
        {
            var current = save.Current;
            foreach (var id in snapshot.newlyUnlockedIds ?? new List<string>())
                if (!current.collectionUnlockedIds.Contains(id)) current.collectionUnlockedIds.Add(id);
            save.Save(current, out _);
        }

        private AppFlowCommandResult Transition(AppFlowState next)
        {
            if (!ValidTransitions.Contains((State, next)))
                return AppFlowCommandResult.Failure($"Invalid app-flow transition: {State} -> {next}");
            State = next;
            StateChanged?.Invoke(State);
            return AppFlowCommandResult.Success();
        }
    }
}
