using System;
using System.Linq;

namespace VampPon.UnitySpike.Runtime.Result
{
    public sealed class RunResultViewModelBuilder
    {
        public RunResultViewModel Build(RunResultSnapshot snapshot)
        {
            if (snapshot == null) throw new ArgumentNullException(nameof(snapshot));
            var duration = TimeSpan.FromSeconds(Math.Max(0d, snapshot.elapsedTime));
            var clear = snapshot.outcome == RunOutcome.Clear;
            return new RunResultViewModel
            {
                Title = clear ? "夜明けへ持ち帰った頁" : "今夜、持ち帰った頁",
                OutcomeLabel = clear ? "踏破" : "帰還",
                StageTitle = snapshot.stageId == "stage_01" ? "墨夜の通り道" : snapshot.stageId,
                ElapsedTimeLabel = $"{(int)duration.TotalMinutes:00}:{duration.Seconds:00}",
                DefeatedEnemyLabel = snapshot.defeatedEnemyCount.ToString(),
                FragmentLabel = snapshot.collectedFragments.ToString(),
                ReachedLevelLabel = $"Lv {Math.Max(1, snapshot.reachedLevel)}",
                Rank = RankFor(snapshot),
                RewardCards = snapshot.rewardIds?.Take(3).Select(DisplayName).ToArray() ?? Array.Empty<string>(),
                NewRecordRows = snapshot.newlyUnlockedIds?.Take(3).Select(DisplayName).ToArray() ?? Array.Empty<string>(),
                CanRetry = true,
                CanReturnToStageSelect = true,
            };
        }

        private static string RankFor(RunResultSnapshot snapshot)
        {
            if (snapshot.outcome == RunOutcome.Fail) return "記";
            if (snapshot.defeatedEnemyCount >= 120) return "暁";
            if (snapshot.defeatedEnemyCount >= 60) return "灯";
            return "歩";
        }

        private static string DisplayName(string id) => id switch
        {
            "memory_fragment" => "記憶の欠片",
            "night_trace" => "夜の足跡",
            "memory_first_return" => "最初の帰還",
            "enemy_onbu" => "オンブの記録",
            _ => id?.Replace('_', ' ') ?? string.Empty,
        };
    }
}
