using VampPon.UnitySpike.U11.StageSelect;

namespace VampPon.UnitySpike.U12.StageSelect
{
    public enum StageProofState
    {
        Selected,
        Locked,
    }

    public sealed class StageProofData
    {
        public StageProofData(
            string id,
            string title,
            string difficulty,
            StageProofState state,
            bool unlocked)
        {
            Id = id;
            Title = title;
            Difficulty = difficulty;
            State = state;
            Unlocked = unlocked;
        }

        public string Id { get; }
        public string Title { get; }
        public string Difficulty { get; }
        public StageProofState State { get; }
        public bool Unlocked { get; }

        public string StateLabel => State == StageProofState.Selected ? "選択中" : "未解放";

        public StageRouteNodeProofState RouteNodeState =>
            Unlocked ? StageRouteNodeProofState.Active : StageRouteNodeProofState.Locked;

        public static StageProofData[] SampleStages => new[]
        {
            new StageProofData("stage_01", "はじまりの路地", "やさしい", StageProofState.Selected, true),
            new StageProofData("stage_02", "灯りの曲がり角", "ふつう", StageProofState.Locked, false),
            new StageProofData("stage_03", "黒い橋", "ふつう", StageProofState.Locked, false),
        };
    }
}
