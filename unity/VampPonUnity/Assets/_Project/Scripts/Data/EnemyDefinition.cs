using UnityEngine;

namespace VampPon.UnitySpike.Data
{
    [CreateAssetMenu(menuName = "Vamp Pon/U1/Enemy Definition")]
    public sealed class EnemyDefinition : ScriptableObject
    {
        public string runtimeId = "ombu";
        public string displayName = "オンブ";
        [Min(1f)] public float maxHp = 8f;
        [Min(0f)] public float moveSpeed = 1.1f;
        [Min(0f)] public int xpDrop = 1;
    }
}
