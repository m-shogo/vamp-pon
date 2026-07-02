using UnityEngine;

namespace VampPon.UnitySpike.U19.GameFeel
{
    public static class U19ExpMagnetProof
    {
        public static float MagnetStrength(float distance, bool kokuyouActive)
        {
            var safeDistance = Mathf.Max(0.01f, distance);
            var baseStrength = Mathf.Clamp(1f / safeDistance, 0.6f, 4.2f);
            return kokuyouActive ? baseStrength * 1.35f : baseStrength;
        }

        public static Vector2 MoveTowardPlayer(Vector2 fragmentPosition, Vector2 playerPosition, float deltaTime, bool kokuyouActive)
        {
            var distance = Vector2.Distance(fragmentPosition, playerPosition);
            var speed = MagnetStrength(distance, kokuyouActive) * 120f;
            return Vector2.MoveTowards(fragmentPosition, playerPosition, speed * deltaTime);
        }
    }
}
