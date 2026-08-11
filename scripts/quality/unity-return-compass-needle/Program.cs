using System;
using System.Collections.Generic;
using VampPon.UnitySpike.Runtime.Gameplay.Primitives;
using VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons;
using VampPon.UnitySpike.Runtime.Gameplay.Status;

namespace UnityEngine
{
    public struct Vector3
    {
        public float x;
        public float y;
        public float z;
        public Vector3(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }
    }

    public sealed class Transform
    {
        public Vector3 position;
    }
}

namespace VampPon.UnitySpike.Runtime
{
    public sealed class U2EnemyActor
    {
        private float hp;

        public U2EnemyActor(float x, float y, float hp = 100f, bool targetable = true)
        {
            transform.position = new UnityEngine.Vector3(x, y, 7f);
            this.hp = hp;
            IsTargetable = targetable && hp > 0f;
        }

        public UnityEngine.Transform transform { get; } = new();
        public bool IsTargetable { get; private set; }
        public EnemyStatusRuntimeState Statuses { get; } = new();
        public float Hp => hp;

        public bool TakeDamage(float damage, float damageFlashSeconds)
        {
            if (!IsTargetable) return false;
            hp = Math.Max(0f, hp - damage);
            if (hp > 0f) return false;
            IsTargetable = false;
            return true;
        }

        public void SetTargetable(bool value) => IsTargetable = value && hp > 0f;
    }
}

internal static class Program
{
    private static void Require(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static bool Near(float left, float right)
        => Math.Abs(left - right) <= .0001f;

    private static EnemyStatusApplicationPolicy MarkPolicy(float cooldownSeconds = 10f)
        => new(
            durationSeconds: 5f,
            stacksPerApplication: 1,
            stackMode: EnemyStatusStackMode.Refresh,
            maxStacks: 1,
            magnitude: .25f,
            magnitudeMode: EnemyStatusMagnitudeMode.Max,
            maxMagnitude: .25f,
            internalCooldownSeconds: cooldownSeconds,
            respectInternalCooldown: true);

    private static void SeedMarked(VampPon.UnitySpike.Runtime.U2EnemyActor target)
    {
        var result = target.Statuses.Apply(EnemyStatusRuntimeKind.Marked, MarkPolicy());
        Require(result == EnemyStatusApplyResult.Applied, "MARKED seed should apply");
    }

    private static int Main()
    {
        var outbound = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 0f);
        var markedWaypoint = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 3f);
        var unmarkedHigherBase = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 3f);
        var outboundLineEnemy = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        var returnLineEnemy = new VampPon.UnitySpike.Runtime.U2EnemyActor(2.8f, 2.1f);
        var defeatedOutbound = new VampPon.UnitySpike.Runtime.U2EnemyActor(3f, 0f, hp: 5f);
        SeedMarked(markedWaypoint);

        var returnCandidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>
        {
            outbound,
            markedWaypoint,
            unmarkedHigherBase,
        };
        var baseScores = new List<float> { 100f, 1f, 4f };
        var hitCandidates = new List<VampPon.UnitySpike.Runtime.U2EnemyActor>
        {
            outbound,
            markedWaypoint,
            unmarkedHigherBase,
            outboundLineEnemy,
            returnLineEnemy,
            defeatedOutbound,
        };
        var state = new ReturnCompassNeedlePrototypeState();
        var telemetry = new ReturnCompassNeedlePrototypeTelemetry();
        var spawn = new UnityEngine.Vector3(0f, 0f, 9f);

        Require(state.TryBegin(
                spawn,
                outbound,
                returnCandidates,
                baseScores,
                minReturnRange: 0f,
                maxReturnRange: 6f,
                markedPriorityBonus: 5f,
                U2EnemyPriorityDistanceTieBreak.StableInputOrder,
                out var selection,
                telemetry),
            "valid Return Compass Needle begin should succeed");
        Require(state.ReturnWaypointTarget == markedWaypoint,
            "caller-supplied MARKED bonus should prefer marked return waypoint over higher unmarked base score");
        Require(selection.Target == markedWaypoint && Near(selection.PriorityScore, 6f),
            "return waypoint selection result should expose MARKED-adjusted caller score");
        Require(telemetry.MarkedPreferredWaypointCount == 1 && telemetry.ReturnWaypointSelectedCount == 1,
            "telemetry should record MARKED-priority return waypoint");
        Require(telemetry.LastSelectedCandidateIndex == 1,
            "outbound target must be excluded from return waypoint even with dominant base score");

        Require(state.TryStep(
                finalReturnAnchor: new UnityEngine.Vector3(0f, 0f, 100f),
                speed: 10f,
                deltaSeconds: 1f,
                arrivalDistance: .01f,
                hitCandidates,
                hitRadius: .16f,
                damage: 10f,
                damageFlashSeconds: .05f,
                MarkPolicy(),
                out var bentStep,
                telemetry),
            "bent return step should succeed");
        Require(bentStep.TurnedAround && bentStep.WaypointReached && !bentStep.Completed,
            "single step should cross outbound target and marked waypoint without completing early");
        Require(bentStep.Phase == U2ReturningWaypointPhase.ReturningToAnchor,
            "after waypoint the same step should continue toward final owner anchor");
        Require(Near(state.Position.x, 1.6f) && Near(state.Position.y, 1.2f) && Near(state.Position.z, 9f),
            "bent return path should preserve travel budget and projectile z");
        Require(Near(outboundLineEnemy.Hp, 90f), "outbound line enemy should be hit once");
        Require(!defeatedOutbound.IsTargetable && !defeatedOutbound.Statuses.Has(EnemyStatusRuntimeKind.Marked),
            "defeated outbound target must not receive MARKED after damage");
        Require(Near(markedWaypoint.Hp, 90f), "return waypoint target should be hit on return leg");
        Require(Near(returnLineEnemy.Hp, 90f), "post-waypoint return segment should use bent-path hit detection");
        Require(Near(unmarkedHigherBase.Hp, 100f), "off-route candidate must not be hit");
        Require(state.OutboundUniqueHitCount >= 2 && state.ReturnUniqueHitCount >= 2,
            "outbound and return hit ledgers should remain separate");

        Require(state.TryStep(
                finalReturnAnchor: new UnityEngine.Vector3(0f, 1f, -100f),
                speed: 10f,
                deltaSeconds: 1f,
                arrivalDistance: .01f,
                hitCandidates,
                hitRadius: .16f,
                damage: 10f,
                damageFlashSeconds: .05f,
                MarkPolicy(),
                out var completed,
                telemetry),
            "dynamic owner-anchor completion should succeed");
        Require(completed.Completed && state.IsComplete,
            "return route should complete only at final dynamic owner anchor");
        Require(Near(state.Position.x, 0f) && Near(state.Position.y, 1f) && Near(state.Position.z, 9f),
            "completion must use latest final owner anchor and preserve z");

        // Direct-return scenario proves one target can be hit once on each leg and Status cooldown does not block damage.
        var directOutbound = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 0f);
        var sharedLineEnemy = new VampPon.UnitySpike.Runtime.U2EnemyActor(2f, 0f);
        var noWaypointCandidate = new VampPon.UnitySpike.Runtime.U2EnemyActor(20f, 20f);
        var directState = new ReturnCompassNeedlePrototypeState();
        var directTelemetry = new ReturnCompassNeedlePrototypeTelemetry();
        Require(directState.TryBegin(
                spawn,
                directOutbound,
                new[] { directOutbound, noWaypointCandidate },
                new[] { 100f, 1f },
                0f,
                5f,
                10f,
                U2EnemyPriorityDistanceTieBreak.StableInputOrder,
                out var noWaypointSelection,
                directTelemetry),
            "direct-return begin should succeed without eligible alternate waypoint");
        Require(directState.ReturnWaypointTarget == null && noWaypointSelection.Target == null,
            "no eligible alternate target must produce direct return rather than fabricated waypoint");
        Require(directState.TryStep(
                new UnityEngine.Vector3(0f, 0f, 0f),
                10f,
                1f,
                .01f,
                new[] { directOutbound, sharedLineEnemy },
                .15f,
                10f,
                .05f,
                MarkPolicy(),
                out var directComplete,
                directTelemetry),
            "direct outbound-return step should succeed");
        Require(directComplete.Completed, "direct return should complete in same frame with sufficient budget");
        Require(Near(sharedLineEnemy.Hp, 80f),
            "same enemy should take one outbound and one return hit through separate leg ledgers");
        Require(directTelemetry.StatusAppliedCount >= 1 && directTelemetry.StatusBlockedByInternalCooldownCount >= 1,
            "return MARKED cooldown may block Status but must not block second-leg damage");

        // Waypoint loss redirects to final owner anchor without mutating Content selection.
        var lossOutbound = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 0f);
        var lossWaypoint = new VampPon.UnitySpike.Runtime.U2EnemyActor(4f, 3f);
        SeedMarked(lossWaypoint);
        var lossState = new ReturnCompassNeedlePrototypeState();
        var lossTelemetry = new ReturnCompassNeedlePrototypeTelemetry();
        Require(lossState.TryBegin(
                spawn,
                lossOutbound,
                new[] { lossOutbound, lossWaypoint },
                new[] { 100f, 1f },
                0f,
                6f,
                5f,
                U2EnemyPriorityDistanceTieBreak.StableInputOrder,
                out _,
                lossTelemetry),
            "waypoint-loss begin should succeed");
        lossWaypoint.SetTargetable(false);
        Require(lossState.TryStep(
                new UnityEngine.Vector3(0f, 0f, 0f),
                10f,
                1f,
                .01f,
                new[] { lossOutbound },
                .15f,
                10f,
                .05f,
                MarkPolicy(),
                out var lossComplete,
                lossTelemetry),
            "lost waypoint should fall back to final owner anchor");
        Require(lossComplete.Completed && lossTelemetry.WaypointLostCount == 1,
            "untargetable return waypoint should be skipped exactly once");

        var stablePhase = lossState.Phase;
        Require(!lossState.TryStep(
                new UnityEngine.Vector3(float.NaN, 0f, 0f),
                1f,
                1f,
                .01f,
                new[] { lossOutbound },
                .15f,
                10f,
                .05f,
                MarkPolicy(),
                out _,
                lossTelemetry),
            "non-finite final anchor must fail closed");
        Require(lossState.Phase == stablePhase, "invalid completed-state call must not fabricate new motion state");

        state.Reset();
        Require(!state.IsActive && !state.IsComplete && state.ReturnWaypointTarget == null &&
                state.OutboundUniqueHitCount == 0 && state.ReturnUniqueHitCount == 0,
            "reset must clear return waypoint and both hit ledgers");
        telemetry.Reset();
        Require(telemetry.BeginAttemptCount == 0 && telemetry.OutboundHitCount == 0 && telemetry.LastSelectedCandidateIndex == -1,
            "Return Compass telemetry reset failed");

        Console.WriteLine("PASS Return Compass Needle: outbound line + MARKED-priority bent return + separate hit ledgers + fallback + fail-closed");
        return 0;
    }
}
