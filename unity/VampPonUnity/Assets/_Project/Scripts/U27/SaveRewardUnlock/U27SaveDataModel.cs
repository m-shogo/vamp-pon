using System.Collections.Generic;

namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27SaveDataModel
    {
        public int Version { get; set; } = U27SaveVersion.Current;
        public List<U27StageProgressModel> StageProgressList { get; set; } = new() { U27StageProgressModel.CreateDefault("stage_01") };
        public bool ProductionApproved { get; set; }

        public U27StageProgressModel GetStageProgress(string stageId)
        {
            foreach (var progress in StageProgressList)
            {
                if (progress.StageId == stageId) return progress;
            }

            var created = U27StageProgressModel.CreateDefault(stageId);
            StageProgressList.Add(created);
            return created;
        }

        public static U27SaveDataModel CreateDefault()
        {
            return new U27SaveDataModel
            {
                Version = U27SaveVersion.Current,
                StageProgressList = new List<U27StageProgressModel> { U27StageProgressModel.CreateDefault("stage_01") },
                ProductionApproved = false,
            };
        }
    }
}
