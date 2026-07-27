using System;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;
using UnityEngine.Audio;
using VampPon.UnitySpike.Runtime.Save;
using VampPon.UnitySpike.U28.FeelIntegration;
using VampPon.UnitySpike.U49.AudioHaptic;

namespace VampPon.UnitySpike.Editor
{
    public static class U49ProductionAudioHapticVerification
    {
        [MenuItem("VampPon/U49/Verify Production Audio Haptic Runtime")]
        public static void Run()
        {
            try
            {
                var profile = AssetDatabase.LoadAssetAtPath<U49ProductionAudioProfile>(U49ProductionAudioAssetBuilder.ProfilePath);
                Require(profile != null, "production profile exists");
                Require(profile.HasCompleteRouting(), "profile routing complete");
                Require(profile.EventClips.Count == 22, "22 primary SE bindings");
                Require(profile.EventClips.Select(item => item.EventId).Distinct().Count() == 22, "event bindings unique");
                Require(profile.EventClips.Select(item => item.Clip).Distinct().Count() == 22, "clip bindings unique");
                Require(profile.EventClips.All(item => item.Clip != null), "all clips assigned");
                Require(profile.EventClips.All(item => profile.GroupFor(new U28AudioEventRegistry().Get(item.EventId).Category) != null), "all events routed");
                Require(profile.Mixer.FindMatchingGroups(string.Empty).Length == 9, "required mixer group count");

                foreach (var binding in profile.EventClips)
                {
                    var path = AssetDatabase.GetAssetPath(binding.Clip);
                    Require(path.StartsWith(U49ProductionAudioAssetBuilder.U39ClipRoot, StringComparison.Ordinal), "production source is registered U39 clip root");
                    Require(!path.Contains("U28DraftSe", StringComparison.Ordinal), "U28 draft excluded");
                    var importer = (AudioImporter)AssetImporter.GetAtPath(path);
                    var settings = importer.defaultSampleSettings;
                    Require(settings.loadType == AudioClipLoadType.DecompressOnLoad, "decompress on load");
                    Require(settings.compressionFormat == AudioCompressionFormat.PCM, "PCM import");
                    Require(settings.preloadAudioData, "preload enabled");
                    Require(importer.forceToMono && !importer.loadInBackground && !importer.ambisonic, "mobile short SE import policy");
                }

                var beforeListeners = UnityEngine.Object.FindObjectsByType<AudioListener>(FindObjectsInactive.Include).Length;
                var gameObject = new GameObject("U49VerificationOwner", typeof(U49AudioHapticRuntimeOwner));
                var owner = gameObject.GetComponent<U49AudioHapticRuntimeOwner>();
                owner.Initialize();
                Require(owner.AudioRuntimeReady, "runtime owner initialized");
                var sources = gameObject.GetComponents<AudioSource>();
                Require(sources.Length == 8, "voice pool size");
                Require(sources.All(source => source.outputAudioMixerGroup != null), "no source bypass");
                Require(UnityEngine.Object.FindObjectsByType<AudioListener>(FindObjectsInactive.Include).Length == beforeListeners, "owner does not duplicate AudioListener");
                owner.ApplySettings(new GameSettingsSave { masterVolume = 0.5f, hapticEnabled = false });
                Require(!owner.HapticEnabled && !owner.PlayHaptic(U28HapticEventId.LightTap), "haptic setting off blocks route");
                owner.SetHapticEnabled(true);
                Require(!owner.HapticRuntimeSupported, "Editor is explicit no-op haptic route");
                Require(owner.Diagnostics.hapticCapability == U49HapticCapability.Unsupported.ToString(), "Editor reports unsupported rather than unknown haptic capability");
                Require(owner.Play(U28AudioEventId.BattleStart, true, Time.realtimeSinceStartupAsDouble), "production clip schedules");
                Require(owner.Diagnostics.audioPlayCount == 1 && owner.Diagnostics.missingClipCount == 0, "runtime diagnostics record real clip");
                Require(!owner.Play(U28AudioEventId.BattleStart, true, Time.realtimeSinceStartupAsDouble), "duplicate cooldown guard");
                Require(owner.Diagnostics.audioGuardedCount == 1, "guard recorded");
                UnityEngine.Object.DestroyImmediate(gameObject);

                var nativePlugin = File.ReadAllText(Path.GetFullPath(Path.Combine(Application.dataPath, "Plugins/iOS/VampPonHaptics.mm")));
                Require(nativePlugin.Contains("TARGET_OS_SIMULATOR", StringComparison.Ordinal), "Simulator haptic no-op guard");
                Require(nativePlugin.Contains("CHHapticEngine", StringComparison.Ordinal), "Core Haptics engine implemented");
                Require(!nativePlugin.Contains("Handheld.Vibrate", StringComparison.Ordinal), "native route does not use legacy vibration");
                Debug.Log("U49 production audio/haptic runtime verification passed: 22 events, 9 groups, 8 routed voices, Editor no-op haptics.");
                if (Application.isBatchMode) EditorApplication.Exit(0);
            }
            catch (Exception exception)
            {
                Debug.LogException(exception);
                if (Application.isBatchMode) EditorApplication.Exit(1);
                else throw;
            }
        }

        private static void Require(bool condition, string message)
        {
            if (!condition) throw new InvalidOperationException("U49 verification failed: " + message);
        }
    }
}
