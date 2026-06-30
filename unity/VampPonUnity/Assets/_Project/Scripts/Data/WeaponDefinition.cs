using UnityEngine;

namespace VampPon.UnitySpike.Data
{
    [CreateAssetMenu(menuName = "Vamp Pon/U1/Weapon Definition")]
    public sealed class WeaponDefinition : ScriptableObject
    {
        public string runtimeId = "night_pencil";
        public string displayName = "夜の鉛筆";
        [Min(1)] public int maxLevel = 5;
    }
}
