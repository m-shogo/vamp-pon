using UnityEngine;
using VampPon.UnitySpike.U14.Flow;
using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U15.Mappers;

namespace VampPon.UnitySpike.U16.Battle
{
    public static class U16BattleStatsProofAdapter
    {
        public static BattleSessionStats FromU14Proof(BattleStartRequestProof request)
        {
            var start = U14ToU15ContractMapper.ToStageStartRequest(request);
            var collector = new BattleSessionStatsCollector(start);

            collector.SetElapsedSeconds(480);
            collector.AddDefeatedEnemy(128);
            collector.AddFragments(12);
            collector.AddMemories(3);
            collector.SetBlessing(3);
            collector.SetReachedLevel(5);
            collector.SetClearState(BattleSessionClearState.Clear);

            Debug.Log("U16 proof adapter used U14 request and proof fallback battle values: elapsed/defeated/fragments/memories/blessing/level.");
            return collector.BuildFinalStats();
        }

        public static BattleSessionStats FromStageStartRequest(StageStartRequest request)
        {
            var collector = new BattleSessionStatsCollector(request);
            collector.SetElapsedSeconds(480);
            collector.AddDefeatedEnemy(128);
            collector.AddFragments(12);
            collector.AddMemories(3);
            collector.SetBlessing(3);
            collector.SetReachedLevel(5);
            collector.SetClearState(BattleSessionClearState.Clear);
            return collector.BuildFinalStats();
        }
    }
}
