using UnityEngine;

namespace VampPon.UnitySpike.Data
{
    [CreateAssetMenu(menuName = "Vamp Pon/U1/Game Feel Config")]
    public sealed class GameFeelConfig : ScriptableObject
    {
        [Min(0f)] public float expAttractionSeconds = 2.4f;
        [Min(0f)] public float expAttractionArcHeight = 1.05f;
        [Min(0f)] public float lanternGlowPulse = 0.08f;
        [Min(0f)] public float placeholderBobAmplitude = 0.035f;
        [Header("U2 Battle Feel")]
        [Min(0f)] public float playerMoveSpeed = 3.35f;
        [Min(0f)] public float playerAcceleration = 15f;
        [Min(0f)] public float playerDeceleration = 18f;
        [Min(0f)] public float enemySpawnInterval = 1.35f;
        [Min(0f)] public float enemyMoveSpeed = 0.98f;
        [Min(1f)] public float enemyHp = 3f;
        [Min(0f)] public float projectileSpeed = 6.4f;
        [Min(0f)] public float projectileCooldown = 0.55f;
        [Min(0f)] public float projectileDamage = 1f;
        [Min(0f)] public float expAttractRadius = 1.45f;
        [Min(0f)] public float expAttractSpeed = 7.2f;
        [Min(1)] public int enemyPoolSize = 18;
        [Min(1)] public int projectilePoolSize = 28;
        [Min(1)] public int expPoolSize = 36;
        [Min(1)] public int vfxPoolSize = 28;
        [Header("U3 Juice / VFX")]
        [Min(0f)] public float hitStopSeconds = 0.028f;
        [Min(0f)] public float hitStopCooldown = 0.22f;
        [Min(0f)] public float impulseStrength = 0.055f;
        [Min(0f)] public float impulseDuration = 0.14f;
        [Min(0f)] public float damageFlashSeconds = 0.075f;
        [Min(0f)] public float lanternPulseScale = 0.22f;
        [Min(0f)] public float lanternPulseDuration = 0.18f;
        [Min(0f)] public float expPopSpeed = 1.7f;
        [Min(0f)] public float expPopSeconds = 0.16f;
        [Min(0f)] public float expFinalSnapRadius = 0.36f;
        [Min(1)] public int maxActiveVfx = 18;
    }
}
