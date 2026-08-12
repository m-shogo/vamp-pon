using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    public sealed class CopperTuningForkPrototypeTelemetry
    {
        public int PulseAttemptCount { get; private set; }
        public int PulseSuccessCount { get; private set; }
        public int SelectedTargetCount { get; private set; }
        public int ConductivePreferredSelectionCount { get; private set; }
        public int DamageHitCount { get; private set; }
        public int DefeatedCount { get; private set; }
        public int ShockApplyAttemptCount { get; private set; }
        public int ShockAppliedCount { get; private set; }
        public int ShockBlockedByInternalCooldownCount { get; private set; }
        public int ConductiveApplyAttemptCount { get; private set; }
        public int ConductiveAppliedCount { get; private set; }
        public int ConductiveBlockedByInternalCooldownCount { get; private set; }

        internal void RecordPulseAttempt() => PulseAttemptCount++;

        internal void RecordSelection(IReadOnlyList<U2EnemyActor> selected, HashSet<U2EnemyActor> conductiveBeforePulse)
        {
            if (selected.Count > 0) PulseSuccessCount++;
            SelectedTargetCount += selected.Count;
            for (var i = 0; i < selected.Count; i++)
            {
                if (conductiveBeforePulse.Contains(selected[i])) ConductivePreferredSelectionCount++;
            }
        }

        internal void RecordDamage(bool defeated)
        {
            DamageHitCount++;
            if (defeated) DefeatedCount++;
        }

        internal void RecordShock(EnemyStatusApplyResult result)
        {
            ShockApplyAttemptCount++;
            if (result == EnemyStatusApplyResult.Applied) ShockAppliedCount++;
            else if (result == EnemyStatusApplyResult.BlockedByInternalCooldown) ShockBlockedByInternalCooldownCount++;
        }

        internal void RecordConductive(EnemyStatusApplyResult result)
        {
            ConductiveApplyAttemptCount++;
            if (result == EnemyStatusApplyResult.Applied) ConductiveAppliedCount++;
            else if (result == EnemyStatusApplyResult.BlockedByInternalCooldown) ConductiveBlockedByInternalCooldownCount++;
        }

        public void Reset()
        {
            PulseAttemptCount = 0;
            PulseSuccessCount = 0;
            SelectedTargetCount = 0;
            ConductivePreferredSelectionCount = 0;
            DamageHitCount = 0;
            DefeatedCount = 0;
            ShockApplyAttemptCount = 0;
            ShockAppliedCount = 0;
            ShockBlockedByInternalCooldownCount = 0;
            ConductiveApplyAttemptCount = 0;
            ConductiveAppliedCount = 0;
            ConductiveBlockedByInternalCooldownCount = 0;
        }
    }

    /// <summary>
    /// Selected16 prototype caller for copper_tuning_fork / 銅の音叉.
    /// The caller snapshots CONDUCTIVE preference into scores before chain selection, then applies
    /// damage -> SHOCK -> CONDUCTIVE per surviving hop. All score/tuning meaning stays caller-owned.
    /// </summary>
    public sealed class CopperTuningForkPrototypeRuntime
    {
        public const string WeaponId = "copper_tuning_fork";
        public const string PrimaryContentStatusId = "SHOCK";
        public const string PreferenceContentStatusId = "CONDUCTIVE";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";
        public const string ApplicationOrder = "PRIORITY_SNAPSHOT_CHAIN_DAMAGE_SURVIVING_SHOCK_THEN_CONDUCTIVE";

        private readonly List<float> priorityScratch = new();
        private readonly List<U2EnemyActor> chainScratch = new();
        private readonly HashSet<U2EnemyActor> conductiveBeforePulse = new();

        public int Pulse(
            IReadOnlyList<U2EnemyActor> candidates,
            IReadOnlyList<float> basePriorityScores,
            Vector3 origin,
            float maxFirstRange,
            float maxHopDistance,
            int maxTargets,
            float conductivePriorityBonus,
            float damage,
            float damageFlashSeconds,
            EnemyStatusApplicationPolicy shockPolicy,
            EnemyStatusApplicationPolicy conductivePolicy,
            CopperTuningForkPrototypeTelemetry telemetry = null)
        {
            telemetry?.RecordPulseAttempt();
            if (candidates == null ||
                basePriorityScores == null ||
                candidates.Count != basePriorityScores.Count ||
                !IsFinite(origin) ||
                !IsFinitePositive(maxFirstRange) ||
                !IsFinitePositive(maxHopDistance) ||
                maxTargets <= 0 ||
                !IsFiniteNonNegative(conductivePriorityBonus) ||
                !IsFinitePositive(damage) ||
                !IsFiniteNonNegative(damageFlashSeconds))
            {
                ClearScratch();
                return 0;
            }

            priorityScratch.Clear();
            conductiveBeforePulse.Clear();
            for (var i = 0; i < candidates.Count; i++)
            {
                var candidate = candidates[i];
                var baseScore = basePriorityScores[i];
                if (candidate == null || !float.IsFinite(baseScore))
                {
                    priorityScratch.Add(float.NaN);
                    continue;
                }

                var score = baseScore;
                if (candidate.IsTargetable && candidate.Statuses.Has(EnemyStatusRuntimeKind.Conductive))
                {
                    conductiveBeforePulse.Add(candidate);
                    score += conductivePriorityBonus;
                }
                priorityScratch.Add(float.IsFinite(score) ? score : float.NaN);
            }

            var selectedCount = U2EnemyTargetChainSelectionRuntime.SelectChain(
                candidates,
                priorityScratch,
                origin,
                maxFirstRange,
                maxHopDistance,
                maxTargets,
                chainScratch);
            telemetry?.RecordSelection(chainScratch, conductiveBeforePulse);
            if (selectedCount <= 0)
            {
                ClearScratch();
                return 0;
            }

            var shockRequest = CreateStatusRequest(EnemyStatusRuntimeKind.Shock, shockPolicy, telemetry, true);
            var conductiveRequest = CreateStatusRequest(EnemyStatusRuntimeKind.Conductive, conductivePolicy, telemetry, false);
            var damagedCount = 0;
            for (var i = 0; i < chainScratch.Count; i++)
            {
                var target = chainScratch[i];
                if (target == null || !target.IsTargetable) continue;

                var defeated = target.TakeDamage(damage, damageFlashSeconds);
                damagedCount++;
                telemetry?.RecordDamage(defeated);
                if (defeated) continue;

                shockRequest.ApplyTo(target.Statuses);
                conductiveRequest.ApplyTo(target.Statuses);
            }

            ClearScratch();
            return damagedCount;
        }

        public void ResetScratch() => ClearScratch();

        private static EnemyStatusApplicationRequest CreateStatusRequest(
            EnemyStatusRuntimeKind kind,
            EnemyStatusApplicationPolicy policy,
            CopperTuningForkPrototypeTelemetry telemetry,
            bool shockObserver)
        {
            Action<EnemyStatusApplyResult> observer = null;
            if (telemetry != null)
            {
                observer = shockObserver ? telemetry.RecordShock : telemetry.RecordConductive;
            }
            return new EnemyStatusApplicationRequest(kind, policy, observer);
        }

        private void ClearScratch()
        {
            priorityScratch.Clear();
            chainScratch.Clear();
            conductiveBeforePulse.Clear();
        }

        private static bool IsFinite(Vector3 value)
            => float.IsFinite(value.x) && float.IsFinite(value.y) && float.IsFinite(value.z);

        private static bool IsFinitePositive(float value)
            => float.IsFinite(value) && value > 0f;

        private static bool IsFiniteNonNegative(float value)
            => float.IsFinite(value) && value >= 0f;
    }
}
