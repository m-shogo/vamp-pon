using System;
using System.Collections.Generic;

namespace VampPon.UnitySpike.Runtime.Gameplay.Status
{
    public enum EnemyStatusRuntimeKind
    {
        Burn,
        Soak,
        Chill,
        Freeze,
        Shock,
        Conductive,
        Exposed,
        Rooted,
        Drowsy,
        Sleep,
        Marked,
        Illuminated,
        Eclipsed,
        Erased,
        Sealed,
        Disoriented,
    }

    public enum EnemyStatusApplyResult
    {
        Applied,
        Refreshed,
        Stacked,
        BlockedByReapplyCooldown,
        RejectedInvalidArguments,
    }

    public enum BossStatusDisposition
    {
        Preserve,
        ReduceMagnitude,
        ConvertToSlow,
        ConvertToActionDelay,
    }

    public readonly struct EnemyStatusRuntimeSnapshot
    {
        public EnemyStatusRuntimeSnapshot(EnemyStatusRuntimeKind kind, float remainingSeconds, int stacks)
        {
            Kind = kind;
            RemainingSeconds = remainingSeconds;
            Stacks = stacks;
        }

        public EnemyStatusRuntimeKind Kind { get; }
        public float RemainingSeconds { get; }
        public int Stacks { get; }
    }

    /// <summary>
    /// Shared enemy Status state foundation for the Selected16 runtime work.
    ///
    /// This class deliberately owns only generic lifecycle state:
    /// - exact content Status IDs
    /// - duration refresh
    /// - bounded stacks
    /// - explicit reapply cooldowns
    /// - deterministic expiry
    ///
    /// It does not freeze damage, slow percentages, Boss durations, VFX, or weapon-specific rules.
    /// Those belong to later runtime policy/tuning layers.
    /// </summary>
    public sealed class EnemyStatusRuntimeState
    {
        private sealed class ActiveStatus
        {
            public float RemainingSeconds;
            public int Stacks;
        }

        private readonly Dictionary<EnemyStatusRuntimeKind, ActiveStatus> activeStatuses = new();
        private readonly Dictionary<EnemyStatusRuntimeKind, float> reapplyCooldowns = new();
        private readonly List<EnemyStatusRuntimeKind> scratchKinds = new(16);

        public int ActiveCount => activeStatuses.Count;
        public int ReapplyCooldownCount => reapplyCooldowns.Count;

        public static bool TryParseContentStatusId(string value, out EnemyStatusRuntimeKind kind)
        {
            switch (value)
            {
                case "BURN": kind = EnemyStatusRuntimeKind.Burn; return true;
                case "SOAK": kind = EnemyStatusRuntimeKind.Soak; return true;
                case "CHILL": kind = EnemyStatusRuntimeKind.Chill; return true;
                case "FREEZE": kind = EnemyStatusRuntimeKind.Freeze; return true;
                case "SHOCK": kind = EnemyStatusRuntimeKind.Shock; return true;
                case "CONDUCTIVE": kind = EnemyStatusRuntimeKind.Conductive; return true;
                case "EXPOSED": kind = EnemyStatusRuntimeKind.Exposed; return true;
                case "ROOTED": kind = EnemyStatusRuntimeKind.Rooted; return true;
                case "DROWSY": kind = EnemyStatusRuntimeKind.Drowsy; return true;
                case "SLEEP": kind = EnemyStatusRuntimeKind.Sleep; return true;
                case "MARKED": kind = EnemyStatusRuntimeKind.Marked; return true;
                case "ILLUMINATED": kind = EnemyStatusRuntimeKind.Illuminated; return true;
                case "ECLIPSED": kind = EnemyStatusRuntimeKind.Eclipsed; return true;
                case "ERASED": kind = EnemyStatusRuntimeKind.Erased; return true;
                case "SEALED": kind = EnemyStatusRuntimeKind.Sealed; return true;
                case "DISORIENTED": kind = EnemyStatusRuntimeKind.Disoriented; return true;
                default:
                    kind = default;
                    return false;
            }
        }

        public static string ToContentStatusId(EnemyStatusRuntimeKind kind)
        {
            return kind switch
            {
                EnemyStatusRuntimeKind.Burn => "BURN",
                EnemyStatusRuntimeKind.Soak => "SOAK",
                EnemyStatusRuntimeKind.Chill => "CHILL",
                EnemyStatusRuntimeKind.Freeze => "FREEZE",
                EnemyStatusRuntimeKind.Shock => "SHOCK",
                EnemyStatusRuntimeKind.Conductive => "CONDUCTIVE",
                EnemyStatusRuntimeKind.Exposed => "EXPOSED",
                EnemyStatusRuntimeKind.Rooted => "ROOTED",
                EnemyStatusRuntimeKind.Drowsy => "DROWSY",
                EnemyStatusRuntimeKind.Sleep => "SLEEP",
                EnemyStatusRuntimeKind.Marked => "MARKED",
                EnemyStatusRuntimeKind.Illuminated => "ILLUMINATED",
                EnemyStatusRuntimeKind.Eclipsed => "ECLIPSED",
                EnemyStatusRuntimeKind.Erased => "ERASED",
                EnemyStatusRuntimeKind.Sealed => "SEALED",
                EnemyStatusRuntimeKind.Disoriented => "DISORIENTED",
                _ => throw new ArgumentOutOfRangeException(nameof(kind), kind, "Unknown enemy Status kind."),
            };
        }

        public static BossStatusDisposition GetBossDisposition(EnemyStatusRuntimeKind kind)
        {
            return kind switch
            {
                EnemyStatusRuntimeKind.Freeze => BossStatusDisposition.ConvertToSlow,
                EnemyStatusRuntimeKind.Rooted => BossStatusDisposition.ConvertToSlow,
                EnemyStatusRuntimeKind.Sleep => BossStatusDisposition.ConvertToActionDelay,
                EnemyStatusRuntimeKind.Chill => BossStatusDisposition.ReduceMagnitude,
                EnemyStatusRuntimeKind.Drowsy => BossStatusDisposition.ReduceMagnitude,
                _ => BossStatusDisposition.Preserve,
            };
        }

        public bool Has(EnemyStatusRuntimeKind kind) => activeStatuses.ContainsKey(kind);

        public float GetRemainingSeconds(EnemyStatusRuntimeKind kind)
        {
            return activeStatuses.TryGetValue(kind, out var status) ? status.RemainingSeconds : 0f;
        }

        public int GetStacks(EnemyStatusRuntimeKind kind)
        {
            return activeStatuses.TryGetValue(kind, out var status) ? status.Stacks : 0;
        }

        public float GetReapplyCooldownSeconds(EnemyStatusRuntimeKind kind)
        {
            return reapplyCooldowns.TryGetValue(kind, out var seconds) ? seconds : 0f;
        }

        public EnemyStatusApplyResult Apply(
            EnemyStatusRuntimeKind kind,
            float durationSeconds,
            int stackDelta = 1,
            int maxStacks = 1)
        {
            if (durationSeconds <= 0f || stackDelta <= 0 || maxStacks <= 0)
            {
                return EnemyStatusApplyResult.RejectedInvalidArguments;
            }

            if (GetReapplyCooldownSeconds(kind) > 0f)
            {
                return EnemyStatusApplyResult.BlockedByReapplyCooldown;
            }

            if (!activeStatuses.TryGetValue(kind, out var status))
            {
                activeStatuses.Add(kind, new ActiveStatus
                {
                    RemainingSeconds = durationSeconds,
                    Stacks = Math.Min(stackDelta, maxStacks),
                });
                return EnemyStatusApplyResult.Applied;
            }

            status.RemainingSeconds = Math.Max(status.RemainingSeconds, durationSeconds);
            var previousStacks = status.Stacks;
            status.Stacks = Math.Min(maxStacks, status.Stacks + stackDelta);
            return status.Stacks > previousStacks
                ? EnemyStatusApplyResult.Stacked
                : EnemyStatusApplyResult.Refreshed;
        }

        public bool Remove(EnemyStatusRuntimeKind kind, float reapplyCooldownSeconds = 0f)
        {
            var removed = activeStatuses.Remove(kind);
            if (reapplyCooldownSeconds > 0f)
            {
                StartReapplyCooldown(kind, reapplyCooldownSeconds);
            }
            return removed;
        }

        public void StartReapplyCooldown(EnemyStatusRuntimeKind kind, float seconds)
        {
            if (seconds <= 0f)
            {
                reapplyCooldowns.Remove(kind);
                return;
            }

            if (reapplyCooldowns.TryGetValue(kind, out var current))
            {
                reapplyCooldowns[kind] = Math.Max(current, seconds);
            }
            else
            {
                reapplyCooldowns.Add(kind, seconds);
            }
        }

        public void Tick(float deltaSeconds)
        {
            if (deltaSeconds <= 0f) return;

            scratchKinds.Clear();
            foreach (var pair in activeStatuses)
            {
                pair.Value.RemainingSeconds = Math.Max(0f, pair.Value.RemainingSeconds - deltaSeconds);
                if (pair.Value.RemainingSeconds <= 0f) scratchKinds.Add(pair.Key);
            }
            for (var i = 0; i < scratchKinds.Count; i++) activeStatuses.Remove(scratchKinds[i]);

            scratchKinds.Clear();
            foreach (var kind in reapplyCooldowns.Keys) scratchKinds.Add(kind);
            for (var i = 0; i < scratchKinds.Count; i++)
            {
                var kind = scratchKinds[i];
                var remaining = Math.Max(0f, reapplyCooldowns[kind] - deltaSeconds);
                if (remaining <= 0f) reapplyCooldowns.Remove(kind);
                else reapplyCooldowns[kind] = remaining;
            }
        }

        public EnemyStatusRuntimeSnapshot[] Snapshot()
        {
            var result = new EnemyStatusRuntimeSnapshot[activeStatuses.Count];
            var index = 0;
            foreach (var pair in activeStatuses)
            {
                result[index++] = new EnemyStatusRuntimeSnapshot(pair.Key, pair.Value.RemainingSeconds, pair.Value.Stacks);
            }
            Array.Sort(result, (left, right) => left.Kind.CompareTo(right.Kind));
            return result;
        }

        public void Clear()
        {
            activeStatuses.Clear();
            reapplyCooldowns.Clear();
            scratchKinds.Clear();
        }
    }
}
