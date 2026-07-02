using System.Collections.Generic;
using UnityEngine;

namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28HapticRouter
    {
        private readonly U28HapticRegistry registry;
        private readonly IU28HapticPlatformAdapter adapter;
        private readonly Dictionary<U28HapticEventId, float> lastPlayedAt = new();
        private U28FeelSettingsDraft settings = new();

        public U28HapticRouter(U28HapticRegistry registry, IU28HapticPlatformAdapter adapter)
        {
            this.registry = registry;
            this.adapter = adapter;
        }

        public List<string> RoutedEvents { get; } = new();
        public bool HapticExecutedOnDevice { get; private set; }

        public void ApplySettings(U28FeelSettingsDraft nextSettings)
        {
            settings = nextSettings ?? new U28FeelSettingsDraft();
        }

        public bool Play(U28HapticEventId id)
        {
            if (id == U28HapticEventId.None || !settings.HapticEnabled) return false;
            var definition = registry.Get(id);
            if (lastPlayedAt.TryGetValue(id, out var last) && Time.realtimeSinceStartup - last < definition.CooldownSeconds) return false;
            lastPlayedAt[id] = Time.realtimeSinceStartup;
            RoutedEvents.Add($"{id}@{definition.IntensityDraft:0.00}");
            adapter.Execute(definition);
            HapticExecutedOnDevice = HapticExecutedOnDevice || adapter.IsDeviceExecutionSupported;
            return true;
        }
    }
}
