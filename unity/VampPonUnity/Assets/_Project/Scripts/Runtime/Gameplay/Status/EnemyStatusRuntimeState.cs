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

    public enum EnemyStatusStackMode
    {
        Replace,
        Refresh,
        AddCapped,
    }

    public enum EnemyStatusMagnitudeMode
    {
        Replace,
        Max,
        AddCapped,
    }

    public enum EnemyStatusApplyResult
    {
        Applied,
        BlockedByInternalCooldown,
    }

    public enum BossStatusDisposition
    {
        Preserve,
        ReduceMagnitude,
        ConvertToSlow,
        ConvertToActionDelay,
    }

    /// <summary>
    /// Balance-neutral application policy. The caller must supply every tuning value explicitly.
    /// This mirrors src/game/domain/statusRuntime.ts semantics rather than owning per-Status defaults.
    /// </summary>
    public readonly struct EnemyStatusApplicationPolicy
    {
        public EnemyStatusApplicationPolicy(
            float durationSeconds,
            int stacksPerApplication,
            EnemyStatusStackMode stackMode,
            int maxStacks,
            float magnitude,
            EnemyStatusMagnitudeMode magnitudeMode,
            float maxMagnitude,
            float internalCooldownSeconds,
            bool respectInternalCooldown)
        {
            DurationSeconds = durationSeconds;
            StacksPerApplication = stacksPerApplication;
            StackMode = stackMode;
            MaxStacks = maxStacks;
            Magnitude = magnitude;
            MagnitudeMode = magnitudeMode;
            MaxMagnitude = maxMagnitude;
            InternalCooldownSeconds = internalCooldownSeconds;
            RespectInternalCooldown = respectInternalCooldown;
        }

        public float DurationSeconds { get; }
        public int StacksPerApplication { get; }
        public EnemyStatusStackMode StackMode { get; }
        public int MaxStacks { get; }
        public float Magnitude { get; }
        public EnemyStatusMagnitudeMode MagnitudeMode { get; }
        public float MaxMagnitude { get; }
        public float InternalCooldownSeconds { get; }
        public bool RespectInternalCooldown { get; }
    }

    public readonly struct EnemyStatusRuntimeSnapshot
    {
        public EnemyStatusRuntimeSnapshot(EnemyStatusRuntimeKind kind, float remainingSeconds, int stacks, float magnitude)
        {
            Kind = kind;
            RemainingSeconds = remainingSeconds;
            Stacks = stacks;
            Magnitude = magnitude;
        }

        public EnemyStatusRuntimeKind Kind { get; }
        public float RemainingSeconds { get; }
        public int Stacks { get; }
        public float Magnitude { get; }
    }

    /// <summary>
    /// Shared enemy Status state foundation for the Selected16 runtime work.
    ///
    /// This class owns generic lifecycle/application mechanics only:
    /// - exact content Status IDs
    /// - caller-supplied duration
    /// - replace / refresh / capped-add stacks
    /// - replace / max / capped-add magnitude
    /// - independent internal cooldown ledger
    /// - deterministic expiry / snapshot / entity reset
    ///
    /// It does not own BURN duration, CHILL ratio, Boss tuning numbers, VFX, or weapon-specific rules.
    /// </summary>
    public sealed class EnemyStatusRuntimeState
    {
        private sealed class ActiveStatus
        {
            public float RemainingSeconds;
            public int Stacks;
            public float Magnitude;
        }

        private readonly Dictionary<EnemyStatusRuntimeKind, ActiveStatus> activeStatuses = new();
        private readonly Dictionary<EnemyStatusRuntimeKind, float> internalCooldowns = new();
        private readonly List<EnemyStatusRuntimeKind> scratchKinds = new(16);

        public int ActiveCount => activeStatuses.Count;
        public int InternalCooldownCount => internalCooldowns.Count;
        public int ReapplyCooldownCount => InternalCooldownCount;

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

        public float GetMagnitude(EnemyStatusRuntimeKind kind)
        {
            return activeStatuses.TryGetValue(kind, out var status) ? status.Magnitude : 0f;
        }

        public float GetInternalCooldownSeconds(EnemyStatusRuntimeKind kind)
        {
            return internalCooldowns.TryGetValue(kind, out var seconds) ? seconds : 0f;
        }

        public float GetReapplyCooldownSeconds(EnemyStatusRuntimeKind kind) => GetInternalCooldownSeconds(kind);

        public EnemyStatusApplyResult Apply(EnemyStatusRuntimeKind kind, in EnemyStatusApplicationPolicy policy)
        {
            ValidatePolicy(policy);

            if (policy.RespectInternalCooldown && GetInternalCooldownSeconds(kind) > 0f)
            {
                return EnemyStatusApplyResult.BlockedByInternalCooldown;
            }

            activeStatuses.TryGetValue(kind, out var current);
            var nextStacks = ResolveStacks(current, policy);
            var nextMagnitude = ResolveMagnitude(current, policy);

            if (current == null)
            {
                current = new ActiveStatus();
                activeStatuses.Add(kind, current);
            }

            // Match the domain kernel: a successful application restarts duration from the caller policy.
            current.RemainingSeconds = policy.DurationSeconds;
            current.Stacks = nextStacks;
            current.Magnitude = nextMagnitude;

            if (policy.InternalCooldownSeconds > 0f)
            {
                // Match the domain kernel: successful application replaces the ledger value with this policy.
                internalCooldowns[kind] = policy.InternalCooldownSeconds;
            }

            return EnemyStatusApplyResult.Applied;
        }

        public bool ClearStatus(EnemyStatusRuntimeKind kind)
        {
            // Active clear intentionally preserves the independent cooldown ledger.
            return activeStatuses.Remove(kind);
        }

        public bool Remove(EnemyStatusRuntimeKind kind) => ClearStatus(kind);

        public void Tick(float deltaSeconds)
        {
            ValidateFiniteNonNegative(deltaSeconds, nameof(deltaSeconds));
            if (deltaSeconds == 0f) return;

            scratchKinds.Clear();
            foreach (var pair in activeStatuses)
            {
                pair.Value.RemainingSeconds = Math.Max(0f, pair.Value.RemainingSeconds - deltaSeconds);
                if (pair.Value.RemainingSeconds <= 0f) scratchKinds.Add(pair.Key);
            }
            for (var i = 0; i < scratchKinds.Count; i++) activeStatuses.Remove(scratchKinds[i]);

            scratchKinds.Clear();
            foreach (var kind in internalCooldowns.Keys) scratchKinds.Add(kind);
            for (var i = 0; i < scratchKinds.Count; i++)
            {
                var kind = scratchKinds[i];
                var remaining = Math.Max(0f, internalCooldowns[kind] - deltaSeconds);
                if (remaining <= 0f) internalCooldowns.Remove(kind);
                else internalCooldowns[kind] = remaining;
            }
        }

        public EnemyStatusRuntimeSnapshot[] Snapshot()
        {
            var result = new EnemyStatusRuntimeSnapshot[activeStatuses.Count];
            var index = 0;
            foreach (var pair in activeStatuses)
            {
                result[index++] = new EnemyStatusRuntimeSnapshot(
                    pair.Key,
                    pair.Value.RemainingSeconds,
                    pair.Value.Stacks,
                    pair.Value.Magnitude);
            }
            Array.Sort(result, (left, right) => left.Kind.CompareTo(right.Kind));
            return result;
        }

        /// <summary>
        /// Entity lifecycle reset. Unlike ClearStatus, this intentionally clears both active statuses and
        /// cooldown ledger so pooled enemies never inherit data from a previous spawn.
        /// </summary>
        public void Clear()
        {
            activeStatuses.Clear();
            internalCooldowns.Clear();
            scratchKinds.Clear();
        }

        private static int ResolveStacks(ActiveStatus current, in EnemyStatusApplicationPolicy policy)
        {
            if (current == null || policy.StackMode == EnemyStatusStackMode.Replace)
            {
                return policy.StacksPerApplication;
            }
            if (policy.StackMode == EnemyStatusStackMode.Refresh)
            {
                return current.Stacks;
            }
            return Math.Min(policy.MaxStacks, current.Stacks + policy.StacksPerApplication);
        }

        private static float ResolveMagnitude(ActiveStatus current, in EnemyStatusApplicationPolicy policy)
        {
            if (current == null || policy.MagnitudeMode == EnemyStatusMagnitudeMode.Replace)
            {
                return policy.Magnitude;
            }
            if (policy.MagnitudeMode == EnemyStatusMagnitudeMode.Max)
            {
                return Math.Max(current.Magnitude, policy.Magnitude);
            }
            return Math.Min(policy.MaxMagnitude, current.Magnitude + policy.Magnitude);
        }

        private static void ValidatePolicy(in EnemyStatusApplicationPolicy policy)
        {
            if (!float.IsFinite(policy.DurationSeconds) || policy.DurationSeconds <= 0f)
            {
                throw new ArgumentOutOfRangeException(nameof(policy), policy.DurationSeconds, "DurationSeconds must be finite and positive.");
            }
            if (policy.StacksPerApplication <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(policy), policy.StacksPerApplication, "StacksPerApplication must be positive.");
            }
            if (policy.MaxStacks <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(policy), policy.MaxStacks, "MaxStacks must be positive.");
            }
            if (policy.StacksPerApplication > policy.MaxStacks)
            {
                throw new ArgumentOutOfRangeException(nameof(policy), policy.StacksPerApplication, "StacksPerApplication must not exceed MaxStacks.");
            }
            ValidateFiniteNonNegative(policy.Magnitude, nameof(policy.Magnitude));
            ValidateFiniteNonNegative(policy.MaxMagnitude, nameof(policy.MaxMagnitude));
            if (policy.Magnitude > policy.MaxMagnitude)
            {
                throw new ArgumentOutOfRangeException(nameof(policy), policy.Magnitude, "Magnitude must not exceed MaxMagnitude.");
            }
            ValidateFiniteNonNegative(policy.InternalCooldownSeconds, nameof(policy.InternalCooldownSeconds));
        }

        private static void ValidateFiniteNonNegative(float value, string label)
        {
            if (!float.IsFinite(value) || value < 0f)
            {
                throw new ArgumentOutOfRangeException(label, value, $"{label} must be finite and non-negative.");
            }
        }
    }
}
