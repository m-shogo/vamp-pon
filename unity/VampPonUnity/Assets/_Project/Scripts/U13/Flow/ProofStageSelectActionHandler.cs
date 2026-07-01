using UnityEngine;

namespace VampPon.UnitySpike.U13.Flow
{
    public sealed class ProofStageSelectActionHandler : IStageSelectActionHandler
    {
        public void OnStartBattleRequested(string stageId)
        {
            Debug.Log($"[U13PrefabFlow] proof stage action: start_battle, stageId={stageId}");
        }
    }
}
