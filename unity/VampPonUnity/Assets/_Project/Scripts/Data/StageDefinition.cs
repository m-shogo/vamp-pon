using UnityEngine;

namespace VampPon.UnitySpike.Data
{
    [CreateAssetMenu(menuName = "Vamp Pon/U1/Stage Definition")]
    public sealed class StageDefinition : ScriptableObject
    {
        public string runtimeId = "stage_1";
        public string displayName = "灯りの路地";
        [Min(1f)] public float durationSeconds = 480f;
    }
}
