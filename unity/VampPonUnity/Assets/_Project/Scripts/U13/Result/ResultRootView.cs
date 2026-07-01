using UnityEngine;

namespace VampPon.UnitySpike.U13.Result
{
    public sealed class ResultRootView : MonoBehaviour
    {
        [SerializeField] private string prefabCandidateStatus = "candidate";

        public string PrefabCandidateStatus => prefabCandidateStatus;
    }
}
