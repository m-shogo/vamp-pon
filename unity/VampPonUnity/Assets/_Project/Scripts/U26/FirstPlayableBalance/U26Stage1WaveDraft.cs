using System.Collections.Generic;

namespace VampPon.UnitySpike.U26.FirstPlayableBalance
{
    public sealed class U26Stage1WaveDraft
    {
        public readonly struct Wave
        {
            public Wave(int startSecond, int endSecond, string bucket, float spawnInterval, int packSize, int maxEnemies, float contactDamage)
            {
                StartSecond = startSecond;
                EndSecond = endSecond;
                Bucket = bucket;
                SpawnInterval = spawnInterval;
                PackSize = packSize;
                MaxEnemies = maxEnemies;
                ContactDamage = contactDamage;
            }

            public int StartSecond { get; }
            public int EndSecond { get; }
            public string Bucket { get; }
            public float SpawnInterval { get; }
            public int PackSize { get; }
            public int MaxEnemies { get; }
            public float ContactDamage { get; }
        }

        public IReadOnlyList<Wave> Waves { get; } = new[]
        {
            new Wave(0, 30, "opening", 2.8f, 1, 6, 5f),
            new Wave(30, 120, "first_levelup_pressure", 2.2f, 2, 11, 6f),
            new Wave(120, 240, "multi_choice_pressure", 1.85f, 2, 18, 7f),
            new Wave(240, 360, "wave_intensity", 1.45f, 3, 26, 8.5f),
            new Wave(360, 450, "kokuyou_ready", 1.2f, 3, 32, 10f),
            new Wave(450, 480, "clear_push", 0.95f, 4, 38, 12f),
        };

        public Wave At(int second)
        {
            foreach (var wave in Waves)
            {
                if (second >= wave.StartSecond && second < wave.EndSecond) return wave;
            }

            return Waves[Waves.Count - 1];
        }
    }
}
