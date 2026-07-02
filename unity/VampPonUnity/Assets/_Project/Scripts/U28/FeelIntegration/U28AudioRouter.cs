using System.Collections.Generic;
using UnityEngine;

namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28AudioRouter
    {
        private readonly U28AudioEventRegistry registry;
        private readonly U28AudioClipLibrary clipLibrary;
        private readonly U28AudioCooldownGate cooldownGate = new();
        private readonly Dictionary<U28AudioCategory, float> categoryVolumes = new();
        private U28FeelSettingsDraft settings = new();
        private bool muted;

        public U28AudioRouter(U28AudioEventRegistry registry, U28AudioClipLibrary clipLibrary)
        {
            this.registry = registry;
            this.clipLibrary = clipLibrary;
        }

        public List<string> PlayedEvents { get; } = new();
        public List<string> MissingClipFallbacks { get; } = new();

        public void ApplySettings(U28FeelSettingsDraft nextSettings)
        {
            settings = nextSettings ?? new U28FeelSettingsDraft();
        }

        public void SetCategoryVolume(U28AudioCategory category, float volume)
        {
            categoryVolumes[category] = Mathf.Clamp01(volume);
        }

        public void Mute(bool value) => muted = value;
        public void Unmute() => muted = false;
        public void BeginFrame() => cooldownGate.ClearFramePolyphony();

        public bool Play(U28AudioEventId id) => Play(id, 1f);

        public bool Play(U28AudioEventId id, float intensity)
        {
            return PlayAt(id, Vector3.zero, intensity);
        }

        public bool PlayAt(U28AudioEventId id, Vector3 position, float intensity = 1f)
        {
            if (muted) return false;
            var definition = registry.Get(id);
            if (!cooldownGate.CanPlay(definition, Time.realtimeSinceStartup)) return false;
            cooldownGate.MarkPlayed(definition, Time.realtimeSinceStartup);
            var categoryVolume = categoryVolumes.TryGetValue(definition.Category, out var value) ? value : 1f;
            var volume = Mathf.Clamp01(definition.VolumeDraft * settings.MasterVolume * settings.SeVolume * categoryVolume * Mathf.Clamp01(intensity));
            if (!clipLibrary.Exists(definition)) MissingClipFallbacks.Add($"{definition.Id}:{definition.ClipFileName}");
            PlayedEvents.Add($"{definition.Id}@{volume:0.00}");
            return true;
        }
    }
}
