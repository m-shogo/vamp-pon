using System;
using VampPon.UnitySpike.Runtime.AppFlow;

namespace VampPon.UnitySpike.Runtime.Result
{
    public sealed class ResultPresenter
    {
        private readonly AppFlowCoordinator coordinator;
        private readonly RunResultViewModelBuilder builder = new();
        public ResultPresenter(AppFlowCoordinator flow) => coordinator = flow ?? throw new ArgumentNullException(nameof(flow));
        public RunResultViewModel Present(RunResultSnapshot snapshot) => builder.Build(snapshot, coordinator.LastPersistenceSucceeded);
        public AppFlowCommandResult Retry() => coordinator.Execute(AppFlowCommand.RetryRun());
        public AppFlowCommandResult ReturnToStageSelect() => coordinator.Execute(AppFlowCommand.ReturnToStageSelect());
    }
}
