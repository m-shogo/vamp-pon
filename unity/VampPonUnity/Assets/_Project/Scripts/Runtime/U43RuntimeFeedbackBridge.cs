using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.U28.FeelIntegration;
using VampPon.UnitySpike.U39.AudioReadiness;

namespace VampPon.UnitySpike.Runtime
{
    public sealed class U43RuntimeFeedbackBridge : MonoBehaviour
    {
        private readonly Dictionary<U28AudioEventId, AudioClip> clips = new();
        private readonly Dictionary<U28AudioEventId, float> lastPlayedAt = new();
        private AudioSource source;
        private U28AudioEventRegistry registry;

        public static U43RuntimeFeedbackBridge Instance { get; private set; }

        public int AudioPlayCount { get; private set; }
        public int HapticRequestCount { get; private set; }
        public bool AudioRuntimeHookReady => source != null;
        public bool HapticRuntimeHookReady => true;
        public string FinalCandidateReferenceRoot => U39FinalCandidateClipLibrary.FinalCandidateRoot;

        private void Awake()
        {
            Instance = this;
            registry = new U28AudioEventRegistry();
            source = gameObject.AddComponent<AudioSource>();
            source.playOnAwake = false;
            source.loop = false;
            source.spatialBlend = 0f;
            source.volume = 0.84f;
        }

        private void OnDestroy()
        {
            if (Instance == this)
            {
                Instance = null;
            }
        }

        public static void PlayButtonTapIfAvailable()
        {
            Instance?.Play(U28AudioEventId.CardConfirm, true);
        }

        public void PlayBattleStart() => Play(U28AudioEventId.BattleStart, true);
        public void PlayWeaponFire() => Play(U28AudioEventId.WeaponFireSoft, false);
        public void PlayEnemyHit() => Play(U28AudioEventId.EnemyHitSoft, false);
        public void PlayEnemyDefeat() => Play(U28AudioEventId.EnemyDefeatInk, true);
        public void PlayPickup() => Play(U28AudioEventId.PickupXp, false);
        public void PlayLevelUp() => Play(U28AudioEventId.LevelupOpen, true);
        public void PlayRare() => Play(U28AudioEventId.PickupRare, true);
        public void PlayEvolution() => Play(U28AudioEventId.EvolutionComplete, true);
        public void PlayKokuyou() => Play(U28AudioEventId.KokuyouActivation, true);
        public void PlayResult() => Play(U28AudioEventId.ResultStamp, true);
        public void PlayRetry() => Play(U28AudioEventId.RetryConfirm, true);
        public void PlayStageSelect() => Play(U28AudioEventId.StageSelectLantern, true);

        public bool Play(U28AudioEventId id, bool haptic)
        {
            if (source == null || registry == null)
            {
                return false;
            }

            var definition = registry.Get(id);
            if (lastPlayedAt.TryGetValue(id, out var last) && Time.unscaledTime - last < definition.CooldownSeconds)
            {
                return false;
            }

            lastPlayedAt[id] = Time.unscaledTime;
            var clip = GetOrCreateClip(id, definition);
            source.PlayOneShot(clip, Mathf.Clamp01(definition.VolumeDraft));
            AudioPlayCount++;

            if (haptic)
            {
                RequestHaptic();
            }

            return true;
        }

        public void RequestHaptic()
        {
            HapticRequestCount++;
#if UNITY_IOS || UNITY_ANDROID
            Handheld.Vibrate();
#endif
        }

        private AudioClip GetOrCreateClip(U28AudioEventId id, U28AudioEventDefinition definition)
        {
            if (clips.TryGetValue(id, out var clip))
            {
                return clip;
            }

            var frequency = FrequencyFor(id);
            var duration = Mathf.Clamp(definition.CooldownSeconds * 0.35f, 0.055f, 0.22f);
            clip = CreateTone($"{id}_runtime_tone", frequency, duration);
            clips[id] = clip;
            return clip;
        }

        private static float FrequencyFor(U28AudioEventId id)
        {
            return id switch
            {
                U28AudioEventId.BattleStart => 330f,
                U28AudioEventId.PickupXp => 880f,
                U28AudioEventId.EnemyHitSoft => 460f,
                U28AudioEventId.EnemyDefeatInk => 260f,
                U28AudioEventId.LevelupOpen => 660f,
                U28AudioEventId.PickupRare => 990f,
                U28AudioEventId.EvolutionComplete => 740f,
                U28AudioEventId.KokuyouActivation => 190f,
                U28AudioEventId.ResultStamp => 520f,
                U28AudioEventId.RetryConfirm => 410f,
                _ => 600f,
            };
        }

        private static AudioClip CreateTone(string name, float frequency, float duration)
        {
            const int sampleRate = 44100;
            var sampleCount = Mathf.Max(1, Mathf.RoundToInt(sampleRate * duration));
            var samples = new float[sampleCount];
            for (var i = 0; i < sampleCount; i++)
            {
                var t = i / (float)sampleRate;
                var fadeIn = Mathf.Clamp01(i / (sampleRate * 0.012f));
                var fadeOut = Mathf.Clamp01((sampleCount - i) / (sampleRate * 0.035f));
                var envelope = Mathf.Min(fadeIn, fadeOut);
                samples[i] = Mathf.Sin(2f * Mathf.PI * frequency * t) * 0.22f * envelope;
            }

            var clip = AudioClip.Create(name, sampleCount, 1, sampleRate, false);
            clip.SetData(samples, 0);
            return clip;
        }
    }
}
