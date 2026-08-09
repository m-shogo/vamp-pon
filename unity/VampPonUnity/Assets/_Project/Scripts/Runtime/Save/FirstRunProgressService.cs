using System;

namespace VampPon.UnitySpike.Runtime.Save
{
    public sealed class FirstRunProgressService
    {
        private readonly SaveService save;

        public FirstRunProgressService(SaveService saveService)
        {
            save = saveService ?? throw new ArgumentNullException(nameof(saveService));
        }

        public bool IsCompleted(string stageId)
        {
            return !string.IsNullOrWhiteSpace(stageId)
                && save.Current?.completedFirstRunStageIds?.Contains(stageId) == true;
        }

        public bool Complete(string stageId, out string error)
        {
            if (string.IsNullOrWhiteSpace(stageId))
            {
                error = "First Run stage ID is required.";
                return false;
            }

            if (save.Current == null) save.Load();
            if (IsCompleted(stageId))
            {
                error = string.Empty;
                return true;
            }

            var candidate = save.Current.DeepCopy();
            candidate.completedFirstRunStageIds.Add(stageId);
            return save.Save(candidate, out error);
        }
    }
}
