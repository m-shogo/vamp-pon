using VampPon.UnitySpike.Runtime.Result;

namespace VampPon.UnitySpike.Runtime.AppFlow
{
    public enum AppFlowCommandType
    {
        StartStage,
        OpenLevelUp,
        CloseLevelUp,
        CompleteRun,
        RetryRun,
        ReturnToStageSelect,
        OpenCollection,
        CloseCollection,
        MarkCollectionSeen,
    }

    public readonly struct AppFlowCommand
    {
        public AppFlowCommandType Type { get; }
        public string Id { get; }
        public RunResultSnapshot Result { get; }

        private AppFlowCommand(AppFlowCommandType type, string id = null, RunResultSnapshot result = null)
        {
            Type = type;
            Id = id;
            Result = result;
        }

        public static AppFlowCommand StartStage(string stageId) => new(AppFlowCommandType.StartStage, stageId);
        public static AppFlowCommand OpenLevelUp() => new(AppFlowCommandType.OpenLevelUp);
        public static AppFlowCommand CloseLevelUp() => new(AppFlowCommandType.CloseLevelUp);
        public static AppFlowCommand CompleteRun(RunResultSnapshot result) => new(AppFlowCommandType.CompleteRun, result: result);
        public static AppFlowCommand RetryRun() => new(AppFlowCommandType.RetryRun);
        public static AppFlowCommand ReturnToStageSelect() => new(AppFlowCommandType.ReturnToStageSelect);
        public static AppFlowCommand OpenCollection() => new(AppFlowCommandType.OpenCollection);
        public static AppFlowCommand CloseCollection() => new(AppFlowCommandType.CloseCollection);
        public static AppFlowCommand MarkCollectionSeen(string entryId) => new(AppFlowCommandType.MarkCollectionSeen, entryId);
    }

    public readonly struct AppFlowCommandResult
    {
        public bool Succeeded { get; }
        public string Error { get; }

        private AppFlowCommandResult(bool succeeded, string error)
        {
            Succeeded = succeeded;
            Error = error;
        }

        public static AppFlowCommandResult Success() => new(true, string.Empty);
        public static AppFlowCommandResult Failure(string error) => new(false, error);
    }

    public enum StageStartResultCode { None, Started, Locked, NotImplemented, UnknownStage, InvalidFlowState, Duplicate }

    public readonly struct StageStartResult
    {
        public StageStartResult(StageStartResultCode code, string stageId, string error)
        { Code = code; StageId = stageId; Error = error ?? string.Empty; }
        public StageStartResultCode Code { get; }
        public string StageId { get; }
        public string Error { get; }
        public bool Succeeded => Code == StageStartResultCode.Started;
    }
}
