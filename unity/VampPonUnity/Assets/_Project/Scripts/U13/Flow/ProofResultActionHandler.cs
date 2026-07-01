using UnityEngine;

namespace VampPon.UnitySpike.U13.Flow
{
    public sealed class ProofResultActionHandler : IResultActionHandler
    {
        public void OnContinueToStageSelectRequested()
        {
            Debug.Log("[U13PrefabFlow] proof result action: continue_to_stage_select");
        }
    }
}
