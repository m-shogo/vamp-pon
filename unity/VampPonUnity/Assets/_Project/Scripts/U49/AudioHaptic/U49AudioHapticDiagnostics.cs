using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U49.AudioHaptic
{
    [Serializable]
    public sealed class U49AudioScheduleRecord
    {
        public string eventId;
        public double requestRealtime;
        public double routerRealtime;
        public double audioSettingsDspTime;
        public double scheduledDspStart;
        public double mainThreadDelayMilliseconds;
        public int simultaneousVoiceCount;
        public bool guarded;
        public string guardReason;
    }

    [Serializable]
    public sealed class U49AudioHapticDiagnostics
    {
        public bool profileLoaded;
        public bool mixerRoutingComplete;
        public bool hapticInitialized;
        public string hapticCapability;
        public string hapticLastError;
        public int audioPlayCount;
        public int audioGuardedCount;
        public int missingClipCount;
        public int hapticRequestCount;
        public int hapticExecutedCount;
        public int backgroundCount;
        public int foregroundCount;
        public List<string> missingEvents = new();
        public List<U49AudioScheduleRecord> audioScheduleRecords = new();

        public void RecordAudio(U28AudioEventId id, double requestRealtime, double routerRealtime, double dspTime, double scheduledDspStart, int voices)
        {
            audioPlayCount++;
            audioScheduleRecords.Add(new U49AudioScheduleRecord
            {
                eventId = id.ToString(), requestRealtime = requestRealtime, routerRealtime = routerRealtime,
                audioSettingsDspTime = dspTime, scheduledDspStart = scheduledDspStart,
                mainThreadDelayMilliseconds = Math.Max(0d, (routerRealtime - requestRealtime) * 1000d),
                simultaneousVoiceCount = voices, guarded = false, guardReason = string.Empty,
            });
        }

        public void RecordGuard(U28AudioEventId id, double requestRealtime, string reason, int voices)
        {
            audioGuardedCount++;
            audioScheduleRecords.Add(new U49AudioScheduleRecord
            {
                eventId = id.ToString(), requestRealtime = requestRealtime, routerRealtime = Time.realtimeSinceStartupAsDouble,
                audioSettingsDspTime = AudioSettings.dspTime, scheduledDspStart = 0d,
                mainThreadDelayMilliseconds = Math.Max(0d, (Time.realtimeSinceStartupAsDouble - requestRealtime) * 1000d),
                simultaneousVoiceCount = voices, guarded = true, guardReason = reason,
            });
        }
    }
}
