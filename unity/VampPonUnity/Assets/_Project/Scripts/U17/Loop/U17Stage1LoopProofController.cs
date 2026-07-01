using UnityEngine;
using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U15.Mappers;
using VampPon.UnitySpike.U16.Battle;

namespace VampPon.UnitySpike.U17.Loop
{
    public sealed class U17Stage1LoopProofController : MonoBehaviour
    {
        public U17Stage1LoopState State { get; private set; } = U17Stage1LoopState.StageSelect;
        public StageStartRequest LastRequest { get; private set; } = StageStartRequest.Sample;
        public BattleSessionStats LastStats { get; private set; }
        public BattleResultSummary LastSummary { get; private set; }
        public ResultPresentationModel LastResultPresentation { get; private set; }
        public StageSelectPresentationModel LastStageSelectPresentation { get; private set; }

        public BattleSessionStats StartAndResolveLoop(StageStartRequest request, bool forceFail = false)
        {
            LastRequest = request;
            State = U17Stage1LoopState.BattleStarting;

            var collector = new BattleSessionStatsCollector(LastRequest);
            State = U17Stage1LoopState.BattleRunning;

            if (forceFail)
            {
                collector.SetElapsedSeconds(120);
                collector.AddDefeatedEnemy(8);
                collector.AddFragments(1);
                collector.SetReachedLevel(2);
            }
            else
            {
                collector.SetElapsedSeconds(480);
                collector.AddDefeatedEnemy(128);
                collector.AddFragments(12);
                collector.AddMemories(3);
                collector.SetBlessing(3);
                collector.SetReachedLevel(5);
            }

            collector.SetClearState(U17Stage1LoopRuleProof.ResolveClearState(collector.ElapsedSeconds, collector.DefeatedEnemies, forceFail));
            LastStats = collector.BuildFinalStats();
            LastSummary = BattleResultSummaryBuilder.FromStats(LastStats);
            State = U17Stage1LoopState.BattleResolved;

            LastResultPresentation = BattleResultToPresentationMapper.ToResultPresentationModel(LastSummary);
            State = U17Stage1LoopState.Result;

            LastStageSelectPresentation = StageSelectPresentationMapper.FromSample(LastSummary);
            State = U17Stage1LoopState.StageReturn;

            Debug.Log($"U17 Stage1 loop proof resolved: {LastStats.ClearStateId} / Rank {LastSummary.Rank} / {LastStageSelectPresentation.LastResultLabel}");
            return LastStats;
        }

        public string RetryDesignLabel => "もう一度";
        public string HomeDesignLabel => "ホーム";
        public string BackDesignLabel => "戻る";
    }
}
