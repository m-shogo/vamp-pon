using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.Runtime.Save;

namespace VampPon.UnitySpike.Runtime.Collection
{
    public sealed class CollectionPresenter
    {
        private readonly AppFlowCoordinator coordinator;
        private readonly SaveService save;
        private readonly CollectionReadModelBuilder builder;

        public CollectionPresenter(AppFlowCoordinator flow, SaveService saveService, CollectionReadModelBuilder readModelBuilder = null)
        {
            coordinator = flow ?? throw new ArgumentNullException(nameof(flow));
            save = saveService ?? throw new ArgumentNullException(nameof(saveService));
            builder = readModelBuilder ?? new CollectionReadModelBuilder();
        }

        public IReadOnlyList<CollectionEntryViewModel> Present(CollectionCategory category) => builder.Build(save.Current, category);
        public CollectionEntryViewModel Detail(string id) => builder.Find(save.Current, id);
        public (int Current, int Max) Progress() => builder.Progress(save.Current);
        public AppFlowCommandResult MarkSeen(string id) => coordinator.Execute(AppFlowCommand.MarkCollectionSeen(id));
        public AppFlowCommandResult Close() => coordinator.Execute(AppFlowCommand.CloseCollection());
    }
}
