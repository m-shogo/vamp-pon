using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.Audio;
using VampPon.UnitySpike.Runtime.Save;
using VampPon.UnitySpike.U28.FeelIntegration;
using VampPon.UnitySpike.U29.PerformanceMobile;

namespace VampPon.UnitySpike.U49.AudioHaptic
{
    public sealed class U49AudioHapticRuntimeOwner : MonoBehaviour
    {
        private const int VoicePoolSize = 8;
        private const double SchedulingLeadSeconds = 0.005d;

        private sealed class Voice
        {
            public AudioSource Source;
            public U28AudioEventId EventId;
            public U28AudioPriority Priority;
            public double EndsAtDspTime;
        }

        private readonly List<Voice> voices = new();
        private readonly Dictionary<U28AudioEventId, double> lastPlayedAt = new();
        private readonly Dictionary<U28HapticEventId, double> lastHapticAt = new();
        private U49ProductionAudioProfile profile;
        private U28AudioEventRegistry audioRegistry;
        private U28HapticRegistry hapticRegistry;
        private IU28HapticPlatformAdapter hapticAdapter;
        private U49IosHapticAdapter iosHapticAdapter;
        private U49NoopHapticAdapter noopHapticAdapter;
        private U29AudioPerformanceBudget budget;
        private bool hapticEnabled = true;
        private bool muted;
        private float masterVolume = 1f;

        public U49AudioHapticDiagnostics Diagnostics { get; } = new();
        public bool AudioRuntimeReady => profile != null && Diagnostics.mixerRoutingComplete && voices.Count == VoicePoolSize;
        public bool HapticRuntimeSupported => hapticAdapter?.IsDeviceExecutionSupported == true;
        public bool HapticEnabled => hapticEnabled;
        public U49ProductionAudioProfile Profile => profile;

        private void Awake() => Initialize();

        public bool Initialize()
        {
            if (profile != null) return AudioRuntimeReady;
            audioRegistry = new U28AudioEventRegistry();
            hapticRegistry = new U28HapticRegistry();
            budget = new U29AudioPerformanceBudget();
            profile = Resources.Load<U49ProductionAudioProfile>(U49ProductionAudioProfile.ResourcesPath);
            Diagnostics.profileLoaded = profile != null;
            Diagnostics.mixerRoutingComplete = profile != null && profile.HasCompleteRouting();
            if (!Diagnostics.mixerRoutingComplete)
            {
                Debug.LogError("U49 production audio profile or mixer routing is incomplete; audio playback is disabled.");
                return false;
            }

            CreateVoicePool();
            CreateHapticAdapter();
            ApplyMixerVolumes();
            return AudioRuntimeReady;
        }

        public bool Play(U28AudioEventId id, bool requestHaptic, double requestRealtime)
        {
            var routerRealtime = Time.realtimeSinceStartupAsDouble;
            if (requestHaptic) PlayHaptic(audioRegistry.Get(id).HapticPairing);
            if (!AudioRuntimeReady || muted)
            {
                Diagnostics.RecordGuard(id, requestRealtime, muted ? "muted" : "audio-runtime-not-ready", ActiveVoiceCount());
                return false;
            }

            var definition = audioRegistry.Get(id);
            if (!profile.TryGetClip(id, out var clip))
            {
                Diagnostics.missingClipCount++;
                Diagnostics.missingEvents.Add(id.ToString());
                Diagnostics.RecordGuard(id, requestRealtime, "missing-production-clip", ActiveVoiceCount());
                Debug.LogError($"U49 production clip missing for {id}.");
                return false;
            }

            var group = profile.GroupFor(definition.Category);
            if (group == null)
            {
                Diagnostics.RecordGuard(id, requestRealtime, "missing-mixer-group", ActiveVoiceCount());
                Debug.LogError($"U49 mixer group missing for {definition.Category}.");
                return false;
            }

            var now = Time.realtimeSinceStartupAsDouble;
            if (lastPlayedAt.TryGetValue(id, out var last) && now - last < definition.CooldownSeconds)
            {
                Diagnostics.RecordGuard(id, requestRealtime, "cooldown", ActiveVoiceCount());
                return false;
            }

            var active = ActiveVoices().ToList();
            if (active.Count(v => v.EventId == id) >= definition.PolyphonyLimit ||
                !budget.CanPlay(definition.Priority, active.Count, active.Count(v => v.Priority == U28AudioPriority.Low)))
            {
                Diagnostics.RecordGuard(id, requestRealtime, "polyphony-or-voice-budget", active.Count);
                return false;
            }

            var voice = voices.FirstOrDefault(v => v.EndsAtDspTime <= AudioSettings.dspTime);
            if (voice == null)
            {
                Diagnostics.RecordGuard(id, requestRealtime, "voice-pool-full", active.Count);
                return false;
            }

            lastPlayedAt[id] = now;
            var scheduled = AudioSettings.dspTime + SchedulingLeadSeconds;
            voice.EventId = id;
            voice.Priority = definition.Priority;
            voice.EndsAtDspTime = scheduled + clip.length;
            voice.Source.outputAudioMixerGroup = group;
            voice.Source.clip = clip;
            voice.Source.volume = Mathf.Clamp01(definition.VolumeDraft);
            voice.Source.PlayScheduled(scheduled);
            Diagnostics.RecordAudio(id, requestRealtime, routerRealtime, AudioSettings.dspTime, scheduled, active.Count + 1);

            return true;
        }

        public bool PlayHaptic(U28HapticEventId id)
        {
            if (id == U28HapticEventId.None || !hapticEnabled || hapticAdapter == null) return false;
            var definition = hapticRegistry.Get(id);
            var now = Time.realtimeSinceStartupAsDouble;
            if (lastHapticAt.TryGetValue(id, out var last) && now - last < definition.CooldownSeconds) return false;
            lastHapticAt[id] = now;
            Diagnostics.hapticRequestCount++;
            hapticAdapter.Execute(definition);
            var executed = iosHapticAdapter?.LastExecutionSucceeded == true;
            if (executed) Diagnostics.hapticExecutedCount++;
            UpdateHapticDiagnostics();
            return executed;
        }

        public void ApplySettings(GameSettingsSave settings)
        {
            masterVolume = Mathf.Clamp01(settings?.masterVolume ?? 1f);
            hapticEnabled = settings?.hapticEnabled ?? true;
            ApplyMixerVolumes();
        }

        public void SetMuted(bool value)
        {
            muted = value;
            ApplyMixerVolumes();
        }

        public void SetHapticEnabled(bool value) => hapticEnabled = value;

        public void StopAll()
        {
            foreach (var voice in voices)
            {
                voice.Source.Stop();
                voice.Source.clip = null;
                voice.EndsAtDspTime = 0d;
            }
        }

        private void OnApplicationPause(bool paused)
        {
            if (paused)
            {
                Diagnostics.backgroundCount++;
                StopAll();
                SuspendHaptics();
            }
            else
            {
                Diagnostics.foregroundCount++;
                ResumeHaptics();
            }
        }

        private void OnApplicationFocus(bool focused)
        {
            if (focused) ResumeHaptics();
        }

        private void OnDestroy()
        {
            StopAll();
            iosHapticAdapter?.Shutdown();
            noopHapticAdapter?.Shutdown();
        }

        private void CreateVoicePool()
        {
            for (var index = 0; index < VoicePoolSize; index++)
            {
                var source = gameObject.AddComponent<AudioSource>();
                source.playOnAwake = false;
                source.loop = false;
                source.spatialBlend = 0f;
                source.outputAudioMixerGroup = profile.SeGroup;
                voices.Add(new Voice { Source = source });
            }
        }

        private void CreateHapticAdapter()
        {
#if UNITY_IOS && !UNITY_EDITOR
            iosHapticAdapter = new U49IosHapticAdapter();
            hapticAdapter = iosHapticAdapter;
#else
            noopHapticAdapter = new U49NoopHapticAdapter();
            hapticAdapter = noopHapticAdapter;
#endif
            Diagnostics.hapticInitialized = InitializeHaptics();
            UpdateHapticDiagnostics();
        }

        private bool InitializeHaptics()
        {
            return iosHapticAdapter?.Initialize() ?? noopHapticAdapter?.Initialize() ?? false;
        }

        private void SuspendHaptics()
        {
            iosHapticAdapter?.Suspend();
            noopHapticAdapter?.Suspend();
            UpdateHapticDiagnostics();
        }

        private void ResumeHaptics()
        {
            iosHapticAdapter?.Resume();
            noopHapticAdapter?.Resume();
            UpdateHapticDiagnostics();
        }

        private void UpdateHapticDiagnostics()
        {
            Diagnostics.hapticCapability = iosHapticAdapter?.Capability.ToString() ?? noopHapticAdapter?.Capability.ToString() ?? U49HapticCapability.Unknown.ToString();
            Diagnostics.hapticLastError = iosHapticAdapter?.LastError ?? noopHapticAdapter?.LastError ?? string.Empty;
        }

        private IEnumerable<Voice> ActiveVoices() => voices.Where(v => v.EndsAtDspTime > AudioSettings.dspTime);
        private int ActiveVoiceCount() => ActiveVoices().Count();

        private void ApplyMixerVolumes()
        {
            if (profile?.Mixer == null) return;
            SetMixerVolume(U49AudioMixerParameters.MasterVolumeDb, muted ? 0f : masterVolume);
            SetMixerVolume(U49AudioMixerParameters.BgmVolumeDb, profile.DefaultBgmVolume);
            SetMixerVolume(U49AudioMixerParameters.SeVolumeDb, profile.DefaultSeVolume);
            SetMixerVolume(U49AudioMixerParameters.UiVolumeDb, profile.DefaultUiVolume);
        }

        private void SetMixerVolume(string parameter, float linear)
        {
            var db = linear <= 0.0001f ? U49AudioMixerParameters.MutedDb : Mathf.Clamp(20f * Mathf.Log10(linear), U49AudioMixerParameters.MutedDb, 0f);
            if (!profile.Mixer.SetFloat(parameter, db)) Debug.LogError($"U49 exposed mixer parameter missing: {parameter}");
        }
    }
}
