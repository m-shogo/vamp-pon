#if VAMPPON_U49_DEVICE_VERIFICATION && DEVELOPMENT_BUILD
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U49.AudioHaptic
{
    public sealed class U49DeviceVerificationHarness : MonoBehaviour
    {
        [Serializable]
        private sealed class Session
        {
            public int schemaVersion = 2;
            public string platform = "iOS";
            public string deviceFamily = "iPhone";
            public string osVersion;
            public string unityVersion;
            public string buildConfiguration = "Development device verification";
            public bool simulatorEvidenceAccepted;
            public bool sequenceStarted;
            public bool sequenceCompleted;
            public bool sequenceStopped;
            public bool supportsHaptics;
            public string hapticCapability;
            public bool hapticSettingOffBlockedExecution;
            public bool hapticSettingOnRestoredExecution;
            public int backgroundCount;
            public int foregroundCount;
            public int audioPlayCount;
            public int audioGuardedCount;
            public int missingClipCount;
            public int hapticRequestCount;
            public int hapticExecutedCount;
            public List<string> requestedAudioEvents = new();
            public List<string> requestedHapticEvents = new();
            public string diagnosticsJson;
        }

        private static readonly U28AudioEventId[] AudioSequence =
        {
            U28AudioEventId.StageSelectLantern, U28AudioEventId.BattleStart, U28AudioEventId.PickupXp,
            U28AudioEventId.PickupHeal, U28AudioEventId.PickupRare, U28AudioEventId.WeaponFireSoft,
            U28AudioEventId.EnemyHitSoft, U28AudioEventId.EnemyDefeatInk, U28AudioEventId.PlayerDamage,
            U28AudioEventId.LevelupOpen, U28AudioEventId.CardSelect, U28AudioEventId.CardConfirm,
            U28AudioEventId.EvolutionConvergence, U28AudioEventId.EvolutionComplete, U28AudioEventId.KokuyouGaugeReady,
            U28AudioEventId.KokuyouActivation, U28AudioEventId.KokuyouEnding, U28AudioEventId.ResultStamp,
            U28AudioEventId.RewardCard, U28AudioEventId.UnlockReveal, U28AudioEventId.StageRouteUnlock,
            U28AudioEventId.RetryConfirm,
        };

        private static readonly U28HapticEventId[] HapticSequence =
        {
            U28HapticEventId.LightTap, U28HapticEventId.SoftPickup, U28HapticEventId.CardSelect,
            U28HapticEventId.Damage, U28HapticEventId.RarePulse, U28HapticEventId.EvolutionComplete,
            U28HapticEventId.KokuyouReady, U28HapticEventId.KokuyouActivation,
            U28HapticEventId.ResultStamp, U28HapticEventId.UnlockReveal,
        };

        private U49AudioHapticRuntimeOwner owner;
        private Session session;
        private Coroutine sequence;
        private Vector2 scroll;
        private string current = "initializing";

        private string SessionPath => Path.Combine(Application.persistentDataPath, "u49-device-session.json");

        private void Start()
        {
            owner = U43RuntimeFeedbackBridge.Instance?.Owner;
            session = new Session
            {
                osVersion = SystemInfo.operatingSystem,
                unityVersion = Application.unityVersion,
                simulatorEvidenceAccepted = false,
            };
            SaveSession();
        }

        private void OnDestroy() => StopSequence();

        private void OnApplicationPause(bool paused)
        {
            if (session == null) return;
            if (paused) session.backgroundCount++; else session.foregroundCount++;
            SaveSession();
        }

        private void OnGUI()
        {
            const float width = 350f;
            GUILayout.BeginArea(new Rect(12f, 36f, width, Screen.height - 48f), GUI.skin.box);
            GUILayout.Label("U49 DEVICE AUDIO / HAPTIC VERIFICATION");
            GUILayout.Label($"current: {current}");
            GUILayout.Label($"audioReady={owner?.AudioRuntimeReady} hapticSupported={owner?.HapticRuntimeSupported}");
            GUILayout.BeginHorizontal();
            if (GUILayout.Button("START AUTO", GUILayout.Height(44f))) StartSequence();
            if (GUILayout.Button("STOP", GUILayout.Height(44f))) StopSequence();
            GUILayout.EndHorizontal();
            scroll = GUILayout.BeginScrollView(scroll);
            GUILayout.Label("22 SE");
            foreach (var id in AudioSequence)
                if (GUILayout.Button(id.ToString(), GUILayout.Height(34f))) PlayAudio(id);
            GUILayout.Label("10 HAPTICS");
            foreach (var id in HapticSequence)
                if (GUILayout.Button(id.ToString(), GUILayout.Height(34f))) PlayHaptic(id);
            GUILayout.EndScrollView();
            GUILayout.EndArea();
        }

        private void StartSequence()
        {
            StopSequence();
            session.sequenceStarted = true;
            session.sequenceStopped = false;
            session.sequenceCompleted = false;
            sequence = StartCoroutine(RunSequence());
        }

        private void StopSequence()
        {
            if (sequence != null) StopCoroutine(sequence);
            sequence = null;
            owner?.StopAll();
            if (session != null && !session.sequenceCompleted) session.sequenceStopped = true;
            SaveSession();
        }

        private IEnumerator RunSequence()
        {
            foreach (var id in AudioSequence)
            {
                PlayAudio(id);
                yield return new WaitForSecondsRealtime(1.25f);
            }
            foreach (var id in HapticSequence)
            {
                PlayHaptic(id);
                yield return new WaitForSecondsRealtime(1.25f);
            }

            owner.SetHapticEnabled(false);
            var before = owner.Diagnostics.hapticExecutedCount;
            owner.PlayHaptic(U28HapticEventId.LightTap);
            session.hapticSettingOffBlockedExecution = owner.Diagnostics.hapticExecutedCount == before;
            yield return new WaitForSecondsRealtime(0.5f);
            owner.SetHapticEnabled(true);
            owner.PlayHaptic(U28HapticEventId.LightTap);
            session.hapticSettingOnRestoredExecution = !owner.HapticRuntimeSupported || owner.Diagnostics.hapticExecutedCount > before;
            session.sequenceCompleted = true;
            current = "sequence complete; perform background/foreground and human review";
            sequence = null;
            SaveSession();
        }

        private void PlayAudio(U28AudioEventId id)
        {
            current = "audio " + id;
            session.requestedAudioEvents.Add(id.ToString());
            owner?.Play(id, true, Time.realtimeSinceStartupAsDouble);
            SaveSession();
        }

        private void PlayHaptic(U28HapticEventId id)
        {
            current = "haptic " + id;
            session.requestedHapticEvents.Add(id.ToString());
            owner?.PlayHaptic(id);
            SaveSession();
        }

        private void SaveSession()
        {
            if (session == null || owner == null) return;
            var diagnostics = owner.Diagnostics;
            session.supportsHaptics = owner.HapticRuntimeSupported;
            session.hapticCapability = diagnostics.hapticCapability;
            session.audioPlayCount = diagnostics.audioPlayCount;
            session.audioGuardedCount = diagnostics.audioGuardedCount;
            session.missingClipCount = diagnostics.missingClipCount;
            session.hapticRequestCount = diagnostics.hapticRequestCount;
            session.hapticExecutedCount = diagnostics.hapticExecutedCount;
            session.diagnosticsJson = JsonUtility.ToJson(diagnostics);
            File.WriteAllText(SessionPath, JsonUtility.ToJson(session, true));
        }
    }
}
#endif
