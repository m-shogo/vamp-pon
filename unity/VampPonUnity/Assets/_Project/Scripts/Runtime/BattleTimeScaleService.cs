using System.Collections.Generic;
using UnityEngine;

namespace VampPon.UnitySpike.Runtime
{
    public static class BattleTimeScaleService
    {
        private static readonly HashSet<string> PauseOwners = new();
        private static string hitStopOwner;
        private static float hitStopRemaining;
        private static float hitStopScale = 1f;
        private static string debugOwnerReason = "normal";

        public static bool IsPaused => PauseOwners.Count > 0;
        public static float CurrentScale { get; private set; } = 1f;
        public static string DebugOwnerReason => debugOwnerReason;

        public static void RegisterPause(string owner)
        {
            if (string.IsNullOrWhiteSpace(owner))
            {
                owner = "unknown-pause";
            }

            PauseOwners.Add(owner);
            debugOwnerReason = $"pause:{owner}";
            ApplyScale();
        }

        public static void ReleasePause(string owner)
        {
            if (!string.IsNullOrWhiteSpace(owner))
            {
                PauseOwners.Remove(owner);
            }

            debugOwnerReason = IsPaused ? "pause:remaining" : "normal";
            ApplyScale();
        }

        public static void TriggerHitStop(string owner, float duration, float scale)
        {
            if (duration <= 0f)
            {
                return;
            }

            hitStopOwner = string.IsNullOrWhiteSpace(owner) ? "unknown-hit-stop" : owner;
            hitStopRemaining = duration;
            hitStopScale = Mathf.Clamp(scale, 0f, 1f);
            debugOwnerReason = $"hit-stop:{hitStopOwner}";
            ApplyScale();
        }

        public static void ReleaseHitStop(string owner)
        {
            if (string.IsNullOrWhiteSpace(owner) || owner == hitStopOwner)
            {
                hitStopOwner = null;
                hitStopRemaining = 0f;
                hitStopScale = 1f;
                debugOwnerReason = IsPaused ? "pause:remaining" : "normal";
                ApplyScale();
            }
        }

        public static void Tick(float unscaledDeltaTime)
        {
            if (hitStopRemaining <= 0f)
            {
                return;
            }

            hitStopRemaining -= unscaledDeltaTime;
            if (hitStopRemaining <= 0f)
            {
                ReleaseHitStop(hitStopOwner);
            }
        }

        public static void ForceRestore()
        {
            PauseOwners.Clear();
            hitStopOwner = null;
            hitStopRemaining = 0f;
            hitStopScale = 1f;
            debugOwnerReason = "force-restore";
            CurrentScale = 1f;
            Time.timeScale = 1f;
        }

        private static void ApplyScale()
        {
            CurrentScale = IsPaused ? 0f : hitStopRemaining > 0f ? hitStopScale : 1f;
            Time.timeScale = CurrentScale;
        }
    }
}
