using VampPon.UnitySpike.U14.Flow;
using VampPon.UnitySpike.U15.Contracts;

namespace VampPon.UnitySpike.U15.Mappers
{
    public static class U14ToU15ContractMapper
    {
        public static StageStartRequest ToStageStartRequest(BattleStartRequestProof proof, string stageTitle = "はじまりの路地")
        {
            var difficultyLabel = string.IsNullOrWhiteSpace(proof.SelectedDifficulty) ? "やさしい" : proof.SelectedDifficulty;
            return new StageStartRequest(
                string.IsNullOrWhiteSpace(proof.SelectedStageId) ? "stage_01" : proof.SelectedStageId,
                string.IsNullOrWhiteSpace(stageTitle) ? "はじまりの路地" : stageTitle,
                DifficultyIdFromLabel(difficultyLabel),
                difficultyLabel,
                string.IsNullOrWhiteSpace(proof.StartTime) ? "proof-start" : proof.StartTime,
                "stage_select");
        }

        public static BattleResultSummary ToBattleResultSummary(BattleResultSummaryProof proof)
        {
            if (proof == null) proof = new BattleResultSummaryProof();
            var difficultyLabel = string.IsNullOrWhiteSpace(proof.Difficulty) ? "やさしい" : proof.Difficulty;
            var reward = new RewardSummary(proof.RewardCards, proof.Fragments, proof.Memories, proof.Blessing);
            return new BattleResultSummary(
                string.IsNullOrWhiteSpace(proof.ClearState) ? "clear" : proof.ClearState,
                string.IsNullOrWhiteSpace(proof.StageId) ? "stage_01" : proof.StageId,
                string.IsNullOrWhiteSpace(proof.StageTitle) ? "はじまりの路地" : proof.StageTitle,
                DifficultyIdFromLabel(difficultyLabel),
                difficultyLabel,
                ElapsedSecondsFromLabel(proof.ElapsedTime),
                ElapsedLabelFromSecondsOrLabel(ElapsedSecondsFromLabel(proof.ElapsedTime), proof.ElapsedTime),
                proof.DefeatedEnemies,
                proof.Fragments,
                proof.Memories,
                proof.Blessing,
                string.IsNullOrWhiteSpace(proof.Rank) ? "A" : proof.Rank,
                reward,
                UnlockCandidate.None);
        }

        public static string DifficultyIdFromLabel(string label)
        {
            return label == "やさしい" ? "easy" : "custom";
        }

        public static int ElapsedSecondsFromLabel(string elapsedLabel)
        {
            if (string.IsNullOrWhiteSpace(elapsedLabel)) return 480;
            var parts = elapsedLabel.Split(':');
            if (parts.Length != 2) return 480;
            if (!int.TryParse(parts[0], out var minutes)) return 480;
            if (!int.TryParse(parts[1], out var seconds)) return 480;
            return minutes * 60 + seconds;
        }

        public static string ElapsedLabelFromSecondsOrLabel(int elapsedSeconds, string fallbackLabel)
        {
            if (!string.IsNullOrWhiteSpace(fallbackLabel)) return fallbackLabel;
            return $"{elapsedSeconds / 60:00}:{elapsedSeconds % 60:00}";
        }
    }
}
