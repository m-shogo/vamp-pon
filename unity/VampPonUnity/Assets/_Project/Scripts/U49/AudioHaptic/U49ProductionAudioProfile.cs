using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;
using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U49.AudioHaptic
{
    [Serializable]
    public sealed class U49AudioEventClipBinding
    {
        [SerializeField] private U28AudioEventId eventId;
        [SerializeField] private AudioClip clip;

        public U28AudioEventId EventId => eventId;
        public AudioClip Clip => clip;
    }

    public sealed class U49ProductionAudioProfile : ScriptableObject
    {
        public const string ResourcesPath = "Audio/U49ProductionAudioProfile";
        public const int RequiredPrimaryEventCount = 22;

        [SerializeField] private AudioMixer mixer;
        [SerializeField] private AudioMixerGroup masterGroup;
        [SerializeField] private AudioMixerGroup bgmGroup;
        [SerializeField] private AudioMixerGroup seGroup;
        [SerializeField] private AudioMixerGroup uiGroup;
        [SerializeField] private AudioMixerGroup battleGroup;
        [SerializeField] private AudioMixerGroup pickupGroup;
        [SerializeField] private AudioMixerGroup climaxGroup;
        [SerializeField] private AudioMixerGroup resultGroup;
        [SerializeField] private AudioMixerGroup stageSelectGroup;
        [SerializeField] private List<U49AudioEventClipBinding> eventClips = new();
        [SerializeField, Range(0f, 1f)] private float defaultBgmVolume = 0.65f;
        [SerializeField, Range(0f, 1f)] private float defaultSeVolume = 0.78f;
        [SerializeField, Range(0f, 1f)] private float defaultUiVolume = 0.82f;

        private Dictionary<U28AudioEventId, AudioClip> clips;

        public AudioMixer Mixer => mixer;
        public AudioMixerGroup MasterGroup => masterGroup;
        public AudioMixerGroup BgmGroup => bgmGroup;
        public AudioMixerGroup SeGroup => seGroup;
        public float DefaultBgmVolume => defaultBgmVolume;
        public float DefaultSeVolume => defaultSeVolume;
        public float DefaultUiVolume => defaultUiVolume;
        public IReadOnlyList<U49AudioEventClipBinding> EventClips => eventClips;

        public bool TryGetClip(U28AudioEventId id, out AudioClip clip)
        {
            clips ??= BuildClipMap();
            return clips.TryGetValue(id, out clip) && clip != null;
        }

        public AudioMixerGroup GroupFor(U28AudioCategory category)
        {
            return category switch
            {
                U28AudioCategory.Ui => uiGroup,
                U28AudioCategory.Battle => battleGroup,
                U28AudioCategory.Pickup => pickupGroup,
                U28AudioCategory.Climax => climaxGroup,
                U28AudioCategory.Result => resultGroup,
                U28AudioCategory.StageSelect => stageSelectGroup,
                _ => null,
            };
        }

        public bool HasCompleteRouting()
        {
            return mixer != null && masterGroup != null && bgmGroup != null && seGroup != null &&
                   uiGroup != null && battleGroup != null && pickupGroup != null && climaxGroup != null &&
                   resultGroup != null && stageSelectGroup != null && eventClips.Count == RequiredPrimaryEventCount;
        }

        private Dictionary<U28AudioEventId, AudioClip> BuildClipMap()
        {
            var result = new Dictionary<U28AudioEventId, AudioClip>();
            foreach (var binding in eventClips)
            {
                if (binding != null && binding.Clip != null) result[binding.EventId] = binding.Clip;
            }
            return result;
        }
    }
}
