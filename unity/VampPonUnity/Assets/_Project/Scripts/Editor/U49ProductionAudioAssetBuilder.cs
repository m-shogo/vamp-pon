using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using UnityEditor;
using UnityEngine;
using UnityEngine.Audio;
using VampPon.UnitySpike.U28.FeelIntegration;
using VampPon.UnitySpike.U49.AudioHaptic;

namespace VampPon.UnitySpike.Editor
{
    public static class U49ProductionAudioAssetBuilder
    {
        public const string MixerPath = "Assets/_Project/Audio/Production/U49/YorunoShirubeProduction.mixer";
        public const string ProfilePath = "Assets/_Project/Resources/Audio/U49ProductionAudioProfile.asset";
        public const string U39ClipRoot = "Assets/_Project/Audio/U39FinalCandidateSe";

        private static readonly (U28AudioEventId Id, string FileName)[] Clips =
        {
            (U28AudioEventId.BattleStart, "vp_battle_start_soft.wav"),
            (U28AudioEventId.PickupXp, "vp_pickup_xp_soft.wav"),
            (U28AudioEventId.PickupHeal, "vp_pickup_heal_warm.wav"),
            (U28AudioEventId.PickupRare, "vp_pickup_rare_seal.wav"),
            (U28AudioEventId.LevelupOpen, "vp_levelup_open_paper.wav"),
            (U28AudioEventId.CardSelect, "vp_card_select_ink.wav"),
            (U28AudioEventId.CardConfirm, "vp_card_confirm.wav"),
            (U28AudioEventId.WeaponFireSoft, "vp_weapon_fire_soft.wav"),
            (U28AudioEventId.EnemyHitSoft, "vp_enemy_hit_soft.wav"),
            (U28AudioEventId.EnemyDefeatInk, "vp_enemy_defeat_ink.wav"),
            (U28AudioEventId.PlayerDamage, "vp_player_damage_mute.wav"),
            (U28AudioEventId.EvolutionConvergence, "vp_evolution_convergence.wav"),
            (U28AudioEventId.EvolutionComplete, "vp_evolution_complete.wav"),
            (U28AudioEventId.KokuyouGaugeReady, "vp_kokuyou_ready.wav"),
            (U28AudioEventId.KokuyouActivation, "vp_kokuyou_activation.wav"),
            (U28AudioEventId.KokuyouEnding, "vp_kokuyou_ending.wav"),
            (U28AudioEventId.ResultStamp, "vp_result_stamp.wav"),
            (U28AudioEventId.RewardCard, "vp_reward_card.wav"),
            (U28AudioEventId.UnlockReveal, "vp_unlock_reveal.wav"),
            (U28AudioEventId.StageSelectLantern, "vp_stage_lantern.wav"),
            (U28AudioEventId.StageRouteUnlock, "vp_stage_route_unlock.wav"),
            (U28AudioEventId.RetryConfirm, "vp_retry_confirm.wav"),
        };

        [MenuItem("VampPon/U49/Create or Refresh Production Audio Assets")]
        public static void Build()
        {
            try
            {
                EnsureFolder("Assets/_Project/Audio/Production/U49");
                EnsureFolder("Assets/_Project/Resources/Audio");
                var mixer = CreateMixer();
                ConfigureImports();
                CreateProfile(mixer);
                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
                Validate();
                Debug.Log("U49 production AudioMixer/profile build passed.");
                if (Application.isBatchMode) EditorApplication.Exit(0);
            }
            catch (Exception exception)
            {
                Debug.LogException(exception);
                if (Application.isBatchMode) EditorApplication.Exit(1);
                else throw;
            }
        }

        private static AudioMixer CreateMixer()
        {
            var existing = AssetDatabase.LoadAssetAtPath<AudioMixer>(MixerPath);
            if (existing != null) return existing;

            var controllerType = typeof(AudioImporter).Assembly.GetType("UnityEditor.Audio.AudioMixerController", true);
            var groupType = typeof(AudioImporter).Assembly.GetType("UnityEditor.Audio.AudioMixerGroupController", true);
            var createMixer = controllerType.GetMethod("CreateMixerControllerAtPath", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static);
            var createGroup = controllerType.GetMethod("CreateNewGroup", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
            var controller = createMixer.Invoke(null, new object[] { MixerPath });
            var master = controllerType.GetProperty("masterGroup", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).GetValue(controller);
            ((UnityEngine.Object)master).name = "Master";
            object Group(string name) => createGroup.Invoke(controller, new object[] { name, false });
            var bgm = Group("BGM");
            var se = Group("SE");
            var ui = Group("UI");
            var battle = Group("Battle");
            var pickup = Group("Pickup");
            var climax = Group("Climax");
            var result = Group("Result");
            var stageSelect = Group("StageSelect");
            SetChildren(groupType, master, bgm, se);
            SetChildren(groupType, se, ui, battle, pickup, climax, result, stageSelect);
            SetExposed(controllerType, groupType, controller,
                (master, U49AudioMixerParameters.MasterVolumeDb),
                (bgm, U49AudioMixerParameters.BgmVolumeDb),
                (se, U49AudioMixerParameters.SeVolumeDb),
                (ui, U49AudioMixerParameters.UiVolumeDb));
            EditorUtility.SetDirty((UnityEngine.Object)controller);
            return (AudioMixer)controller;
        }

        private static void SetChildren(Type groupType, object parent, params object[] children)
        {
            var array = Array.CreateInstance(groupType, children.Length);
            for (var index = 0; index < children.Length; index++) array.SetValue(children[index], index);
            groupType.GetProperty("children", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).SetValue(parent, array);
        }

        private static void SetExposed(Type controllerType, Type groupType, object mixer, params (object Group, string Name)[] definitions)
        {
            var assembly = controllerType.Assembly;
            var exposedType = assembly.GetType("UnityEditor.Audio.ExposedAudioParameter", true);
            var exposedProperty = controllerType.GetProperty("exposedParameters", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
            var exposed = Array.CreateInstance(exposedType, definitions.Length);
            for (var index = 0; index < definitions.Length; index++)
            {
                var parameter = Activator.CreateInstance(exposedType);
                var guid = groupType.GetMethod("GetGUIDForVolume", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).Invoke(definitions[index].Group, null);
                exposedType.GetField("guid", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).SetValue(parameter, guid);
                exposedType.GetField("name", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).SetValue(parameter, definitions[index].Name);
                exposed.SetValue(parameter, index);
            }
            exposedProperty.SetValue(mixer, exposed);
        }

        private static void ConfigureImports()
        {
            foreach (var (_, fileName) in Clips)
            {
                var path = $"{U39ClipRoot}/{fileName}";
                var importer = AssetImporter.GetAtPath(path) as AudioImporter ?? throw new InvalidOperationException("AudioImporter missing: " + path);
                var settings = importer.defaultSampleSettings;
                settings.loadType = AudioClipLoadType.DecompressOnLoad;
                settings.compressionFormat = AudioCompressionFormat.PCM;
                settings.sampleRateSetting = AudioSampleRateSetting.OverrideSampleRate;
                settings.sampleRateOverride = 44100;
                settings.quality = 1f;
                settings.preloadAudioData = true;
                importer.defaultSampleSettings = settings;
                importer.forceToMono = true;
                importer.loadInBackground = false;
                importer.ambisonic = false;
                importer.SaveAndReimport();
            }
        }

        private static void CreateProfile(AudioMixer mixer)
        {
            var profile = AssetDatabase.LoadAssetAtPath<U49ProductionAudioProfile>(ProfilePath);
            if (profile == null)
            {
                profile = ScriptableObject.CreateInstance<U49ProductionAudioProfile>();
                AssetDatabase.CreateAsset(profile, ProfilePath);
            }
            var serialized = new SerializedObject(profile);
            serialized.FindProperty("mixer").objectReferenceValue = mixer;
            SetGroup(serialized, "masterGroup", mixer, "Master");
            SetGroup(serialized, "bgmGroup", mixer, "BGM");
            SetGroup(serialized, "seGroup", mixer, "SE");
            SetGroup(serialized, "uiGroup", mixer, "UI");
            SetGroup(serialized, "battleGroup", mixer, "Battle");
            SetGroup(serialized, "pickupGroup", mixer, "Pickup");
            SetGroup(serialized, "climaxGroup", mixer, "Climax");
            SetGroup(serialized, "resultGroup", mixer, "Result");
            SetGroup(serialized, "stageSelectGroup", mixer, "StageSelect");
            var bindings = serialized.FindProperty("eventClips");
            bindings.arraySize = Clips.Length;
            for (var index = 0; index < Clips.Length; index++)
            {
                var item = bindings.GetArrayElementAtIndex(index);
                item.FindPropertyRelative("eventId").enumValueIndex = (int)Clips[index].Id;
                item.FindPropertyRelative("clip").objectReferenceValue = AssetDatabase.LoadAssetAtPath<AudioClip>($"{U39ClipRoot}/{Clips[index].FileName}");
            }
            serialized.ApplyModifiedPropertiesWithoutUndo();
            EditorUtility.SetDirty(profile);
        }

        private static void SetGroup(SerializedObject profile, string property, AudioMixer mixer, string name)
        {
            var groups = mixer.FindMatchingGroups(name).Where(group => group.name == name).ToArray();
            if (groups.Length != 1) throw new InvalidOperationException($"Expected one mixer group {name}, found {groups.Length}.");
            profile.FindProperty(property).objectReferenceValue = groups[0];
        }

        private static void Validate()
        {
            var profile = AssetDatabase.LoadAssetAtPath<U49ProductionAudioProfile>(ProfilePath);
            if (profile == null || !profile.HasCompleteRouting()) throw new InvalidOperationException("U49 production profile validation failed.");
            if (profile.EventClips.Select(binding => binding.EventId).Distinct().Count() != Clips.Length)
                throw new InvalidOperationException("U49 event bindings are not unique.");
            var controller = AssetDatabase.LoadMainAssetAtPath(MixerPath);
            var exposedProperty = controller.GetType().GetProperty("exposedParameters", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
            var exposed = (Array)exposedProperty.GetValue(controller);
            var names = exposed.Cast<object>().Select(item => (string)item.GetType().GetField("name", BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).GetValue(item)).ToHashSet(StringComparer.Ordinal);
            foreach (var parameter in new[] { U49AudioMixerParameters.MasterVolumeDb, U49AudioMixerParameters.BgmVolumeDb, U49AudioMixerParameters.SeVolumeDb, U49AudioMixerParameters.UiVolumeDb })
                if (!names.Contains(parameter)) throw new InvalidOperationException("Missing exposed parameter: " + parameter);
        }

        private static void EnsureFolder(string path)
        {
            var parts = path.Split('/');
            var current = parts[0];
            for (var index = 1; index < parts.Length; index++)
            {
                var next = current + "/" + parts[index];
                if (!AssetDatabase.IsValidFolder(next)) AssetDatabase.CreateFolder(current, parts[index]);
                current = next;
            }
        }
    }
}
