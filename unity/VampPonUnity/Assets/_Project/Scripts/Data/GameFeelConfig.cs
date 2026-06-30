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
    }
}
