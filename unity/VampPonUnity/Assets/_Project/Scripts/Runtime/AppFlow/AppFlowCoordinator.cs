using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Pause;
using VampPon.UnitySpike.Runtime.Result;
using VampPon.UnitySpike.Runtime.Save;
using VampPon.UnitySpike.Runtime.StageSelect;

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
        public bool LastPersistenceSucceeded { get; private set; } = true;
        public string LastPersistenceError { get; private set; } = string.Empty;
        public StageSelectModel StageSelection { get; } = new();
        public StageStartResult LastStageStartResult { get; private set; } = new(StageStartResultCode.None, null, null);
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
            StageSelection.Refresh(save.Current);
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
            var entry = StageCatalog.Find(stageId);
            if (entry == null) return RejectStageStart(StageStartResultCode.UnknownStage, stageId, "Unknown stage ID.");
            if (State == AppFlowState.Running && ActiveStageId == entry.StageId) return RejectStageStart(StageStartResultCode.Duplicate, entry.StageId, "Stage start command was already accepted.");
            if (State != AppFlowState.StageSelect) return RejectStageStart(StageStartResultCode.InvalidFlowState, entry.StageId, $"Invalid app-flow transition: {State} -> {AppFlowState.Running}");
            if (!StageSelection.IsUnlocked(entry)) return RejectStageStart(StageStartResultCode.Locked, entry.StageId, "Stage is locked.");
            if (!entry.RuntimeImplemented) return RejectStageStart(StageStartResultCode.NotImplemented, entry.StageId, "Stage battle runtime is not implemented.");
            var result = Transition(AppFlowState.Running);
            if (!result.Succeeded) return RejectStageStart(StageStartResultCode.InvalidFlowState, entry.StageId, result.Error);
            ActiveStageId = entry.StageId;
            LastStageStartResult = new StageStartResult(StageStartResultCode.Started, entry.StageId, null);
            LastResult = null;
            pause.Release(RunPauseReason.StageSelect);
            resetRun?.Invoke();
            return result;
        }

        private AppFlowCommandResult RejectStageStart(StageStartResultCode code, string stageId, string error)
        {
            LastStageStartResult = new StageStartResult(code, stageId, error);
            return AppFlowCommandResult.Failure(error);
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
            if (!CanTransition(AppFlowState.Result))
                return AppFlowCommandResult.Failure($"Invalid app-flow transition: {State} -> {AppFlowState.Result}");
            LastPersistenceSucceeded = ApplyResultToSave(snapshot, out var persistenceError);
            LastPersistenceError = persistenceError;
            LastResult = snapshot;
            var result = Transition(AppFlowState.Result);
            pause.Acquire(RunPauseReason.Result);
            return result;
        }

        private AppFlowCommandResult RetryRun()
        {
            var result = Transition(AppFlowState.Running);
            if (!result.Succeeded) return result;
            pause.ResetForRetry();
            LastResult = null;
            LastPersistenceSucceeded = true;
            LastPersistenceError = string.Empty;
            resetRun?.Invoke();
            return result;
        }

        private AppFlowCommandResult ReturnToStageSelect()
        {
            var result = Transition(AppFlowState.StageSelect);
            if (!result.Succeeded) return result;
            LastResult = null;
            LastPersistenceSucceeded = true;
            LastPersistenceError = string.Empty;
            pause.ResetToStageSelect();
            StageSelection.Refresh(save.Current);
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

        private bool ApplyResultToSave(RunResultSnapshot snapshot, out string error)
        {
            var candidate = save.Current.DeepCopy();
            foreach (var id in snapshot.newlyUnlockedIds ?? new List<string>())
                if (!candidate.collectionUnlockedIds.Contains(id)) candidate.collectionUnlockedIds.Add(id);
            return save.Save(candidate, out error);
        }

        private bool CanTransition(AppFlowState next) => ValidTransitions.Contains((State, next));

        private AppFlowCommandResult Transition(AppFlowState next)
        {
            if (!CanTransition(next))
                return AppFlowCommandResult.Failure($"Invalid app-flow transition: {State} -> {next}");
            State = next;
            StateChanged?.Invoke(State);
            return AppFlowCommandResult.Success();
        }
    }
}
