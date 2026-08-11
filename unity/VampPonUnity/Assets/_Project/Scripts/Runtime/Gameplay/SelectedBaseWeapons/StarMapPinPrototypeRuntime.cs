using System;
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    /// <summary>
    /// Caller-owned prototype telemetry. Selection facts and MARKED hit outcomes are observed
    /// without creating global/static lifetime or freezing prototype tuning as Canon.
    /// </summary>
    public sealed class StarMapPinPrototypeTelemetry
    {
        public int InvocationCount { get; private set; }
        public int CandidateCountTotal { get; private set; }
        public int SelectionSuccessCount { get; private set; }
        public int SelectionFailureCount { get; private set; }
        public int ProjectileFireAttemptCount { get; private set; }
        public int ProjectileFiredCount { get; private set; }
        public int ProjectileRejectedCount { get; private set; }
        public int StatusApplyAttemptCount { get; private set; }
        public int StatusAppliedCount { get; private set; }
        public int StatusBlockedByInternalCooldownCount { get; private set; }
        public int LastSelectedCandidateIndex { get; private set; } = -1;
        public float LastSelectedPriorityScore { get; private set; }
        public float LastSelectedDistanceSquared { get; private set; }

        internal void RecordSelectionAttempt(
            int candidateCount,
            bool selected,
            U2EnemyPrioritySelectionResult result)
        {
            InvocationCount++;
            CandidateCountTotal += Math.Max(0, candidateCount);
            if (!selected)
            {
                SelectionFailureCount++;
                LastSelectedCandidateIndex = -1;
                LastSelectedPriorityScore = 0f;
                LastSelectedDistanceSquared = 0f;
                return;
            }

            SelectionSuccessCount++;
            LastSelectedCandidateIndex = result.CandidateIndex;
            LastSelectedPriorityScore = result.PriorityScore;
            LastSelectedDistanceSquared = result.DistanceSquared;
        }

        internal void RecordProjectileResult(bool fired)
        {
            ProjectileFireAttemptCount++;
            if (fired) ProjectileFiredCount++;
            else ProjectileRejectedCount++;
        }

        internal void RecordStatusResult(EnemyStatusApplyResult result)
        {
            StatusApplyAttemptCount++;
            if (result == EnemyStatusApplyResult.Applied)
            {
                StatusAppliedCount++;
            }
            else if (result == EnemyStatusApplyResult.BlockedByInternalCooldown)
            {
                StatusBlockedByInternalCooldownCount++;
            }
        }

        public void Reset()
        {
            InvocationCount = 0;
            CandidateCountTotal = 0;
            SelectionSuccessCount = 0;
            SelectionFailureCount = 0;
            ProjectileFireAttemptCount = 0;
            ProjectileFiredCount = 0;
            ProjectileRejectedCount = 0;
            StatusApplyAttemptCount = 0;
            StatusAppliedCount = 0;
            StatusBlockedByInternalCooldownCount = 0;
            LastSelectedCandidateIndex = -1;
            LastSelectedPriorityScore = 0f;
            LastSelectedDistanceSquared = 0f;
        }
    }

    /// <summary>
    /// Selected16 prototype caller for star_map_pin / 星図のピン.
    ///
    /// Priority-score meaning, range, tie-break, projectile damage/pierce and every MARKED
    /// policy value stay caller supplied. The caller composes shared selection with the existing
    /// explicit-target projectile path; it does not enter live Stage1 or define Canon balance.
    /// </summary>
    public static class StarMapPinPrototypeRuntime
    {
        public const string WeaponId = "star_map_pin";
        public const string ContentStatusId = "MARKED";
        public const string TuningAuthority = "CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON";
        public const string RuntimeBoundary = "PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE";
        public const string ApplicationOrder = "PRIORITY_SELECT_TARGETED_PROJECTILE_MARKED_ON_HIT";

        public static EnemyStatusApplicationRequest CreateMarkedRequest(
            EnemyStatusApplicationPolicy markedPolicy,
            StarMapPinPrototypeTelemetry telemetry = null)
        {
            Action<EnemyStatusApplyResult> observer = null;
            if (telemetry != null)
            {
                observer = telemetry.RecordStatusResult;
            }

            return new EnemyStatusApplicationRequest(
                EnemyStatusRuntimeKind.Marked,
                markedPolicy,
                observer);
        }

        public static bool Fire(
            U2BattleController battle,
            IReadOnlyList<U2EnemyActor> candidates,
            IReadOnlyList<float> priorityScores,
            Vector3 selectionOrigin,
            float minRange,
            float maxRange,
            U2EnemyPriorityDistanceTieBreak distanceTieBreak,
            float damage,
            int pierce,
            EnemyStatusApplicationPolicy markedPolicy,
            StarMapPinPrototypeTelemetry telemetry = null)
        {
            if (battle == null) throw new ArgumentNullException(nameof(battle));

            var selected = U2EnemyHomingPrioritySelectionRuntime.TrySelect(
                candidates,
                priorityScores,
                selectionOrigin,
                minRange,
                maxRange,
                distanceTieBreak,
                out var selection);
            telemetry?.RecordSelectionAttempt(candidates?.Count ?? 0, selected, selection);
            if (!selected)
            {
                return false;
            }

            var fired = battle.FireGameplayProjectileAtTarget(
                selection.Target,
                damage,
                pierce,
                CreateMarkedRequest(markedPolicy, telemetry));
            telemetry?.RecordProjectileResult(fired);
            return fired;
        }
    }
}
