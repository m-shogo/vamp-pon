using TMPro;
using UnityEngine;

namespace VampPon.UnitySpike.U16.Battle
{
    public sealed class U16BattleResultHookProofView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI[] labels;

        public void Bind(BattleSessionStats stats, string rank)
        {
            stats ??= BattleSessionStats.SampleClear;
            SetLines(
                "Battle Result Hook Proof",
                $"Stage: {stats.StageTitle}",
                $"Difficulty: {stats.DifficultyLabel}",
                $"Elapsed: {BattleSessionClock.FormatElapsed(stats.ElapsedSeconds)}",
                $"Defeated: {stats.DefeatedEnemies}",
                $"Fragments: {stats.CollectedFragments}",
                $"Memories: {stats.CollectedMemories}",
                $"Blessing: {stats.Blessing}",
                $"Rank: {rank}",
                "Resultへ渡す");
        }

        public void SetLines(params string[] lines)
        {
            if (labels == null || labels.Length == 0)
            {
                labels = GetComponentsInChildren<TextMeshProUGUI>();
            }

            for (var i = 0; i < labels.Length && i < lines.Length; i++)
            {
                labels[i].text = lines[i];
            }
        }
    }
}
