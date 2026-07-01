using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U16.Battle;

namespace VampPon.UnitySpike.U17.Loop
{
    public sealed class U17Stage1LoopProofView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI[] labels;

        public void Bind(BattleSessionStats stats, string rank)
        {
            stats ??= BattleSessionStats.SampleClear;
            SetLines(
                "Stage1 Loop Proof",
                stats.StageTitle,
                stats.DifficultyLabel,
                $"Time: 00:00 -> {BattleSessionClock.FormatElapsed(stats.ElapsedSeconds)} proof",
                $"Defeated: 0 -> {stats.DefeatedEnemies} proof",
                $"Fragments: 0 -> {stats.CollectedFragments} proof",
                $"Memories: 0 -> {stats.CollectedMemories} proof",
                $"Level: 1 -> {stats.ReachedLevel} proof",
                $"{stats.ClearStateId} / Rank {rank}",
                "Resultへ");
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
