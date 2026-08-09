using UnityEngine;

namespace VampPon.UnitySpike.UI.Screens
{
    // Shared low-frequency motion primitives for authored 2D scenes.
    // The goal is deliberately not "animation everywhere": these helpers make
    // unrelated, non-periodic motion fields easy to reuse without short sine loops.
    internal static class LivingSceneMotion
    {
        public static float SignedNoise(float seed, float time, float frequency)
        {
            return (Mathf.PerlinNoise(seed, time * frequency) - .5f) * 2f;
        }

        public static Vector2 Drift2D(
            float time,
            float seed,
            Vector2 amplitude,
            Vector2 frequency)
        {
            return new Vector2(
                SignedNoise(seed, time, frequency.x) * amplitude.x,
                SignedNoise(seed + 7.31f, time, frequency.y) * amplitude.y);
        }

        public static float Layered01(
            float time,
            float seed,
            float slowFrequency,
            float fastFrequency,
            float fastWeight)
        {
            var slow = Mathf.PerlinNoise(seed, time * slowFrequency);
            var fast = Mathf.PerlinNoise(seed + 13.17f, time * fastFrequency);
            var weight = Mathf.Clamp01(fastWeight);
            return Mathf.Lerp(slow, fast, weight);
        }

        public static float SparseGate(
            float time,
            float seed,
            float frequency,
            float threshold)
        {
            var value = Mathf.PerlinNoise(seed, time * frequency);
            var start = Mathf.Clamp01(threshold);
            if (value <= start)
                return 0f;
            return Mathf.SmoothStep(0f, 1f, Mathf.InverseLerp(start, 1f, value));
        }
    }
}
